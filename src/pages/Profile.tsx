
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Key,
  Code,
  Trophy,
  Target,
  Calendar,
  GitBranch,
  Users,
  Save,
  Upload,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  bio: string;
  avatar: string;
  github: string;
  linkedin: string;
  twitter: string;
}

interface UserStats {
  totalCommits: number;
  codeReviews: number;
  bugsFixed: number;
  projectsContributed: number;
  currentStreak: number;
  longestStreak: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  deploymentAlerts: boolean;
  codeReviewRequests: boolean;
  bugReports: boolean;
  weeklyReports: boolean;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Developer",
    email: "dev@demo.com",
    role: "Senior Full Stack Developer",
    bio: "Passionate developer with 5+ years of experience in React, Node.js, and cloud technologies. Love building scalable applications and mentoring junior developers.",
    avatar: "JD",
    github: "github.com/johndeveloper",
    linkedin: "linkedin.com/in/johndeveloper",
    twitter: "@johndeveloper"
  });

  const [stats] = useState<UserStats>({
    totalCommits: 1247,
    codeReviews: 89,
    bugsFixed: 156,
    projectsContributed: 12,
    currentStreak: 15,
    longestStreak: 42
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    deploymentAlerts: true,
    codeReviewRequests: true,
    bugReports: false,
    weeklyReports: true
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleProfileSave = () => {
    // Simulate API call
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords don't match");
      return;
    }
    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    // Simulate API call
    toast.success("Password updated successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const achievements = [
    { name: "Code Master", description: "1000+ commits", icon: Code, earned: true },
    { name: "Bug Hunter", description: "100+ bugs fixed", icon: Target, earned: true },
    { name: "Team Player", description: "50+ code reviews", icon: Users, earned: true },
    { name: "Streak Champion", description: "30+ day streak", icon: Trophy, earned: false },
    { name: "Security Guardian", description: "Found critical vulnerability", icon: Shield, earned: false }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Profile Management</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleProfileSave} className="bg-gradient-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="glow-hover">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-[#2A2A2A]">
          <TabsTrigger value="profile" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <User className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Profile</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Trophy className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Stats</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Bell className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Notify</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Shield className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Security</span>
            <span className="sm:hidden">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-accent" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-gradient-primary text-white text-xl">
                      {profile.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" className="glow-hover">
                      <Upload className="w-4 h-4 mr-2" />
                      Change Avatar
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-[#1D1616] border-[#444]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-[#1D1616] border-[#444]"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profile.role}
                    onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-[#1D1616] border-[#444]"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-[#1D1616] border-[#444] min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Social Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={profile.github}
                        onChange={(e) => setProfile(prev => ({ ...prev, github: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-[#1D1616] border-[#444]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={profile.linkedin}
                        onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-[#1D1616] border-[#444]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={profile.twitter}
                        onChange={(e) => setProfile(prev => ({ ...prev, twitter: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-[#1D1616] border-[#444]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Profile Completion</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <div className="text-lg font-bold text-primary">{stats.totalCommits}</div>
                    <div className="text-xs text-muted-foreground">Total Commits</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <div className="text-lg font-bold text-green-400">{stats.currentStreak}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <div className="text-lg font-bold text-blue-400">{stats.codeReviews}</div>
                    <div className="text-xs text-muted-foreground">Code Reviews</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <div className="text-lg font-bold text-yellow-400">{stats.bugsFixed}</div>
                    <div className="text-xs text-muted-foreground">Bugs Fixed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Coding Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Commits</span>
                    <span className="font-semibold">{stats.totalCommits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Projects Contributed</span>
                    <span className="font-semibold">{stats.projectsContributed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Streak</span>
                    <span className="font-semibold text-green-400">{stats.currentStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longest Streak</span>
                    <span className="font-semibold text-blue-400">{stats.longestStreak} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-accent" />
                  Code Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Code Reviews</span>
                    <span className="font-semibold">{stats.codeReviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bugs Fixed</span>
                    <span className="font-semibold">{stats.bugsFixed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Code Quality Score</span>
                    <span className="font-semibold text-green-400">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Test Coverage</span>
                    <span className="font-semibold text-blue-400">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${achievement.earned ? 'bg-gradient-primary' : 'bg-muted opacity-50'}`}>
                        <achievement.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Earned
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.emailNotifications}
                    onCheckedChange={() => handleNotificationChange('emailNotifications')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.pushNotifications}
                    onCheckedChange={() => handleNotificationChange('pushNotifications')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="deployment-alerts">Deployment Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify on deployments</p>
                  </div>
                  <Switch
                    id="deployment-alerts"
                    checked={notifications.deploymentAlerts}
                    onCheckedChange={() => handleNotificationChange('deploymentAlerts')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="code-review-requests">Code Review Requests</Label>
                    <p className="text-sm text-muted-foreground">Notify when assigned to review</p>
                  </div>
                  <Switch
                    id="code-review-requests"
                    checked={notifications.codeReviewRequests}
                    onCheckedChange={() => handleNotificationChange('codeReviewRequests')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bug-reports">Bug Reports</Label>
                    <p className="text-sm text-muted-foreground">Notify on new bug reports</p>
                  </div>
                  <Switch
                    id="bug-reports"
                    checked={notifications.bugReports}
                    onCheckedChange={() => handleNotificationChange('bugReports')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-reports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly activity summary</p>
                  </div>
                  <Switch
                    id="weekly-reports"
                    checked={notifications.weeklyReports}
                    onCheckedChange={() => handleNotificationChange('weeklyReports')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-accent" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                      className="bg-[#1D1616] border-[#444] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#EEEEEE]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                    className="bg-[#1D1616] border-[#444]"
                  />
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                    className="bg-[#1D1616] border-[#444]"
                  />
                </div>

                <Button onClick={handlePasswordChange} className="w-full bg-gradient-primary">
                  <Key className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Two-Factor Authentication</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      Disabled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Password Strength</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Strong
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Login</span>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Sessions</span>
                    <span className="text-sm">3</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button variant="outline" className="w-full glow-hover">
                    Enable Two-Factor Auth
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
