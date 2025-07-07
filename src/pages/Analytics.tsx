
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Calendar as CalendarIcon,
  Filter,
  Download,
  RefreshCw,
  Users,
  Code,
  Bug,
  Zap,
  Clock,
  Target,
  Info
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
import { format } from "date-fns";

// Sample data for analytics
const dailyMetrics = [
  { date: "2024-01-01", commits: 12, bugs: 3, deploys: 2, users: 45, codeQuality: 85 },
  { date: "2024-01-02", commits: 18, bugs: 1, deploys: 1, users: 52, codeQuality: 87 },
  { date: "2024-01-03", commits: 15, bugs: 4, deploys: 3, users: 48, codeQuality: 83 },
  { date: "2024-01-04", commits: 22, bugs: 2, deploys: 2, users: 61, codeQuality: 89 },
  { date: "2024-01-05", commits: 19, bugs: 5, deploys: 1, users: 55, codeQuality: 81 },
  { date: "2024-01-06", commits: 25, bugs: 1, deploys: 4, users: 67, codeQuality: 92 },
  { date: "2024-01-07", commits: 21, bugs: 3, deploys: 2, users: 59, codeQuality: 88 }
];

const performanceMetrics = [
  { name: "API Response", value: 145, unit: "ms", status: "good" },
  { name: "Database Query", value: 23, unit: "ms", status: "excellent" },
  { name: "Build Time", value: 180, unit: "s", status: "good" },
  { name: "Bundle Size", value: 2.4, unit: "MB", status: "warning" },
  { name: "Test Coverage", value: 87, unit: "%", status: "good" },
  { name: "Code Quality", value: 92, unit: "%", status: "excellent" }
];

const teamProductivity = [
  { developer: "Alice", commits: 89, reviews: 15, bugs: 3, score: 94 },
  { developer: "Bob", commits: 76, reviews: 12, bugs: 7, score: 87 },
  { developer: "Charlie", commits: 102, reviews: 18, bugs: 2, score: 96 },
  { developer: "Diana", commits: 65, reviews: 9, bugs: 5, score: 82 },
  { developer: "Eve", commits: 71, reviews: 11, bugs: 4, score: 85 }
];

const deploymentHistory = [
  { date: "2024-01-01", environment: "Production", status: "success", duration: 145 },
  { date: "2024-01-01", environment: "Staging", status: "success", duration: 89 },
  { date: "2024-01-02", environment: "Development", status: "failed", duration: 67 },
  { date: "2024-01-02", environment: "Production", status: "success", duration: 132 },
  { date: "2024-01-03", environment: "Staging", status: "success", duration: 95 }
];

