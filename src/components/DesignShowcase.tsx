import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Search, 
  Bell, 
  Settings, 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Info,
  Download,
  Plus,
  Filter,
  Calendar
} from "lucide-react";
import logoDark from "@/assets/logo-dark.png";

import { Link } from "react-router-dom";

export function DesignShowcase() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center animate-slide-up">
          <Badge className="mb-4 bg-primary-light text-primary border-0">HRM8 Design System</Badge>
          <h1 className="mb-6">Enterprise HR Tech Design Kit</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A complete, modern design system built for ATS and HRMS platforms. 
            Vibrant, professional, and ready to scale.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="gradient" size="lg">
              <Download className="h-5 w-5" />
              Download Kit
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/components">View Components</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section id="colors" className="py-16 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8">Color System</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <ColorSwatch color="bg-primary" name="Primary" hex="#5B67F3" />
            <ColorSwatch color="bg-secondary" name="Secondary" hex="#7C7FF2" />
            <ColorSwatch color="bg-accent" name="Accent" hex="#B171E8" />
            <ColorSwatch color="bg-success" name="Success" hex="#10B981" />
            <ColorSwatch color="bg-warning" name="Warning" hex="#F59E0B" />
            <ColorSwatch color="bg-destructive" name="Error" hex="#EF4444" />
            <ColorSwatch color="bg-muted" name="Muted" hex="#F3F4F6" />
            <ColorSwatch color="bg-foreground" name="Foreground" hex="#1F2937" />
          </div>
        </div>
      </section>

      {/* Typography */}
      <section id="typography" className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8">Typography Hierarchy</h2>
          <div className="space-y-6 bg-card rounded-xl p-8 border">
            <div>
              <Badge variant="outline" className="mb-2">Display Text</Badge>
              <div className="text-display">HRM8</div>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">Hero Heading</Badge>
              <h1 className="text-hero">Transform Your Recruitment</h1>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">Section Title</Badge>
              <h2 className="text-section-title">Powerful Analytics</h2>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">Subsection Title</Badge>
              <h3 className="text-subsection">Real-time Insights</h3>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">Body Large</Badge>
              <p className="text-body-large">
                Streamline your hiring process with intelligent automation.
              </p>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">Body Text</Badge>
              <p className="text-body">
                The quick brown fox jumps over the lazy dog. This demonstrates optimal readability for paragraph text across all devices.
              </p>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">Caption & Helper Text</Badge>
              <p className="text-caption mb-2">Posted 2 hours ago</p>
              <p className="text-helper">Additional context and helper information</p>
            </div>
          </div>
        </div>
      </section>

      {/* Button Components */}
      <section id="components" className="py-16 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8">Button Variants</h2>
          <div className="grid gap-8">
            {/* Primary Buttons */}
            <div className="space-y-4">
              <h4>Primary & Variants</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="gradient">Gradient</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            {/* State Buttons */}
            <div className="space-y-4">
              <h4>State Variants</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="success">
                  <CheckCircle />
                  Success
                </Button>
                <Button variant="warning">
                  <AlertCircle />
                  Warning
                </Button>
                <Button variant="destructive">
                  <AlertCircle />
                  Destructive
                </Button>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <h4>Button Sizes</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div className="space-y-4">
              <h4>Icon Buttons</h4>
              <div className="flex flex-wrap gap-3">
                <Button size="icon-sm" variant="ghost">
                  <Plus />
                </Button>
                <Button size="icon">
                  <Filter />
                </Button>
                <Button size="icon-lg" variant="gradient">
                  <Calendar />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8">Form Elements</h2>
          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Input</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Search candidates..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="you@company.com" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Preferences</label>
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" />
                  <label htmlFor="terms" className="text-sm">Accept terms and conditions</label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="notifications" />
                  <label htmlFor="notifications" className="text-sm">Enable notifications</label>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Alerts & Notifications */}
      <section className="py-16 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8">Alerts & Status</h2>
          <div className="space-y-4">
            <Alert className="border-success bg-success-light">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertTitle className="text-success">Success!</AlertTitle>
              <AlertDescription className="text-success/90">
                Your candidate profile has been updated successfully.
              </AlertDescription>
            </Alert>
            <Alert className="border-warning bg-warning-light">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertTitle className="text-warning">Warning</AlertTitle>
              <AlertDescription className="text-warning/90">
                Your job posting will expire in 3 days.
              </AlertDescription>
            </Alert>
            <Alert className="border-primary bg-primary-light">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">Information</AlertTitle>
              <AlertDescription className="text-primary/90">
                5 new applicants match your job criteria.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8">Badges & Status Indicators</h2>
          <Card className="p-8">
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge className="bg-success text-success-foreground">Active</Badge>
              <Badge className="bg-warning text-warning-foreground">Pending</Badge>
              <Badge className="bg-primary-light text-primary border-0">New</Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8">Tabs & Navigation</h2>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <Card className="p-6">
                <h4 className="mb-2">Overview Dashboard</h4>
                <p className="text-muted-foreground">View key metrics and performance indicators.</p>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="mt-6">
              <Card className="p-6">
                <h4 className="mb-2">Analytics Dashboard</h4>
                <p className="text-muted-foreground">Deep dive into your recruitment data.</p>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="mt-6">
              <Card className="p-6">
                <h4 className="mb-2">Reports Dashboard</h4>
                <p className="text-muted-foreground">Generate and export custom reports.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8">Dashboard Cards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Users className="h-5 w-5" />}
              title="Total Candidates"
              value="2,543"
              change="+12.5%"
              trend="up"
            />
            <StatCard
              icon={<FileText className="h-5 w-5" />}
              title="Active Jobs"
              value="47"
              change="+8.2%"
              trend="up"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Applications"
              value="1,234"
              change="+23.1%"
              trend="up"
            />
            <StatCard
              icon={<CheckCircle className="h-5 w-5" />}
              title="Hired This Month"
              value="12"
              change="-2.4%"
              trend="down"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <img src={logoDark} alt="HRM8" className="h-8 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Enterprise HR Tech Design System © 2025
          </p>
        </div>
      </footer>
    </>
  );
}

function ColorSwatch({ color, name, hex }: { color: string; name: string; hex: string }) {
  return (
    <div className="space-y-2">
      <div className={`${color} h-20 rounded-lg shadow-md border`}></div>
      <div className="text-sm">
        <p className="font-medium">{name}</p>
        <p className="text-muted-foreground text-xs">{hex}</p>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  title, 
  value, 
  change, 
  trend 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  change: string; 
  trend: "up" | "down";
}) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-primary-light rounded-lg text-primary">
          {icon}
        </div>
        <Badge className={trend === "up" ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
          {change}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </Card>
  );
}