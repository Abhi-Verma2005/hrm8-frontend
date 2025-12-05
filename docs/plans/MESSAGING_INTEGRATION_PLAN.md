# Messages Page - End-to-End Integration Plan

## Executive Summary

This document outlines the comprehensive plan for implementing a complete messaging system in the HRM8 candidate portal, including:
- In-app conversations with employers
- Communication with HRM8 consultants
- Email bridge for syncing email replies into the dashboard

## Current State Analysis

### ✅ Existing Infrastructure

1. **WebSocket Real-time Communication**
   - WebSocket server implemented (`hrm8-backend/src/websocket.ts`)
   - WebSocket context provider (`hrm8-frontend/src/contexts/WebSocketContext.tsx`)
   - Real-time message delivery working
   - Connection management with exponential backoff

2. **Database Models**
   - `Conversation` model exists with:
     - `jobId`, `candidateId`, `participants[]`, `lastMessageId`
   - `Message` model exists with:
     - `conversationId`, `senderEmail`, `senderType` (USER/CANDIDATE/SYSTEM)
     - `content`, `type` (TEXT/SYSTEM/APPLICATION_SUBMITTED)
     - `isRead`, `readAt`

3. **Backend API**
   - `GET /api/conversations` - List conversations
   - `GET /api/conversations/:id` - Get conversation details
   - `GET /api/conversations/:id/messages` - Get messages
   - WebSocket endpoints for real-time messaging

4. **Frontend Components**
   - `MessagesPage.tsx` - List view of conversations
   - `ConversationPage.tsx` - Individual conversation view
   - `ConversationList.tsx` - Sidebar conversation list
   - `MessageList.tsx` - Message display component
   - `MessageInput.tsx` - Message input component
   - `ConversationHeader.tsx` - Conversation header

5. **Authentication**
   - Supports both `USER` (employers/HRM8 staff) and `CANDIDATE` authentication
   - Participant-based access control

### ❌ Missing Features

1. **Employer Conversations**
   - No explicit employer identification in conversations
   - Participants array uses emails, but no employer metadata
   - No way to distinguish between different employers

2. **HRM8 Consultant Integration**
   - Consultants exist in the system but not linked to conversations
   - No consultant-specific conversation views
   - No consultant assignment to conversations

3. **Email Bridge**
   - No email integration for syncing replies
   - No email-to-message conversion
   - No email notification system for conversations
   - No email threading support

## Integration Plan

### Phase 1: Enhance Conversation Model (Backend)

#### 1.1 Database Schema Updates

**File: `hrm8-backend/prisma/schema.prisma`**

```prisma
model Conversation {
  id            String   @id @default(uuid())
  jobId         String   @map("job_id")
  candidateId   String   @map("candidate_id")
  employerId    String?  @map("employer_id")  // NEW: Link to employer
  consultantId  String?  @map("consultant_id")  // NEW: Link to HRM8 consultant
  participants  String[] // Array of email addresses
  lastMessageId String?  @map("last_message_id")
  
  // Email bridge fields
  emailThreadId String?  @map("email_thread_id")  // NEW: For email threading
  emailSubject  String?  @map("email_subject")    // NEW: Email subject line
  isEmailBridge Boolean  @default(false) @map("is_email_bridge")  // NEW: Flag for email conversations
  
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  job           Job      @relation(fields: [jobId], references: [id])
  candidate     Candidate @relation(fields: [candidateId], references: [id])
  employer      Company? @relation(fields: [employerId], references: [id])  // NEW
  consultant    Consultant? @relation(fields: [consultantId], references: [id])  // NEW
  messages      Message[]
  
  @@unique([jobId, candidateId])
  @@index([employerId])
  @@index([consultantId])
  @@index([candidateId])
  @@map("conversations")
}

model Message {
  id            String   @id @default(uuid())
  conversationId String   @map("conversation_id")
  senderEmail   String   @map("sender_email")
  senderType    MessageSenderType @map("sender_type")
  senderId      String?  @map("sender_id")
  
  // Email bridge fields
  emailMessageId String?  @map("email_message_id")  // NEW: Original email ID
  emailThreadId  String?  @map("email_thread_id")   // NEW: Email thread ID
  isFromEmail    Boolean  @default(false) @map("is_from_email")  // NEW: Flag if from email
  
  content       String   @db.Text
  type          MessageType @default(TEXT)
  isRead        Boolean  @default(false) @map("is_read")
  readAt        DateTime? @map("read_at")
  
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  conversation  Conversation @relation(fields: [conversationId], references: [id])
  
  @@index([conversationId])
  @@index([senderEmail])
  @@index([emailThreadId])  // NEW
  @@map("messages")
}

// NEW: Email Sync Log for tracking email synchronization
model EmailSyncLog {
  id            String   @id @default(uuid())
  conversationId String   @map("conversation_id")
  emailProvider String   @map("email_provider")  // Gmail, Outlook, etc.
  emailMessageId String  @map("email_message_id")
  syncDirection String   @map("sync_direction")  // INBOUND, OUTBOUND
  status        String   // SUCCESS, FAILED, PENDING
  errorMessage  String?  @map("error_message") @db.Text
  syncedAt      DateTime @default(now()) @map("synced_at")
  
  conversation  Conversation @relation(fields: [conversationId], references: [id])
  
  @@index([conversationId])
  @@index([emailMessageId])
  @@map("email_sync_logs")
}
```

