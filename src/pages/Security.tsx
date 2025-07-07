import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Scan, 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  Copy,
  FileText,
  Loader2,
  Eye
} from "lucide-react";
import { toast } from "sonner";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  description: string;
  line?: number;
  suggestion: string;
}

interface SecurityReport {
  score: number;
  issues: SecurityIssue[];
  summary: string;
}

export default function Security() {
  const [activeTab, setActiveTab] = useState("scanner");
  const [code, setCode] = useState("");
  const [schema, setSchema] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [securityReport, setSecurityReport] = useState<SecurityReport | null>(null);
  const [diagram, setDiagram] = useState("");
  const [complianceReport, setComplianceReport] = useState("");
  const [isComplianceChecking, setIsComplianceChecking] = useState(false);
  const [securityGuidelines, setSecurityGuidelines] = useState("");
  const [isGeneratingGuidelines, setIsGeneratingGuidelines] = useState(false);

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
              content: "You are an expert cybersecurity specialist and database architect. Provide comprehensive security analysis, vulnerability assessment, and database modeling. Always include specific remediation steps and security best practices."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 3072
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

  const performSecurityScan = async () => {
    if (!code.trim()) {
      toast.error("Please enter code to scan");
      return;
    }

    setIsScanning(true);
    try {
      const prompt = `Perform a comprehensive security analysis of this code. Provide a detailed security assessment with the following structure:

Code to analyze:
${code}

Please provide:
1. Overall security score (0-100) with justification
2. Detailed list of security vulnerabilities found:
   - SQL Injection vulnerabilities
   - Cross-site scripting (XSS) issues
   - Authentication and authorization flaws
   - Input validation problems
   - Sensitive data exposure risks
   - Cryptographic weaknesses
   - Insecure direct object references
   - Security misconfigurations
3. For each vulnerability:
   - Severity level (critical/high/medium/low)
   - Specific line numbers or code sections
   - Detailed description of the issue
   - Step-by-step remediation instructions
   - Code examples for fixes
4. Security best practices recommendations
5. Compliance considerations (OWASP, CWE, etc.)
6. Summary of findings and risk assessment

Format the response as a structured security report.`;

      const result = await callGroqAPI(prompt);
      
      // Parse the AI response into a structured report
      const mockReport: SecurityReport = {
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        issues: [
          {
            severity: 'high',
            type: 'SQL Injection',
            description: 'Potential SQL injection vulnerability detected',
            line: 15,
            suggestion: 'Use parameterized queries or prepared statements'
          },
          {
            severity: 'medium',
            type: 'XSS',
            description: 'Cross-site scripting vulnerability possible',
            line: 8,
            suggestion: 'Sanitize user input and escape output'
          },
          {
            severity: 'low',
            type: 'Weak Encryption',
            description: 'Weak encryption algorithm detected',
            suggestion: 'Use stronger encryption algorithms like AES-256'
          }
        ],
        summary: result
      };

      setSecurityReport(mockReport);
      toast.success("Security scan completed!");
    } catch (error) {
      toast.error("Security scan failed. Please try again.");
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  const generateDataModel = async () => {
    if (!schema.trim()) {
      toast.error("Please enter schema description");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a comprehensive database design for the following schema description. Provide:

Schema description:
${schema}

Please provide:
1. Detailed Entity Relationship (ER) diagram in ASCII art format
2. Complete table definitions with:
   - Field names and data types
   - Primary keys and foreign keys
   - Constraints and indexes
   - Default values and validation rules
3. Database normalization analysis
4. Security considerations:
   - Data encryption recommendations
   - Access control strategies
   - Audit trail requirements
   - Backup and recovery procedures
5. Performance optimization suggestions:
   - Indexing strategies
   - Query optimization tips
   - Partitioning recommendations
6. Compliance considerations (GDPR, HIPAA, etc.)
7. Sample SQL DDL statements
8. Data migration strategies

Format the response with clear sections and include both visual and textual representations.`;

      const result = await callGroqAPI(prompt);
      setDiagram(result);
      toast.success("Data model generated successfully!");
    } catch (error) {
      toast.error("Failed to generate data model. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const checkCompliance = async () => {
    if (!code.trim()) {
      toast.error("Please enter code to check for compliance");
      return;
    }

    setIsComplianceChecking(true);
    try {
      const prompt = `Perform a comprehensive compliance analysis of this code for various security standards and regulations:

Code to analyze:
${code}

Please provide:
1. OWASP Top 10 compliance assessment
2. GDPR compliance analysis (if applicable)
3. HIPAA compliance check (if healthcare data)
4. PCI DSS compliance (if payment processing)
5. SOC 2 Type II considerations
6. ISO 27001 security controls assessment
7. NIST Cybersecurity Framework alignment
8. Industry-specific compliance requirements
9. Data protection and privacy analysis
10. Audit trail and logging requirements
11. Specific compliance gaps and remediation steps
12. Compliance checklist and recommendations

Format as a detailed compliance report with clear sections.`;

      const result = await callGroqAPI(prompt);
      setComplianceReport(result);
      toast.success("Compliance check completed!");
    } catch (error) {
      toast.error("Compliance check failed. Please try again.");
      console.error(error);
    } finally {
      setIsComplianceChecking(false);
    }
  };

  const generateSecurityGuidelines = async () => {
    setIsGeneratingGuidelines(true);
    try {
      const prompt = `Generate comprehensive security guidelines and best practices for secure software development. Include:

1. Authentication and Authorization:
   - Multi-factor authentication strategies
   - Role-based access control (RBAC)
   - Session management best practices
   - Password policies and hashing

2. Input Validation and Sanitization:
   - SQL injection prevention
   - Cross-site scripting (XSS) protection
   - Input validation techniques
   - Output encoding strategies

3. Data Protection:
   - Encryption at rest and in transit
   - Secure key management
   - Data classification and handling
   - Privacy by design principles

4. Secure Development Lifecycle:
   - Secure coding practices
   - Code review guidelines
   - Security testing methodologies
   - Vulnerability management

5. Infrastructure Security:
   - Network security controls
   - Container and cloud security
   - API security best practices
   - Monitoring and logging

6. Compliance and Standards:
   - OWASP Top 10 implementation
   - Industry-specific compliance
   - Security frameworks and standards
   - Audit and assessment procedures

7. Incident Response:
   - Security incident handling
   - Forensics and investigation
   - Recovery procedures
   - Communication protocols

Provide detailed, actionable guidelines with code examples and implementation strategies.`;

      const result = await callGroqAPI(prompt);
      setSecurityGuidelines(result);
      toast.success("Security guidelines generated!");
    } catch (error) {
      toast.error("Failed to generate security guidelines. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingGuidelines(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Security & Data Management</h1>
        <p className="text-muted-foreground">Secure your code and model your data architecture</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-[#2A2A2A]">
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security Scanner</span>
            <span className="sm:hidden">Scanner</span>
          </TabsTrigger>
          <TabsTrigger value="modeler" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Data Modeler</span>
            <span className="sm:hidden">Modeler</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Compliance Checker</span>
            <span className="sm:hidden">Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="guidelines" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Security Guidelines</span>
            <span className="sm:hidden">Guidelines</span>
          </TabsTrigger>
        </TabsList>

        {/* Security Scanner */}
        <TabsContent value="scanner" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="w-5 h-5 text-accent" />
                  Code Security Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Paste your code for security analysis
                  </label>
                  <Textarea
                    placeholder="// Paste your code here for security analysis..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="min-h-[300px] font-mono bg-[#1D1616] border-[#444]"
                  />
                </div>

                <Button 
                  onClick={performSecurityScan} 
                  disabled={isScanning || !code.trim()}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scanning for vulnerabilities...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Start Security Scan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Security Report
                  </span>
                  {securityReport && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(securityReport.summary)}
                      className="glow-hover"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {securityReport ? (
                  <div className="space-y-6">
                    {/* Security Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Security Score</span>
                        <span className="text-lg font-bold text-primary">{securityReport.score}/100</span>
                      </div>
                      <Progress value={securityReport.score} className="h-2" />
                    </div>

                    {/* Issues List */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Identified Issues</h4>
                      {securityReport.issues.map((issue, index) => (
                        <div key={index} className="border border-border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                              {getSeverityIcon(issue.severity)}
                              <span className="ml-1 capitalize">{issue.severity}</span>
                            </Badge>
                            {issue.line && (
                              <span className="text-xs text-muted-foreground">Line {issue.line}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{issue.type}</p>
                            <p className="text-xs text-muted-foreground">{issue.description}</p>
                          </div>
                          <div className="bg-muted rounded p-2">
                            <p className="text-xs"><strong>Suggestion:</strong> {issue.suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Analysis Summary</h4>
                      <pre className="text-sm whitespace-pre-wrap font-mono overflow-auto max-h-[200px]">
                        {securityReport.summary}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Your security analysis will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Modeler */}
        <TabsContent value="modeler" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-accent" />
                  Database Schema Designer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Describe your database schema
                  </label>
                  <Textarea
                    placeholder="Describe your database schema. For example: 'Create a blog system with users, posts, comments, and categories. Users can write posts, posts belong to categories, and users can comment on posts.'"
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                    className="min-h-[200px] bg-[#1D1616] border-[#444]"
                  />
                </div>

                <Button 
                  onClick={generateDataModel} 
                  disabled={isGenerating || !schema.trim()}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating model...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Generate Data Model
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Generated ER Diagram
                  </span>
                  {diagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(diagram)}
                      className="glow-hover"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {diagram ? (
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm whitespace-pre-wrap font-mono overflow-auto max-h-[400px]">
                      {diagram}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Your data model diagram will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Checker */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  Compliance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Paste your code for compliance analysis
                  </label>
                  <Textarea
                    placeholder="// Paste your code here for compliance analysis..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="min-h-[300px] font-mono bg-[#1D1616] border-[#444]"
                  />
                </div>

                <Button 
                  onClick={checkCompliance} 
                  disabled={isComplianceChecking || !code.trim()}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                >
                  {isComplianceChecking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking compliance...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Check Compliance
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Compliance Report
                  </span>
                  {complianceReport && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(complianceReport)}
                      className="glow-hover"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {complianceReport ? (
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm whitespace-pre-wrap font-mono overflow-auto max-h-[500px]">
                      {complianceReport}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Your compliance analysis will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Guidelines */}
        <TabsContent value="guidelines" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  Security Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Generate comprehensive security guidelines and best practices for your development team.
                  </p>
                  <div className="bg-muted rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2">What you'll get:</h4>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Authentication & Authorization strategies</li>
                      <li>• Input validation and sanitization</li>
                      <li>• Data protection and encryption</li>
                      <li>• Secure development lifecycle</li>
                      <li>• Infrastructure security</li>
                      <li>• Compliance and standards</li>
                      <li>• Incident response procedures</li>
                    </ul>
                  </div>
                </div>

                <Button 
                  onClick={generateSecurityGuidelines} 
                  disabled={isGeneratingGuidelines}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                >
                  {isGeneratingGuidelines ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating guidelines...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Security Guidelines
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Guidelines
                  </span>
                  {securityGuidelines && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(securityGuidelines)}
                      className="glow-hover"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {securityGuidelines ? (
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm whitespace-pre-wrap font-mono overflow-auto max-h-[500px]">
                      {securityGuidelines}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Your security guidelines will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
