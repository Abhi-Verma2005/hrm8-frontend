import {
  Body,
  Button,
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

interface BackgroundCheckEmailProps {
  candidateName: string;
  jobTitle: string;
  consentLink: string;
  companyName?: string;
}

export const BackgroundCheckEmail = ({
  candidateName,
  jobTitle,
  consentLink,
  companyName = 'Our Company',
}: BackgroundCheckEmailProps) => (
  <Html>
    <Head />
    <Preview>Background check required for {jobTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Background Check Required</Heading>
        <Text style={text}>Dear {candidateName},</Text>
        <Text style={text}>
          As part of our hiring process for the <strong>{jobTitle}</strong> position, 
          we need to conduct a background check.
        </Text>
        <Text style={text}>
          This is a standard procedure that helps us ensure a safe and secure workplace for all employees. 
          The background check will include verification of your employment history, education, and criminal record.
        </Text>
        
        <Section style={buttonContainer}>
          <Button style={button} href={consentLink}>
            Provide Consent & Information
          </Button>
        </Section>

        <Text style={text}>
          All information collected will be kept confidential and used solely for employment purposes 
          in accordance with applicable laws.
        </Text>
        <Text style={text}>
          If you have any questions about this process, please don't hesitate to contact us.
        </Text>
        <Text style={{ ...text, marginTop: '30px' }}>
          Best regards,<br />
          The Hiring Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default BackgroundCheckEmail;

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

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#0ea5e9',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};