#### 1.2 Update Conversation Model

**File: `hrm8-backend/src/models/Conversation.ts`**

- Add methods to find conversations by employer
- Add methods to find conversations by consultant
- Add methods to create conversations with employer/consultant
- Update participant management

#### 1.3 Update Message Model

**File: `hrm8-backend/src/models/Message.ts`**

- Add email-related fields support
- Add methods to find messages by email thread
- Add email message creation methods

### Phase 2: Employer Conversation Integration

#### 2.1 Backend API Enhancements

**File: `hrm8-backend/src/controllers/conversation/ConversationController.ts`**

**New Endpoints:**
- `POST /api/conversations` - Create conversation with employer
- `GET /api/conversations/employer/:employerId` - Get conversations for employer
- `GET /api/conversations/candidate/:candidateId` - Get conversations for candidate (enhanced)

**Enhancements:**
- Include employer details in conversation responses
- Include consultant details in conversation responses
- Filter conversations by employer/consultant

#### 2.2 Frontend Service Updates

**File: `hrm8-frontend/src/lib/messagingService.ts`**

Add methods:
- `createConversationWithEmployer(jobId, candidateId, employerId)`
- `getEmployerConversations(employerId)`
- `getConsultantConversations(consultantId)`

#### 2.3 Frontend UI Updates

**File: `hrm8-frontend/src/pages/candidate/MessagesPage.tsx`**

- Add filter tabs: "All", "Employers", "HRM8 Consultants"
- Show employer/consultant badges in conversation list
- Display employer/consultant names in conversation headers

**File: `hrm8-frontend/src/components/messages/ConversationList.tsx`**

- Add employer/consultant avatars
- Show employer/consultant names
- Add conversation type indicators

**File: `hrm8-frontend/src/components/messages/ConversationHeader.tsx`**

- Display employer/consultant information
- Show job details
- Add contact information

### Phase 3: HRM8 Consultant Integration

#### 3.1 Backend Service

**New File: `hrm8-backend/src/services/conversation/ConsultantConversationService.ts`**

```typescript
export class ConsultantConversationService {
  // Assign consultant to conversation
  static async assignConsultant(conversationId: string, consultantId: string)
  
  // Get conversations for consultant
  static async getConsultantConversations(consultantId: string)
  
  // Get available consultants for assignment
  static async getAvailableConsultants(jobId: string)
  
  // Transfer conversation between consultants
  static async transferConversation(conversationId: string, fromConsultantId: string, toConsultantId: string)
}
```

#### 3.2 Backend API

**File: `hrm8-backend/src/controllers/conversation/ConversationController.ts`**

**New Endpoints:**
- `POST /api/conversations/:id/assign-consultant` - Assign consultant
- `GET /api/conversations/consultant/:consultantId` - Get consultant conversations
- `POST /api/conversations/:id/transfer` - Transfer conversation

#### 3.3 Frontend Updates

**File: `hrm8-frontend/src/pages/candidate/MessagesPage.tsx`**

- Show consultant conversations separately
- Display consultant profile information
- Add consultant assignment UI (if candidate can request)

**File: `hrm8-frontend/src/components/messages/ConversationHeader.tsx`**

- Show consultant details
- Display consultant availability status
- Add consultant contact information

### Phase 4: Email Bridge Integration

#### 4.1 Email Service Backend

**New File: `hrm8-backend/src/services/email/EmailBridgeService.ts`**

```typescript
export class EmailBridgeService {
  // Connect email account (OAuth)
  static async connectEmailAccount(userId: string, provider: 'gmail' | 'outlook', tokens: OAuthTokens)
  
  // Sync emails for conversation
  static async syncConversationEmails(conversationId: string)
  
  // Convert email to message
  static async convertEmailToMessage(email: EmailMessage, conversationId: string)
  
  // Send message as email
  static async sendMessageAsEmail(messageId: string, recipientEmail: string)
  
  // Create conversation from email thread
  static async createConversationFromEmail(email: EmailMessage, jobId: string, candidateId: string)
  
  // Get email thread for conversation
  static async getEmailThread(conversationId: string)
}
```

#### 4.2 Email Provider Integrations

**New Files:**
- `hrm8-backend/src/services/email/providers/GmailProvider.ts`
- `hrm8-backend/src/services/email/providers/OutlookProvider.ts`

**Features:**
- OAuth 2.0 authentication
- Email fetching via IMAP/API
- Email sending via SMTP/API
- Thread detection
- Email parsing (HTML to text)

#### 4.3 Email Sync Worker

**New File: `hrm8-backend/src/workers/EmailSyncWorker.ts`**

