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
      candidateName,
      resume,
      experience,
      skills,
      education,
      jobRequirements,
      jobDescription,
      interviewFeedback,
      weights 
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build comprehensive analysis prompt
    const systemPrompt = `You are an expert HR recruiter and talent acquisition specialist. Analyze candidate qualifications and provide detailed scoring based on weighted criteria.

Your analysis must be objective, data-driven, and consider:
1. Skills match (technical and soft skills)
2. Experience relevance and depth
3. Education background
4. Interview performance (if available)
5. Cultural fit indicators

Provide scores on a 0-100 scale for each criterion and an overall recommendation.`;

    const userPrompt = `Analyze this candidate for the position:

**Candidate:** ${candidateName}

**Job Requirements:**
${jobRequirements}

**Job Description:**
${jobDescription}

**Candidate Resume/Profile:**
${resume || 'Not provided'}

**Experience:**
${experience || 'Not provided'}

**Skills:**
${skills?.join(', ') || 'Not provided'}

**Education:**
${education || 'Not provided'}

${interviewFeedback ? `**Interview Feedback:**
${interviewFeedback}` : ''}

**Scoring Weights:**
- Skills Match: ${weights?.skills || 30}%
- Experience: ${weights?.experience || 25}%
- Education: ${weights?.education || 15}%
- Interview Performance: ${weights?.interview || 20}%
- Cultural Fit: ${weights?.culture || 10}%

Provide a comprehensive analysis with:
1. Individual scores for each criterion (0-100)
2. Weighted overall score
3. Strengths (top 3-5 points)
4. Concerns/Gaps (top 3-5 points)
5. Hiring recommendation (strong_hire, hire, maybe, no_hire, strong_no_hire)
6. Detailed justification for the recommendation
7. Specific areas for improvement or questions to explore`;

    console.log('Calling Lovable AI for candidate scoring...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_candidate_score",
              description: "Provide structured candidate scoring and recommendation",
              parameters: {
                type: "object",
                properties: {
                  scores: {
                    type: "object",
                    properties: {
                      skills: { type: "number", minimum: 0, maximum: 100 },
                      experience: { type: "number", minimum: 0, maximum: 100 },
                      education: { type: "number", minimum: 0, maximum: 100 },
                      interview: { type: "number", minimum: 0, maximum: 100 },
                      culture: { type: "number", minimum: 0, maximum: 100 },
                      overall: { type: "number", minimum: 0, maximum: 100 }
                    },
                    required: ["skills", "experience", "education", "interview", "culture", "overall"]
                  },
                  strengths: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 5
                  },
                  concerns: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 5
                  },
                  recommendation: {
                    type: "string",
                    enum: ["strong_hire", "hire", "maybe", "no_hire", "strong_no_hire"]
                  },
                  justification: { type: "string" },
                  improvementAreas: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["scores", "strengths", "concerns", "recommendation", "justification", "improvementAreas"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_candidate_score" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('No tool call in response:', JSON.stringify(data));
      throw new Error('Invalid AI response format');
    }

    const scoringResult = JSON.parse(toolCall.function.arguments);
    console.log('Scoring completed:', scoringResult.recommendation);

    return new Response(
      JSON.stringify({
        success: true,
        scoring: scoringResult,
        analyzedAt: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Error in score-candidate function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
