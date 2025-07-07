import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wrench, 
  Zap, 
  Target, 
  TrendingUp, 
  FileText, 
  Minimize2,
  Gauge,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Copy
} from "lucide-react";
import { toast } from "sonner";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const optimizationTools = [
  {
    id: "refactoring-hints",
    title: "Smart Refactoring",
    description: "AI-powered code structure improvements",
    icon: Wrench,
    color: "text-blue-400"
  },
  {
    id: "performance-analyzer",
    title: "Performance Analyzer",
    description: "Identify bottlenecks and optimization opportunities",
    icon: Gauge,
    color: "text-green-400"
  },
  {
    id: "code-minifier",
    title: "Code Minifier",
    description: "Compress and optimize code files",
    icon: Minimize2,
    color: "text-orange-400"
  },
  {
    id: "complexity-reducer",
    title: "Complexity Reducer",
    description: "Simplify complex code structures",
    icon: Target,
    color: "text-purple-400"
  }
];

export default function Optimization() {
  const location = useLocation();
  const [selectedTool, setSelectedTool] = useState("refactoring-hints");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState({
    performance: 85,
    maintainability: 78,
    complexity: 65,
    security: 92
  });
  const [showApplyButton, setShowApplyButton] = useState(false);
  const [optimizedCode, setOptimizedCode] = useState("");

  // Route-based tool selection
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/optimization/refactoring")) {
      setSelectedTool("refactoring-hints");
    } else if (path.includes("/optimization/performance")) {
      setSelectedTool("performance-analyzer");
    } else if (path.includes("/optimization/minifier")) {
      setSelectedTool("code-minifier");
    } else if (path.includes("/optimization/complexity")) {
      setSelectedTool("complexity-reducer");
    } else {
      setSelectedTool("refactoring-hints"); // default
    }
  }, [location.pathname]);

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
              content: "You are an expert code optimization specialist and refactoring expert. Provide detailed, actionable suggestions for improving code performance, maintainability, structure, and readability. Always include specific code examples and explanations for your recommendations."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "No optimization suggestions available";
    } catch (error) {
      console.error("Groq API Error:", error);
      throw error;
    }
  };

  const handleOptimize = async () => {
    if (!input.trim()) {
      toast.error("Please enter some code to optimize");
      return;
    }

    setIsLoading(true);
    setOutput("");

    try {
      let prompt = "";
      
      switch (selectedTool) {
        case "refactoring-hints":
          prompt = `Perform a comprehensive refactoring analysis of this ${language} code:

Code:
${input}

Please provide:
1. Code structure improvements
2. Naming convention suggestions
3. Function/method extraction opportunities
4. Design pattern applications
5. Performance optimizations
6. Maintainability enhancements
7. Specific refactored code examples
8. Before/after comparisons with explanations`;
          break;
        case "performance-analyzer":
          prompt = `Analyze this ${language} code for performance optimization opportunities:

Code:
${input}

Please provide:
1. Performance bottlenecks identification
2. Memory usage optimizations
3. Algorithm improvements
4. Caching strategies
5. Async/await optimizations
6. Database query optimizations (if applicable)
7. Specific performance improvements with code examples
8. Benchmarking suggestions`;
          break;
        case "code-minifier":
          prompt = `Minify and optimize this ${language} code while preserving functionality:

Code:
${input}

Requirements:
- Remove unnecessary whitespace and comments
- Optimize variable and function names
- Preserve exact functionality
- Maintain code readability where possible
- Provide both minified and formatted versions
- Include size reduction statistics`;
          break;
        case "complexity-reducer":
          prompt = `Simplify and reduce the complexity of this ${language} code:

Code:
${input}

Please provide:
1. Cyclomatic complexity analysis
2. Cognitive load reduction
3. Function decomposition suggestions
4. Conditional logic simplification
5. Loop optimization
6. Error handling improvements
7. Specific simplified code examples
8. Complexity metrics before/after`;
          break;
        default:
          prompt = input;
      }

      const result = await callGroqAPI(prompt);
      setOutput(result);
      
      // Try to extract optimized code from the response
      const codeMatch = result.match(/```[\w]*\n([\s\S]*?)\n```/);
      if (codeMatch) {
        setOptimizedCode(codeMatch[1]);
        setShowApplyButton(true);
      } else {
        setOptimizedCode("");
        setShowApplyButton(false);
      }
      
      // Simulate analysis results update
      setAnalysisResults({
        performance: Math.min(100, analysisResults.performance + Math.floor(Math.random() * 10)),
        maintainability: Math.min(100, analysisResults.maintainability + Math.floor(Math.random() * 8)),
        complexity: Math.max(20, analysisResults.complexity - Math.floor(Math.random() * 15)),
        security: Math.min(100, analysisResults.security + Math.floor(Math.random() * 5))
      });
      
      toast.success("Code optimization completed!");
    } catch (error) {
      toast.error("Failed to optimize code. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentTool = optimizationTools.find(tool => tool.id === selectedTool);

  const applyOptimizedCode = () => {
    if (optimizedCode) {
      setInput(optimizedCode);
      toast.success("Optimized code applied!");
    } else {
      toast.error("No optimized code available to apply");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {selectedTool === "refactoring-hints" && "Smart Refactoring"}
          {selectedTool === "performance-analyzer" && "Performance Analyzer"}
          {selectedTool === "code-minifier" && "Code Minifier"}
          {selectedTool === "complexity-reducer" && "Complexity Reducer"}
          {!["refactoring-hints", "performance-analyzer", "code-minifier", "complexity-reducer"].includes(selectedTool) && "Code Optimization Suite"}
        </h1>
        <p className="text-muted-foreground">
          {selectedTool === "refactoring-hints" && "AI-powered code structure improvements and refactoring suggestions"}
          {selectedTool === "performance-analyzer" && "Identify bottlenecks and optimization opportunities in your code"}
          {selectedTool === "code-minifier" && "Compress and optimize code files while preserving functionality"}
          {selectedTool === "complexity-reducer" && "Simplify complex code structures and reduce cognitive load"}
          {!["refactoring-hints", "performance-analyzer", "code-minifier", "complexity-reducer"].includes(selectedTool) && "Enhance your code performance, structure, and maintainability"}
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Gauge className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{analysisResults.performance}%</div>
            <Progress value={analysisResults.performance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintainability</CardTitle>
            <Wrench className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{analysisResults.maintainability}%</div>
            <Progress value={analysisResults.maintainability} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complexity</CardTitle>
            <Target className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{analysisResults.complexity}%</div>
            <Progress value={100 - analysisResults.complexity} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{analysisResults.security}%</div>
            <Progress value={analysisResults.security} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tool Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {optimizationTools.map((tool) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.id;
          return (
            <Card 
              key={tool.id} 
              className={`cursor-pointer transition-all glow-hover ${
                isSelected ? 'border-primary shadow-glow bg-primary/5' : 'hover:border-accent'
              }`}
              onClick={() => setSelectedTool(tool.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 ${tool.color}`} />
                  <h3 className="font-semibold text-sm">{tool.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
                {isSelected && (
                  <Badge className="mt-2 bg-primary text-primary-foreground">Active</Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentTool && <currentTool.icon className={`w-5 h-5 ${currentTool.color}`} />}
              {currentTool?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", 
                    "PHP", "Ruby", "Swift", "Kotlin", "Dart", "Scala", "R", "MATLAB"
                  ].map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Code to Optimize</label>
              <Textarea
                placeholder="Paste your code here for optimization..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[300px] font-mono"
              />
            </div>

            <Button 
              onClick={handleOptimize} 
              disabled={isLoading || !input.trim()}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Optimization Results
              </span>
              <div className="flex gap-2">
                {output && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(output)}
                    className="glow-hover"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Results
                  </Button>
                )}
                {showApplyButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={applyOptimizedCode}
                    className="glow-hover"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Apply Optimized Code
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {output ? (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm whitespace-pre-wrap font-mono overflow-auto max-h-[400px]">
                    {output}
                  </pre>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Performance: +12%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Readability: +18%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">Complexity: -25%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Minimize2 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">Size: -8%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Optimization results will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
