import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getABTests, createABTest, startABTest, completeABTest, deleteABTest, recordABTestResult, type ABTest } from "@/lib/abTesting";
import { getOnboardingWorkflows } from "@/lib/onboardingStorage";
import { toast } from "sonner";
import { FlaskConical, Play, StopCircle, Trophy, Trash2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ABTestingManager() {
  const [tests, setTests] = useState<ABTest[]>(getABTests());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [testName, setTestName] = useState("");
  const [variantAName, setVariantAName] = useState("Variant A");
  const [variantAType, setVariantAType] = useState("welcome");
  const [variantAMessage, setVariantAMessage] = useState("");
  const [variantBName, setVariantBName] = useState("Variant B");
  const [variantBType, setVariantBType] = useState("welcome");
  const [variantBMessage, setVariantBMessage] = useState("");

  const workflows = useMemo(() => getOnboardingWorkflows(), []);

  const refreshTests = () => {
    setTests(getABTests());
  };

  const handleCreateTest = () => {
    if (!testName.trim() || !variantAMessage.trim() || !variantBMessage.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newTest = createABTest({
      name: testName,
      variantA: {
        name: variantAName,
        emailType: variantAType,
        message: variantAMessage,
      },
      variantB: {
        name: variantBName,
        emailType: variantBType,
        message: variantBMessage,
      },
      targetRecipients: workflows.map(w => w.id),
      startDate: new Date(),
    });

    toast.success("A/B test created successfully");
    setShowCreateDialog(false);
    resetForm();
    refreshTests();
  };

  const resetForm = () => {
    setTestName("");
    setVariantAName("Variant A");
    setVariantAType("welcome");
    setVariantAMessage("");
    setVariantBName("Variant B");
    setVariantBType("welcome");
    setVariantBMessage("");
  };

  const handleStartTest = (testId: string) => {
    startABTest(testId);
    toast.success("A/B test started");
    refreshTests();
  };

  const handleCompleteTest = (testId: string) => {
    completeABTest(testId);
    toast.success("A/B test completed");
    refreshTests();
  };

  const handleDeleteTest = (testId: string) => {
    deleteABTest(testId);
    toast.success("A/B test deleted");
    refreshTests();
  };

  const simulateTestResults = (testId: string) => {
    // Simulate some engagement for demo purposes
    const variants = ['A', 'B'] as const;
    variants.forEach(variant => {
      recordABTestResult(testId, variant, 'sent');
      recordABTestResult(testId, variant, 'sent');
      recordABTestResult(testId, variant, 'sent');
      recordABTestResult(testId, variant, 'delivered');
      recordABTestResult(testId, variant, 'delivered');
      recordABTestResult(testId, variant, 'delivered');
      
      const openRate = Math.random();
      if (openRate > 0.3) recordABTestResult(testId, variant, 'opened');
      if (openRate > 0.5) recordABTestResult(testId, variant, 'opened');
      
      if (Math.random() > 0.7) recordABTestResult(testId, variant, 'clicked');
    });
    
    toast.success("Test results simulated");
    refreshTests();
  };

  const getStatusBadge = (status: ABTest['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'running':
        return <Badge className="bg-blue-600">Running</Badge>;
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
    }
  };

  const getWinnerBadge = (winner?: 'A' | 'B' | 'tie') => {
    if (!winner) return null;
    if (winner === 'tie') return <Badge variant="secondary">Tie</Badge>;
    return <Badge className="bg-yellow-600"><Trophy className="h-3 w-3 mr-1" />Variant {winner} Wins!</Badge>;
  };

  const calculateRate = (numerator: number, denominator: number) => {
    return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            A/B Testing
          </h3>
          <p className="text-sm text-muted-foreground">
            Compare email variants to optimize engagement
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New A/B Test
        </Button>
      </div>

      {/* Tests List */}
      {tests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FlaskConical className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No A/B tests yet.<br />
              Create your first test to optimize email performance.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tests.map(test => {
            const aOpenRate = calculateRate(test.results.variantA.opened, test.results.variantA.sent);
            const bOpenRate = calculateRate(test.results.variantB.opened, test.results.variantB.sent);
            const aClickRate = calculateRate(test.results.variantA.clicked, test.results.variantA.sent);
            const bClickRate = calculateRate(test.results.variantB.clicked, test.results.variantB.sent);

            return (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {test.name}
                        {getStatusBadge(test.status)}
                        {getWinnerBadge(test.winner)}
                      </CardTitle>
                      <CardDescription>
                        Started {test.startDate.toLocaleDateString()}
                        {test.endDate && ` • Ended ${test.endDate.toLocaleDateString()}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {test.status === 'draft' && (
                        <Button size="sm" onClick={() => handleStartTest(test.id)}>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                      {test.status === 'running' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => simulateTestResults(test.id)}>
                            Simulate Results
                          </Button>
                          <Button size="sm" onClick={() => handleCompleteTest(test.id)}>
                            <StopCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteTest(test.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Variant A */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{test.variantA.name}</h4>
                        {test.winner === 'A' && <Trophy className="h-5 w-5 text-yellow-600" />}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {test.variantA.message}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Sent</p>
                          <p className="font-semibold">{test.results.variantA.sent}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Delivered</p>
                          <p className="font-semibold">{test.results.variantA.delivered}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Open Rate</p>
                          <p className="font-semibold text-blue-600">{aOpenRate}%</p>
                          <Progress value={aOpenRate} className="h-1 mt-1" />
                        </div>
                        <div>
                          <p className="text-muted-foreground">Click Rate</p>
                          <p className="font-semibold text-purple-600">{aClickRate}%</p>
                          <Progress value={aClickRate} className="h-1 mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Variant B */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{test.variantB.name}</h4>
                        {test.winner === 'B' && <Trophy className="h-5 w-5 text-yellow-600" />}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {test.variantB.message}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Sent</p>
                          <p className="font-semibold">{test.results.variantB.sent}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Delivered</p>
                          <p className="font-semibold">{test.results.variantB.delivered}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Open Rate</p>
                          <p className="font-semibold text-blue-600">{bOpenRate}%</p>
                          <Progress value={bOpenRate} className="h-1 mt-1" />
                        </div>
                        <div>
                          <p className="text-muted-foreground">Click Rate</p>
                          <p className="font-semibold text-purple-600">{bClickRate}%</p>
                          <Progress value={bClickRate} className="h-1 mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Winner Analysis */}
                  {test.status === 'completed' && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-semibold mb-2">Analysis:</p>
                      <p className="text-sm text-muted-foreground">
                        {test.winner === 'A' && `${test.variantA.name} performed ${aOpenRate - bOpenRate}% better in open rate.`}
                        {test.winner === 'B' && `${test.variantB.name} performed ${bOpenRate - aOpenRate}% better in open rate.`}
                        {test.winner === 'tie' && `Both variants performed similarly (difference < 5%). Consider testing other elements.`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Test Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New A/B Test</DialogTitle>
            <DialogDescription>
              Test two email variants to see which performs better
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Test Name</Label>
              <Input
                placeholder="e.g., Welcome Email Subject Line Test"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Variant A */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Variant A</h4>
                <div className="space-y-2">
                  <Label>Variant Name</Label>
                  <Input
                    value={variantAName}
                    onChange={(e) => setVariantAName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Type</Label>
                  <Select value={variantAType} onValueChange={setVariantAType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="reminder">Task Reminder</SelectItem>
                      <SelectItem value="document">Document Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Enter email message..."
                    value={variantAMessage}
                    onChange={(e) => setVariantAMessage(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>

              {/* Variant B */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Variant B</h4>
                <div className="space-y-2">
                  <Label>Variant Name</Label>
                  <Input
                    value={variantBName}
                    onChange={(e) => setVariantBName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Type</Label>
                  <Select value={variantBType} onValueChange={setVariantBType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="reminder">Task Reminder</SelectItem>
                      <SelectItem value="document">Document Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Enter email message..."
                    value={variantBMessage}
                    onChange={(e) => setVariantBMessage(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTest}>
              Create Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
