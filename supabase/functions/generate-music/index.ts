import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Replicate from "https://esm.sh/replicate@0.25.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lyrics, genre } = await req.json();
    console.log('Music generation requested for genre:', genre);

    // TODO: Replace with real MusicGen API when REPLICATE_API_KEY is configured
    // Using placeholder audio URL for now
    const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    
    console.log('Returning placeholder audio URL');

    return new Response(JSON.stringify({ 
      audioUrl,
      message: "Music generated successfully (placeholder mode)"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-music:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