```typescript
export class EmailSyncWorker {
  // Poll email accounts for new messages
  static async pollEmailAccounts()
  
  // Process incoming email
  static async processIncomingEmail(email: EmailMessage)
  
  // Match email to conversation
  static async matchEmailToConversation(email: EmailMessage)
  
  // Sync outbound messages to email
  static async syncOutboundMessages()
}
```

#### 4.4 Backend API

**New File: `hrm8-backend/src/routes/emailBridge.ts`**

```typescript
// Email account management
POST   /api/email-bridge/connect
DELETE /api/email-bridge/disconnect
GET    /api/email-bridge/status

// Email sync
POST   /api/email-bridge/sync/:conversationId
GET    /api/email-bridge/thread/:conversationId

// Email settings
GET    /api/email-bridge/settings
PUT    /api/email-bridge/settings
```

#### 4.5 Frontend Email Bridge UI

**New File: `hrm8-frontend/src/components/messages/EmailBridgeSettings.tsx`**

- Connect/disconnect email accounts
- Email sync status
- Email notification preferences
- Email threading display

**File: `hrm8-frontend/src/components/messages/MessageList.tsx`**

- Show email indicators
- Display email metadata (subject, from, date)
- Show email thread view
- Link to original email

**File: `hrm8-frontend/src/components/messages/MessageInput.tsx`**

- Option to send as email
- Email template selection
- Email formatting options

### Phase 5: Notification System

#### 5.1 Email Notifications

**File: `hrm8-backend/src/services/notification/ConversationNotificationService.ts`**

```typescript
export class ConversationNotificationService {
  // Send email notification for new message
  static async notifyNewMessage(conversationId: string, messageId: string)
  
  // Send email notification for conversation assignment
  static async notifyConversationAssignment(conversationId: string, consultantId: string)
  
  // Send email digest (daily/weekly)
  static async sendConversationDigest(userId: string, period: 'daily' | 'weekly')
}
```

#### 5.2 In-App Notifications

**File: `hrm8-frontend/src/components/notifications/ConversationNotification.tsx`**

- Real-time notification badges
- Notification center
- Notification preferences

### Phase 6: Testing & Quality Assurance

#### 6.1 Unit Tests
- Conversation model tests
- Message model tests
- Email bridge service tests
- Notification service tests

#### 6.2 Integration Tests
- WebSocket message flow
- Email sync flow
- Conversation creation flow
- Consultant assignment flow

#### 6.3 E2E Tests
- Complete conversation flow
- Email bridge sync
- Multi-participant conversations
- Consultant handoff

## Implementation Timeline

### Week 1-2: Phase 1 - Database & Model Updates
- Update Prisma schema
- Run migrations
- Update Conversation and Message models
- Update backend controllers

### Week 3-4: Phase 2 - Employer Integration
- Backend API enhancements
- Frontend service updates
- UI component updates
- Testing

### Week 5-6: Phase 3 - Consultant Integration
- Consultant conversation service
- Backend API endpoints
- Frontend UI updates
- Testing

### Week 7-9: Phase 4 - Email Bridge
- Email provider integrations (Gmail, Outlook)
- Email bridge service
- Email sync worker
- Frontend UI
- Testing

### Week 10: Phase 5 - Notifications
- Notification service
- Email notifications
- In-app notifications
- Testing

### Week 11: Phase 6 - Testing & QA
- Comprehensive testing
- Bug fixes
- Performance optimization
- Documentation

## Technical Considerations

### Security
- OAuth 2.0 for email account connections
- Encrypted storage of email tokens
- Rate limiting for email sync
- Access control for conversations

### Performance
- Email sync batching
- WebSocket connection pooling
- Message pagination
- Caching conversation metadata

### Scalability
- Queue system for email processing
- Background workers for email sync
- Database indexing for queries
- CDN for message attachments

## Success Metrics

1. **Functionality**
   - 100% of conversations support employer/consultant identification
   - Email sync accuracy > 99%
   - Real-time message delivery < 1 second

2. **User Experience**
   - Conversation load time < 500ms
   - Email sync completion < 30 seconds
   - User satisfaction score > 4.5/5

3. **Reliability**
   - System uptime > 99.9%
   - Email sync success rate > 99%
   - Message delivery success rate > 99.9%

## Dependencies

### External Services
- Gmail API (OAuth 2.0)
- Microsoft Graph API (Outlook)
- Email service provider (SendGrid/AWS SES)

### Internal Services
- WebSocket server
- Database (PostgreSQL)
- Authentication service
- Notification service

## Risk Mitigation

1. **Email Provider Rate Limits**
   - Implement exponential backoff
   - Queue email sync requests
   - Cache email data

2. **OAuth Token Expiration**
   - Automatic token refresh
   - User notification for re-authentication
   - Graceful degradation

3. **Email Thread Matching**
   - Multiple matching strategies
   - Manual thread linking option
   - Fallback to conversation search

## Next Steps

1. Review and approve this plan
2. Set up development environment
3. Create feature branches
4. Begin Phase 1 implementation
5. Weekly progress reviews

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Author:** Development Team  
**Status:** Draft - Pending Approval

