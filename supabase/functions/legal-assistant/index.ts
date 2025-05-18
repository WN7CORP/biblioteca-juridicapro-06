
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMINI_API_KEY = "AIzaSyBto9zJDNJCvz76qz56oeMPOBfHhxjPTKA";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookTitle, bookArea, action, query, userIp, bookId } = await req.json();

    // Create a supabase client to store the interaction
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Create the prompt based on the requested action
    let prompt = "";
    
    if (action === "summarize") {
      prompt = `Por favor, crie um resumo abrangente e detalhado do livro "${bookTitle}" da área de "${bookArea}". 
      O resumo deve cobrir os principais conceitos, argumentos e conclusões do livro, mantendo a estrutura 
      organizada em tópicos claros e destacando os pontos mais importantes para estudantes de direito.
      
      Use formatação Markdown para melhorar a estrutura do texto, com:
      - Títulos (# e ## para hierarquia)
      - Listas com marcadores (- ou *)
      - Termos importantes em **negrito**
      - Citações relevantes com >
      
      Forneça uma estrutura clara dividida em seções como Introdução, Principais Conceitos, e Conclusão.`;
    } else if (action === "mindmap") {
      prompt = `Crie um mapa mental detalhado do livro "${bookTitle}" da área de "${bookArea}". 
      O mapa mental deve representar os principais conceitos e suas conexões, usando uma estrutura hierárquica 
      com o tema central, ramificações principais e sub-ramificações.
      
      Use formatação Markdown para criar uma representação textual estruturada:
      - Use # para o título central
      - Use ## para conceitos principais
      - Use ### para subcategorias
      - Use listas com - ou * para elementos de cada categoria
      - Destaque termos-chave com **negrito**
      
      Organize o mapa mental de forma lógica, com conexões claras entre os conceitos, de modo que um estudante de direito possa facilmente transformar em um mapa visual.`;
    } else {
      // For Q&A
      prompt = `Como assistente jurídico especialista no livro "${bookTitle}" da área de "${bookArea}", 
      por favor responda à seguinte pergunta de forma detalhada e precisa, utilizando formatação Markdown para melhor estruturar sua resposta:

      Pergunta: ${query}
      
      Sua resposta deve:
      - Usar títulos e subtítulos quando apropriado (# e ##)
      - Destacar termos jurídicos importantes em **negrito**
      - Utilizar listas para enumerar pontos quando necessário
      - Citar trechos relevantes do livro quando aplicável
      - Explicar conceitos jurídicos de forma clara e acessível`;
    }

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    });

    const data = await response.json();
    let responseText = "";
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      responseText = data.candidates[0].content.parts[0].text;
    } else {
      responseText = "Desculpe, não consegui processar sua solicitação. Por favor, tente novamente.";
    }

    // Store interaction in the database
    await supabaseClient.from('book_assistant_history').insert({
      user_ip: userIp,
      book_id: bookId,
      query: prompt,
      response: responseText,
      interaction_type: action
    });

    // Return the response
    return new Response(JSON.stringify({ 
      success: true, 
      response: responseText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
