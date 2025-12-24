/**
 * Interview Configuration Drawer
 * Allows admins to configure interviews for a job round
 */

import { useState, useEffect } from "react";
import { FormDrawer } from "@/components/ui/form-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { interviewService, RatingCriterion, InterviewConfiguration } from "@/lib/api/interviewService";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";

interface InterviewConfigurationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  roundId: string;
  roundName: string;
  jobRounds?: Array<{ id: string; name: string }>; // For selecting next round on pass/fail
  onSuccess?: () => void;
}

export function InterviewConfigurationDrawer({
  open,
  onOpenChange,
  jobId,
  roundId,
  roundName,
  jobRounds = [],
  onSuccess,
}: InterviewConfigurationDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Basic Settings
  const [enabled, setEnabled] = useState(false);
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [requireBeforeProgression, setRequireBeforeProgression] = useState(false);
  const [requireAllInterviewers, setRequireAllInterviewers] = useState(false);
  
  // Interview Format
  const [interviewFormat, setInterviewFormat] = useState<'LIVE_VIDEO' | 'PHONE' | 'IN_PERSON' | 'PANEL'>('LIVE_VIDEO');
  const [defaultDuration, setDefaultDuration] = useState<number>(60);
  const [requiresInterviewer, setRequiresInterviewer] = useState(true);
  
  // Scheduling
  const [autoScheduleWindowDays, setAutoScheduleWindowDays] = useState<number>(7);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(['09:00', '10:00', '14:00', '15:00']);
  const [bufferTimeMinutes, setBufferTimeMinutes] = useState<number>(15);
  const [autoRescheduleOnNoShow, setAutoRescheduleOnNoShow] = useState(false);
  const [autoRescheduleOnCancel, setAutoRescheduleOnCancel] = useState(false);
  
  // Rating Criteria
  const [useCustomCriteria, setUseCustomCriteria] = useState(false);
  const [ratingCriteria, setRatingCriteria] = useState<RatingCriterion[]>([]);
  const [passThreshold, setPassThreshold] = useState<number | undefined>(70);
  const [scoringMethod, setScoringMethod] = useState<'AVERAGE' | 'WEIGHTED' | 'CONSENSUS'>('AVERAGE');
  
  // Automated Progression
  const [autoMoveOnPass, setAutoMoveOnPass] = useState(false);
  const [passCriteria, setPassCriteria] = useState<'SCORE_THRESHOLD' | 'RECOMMENDATION' | 'RATING_CRITERIA' | 'COMBINATION'>('SCORE_THRESHOLD');
  const [nextRoundOnPassId, setNextRoundOnPassId] = useState<string | undefined>();
  const [autoRejectOnFail, setAutoRejectOnFail] = useState(false);
  const [failCriteria, setFailCriteria] = useState<'SCORE_BELOW_THRESHOLD' | 'RECOMMENDATION_NO' | 'RATING_CRITERIA_FAIL' | 'COMBINATION'>('SCORE_BELOW_THRESHOLD');
  const [rejectRoundId, setRejectRoundId] = useState<string | undefined>();
  const [requiresManualReview, setRequiresManualReview] = useState(true);
  
  // Template
  const [agenda, setAgenda] = useState("");

  // Load existing configuration
  useEffect(() => {
    if (open && jobId && roundId) {
      loadConfiguration();
    }
  }, [open, jobId, roundId]);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      const response = await interviewService.getInterviewConfig(jobId, roundId);
      if (response.success && response.data?.config) {
        const config = response.data.config;
        setEnabled(config.enabled);
        setAutoSchedule(config.autoSchedule ?? true);
        setRequireBeforeProgression(config.requireBeforeProgression ?? false);
        setRequireAllInterviewers(config.requireAllInterviewers ?? false);
        setInterviewFormat(config.interviewFormat || 'LIVE_VIDEO');
        setDefaultDuration(config.defaultDuration || 60);
        setRequiresInterviewer(config.requiresInterviewer ?? true);
        setAutoScheduleWindowDays(config.autoScheduleWindowDays || 7);
        setAvailableTimeSlots(config.availableTimeSlots || ['09:00', '10:00', '14:00', '15:00']);
        setBufferTimeMinutes(config.bufferTimeMinutes || 15);
        setAutoRescheduleOnNoShow(config.autoRescheduleOnNoShow ?? false);
        setAutoRescheduleOnCancel(config.autoRescheduleOnCancel ?? false);
        setUseCustomCriteria(config.useCustomCriteria ?? false);
        setRatingCriteria(config.ratingCriteria || []);
        setPassThreshold(config.passThreshold);
        setScoringMethod(config.scoringMethod || 'AVERAGE');
        setAutoMoveOnPass(config.autoMoveOnPass ?? false);
        setPassCriteria(config.passCriteria || 'SCORE_THRESHOLD');
        setNextRoundOnPassId(config.nextRoundOnPassId);
        setAutoRejectOnFail(config.autoRejectOnFail ?? false);
        setFailCriteria(config.failCriteria || 'SCORE_BELOW_THRESHOLD');
        setRejectRoundId(config.rejectRoundId);
        setRequiresManualReview(config.requiresManualReview ?? true);
        setAgenda(config.agenda || "");
      } else {
        // Initialize with defaults
        resetToDefaults();
      }
    } catch (error) {
      console.error("Failed to load interview configuration:", error);
      toast.error("Failed to load interview configuration");
      resetToDefaults();
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setEnabled(false);
    setAutoSchedule(true);
    setRequireBeforeProgression(false);
    setRequireAllInterviewers(false);
    setInterviewFormat('LIVE_VIDEO');
    setDefaultDuration(60);
    setRequiresInterviewer(true);
    setAutoScheduleWindowDays(7);
    setAvailableTimeSlots(['09:00', '10:00', '14:00', '15:00']);
    setBufferTimeMinutes(15);
    setAutoRescheduleOnNoShow(false);
    setAutoRescheduleOnCancel(false);
    setUseCustomCriteria(false);
    setRatingCriteria([]);
    setPassThreshold(70);
    setScoringMethod('AVERAGE');
    setAutoMoveOnPass(false);
    setPassCriteria('SCORE_THRESHOLD');
    setNextRoundOnPassId(undefined);
    setAutoRejectOnFail(false);
    setFailCriteria('SCORE_BELOW_THRESHOLD');
    setRejectRoundId(undefined);
    setRequiresManualReview(true);
    setAgenda("");
  };

  const handleAddTimeSlot = () => {
    setAvailableTimeSlots([...availableTimeSlots, '09:00']);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setAvailableTimeSlots(availableTimeSlots.filter((_, i) => i !== index));
  };

  const handleTimeSlotChange = (index: number, value: string) => {
    const updated = [...availableTimeSlots];
    updated[index] = value;
    setAvailableTimeSlots(updated);
  };

  const handleAddRatingCriterion = () => {
    const newCriterion: RatingCriterion = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      description: "",
      weight: 0,
      threshold: 3,
    };
    setRatingCriteria([...ratingCriteria, newCriterion]);
  };

  const handleRemoveRatingCriterion = (id: string) => {
    setRatingCriteria(ratingCriteria.filter((c) => c.id !== id));
  };

  const handleRatingCriterionChange = (id: string, field: keyof RatingCriterion, value: any) => {
    setRatingCriteria(
      ratingCriteria.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const validateRatingCriteriaWeights = (): boolean => {
    if (!useCustomCriteria || ratingCriteria.length === 0) return true;
    const totalWeight = ratingCriteria.reduce((sum, c) => sum + (c.weight || 0), 0);
    return Math.abs(totalWeight - 100) < 0.01; // Allow small floating point errors
  };

  const handleSave = async () => {
    if (!validateRatingCriteriaWeights()) {
      toast.error("Rating criteria weights must sum to 100%");
      return;
    }

    setSaving(true);
    try {
      const config = {
        enabled,
        autoSchedule,
        requireBeforeProgression,
        requireAllInterviewers,
        interviewFormat,
        defaultDuration,
        requiresInterviewer,
        autoScheduleWindowDays,
        availableTimeSlots: availableTimeSlots.filter((s) => s.trim() !== ''),
        bufferTimeMinutes,
        autoRescheduleOnNoShow,
        autoRescheduleOnCancel,
        useCustomCriteria,
        ratingCriteria: useCustomCriteria && ratingCriteria.length > 0 ? ratingCriteria : undefined,
        passThreshold,
        scoringMethod,
        autoMoveOnPass,
        passCriteria: autoMoveOnPass ? passCriteria : undefined,
        nextRoundOnPassId: autoMoveOnPass ? nextRoundOnPassId : undefined,
        autoRejectOnFail,
        failCriteria: autoRejectOnFail ? failCriteria : undefined,
        rejectRoundId: autoRejectOnFail ? rejectRoundId : undefined,
        requiresManualReview,
        agenda: agenda || undefined,
      };

      const response = await interviewService.configureInterview(jobId, roundId, config);
      
      if (response.success) {
        toast.success("Interview configuration saved successfully");
        onSuccess?.();
        onOpenChange(false);
      } else {
        throw new Error(response.error || "Failed to save configuration");
      }
    } catch (error) {
      console.error("Failed to save interview configuration:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={`Configure Interview: ${roundName}`}
      description="Set up interview settings, scheduling, rating criteria, and automated progression"
      width="2xl"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading configuration...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Settings</CardTitle>
              <CardDescription>Enable and configure the interview for this round</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enabled">Enable Interview</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn on interview for this round
                  </p>
                </div>
                <Switch
                  id="enabled"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
              </div>

              {enabled && (
                <>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-schedule">Auto-Schedule Interview</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically schedule interview when candidate enters this round
                      </p>
                    </div>
                    <Switch
                      id="auto-schedule"
                      checked={autoSchedule}
                      onCheckedChange={setAutoSchedule}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="require-before-progression">Require Before Progression</Label>
                      <p className="text-sm text-muted-foreground">
                        Candidate must complete interview before moving to next round
                      </p>
                    </div>
                    <Switch
                      id="require-before-progression"
                      checked={requireBeforeProgression}
                      onCheckedChange={setRequireBeforeProgression}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="require-all-interviewers">Require All Interviewers Feedback</Label>
                      <p className="text-sm text-muted-foreground">
                        All interviewers must submit feedback before evaluation (for panel interviews)
                      </p>
                    </div>
                    <Switch
                      id="require-all-interviewers"
                      checked={requireAllInterviewers}
                      onCheckedChange={setRequireAllInterviewers}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {enabled && (
            <Tabs defaultValue="format" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="format">Format & Type</TabsTrigger>
                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                <TabsTrigger value="rating">Rating & Scoring</TabsTrigger>
                <TabsTrigger value="progression">Auto-Progression</TabsTrigger>
              </TabsList>

              {/* Interview Format & Type */}
              <TabsContent value="format" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interview Format</CardTitle>
                    <CardDescription>Select the type and format of interview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="interview-format">Interview Format</Label>
                      <Select value={interviewFormat} onValueChange={(value: any) => setInterviewFormat(value)}>
                        <SelectTrigger id="interview-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LIVE_VIDEO">Live Video Interview</SelectItem>
                          <SelectItem value="PHONE">Phone Interview</SelectItem>
                          <SelectItem value="IN_PERSON">In-Person Interview</SelectItem>
                          <SelectItem value="PANEL">Panel Interview</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Default Duration (Minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="15"
                          max="480"
                          value={defaultDuration}
                          onChange={(e) => setDefaultDuration(parseInt(e.target.value) || 60)}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-8">
                        <Label htmlFor="requires-interviewer">Requires Interviewer(s)</Label>
                        <Switch
                          id="requires-interviewer"
                          checked={requiresInterviewer}
                          onCheckedChange={setRequiresInterviewer}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Scheduling Settings */}
              <TabsContent value="scheduling" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Scheduling Settings</CardTitle>
                    <CardDescription>Configure automatic scheduling behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="window-days">Auto-Schedule Window (Days)</Label>
                        <Input
                          id="window-days"
                          type="number"
                          min="1"
                          max="30"
                          value={autoScheduleWindowDays}
                          onChange={(e) => setAutoScheduleWindowDays(parseInt(e.target.value) || 7)}
                        />
                        <p className="text-xs text-muted-foreground">
                          How many days ahead to schedule interviews
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="buffer-time">Buffer Time (Minutes)</Label>
                        <Input
                          id="buffer-time"
                          type="number"
                          min="0"
                          max="60"
                          value={bufferTimeMinutes}
                          onChange={(e) => setBufferTimeMinutes(parseInt(e.target.value) || 15)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Time between consecutive interviews
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Available Time Slots</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddTimeSlot}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Slot
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {availableTimeSlots.map((slot, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={slot}
                              onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveTimeSlot(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-reschedule-no-show">Auto-Reschedule on No-Show</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically reschedule if candidate doesn't show up
                          </p>
                        </div>
                        <Switch
                          id="auto-reschedule-no-show"
                          checked={autoRescheduleOnNoShow}
                          onCheckedChange={setAutoRescheduleOnNoShow}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-reschedule-cancel">Auto-Reschedule on Cancel</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically reschedule if interview is cancelled
                          </p>
                        </div>
                        <Switch
                          id="auto-reschedule-cancel"
                          checked={autoRescheduleOnCancel}
                          onCheckedChange={setAutoRescheduleOnCancel}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rating & Scoring */}
              <TabsContent value="rating" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rating Criteria & Scoring</CardTitle>
                    <CardDescription>Configure how interviews are evaluated</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="use-custom-criteria">Use Custom Rating Criteria</Label>
                        <p className="text-sm text-muted-foreground">
                          Define custom evaluation criteria or use defaults
                        </p>
                      </div>
                      <Switch
                        id="use-custom-criteria"
                        checked={useCustomCriteria}
                        onCheckedChange={setUseCustomCriteria}
                      />
                    </div>

                    {useCustomCriteria && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Rating Criteria</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAddRatingCriterion}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Criterion
                            </Button>
                          </div>

                          {ratingCriteria.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No criteria added. Click "Add Criterion" to create custom rating criteria.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {ratingCriteria.map((criterion) => {
                                const totalWeight = ratingCriteria.reduce((sum, c) => sum + (c.weight || 0), 0);
                                const isValid = Math.abs(totalWeight - 100) < 0.01;
                                return (
                                  <Card key={criterion.id}>
                                    <CardContent className="pt-6">
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <Badge variant="outline">Criterion</Badge>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveRatingCriterion(criterion.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label>Name</Label>
                                            <Input
                                              value={criterion.name}
                                              onChange={(e) => handleRatingCriterionChange(criterion.id, 'name', e.target.value)}
                                              placeholder="e.g., Technical Skills"
                                            />
                                          </div>

                                          <div className="space-y-2">
                                            <Label>Weight (%)</Label>
                                            <Input
                                              type="number"
                                              min="0"
                                              max="100"
                                              value={criterion.weight || 0}
                                              onChange={(e) => handleRatingCriterionChange(criterion.id, 'weight', parseInt(e.target.value) || 0)}
                                            />
                                          </div>
                                        </div>

                                        <div className="space-y-2">
                                          <Label>Description</Label>
                                          <Textarea
                                            value={criterion.description || ""}
                                            onChange={(e) => handleRatingCriterionChange(criterion.id, 'description', e.target.value)}
                                            placeholder="Describe what this criterion evaluates..."
                                            rows={2}
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <Label>Pass Threshold (1-5)</Label>
                                          <Input
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={criterion.threshold || 3}
                                            onChange={(e) => handleRatingCriterionChange(criterion.id, 'threshold', parseInt(e.target.value) || 3)}
                                          />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}

                              <div className="p-4 bg-muted rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Total Weight:</span>
                                  <span className={`text-sm font-bold ${Math.abs(ratingCriteria.reduce((sum, c) => sum + (c.weight || 0), 0) - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                                    {ratingCriteria.reduce((sum, c) => sum + (c.weight || 0), 0)}%
                                  </span>
                                </div>
                                {Math.abs(ratingCriteria.reduce((sum, c) => sum + (c.weight || 0), 0) - 100) >= 0.01 && (
                                  <p className="text-xs text-red-600 mt-1">
                                    Total weight must equal 100%
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pass-threshold">Pass Threshold (%)</Label>
                        <Input
                          id="pass-threshold"
                          type="number"
                          min="0"
                          max="100"
                          value={passThreshold || ""}
                          onChange={(e) => setPassThreshold(e.target.value ? parseInt(e.target.value) : undefined)}
                          placeholder="70"
                        />
                        <p className="text-xs text-muted-foreground">
                          Overall score percentage required to pass
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scoring-method">Scoring Method</Label>
                        <Select value={scoringMethod} onValueChange={(value: any) => setScoringMethod(value)}>
                          <SelectTrigger id="scoring-method">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AVERAGE">Average of Interviewers</SelectItem>
                            <SelectItem value="WEIGHTED">Weighted Average</SelectItem>
                            <SelectItem value="CONSENSUS">Consensus Required</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Automated Progression */}
              <TabsContent value="progression" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Automated Progression Rules</CardTitle>
                    <CardDescription>Automatically move candidates based on interview results</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Auto-Move on Pass */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-move-pass">Auto-Move on Pass</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically move candidate to next round when they pass
                          </p>
                        </div>
                        <Switch
                          id="auto-move-pass"
                          checked={autoMoveOnPass}
                          onCheckedChange={setAutoMoveOnPass}
                        />
                      </div>

                      {autoMoveOnPass && (
                        <div className="pl-6 space-y-4 border-l-2">
                          <div className="space-y-2">
                            <Label htmlFor="pass-criteria">Pass Criteria</Label>
                            <Select value={passCriteria} onValueChange={(value: any) => setPassCriteria(value)}>
                              <SelectTrigger id="pass-criteria">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SCORE_THRESHOLD">Score {'>='} Threshold</SelectItem>
                                <SelectItem value="RECOMMENDATION">Recommendation = Yes/Strong Yes</SelectItem>
                                <SelectItem value="RATING_CRITERIA">All Criteria {'>='} Threshold</SelectItem>
                                <SelectItem value="COMBINATION">Combination of Above</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {jobRounds.length > 0 && (
                            <div className="space-y-2">
                              <Label htmlFor="next-round-pass">Next Round on Pass</Label>
                              <Select
                                value={nextRoundOnPassId || ""}
                                onValueChange={(value) => setNextRoundOnPassId(value || undefined)}
                              >
                                <SelectTrigger id="next-round-pass">
                                  <SelectValue placeholder="Select round" />
                                </SelectTrigger>
                                <SelectContent>
                                  {jobRounds
                                    .filter((r) => r.id !== roundId)
                                    .map((round) => (
                                      <SelectItem key={round.id} value={round.id}>
                                        {round.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Auto-Reject on Fail */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-reject-fail">Auto-Reject on Fail</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically reject candidate when they fail
                          </p>
                        </div>
                        <Switch
                          id="auto-reject-fail"
                          checked={autoRejectOnFail}
                          onCheckedChange={setAutoRejectOnFail}
                        />
                      </div>

                      {autoRejectOnFail && (
                        <div className="pl-6 space-y-4 border-l-2">
                          <div className="space-y-2">
                            <Label htmlFor="fail-criteria">Fail Criteria</Label>
                            <Select value={failCriteria} onValueChange={(value: any) => setFailCriteria(value)}>
                              <SelectTrigger id="fail-criteria">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SCORE_BELOW_THRESHOLD">Score {'<'} Threshold</SelectItem>
                                <SelectItem value="RECOMMENDATION_NO">Recommendation = No/Strong No</SelectItem>
                                <SelectItem value="RATING_CRITERIA_FAIL">Any Criterion {'<'} Threshold</SelectItem>
                                <SelectItem value="COMBINATION">Combination of Above</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {jobRounds.length > 0 && (
                            <div className="space-y-2">
                              <Label htmlFor="reject-round">Reject Round</Label>
                              <Select
                                value={rejectRoundId || ""}
                                onValueChange={(value) => setRejectRoundId(value || undefined)}
                              >
                                <SelectTrigger id="reject-round">
                                  <SelectValue placeholder="Select reject round" />
                                </SelectTrigger>
                                <SelectContent>
                                  {jobRounds.map((round) => (
                                    <SelectItem key={round.id} value={round.id}>
                                      {round.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requires-manual-review">Requires Manual Review</Label>
                        <p className="text-sm text-muted-foreground">
                          Require recruiter review before progression (if auto-rules don't apply)
                        </p>
                      </div>
                      <Switch
                        id="requires-manual-review"
                        checked={requiresManualReview}
                        onCheckedChange={setRequiresManualReview}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Interview Agenda */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interview Agenda</CardTitle>
                    <CardDescription>Optional agenda or instructions for interviewers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={agenda}
                      onChange={(e) => setAgenda(e.target.value)}
                      placeholder="Enter interview agenda, topics to cover, or instructions for interviewers..."
                      rows={6}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || loading}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>
      )}
    </FormDrawer>
  );
}

