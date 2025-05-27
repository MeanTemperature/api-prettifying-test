
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const ApiProcessor = () => {
  const [step1Data, setStep1Data] = useState('');
  const [step2Function, setStep2Function] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const executeProcessor = () => {
    setError('');
    setResult('');
    setDebugInfo('');
    
    try {
      console.log('=== EXECUTION START ===');
      console.log('Step 1 Data:', step1Data);
      console.log('Step 2 Function:', step2Function);
      
      // Parse the data safely
      let data;
      try {
        data = JSON.parse(step1Data);
        console.log('Parsed data successfully:', data);
      } catch (parseError) {
        // If JSON parsing fails, treat as string
        data = step1Data;
        console.log('Using data as string:', data);
      }

      // Better function execution approach - wrap in an IIFE that returns the result
      const functionCode = `
        (() => {
          ${step2Function}
        })()
      `;

      console.log('About to execute function...');
      console.log('Function code:', functionCode);
      
      // Execute the function
      const wrappedFunction = new Function('data', 'console', `return (${functionCode})`);
      const processedResult = wrappedFunction(data, console);
      
      console.log('Function executed successfully, result:', processedResult);
      console.log('Result type:', typeof processedResult);
      
      if (processedResult === undefined) {
        setDebugInfo('Function executed but returned undefined. Check that your function has a proper return statement.');
        setError(`Function returned undefined. Common issues:

1. Missing return statement
2. Syntax error in function call (extra spaces, typos)
3. Function not being called

Your function should end with something like:
return prettifyScratchCode(data);

Current function type: ${typeof processedResult}`);
      } else {
        setResult(typeof processedResult === 'string' ? processedResult : JSON.stringify(processedResult, null, 2));
        setDebugInfo('Execution completed successfully with result');
      }
      
    } catch (executionError) {
      console.error('=== EXECUTION ERROR ===');
      console.error('Error:', executionError);
      console.error('Stack:', executionError.stack);
      
      const errorMessage = executionError.message || 'Unknown error';
      const isRegexError = errorMessage.includes('Invalid regular expression') || 
                          errorMessage.includes('unmatched parentheses');
      
      if (isRegexError) {
        setError(`Regex Error Detected: ${errorMessage}
        
This error suggests that somewhere in the execution chain, your input data (which contains unmatched parentheses like "(score)", "(10)", etc.) is being treated as a regex pattern.

Debug Info:
- Your function's regex patterns are static and valid
- The error is likely from the JavaScript execution environment
- Try using simpler test data without parentheses to confirm

Stack trace: ${executionError.stack}`);
      } else {
        setError(`Execution Error: ${errorMessage}\n\nStack: ${executionError.stack}`);
      }
      
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
            <h3 className="text-lg font-semibold mb-2">Step 1: Input Data</h3>
            <Textarea
              placeholder="Enter your data (JSON or string)..."
              value={step1Data}
              onChange={(e) => setStep1Data(e.target.value)}
              className="min-h-32"
            />
          </div>

          <Separator />

          {/* Step 2: Processing Function */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 2: Processing Function</h3>
            <p className="text-sm text-gray-600 mb-2">
              Make sure your function ends with a return statement, like: <code>return prettifyScratchCode(data);</code>
            </p>
            <Textarea
              placeholder="Enter your processing function (JavaScript)..."
              value={step2Function}
              onChange={(e) => setStep2Function(e.target.value)}
              className="min-h-40 font-mono text-sm"
            />
          </div>

          <Button 
            onClick={executeProcessor}
            className="w-full"
            disabled={!step1Data || !step2Function}
          >
            Execute Processor
          </Button>

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
