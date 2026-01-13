/**
 * Admin Careers Page Management
 * Allows normal admins to manage their company's public careers page
 */

import { useState, useEffect, useRef } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import {
  Building2,
  Image,
  FileText,
  Link as LinkIcon,
  Upload,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Save,
  Send,
} from 'lucide-react';

interface CareersPageData {
  id: string;
  name: string;
  website: string;
  domain: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  approved: {
    logoUrl: string | null;
    bannerUrl: string | null;
    about: string | null;
    social: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    } | null;
    images: string[] | null;
  };
  pending: {
    logoUrl?: string;
    bannerUrl?: string;
    about?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    };
    images?: string[];
  } | null;
  reviewNotes: {
    general?: string;
    logo?: { reason: string; rejectedAt: string };
    banner?: { reason: string; rejectedAt: string };
    about?: { reason: string; rejectedAt: string };
    social?: { reason: string; rejectedAt: string };
  } | null;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  PENDING: { label: 'Not Submitted', icon: Clock, color: 'bg-gray-100 text-gray-700' },
  SUBMITTED: { label: 'Under Review', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { label: 'Live', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Needs Revision', icon: XCircle, color: 'bg-red-100 text-red-700' },
};

export default function CareersPageAdmin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<'logo' | 'banner' | 'gallery' | null>(null);
  const [data, setData] = useState<CareersPageData | null>(null);

  // Form state
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [about, setAbout] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCareersPage();
  }, []);

  const loadCareersPage = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<CareersPageData>('/api/companies/careers');
      if (response.success && response.data) {
        setData(response.data);
        // Populate form with pending or approved data
        const source = response.data.pending || response.data.approved;
        setLogoUrl(source?.logoUrl || response.data.approved?.logoUrl || '');
        setBannerUrl(source?.bannerUrl || response.data.approved?.bannerUrl || '');
        setAbout(source?.about || response.data.approved?.about || '');
        setLinkedin(source?.social?.linkedin || response.data.approved?.social?.linkedin || '');
        setTwitter(source?.social?.twitter || response.data.approved?.social?.twitter || '');
        setFacebook(source?.social?.facebook || response.data.approved?.social?.facebook || '');
        setInstagram(source?.social?.instagram || response.data.approved?.social?.instagram || '');
        setImages((source?.images || response.data.approved?.images || []) as string[]);
      }
    } catch (error) {
      console.error('Failed to load careers page:', error);
      toast({
        title: 'Error',
        description: 'Failed to load careers page data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (type: 'logo' | 'banner', file: File) => {
    if (!file) return;

    setIsUploading(type);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/companies/careers/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data?.url) {
        if (type === 'logo') {
          setLogoUrl(result.data.url);
        } else {
          setBannerUrl(result.data.url);
        }
        toast({
          title: 'Uploaded',
          description: `${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully`,
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: `Failed to upload ${type}`,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(null);
    }
  };

  const handleSubmit = async (section?: string) => {
    setIsSaving(true);
    try {
      const payload: any = {
        logoUrl,
        bannerUrl,
        about,
        social: {
          linkedin: linkedin || undefined,
          twitter: twitter || undefined,
          facebook: facebook || undefined,
          instagram: instagram || undefined,
        },
        images,
      };

      if (section) {
        payload.section = section;
      }

      const response = await apiClient.put('/api/companies/careers', payload);

      if (response.success) {
        toast({
          title: 'Submitted',
          description: section
            ? `${section.charAt(0).toUpperCase() + section.slice(1)} section submitted for review`
            : 'Careers page submitted for review',
        });
        loadCareersPage();
      }
    } catch (error) {
      console.error('Failed to submit:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit for review',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardPageLayout>
        <AtsPageHeader title="Careers Page" />
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardPageLayout>
    );
  }

  const status = statusConfig[data?.status || 'PENDING'];
  const StatusIcon = status.icon;
  const isApproved = data?.status === 'APPROVED';

  return (
    <DashboardPageLayout>
      <AtsPageHeader title="Careers Page" />

      <div className="space-y-6 p-6">
        {/* Status Banner */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className={status.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
                {data?.name && <span className="text-sm text-muted-foreground">{data.name}</span>}
              </div>
              <div className="flex items-center gap-2">
                {data?.status === 'APPROVED' && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/companies/${data.id}`} target="_blank" rel="noopener noreferrer">
                      View Live Page <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                )}
                {!isApproved && (
                  <Button onClick={() => handleSubmit()} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit for Review
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rejection Alert */}
        {data?.reviewNotes?.general && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Review Feedback</AlertTitle>
            <AlertDescription>{data.reviewNotes.general}</AlertDescription>
          </Alert>
        )}

        {/* Logo Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Logo
                </CardTitle>
                <CardDescription>Upload your company logo (recommended: 200x200px)</CardDescription>
              </div>
              {isApproved && (
                <Button variant="outline" size="sm" onClick={() => handleSubmit('logo')} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Update
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 rounded-lg bg-muted border flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload('logo', e.target.files[0])}
                />
                <Button
                  variant="outline"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploading === 'logo'}
                >
                  {isUploading === 'logo' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground">Or paste a URL:</p>
                <Input
                  placeholder="https://example.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Banner Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Banner Image
                </CardTitle>
                <CardDescription>Upload a banner image (recommended: 1200x300px)</CardDescription>
              </div>
              {isApproved && (
                <Button variant="outline" size="sm" onClick={() => handleSubmit('banner')} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Update
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="h-32 rounded-lg bg-muted border flex items-center justify-center overflow-hidden bg-cover bg-center"
              style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : undefined}
            >
              {!bannerUrl && <Image className="h-12 w-12 text-muted-foreground" />}
            </div>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload('banner', e.target.files[0])}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => bannerInputRef.current?.click()}
                disabled={isUploading === 'banner'}
              >
                {isUploading === 'banner' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload Banner
              </Button>
              <Input
                placeholder="https://example.com/banner.jpg"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  About Company
                </CardTitle>
                <CardDescription>Describe your company, culture, and values</CardDescription>
              </div>
              {isApproved && (
                <Button variant="outline" size="sm" onClick={() => handleSubmit('about')} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Update
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Tell candidates about your company, mission, and what makes you a great place to work..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={6}
            />
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Social Links
                </CardTitle>
                <CardDescription>Add your company's social media profiles</CardDescription>
              </div>
              {isApproved && (
                <Button variant="outline" size="sm" onClick={() => handleSubmit('social')} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Update
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-blue-600" />
                  LinkedIn
                </Label>
                <Input
                  placeholder="https://linkedin.com/company/..."
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-blue-400" />
                  Twitter / X
                </Label>
                <Input
                  placeholder="https://twitter.com/..."
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-700" />
                  Facebook
                </Label>
                <Input
                  placeholder="https://facebook.com/..."
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  Instagram
                </Label>
                <Input
                  placeholder="https://instagram.com/..."
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Images */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Gallery Images
                </CardTitle>
                <CardDescription>Add photos of your office, team, and company culture (max 10 images)</CardDescription>
              </div>
              {isApproved && (
                <Button variant="outline" size="sm" onClick={() => handleSubmit('images')} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Update
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    className="h-32 w-full rounded-lg object-cover border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {images.length < 10 && (
                <div
                  className="h-32 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => galleryInputRef.current?.click()}
                >
                  {isUploading === 'gallery' ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground mt-1">Add Image</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files?.[0] && images.length < 10) {
                  setIsUploading('gallery');
                  try {
                    const formData = new FormData();
                    formData.append('file', e.target.files[0]);
                    formData.append('type', 'gallery');

                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                    const response = await fetch(`${apiUrl}/api/companies/careers/upload`, {
                      method: 'POST',
                      body: formData,
                      credentials: 'include',
                    });

                    if (!response.ok) {
                      const errorText = await response.text();
                      throw new Error(errorText || `Upload failed with status ${response.status}`);
                    }

                    const result = await response.json();

                    if (result.success && result.data?.url) {
                      setImages([...images, result.data.url]);
                      toast({
                        title: 'Uploaded',
                        description: 'Image added to gallery',
                      });
                    } else {
                      throw new Error(result.error || 'Upload failed');
                    }
                  } catch (error) {
                    console.error('Gallery upload failed:', error);
                    toast({
                      title: 'Upload Failed',
                      description: 'Failed to upload image',
                      variant: 'destructive',
                    });
                  } finally {
                    setIsUploading(null);
                    e.target.value = '';
                  }
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              {images.length}/10 images • Click an image to remove it
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
