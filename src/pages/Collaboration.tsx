import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Bot, 
  FileSearch, 
  FileText, 
  MessageSquareCode,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Star,
  GitPullRequest,
  Loader2,
  Send,
  UserPlus,
  Video,
  Mic,
  Share2,
  Clock
} from "lucide-react";
import { toast } from "sonner";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

interface ReviewComment {
  id: string;
  author: string;
  content: string;
  line?: number;
  timestamp: Date;
}

interface CodeReview {
  score: number;
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    suggestion: string;
    line?: number;
  }>;
  summary: string;
  comments: ReviewComment[];
}

interface CollaboratorStatus {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'coding' | 'reviewing' | 'away';
  currentFile?: string;
}

export default function Collaboration() {
  const [activeTab, setActiveTab] = useState("pair-programming");
  const [code, setCode] = useState("");
  const [prCode, setPrCode] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviewResult, setReviewResult] = useState<CodeReview | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  
  const [collaborators] = useState<CollaboratorStatus[]>([
    { id: "1", name: "Alice", avatar: "A", status: "online", currentFile: "App.tsx" },
    { id: "2", name: "Bob", avatar: "B", status: "coding", currentFile: "utils.ts" },
    { id: "3", name: "Charlie", avatar: "C", status: "reviewing" },
    { id: "4", name: "Diana", avatar: "D", status: "away" }
  ]);

  const callGroqAPI = async (prompt: string) => {
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
              content: "You are an expert programming assistant specialized in code review, documentation, and pair programming. Provide detailed, actionable feedback."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "No response generated";
    } catch (error) {
      console.error("Groq API Error:", error);
      throw error;
    }
  };

  const generateAISuggestion = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code first");
      return;
    }

    setIsProcessing(true);
    try {
      const prompt = `As an AI pair programming assistant, analyze this code and provide helpful suggestions for improvement, optimization, or next steps. Consider:
      1. Code quality and best practices
      2. Potential bugs or issues
      3. Performance improvements
      4. Code structure and readability
      5. Next development steps
      
      Code:
      ${code}`;

      const result = await callGroqAPI(prompt);
      setAiSuggestion(result);
      toast.success("AI suggestion generated!");
    } catch (error) {
      toast.error("Failed to generate suggestion. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const performCodeReview = async () => {
    if (!prCode.trim()) {
      toast.error("Please enter code to review");
      return;
    }

    setIsProcessing(true);
    try {
      const prompt = `Perform a comprehensive code review on this pull request. Provide:
      1. Overall code quality score (0-100)
      2. Specific issues with severity levels
      3. Constructive feedback and suggestions
      4. Best practices recommendations
      5. Summary of the review
      
      Code to review:
      ${prCode}`;

      const result = await callGroqAPI(prompt);
      
      // Mock structured review result
      const mockReview: CodeReview = {
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        issues: [
          {
            type: "Code Quality",
            severity: "medium",
            description: "Consider extracting this complex function into smaller functions",
            suggestion: "Break down the function into smaller, more focused functions for better maintainability",
            line: 12
          },
          {
            type: "Performance",
            severity: "low",
            description: "Unnecessary re-renders detected",
            suggestion: "Consider using useMemo or useCallback to optimize performance"
          }
        ],
        summary: result,
        comments: [
          {
            id: "1",
            author: "AI Reviewer",
            content: "Overall good code structure. Consider the suggestions above for improvement.",
            timestamp: new Date()
          }
        ]
      };

      setReviewResult(mockReview);
      toast.success("Code review completed!");
    } catch (error) {
      toast.error("Code review failed. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateDocumentation = async () => {
    if (!code.trim()) {
      toast.error("Please enter code to document");
      return;
    }

    setIsProcessing(true);
    try {
      const prompt = `Generate comprehensive documentation for this code including:
      1. Overview and purpose
      2. Function/class descriptions
      3. Parameters and return values
      4. Usage examples
      5. Dependencies and requirements
      6. API documentation if applicable
      
      Code:
      ${code}`;

      const result = await callGroqAPI(prompt);
      setDocumentation(result);
      toast.success("Documentation generated successfully!");
    } catch (error) {
      toast.error("Failed to generate documentation. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startCollaborationSession = () => {
    const newSessionId = Math.random().toString(36).substring(7);
    setSessionId(newSessionId);
    toast.success(`Collaboration session started: ${newSessionId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'coding': return 'bg-blue-500';
      case 'reviewing': return 'bg-yellow-500';
      case 'away': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'coding': return 'Coding';
      case 'reviewing': return 'Reviewing';
      case 'away': return 'Away';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Collaboration Hub</h1>
        <p className="text-muted-foreground">Code together, review smart, document automatically</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-[#2A2A2A]">
          <TabsTrigger value="pair-programming" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Bot className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">AI Pair</span>
            <span className="sm:hidden">Pair</span>
          </TabsTrigger>
          <TabsTrigger value="code-review" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <GitPullRequest className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Review</span>
            <span className="sm:hidden">Review</span>
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <FileText className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Docs</span>
            <span className="sm:hidden">Docs</span>
          </TabsTrigger>
          <TabsTrigger value="live-collab" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Users className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Live</span>
            <span className="sm:hidden">Live</span>
          </TabsTrigger>
        </TabsList>

        {/* AI Pair Programming */}
        <TabsContent value="pair-programming" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-accent" />
                  AI Pair Programming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your Code
                  </label>
                  <Textarea
                    placeholder="// Paste your code here and get AI suggestions..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="min-h-[300px] font-mono bg-[#1D1616] border-[#444]"
                  />
                </div>

                <Button 
                  onClick={generateAISuggestion} 
                  disabled={isProcessing || !code.trim()}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      AI is thinking...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Get AI Suggestions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MessageSquareCode className="w-5 h-5" />
                    AI Suggestions
                  </span>
                  {aiSuggestion && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(aiSuggestion)}
                      className="glow-hover"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aiSuggestion ? (
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-sm whitespace-pre-wrap font-mono overflow-auto max-h-[400px]">
                        {aiSuggestion}
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="glow-hover">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful
                      </Button>
                      <Button variant="outline" size="sm" className="glow-hover">
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Not Helpful
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>AI suggestions will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Code Review */}
        <TabsContent value="code-review" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitPullRequest className="w-5 h-5 text-accent" />
                  Smart Code Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Pull Request Code
                  </label>
                  <Textarea
                    placeholder="// Paste PR code for comprehensive review..."
                    value={prCode}
                    onChange={(e) => setPrCode(e.target.value)}
                    className="min-h-[300px] font-mono bg-[#1D1616] border-[#444]"
                  />
                </div>

                <Button 
                  onClick={performCodeReview} 
                  disabled={isProcessing || !prCode.trim()}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Reviewing code...
                    </>
                  ) : (
                    <>
                      <FileSearch className="w-4 h-4 mr-2" />
                      Start Code Review
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Review Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviewResult ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Code Quality Score</span>
                        <span className="text-lg font-bold text-primary">{reviewResult.score}/100</span>
                      </div>
                      <Progress value={reviewResult.score} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Issues Found</h4>
                      {reviewResult.issues.map((issue, index) => (
                        <div key={index} className="border border-border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={
                              issue.severity === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                              issue.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            }>
                              {issue.severity}
                            </Badge>
                            {issue.line && (
                              <span className="text-xs text-muted-foreground">Line {issue.line}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{issue.type}</p>
                            <p className="text-xs text-muted-foreground">{issue.description}</p>
                          </div>
                          <div className="bg-muted rounded p-2">
                            <p className="text-xs"><strong>Suggestion:</strong> {issue.suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Review Summary</h4>
                      <pre className="text-sm whitespace-pre-wrap font-mono overflow-auto max-h-[200px]">
                        {reviewResult.summary}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <GitPullRequest className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Code review results will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Auto Documentation */}
        <TabsContent value="documentation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  Auto Documentation Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Code to Document
                  </label>
                  <Textarea
                    placeholder="// Paste your code here to generate documentation..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="min-h-[300px] font-mono bg-[#1D1616] border-[#444]"
                  />
                </div>

                <Button 
                  onClick={generateDocumentation} 
                  disabled={isProcessing || !code.trim()}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating docs...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Documentation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Generated Documentation
                  </span>
                  {documentation && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(documentation)}
                      className="glow-hover"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documentation ? (
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm whitespace-pre-wrap font-mono overflow-auto max-h-[400px]">
                      {documentation}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Generated documentation will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Real-time Collaboration */}
        <TabsContent value="live-collab" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Collaboration Controls */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Live Collaboration Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Enter session ID to join..."
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="bg-[#1D1616] border-[#444]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={startCollaborationSession} className="bg-gradient-primary">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Session
                    </Button>
                    <Button variant="outline" className="glow-hover">
                      <Share2 className="w-4 h-4 mr-2" />
                      Join Session
                    </Button>
                  </div>
                </div>

                {sessionId && (
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm"><strong>Session ID:</strong> {sessionId}</p>
                      <p className="text-xs text-muted-foreground mt-1">Share this ID with your collaborators</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="glow-hover">
                        <Video className="w-4 h-4 mr-2" />
                        Video Call
                      </Button>
                      <Button variant="outline" size="sm" className="glow-hover">
                        <Mic className="w-4 h-4 mr-2" />
                        Voice Chat
                      </Button>
                      <Button variant="outline" size="sm" className="glow-hover">
                        <Share2 className="w-4 h-4 mr-2" />
                        Screen Share
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Live Chat</h4>
                      <div className="bg-[#1D1616] border border-[#444] rounded-lg p-3 h-32 overflow-y-auto">
                        <div className="text-xs text-muted-foreground">
                          Session started. Waiting for collaborators...
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          className="bg-[#1D1616] border-[#444] text-sm"
                        />
                        <Button size="sm" className="bg-gradient-primary">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Collaborators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Active Collaborators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-primary text-white text-xs">
                            {collaborator.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(collaborator.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{collaborator.name}</p>
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-muted-foreground">{getStatusText(collaborator.status)}</p>
                          {collaborator.currentFile && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground truncate">{collaborator.currentFile}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Session active for 12 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
