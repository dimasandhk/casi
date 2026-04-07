"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { CsvUploader, UploadedCSVData } from "@/components/csv-uploader"
import { ColumnMapper, MappingConfig } from "@/components/column-mapper"
import { BarChart3, LogOut, LayoutDashboard } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [csvData, setCsvData] = useState<UploadedCSVData | null>(null)
  
  // Later in Day 3, this state goes into the AI processing step
  const [mappingConfig, setMappingConfig] = useState<MappingConfig | null>(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handleUploadSuccess = (data: UploadedCSVData) => {
    setCsvData(data)
  }

  const handleMappingComplete = (config: MappingConfig) => {
    setMappingConfig(config)
    // Day 3 begins here: chunking and sending to AI
    alert("Mapping successful! " + JSON.stringify(config) + "\\n(Day 3 Chunking starts here)")
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-linear-to-b from-indigo-900/10 to-transparent pointer-events-none -z-10" />
      
      {/* Top Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 py-1.5 px-2 rounded-lg border border-indigo-500/30">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-semibold text-zinc-100 tracking-tight">AI Insights</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-zinc-400 hover:text-white transition-colors flex items-center text-sm font-medium">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            <button 
              onClick={handleLogout}
              className="text-zinc-500 hover:text-red-400 transition-colors flex items-center text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Page Title */}
        <div className="mb-10 text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2">New Analysis Project</h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Upload a CSV containing user feedback, app reviews, or support tickets. We'll utilize AI to categorize everything and identify top trends.
          </p>
        </div>

        {/* Step Flow Content */}
        {!csvData ? (
          <CsvUploader onUploadSuccess={handleUploadSuccess} />
        ) : !mappingConfig ? (
          <ColumnMapper data={csvData} onMappingComplete={handleMappingComplete} />
        ) : (
          <div className="text-center p-12 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg mt-8">
            <div className="inline-block p-4 bg-indigo-500/10 rounded-full mb-6 relative">
              <div className="absolute inset-0 border-2 border-indigo-400 rounded-full animate-ping opacity-50" />
              <div className="w-8 h-8 rounded-full border-t-2 border-indigo-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-zinc-100">Initializing AI Processing...</h2>
            <p className="text-zinc-400 max-w-md mx-auto">
              (Day 3 Functionality) Getting ready to slice {csvData.rows.length} rows into batches and analyze them with GPT-4o-mini.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
