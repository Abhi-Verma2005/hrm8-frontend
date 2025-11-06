import { useParams, Link } from 'react-router-dom';
import { CertificateVerification } from '@/components/performance/CertificateVerification';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function VerifyCertificate() {
  const { code } = useParams<{ code?: string }>();

  return (
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
  );
}
