import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Code, 
  Wand2, 
  Bug, 
  BookOpen, 
  RefreshCw, 
  Copy,
  CheckCircle,
  Loader2,
  Minimize2,
  BarChart3,
  Image,
  Lightbulb,
  Workflow,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import APITest from "@/components/APITest";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const codeTools = [
  {
    id: "snippet-generator",
    title: "AI Snippet Generator",
    description: "Generate reusable code snippets from natural language",
    icon: Wand2,
    color: "text-accent"
  },
  {
    id: "bug-fixer",
    title: "Smart Bug Fixer",
    description: "Analyze and fix code bugs instantly",
    icon: Bug,
    color: "text-red-400"
  },
  {
    id: "code-explainer",
    title: "Code Explainer",
    description: "Convert complex code into plain English",
    icon: BookOpen,
    color: "text-blue-400"
  },
  {
    id: "code-converter",
    title: "Language Converter",
    description: "Translate code between programming languages",
    icon: RefreshCw,
    color: "text-green-400"
  },
  {
    id: "image-generator",
    title: "Diagram Generator",
    description: "Generate technical diagrams from descriptions",
    icon: Image,
    color: "text-purple-400"
  },
  {
    id: "refactoring-hints",
    title: "Refactoring Hints",
    description: "Get smart suggestions for code improvements",
    icon: Lightbulb,
    color: "text-yellow-400"
  },
  {
    id: "code-minifier",
    title: "Code Minifier",
    description: "Minify and compress your code files",
    icon: Minimize2,
    color: "text-orange-400"
  },
  {
    id: "complexity-score",
    title: "Complexity Analyzer",
    description: "Analyze and score code complexity",
    icon: BarChart3,
    color: "text-pink-400"
  },
  {
    id: "workflow-automator",
    title: "Workflow Automator",
    description: "Create automation workflows for repetitive tasks",
    icon: Workflow,
    color: "text-indigo-400"
  },
  {
    id: "auto-documentation",
    title: "Auto Documentation",
    description: "Generate documentation from your code",
    icon: FileText,
    color: "text-cyan-400"
  }
];

const languages = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin"
];

