import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export function Layout({ children, onLogout }: LayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#1D1616]">
      <Sidebar
        onLogout={onLogout}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      {/* Mobile Menu Button */}
      {!isMobileOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden bg-[#2A2A2A] border border-[#444] text-gray-300 hover:text-white hover:bg-[#1D1616]"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      <main
        className={`flex-1 overflow-auto transition-all duration-300 px-2 sm:px-4 pt-14 lg:pt-0 ${
          isMobileOpen ? '' : isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
