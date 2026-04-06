"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import Papa from "papaparse"
import { UploadCloud, FileWarning, CheckCircle2 } from "lucide-react"

export interface UploadedCSVData {
  headers: string[]
  rows: Record<string, any>[]
  fileName: string
}

interface CsvUploaderProps {
  onUploadSuccess: (data: UploadedCSVData) => void
}

export function CsvUploader({ onUploadSuccess }: CsvUploaderProps) {
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)
    const file = acceptedFiles[0]
    
    if (!file) {
      setError("Please upload a valid CSV file.")
      return
    }

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Only .csv files are supported. Please convert your .xlsx or other formats to CSV.")
      return
    }

    setIsProcessing(true)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        setIsProcessing(false)
        
        if (results.errors.length > 0 && results.data.length === 0) {
          setError(`Error parsing CSV: ${results.errors[0].message}`)
          return
        }

        const data = results.data as Record<string, any>[]
        
        if (data.length > 1000) {
          setError(`For the MVP, we only support up to 1,000 rows. Your file has ${data.length} rows. Please upgrade or trim your file.`)
          return
        }
        
        if (data.length === 0) {
          setError("Your CSV file appears to be empty.")
          return
        }

        const headers = results.meta.fields || Object.keys(data[0])

        onUploadSuccess({
          headers,
          rows: data,
          fileName: file.name
        })
      },
      error: (err: any) => {
        setIsProcessing(false)
        setError(`Failed to read file: ${err.message}`)
      }
    })
  }, [onUploadSuccess])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  })

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ease-out
          ${isDragActive ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800/80"}
          ${error || isDragReject ? "border-red-500/50 bg-red-500/5" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${isDragActive ? 'bg-indigo-500/20' : 'bg-zinc-800'}`}>
            <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
          </div>
          
          <div>
            <p className="text-xl font-medium text-zinc-200 mb-1">
              {isDragActive ? "Drop your CSV here" : "Click or drag CSV to upload"}
            </p>
            <p className="text-sm text-zinc-500">
              Only .csv files up to 1,000 rows are supported in the MVP
            </p>
          </div>
        </div>
      </div>
      
      {isProcessing && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-indigo-400">
          <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Processing CSV securely in your browser...</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3">
          <FileWarning className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-200 leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  )
}
