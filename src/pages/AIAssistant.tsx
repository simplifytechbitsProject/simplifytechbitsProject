import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bot, 
  User, 
  Send, 
  Trash2, 
  Sparkles,
  Code,
  Lightbulb,
  HelpCircle,
  Shield,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "How do I optimize React performance?",
  "Explain the difference between let and const",
  "Help me debug this JavaScript error",
  "What are the best practices for API design?",
  "How to implement authentication in React?",
  "Explain async/await in JavaScript",
  "What are the best practices for TypeScript?",
  "How to handle errors in async functions?",
  "Explain dependency injection patterns",
  "What's the difference between REST and GraphQL?",
  "How to implement proper error boundaries?",
  "Best practices for state management in React"
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI coding mentor. I can help you with programming questions, code reviews, debugging, best practices, and more. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState("general");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callGroqAPI = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      const systemMessage = getModeSpecificPrompt(selectedMode);

      const apiMessages = [
        { role: "system", content: systemMessage },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content
        })),
        { role: "user", content: userMessage }
      ];

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: apiMessages,
          temperature: 0.6,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("Groq API Error:", error);
      throw error;
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageContent = messageText || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await callGroqAPI(messageContent, messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm your AI coding mentor. I can help you with programming questions, code reviews, debugging, best practices, and more. What would you like to know?",
        timestamp: new Date()
      }
    ]);
    toast.success("Conversation cleared");
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.role === "user" ? "You" : "AI Assistant"}: ${msg.content}`)
      .join("\n\n");
    
    const blob = new Blob([conversationText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-conversation-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Conversation exported!");
  };

  const getModeSpecificPrompt = (mode: string) => {
    switch (mode) {
      case "code-review":
        return "You are an expert code reviewer. Analyze the code for:\n- Code quality and best practices\n- Performance issues\n- Security vulnerabilities\n- Maintainability concerns\n- Testing coverage\nProvide specific, actionable feedback with code examples.";
      case "debugging":
        return "You are an expert debugging assistant. Help with:\n- Error analysis and troubleshooting\n- Common debugging techniques\n- Log analysis\n- Performance profiling\n- Testing strategies\nProvide step-by-step debugging guidance.";
      case "architecture":
        return "You are an expert software architect. Help with:\n- System design and architecture\n- Design patterns\n- Scalability considerations\n- Technology selection\n- Best practices\nProvide architectural guidance and recommendations.";
      case "security":
        return "You are an expert security consultant. Focus on:\n- Security best practices\n- Vulnerability assessment\n- Authentication and authorization\n- Data protection\n- Secure coding practices\nProvide security-focused guidance.";
      default:
        return "You are an expert AI coding mentor and software engineering assistant. You help developers with:\n- Code review and optimization\n- Debugging and troubleshooting\n- Best practices and architecture advice\n- Programming concepts and explanations\n- Framework and library guidance\n- Performance optimization tips\n- Security best practices\n- Testing strategies\n- Deployment and DevOps\n- Database design and optimization\n\nProvide clear, helpful, and actionable responses. Include code examples when relevant. Format code blocks properly with syntax highlighting. Be conversational but professional.";
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">AI Coding Assistant</h1>
        <p className="text-muted-foreground">Your personal AI mentor for programming and development</p>
      </div>

      {/* Mode Selection */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap justify-center">
          <Button 
            variant={selectedMode === "general" ? "default" : "outline"} 
            size="sm" 
            className="glow-hover"
            onClick={() => setSelectedMode("general")}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            General Assistant
          </Button>
          <Button 
            variant={selectedMode === "code-review" ? "default" : "outline"} 
            size="sm" 
            className="glow-hover"
            onClick={() => setSelectedMode("code-review")}
          >
            <Code className="w-4 h-4 mr-2" />
            Code Review
          </Button>
          <Button 
            variant={selectedMode === "debugging" ? "default" : "outline"} 
            size="sm" 
            className="glow-hover"
            onClick={() => setSelectedMode("debugging")}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Debugging
          </Button>
          <Button 
            variant={selectedMode === "architecture" ? "default" : "outline"} 
            size="sm" 
            className="glow-hover"
            onClick={() => setSelectedMode("architecture")}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Architecture
          </Button>
          <Button 
            variant={selectedMode === "security" ? "default" : "outline"} 
            size="sm" 
            className="glow-hover"
            onClick={() => setSelectedMode("security")}
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </Button>
        </div>
        
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </Button>
        </div>
        
        {showAdvanced && (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-4">
              <div className="text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">AI</Badge>
                  <p className="text-muted-foreground">Enhanced prompts for better responses</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">Context</Badge>
                  <p className="text-muted-foreground">Maintains conversation context</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">Specialized</Badge>
                  <p className="text-muted-foreground">Mode-specific expertise</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-accent" />
              AI Assistant
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportConversation}
                className="glow-hover"
                disabled={messages.length <= 1}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearConversation}
                className="glow-hover"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={message.role === "user" ? "bg-primary" : "bg-accent"}>
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-accent">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-pulse text-accent" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 6).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs glow-hover"
                    onClick={() => handleSendMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about programming..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-primary hover:shadow-glow transition-all"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
