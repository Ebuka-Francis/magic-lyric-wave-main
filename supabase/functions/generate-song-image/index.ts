import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, genre } = await req.json()
    console.log('Generating image for song:', title, genre)

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured')
    }

    // Generate a descriptive prompt for the album cover
    const prompt = `Create a professional album cover artwork for a ${genre} song titled "${title}". Modern, vibrant, abstract, high quality, music themed, artistic.`

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      })
    })

    const data = await response.json()
    const imageBase64 = data.choices?.[0]?.message?.images?.[0]?.image_url?.url

    if (!imageBase64) {
      throw new Error('Failed to generate image')
    }

    console.log('Image generated successfully')

    return new Response(JSON.stringify({ 
      imageUrl: imageBase64,
      message: "Album cover generated successfully!"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ 
      error: 'Failed to generate image',
      details: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
