
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Play, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApiProcessor = () => {
  const [apiData, setApiData] = useState('');
  const [processingCode, setProcessingCode] = useState('// Your processing function\n// The API data will be available as "data" variable\n// Return the processed result\n\nreturn data;');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
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

      // Create a function from the processing code
      const processFunction = new Function('data', processingCode);
      
      // Execute the function with the API data
      const result = processFunction(data);
      
      // Format output
      const formattedOutput = typeof result === 'object' 
        ? JSON.stringify(result, null, 2) 
        : String(result);
      
      setOutput(formattedOutput);
      toast({
        title: "Processing completed",
        description: "Your data has been successfully processed",
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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">API Data Processor</h1>
          <p className="text-muted-foreground">
            Paste API responses, write processing code, and see the results instantly
          </p>
        </div>

        {/* Section 1: API Data Input */}
        <Card>
          <Collapsible open={isSection1Open} onOpenChange={setIsSection1Open}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <span>1. API Response Data</span>
                  {isSection1Open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Paste your raw API response here. Can be JSON, XML, or plain text.
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

        {/* Section 2: Processing Code */}
        <Card>
          <Collapsible open={isSection2Open} onOpenChange={setIsSection2Open}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <span>2. Processing Function</span>
                  {isSection2Open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Write your JavaScript/TypeScript processing function. The API data will be available as the "data" variable.
                  Use "return" to output your result.
                </p>
                <Textarea
                  value={processingCode}
                  onChange={(e) => setProcessingCode(e.target.value)}
                  className="min-h-[250px] font-mono text-sm"
                  placeholder="// Your processing code here..."
                />
                <Button onClick={processData} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Process Data
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Section 3: Output */}
        <Card>
          <Collapsible open={isSection3Open} onOpenChange={setIsSection3Open}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <span>3. Processed Output</span>
                  {isSection3Open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    The result of your processing function will appear here.
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
                  placeholder="Processed output will appear here..."
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Usage Instructions */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-lg">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Step 1:</strong> Paste your API response data in the first section</div>
            <div><strong>Step 2:</strong> Write your processing function in the second section (data is available as "data" variable)</div>
            <div><strong>Step 3:</strong> Click "Process Data" to see the result in the output section</div>
            <div className="mt-3 p-3 bg-muted/50 rounded-md">
              <strong>Example function:</strong><br />
              <code className="text-xs">
                // Extract specific fields from JSON<br />
                return &#123;<br />
                &nbsp;&nbsp;name: data.user?.name,<br />
                &nbsp;&nbsp;email: data.user?.email<br />
                &#125;;
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiProcessor;
