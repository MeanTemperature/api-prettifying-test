import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApiProcessor = () => {
  const [step1Data, setStep1Data] = useState(`<html>
<head><title>User Directory</title></head>
<body>
  <div class="user-container">
    <div class="user-card active" data-id="1">
      <h2>John Doe</h2>
      <p class="email">john@example.com</p>
      <span class="age">30</span>
      <span class="city">New York</span>
      <span class="status">Active</span>
    </div>
    <div class="user-card inactive" data-id="2">
      <h2>Jane Smith</h2>
      <p class="email">jane@example.com</p>
      <span class="age">25</span>
      <span class="city">Los Angeles</span>
      <span class="status">Inactive</span>
    </div>
    <div class="user-card active" data-id="3">
      <h2>Bob Johnson</h2>
      <p class="email">bob@example.com</p>
      <span class="age">35</span>
      <span class="city">Chicago</span>
      <span class="status">Active</span>
    </div>
  </div>
</body>
</html>`);
  const [step2Function, setStep2Function] = useState(`function parseActiveUsers(htmlData) {
  // Create a DOM parser to work with the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlData, 'text/html');
  
  // Find all active user cards
  const activeCards = doc.querySelectorAll('.user-card.active');
  
  // Format the output
  let result = 'Active Users Report:\\n';
  result += '==================\\n\\n';
  
  activeCards.forEach(card => {
    const name = card.querySelector('h2').textContent;
    const email = card.querySelector('.email').textContent;
    const age = card.querySelector('.age').textContent;
    const city = card.querySelector('.city').textContent;
    
    result += \`Name: \${name}\\n\`;
    result += \`Email: \${email}\\n\`;
    result += \`Age: \${age}\\n\`;
    result += \`City: \${city}\\n\`;
    result += '---\\n';
  });
  
  result += \`\\nTotal active users: \${activeCards.length}\`;
  
  return result;
}

// Process the HTML data
return parseActiveUsers(data);`);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const { toast } = useToast();

  const copyProcessSummary = () => {
    const summary = `**API Processing Summary**

**Raw Input Data:**
\`\`\`
${step1Data}
\`\`\`

**Processing Function:**
\`\`\`javascript
${step2Function}
\`\`\`

**Result:**
\`\`\`
${result || error || 'No result yet - function needs to be executed'}
\`\`\``;

    navigator.clipboard.writeText(summary).then(() => {
      toast({
        title: "Copied!",
        description: "Processing summary copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    });
  };

  const executeProcessor = () => {
    setError('');
    setResult('');
    setDebugInfo('');
    
    try {
      console.log('=== EXECUTION START ===');
      console.log('Step 1 Data length:', step1Data.length);
      console.log('Step 2 Function:', step2Function);
      
      // For HTML data, we'll pass it as a string directly
      let data = step1Data;
      console.log('Using data as HTML string, length:', data.length);

      // Better function execution approach - wrap in an IIFE that returns the result
      const functionCode = `
        (() => {
          ${step2Function}
        })()
      `;

      console.log('About to execute function...');
      
      // Execute the function with DOMParser support
      const wrappedFunction = new Function('data', 'console', 'DOMParser', `return (${functionCode})`);
      const processedResult = wrappedFunction(data, console, DOMParser);
      
      console.log('Function executed successfully, result:', processedResult);
      console.log('Result type:', typeof processedResult);
      console.log('Result length:', processedResult?.length || 0);
      
      if (processedResult === undefined) {
        setDebugInfo('Function executed but returned undefined. Check that your function has a proper return statement.');
        setError(`Function returned undefined. Common issues:

1. Missing return statement
2. Syntax error in function call (extra spaces, typos)
3. Function not being called
4. HTML structure doesn't match expected selectors

Your function should end with something like:
return extract2CodeBlocks(data);

Current function type: ${typeof processedResult}`);
      } else if (processedResult === '') {
        setDebugInfo('Function executed but returned empty string. Check if HTML contains expected elements.');
        setResult('(Empty result - check if HTML contains the expected code block elements)');
      } else {
        setResult(typeof processedResult === 'string' ? processedResult : JSON.stringify(processedResult, null, 2));
        setDebugInfo('Execution completed successfully with result');
      }
      
    } catch (executionError) {
      console.error('=== EXECUTION ERROR ===');
      console.error('Error:', executionError);
      console.error('Stack:', executionError.stack);
      
      const errorMessage = executionError.message || 'Unknown error';
      
      setError(`Execution Error: ${errorMessage}\n\nStack: ${executionError.stack}`);
      setDebugInfo(`Error type: ${executionError.name}, Message: ${errorMessage}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Data Processor</CardTitle>
          <CardDescription>
            Process API data through custom JavaScript functions with enhanced error debugging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Data Input */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 1: Input Data (HTML / JSON)</h3>
            <p className="text-sm text-gray-600 mb-2">
              Paste your raw HTML or JSON data here. The function will process it using DOM parsing or JSON.parse().
            </p>
            <Textarea
              placeholder="Paste your HTML data here..."
              value={step1Data}
              onChange={(e) => setStep1Data(e.target.value)}
              className="min-h-32 text-xs"
            />
          </div>

          <Separator />

          {/* Step 2: Processing Function */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 2: Processing Function</h3>
            <p className="text-sm text-gray-600 mb-2">
              The function has been updated with debugging to help identify which selectors work with your HTML.
            </p>
            <Textarea
              placeholder="Enter your processing function (JavaScript)..."
              value={step2Function}
              onChange={(e) => setStep2Function(e.target.value)}
              className="min-h-40 font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={executeProcessor}
              className="flex-1"
              disabled={!step1Data || !step2Function}
            >
              Execute Processor
            </Button>
            
            <Button 
              onClick={copyProcessSummary}
              variant="outline"
              className="flex items-center gap-2"
              disabled={!step1Data || !step2Function}
            >
              <Copy size={16} />
              Copy Summary
            </Button>
          </div>

          {/* Debug Information */}
          {debugInfo && (
            <Alert>
              <AlertDescription>
                <strong>Debug:</strong> {debugInfo}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-sm">{error}</pre>
              </AlertDescription>
            </Alert>
          )}

          {/* Result Display */}
          {result && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Result:</h3>
              <Card>
                <CardContent className="p-4">
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded overflow-auto">
                    {result}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiProcessor;
