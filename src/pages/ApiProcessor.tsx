
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Play, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApiProcessor = () => {
  const [apiData, setApiData] = useState('');
  const [processingCode, setProcessingCode] = useState('// Your processing function\n// The API data from step 1 will be available as "data" variable\n// Return the processed result\n\nreturn data;');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isSection1Open, setIsSection1Open] = useState(true);
  const [isSection2Open, setIsSection2Open] = useState(true);
  const [isSection3Open, setIsSection3Open] = useState(true);
  const { toast } = useToast();

  const processData = () => {
    try {
      setError('');
      
      // Parse API data if it's JSON, otherwise use as string
      let data;
      try {
        data = JSON.parse(apiData);
      } catch {
        data = apiData;
      }

      let processFunction;
      
      if (language === 'typescript') {
        // For TypeScript, we need to strip types and compile to JavaScript
        let jsCode = processingCode
          // Remove type annotations from parameters
          .replace(/\(\s*(\w+)\s*:\s*[^)]+\)/g, '($1)')
          // Remove return type annotations
          .replace(/\)\s*:\s*[^{]+{/g, ') {')
          // Remove variable type annotations
          .replace(/:\s*[^=;,\]\)}\s]+(\s*[=;,\]\)}\s])/g, '$1')
          // Remove type imports/exports
          .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
          .replace(/export\s+type\s+.*?[;}]\s*/g, '');
        
        processFunction = new Function('data', jsCode);
      } else {
        // JavaScript mode - use as is
        processFunction = new Function('data', processingCode);
      }
      
      // Execute the function with the API data from step 1
      const result = processFunction(data);
      
      // Format output
      const formattedOutput = typeof result === 'object' 
        ? JSON.stringify(result, null, 2) 
        : String(result);
      
      setOutput(formattedOutput);
      toast({
        title: "Processing completed",
        description: `Data processed successfully using ${language.charAt(0).toUpperCase() + language.slice(1)}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setOutput('');
      toast({
        title: "Processing failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Output has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">API Processing Chain</h1>
          <p className="text-muted-foreground">
            A three-step chain: Paste API data → Write processing function → See results
          </p>
        </div>

        {/* Step 1: API Data Input */}
        <Card>
          <Collapsible open={isSection1Open} onOpenChange={setIsSection1Open}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <span>Step 1: Raw API Data</span>
                  {isSection1Open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Paste your raw API response here. This data will be passed to your processing function in Step 2.
                </p>
                <Textarea
                  placeholder="Paste your API response data here..."
                  value={apiData}
                  onChange={(e) => setApiData(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Step 2: Processing Function */}
        <Card>
          <Collapsible open={isSection2Open} onOpenChange={setIsSection2Open}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <span>Step 2: Processing Function</span>
                  {isSection2Open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Write your function to process the data from Step 1. The data will be available as the "data" variable.
                  </p>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  value={processingCode}
                  onChange={(e) => setProcessingCode(e.target.value)}
                  className="min-h-[250px] font-mono text-sm"
                  placeholder={language === 'typescript' 
                    ? "// Your TypeScript processing code here...\nfunction process(data: any): any {\n  return data;\n}"
                    : "// Your JavaScript processing code here..."
                  }
                />
                <Button onClick={processData} className="w-full" disabled={!apiData.trim()}>
                  <Play className="h-4 w-4 mr-2" />
                  Process Data with {language.charAt(0).toUpperCase() + language.slice(1)} (Step 1 → Step 2 → Step 3)
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Step 3: Output */}
        <Card>
          <Collapsible open={isSection3Open} onOpenChange={setIsSection3Open}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <span>Step 3: Processed Output</span>
                  {isSection3Open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    The result of processing Step 1 data with Step 2 function appears here.
                  </p>
                  {output && (
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(output)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  )}
                </div>
                
                {error && (
                  <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-md">
                    <p className="text-sm text-destructive font-medium">Error:</p>
                    <p className="text-sm text-destructive mt-1">{error}</p>
                  </div>
                )}
                
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-[200px] font-mono text-sm bg-muted/50"
                  placeholder="Processed output will appear here after running the chain..."
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Processing Chain Instructions */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-lg">Processing Chain Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Step 1:</strong> Paste your raw API response data (JSON or text)</div>
            <div><strong>Step 2:</strong> Write a processing function in JavaScript or TypeScript</div>
            <div><strong>Step 3:</strong> Click "Process Data" to run the chain and see results</div>
            <div className="mt-3 p-3 bg-muted/50 rounded-md">
              <strong>Language Support:</strong><br />
              <code className="text-xs">
                JavaScript: Standard JS syntax<br />
                TypeScript: Full TS syntax (types are stripped during execution)
              </code>
            </div>
            <div className="mt-3 p-3 bg-muted/50 rounded-md">
              <strong>Example chain:</strong><br />
              <code className="text-xs">
                Step 1: &#123;"users": [&#123;"name": "John", "age": 30&#125;]&#125;<br />
                Step 2: return data.users.map(u =&gt; u.name);<br />
                Step 3: ["John"]
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiProcessor;
