import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  GitBranch,
  Database,
  Cloud,
  Cpu,
  HardDrive,
  Network,
  Target
} from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ComposedChart
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const performanceData = [
  { name: "Jan", bugs: 45, fixes: 38, deploys: 12, performance: 85 },
  { name: "Feb", bugs: 52, fixes: 48, deploys: 15, performance: 88 },
  { name: "Mar", bugs: 38, fixes: 42, deploys: 18, performance: 92 },
  { name: "Apr", bugs: 41, fixes: 39, deploys: 14, performance: 89 },
  { name: "May", bugs: 33, fixes: 35, deploys: 22, performance: 94 },
  { name: "Jun", bugs: 28, fixes: 31, deploys: 19, performance: 96 }
];

const codeQualityData = [
  { subject: "Security", A: 85, B: 90, fullMark: 100 },
  { subject: "Performance", A: 92, B: 88, fullMark: 100 },
  { subject: "Maintainability", A: 78, B: 85, fullMark: 100 },
  { subject: "Reliability", A: 88, B: 82, fullMark: 100 },
  { subject: "Coverage", A: 95, B: 89, fullMark: 100 },
  { subject: "Documentation", A: 82, B: 78, fullMark: 100 }
];

const deploymentData = [
  { name: "Production", value: 45, color: "#8E1616" },
  { name: "Staging", value: 30, color: "#D84040" },
  { name: "Development", value: 15, color: "#FF6B6B" },
  { name: "Testing", value: 10, color: "#FFB3B3" }
];

const systemMetrics = [
  { time: "00:00", cpu: 45, memory: 62, disk: 78, network: 23 },
  { time: "04:00", cpu: 52, memory: 58, disk: 80, network: 31 },
  { time: "08:00", cpu: 78, memory: 75, disk: 82, network: 65 },
  { time: "12:00", cpu: 85, memory: 82, disk: 84, network: 78 },
  { time: "16:00", cpu: 72, memory: 68, disk: 86, network: 52 },
  { time: "20:00", cpu: 58, memory: 64, disk: 88, network: 38 }
];

const teamProductivity = [
  { developer: "Alice", commits: 245, reviews: 32, bugs: 8 },
  { developer: "Bob", commits: 198, reviews: 28, bugs: 12 },
  { developer: "Charlie", commits: 312, reviews: 45, bugs: 5 },
  { developer: "Diana", commits: 276, reviews: 38, bugs: 7 },
  { developer: "Eve", commits: 189, reviews: 24, bugs: 15 }
];

const chartConfig = {
  bugs: { label: "Bugs", color: "#D84040" },
  fixes: { label: "Fixes", color: "#8E1616" },
  deploys: { label: "Deploys", color: "#4ADE80" },
  performance: { label: "Performance", color: "#3B82F6" },
  cpu: { label: "CPU", color: "#8E1616" },
  memory: { label: "Memory", color: "#D84040" },
  disk: { label: "Disk", color: "#F59E0B" },
  network: { label: "Network", color: "#10B981" }
};

