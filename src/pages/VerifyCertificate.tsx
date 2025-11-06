import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CertificateVerification } from '@/components/performance/CertificateVerification';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { verifyCertificate } from '@/lib/certificateStorage';
import type { Certificate } from '@/types/performance';

export default function VerifyCertificate() {
  const { code } = useParams<{ code?: string }>();
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    if (code) {
      const verified = verifyCertificate(code);
      if (verified) {
        setCertificate(verified);
      }
    }
  }, [code]);

  const pageTitle = certificate 
    ? `${certificate.title} - ${certificate.employeeName}` 
    : 'Certificate Verification';
  
  const pageDescription = certificate
    ? `${certificate.employeeName} earned ${certificate.title} on ${new Date(certificate.issueDate).toLocaleDateString()}`
    : 'Verify certificate authenticity and view achievement details';

  const imageUrl = '/placeholder.svg'; // Default image for social sharing

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Learning & Development System" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />
        
        {certificate && (
          <>
            <meta property="article:published_time" content={new Date(certificate.issueDate).toISOString()} />
            <meta property="og:image:alt" content={`Certificate: ${certificate.title}`} />
          </>
        )}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/performance">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Performance Dashboard
              </Button>
            </Link>
          </div>

          {/* Verification Component */}
          <CertificateVerification />

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>All certificates are issued and verified by our Learning & Development system</p>
          </div>
        </div>
      </div>
    </>
  );
}
