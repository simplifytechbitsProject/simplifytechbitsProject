import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export default function APITest() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const testAPI = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "You are a helpful coding assistant."
            },
            {
              role: "user",
              content: "Say 'Hello! API is working correctly.'"
            }
          ],
          temperature: 0.1,
          max_tokens: 50
        })
      });

      if (!response.ok) {
        throw new Error(`API test failed: ${response.status}`);
      }

      const data = await response.json();
      const result = data.choices[0]?.message?.content;
      
      if (result) {
        setTestResult("success");
        toast.success("API connection successful!");
      } else {
        throw new Error("No response from API");
      }
    } catch (error) {
      console.error("API Test Error:", error);
      setTestResult("error");
      toast.error("API connection failed. Please check your key.");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">API Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testAPI} 
          disabled={isTesting}
          className="w-full"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Groq API Connection"
          )}
        </Button>
        
        {testResult && (
          <div className="mt-4 flex items-center gap-2">
            {testResult === "success" ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600">API is working correctly</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-600">API connection failed</span>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 