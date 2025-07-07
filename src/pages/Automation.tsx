import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Workflow, 
  Cloud, 
  GitBranch, 
  Play, 
  Pause, 
  Settings, 
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Server,
  Database,
  Mail,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const automationTypes = [
  {
    id: "workflow",
    title: "Workflow Automator",
    description: "Create custom automation workflows",
    icon: Workflow,
    color: "text-blue-400"
  },
  {
    id: "deployment",
    title: "Smart Deployment",
    description: "AI-managed CI/CD with automated testing",
    icon: Cloud,
    color: "text-green-400"
  },
  {
    id: "cloud-deploy",
    title: "Cloud Deploy",
    description: "One-click cloud deployment simulation",
    icon: Server,
    color: "text-purple-400"
  }
];

const workflowTemplates = [
  {
    name: "Auto Deploy on PR Merge",
    trigger: "Pull Request Merged",
    actions: ["Run Tests", "Build", "Deploy to Staging"],
    status: "active"
  },
  {
    name: "Security Scan on Commit",
    trigger: "Code Committed",
    actions: ["Security Scan", "Send Report", "Block if Critical"],
    status: "active"
  },
  {
    name: "Performance Monitoring",
    trigger: "Deployment Complete",
    actions: ["Run Performance Tests", "Send Metrics", "Alert if Degraded"],
    status: "paused"
  }
];

