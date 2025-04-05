
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeagueTableEntry {
  position: number
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: string[]
  logo?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Get authorization header
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'No authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Create a Supabase client with the auth header
  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    // Create client with Auth header of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    { global: { headers: { Authorization: authHeader } } }
  )

  // Create log entry for this scrape operation
  const { data: logData, error: logError } = await supabaseClient
    .from('scrape_logs')
    .insert({
      source: 'highland_league',
      status: 'started'
    })
    .select()
    .single()

  if (logError) {
    console.error('Error creating log entry:', logError)
    return new Response(JSON.stringify({ error: 'Failed to create log entry' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const logId = logData.id

  try {
    const url = 'https://highlandfootballleague.com/league-table/'
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
    }
    
    const htmlContent = await response.text()
    const $ = cheerio.load(htmlContent)
    const tableRows = $('table.sp-league-table tbody tr')
    
    const leagueTable: LeagueTableEntry[] = []
    
    tableRows.each((index, element) => {
      const cells = $(element).find('td')
      
      // Extract form icons and convert to form array
      const formCell = $(cells[10])
      const formIcons = formCell.find('i')
      const form: string[] = []
      
      formIcons.each((_, icon) => {
        const classes = $(icon).attr('class') || ''
        if (classes.includes('fa-check')) form.push('W')
        else if (classes.includes('fa-minus')) form.push('D')
        else if (classes.includes('fa-times')) form.push('L')
      })
      
      // Extract logo URL if available (typically found in the first column)
      let logoUrl = ''
      const logoImg = $(cells[1]).find('img')
      if (logoImg.length > 0) {
        logoUrl = logoImg.attr('src') || ''
      }
      
      // Create the table entry
      const tableEntry: LeagueTableEntry = {
        position: parseInt($(cells[0]).text().trim(), 10),
        team: $(cells[1]).text().trim(),
        played: parseInt($(cells[2]).text().trim(), 10),
        won: parseInt($(cells[3]).text().trim(), 10),
        drawn: parseInt($(cells[4]).text().trim(), 10),
        lost: parseInt($(cells[5]).text().trim(), 10),
        goalsFor: parseInt($(cells[6]).text().trim(), 10),
        goalsAgainst: parseInt($(cells[7]).text().trim(), 10),
        goalDifference: parseInt($(cells[8]).text().trim(), 10),
        points: parseInt($(cells[9]).text().trim(), 10),
        form,
        logo: logoUrl || ''
      }
      
      leagueTable.push(tableEntry)
    })
    
    // Clear existing data and insert new data
    const { error: deleteError } = await supabaseClient
      .from('highland_league_table')
      .delete()
      .not('id', 'is', null) // Delete all rows
    
    if (deleteError) {
      throw new Error(`Error clearing table data: ${deleteError.message}`)
    }
    
    // Insert new data
    const { data: insertedData, error: insertError } = await supabaseClient
      .from('highland_league_table')
      .insert(leagueTable)
      .select()
    
    if (insertError) {
      throw new Error(`Error inserting data: ${insertError.message}`)
    }
    
    // Update log entry with success
    await supabaseClient
      .from('scrape_logs')
      .update({
        status: 'completed',
        items_found: leagueTable.length,
        items_added: insertedData.length
      })
      .eq('id', logId)
    
    // Return the scraped data
    return new Response(JSON.stringify({
      success: true,
      data: leagueTable,
      count: leagueTable.length,
      message: `Successfully scraped and updated Highland League table with ${leagueTable.length} entries`
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Scraping error:', error)
    
    // Update log entry with error
    await supabaseClient
      .from('scrape_logs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : String(error)
      })
      .eq('id', logId)
    
    // Return error response
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/scrape-highland-league' \
//   --header 'Authorization: Bearer <supabase-jwt-token>' \
//   --header 'Content-Type: application/json'
