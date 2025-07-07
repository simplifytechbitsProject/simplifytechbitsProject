import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Wand2,
  Lightbulb,
  Bug,
  Loader2,
  CheckCircle,
  FileCode,
  Search,
  Replace,
  Maximize,
  Minimize,
  Split,
  GitBranch,
  Terminal as TerminalIcon,
  Palette,
  Zap,
  BarChart3,
  Copy
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const languages = [
  { value: "javascript", label: "JavaScript", defaultCode: `// AI-Powered JavaScript Editor
console.log("Welcome to DevAI Code Editor!");

// Example: Smart Algorithm
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}

// Modern JavaScript features
const asyncExample = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

export { fibonacci, asyncExample };` },
  { value: "typescript", label: "TypeScript", defaultCode: `// TypeScript Advanced Example
interface Developer {
  name: string;
  skills: string[];
  experience: number;
  isRemote: boolean;
}

class DevTeam {
  private members: Developer[] = [];
  
  addMember(developer: Developer): void {
    this.members.push(developer);
    console.log(\`Added \${developer.name} to the team\`);
  }
  
  getSkillCount(skill: string): number {
    return this.members.filter(dev => 
      dev.skills.includes(skill)
    ).length;
  }
  
  get totalExperience(): number {
    return this.members.reduce((sum, dev) => sum + dev.experience, 0);
  }
}

const team = new DevTeam();
team.addMember({
  name: "Alice",
  skills: ["React", "TypeScript", "Node.js"],
  experience: 5,
  isRemote: true
});

console.log(\`React developers: \${team.getSkillCount("React")}\`);` },
  { value: "python", label: "Python", defaultCode: `# Python AI Development Example
import asyncio
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class AIModel:
    name: str
    accuracy: float
    parameters: int
    
    def predict(self, data: List[float]) -> Dict[str, float]:
        # Simulate AI prediction
        prediction = sum(data) / len(data) * self.accuracy
        return {
            "prediction": prediction,
            "confidence": self.accuracy,
            "model": self.name
        }

class ModelManager:
    def __init__(self):
        self.models: List[AIModel] = []
    
    def add_model(self, model: AIModel) -> None:
        self.models.append(model)
        print(f"Added model: {model.name}")
    
    async def batch_predict(self, data: List[List[float]]) -> List[Dict]:
        results = []
        for model in self.models:
            for sample in data:
                result = model.predict(sample)
                results.append(result)
                await asyncio.sleep(0.1)  # Simulate async processing
        return results

# Usage example
manager = ModelManager()
manager.add_model(AIModel("GPT-Model", 0.95, 175000000))
manager.add_model(AIModel("BERT-Model", 0.88, 110000000))

test_data = [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]
# results = asyncio.run(manager.batch_predict(test_data))` },
  { value: "java", label: "Java", defaultCode: `// Java Enterprise Example
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

public class AIDevPlatform {
    private final Map<String, Developer> developers = new ConcurrentHashMap<>();
    private final ExecutorService executor = Executors.newFixedThreadPool(10);
    
    public static class Developer {
        private final String name;
        private final Set<String> skills;
        private final int experience;
        
        public Developer(String name, Set<String> skills, int experience) {
            this.name = name;
            this.skills = new HashSet<>(skills);
            this.experience = experience;
        }
        
        public String getName() { return name; }
        public Set<String> getSkills() { return new HashSet<>(skills); }
        public int getExperience() { return experience; }
        
        @Override
        public String toString() {
            return String.format("Developer{name='%s', skills=%s, experience=%d}", 
                               name, skills, experience);
        }
    }
    
    public CompletableFuture<Void> addDeveloper(Developer developer) {
        return CompletableFuture.runAsync(() -> {
            developers.put(developer.getName(), developer);
            System.out.println("Added: " + developer);
        }, executor);
    }
    
    public List<Developer> findDevelopersBySkill(String skill) {
        return developers.values().stream()
                .filter(dev -> dev.getSkills().contains(skill))
                .collect(Collectors.toList());
    }
    
    public static void main(String[] args) {
        AIDevPlatform platform = new AIDevPlatform();
        
        Developer alice = new Developer("Alice", 
            Set.of("Java", "Spring", "Kubernetes"), 6);
        Developer bob = new Developer("Bob", 
            Set.of("Python", "TensorFlow", "Docker"), 4);
            
        platform.addDeveloper(alice);
        platform.addDeveloper(bob);
        
        System.out.println("Java developers: " + 
            platform.findDevelopersBySkill("Java"));
    }
}` }
];

