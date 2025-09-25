/**
 * JSON formatting and validation utilities
 */

export interface JsonFormatOptions {
  indent?: number;
  maxDepth?: number;
  sortKeys?: boolean;
  includeComments?: boolean;
}

export class JsonFormatter {
  /**
   * Pretty print JSON with customizable formatting
   */
  static format(data: any, options: JsonFormatOptions = {}): string {
    const {
      indent = 2,
      maxDepth = 10,
      sortKeys = false,
      includeComments = false
    } = options;

    try {
      let processed = data;
      
      if (sortKeys && typeof data === 'object' && data !== null) {
        processed = this.sortObjectKeys(data, maxDepth);
      }

      const formatted = JSON.stringify(processed, null, indent);
      
      if (includeComments) {
        return this.addTypeComments(formatted);
      }
      
      return formatted;
    } catch (error) {
      throw new Error(`JSON formatting failed: ${error.message}`);
    }
  }

  /**
   * Minify JSON by removing whitespace
   */
  static minify(data: any): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      throw new Error(`JSON minification failed: ${error.message}`);
    }
  }

  /**
   * Validate JSON string and return parsed result
   */
  static validate(jsonString: string): { isValid: boolean; data?: any; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      return { isValid: true, data };
    } catch (error) {
      return { 
        isValid: false, 
        error: error.message,
        data: null 
      };
    }
  }

  /**
   * Convert object to flat key-value pairs
   */
  static flatten(obj: any, prefix = '', delimiter = '.'): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}${delimiter}${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(result, this.flatten(obj[key], newKey, delimiter));
        } else {
          result[newKey] = obj[key];
        }
      }
    }
    
    return result;
  }

  /**
   * Convert flat object back to nested structure
   */
  static unflatten(obj: Record<string, any>, delimiter = '.'): any {
    const result: any = {};
    
    for (const key in obj) {
      const keys = key.split(delimiter);
      let current = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = obj[key];
    }
    
    return result;
  }

  /**
   * Deep merge multiple objects
   */
  static merge(...objects: any[]): any {
    if (objects.length === 0) return {};
    if (objects.length === 1) return objects[0];

    const result = {};
    
    for (const obj of objects) {
      this.deepMerge(result, obj);
    }
    
    return result;
  }

  /**
   * Extract schema from JSON object
   */
  static extractSchema(data: any): any {
    if (data === null) return { type: 'null' };
    if (Array.isArray(data)) {
      return {
        type: 'array',
        items: data.length > 0 ? this.extractSchema(data[0]) : { type: 'unknown' }
      };
    }
    if (typeof data === 'object') {
      const schema: any = { type: 'object', properties: {} };
      for (const key in data) {
        schema.properties[key] = this.extractSchema(data[key]);
      }
      return schema;
    }
    return { type: typeof data };
  }

  // Private helper methods
  private static sortObjectKeys(obj: any, maxDepth: number, currentDepth = 0): any {
    if (currentDepth >= maxDepth || obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectKeys(item, maxDepth, currentDepth + 1));
    }

    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    
    for (const key of keys) {
      sorted[key] = this.sortObjectKeys(obj[key], maxDepth, currentDepth + 1);
    }
    
    return sorted;
  }

  private static addTypeComments(jsonString: string): string {
    // Add basic type comments for better readability
    return jsonString
      .replace(/: "([^"]*)",?$/gm, ': "$1", // string')
      .replace(/: (\d+),?$/gm, ': $1, // number')
      .replace(/: (true|false),?$/gm, ': $1, // boolean')
      .replace(/: null,?$/gm, ': null, // null');
  }

  private static deepMerge(target: any, source: any): void {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
}