export default function Dashboard() {
  const [realTimeStats, setRealTimeStats] = useState({
    activeUsers: 12,
    deploymentsToday: 8,
    bugsFixed: 23,
    codeQuality: 94
  });

  // --- Quick Actions Demo States ---
  // Generate Code
  const [codePrompt, setCodePrompt] = useState("");
  const [codeResult, setCodeResult] = useState("");
  const [codeLang, setCodeLang] = useState("react");
  // Security Scan
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  // Deploy
  const [deploying, setDeploying] = useState(false);
  const [deployDone, setDeployDone] = useState(false);
  const [deployEnv, setDeployEnv] = useState("production");
  const [deployLogs, setDeployLogs] = useState([]);
  // Analytics
  const [showChart, setShowChart] = useState(false);
  const [analyticsType, setAnalyticsType] = useState("bar");
  // Data Model
  const [showModel, setShowModel] = useState(false);
  // Monitor
  const [monitorMetrics, setMonitorMetrics] = useState({ cpu: 45, disk: 78, memory: 62, network: 23 });
  const [monitorLoading, setMonitorLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        deploymentsToday: prev.deploymentsToday + (Math.random() > 0.8 ? 1 : 0),
        bugsFixed: prev.bugsFixed + (Math.random() > 0.9 ? 1 : 0),
        codeQuality: Math.max(85, Math.min(100, prev.codeQuality + (Math.random() - 0.5) * 2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Development Dashboard</h1>
        <p className="text-muted-foreground">Monitor your development metrics and system performance</p>
      </div>

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-primary border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground">Active Users</CardTitle>
            <Users className="h-4 w-4 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-foreground">{realTimeStats.activeUsers}</div>
            <p className="text-xs text-primary-foreground/70">+2.5% from last hour</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-accent border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent-foreground">Deployments Today</CardTitle>
            <Cloud className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">{realTimeStats.deploymentsToday}</div>
            <p className="text-xs text-accent-foreground/70">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugs Fixed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{realTimeStats.bugsFixed}</div>
            <p className="text-xs text-muted-foreground">+8% efficiency</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Quality</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{realTimeStats.codeQuality.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Above target</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Development Performance Trends */}
        <Card className="w-full max-w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Development Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full max-w-full min-h-[300px]">
              <ComposedChart data={performanceData} width={undefined} height={undefined}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="bugs" fill="var(--color-bugs)" />
                <Bar dataKey="fixes" fill="var(--color-fixes)" />
                <Line type="monotone" dataKey="performance" stroke="var(--color-performance)" strokeWidth={3} />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* System Resource Usage */}
        <Card className="w-full max-w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              System Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full max-w-full min-h-[300px]">
              <AreaChart data={systemMetrics} width={undefined} height={undefined}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area type="monotone" dataKey="cpu" stackId="1" stroke="var(--color-cpu)" fill="var(--color-cpu)" fillOpacity={0.6} />
                <Area type="monotone" dataKey="memory" stackId="1" stroke="var(--color-memory)" fill="var(--color-memory)" fillOpacity={0.6} />
                <Area type="monotone" dataKey="disk" stackId="1" stroke="var(--color-disk)" fill="var(--color-disk)" fillOpacity={0.6} />
                <Area type="monotone" dataKey="network" stackId="1" stroke="var(--color-network)" fill="var(--color-network)" fillOpacity={0.6} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Code Quality Radar */}
        <Card className="w-full max-w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Code Quality Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full max-w-full min-h-[300px]">
              <RadarChart data={codeQualityData} width={undefined} height={undefined}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" className="text-xs" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                <Radar name="Current" dataKey="A" stroke="#8E1616" fill="#8E1616" fillOpacity={0.3} strokeWidth={2} />
                <Radar name="Target" dataKey="B" stroke="#D84040" fill="#D84040" fillOpacity={0.2} strokeWidth={2} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Deployment Distribution */}
        <Card className="w-full max-w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-purple-400" />
              Deployment Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full max-w-full min-h-[300px]">
              <PieChart width={undefined} height={undefined}>
                <Pie
                  data={deploymentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {deploymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Team Productivity Scatter */}
        <Card className="w-full max-w-full md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-yellow-400" />
              Team Productivity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full max-w-full min-h-[300px]">
              <ScatterChart data={teamProductivity} width={undefined} height={undefined}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="commits" name="Commits" />
                <YAxis dataKey="reviews" name="Reviews" />
                <Scatter dataKey="bugs" fill="#D84040" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </ScatterChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Code Quality and Performance Scores */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <Target className="w-6 h-6 text-accent" />
            Code Quality and Performance Scores
          </h2>
          <p className="text-muted-foreground mb-4">
            Comprehensive metrics tracking code quality, test coverage, security, and performance indicators
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Quality Metrics */}
          <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                📊 Code Quality Metrics
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time tracking of code quality indicators and performance scores
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bars */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Code Quality
                    </span>
                    <span className="text-lg font-bold text-blue-500">92%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Test Coverage
                    </span>
                    <span className="text-lg font-bold text-green-500">87%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{ width: '87%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      Security Score
                    </span>
                    <span className="text-lg font-bold text-red-500">95%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500" style={{ width: '95%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      Performance
                    </span>
                    <span className="text-lg font-bold text-yellow-500">89%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500" style={{ width: '89%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      Maintainability
                    </span>
                    <span className="text-lg font-bold text-purple-500">91%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500" style={{ width: '91%' }}></div>
                  </div>
                </div>
              </div>

              {/* Quality Summary */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">📈 Quality Insights:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Code quality exceeds industry standards (92%)</li>
                  <li>• Test coverage needs improvement (target: 90%)</li>
                  <li>• Security score is excellent (95%)</li>
                  <li>• Performance optimization recommended</li>
                  <li>• Maintainability score is strong (91%)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                📋 Recent Development Activities
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Latest tasks, updates, and development activities
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Task Items */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Fixed authentication bug</span>
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          completed
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Generated API documentation</span>
                        <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          completed
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Deployed to production</span>
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                          completed
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">6 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Security scan in progress</span>
                        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                          in-progress
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Code review pending</span>
                        <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
                          pending
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">30 minutes ago</p>
                    </div>
                  </div>
                </div>

                {/* Activity Summary */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">📊 Activity Summary:</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="ml-2 font-semibold text-green-400">3 tasks</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">In Progress:</span>
                      <span className="ml-2 font-semibold text-yellow-400">1 task</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="ml-2 font-semibold text-gray-400">1 task</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="ml-2 font-semibold text-blue-400">75%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="glass-effect border-none shadow-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 gradient-text text-2xl md:text-3xl">
            <Zap className="w-6 h-6 text-accent animate-pulse" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-[#232323] mb-4 rounded-lg overflow-hidden">
              <TabsTrigger value="generate" className="flex items-center gap-2 text-xs md:text-sm"><Code className="w-4 h-4" /> Generate Code</TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 text-xs md:text-sm"><Shield className="w-4 h-4" /> Security Scan</TabsTrigger>
              <TabsTrigger value="deploy" className="flex items-center gap-2 text-xs md:text-sm"><Cloud className="w-4 h-4" /> Deploy</TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs md:text-sm"><BarChart3 className="w-4 h-4" /> Analytics</TabsTrigger>
              <TabsTrigger value="datamodel" className="flex items-center gap-2 text-xs md:text-sm"><Database className="w-4 h-4" /> Data Model</TabsTrigger>
              <TabsTrigger value="monitor" className="flex items-center gap-2 text-xs md:text-sm"><Activity className="w-4 h-4" /> Monitor</TabsTrigger>
            </TabsList>
            {/* Generate Code Tab */}
            <TabsContent value="generate">
              <div className="p-4 rounded-md bg-gradient-to-br from-[#18181b] to-[#232323] border border-[#232323] flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <div className="font-semibold flex items-center gap-2 text-lg"><Code className="w-5 h-5 text-accent" /> AI Code Generator</div>
                  <select className="ml-auto bg-[#232323] text-xs rounded px-2 py-1 border border-accent text-accent-foreground" value={codeLang} onChange={e => setCodeLang(e.target.value)}>
                    <option value="react">React</option>
                    <option value="js">JavaScript</option>
                    <option value="ts">TypeScript</option>
                    <option value="py">Python</option>
                    <option value="go">Go</option>
                  </select>
                </div>
                <textarea
                  className="bg-[#232323] p-2 rounded text-xs font-mono resize-none text-foreground border border-muted"
                  rows={3}
                  placeholder="Describe what you want to generate..."
                  value={codePrompt}
                  onChange={e => setCodePrompt(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" className="w-fit gradient-text" onClick={() => setCodeResult('// Button component generated!\nexport function Button() {\n  return <button className=\"px-4 py-2 bg-blue-600 text-white rounded\">Click me</button>\n}')}>
                    Generate
            </Button>
                  {codeResult && <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(codeResult)}>Copy</Button>}
                </div>
                {codeResult && (
                  <pre className="bg-[#232323] p-3 rounded text-xs font-mono mt-2 overflow-x-auto text-green-400 border border-accent animate-fade-in">{codeResult}</pre>
                )}
              </div>
            </TabsContent>
            {/* Security Scan Tab */}
            <TabsContent value="security">
              <div className="p-4 rounded-md bg-gradient-to-br from-[#18181b] to-[#232323] border border-[#232323] flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <div className="font-semibold flex items-center gap-2 text-lg"><Shield className="w-5 h-5 text-accent" /> Security Scan</div>
                  <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">Healthy</Badge>
                </div>
                <Button
                  size="sm"
                  className="w-fit gradient-text"
                  disabled={scanLoading}
                  onClick={() => {
                    setScanLoading(true);
                    setScanResult(null);
                    setTimeout(() => {
                      setScanResult({
                        status: 'ok',
                        files: 128,
                        time: '2.1s',
                        warnings: ["Outdated dependency: react@17.0.0"],
                        details: [
                          { file: 'src/App.tsx', issue: 'Potential XSS in input', severity: 'warning' },
                          { file: 'src/pages/Dashboard.tsx', issue: 'Unused variable', severity: 'info' }
                        ]
                      });
                      setScanLoading(false);
                    }, 1500);
                  }}
                >
                  {scanLoading ? 'Scanning...' : 'Scan'}
            </Button>
                {scanResult && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex gap-4 text-xs">
                      <span>Files Scanned: <b>{scanResult.files}</b></span>
                      <span>Time: <b>{scanResult.time}</b></span>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      {scanResult.details.map((d, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-muted">
                          <AccordionTrigger className="text-xs flex gap-2">
                            <span className={d.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'}>{d.severity.toUpperCase()}</span>
                            <span>{d.file}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="text-xs">{d.issue}</div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    <Button size="sm" variant="outline" onClick={() => alert('Report downloaded!')}>Download Report</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            {/* Deploy Tab */}
            <TabsContent value="deploy">
              <div className="p-4 rounded-md bg-gradient-to-br from-[#18181b] to-[#232323] border border-[#232323] flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <div className="font-semibold flex items-center gap-2 text-lg"><Cloud className="w-5 h-5 text-accent" /> Deploy</div>
                  <select className="ml-auto bg-[#232323] text-xs rounded px-2 py-1 border border-accent text-accent-foreground" value={deployEnv} onChange={e => setDeployEnv(e.target.value)}>
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="dev">Development</option>
                  </select>
                </div>
                <Button
                  size="sm"
                  className="w-fit gradient-text"
                  disabled={deploying || deployDone}
                  onClick={() => {
                    setDeploying(true);
                    setDeployDone(false);
                    setDeployLogs([]);
                    setTimeout(() => {
                      setDeploying(false);
                      setDeployDone(true);
                      setDeployLogs([
                        `[${new Date().toLocaleTimeString()}] Connecting to ${deployEnv}...`,
                        `[${new Date().toLocaleTimeString()}] Uploading files...`,
                        `[${new Date().toLocaleTimeString()}] Deploy complete!`]);
                    }, 1800);
                  }}
                >
                  {deploying ? 'Deploying...' : deployDone ? 'Deployed!' : 'Deploy Now'}
            </Button>
                <div className="w-full bg-[#232323] rounded h-2 mb-2 overflow-hidden">
                  <div
                    className={`bg-accent h-2 transition-all duration-700 ${deploying ? 'w-2/3 animate-pulse' : deployDone ? 'w-full' : 'w-0'}`}
                  ></div>
                </div>
                {deployLogs.length > 0 && (
                  <Accordion type="single" collapsible className="w-full animate-fade-in">
                    <AccordionItem value="logs">
                      <AccordionTrigger className="text-xs">Deployment Logs</AccordionTrigger>
                      <AccordionContent>
                        <ul className="text-xs space-y-1">
                          {deployLogs.map((log, i) => <li key={i}>{log}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
                {deployDone && <div className="text-green-400 text-xs mt-1 flex items-center gap-2"><CheckCircle className="w-4 h-4 animate-bounce" /> Deployment Successful!</div>}
              </div>
            </TabsContent>
            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="p-4 rounded-md bg-gradient-to-br from-[#18181b] to-[#232323] border border-[#232323] flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <div className="font-semibold flex items-center gap-2 text-lg"><BarChart3 className="w-5 h-5 text-accent" /> Analytics</div>
                  <select className="ml-auto bg-[#232323] text-xs rounded px-2 py-1 border border-accent text-accent-foreground" value={analyticsType} onChange={e => setAnalyticsType(e.target.value)}>
                    <option value="bar">Bar</option>
                    <option value="line">Line</option>
                    <option value="pie">Pie</option>
                  </select>
                </div>
                <Button size="sm" className="w-fit gradient-text" onClick={() => setShowChart(v => !v)}>
                  {showChart ? 'Hide Chart' : 'Show Chart'}
            </Button>
                {showChart && (
                  <div className="w-full h-40 mt-2 animate-fade-in">
                    <ResponsiveContainer width="100%" height="100%">
                      {analyticsType === 'bar' && (
                        <BarChart data={[{ name: 'Jan', users: 40 }, { name: 'Feb', users: 55 }, { name: 'Mar', users: 70 }]}> 
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Bar dataKey="users" fill="#4ADE80" />
                        </BarChart>
                      )}
                      {analyticsType === 'line' && (
                        <LineChart data={[{ name: 'Jan', users: 40 }, { name: 'Feb', users: 55 }, { name: 'Mar', users: 70 }]}> 
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Line type="monotone" dataKey="users" stroke="#4ADE80" strokeWidth={2} />
                        </LineChart>
                      )}
                      {analyticsType === 'pie' && (
                        <PieChart>
                          <Pie data={[{ name: 'Jan', value: 40 }, { name: 'Feb', value: 55 }, { name: 'Mar', value: 70 }]} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#4ADE80" label />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </TabsContent>
            {/* Data Model Tab */}
            <TabsContent value="datamodel">
              <div className="p-4 rounded-md bg-gradient-to-br from-[#18181b] to-[#232323] border border-[#232323] flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <div className="font-semibold flex items-center gap-2 text-lg"><Database className="w-5 h-5 text-accent" /> Data Model</div>
                  <Button size="sm" variant="outline" className="ml-auto" onClick={() => alert('Schema downloaded!')}>Download Schema</Button>
                </div>
                <Button size="sm" className="w-fit gradient-text" onClick={() => setShowModel(v => !v)}>
                  {showModel ? 'Hide Model' : 'Preview Model'}
            </Button>
                {showModel && (
                  <div className="flex flex-col md:flex-row gap-4 animate-fade-in">
                    <pre className="bg-[#232323] p-3 rounded text-xs font-mono overflow-x-auto text-blue-400 border border-accent min-w-[200px]">{`User (id, name, email)
  |
  |--< Post (id, userId, content)
         |
         |--< Comment (id, postId, text)
`}</pre>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="user">
                        <AccordionTrigger className="text-xs">User Table</AccordionTrigger>
                        <AccordionContent>
                          <div className="text-xs">id: int, name: string, email: string</div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="post">
                        <AccordionTrigger className="text-xs">Post Table</AccordionTrigger>
                        <AccordionContent>
                          <div className="text-xs">id: int, userId: int, content: text</div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="comment">
                        <AccordionTrigger className="text-xs">Comment Table</AccordionTrigger>
                        <AccordionContent>
                          <div className="text-xs">id: int, postId: int, text: text</div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </div>
            </TabsContent>
            {/* Monitor Tab */}
            <TabsContent value="monitor">
              <div className="p-4 rounded-md bg-gradient-to-br from-[#18181b] to-[#232323] border border-[#232323] flex flex-col gap-4 animate-fade-in">
                <div className="font-semibold flex items-center gap-2 text-lg"><Activity className="w-5 h-5 text-accent" /> Monitor</div>
                <Button
                  size="sm"
                  className="w-fit gradient-text"
                  disabled={monitorLoading}
                  onClick={() => {
                    setMonitorLoading(true);
                    setTimeout(() => {
                      setMonitorMetrics({
                        cpu: Math.floor(30 + Math.random() * 60),
                        disk: Math.floor(60 + Math.random() * 30),
                        memory: Math.floor(50 + Math.random() * 40),
                        network: Math.floor(10 + Math.random() * 80)
                      });
                      setMonitorLoading(false);
                    }, 1000);
                  }}
                >
                  {monitorLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full mt-2">
                  <div className="flex flex-col items-center bg-[#232323] rounded p-2">
                    <Cpu className="w-4 h-4 text-blue-400 mb-1" />
                    <span className="text-xs">CPU</span>
                    <span className="font-mono text-green-400">{monitorMetrics.cpu}%</span>
                  </div>
                  <div className="flex flex-col items-center bg-[#232323] rounded p-2">
                    <HardDrive className="w-4 h-4 text-yellow-400 mb-1" />
                    <span className="text-xs">Disk</span>
                    <span className="font-mono text-green-400">{monitorMetrics.disk}%</span>
                  </div>
                  <div className="flex flex-col items-center bg-[#232323] rounded p-2">
                    <BarChart3 className="w-4 h-4 text-accent mb-1" />
                    <span className="text-xs">Memory</span>
                    <span className="font-mono text-green-400">{monitorMetrics.memory}%</span>
                  </div>
                  <div className="flex flex-col items-center bg-[#232323] rounded p-2">
                    <Network className="w-4 h-4 text-purple-400 mb-1" />
                    <span className="text-xs">Network</span>
                    <span className="font-mono text-green-400">{monitorMetrics.network} Mbps</span>
                  </div>
                </div>
          </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                System Status
              </span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Healthy</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">API Response Time</span>
              <span className="text-sm font-mono text-green-400">127ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Database Connection</span>
              <span className="text-sm font-mono text-green-400">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cache Hit Rate</span>
              <span className="text-sm font-mono text-green-400">94.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Code deployed to production</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm">Security scan completed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm">Bug fix in progress</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Alerts & Warnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">Warning</Badge>
              <span className="text-sm">High memory usage detected</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-blue-400 border-blue-400/30">Info</Badge>
              <span className="text-sm">Scheduled maintenance in 2 days</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
