import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  Code, 
  Wrench, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  User, 
  Settings,
  Home,
  Bot,
  Terminal,
  Sparkles,
  Bug,
  Lightbulb,
  RefreshCw,
  FileCode,
  Image,
  Wand2,
  Minimize,
  Activity,
  Workflow,
  Cloud,
  Rocket,
  Scan,
  Database,
  GitMerge,
  BookOpen,
  Calendar,
  Filter,
  UserCog,
  Bell,
  LogOut,
  Target,
  Server,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const toolCategories = [
  {
    name: "Main",
    items: [
      { name: "Dashboard", href: "/", icon: Home },
    ]
  },
  {
    name: "🔧 Developer Tools",
    items: [
      { name: "Code Tools", href: "/code-tools", icon: Code },
      { name: "Code Editor", href: "/editor", icon: Terminal },
      { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
    ]
  },
  {
    name: "🔄 Optimization",
    items: [
      { name: "Optimization", href: "/optimization", icon: Wrench },
      { name: "Smart Refactoring", href: "/optimization/refactoring", icon: Wand2 },
      { name: "Performance Analyzer", href: "/optimization/performance", icon: Activity },
      { name: "Code Minifier", href: "/optimization/minifier", icon: Minimize },
      { name: "Complexity Reducer", href: "/optimization/complexity", icon: Target },
    ]
  },
  {
    name: "⚙️ Automation", 
    items: [
      { name: "Automation", href: "/automation", icon: Zap },
      { name: "Workflow Automator", href: "/automation/workflow", icon: Workflow },
      { name: "Smart Deployment", href: "/automation/deployment", icon: Cloud },
      { name: "Cloud Deploy", href: "/automation/cloud-deploy", icon: Server },
    ]
  },
  {
    name: "🔐 Security & Data",
    items: [
      { name: "Security", href: "/security", icon: Shield },
    ]
  },
  {
    name: "👥 Collaboration",
    items: [
      { name: "Collaboration", href: "/collaboration", icon: Users },
    ]
  },
  {
    name: "📊 Analytics",
    items: [
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
    ]
  }
];

const userItems = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

interface SidebarProps {
  onLogout?: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export function Sidebar({ onLogout, isMobileOpen = false, setIsMobileOpen, isCollapsed = false, setIsCollapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-screen flex flex-col bg-[#2A2A2A] border-r border-[#444] z-40 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-0 border-b border-[#444] h-20">
          <div className="flex items-center justify-center h-full flex-1">
            <img src="/logo.png" alt="Logo" className="h-full object-contain" />
          </div>
          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed && setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#1D1616] mr-2"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Scrollable nav + footer */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          {/* Main Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-4">
            {toolCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-2">
                {!isCollapsed && (
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {category.name}
                  </h2>
                )}
                {category.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isCollapsed 
                          ? "justify-center px-0 w-12 mx-auto" 
                          : "px-3",
                        isActive 
                          ? "bg-gradient-to-r from-[#8E1616] to-[#D84040] text-white shadow-lg" 
                          : "text-gray-300 hover:text-[#EEEEEE] hover:bg-[#1D1616]"
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="w-5 h-5 mx-auto" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {isActive && <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>}
                        </>
                      )}
                    </NavLink>
                  );
                })}
                {categoryIndex < toolCategories.length - 1 && !isCollapsed && (
                  <Separator className="my-4 bg-[#444]" />
                )}
              </div>
            ))}

            {!isCollapsed && <Separator className="my-4 bg-[#444]" />}
            <div className="space-y-2">
              {!isCollapsed && (
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  👤 User Management
                </h2>
              )}
              {userItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isCollapsed 
                        ? "justify-center px-0 w-12 mx-auto" 
                        : "px-3",
                      isActive 
                        ? "bg-gradient-to-r from-[#8E1616] to-[#D84040] text-white shadow-lg" 
                        : "text-gray-300 hover:text-[#EEEEEE] hover:bg-[#1D1616]"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5 mx-auto" />
                    {!isCollapsed && <span className="flex-1">{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#444] space-y-3">
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg bg-[#1D1616]",
              isCollapsed && "justify-center"
            )}>
              <div className="w-8 h-8 bg-gradient-to-r from-[#8E1616] to-[#D84040] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#EEEEEE] truncate">dev@demo.com</p>
                  <p className="text-xs text-gray-400">Developer</p>
                </div>
              )}
            </div>
            {onLogout && (
              <Button
                onClick={onLogout}
                variant="outline"
                className={cn(
                  "border-[#444] text-gray-300 hover:text-[#EEEEEE] hover:bg-[#1D1616]",
                  isCollapsed ? "w-8 h-8 p-0" : "w-full"
                )}
                title={isCollapsed ? "Logout" : undefined}
              >
                <LogOut className="w-4 h-4" />
                {!isCollapsed && <span className="ml-2">Logout</span>}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
