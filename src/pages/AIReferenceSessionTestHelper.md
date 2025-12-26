# AI Reference Session Testing Guide

## Accessing the AI Reference Session Page

The AI Reference Session page is a public page (no authentication required) that referees access via a unique token link.

### Test URL Format

```
/ai-reference/:token
```

### Getting a Test Token

To test the AI Reference Session page:

1. **Navigate to Background Checks** (`/background-checks`)
2. **Create or view a background check** that includes a reference check
3. **View the referees** associated with that background check
4. **Copy the referee's token** from the referee details
5. **Access the page** using `/ai-reference/{token}`

### Mock Data Initialization

On app startup, `initializeAISessionTestData()` automatically:
- Creates AI sessions for the first 5 referees in the system
- Alternates between video and phone interview modes
- Creates a mix of scheduled, in-progress, and completed sessions
- Links each AI session to its corresponding referee

### Testing Different Scenarios

The mock data includes:

#### Scheduled Session (Referee #1)
- Status: `scheduled`
- Mode: `video`
- Ready to start the interview

#### In-Progress Session (Referee #2)  
- Status: `in-progress`
- Mode: `phone`
- Can resume or continue

#### Completed Sessions (Referees #3-5)
- Status: `completed`
- Various modes
- Should show "already completed" error

### Manual Token Creation

To manually create a test session with a specific token:

```typescript
import { v4 as uuidv4 } from 'uuid';
import { createReferee } from '@/lib/backgroundChecks/referenceCheckService';
import { generateMockAISession } from '@/lib/backgroundChecks/mockAISessionData';
import { saveAISession } from '@/lib/backgroundChecks/aiReferenceCheckStorage';

// Create referee with custom token
const customToken = 'test-token-123';
const referee = createReferee('candidate-id', 'bg-check-id', {
  name: 'John Doe',
  email: 'john@example.com',
  relationship: 'manager'
});

// Update with custom token (normally auto-generated)
// Note: This requires direct localStorage manipulation in dev mode

// Create AI session
const aiSession = generateMockAISession(
  referee.id,
  'candidate-id',
  'bg-check-id',
  'video',
  'scheduled'
);

saveAISession(aiSession);
```

Then access: `/ai-reference/test-token-123`

### Expected Behavior

#### Valid Token (Scheduled Session)
1. ✅ Token validates successfully
2. ✅ Session details display (mode, duration, referee name)
3. ✅ System checks run (camera, microphone permissions)
4. ✅ Privacy consent checkboxes appear
5. ✅ "Start Interview" button enables when all requirements met

#### Invalid/Expired Token
1. ❌ Shows "Session Unavailable" error
2. ❌ Displays specific error message (invalid, expired, completed, cancelled)
3. ❌ Shows support contact information

#### Permission Denied
1. ⚠️ Shows red X next to camera/microphone checks
2. ⚠️ "Retry" button allows re-checking permissions
3. ⚠️ "Start Interview" button remains disabled

### Browser Requirements

The page checks for:
- `navigator.mediaDevices.getUserMedia` support
- `RTCPeerConnection` support (for future WebRTC integration)
- Modern browser (Chrome, Firefox, Safari recommended)

### Next Steps After Landing Page

When "Start Interview" is clicked:
- Session status updates to `in-progress`
- Navigates to `/ai-reference/{token}/video` (for video mode)
- Navigates to `/ai-reference/{token}/phone` (for phone mode)

These interview interface pages will be implemented in Phase 4.