const themes = [
  { value: "vs-dark", label: "Dark Theme" },
  { value: "vs", label: "Light Theme" },
  { value: "hc-black", label: "High Contrast Dark" },
  { value: "hc-light", label: "High Contrast Light" }
];

const editorSettings = {
  fontSize: [12, 14, 16, 18, 20],
  tabSize: [2, 4, 8],
  wordWrap: ["off", "on", "wordWrapColumn", "bounded"]
};

export default function CodeEditor() {
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(languages[0].defaultCode);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [wordWrap, setWordWrap] = useState("on");
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [showMinimap, setShowMinimap] = useState(true);
  const [enableVim, setEnableVim] = useState(false);
  const [codeAnalysis, setCodeAnalysis] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const editorRef = useRef(null);

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
              content: `You are an expert ${language} programmer and coding assistant. Provide clear, accurate, and helpful responses. Always format code properly and include detailed explanations when requested.`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "No suggestion available";
    } catch (error) {
      console.error("Groq API Error:", error);
      throw error;
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const langConfig = languages.find(l => l.value === newLanguage);
    if (langConfig) {
      setCode(langConfig.defaultCode);
    }
  };

  const getAISuggestion = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first");
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Analyze this ${language} code and provide comprehensive suggestions for improvement:

Code:
${code}

Please provide:
1. Code quality improvements
2. Performance optimizations
3. Best practices recommendations
4. Security considerations
5. Specific code examples for improvements`;
      const suggestion = await callGroqAPI(prompt);
      setAiSuggestion(suggestion);
      setShowSuggestion(true);
      toast.success("AI suggestion generated!");
    } catch (error) {
      toast.error("Failed to get AI suggestion");
    } finally {
      setIsLoading(false);
    }
  };

  const fixCode = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first");
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Fix any bugs, issues, or potential problems in this ${language} code and return the corrected version:

Original Code:
${code}

Requirements:
- Fix syntax errors
- Fix logical errors
- Improve error handling
- Follow ${language} best practices
- Maintain original functionality
- Include comments explaining fixes

Please return only the corrected code without markdown formatting.`;
      const fixedCode = await callGroqAPI(prompt);
      
      const codeMatch = fixedCode.match(/```[\w]*\n([\s\S]*?)\n```/);
      const newCode = codeMatch ? codeMatch[1] : fixedCode;
      
      setCode(newCode);
      toast.success("Code fixed by AI!");
    } catch (error) {
      toast.error("Failed to fix code");
    } finally {
      setIsLoading(false);
    }
  };

  const explainCode = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first");
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Explain this ${language} code in detail:

Code:
${code}

Please provide:
1. Overall purpose and functionality
2. Line-by-line explanation of key parts
3. Data flow and logic explanation
4. Input/output expectations
5. Potential use cases
6. Any important considerations or limitations`;
      const explanation = await callGroqAPI(prompt);
      setAiSuggestion(explanation);
      setShowSuggestion(true);
      toast.success("Code explanation generated!");
    } catch (error) {
      toast.error("Failed to explain code");
    } finally {
      setIsLoading(false);
    }
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${language === "javascript" ? "js" : language === "typescript" ? "ts" : language === "python" ? "py" : language}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Code saved!");
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
      toast.success("Code formatted!");
    }
  };

  const optimizeCode = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first");
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Optimize this ${language} code for better performance, readability, and maintainability:

Code:
${code}

Please provide:
1. Performance optimizations
2. Code structure improvements
3. Memory usage optimizations
4. Readability enhancements
5. Maintainability improvements
6. Return the optimized code`;
      const optimizedCode = await callGroqAPI(prompt);
      
      const codeMatch = optimizedCode.match(/```[\w]*\n([\s\S]*?)\n```/);
      const newCode = codeMatch ? codeMatch[1] : optimizedCode;
      
      setCode(newCode);
      toast.success("Code optimized by AI!");
    } catch (error) {
      toast.error("Failed to optimize code");
    } finally {
      setIsLoading(false);
    }
  };

  const generateTests = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first");
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Generate comprehensive unit tests for this ${language} code:

