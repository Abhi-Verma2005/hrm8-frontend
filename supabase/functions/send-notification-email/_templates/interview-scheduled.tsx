import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface InterviewScheduledEmailProps {
  candidateName: string;
  jobTitle: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: string;
  meetingLink?: string;
  location?: string;
}

export const InterviewScheduledEmail = ({
  candidateName,
  jobTitle,
  interviewDate,
  interviewTime,
  interviewType,
  meetingLink,
  location,
}: InterviewScheduledEmailProps) => (
  <Html>
    <Head />
    <Preview>Your interview for {jobTitle} has been scheduled</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Interview Scheduled</Heading>
        <Text style={text}>Dear {candidateName},</Text>
        <Text style={text}>
          Great news! Your interview for the <strong>{jobTitle}</strong> position has been scheduled.
        </Text>
        
        <Section style={detailsBox}>
          <Text style={detailsLabel}>Interview Details:</Text>
          <Hr style={hr} />
          <Text style={detailsText}><strong>Date:</strong> {interviewDate}</Text>
          <Text style={detailsText}><strong>Time:</strong> {interviewTime}</Text>
          <Text style={detailsText}><strong>Type:</strong> {interviewType}</Text>
          {location && <Text style={detailsText}><strong>Location:</strong> {location}</Text>}
          {meetingLink && (
            <Text style={detailsText}>
              <strong>Meeting Link:</strong>{' '}
              <Link href={meetingLink} style={link}>
                Join Meeting
              </Link>
            </Text>
          )}
        </Section>

        <Text style={text}>
          Please join the meeting 5 minutes early and be prepared to discuss your experience and qualifications.
        </Text>
        <Text style={text}>
          If you need to reschedule, please let us know as soon as possible.
        </Text>
        <Text style={{ ...text, marginTop: '30px' }}>
          Looking forward to speaking with you!<br />
          The Hiring Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default InterviewScheduledEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const detailsBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '24px',
};

const detailsLabel = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const detailsText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '16px 0',
};
