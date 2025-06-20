import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApiProcessor = () => {
  const [step1Data, setStep1Data] = useState('');
  const [step2Function, setStep2Function] = useState(`function extract2CodeBlocksFromHtml(htmlString) {
  // Parse the HTML string into a document
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  console.log('=== DEBUGGING SELECTORS ===');
  
  // Let's try different selectors to see what exists
  const allCodeSpaceBlocks = Array.from(doc.querySelectorAll('[class*="code-space-block"]'));
  console.log('All elements with code-space-block in class:', allCodeSpaceBlocks.length);
  
  const allDepthElements = Array.from(doc.querySelectorAll('[class*="depth-"]'));
  console.log('All elements with depth- in class:', allDepthElements.length);
  
  const allContentsElements = Array.from(doc.querySelectorAll('[class*="contents"]'));
  console.log('All elements with contents in class:', allContentsElements.length);
  
  // Try the original selector
  const blocks = Array.from(doc.querySelectorAll('.code-space-block__contents.depth-0, .code-space-block__contents.depth-1, .code-space-block__contents.depth-2'));
  console.log('Original selector found blocks:', blocks.length);
  
  // Try a broader selector
  const broadBlocks = Array.from(doc.querySelectorAll('.code-space-block__contents'));
  console.log('Broader selector (.code-space-block__contents) found:', broadBlocks.length);
  
  // Try even broader
  const veryBroadBlocks = Array.from(doc.querySelectorAll('[class*="code-space-block__contents"]'));
  console.log('Very broad selector found:', veryBroadBlocks.length);
  
  // Log some class names we find
  if (allCodeSpaceBlocks.length > 0) {
    console.log('Sample class names found:');
    allCodeSpaceBlocks.slice(0, 5).forEach((el, i) => {
      console.log(\`Element \${i}: \${el.className}\`);
    });
  }
  
  function extractBlock(blockElem, depth = 0) {
    let result = '';

    const cmdElem = blockElem.querySelector('.code-space-block__contents__row__command .code-space-display.block, .code-space-block__contents__row__command .code-space-display.block.command');
    let line = cmdElem ? cmdElem.innerText.trim() : '';

    const inputRows = blockElem.querySelectorAll('.code-space-block-input__row, .code-space-block-input__row.code-space-block-input__row--last');
    inputRows.forEach(row => {
      const editables = row.querySelectorAll('.code-space-input-element__contenteditable, .code-space-display.identifier, .code-space-display.action, .code-space-display.vartype, .code-space-display.conditional, .code-space-display.property, .code-space-display.assignment');
      editables.forEach(e => {
        const text = e.innerText.trim();
        if (text && !line.includes(text)) {
          line += ' ' + text;
        }
      });
      const labels = row.querySelectorAll('.code-space-display.input-label');
      labels.forEach(lab => {
        const text = lab.innerText.trim();
        if (text && !line.includes(text)) {
          line += ' ' + text;
        }
      });
    });

    result += '  '.repeat(depth) + line + '\\n';

    const childBlocks = blockElem.querySelectorAll(':scope > .code-space-block__children.print-display-block > div > .code-space-block__children__child__line > .code-space-block.print-display-block, :scope > .code-space-block__children.print-display-block > .code-space-block__children__child > .code-space-block__children__child__line > .code-space-block.print-display-block');
    childBlocks.forEach(child => {
      result += extractBlock(child, depth + 1);
    });

    return result;
  }

  let output = '';
  
  // Use the blocks that were found
  const blocksToProcess = blocks.length > 0 ? blocks : broadBlocks.length > 0 ? broadBlocks : veryBroadBlocks;
  console.log('Processing', blocksToProcess.length, 'blocks');
  
  blocksToProcess.forEach(blockElem => {
    if (!blockElem.closest('.code-space-block__children__child__line, .code-space-block__children__child')) {
      output += extractBlock(blockElem, 0);
    }
  });

  console.log('--- 2Code as plain text ---\\n' + output);
  console.log('=== END DEBUGGING ===');
  return output;
}

// Run it with the HTML data
return extract2CodeBlocksFromHtml(data);`);
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
            <h3 className="text-lg font-semibold mb-2">Step 1: Input Data (HTML)</h3>
            <p className="text-sm text-gray-600 mb-2">
              Paste your raw HTML data here. For large HTML, you can paste the entire content.
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
