import { NextResponse } from 'next/server'
// Adjust this import to match where your SERVER supabase client is located. 
// Based on your code, you probably have a server client in the same lib folder:
import { createClient } from '@/lib/supabase/server' 

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    
    // This securely exchanges the URL code for an active session cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Success! Redirect the user to the protected page (e.g., dashboard or home)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If there's an error or no code, redirect back to the login page
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}