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

interface OfferLetterEmailProps {
  candidateName: string;
  jobTitle: string;
  salary: string;
  startDate?: string;
  companyName?: string;
}

export const OfferLetterEmail = ({
  candidateName,
  jobTitle,
  salary,
  startDate,
  companyName = 'Our Company',
}: OfferLetterEmailProps) => (
  <Html>
    <Head />
    <Preview>Congratulations! Job offer for {jobTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎉 Congratulations!</Heading>
        <Text style={text}>Dear {candidateName},</Text>
        <Text style={text}>
          We are thrilled to extend you an offer for the <strong>{jobTitle}</strong> position at {companyName}!
        </Text>
        
        <Section style={offerBox}>
          <Text style={offerLabel}>Offer Summary:</Text>
          <Hr style={hr} />
          <Text style={offerText}><strong>Position:</strong> {jobTitle}</Text>
          <Text style={offerText}><strong>Salary:</strong> {salary}</Text>
          {startDate && <Text style={offerText}><strong>Start Date:</strong> {startDate}</Text>}
        </Section>

        <Text style={text}>
          Please review the attached detailed offer letter carefully. We're excited about the possibility 
          of you joining our team and believe your skills and experience will be a great addition.
        </Text>
        <Text style={text}>
          If you have any questions about the offer, please don't hesitate to reach out. We look forward 
          to hearing from you soon!
        </Text>
        <Text style={{ ...text, marginTop: '30px' }}>
          Best regards,<br />
          The Hiring Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OfferLetterEmail;

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
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const offerBox = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  border: '2px solid #0ea5e9',
  margin: '24px 40px',
  padding: '24px',
};

const offerLabel = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const offerText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const hr = {
  borderColor: '#0ea5e9',
  margin: '16px 0',
};
