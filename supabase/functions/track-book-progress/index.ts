
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    // Get the request body
    const { bookId, userIp, progress, position } = await req.json()
    
    // Validate required fields
    if (!bookId || !userIp) {
      return new Response(
        JSON.stringify({ error: 'Book ID and user IP are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Upsert progress record
    const { data, error } = await supabase
      .from('book_progress')
      .upsert(
        { 
          book_id: bookId,
          user_ip: userIp,
          progress_percent: progress || 0,
          last_position: position || '',
          updated_at: new Date().toISOString()
        },
        { onConflict: 'book_id,user_ip' }
      )
      .select()
    
    if (error) throw error
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
