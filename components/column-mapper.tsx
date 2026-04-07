"use client"

import { useState } from "react"
import { UploadedCSVData } from "./csv-uploader"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sparkles } from "lucide-react"

export interface MappingConfig {
  feedbackColumn: string
  dateColumn?: string
  ratingColumn?: string
}

interface ColumnMapperProps {
  data: UploadedCSVData
  onMappingComplete: (mappedConfig: MappingConfig) => void
}

export function ColumnMapper({ data, onMappingComplete }: ColumnMapperProps) {
  const [feedbackColumn, setFeedbackColumn] = useState<string>("")
  const [dateColumn, setDateColumn] = useState<string>("none")
  const [ratingColumn, setRatingColumn] = useState<string>("none")

  // Preview the first 3 rows of the selected feedback column
  const getPreviewRows = (col: string) => {
    if (!col) return []
    return data.rows.slice(0, 3).map((row) => row[col])
  }

  const handleStartAnalysis = () => {
    if (!feedbackColumn) return
    onMappingComplete({
      feedbackColumn,
      dateColumn: dateColumn !== "none" ? dateColumn : undefined,
      ratingColumn: ratingColumn !== "none" ? ratingColumn : undefined,
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 bg-zinc-900 border-zinc-800 text-zinc-100 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Map Your Data</CardTitle>
        <CardDescription className="text-zinc-400 text-base">
          We found {data.rows.length} rows in <strong className="text-indigo-400 font-medium">{data.fileName}</strong>. Select the columns that contain the relevant information.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Primary Column Mapping */}
            <div className="space-y-3">
              <Label className="text-zinc-200">
                Which column contains the <span className="text-indigo-400 font-bold">Feedback / Text</span>? *
              </Label>
              <Select value={feedbackColumn} onValueChange={(val) => setFeedbackColumn(val || "")}>
                <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 focus:ring-indigo-500 text-zinc-200">
                  <SelectValue placeholder="Select a column..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                  {data.headers.map((header) => (
                    <SelectItem key={header} value={header} className="hover:bg-zinc-800 focus:bg-zinc-800">
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Optional Columns */}
            <div className="pt-4 space-y-3 border-t border-zinc-800/50">
              <Label className="text-zinc-400 text-sm font-normal">
                Optional: Identify other columns
              </Label>
              
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-zinc-500">Date Column</Label>
                  <Select value={dateColumn} onValueChange={(val) => setDateColumn(val || "none")}>
                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 focus:ring-zinc-500 text-zinc-300 text-sm">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                      <SelectItem value="none" className="text-zinc-500">Skip / None</SelectItem>
                      {data.headers.map((header) => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-zinc-500">Rating Column</Label>
                  <Select value={ratingColumn} onValueChange={(val) => setRatingColumn(val || "none")}>
                    <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 focus:ring-zinc-500 text-zinc-300 text-sm">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                      <SelectItem value="none" className="text-zinc-500">Skip / None</SelectItem>
                      {data.headers.map((header) => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Data Preview Area */}
          <div className="flex flex-col h-full bg-zinc-950/50 border border-zinc-800 rounded-xl overflow-hidden p-1 shadow-inner">
            <div className="px-3 py-2 bg-zinc-900/80 border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-500 rounded-t-lg">
              Data Preview
            </div>
            {!feedbackColumn ? (
              <div className="flex-1 flex items-center justify-center p-6 text-center">
                <p className="text-zinc-500 text-sm">Select the Feedback column on the left to confirm it contains correct text data.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto rounded-b-lg">
                <Table>
                  <TableHeader className="bg-zinc-900">
                    <TableRow className="border-zinc-800 border-b">
                      <TableHead className="w-12 text-zinc-500 font-medium">Row</TableHead>
                      <TableHead className="text-zinc-300 font-bold truncate max-w-[200px]">{feedbackColumn}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPreviewRows(feedbackColumn).map((val, idx) => (
                      <TableRow key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-900/30">
                        <TableCell className="text-zinc-500 text-xs font-mono">{idx + 1}</TableCell>
                        <TableCell className="text-zinc-300 text-sm font-medium">
                          <div className="line-clamp-2" title={String(val)}>
                            {String(val) || <span className="text-zinc-600 italic">Empty</span>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-zinc-900/50 border-t border-zinc-800/80 pt-6 mt-4 rounded-b-xl flex justify-between items-center">
        <p className="text-sm text-zinc-500">
          We'll securely process your data without altering the original file.
        </p>
        <Button 
          onClick={handleStartAnalysis} 
          disabled={!feedbackColumn}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-[0_0_1.5rem_-0.5rem_#4f46e5] px-6"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Start Analysis
        </Button>
      </CardFooter>
    </Card>
  )
}