Code:
${code}

Please provide:
1. Unit tests covering all functions
2. Edge case testing
3. Error handling tests
4. Mock examples if needed
5. Test framework setup instructions
6. Expected test outputs`;
      const tests = await callGroqAPI(prompt);
      setAiSuggestion(tests);
      setShowSuggestion(true);
      toast.success("Test cases generated!");
    } catch (error) {
      toast.error("Failed to generate tests");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCode = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first");
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Perform a comprehensive analysis of this ${language} code:

Code:
${code}

Please provide:
1. Code complexity analysis
2. Potential security vulnerabilities
3. Performance bottlenecks
4. Code smell detection
5. Maintainability score
6. Specific improvement recommendations`;
      const analysis = await callGroqAPI(prompt);
      setCodeAnalysis(analysis);
      setShowAnalysis(true);
      toast.success("Code analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-[#1D1616]' : 'p-4 lg:p-8'} space-y-6`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#EEEEEE] mb-2">
            Advanced Code Editor
          </h1>
          <p className="text-gray-400">Professional IDE with AI-powered assistance</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="border-[#444] text-gray-300 hover:text-[#EEEEEE]"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Advanced Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="bg-[#2A2A2A] border-[#444]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#EEEEEE]">Language & Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="bg-[#1D1616] border-[#444]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="bg-[#1D1616] border-[#444]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-[#2A2A2A] border-[#444]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#EEEEEE]">Editor Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400 w-16">Font Size:</label>
              <Select value={fontSize.toString()} onValueChange={(v) => setFontSize(Number(v))}>
                <SelectTrigger className="bg-[#1D1616] border-[#444]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {editorSettings.fontSize.map(size => (
                    <SelectItem key={size} value={size.toString()}>{size}px</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400 w-16">Tab Size:</label>
              <Select value={tabSize.toString()} onValueChange={(v) => setTabSize(Number(v))}>
                <SelectTrigger className="bg-[#1D1616] border-[#444]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {editorSettings.tabSize.map(size => (
                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2A2A2A] border-[#444]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#EEEEEE]">AI Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={getAISuggestion}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#8E1616] to-[#D84040] hover:from-[#A01818] hover:to-[#E64545] text-white"
              size="sm"
            >
              {isLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1" />}
              AI Suggest
            </Button>
            
            <Button
              variant="outline"
              onClick={fixCode}
              disabled={isLoading}
              className="w-full border-[#444] text-gray-300 hover:text-[#EEEEEE]"
              size="sm"
            >
              <Bug className="w-3 h-3 mr-1" />
              Fix Code
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#2A2A2A] border-[#444]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#EEEEEE]">File Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={saveCode}
              variant="outline"
              className="w-full border-[#444] text-gray-300 hover:text-[#EEEEEE]"
              size="sm"
            >
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            
            <Button
              onClick={formatCode}
              variant="outline"
              className="w-full border-[#444] text-gray-300 hover:text-[#EEEEEE]"
              size="sm"
            >
              <Palette className="w-3 h-3 mr-1" />
              Format
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Editor Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[600px] lg:h-[700px]">
        {/* Editor */}
        <div className="xl:col-span-3">
          <Card className="h-full bg-[#2A2A2A] border-[#444]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#EEEEEE] flex items-center gap-2">
                  <FileCode className="w-5 h-5" />
                  Code Editor
                  <Badge variant="secondary" className="text-xs">{language.toUpperCase()}</Badge>
                </CardTitle>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={explainCode}
                    disabled={isLoading}
                    className="border-[#444] text-gray-300 hover:text-[#EEEEEE]"
                  >
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Explain
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success("Running code simulation...")}
                    className="border-[#444] text-gray-300 hover:text-[#EEEEEE]"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Run
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="h-[calc(100%-80px)]">
              <div className="h-full border border-[#444] rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  theme={theme}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: showMinimap },
                    fontSize: fontSize,
                    tabSize: tabSize,
                    wordWrap: wordWrap as any,
                    lineNumbers: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    renderWhitespace: "selection",
                    bracketPairColorization: { enabled: true },
                    colorDecorators: true,
                    folding: true,
                    foldingHighlight: true,
                    showFoldingControls: "always",
                    unfoldOnClickAfterEndOfLine: true,
                    contextmenu: true,
                    mouseWheelZoom: true,
                    quickSuggestions: true,
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: "on",
                    inlineSuggest: { enabled: true },
                  }}
                  onMount={(editor) => {
                    editorRef.current = editor;
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panels */}
        <div className="space-y-4">
          {/* AI Assistant Panel */}
          <Card className="bg-[#2A2A2A] border-[#444]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#EEEEEE]">
                <Wand2 className="w-5 h-5 text-[#D84040]" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={getAISuggestion}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#8E1616] to-[#D84040] hover:from-[#A01818] hover:to-[#E64545] text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get Suggestion
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={fixCode}
                disabled={isLoading}
                className="w-full border-[#444] text-gray-300 hover:text-[#EEEEEE]"
              >
                <Bug className="w-4 h-4 mr-2" />
                Fix Code
              </Button>
              
              <Button 
                variant="outline"
                onClick={explainCode}
                disabled={isLoading}
                className="w-full border-[#444] text-gray-300 hover:text-[#EEEEEE]"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Explain Code
              </Button>
              
              <Button 
                variant="outline"
                onClick={optimizeCode}
                disabled={isLoading}
                className="w-full border-[#444] text-gray-300 hover:text-[#EEEEEE]"
              >
                <Zap className="w-4 h-4 mr-2" />
                Optimize Code
              </Button>
              
              <Button 
                variant="outline"
                onClick={generateTests}
                disabled={isLoading}
                className="w-full border-[#444] text-gray-300 hover:text-[#EEEEEE]"
              >
                <FileCode className="w-4 h-4 mr-2" />
                Generate Tests
              </Button>
              
              <Button 
                variant="outline"
                onClick={analyzeCode}
                disabled={isLoading}
                className="w-full border-[#444] text-gray-300 hover:text-[#EEEEEE]"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze Code
              </Button>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          {showSuggestion && (
            <Card className="bg-[#2A2A2A] border-[#444]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-[#EEEEEE]">
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#D84040]" />
                    AI Suggestion
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(aiSuggestion);
                        toast.success("Suggestion copied to clipboard!");
                      }}
                      className="text-gray-400 hover:text-[#EEEEEE] border-[#444]"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Try to extract code from suggestion and apply it
                        const codeMatch = aiSuggestion.match(/```[\w]*\n([\s\S]*?)\n```/);
                        if (codeMatch) {
                          setCode(codeMatch[1]);
                          toast.success("Code applied from suggestion!");
                        } else {
                          toast.error("No code found in suggestion to apply");
                        }
                      }}
                      className="text-gray-400 hover:text-[#EEEEEE] border-[#444]"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Apply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSuggestion(false)}
                      className="text-gray-400 hover:text-[#EEEEEE]"
                    >
                      ×
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#1D1616] rounded-lg p-3 border border-[#444]">
                  <pre className="text-sm whitespace-pre-wrap text-gray-300 leading-relaxed">
                    {aiSuggestion}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Code Analysis */}
          {showAnalysis && (
            <Card className="bg-[#2A2A2A] border-[#444]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-[#EEEEEE]">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#D84040]" />
                    Code Analysis
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(codeAnalysis);
                        toast.success("Analysis copied to clipboard!");
                      }}
                      className="text-gray-400 hover:text-[#EEEEEE] border-[#444]"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAnalysis(false)}
                      className="text-gray-400 hover:text-[#EEEEEE]"
                    >
                      ×
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#1D1616] rounded-lg p-3 border border-[#444]">
                  <pre className="text-sm whitespace-pre-wrap text-gray-300 leading-relaxed">
                    {codeAnalysis}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Tools */}
          <Card className="bg-[#2A2A2A] border-[#444]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#EEEEEE]">
                <Settings className="w-5 h-5 text-[#D84040]" />
                Quick Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs border-[#D84040] text-[#D84040]">Pro</Badge>
                  <p className="text-gray-300">AI-powered autocomplete</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs border-[#D84040] text-[#D84040]">Smart</Badge>
                  <p className="text-gray-300">Real-time error detection</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs border-[#D84040] text-[#D84040]">AI</Badge>
                  <p className="text-gray-300">Intelligent code suggestions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
