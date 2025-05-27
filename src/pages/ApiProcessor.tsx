function prettifyScratchCode(raw) {
  let code = '';
  
  // Step 1: Extract the actual code string from JSON structure
  if (typeof raw === 'string') {
    code = raw;
  } else if (raw && typeof raw === 'object') {
    // Handle the JSON structure: { "type": "text", "text": { "value": "..." } }
    if (raw.text && raw.text.value) {
      code = raw.text.value;
    } else if (raw.value) {
      code = raw.value;
    } else {
      // Try to find any string property
      const str = JSON.stringify(raw);
      const match = str.match(/"value"\s*:\s*"([^"]+)"/);
      if (match) {
        code = match[1];
      } else {
        code = String(raw);
      }
    }
  }
  
  // Step 1.5: Remove JSON wrapper if it exists
  // Look for pattern like: { "type": "text", "text": { "value": "ACTUAL_CODE" }, "annotations": [] }
  if (code.includes('"type": "text"') && code.includes('"value":')) {
    const match = code.match(/"value"\s*:\s*"([^"\\]*(\\.[^"\\]*)*)"/);
    if (match) {
      code = match[1];
    }
  }
  
  // Step 2: Remove leading numbering (like "0:")
  code = code.replace(/^\s*\d+:\s*/, '');
  
  // Step 3: Handle escaped newlines and quotes
  code = code.replace(/\\n/g, '\n');
  code = code.replace(/\\"/g, '"');
  
  // Step 4: Add proper spacing around sections
  code = code.replace(/\nextras:/g, '\n\nextras:');
  code = code.replace(/\ndefine /g, '\n\ndefine ');
  
  // Step 5: Add 2-space indentation for non-top-level lines
  const lines = code.split('\n');
  const formattedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return ''; // Empty lines stay empty
    
    // Top-level elements (no indent)
    if (trimmed.startsWith('Stage:') || 
        trimmed.startsWith('Ball:') || 
        trimmed.startsWith('define ') ||
        trimmed.startsWith('extras:')) {
      return trimmed;
    }
    
    // Everything else gets 2 spaces
    return '  ' + trimmed;
  });
  
  // Step 6: Format JSON in extras blocks
  let result = formattedLines.join('\n');
  result = result.replace(/extras:\s*{([^}]+)}/g, (match, inner) => {
    try {
      const obj = JSON.parse(`{${inner}}`);
      const formatted = JSON.stringify(obj, null, 2);
      // Indent the JSON lines properly
      const indentedJson = formatted.split('\n').map((line, index) => 
        index === 0 ? line : '  ' + line
      ).join('\n');
      return `extras: ${indentedJson}`;
    } catch {
      return match; // If JSON parsing fails, return original
    }
  });
  
  return result.trim();
}