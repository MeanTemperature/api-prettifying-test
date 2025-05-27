
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Database, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Developer Tools
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A collection of useful tools for developers to process, format, and analyze data
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="group hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>API Data Processor</CardTitle>
              <CardDescription>
                Process and format API responses with custom JavaScript functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Paste API data, write processing code, and see formatted results instantly.
              </p>
              <Link to="/api-processor">
                <Button className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Open Tool
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow duration-200 opacity-60">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>JSON Formatter</CardTitle>
              <CardDescription>
                Pretty-print and validate JSON data (Coming Soon)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Format, validate, and beautify JSON data with syntax highlighting.
              </p>
              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow duration-200 opacity-60">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Text Utilities</CardTitle>
              <CardDescription>
                Various text processing utilities (Coming Soon)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Encode, decode, transform, and analyze text data.
              </p>
              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
