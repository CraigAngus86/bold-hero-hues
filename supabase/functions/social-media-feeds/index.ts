
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'
import { createHmac } from 'node:crypto';

// Twitter/X API configuration
const TWITTER_API_KEY = Deno.env.get("TWITTER_API_KEY")?.trim();
const TWITTER_API_SECRET = Deno.env.get("TWITTER_API_SECRET")?.trim();
const TWITTER_ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const TWITTER_ACCESS_SECRET = Deno.env.get("TWITTER_ACCESS_SECRET")?.trim();

// Facebook API configuration
const FACEBOOK_APP_ID = Deno.env.get("FACEBOOK_APP_ID")?.trim();
const FACEBOOK_APP_SECRET = Deno.env.get("FACEBOOK_APP_SECRET")?.trim();
const FACEBOOK_PAGE_ID = Deno.env.get("FACEBOOK_PAGE_ID")?.trim();
const FACEBOOK_ACCESS_TOKEN = Deno.env.get("FACEBOOK_ACCESS_TOKEN")?.trim();

// Instagram API configuration
const INSTAGRAM_APP_ID = Deno.env.get("INSTAGRAM_APP_ID")?.trim();
const INSTAGRAM_APP_SECRET = Deno.env.get("INSTAGRAM_APP_SECRET")?.trim();
const INSTAGRAM_ACCESS_TOKEN = Deno.env.get("INSTAGRAM_ACCESS_TOKEN")?.trim();

// Types
interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'facebook';
  username: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  shares?: number;
  mediaUrl?: string;
  profileImage?: string;
  url?: string;
}

// Function to generate Twitter OAuth signature
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(
    url
  )}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;
  
  const signingKey = `${encodeURIComponent(
    consumerSecret
  )}&${encodeURIComponent(tokenSecret)}`;
  
  const hmacSha1 = createHmac("sha1", signingKey);
  const signature = hmacSha1.update(signatureBaseString).digest("base64");

  return signature;
}

// Function to generate Twitter OAuth header
function generateTwitterOAuthHeader(method: string, url: string): string {
  if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
    throw new Error("Missing Twitter API credentials");
  }
  
  const oauthParams = {
    oauth_consumer_key: TWITTER_API_KEY,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: TWITTER_ACCESS_TOKEN,
    oauth_version: "1.0",
  };

  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    TWITTER_API_SECRET,
    TWITTER_ACCESS_SECRET
  );

  const signedOAuthParams = {
    ...oauthParams,
    oauth_signature: signature,
  };

  return (
    "OAuth " +
    Object.entries(signedOAuthParams)
      .sort()
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ")
  );
}

// Function to fetch Twitter posts
async function fetchTwitterPosts(username: string): Promise<SocialPost[]> {
  try {
    const url = "https://api.twitter.com/2/users/by/username/" + username;
    const userResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TWITTER_API_KEY}`
      }
    });
    
    if (!userResponse.ok) {
      console.error("Twitter user lookup failed:", await userResponse.text());
      return [];
    }
    
    const userData = await userResponse.json();
    const userId = userData.data.id;
    
    const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets?max_results=5&expansions=attachments.media_keys&tweet.fields=created_at,public_metrics&media.fields=url,preview_image_url`;
    const oauthHeader = generateTwitterOAuthHeader("GET", tweetsUrl);
    
    const tweetsResponse = await fetch(tweetsUrl, {
      headers: {
        Authorization: oauthHeader
      }
    });
    
    if (!tweetsResponse.ok) {
      console.error("Twitter tweets lookup failed:", await tweetsResponse.text());
      return [];
    }
    
    const tweetsData = await tweetsResponse.json();
    return tweetsData.data.map((tweet: any) => ({
      id: tweet.id,
      platform: 'twitter',
      username: username,
      content: tweet.text,
      date: tweet.created_at,
      likes: tweet.public_metrics.like_count,
      comments: tweet.public_metrics.reply_count,
      shares: tweet.public_metrics.retweet_count,
      mediaUrl: tweet.attachments?.media_keys ? 
        tweetsData.includes.media.find((m: any) => m.media_key === tweet.attachments.media_keys[0])?.url : 
        undefined,
      profileImage: `/lovable-uploads/banks-o-dee-dark-logo.png`, // Default logo as fallback
      url: `https://x.com/${username}/status/${tweet.id}`
    }));
  } catch (error) {
    console.error("Error fetching Twitter posts:", error);
    return [];
  }
}

// Function to fetch Facebook posts
async function fetchFacebookPosts(): Promise<SocialPost[]> {
  try {
    if (!FACEBOOK_ACCESS_TOKEN || !FACEBOOK_PAGE_ID) {
      throw new Error("Missing Facebook credentials");
    }
    
    const url = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/posts?fields=id,message,created_time,attachments,likes.summary(true),comments.summary(true),shares&access_token=${FACEBOOK_ACCESS_TOKEN}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error("Facebook API request failed:", await response.text());
      return [];
    }
    
    const data = await response.json();
    return data.data.map((post: any) => ({
      id: post.id,
      platform: 'facebook',
      username: 'banksodeejfc',
      content: post.message || "",
      date: post.created_time,
      likes: post.likes?.summary?.total_count || 0,
      comments: post.comments?.summary?.total_count || 0,
      shares: post.shares?.count || 0,
      mediaUrl: post.attachments?.data[0]?.media?.image?.src,
      profileImage: `/lovable-uploads/banks-o-dee-dark-logo.png`,
      url: `https://www.facebook.com/${post.id}`
    }));
  } catch (error) {
    console.error("Error fetching Facebook posts:", error);
    return [];
  }
}

// Function to fetch Instagram posts
async function fetchInstagramPosts(): Promise<SocialPost[]> {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN) {
      throw new Error("Missing Instagram credentials");
    }
    
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error("Instagram API request failed:", await response.text());
      return [];
    }
    
    const data = await response.json();
    return data.data.map((post: any) => ({
      id: post.id,
      platform: 'instagram',
      username: 'banksodeefc',
      content: post.caption || "",
      date: post.timestamp,
      likes: post.like_count || 0,
      comments: post.comments_count || 0,
      mediaUrl: post.media_url || post.thumbnail_url,
      profileImage: `/lovable-uploads/banks-o-dee-dark-logo.png`,
      url: post.permalink
    }));
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    return [];
  }
}

// Main handler function
Deno.serve(async (req) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  }

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  // Create Supabase client
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )
  
  try {
    // Parse request params
    const { platforms } = await req.json()
    const requestedPlatforms = platforms || ['twitter', 'facebook', 'instagram']
    
    // Collect posts from each platform
    let allPosts: SocialPost[] = []
    
    if (requestedPlatforms.includes('twitter')) {
      const twitterPosts = await fetchTwitterPosts('banksodee_fc')
      allPosts = [...allPosts, ...twitterPosts]
    }
    
    if (requestedPlatforms.includes('facebook')) {
      const facebookPosts = await fetchFacebookPosts()
      allPosts = [...allPosts, ...facebookPosts]
    }
    
    if (requestedPlatforms.includes('instagram')) {
      const instagramPosts = await fetchInstagramPosts()
      allPosts = [...allPosts, ...instagramPosts]
    }
    
    // Sort all posts by date (newest first)
    allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    // Return results
    return new Response(JSON.stringify({ posts: allPosts }), { headers })
    
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    )
  }
})
