import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PerformanceData {
  consultantName: string;
  period: string;
  categories: Array<{
    name: string;
    score: number;
    feedback: string;
  }>;
  metrics: {
    placements: number;
    successRate: number;
    clientSatisfaction: number;
    hoursWorked: number;
    responseTime: number;
  };
  workloadHistory: Array<{
    week: string;
    utilization: number;
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { performanceData }: { performanceData: PerformanceData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Construct detailed prompt for AI analysis
    const prompt = `You are an expert HR consultant specializing in performance analysis and talent development. Analyze the following performance data and provide comprehensive, actionable insights.

Consultant: ${performanceData.consultantName}
Review Period: ${performanceData.period}

Performance Categories:
${performanceData.categories.map(cat => `- ${cat.name}: ${cat.score}/100 - ${cat.feedback}`).join('\n')}

Key Metrics:
- Total Placements: ${performanceData.metrics.placements}
- Success Rate: ${performanceData.metrics.successRate}%
- Client Satisfaction: ${performanceData.metrics.clientSatisfaction}/5.0
- Average Hours Worked: ${performanceData.metrics.hoursWorked}h/week
- Avg Response Time: ${performanceData.metrics.responseTime}h

Recent Workload Trend:
${performanceData.workloadHistory.map(w => `${w.week}: ${w.utilization}%`).join('\n')}

Please provide:
1. Overall performance assessment (2-3 sentences)
2. Key strengths and patterns observed
3. Potential concerns or risk factors
4. Specific, actionable recommendations for improvement
5. Suggestions for career development opportunities

Keep the response concise (under 250 words) but highly actionable and specific to this consultant's data.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert HR consultant providing data-driven performance insights. Be specific, actionable, and constructive."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please check your Lovable workspace usage." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      throw new Error(`AI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const insights = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ insights }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating insights:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to generate insights" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
