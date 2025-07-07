import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LoginProps {
  onLogin: (credentials: { email: string; password: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Demo credentials check
    if (email === "dev@demo.com" && password === "123456") {
      setTimeout(() => {
        onLogin({ email, password });
        toast.success("Welcome to DevAI Platform!");
        setIsLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        toast.error("Invalid credentials. Try dev@demo.com / 123456");
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleDemoLogin = () => {
    setEmail("dev@demo.com");
    setPassword("123456");
    setErrors({});
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-[#1D1616] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#8E1616] to-[#D84040] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#EEEEEE] mb-2">DevAI Platform</h1>
          <p className="text-gray-400">Sign in to your developer workspace</p>
        </div>

        {/* Login Form */}
        <Card className="bg-[#2A2A2A] border-[#444] shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-[#EEEEEE] text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#EEEEEE]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="dev@demo.com"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`bg-[#1D1616] border-[#444] text-[#EEEEEE] placeholder-gray-500 ${
                    errors.email ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#EEEEEE]">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`bg-[#1D1616] border-[#444] text-[#EEEEEE] placeholder-gray-500 pr-10 ${
                      errors.password ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#EEEEEE]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#8E1616] to-[#D84040] hover:from-[#A01818] hover:to-[#E64545] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#444]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#2A2A2A] text-gray-400">Demo Access</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 border-[#444] text-[#EEEEEE] hover:bg-[#1D1616]"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Use Demo Credentials
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-400">
              Demo: dev@demo.com / 123456
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