export default function Automation() {
  const location = useLocation();
  const [selectedType, setSelectedType] = useState("workflow");
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [trigger, setTrigger] = useState("push");
  const [isLoading, setIsLoading] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState("idle");

  // Route-based tool selection
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/automation/workflow")) {
      setSelectedType("workflow");
    } else if (path.includes("/automation/deployment")) {
      setSelectedType("deployment");
    } else if (path.includes("/automation/cloud-deploy")) {
      setSelectedType("cloud-deploy");
    } else {
      setSelectedType("workflow"); // default
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
              content: "You are an expert DevOps automation specialist and CI/CD engineer. Create detailed workflow configurations, deployment scripts, and automation pipelines. Provide comprehensive solutions with error handling, security considerations, and best practices."
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
      return data.choices[0]?.message?.content || "No automation script generated";
    } catch (error) {
      console.error("Groq API Error:", error);
      throw error;
    }
  };

  const handleCreateWorkflow = async () => {
    if (!workflowName.trim() || !workflowDescription.trim()) {
      toast.error("Please provide workflow name and description");
      return;
    }

    setIsLoading(true);

    try {
      const prompt = `Create a comprehensive GitHub Actions or CI/CD workflow configuration:

Workflow Name: ${workflowName}
Description: ${workflowDescription}
Trigger: ${trigger}

Please provide:
1. Complete YAML configuration
2. Environment setup
3. Testing strategy
4. Security scanning
5. Deployment stages
6. Error handling and rollback procedures
7. Notification setup
8. Best practices and security considerations
9. Monitoring and logging configuration`;

      const result = await callGroqAPI(prompt);
      toast.success("Workflow created successfully!");
      
      // Reset form
      setWorkflowName("");
      setWorkflowDescription("");
    } catch (error) {
      toast.error("Failed to create workflow");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateDeployment = async () => {
    setDeploymentStatus("deploying");
    toast.info("Starting deployment simulation...");

    // Simulate deployment steps
    const steps = [
      { name: "Building application", duration: 2000 },
      { name: "Running tests", duration: 3000 },
      { name: "Security scanning", duration: 2500 },
      { name: "Deploying to staging", duration: 3500 },
      { name: "Running smoke tests", duration: 2000 },
      { name: "Promoting to production", duration: 1500 }
    ];

    for (const step of steps) {
      toast.info(step.name);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    setDeploymentStatus("success");
    toast.success("Deployment completed successfully!");
    
    setTimeout(() => setDeploymentStatus("idle"), 3000);
  };

  const generateDeploymentConfig = async () => {
    setIsLoading(true);
    try {
      const prompt = `Create a comprehensive cloud deployment configuration for a modern web application:

Requirements:
1. Multi-environment setup (dev, staging, production)
2. Infrastructure as Code (Terraform/CloudFormation)
3. Container orchestration (Kubernetes/Docker)
4. CI/CD pipeline configuration
5. Monitoring and logging setup
6. Security and compliance considerations
7. Auto-scaling configuration
8. Backup and disaster recovery
9. Cost optimization strategies

Please provide:
- Complete configuration files
- Deployment scripts
- Environment variables setup
- Security best practices
- Monitoring configuration`;

      const result = await callGroqAPI(prompt);
      toast.success("Deployment configuration generated!");
      
      // Here you could save or display the result
      console.log("Generated config:", result);
    } catch (error) {
      toast.error("Failed to generate deployment configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const currentType = automationTypes.find(type => type.id === selectedType);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {selectedType === "workflow" && "Workflow Automator"}
          {selectedType === "deployment" && "Smart Deployment"}
          {selectedType === "cloud-deploy" && "Cloud Deploy"}
          {!["workflow", "deployment", "cloud-deploy"].includes(selectedType) && "Automation Suite"}
        </h1>
        <p className="text-muted-foreground">
          {selectedType === "workflow" && "Create custom automation workflows with AI-powered configuration"}
          {selectedType === "deployment" && "AI-managed CI/CD with automated testing and deployment"}
          {selectedType === "cloud-deploy" && "One-click cloud deployment simulation and management"}
          {!["workflow", "deployment", "cloud-deploy"].includes(selectedType) && "Automate your development workflows and deployments"}
        </p>
      </div>

      {/* Automation Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {automationTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <Card 
              key={type.id} 
              className={`cursor-pointer transition-all glow-hover ${
                isSelected ? 'border-primary shadow-glow' : 'hover:border-accent'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-6 h-6 ${type.color}`} />
                  <h3 className="font-semibold">{type.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{type.description}</p>
                {isSelected && (
                  <Badge className="mt-2 bg-primary text-primary-foreground">Active</Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedType === "workflow" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Workflow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-blue-400" />
                Create New Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Workflow Name</label>
                <Input
                  placeholder="e.g., Auto Deploy on PR Merge"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe what this workflow should do..."
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Trigger</label>
                <Select value={trigger} onValueChange={setTrigger}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="push">On Push</SelectItem>
                    <SelectItem value="pull_request">On Pull Request</SelectItem>
                    <SelectItem value="schedule">On Schedule</SelectItem>
                    <SelectItem value="release">On Release</SelectItem>
                    <SelectItem value="manual">Manual Trigger</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCreateWorkflow}
                disabled={isLoading}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Workflow
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Workflows */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-green-400" />
                Active Workflows
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {workflowTemplates.map((workflow, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{workflow.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={workflow.status === "active" ? "default" : "outline"}>
                        {workflow.status}
                      </Badge>
                      <Switch checked={workflow.status === "active"} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Trigger: {workflow.trigger}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {workflow.actions.map((action, actionIndex) => (
                      <Badge key={actionIndex} variant="outline" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {selectedType === "cloud-deploy" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-purple-400" />
              Cloud Deployment Simulation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Database className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-medium">Database</h3>
                <p className="text-sm text-muted-foreground">PostgreSQL 14</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Server className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-medium">Backend</h3>
                <p className="text-sm text-muted-foreground">Node.js API</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Cloud className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-medium">Frontend</h3>
                <p className="text-sm text-muted-foreground">React App</p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button 
                onClick={simulateDeployment}
                disabled={deploymentStatus === "deploying"}
                className="bg-gradient-primary hover:shadow-glow transition-all"
                size="lg"
              >
                {deploymentStatus === "deploying" ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : deploymentStatus === "success" ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Deployed Successfully
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Deploy to Cloud
                  </>
                )}
              </Button>
              
              <Button 
                onClick={generateDeploymentConfig}
                disabled={isLoading}
                variant="outline"
                className="border-[#444] text-gray-300 hover:text-[#EEEEEE]"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Settings className="w-5 h-5 mr-2" />
                    Generate Config
                  </>
                )}
              </Button>
            </div>

            {deploymentStatus === "success" && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h4 className="font-medium text-green-400">Deployment Successful</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <p>Frontend: https://my-app.vercel.app</p>
                  <p>API: https://api.my-app.com</p>
                  <p>Database: Connected and healthy</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedType === "deployment" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-green-400" />
              Smart CI/CD Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pipeline Stages */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {[
                { name: "Code", icon: GitBranch, status: "completed" },
                { name: "Test", icon: CheckCircle, status: "completed" },
                { name: "Build", icon: Settings, status: "completed" },
                { name: "Security", icon: AlertCircle, status: "running" },
                { name: "Deploy", icon: Cloud, status: "pending" },
                { name: "Monitor", icon: Clock, status: "pending" }
              ].map((stage, index) => (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    stage.status === "completed" ? "bg-green-500/20 text-green-400" :
                    stage.status === "running" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    <stage.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium text-sm">{stage.name}</h4>
                  <Badge variant="outline" className="text-xs mt-1">
                    {stage.status}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Pipeline Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Pipeline Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Trigger:</span>
                    <span>Push to main</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Environment:</span>
                    <span>Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tests Required:</span>
                    <span>Unit, Integration, E2E</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Scan:</span>
                    <span>Enabled</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Notifications</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email on failure</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Slack notifications</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GitHub status checks</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
