import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {
    const body = await req.json();
    const { experience_id, slot_id, user_name, user_email, user_phone, promo_code, total_price } = body;

    // Validate required fields
    if (!experience_id || !slot_id || !user_name || !user_email || !total_price) {
      throw new Error('Missing required fields');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Check if slot is still available
    const { data: slotData, error: slotError } = await supabaseClient
      .from('slots')
      .select('available_spots')
      .eq('id', slot_id)
      .single();

    if (slotError) throw slotError;
    
    if (!slotData || slotData.available_spots === 0) {
      throw new Error('Slot is no longer available');
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert({
        experience_id,
        slot_id,
        user_name,
        user_email,
        user_phone: user_phone || null,
        promo_code: promo_code || null,
        total_price,
        status: 'confirmed',
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Update slot availability
    const { error: updateError } = await supabaseClient
      .from('slots')
      .update({ available_spots: slotData.available_spots - 1 })
      .eq('id', slot_id);

    if (updateError) {
      console.error('Failed to update slot availability:', updateError);
    }

    return new Response(JSON.stringify(booking), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
