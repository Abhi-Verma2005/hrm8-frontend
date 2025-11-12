import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      sessionId,
      candidateId, 
      candidateName, 
      refereeInfo, 
      sessionDetails,
      transcript, 
      existingAnalysis 
    } = await req.json();

    console.log('Generating reference summary for session:', sessionId);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Prepare transcript text
    const transcriptText = transcript
      .map((turn: any) => `${turn.speaker === 'ai-recruiter' ? 'AI Recruiter' : 'Referee'}: ${turn.text}`)
      .join('\n\n');

    // System prompt for reference check analysis
    const systemPrompt = `You are an expert HR analyst reviewing reference check interview transcripts.
Your task is to analyze the conversation and provide a comprehensive, objective assessment.

Focus on these key areas:
- Work performance and achievements
- Interpersonal skills and communication
- Reliability and dependability
- Growth potential and learning ability
- Cultural fit and team dynamics
- Technical abilities and expertise
- Leadership qualities (if applicable)
- Any concerns or red flags

Provide specific evidence from the transcript to support all assessments.
Identify both strengths and concerns fairly and objectively.
Flag any statements that require verification or raise concerns.`;

    const userPrompt = `Analyze this reference check interview for candidate "${candidateName}".

REFEREE INFORMATION:
- Name: ${refereeInfo.name}
- Relationship: ${refereeInfo.relationship}
- Company: ${refereeInfo.companyName}
${refereeInfo.yearsKnown ? `- Years Known: ${refereeInfo.yearsKnown}` : ''}

INTERVIEW TRANSCRIPT:
${transcriptText}

EXISTING AI ANALYSIS (for context):
- Overall Rating: ${existingAnalysis.overallRating}/5
- Sentiment: ${existingAnalysis.sentiment}
- Key Insights: ${existingAnalysis.keyInsights.join(', ')}
- Recommendation Score: ${existingAnalysis.recommendationScore}/100

Please provide a detailed analysis.`;

    // Call Lovable AI with tool calling for structured output
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_reference_summary',
              description: 'Generate a comprehensive reference check summary with structured analysis',
              parameters: {
                type: 'object',
                properties: {
                  executiveSummary: {
                    type: 'string',
                    description: 'A 2-3 paragraph executive summary of the reference check'
                  },
                  strengths: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of candidate strengths with evidence'
                  },
                  concerns: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of concerns or areas for improvement'
                  },
                  neutralObservations: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Neutral observations that provide context'
                  },
                  categoryBreakdown: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        category: { type: 'string' },
                        score: { type: 'number', minimum: 1, maximum: 5 },
                        summary: { type: 'string' },
                        evidence: { type: 'array', items: { type: 'string' } }
                      },
                      required: ['category', 'score', 'summary', 'evidence']
                    },
                    description: 'Breakdown by category (e.g., Technical Skills, Communication, Leadership)'
                  },
                  conversationHighlights: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        question: { type: 'string' },
                        answer: { type: 'string' },
                        significance: { type: 'string' },
                        timestamp: { type: 'number' }
                      },
                      required: ['question', 'answer', 'significance', 'timestamp']
                    },
                    description: 'Key moments from the conversation'
                  },
                  redFlags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        severity: { type: 'string', enum: ['critical', 'moderate', 'minor'] },
                        description: { type: 'string' },
                        evidence: { type: 'string' }
                      },
                      required: ['severity', 'description', 'evidence']
                    },
                    description: 'Any red flags or concerns identified'
                  },
                  verificationItems: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        claim: { type: 'string' },
                        verified: { type: 'boolean' },
                        notes: { type: 'string' }
                      },
                      required: ['claim', 'verified', 'notes']
                    },
                    description: 'Claims that require verification'
                  },
                  overallScore: {
                    type: 'number',
                    minimum: 0,
                    maximum: 100,
                    description: 'Overall recommendation score'
                  },
                  hiringRecommendation: {
                    type: 'string',
                    enum: ['strongly-recommend', 'recommend', 'neutral', 'concerns', 'not-recommend'],
                    description: 'Overall hiring recommendation'
                  },
                  confidenceLevel: {
                    type: 'number',
                    minimum: 0,
                    maximum: 1,
                    description: 'Confidence in this assessment (0-1)'
                  },
                  reasoningSummary: {
                    type: 'string',
                    description: 'Summary of reasoning for the recommendation'
                  }
                },
                required: [
                  'executiveSummary',
                  'strengths',
                  'concerns',
                  'neutralObservations',
                  'categoryBreakdown',
                  'conversationHighlights',
                  'redFlags',
                  'verificationItems',
                  'overallScore',
                  'hiringRecommendation',
                  'confidenceLevel',
                  'reasoningSummary'
                ]
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'generate_reference_summary' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || !toolCall.function?.arguments) {
      throw new Error('No tool call in AI response');
    }

    const analysisData = JSON.parse(toolCall.function.arguments);

    // Structure the summary response
    const summary = {
      executiveSummary: analysisData.executiveSummary,
      keyFindings: {
        strengths: analysisData.strengths,
        concerns: analysisData.concerns,
        neutralObservations: analysisData.neutralObservations,
      },
      categoryBreakdown: analysisData.categoryBreakdown,
      recommendation: {
        overallScore: analysisData.overallScore,
        hiringRecommendation: analysisData.hiringRecommendation,
        confidenceLevel: analysisData.confidenceLevel,
        reasoningSummary: analysisData.reasoningSummary,
      },
      conversationHighlights: analysisData.conversationHighlights,
      redFlags: analysisData.redFlags,
      verificationItems: analysisData.verificationItems,
    };

    return new Response(
      JSON.stringify({ summary }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in generate-reference-summary:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
