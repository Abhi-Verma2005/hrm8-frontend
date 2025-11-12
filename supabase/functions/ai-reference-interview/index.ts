import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  if (!OPENAI_API_KEY) {
    return new Response("OpenAI API key not configured", { status: 500 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let openAISocket: WebSocket | null = null;
  let sessionInitialized = false;

  socket.onopen = () => {
    console.log("Client connected to AI reference interview");
    
    // Connect to OpenAI Realtime API
    const model = "gpt-4o-realtime-preview-2024-12-17";
    openAISocket = new WebSocket(
      `wss://api.openai.com/v1/realtime?model=${model}`,
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "realtime=v1"
        }
      }
    );

    openAISocket.onopen = () => {
      console.log("Connected to OpenAI Realtime API");
    };

    openAISocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("OpenAI event:", data.type);

        // Initialize session configuration after connection
        if (data.type === "session.created" && !sessionInitialized) {
          sessionInitialized = true;
          
          const sessionConfig = {
            type: "session.update",
            session: {
              modalities: ["text", "audio"],
              instructions: `You are a professional AI recruiter conducting a reference check interview. 
              
Your role is to:
- Ask thoughtful, relevant questions about the candidate's professional performance
- Listen carefully to responses and ask appropriate follow-up questions
- Maintain a professional yet conversational tone
- Keep the interview focused and efficient (10-15 minutes total)
- Extract specific examples and concrete information
- Show empathy and understanding

Start by introducing yourself and explaining the purpose of the interview. Then proceed with your questions naturally, adapting based on the referee's responses.`,
              voice: "sage",
              input_audio_format: "pcm16",
              output_audio_format: "pcm16",
              input_audio_transcription: {
                model: "whisper-1"
              },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              temperature: 0.8,
              max_response_output_tokens: 4096
            }
          };

          openAISocket?.send(JSON.stringify(sessionConfig));
          console.log("Session configured");
        }

        // Forward all events to client
        socket.send(event.data);
      } catch (error) {
        console.error("Error processing OpenAI message:", error);
      }
    };

    openAISocket.onerror = (error) => {
      console.error("OpenAI WebSocket error:", error);
      socket.send(JSON.stringify({ 
        type: "error", 
        error: "Connection to AI service failed" 
      }));
    };

    openAISocket.onclose = () => {
      console.log("OpenAI connection closed");
      socket.close();
    };
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      
      // Forward client messages to OpenAI
      if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.send(event.data);
      } else {
        console.error("OpenAI socket not ready");
        socket.send(JSON.stringify({ 
          type: "error", 
          error: "AI service not connected" 
        }));
      }
    } catch (error) {
      console.error("Error processing client message:", error);
    }
  };

  socket.onclose = () => {
    console.log("Client disconnected");
    openAISocket?.close();
  };

  socket.onerror = (error) => {
    console.error("Client WebSocket error:", error);
    openAISocket?.close();
  };

  return response;
});
