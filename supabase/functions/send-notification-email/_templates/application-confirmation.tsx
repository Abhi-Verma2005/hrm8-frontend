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
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ApplicationConfirmationEmailProps {
  candidateName: string;
  jobTitle: string;
  companyName?: string;
}

export const ApplicationConfirmationEmail = ({
  candidateName,
  jobTitle,
  companyName = 'Our Company',
}: ApplicationConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Thank you for applying to {jobTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Application Received</Heading>
        <Text style={text}>Dear {candidateName},</Text>
        <Text style={text}>
          Thank you for applying for the <strong>{jobTitle}</strong> position at {companyName}.
        </Text>
        <Text style={text}>
          We have received your application and our hiring team will review it carefully. 
          If your qualifications match our requirements, we will contact you to discuss the next steps.
        </Text>
        <Text style={text}>
          This process typically takes 5-10 business days. We appreciate your patience and interest in joining our team.
        </Text>
        <Text style={{ ...text, marginTop: '30px' }}>
          Best regards,<br />
          The Hiring Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ApplicationConfirmationEmail;

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