const chartConfig = {
  commits: { label: "Commits", color: "#8E1616" },
  bugs: { label: "Bugs", color: "#D84040" },
  deploys: { label: "Deploys", color: "#4ADE80" },
  users: { label: "Users", color: "#3B82F6" },
  codeQuality: { label: "Code Quality", color: "#F59E0B" }
};

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [dateFilter, setDateFilter] = useState("7d");
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [liveStats, setLiveStats] = useState({
    activeUsers: 156,
    deploymentsToday: 12,
    bugsFixed: 34,
    codeQuality: 89,
    responseTime: 145,
    uptime: 99.8
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        deploymentsToday: prev.deploymentsToday + (Math.random() > 0.9 ? 1 : 0),
        bugsFixed: prev.bugsFixed + (Math.random() > 0.95 ? 1 : 0),
        codeQuality: Math.max(80, Math.min(100, prev.codeQuality + (Math.random() - 0.5) * 2)),
        responseTime: Math.max(100, Math.min(300, prev.responseTime + (Math.random() - 0.5) * 20)),
        uptime: Math.max(99.0, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Enhanced Header */}
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">📊 Analytics Dashboard</h1>
            <p className="text-lg text-muted-foreground mb-2">Comprehensive development insights and performance metrics</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Data
              </span>
              <span>•</span>
              <span>Real-time monitoring</span>
              <span>•</span>
              <span>Performance tracking</span>
            </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="glow-hover">
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
          </Button>
          <Button variant="outline" className="glow-hover">
            <Download className="w-4 h-4 mr-2" />
              Export Report
          </Button>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Key Performance Indicators
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>System Health: Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Team Velocity: High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Code Quality: Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Deployment Success: 98%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Live Stats */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          Real-Time Metrics
        </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-primary" />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
              <div className="text-2xl font-bold text-primary mb-1">{liveStats.activeUsers}</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
              <div className="text-xs text-green-400 mt-1">+12% from yesterday</div>
          </CardContent>
        </Card>

          <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 hover:border-accent/50 transition-all duration-300">
          <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-accent" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
              <div className="text-2xl font-bold text-accent mb-1">{liveStats.deploymentsToday}</div>
              <div className="text-xs text-muted-foreground">Deployments Today</div>
              <div className="text-xs text-blue-400 mt-1">98% success rate</div>
          </CardContent>
        </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30 hover:border-green-500/50 transition-all duration-300">
          <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Bug className="w-5 h-5 text-green-500" />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
              <div className="text-2xl font-bold text-green-500 mb-1">{liveStats.bugsFixed}</div>
              <div className="text-xs text-muted-foreground">Bugs Fixed</div>
              <div className="text-xs text-green-400 mt-1">This week</div>
          </CardContent>
        </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300">
          <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-blue-500" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
              <div className="text-2xl font-bold text-blue-500 mb-1">{liveStats.codeQuality.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Code Quality</div>
              <div className="text-xs text-blue-400 mt-1">Above industry avg</div>
          </CardContent>
        </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300">
          <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
              <div className="text-2xl font-bold text-yellow-500 mb-1">{Math.round(liveStats.responseTime)}ms</div>
              <div className="text-xs text-muted-foreground">Response Time</div>
              <div className="text-xs text-yellow-400 mt-1">Optimal performance</div>
          </CardContent>
        </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
          <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 text-purple-500" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
              <div className="text-2xl font-bold text-purple-500 mb-1">{liveStats.uptime.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">System Uptime</div>
              <div className="text-xs text-purple-400 mt-1">99.9% SLA met</div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card className="bg-gradient-to-r from-muted/50 to-muted/30 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-accent" />
            Advanced Analytics Filters
          </CardTitle>
          <p className="text-sm text-muted-foreground">Customize your analytics view with detailed filtering options</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">📅 Date Range</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="bg-[#1D1616] border-[#444] hover:border-accent/50 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select time period for analysis</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">🎯 Status Filter</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-[#1D1616] border-[#444] hover:border-accent/50 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">✅ Success</SelectItem>
                  <SelectItem value="failed">❌ Failed</SelectItem>
                  <SelectItem value="pending">⏳ Pending</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Filter by deployment status</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">👥 Team Member</label>
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="bg-[#1D1616] border-[#444] hover:border-accent/50 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  <SelectItem value="alice">👩‍💻 Alice (Frontend)</SelectItem>
                  <SelectItem value="bob">👨‍💻 Bob (Backend)</SelectItem>
                  <SelectItem value="charlie">👨‍💻 Charlie (DevOps)</SelectItem>
                  <SelectItem value="diana">👩‍💻 Diana (QA)</SelectItem>
                  <SelectItem value="eve">👩‍💻 Eve (Full Stack)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Filter by team member</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">📆 Custom Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-[#1D1616] border-[#444] hover:border-accent/50 transition-colors justify-start text-left font-normal w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">Select specific date</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-accent" />
              <span className="font-medium">Filter Tips:</span>
            </div>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>• Use date filters to analyze trends over time</li>
              <li>• Status filters help identify deployment patterns</li>
              <li>• Team filters show individual performance metrics</li>
              <li>• Custom dates allow for specific event analysis</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-[#2A2A2A]">
          <TabsTrigger value="overview" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <BarChart3 className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">📊 Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">⚡ Performance</span>
            <span className="sm:hidden">Perf</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Users className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">👥 Team</span>
            <span className="sm:hidden">Team</span>  
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <CalendarIcon className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">📅 Calendar</span>
            <span className="sm:hidden">Cal</span>
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Overview Header */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              📊 Development Overview Dashboard
            </h2>
            <p className="text-muted-foreground mb-4">
              Comprehensive analysis of development metrics, trends, and key performance indicators
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Trending Up</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Stable Performance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Quality Focus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Team Collaboration</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  📈 Development Trends Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track commits, bugs, and code quality over time to identify patterns and improvements
                </p>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px]">
                  <ComposedChart data={dailyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), "MMM dd")} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="commits" fill="var(--color-commits)" />
                    <Bar dataKey="bugs" fill="var(--color-bugs)" />
                    <Line type="monotone" dataKey="codeQuality" stroke="var(--color-codeQuality)" strokeWidth={3} />
                  </ComposedChart>
                </ChartContainer>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">📊 Key Insights:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Commit frequency shows consistent development activity</li>
                    <li>• Bug count remains low with good quality control</li>
                    <li>• Code quality maintains high standards</li>
                    <li>• Team productivity is trending upward</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  👥 User Activity & Engagement
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monitor user engagement patterns and system usage to optimize performance
                </p>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px]">
                  <AreaChart data={dailyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), "MMM dd")} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="users" stroke="var(--color-users)" fill="var(--color-users)" fillOpacity={0.6} />
                  </AreaChart>
                </ChartContainer>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">🎯 Activity Insights:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• User engagement shows steady growth</li>
                    <li>• Peak usage during business hours</li>
                    <li>• Weekend activity indicates remote work</li>
                    <li>• System handles load efficiently</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Success Rate</span>
                </div>
                <div className="text-2xl font-bold text-green-500">98.5%</div>
                <p className="text-xs text-muted-foreground">Deployment success rate</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Velocity</span>
                </div>
                <div className="text-2xl font-bold text-blue-500">High</div>
                <p className="text-xs text-muted-foreground">Team development velocity</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Satisfaction</span>
                </div>
                <div className="text-2xl font-bold text-purple-500">4.8/5</div>
                <p className="text-xs text-muted-foreground">Developer satisfaction</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Enhanced Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Performance Header */}
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-6 border border-accent/20">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              ⚡ Performance Analytics Dashboard
            </h2>
            <p className="text-muted-foreground mb-4">
              Detailed analysis of system performance, response times, and optimization opportunities
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Optimal Response</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Efficient Queries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Build Optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Quality Metrics</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="bg-gradient-to-br from-muted/30 to-muted/10 border-border/50 hover:border-accent/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      {metric.name === 'API Response' && '🚀'}
                      {metric.name === 'Database Query' && '🗄️'}
                      {metric.name === 'Build Time' && '⚙️'}
                      {metric.name === 'Bundle Size' && '📦'}
                      {metric.name === 'Test Coverage' && '🧪'}
                      {metric.name === 'Code Quality' && '✨'}
                      {metric.name}
                    </h3>
                    <Badge variant="outline" className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold mb-3 text-primary">
                    {metric.value}{metric.unit}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {metric.status === 'excellent' && '🎉 Excellent performance - exceeding expectations'}
                    {metric.status === 'good' && '✅ Good performance - within acceptable range'}
                    {metric.status === 'warning' && '⚠️ Needs attention - consider optimization'}
                    {metric.status === 'critical' && '🚨 Critical issue - immediate action required'}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <h4 className="font-semibold text-xs mb-2">📊 Performance Details:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {metric.name === 'API Response' && (
                        <>
                          <li>• Target: &lt; 200ms</li>
                          <li>• Current: 145ms (Excellent)</li>
                          <li>• 99th percentile: 180ms</li>
                        </>
                      )}
                      {metric.name === 'Database Query' && (
                        <>
                          <li>• Target: &lt; 50ms</li>
                          <li>• Current: 23ms (Excellent)</li>
                          <li>• Index optimization active</li>
                        </>
                      )}
                      {metric.name === 'Build Time' && (
                        <>
                          <li>• Target: &lt; 300s</li>
                          <li>• Current: 180s (Good)</li>
                          <li>• Parallel processing enabled</li>
                        </>
                      )}
                      {metric.name === 'Bundle Size' && (
                        <>
                          <li>• Target: &lt; 2MB</li>
                          <li>• Current: 2.4MB (Warning)</li>
                          <li>• Tree shaking recommended</li>
                        </>
                      )}
                      {metric.name === 'Test Coverage' && (
                        <>
                          <li>• Target: &gt; 80%</li>
                          <li>• Current: 87% (Good)</li>
                          <li>• Unit tests comprehensive</li>
                        </>
                      )}
                      {metric.name === 'Code Quality' && (
                        <>
                          <li>• Target: &gt; 85%</li>
                          <li>• Current: 92% (Excellent)</li>
                          <li>• Linting rules enforced</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Summary */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                📈 Performance Summary & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">🎯 Key Achievements:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✅ API response time consistently under 200ms</li>
                    <li>✅ Database queries optimized with proper indexing</li>
                    <li>✅ Test coverage exceeds industry standards</li>
                    <li>✅ Code quality maintained at 92%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">🔧 Optimization Opportunities:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>⚠️ Bundle size reduction needed (2.4MB)</li>
                    <li>⚠️ Build time could be optimized further</li>
                    <li>💡 Consider implementing code splitting</li>
                    <li>💡 Explore caching strategies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Team Tab */}
        <TabsContent value="team" className="space-y-6">
          {/* Team Header */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-6 border border-yellow-500/20">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              👥 Team Productivity & Collaboration Analytics
            </h2>
            <p className="text-muted-foreground mb-4">
              Comprehensive analysis of team performance, individual contributions, and collaboration patterns
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>High Performers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Active Collaboration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Quality Focus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Team Growth</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  📊 Team Productivity Scatter Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Visual representation of team member performance across commits, reviews, and quality metrics
                </p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[400px]">
                <ScatterChart data={teamProductivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="commits" name="Commits" />
                  <YAxis dataKey="score" name="Score" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter dataKey="reviews" fill="#D84040" />
                </ScatterChart>
              </ChartContainer>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">📈 Analysis Insights:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Charlie leads in productivity with 102 commits</li>
                    <li>• Alice shows excellent code review participation</li>
                    <li>• Team maintains high quality standards</li>
                    <li>• Collaboration patterns are healthy</li>
                  </ul>
                </div>
            </CardContent>
          </Card>

            <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  🏆 Team Performance Summary
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Key metrics and achievements for each team member
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-lg p-3">
                      <h4 className="font-semibold text-sm text-green-600">Top Performer</h4>
                      <p className="text-xs text-muted-foreground">Charlie - 96% Score</p>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-3">
                      <h4 className="font-semibold text-sm text-blue-600">Most Active</h4>
                      <p className="text-xs text-muted-foreground">Charlie - 102 Commits</p>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-3">
                      <h4 className="font-semibold text-sm text-yellow-600">Best Reviewer</h4>
                      <p className="text-xs text-muted-foreground">Alice - 15 Reviews</p>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-3">
                      <h4 className="font-semibold text-sm text-purple-600">Quality Focus</h4>
                      <p className="text-xs text-muted-foreground">Charlie - 2 Bugs</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2">🎯 Team Goals:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Maintain 90%+ average team score</li>
                      <li>• Increase code review participation</li>
                      <li>• Reduce bug count by 20%</li>
                      <li>• Improve collaboration efficiency</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {teamProductivity.map((member, index) => (
              <Card key={index} className="bg-gradient-to-br from-muted/30 to-muted/10 border-border/50 hover:border-accent/30 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {member.developer.charAt(0)}
                      </div>
                    <h3 className="font-semibold">{member.developer}</h3>
                    </div>
                    <div className="text-3xl font-bold text-primary">{member.score}</div>
                    <div className="text-xs text-muted-foreground space-y-2">
                      <div className="flex justify-between">
                        <span>Commits:</span>
                        <span className="font-semibold">{member.commits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reviews:</span>
                        <span className="font-semibold">{member.reviews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bugs:</span>
                        <span className="font-semibold">{member.bugs}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border/50">
                      <div className="text-xs text-muted-foreground">
                        {member.score >= 95 && '🏆 Exceptional'}
                        {member.score >= 90 && member.score < 95 && '⭐ Excellent'}
                        {member.score >= 85 && member.score < 90 && '✅ Good'}
                        {member.score < 85 && '📈 Improving'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Enhanced Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              📅 Deployment Calendar & Timeline Analytics
            </h2>
            <p className="text-muted-foreground mb-4">
              Track deployment schedules, events, and timeline analysis for better project management
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Successful Deployments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Failed Deployments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Scheduled Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Maintenance Windows</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-purple-400" />
                  📅 Interactive Event Calendar
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select dates to view detailed deployment and event information
                </p>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border border-border"
                />
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">📊 Calendar Features:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Click dates to view deployment history</li>
                    <li>• Color-coded success/failure indicators</li>
                    <li>• Integration with CI/CD pipelines</li>
                    <li>• Team availability tracking</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  🚀 Deployment Timeline Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time deployment status and performance metrics
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deploymentHistory.map((deployment, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full ${
                          deployment.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium flex items-center gap-2">
                            {deployment.environment === 'Production' && '🏭'}
                            {deployment.environment === 'Staging' && '🧪'}
                            {deployment.environment === 'Development' && '🛠️'}
                            {deployment.environment}
                          </span>
                          <Badge variant="outline" className={
                            deployment.status === 'success' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }>
                            {deployment.status === 'success' ? '✅ Success' : '❌ Failed'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          📅 {format(new Date(deployment.date), "PPP")} • ⏱️ {deployment.duration}s
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {deployment.status === 'success' 
                            ? '🎉 Deployment completed successfully'
                            : '⚠️ Deployment failed - check logs for details'
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">📈 Deployment Insights:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 80% success rate across all environments</li>
                    <li>• Average deployment time: 120s</li>
                    <li>• Production deployments most reliable</li>
                    <li>• Development environment needs optimization</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Summary */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                📊 Calendar & Timeline Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">📅 Upcoming Events:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Production Release - Jan 15</li>
                    <li>• Team Retrospective - Jan 18</li>
                    <li>• Security Audit - Jan 22</li>
                    <li>• Performance Review - Jan 25</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">🚀 Deployment Stats:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Total Deployments: 45</li>
                    <li>• Success Rate: 80%</li>
                    <li>• Avg Duration: 120s</li>
                    <li>• Environments: 3</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">🎯 Recommendations:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Optimize development deployments</li>
                    <li>• Implement automated rollbacks</li>
                    <li>• Schedule maintenance windows</li>
                    <li>• Improve monitoring coverage</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
