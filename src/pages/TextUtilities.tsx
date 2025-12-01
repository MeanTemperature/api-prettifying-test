import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Type, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TextUtilities = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [operation, setOperation] = useState('');
  const { toast } = useToast();

  const operations = {
    uppercase: (text: string) => text.toUpperCase(),
    lowercase: (text: string) => text.toLowerCase(),
    titlecase: (text: string) => text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ),
    camelcase: (text: string) => text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, ''),
    pascalcase: (text: string) => text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, ''),
    snakecase: (text: string) => text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_'),
    kebabcase: (text: string) => text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('-'),
    reverse: (text: string) => text.split('').reverse().join(''),
    removeSpaces: (text: string) => text.replace(/\s+/g, ''),
    removeLineBreaks: (text: string) => text.replace(/\r?\n|\r/g, ' '),
    trimWhitespace: (text: string) => text.trim(),
    removeExtraSpaces: (text: string) => text.replace(/\s+/g, ' ').trim(),
    base64Encode: (text: string) => btoa(unescape(encodeURIComponent(text))),
    base64Decode: (text: string) => {
      try {
        return decodeURIComponent(escape(atob(text)));
      } catch {
        return 'Invalid Base64 input';
      }
    },
    urlEncode: (text: string) => encodeURIComponent(text),
    urlDecode: (text: string) => {
      try {
        return decodeURIComponent(text);
      } catch {
        return 'Invalid URL encoded input';
      }
    },
    htmlEncode: (text: string) => text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;'),
    htmlDecode: (text: string) => text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'"),
    wordCount: (text: string) => {
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      return `Words: ${words.length}, Characters: ${text.length}, Characters (no spaces): ${text.replace(/\s/g, '').length}`;
    },
    extractEmails: (text: string) => {
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const emails = text.match(emailRegex) || [];
      return emails.join('\n') || 'No email addresses found';
    },
    extractUrls: (text: string) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = text.match(urlRegex) || [];
      return urls.join('\n') || 'No URLs found';
    },
    extractNumbers: (text: string) => {
      const numberRegex = /\b\d+(\.\d+)?\b/g;
      const numbers = text.match(numberRegex) || [];
      return numbers.join('\n') || 'No numbers found';
    },
    cleanAIText: (text: string) => {
      return text
        // Remove zero-width spaces and other invisible characters
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        // Replace em dashes and en dashes with regular hyphens
        .replace(/[—–]/g, '-')
        // Replace curly quotes with straight quotes
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        // Replace non-breaking spaces with regular spaces
        .replace(/\u00A0/g, ' ')
        // Remove other problematic unicode spaces
        .replace(/[\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
        // Normalize multiple spaces to single space
        .replace(/\s+/g, ' ')
        // Trim leading/trailing whitespace
        .trim();
    }
  };

  const processText = () => {
    if (!operation || !inputText.trim()) return;
    
    try {
      const result = operations[operation as keyof typeof operations](inputText);
      setOutputText(result);
      
      toast({
        title: "Success",
        description: `Text processed with ${operation}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process text",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
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
    setInputText('');
    setOutputText('');
    setOperation('');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Text Utilities
          </CardTitle>
          <CardDescription>
            Transform, analyze, and manipulate text data with various processing operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Input Text</h3>
            <Textarea
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-32"
            />
          </div>

          {/* Operation Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Select Operation</h3>
            <Tabs defaultValue="case" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="case">Case</TabsTrigger>
                <TabsTrigger value="format">Format</TabsTrigger>
                <TabsTrigger value="encode">Encode</TabsTrigger>
                <TabsTrigger value="extract">Extract</TabsTrigger>
              </TabsList>
              
              <TabsContent value="case" className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant={operation === 'uppercase' ? 'default' : 'outline'}
                    onClick={() => setOperation('uppercase')}
                    size="sm"
                  >
                    UPPERCASE
                  </Button>
                  <Button
                    variant={operation === 'lowercase' ? 'default' : 'outline'}
                    onClick={() => setOperation('lowercase')}
                    size="sm"
                  >
                    lowercase
                  </Button>
                  <Button
                    variant={operation === 'titlecase' ? 'default' : 'outline'}
                    onClick={() => setOperation('titlecase')}
                    size="sm"
                  >
                    Title Case
                  </Button>
                  <Button
                    variant={operation === 'camelcase' ? 'default' : 'outline'}
                    onClick={() => setOperation('camelcase')}
                    size="sm"
                  >
                    camelCase
                  </Button>
                  <Button
                    variant={operation === 'pascalcase' ? 'default' : 'outline'}
                    onClick={() => setOperation('pascalcase')}
                    size="sm"
                  >
                    PascalCase
                  </Button>
                  <Button
                    variant={operation === 'snakecase' ? 'default' : 'outline'}
                    onClick={() => setOperation('snakecase')}
                    size="sm"
                  >
                    snake_case
                  </Button>
                  <Button
                    variant={operation === 'kebabcase' ? 'default' : 'outline'}
                    onClick={() => setOperation('kebabcase')}
                    size="sm"
                  >
                    kebab-case
                  </Button>
                  <Button
                    variant={operation === 'reverse' ? 'default' : 'outline'}
                    onClick={() => setOperation('reverse')}
                    size="sm"
                  >
                    Reverse
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="format" className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button
                    variant={operation === 'cleanAIText' ? 'default' : 'outline'}
                    onClick={() => setOperation('cleanAIText')}
                    size="sm"
                    className="md:col-span-3"
                  >
                    Clean AI Text
                  </Button>
                  <Button
                    variant={operation === 'removeSpaces' ? 'default' : 'outline'}
                    onClick={() => setOperation('removeSpaces')}
                    size="sm"
                  >
                    Remove Spaces
                  </Button>
                  <Button
                    variant={operation === 'removeLineBreaks' ? 'default' : 'outline'}
                    onClick={() => setOperation('removeLineBreaks')}
                    size="sm"
                  >
                    Remove Line Breaks
                  </Button>
                  <Button
                    variant={operation === 'trimWhitespace' ? 'default' : 'outline'}
                    onClick={() => setOperation('trimWhitespace')}
                    size="sm"
                  >
                    Trim Whitespace
                  </Button>
                  <Button
                    variant={operation === 'removeExtraSpaces' ? 'default' : 'outline'}
                    onClick={() => setOperation('removeExtraSpaces')}
                    size="sm"
                  >
                    Remove Extra Spaces
                  </Button>
                  <Button
                    variant={operation === 'wordCount' ? 'default' : 'outline'}
                    onClick={() => setOperation('wordCount')}
                    size="sm"
                  >
                    <Hash className="w-4 h-4 mr-1" />
                    Count Words
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="encode" className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button
                    variant={operation === 'base64Encode' ? 'default' : 'outline'}
                    onClick={() => setOperation('base64Encode')}
                    size="sm"
                  >
                    Base64 Encode
                  </Button>
                  <Button
                    variant={operation === 'base64Decode' ? 'default' : 'outline'}
                    onClick={() => setOperation('base64Decode')}
                    size="sm"
                  >
                    Base64 Decode
                  </Button>
                  <Button
                    variant={operation === 'urlEncode' ? 'default' : 'outline'}
                    onClick={() => setOperation('urlEncode')}
                    size="sm"
                  >
                    URL Encode
                  </Button>
                  <Button
                    variant={operation === 'urlDecode' ? 'default' : 'outline'}
                    onClick={() => setOperation('urlDecode')}
                    size="sm"
                  >
                    URL Decode
                  </Button>
                  <Button
                    variant={operation === 'htmlEncode' ? 'default' : 'outline'}
                    onClick={() => setOperation('htmlEncode')}
                    size="sm"
                  >
                    HTML Encode
                  </Button>
                  <Button
                    variant={operation === 'htmlDecode' ? 'default' : 'outline'}
                    onClick={() => setOperation('htmlDecode')}
                    size="sm"
                  >
                    HTML Decode
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="extract" className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button
                    variant={operation === 'extractEmails' ? 'default' : 'outline'}
                    onClick={() => setOperation('extractEmails')}
                    size="sm"
                  >
                    Extract Emails
                  </Button>
                  <Button
                    variant={operation === 'extractUrls' ? 'default' : 'outline'}
                    onClick={() => setOperation('extractUrls')}
                    size="sm"
                  >
                    Extract URLs
                  </Button>
                  <Button
                    variant={operation === 'extractNumbers' ? 'default' : 'outline'}
                    onClick={() => setOperation('extractNumbers')}
                    size="sm"
                  >
                    Extract Numbers
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={processText}
              disabled={!inputText.trim() || !operation}
              className="flex-1"
            >
              Process Text
            </Button>
            <Button 
              onClick={clearAll}
              variant="ghost"
            >
              Clear All
            </Button>
          </div>

          {/* Output Section */}
          {outputText && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Output</h3>
                <Button
                  onClick={() => copyToClipboard(outputText)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={outputText}
                readOnly
                className="min-h-32"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TextUtilities;