"use client";

import { useState } from "react";
import { FileText, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SOPDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!file || !question.trim()) return;
    setLoading(true);
    setAnswer(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/sop`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setAnswer(data.answer || data.error || "No answer returned.");
    } catch {
      setAnswer("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[400px]">
      <Card className="p-6 space-y-4 border-gray-200">
        <h4 className="font-semibold text-gray-900">Upload SOP PDF</h4>
        <p className="text-sm text-gray-500">Ask operational questions against your internal process document.</p>

        <input
          id="sop-upload"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />

        <label htmlFor="sop-upload">
          <Button asChild variant="outline" className="cursor-pointer w-full">
            <span>{file ? file.name : "Select SOP PDF"}</span>
          </Button>
        </label>

        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What are the onboarding steps?"
        />

        <Button onClick={askQuestion} disabled={!file || !question.trim() || loading} className="w-full bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 mr-2" /> Ask SOP Agent</>}
        </Button>
      </Card>

      <Card className="p-6 border-gray-200 bg-gray-50/40">
        {!answer ? (
          <div className="h-full min-h-56 flex flex-col items-center justify-center text-gray-400 gap-2">
            <FileText className="w-10 h-10" />
            <p>Answer will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-gray-500">SOP Response</p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
