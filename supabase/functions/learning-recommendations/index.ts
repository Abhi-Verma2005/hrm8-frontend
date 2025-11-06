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
    const { employeeData, availableCourses, goals, performanceGaps } = await req.json();

    console.log('Generating learning recommendations for employee:', employeeData.name);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context for AI
    const employeeContext = `
Employee Profile:
- Name: ${employeeData.name}
- Role: ${employeeData.role}
- Department: ${employeeData.department}
- Current Skills: ${employeeData.skills?.join(', ') || 'None listed'}
- Experience Level: ${employeeData.experienceLevel || 'Not specified'}

Current Goals:
${goals?.map((g: any) => `- ${g.title} (${g.category}, Priority: ${g.priority})`).join('\n') || 'No active goals'}

Performance Gaps:
${performanceGaps?.map((gap: any) => `- ${gap.skillName}: Current level ${gap.currentLevel}, Target level ${gap.requiredLevel}`).join('\n') || 'No identified gaps'}

Available Courses:
${availableCourses.map((course: any) => `
- ${course.title}
  Level: ${course.level}
  Category: ${course.category}
  Skills: ${course.skills.join(', ')}
  Duration: ${course.duration} hours
  Description: ${course.description}
`).join('\n')}
`;

    const systemPrompt = `You are an expert learning and development advisor. Analyze the employee's profile, goals, and performance gaps to recommend the most relevant courses from the available catalog.

Your recommendations should:
1. Prioritize courses that address performance gaps
2. Align with the employee's goals and career aspirations
3. Consider the employee's current skill level
4. Provide a clear learning path (beginner to advanced if needed)
5. Include specific reasons why each course is recommended

For each recommendation, use this exact format:
RECOMMENDATION: [Course Title]
RELEVANCE: [High/Medium/Low]
REASON: [One clear sentence explaining why this course is perfect for this employee]
IMPACT: [One sentence describing the expected benefit]
PRIORITY: [Critical/High/Medium/Low based on urgency]
---`;

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
          { role: "user", content: employeeContext },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response received, parsing recommendations...');

    // Parse the AI response into structured recommendations
    const recommendations = [];
    const blocks = aiResponse.split('---').filter((block: string) => block.trim());

    for (const block of blocks) {
      const lines = block.split('\n').map((line: string) => line.trim()).filter(Boolean);
      const rec: any = {};

      for (const line of lines) {
        if (line.startsWith('RECOMMENDATION:')) {
          rec.courseTitle = line.replace('RECOMMENDATION:', '').trim();
        } else if (line.startsWith('RELEVANCE:')) {
          rec.relevance = line.replace('RELEVANCE:', '').trim().toLowerCase();
        } else if (line.startsWith('REASON:')) {
          rec.reason = line.replace('REASON:', '').trim();
        } else if (line.startsWith('IMPACT:')) {
          rec.impact = line.replace('IMPACT:', '').trim();
        } else if (line.startsWith('PRIORITY:')) {
          rec.priority = line.replace('PRIORITY:', '').trim().toLowerCase();
        }
      }

      if (rec.courseTitle) {
        // Match with actual course
        const course = availableCourses.find((c: any) => 
          c.title.toLowerCase().includes(rec.courseTitle.toLowerCase()) ||
          rec.courseTitle.toLowerCase().includes(c.title.toLowerCase())
        );

        if (course) {
          recommendations.push({
            courseId: course.id,
            courseTitle: course.title,
            courseLevel: course.level,
            courseCategory: course.category,
            courseDuration: course.duration,
            courseSkills: course.skills,
            courseThumbnail: course.thumbnail,
            courseDescription: course.description,
            relevance: rec.relevance || 'medium',
            reason: rec.reason || 'Recommended based on your profile',
            impact: rec.impact || 'Will help develop key skills',
            priority: rec.priority || 'medium',
          });
        }
      }
    }

    // Sort by priority and relevance
    const priorityOrder: any = { critical: 4, high: 3, medium: 2, low: 1 };
    const relevanceOrder: any = { high: 3, medium: 2, low: 1 };
    
    recommendations.sort((a: any, b: any) => {
      const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
      if (priorityDiff !== 0) return priorityDiff;
      return (relevanceOrder[b.relevance] || 2) - (relevanceOrder[a.relevance] || 2);
    });

    console.log(`Generated ${recommendations.length} recommendations`);

    return new Response(
      JSON.stringify({ 
        recommendations: recommendations.slice(0, 5), // Return top 5
        summary: `Found ${recommendations.length} relevant courses based on your profile and goals.`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in learning-recommendations function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
