import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, FileText, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const JsonFormatter = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  const formatJson = () => {
    setError('');
    setFormattedJson('');
    setIsValid(null);

    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setIsValid(true);
      
      toast({
        title: "Success",
        description: "JSON formatted successfully!",
      });
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
      setIsValid(false);
    }
  };

  const validateJson = () => {
    setError('');
    setIsValid(null);

    try {
      JSON.parse(jsonInput);
      setIsValid(true);
      toast({
        title: "Valid JSON",
        description: "Your JSON is valid!",
      });
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
      setIsValid(false);
    }
  };

  const minifyJson = () => {
    setError('');
    setFormattedJson('');
    setIsValid(null);

    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setFormattedJson(minified);
      setIsValid(true);
      
      toast({
        title: "Success",
        description: "JSON minified successfully!",
      });
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
      setIsValid(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "JSON copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    });
  };

  const clearAll = () => {
    setJsonInput('');
    setFormattedJson('');
    setError('');
    setIsValid(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            JSON Formatter
          </CardTitle>
          <CardDescription>
            Format, validate, minify, and beautify JSON data with syntax highlighting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Input JSON</h3>
              <div className="flex items-center gap-2">
                {isValid === true && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Valid</span>
                  </div>
                )}
                {isValid === false && (
                  <div className="text-red-600 text-sm">Invalid</div>
                )}
              </div>
            </div>
            <Textarea
              placeholder='{"example": "Paste your JSON here..."}'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="min-h-40 font-mono text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={formatJson}
              disabled={!jsonInput.trim()}
            >
              Format JSON
            </Button>
            <Button 
              onClick={validateJson}
              variant="outline"
              disabled={!jsonInput.trim()}
            >
              Validate Only
            </Button>
            <Button 
              onClick={minifyJson}
              variant="outline"
              disabled={!jsonInput.trim()}
            >
              Minify
            </Button>
            <Button 
              onClick={clearAll}
              variant="ghost"
            >
              Clear All
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-sm">{error}</pre>
              </AlertDescription>
            </Alert>
          )}

          {/* Result Display */}
          {formattedJson && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Formatted Result</h3>
                <Button
                  onClick={() => copyToClipboard(formattedJson)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <Textarea
                    value={formattedJson}
                    readOnly
                    className="min-h-60 font-mono text-sm border-0 resize-none"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Examples */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Examples</h3>
            <Tabs defaultValue="object" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="object">Object</TabsTrigger>
                <TabsTrigger value="array">Array</TabsTrigger>
                <TabsTrigger value="nested">Nested</TabsTrigger>
              </TabsList>
              <TabsContent value="object">
                <Card>
                  <CardContent className="p-4">
                    <pre className="text-sm bg-muted p-2 rounded overflow-auto">
{`{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "active": true
}`}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="array">
                <Card>
                  <CardContent className="p-4">
                    <pre className="text-sm bg-muted p-2 rounded overflow-auto">
{`[
  {"id": 1, "name": "Item 1"},
  {"id": 2, "name": "Item 2"},
  {"id": 3, "name": "Item 3"}
]`}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="nested">
                <Card>
                  <CardContent className="p-4">
                    <pre className="text-sm bg-muted p-2 rounded overflow-auto">
{`{
  "user": {
    "profile": {
      "name": "Jane Smith",
      "preferences": {
        "theme": "dark",
        "notifications": true
      }
    },
    "posts": [
      {"title": "Hello World", "date": "2024-01-01"}
    ]
  }
}`}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonFormatter;