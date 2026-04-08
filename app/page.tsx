import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Database, MessageSquareText, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950 -z-10" />
      
      {/* Navigation */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">cASI</span>
        </div>
        <nav className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                {user.user_metadata?.avatar_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-zinc-700" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-zinc-300 hidden sm:inline-block">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
              <form action="/auth/signout" method="post" className="m-0">
                <Button type="submit" variant="ghost" className="text-zinc-400 hover:text-white px-3">
                  <LogOut className="w-4 h-4 mr-2 hidden sm:inline-block" />
                  Sign Out
                </Button>
              </form>
              <Link href="/dashboard">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="cursor-pointer">
                <Button variant="ghost" className="mr-2 cursor-pointer">Login</Button>
              </Link>
              <Link href="/login" className="cursor-pointer">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-24 text-center max-w-4xl flex flex-col items-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium tracking-wide shadow-sm animate-fade-in">
          Introducing the AI Insights Engine
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight">
          Turn massive feedback into <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            instant product decisions.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed">
          Upload thousands of App Store reviews, support tickets, or survey responses. Our AI automatically classifies bugs, requests, and sentiment in seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-14 text-base font-medium rounded-xl group transition-all duration-300 ease-out hover:shadow-[0_0_2rem_-0.5rem_#4f46e5]">
              Start Analyzing for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="outline" className="px-8 h-14 text-base font-medium rounded-xl border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all">
              View Demo
            </Button>
          </Link>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 text-left">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:bg-zinc-800/80">
            <Database className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-zinc-100">Drop your CSV</h3>
            <p className="text-zinc-400 leading-relaxed">Simply upload any messy CSV. We handle column mapping, large file chunking, and encoding automatically.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-zinc-800/80">
            <MessageSquareText className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-zinc-100">AI Classification</h3>
            <p className="text-zinc-400 leading-relaxed">Every row is analyzed by GPT-4o-mini and correctly tagged as a bug, feature request, praise, or churn risk.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:bg-zinc-800/80">
            <BarChart3 className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-zinc-100">Actionable Dashboard</h3>
            <p className="text-zinc-400 leading-relaxed">Get a beautifully formatted executive summary and chart breakdown of what to build next.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
