"use client";

import { useState } from "react";
import { MessageSquareText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ReviewDemo() {
  const [businessName, setBusinessName] = useState("My Business");
  const [review, setReview] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!review.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review,
          business_name: businessName,
        }),
      });

      const data = await res.json();
      setResponse(data.response || data.error || "No response generated.");
    } catch {
      setResponse("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[400px]">
      <Card className="p-6 space-y-4 border-gray-200">
        <h4 className="font-semibold text-gray-900">Review Defender</h4>
        <p className="text-sm text-gray-500">Paste a customer review and get a polished, brand-safe reply.</p>

        <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name" />

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Paste customer review here..."
          className="w-full min-h-32 rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Button onClick={generate} disabled={loading || !review.trim()} className="w-full bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><MessageSquareText className="w-4 h-4 mr-2" /> Draft Response</>}
        </Button>
      </Card>

      <Card className="p-6 border-gray-200 bg-gray-50/40">
        {!response ? (
          <div className="h-full min-h-56 flex items-center justify-center text-sm text-gray-400">Generated response appears here.</div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-gray-500">Suggested Reply</p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