export default function CodeTools() {
  const [selectedTool, setSelectedTool] = useState("snippet-generator");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");
  const [targetLanguage, setTargetLanguage] = useState("Python");
  const [isLoading, setIsLoading] = useState(false);
  const [complexityThreshold, setComplexityThreshold] = useState([50]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [history, setHistory] = useState<Array<{tool: string, input: string, output: string, timestamp: Date}>>([]);

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
              content: "You are an expert software engineer and coding assistant. Provide clear, concise, and accurate responses. Always format code properly with syntax highlighting and include detailed explanations when requested."
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
      return data.choices[0]?.message?.content || "No response generated";
    } catch (error) {
      console.error("Groq API Error:", error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error("Please enter some input text");
      return;
    }

    setIsLoading(true);
    setOutput("");

    try {
      let prompt = "";
      
      switch (selectedTool) {
        case "snippet-generator":
          prompt = `Generate a clean, reusable ${selectedLanguage} code snippet for: "${input}". 
          
          Requirements:
          - Include detailed comments explaining each part
          - Follow ${selectedLanguage} best practices and conventions
          - Make it production-ready with error handling
          - Include usage examples
          - Add JSDoc/TypeDoc comments if applicable`;
          break;
        case "bug-fixer":
          prompt = `Analyze this ${selectedLanguage} code for bugs and provide the fixed version:

          Code: ${input}
          
          Please provide:
          1. List of bugs found
          2. Fixed code with explanations
          3. Best practices to prevent similar issues
          4. Testing suggestions`;
          break;
        case "code-explainer":
          prompt = `Explain this ${selectedLanguage} code in simple terms:

          Code: ${input}
          
          Please provide:
          1. Overall purpose of the code
          2. Line-by-line explanation of key parts
          3. Data flow and logic explanation
          4. Potential improvements or optimizations`;
          break;
        case "code-converter":
          prompt = `Convert this ${selectedLanguage} code to ${targetLanguage}, maintaining the same functionality:

          Original ${selectedLanguage} code: ${input}
          
          Requirements:
          - Preserve exact functionality
          - Use ${targetLanguage} idioms and best practices
          - Include comments explaining the conversion
          - Handle language-specific differences appropriately`;
          break;
        case "image-generator":
          prompt = `Create a detailed ASCII diagram or flowchart representation for: "${input}"

          Requirements:
          - Use clear ASCII characters for diagrams
          - Include proper flow direction
          - Add labels and descriptions
          - Make it visually appealing and easy to understand
          - Use boxes, arrows, and proper spacing`;
          break;
        case "refactoring-hints":
          prompt = `Analyze this ${selectedLanguage} code and provide specific refactoring suggestions:

          Code: ${input}
          
          Please provide:
          1. Code quality issues identified
          2. Performance optimization opportunities
          3. Maintainability improvements
          4. Specific refactored code examples
          5. Before/after comparisons`;
          break;
        case "code-minifier":
          prompt = `Minify this ${selectedLanguage} code by removing whitespace, comments, and unnecessary characters while preserving functionality:

          Original code: ${input}
          
          Requirements:
          - Remove all unnecessary whitespace and comments
          - Preserve exact functionality
          - Maintain code readability where possible
          - Provide both minified and formatted versions`;
          break;
        case "complexity-score":
          prompt = `Analyze the complexity of this ${selectedLanguage} code:

          Code: ${input}
          
          Please provide:
          1. Overall complexity score (1-100)
          2. Cyclomatic complexity breakdown
          3. Cognitive load analysis
          4. Specific complexity issues identified
          5. Detailed suggestions for simplification
          6. Refactoring recommendations`;
          break;
        case "workflow-automator":
          prompt = `Create a workflow automation script or configuration for this task: "${input}"

          Requirements:
          - Specify trigger conditions
          - Define clear actions and steps
          - Include error handling and rollback procedures
          - Provide monitoring and logging
          - Include configuration examples
          - Add security considerations`;
          break;
        case "auto-documentation":
          prompt = `Generate comprehensive documentation for this ${selectedLanguage} code:

          Code: ${input}
          
          Please provide:
          1. Function/class descriptions
          2. Parameter and return value documentation
          3. Usage examples with different scenarios
          4. Dependencies and requirements
          5. API documentation if applicable
          6. Troubleshooting section`;
          break;
        default:
          prompt = input;
      }

      const result = await callGroqAPI(prompt);
      setOutput(result);
      
      // Save to history
      const historyItem = {
        tool: selectedTool,
        input: input,
        output: result,
        timestamp: new Date()
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 items
      
      toast.success("Code generated successfully!");
    } catch (error) {
      toast.error("Failed to generate code. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
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

  const currentTool = codeTools.find(tool => tool.id === selectedTool);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">AI Code Tools</h1>
          <p className="text-muted-foreground">Comprehensive AI-powered development tools to boost your productivity</p>
        </div>
        <APITest />
      </div>

      {/* Tool Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {codeTools.map((tool) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.id;
          return (
            <Card 
              key={tool.id} 
              className={`cursor-pointer transition-all glow-hover ${
                isSelected ? 'border-primary shadow-glow' : 'hover:border-accent'
              }`}
              onClick={() => setSelectedTool(tool.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 ${tool.color}`} />
                  <h3 className="font-semibold text-xs">{tool.title}</h3>
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
            {/* Language Selection */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  {selectedTool === "code-converter" ? "From Language" : "Language"}
                </label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTool === "code-converter" && (
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">To Language</label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Complexity Threshold for Complexity Analyzer */}
            {selectedTool === "complexity-score" && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Complexity Threshold: {complexityThreshold[0]}
                </label>
                <Slider
                  value={complexityThreshold}
                  onValueChange={setComplexityThreshold}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {/* Input Textarea */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {selectedTool === "snippet-generator" || selectedTool === "image-generator" || selectedTool === "workflow-automator" 
                  ? "Describe what you want to create" 
                  : "Enter your code or description"}
              </label>
              <Textarea
                placeholder={getPlaceholderText(selectedTool)}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[200px] font-mono"
              />
            </div>

            {/* Advanced Options */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs"
              >
                {showAdvanced ? "Hide" : "Show"} Advanced Options
              </Button>
              <div className="text-xs text-muted-foreground">
                {input.length} characters
              </div>
            </div>

            {showAdvanced && (
              <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                <div className="text-sm font-medium">Advanced Options</div>
                <div className="text-xs text-muted-foreground">
                  • Enhanced prompts for better results
                  • Detailed explanations and examples
                  • Production-ready code generation
                  • Comprehensive error analysis
                </div>
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              disabled={isLoading || !input.trim()}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate
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
                <Code className="w-5 h-5" />
                Generated Result
              </span>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="glow-hover"
                  >
                    History ({history.length})
                  </Button>
                )}
                {output && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(output)}
                    className="glow-hover"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
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
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Generated successfully</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your generated result will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getPlaceholderText(toolId: string): string {
  switch (toolId) {
    case "snippet-generator":
      return "e.g., Create a React hook for managing form state with validation";
    case "bug-fixer":
      return "Paste your buggy code here...";
    case "code-explainer":
      return "Paste the code you want explained...";
    case "code-converter":
      return "Paste your code to convert...";
    case "image-generator":
      return "e.g., Database schema with users, posts, and comments tables";
    case "refactoring-hints":
      return "Paste your code for refactoring suggestions...";
    case "code-minifier":
      return "Paste your code to minify...";
    case "complexity-score":
      return "Paste your code for complexity analysis...";
    case "workflow-automator":
      return "e.g., Automatically deploy to staging when PR is merged to develop branch";
    case "auto-documentation":
      return "Paste your code to generate documentation...";
    default:
      return "Enter your input here...";
  }
}
