/**
 * Text processing and formatting utilities
 */

export interface TextFormatOptions {
  trimWhitespace?: boolean;
  normalizeLineEndings?: boolean;
  removeEmptyLines?: boolean;
  maxLineLength?: number;
  indentSize?: number;
}

export class TextUtils {
  /**
   * Clean and normalize text content
   */
  static clean(text: string, options: TextFormatOptions = {}): string {
    const {
      trimWhitespace = true,
      normalizeLineEndings = true,
      removeEmptyLines = false,
      maxLineLength,
      indentSize = 2
    } = options;

    let cleaned = text;

    if (trimWhitespace) {
      cleaned = cleaned.trim();
    }

    if (normalizeLineEndings) {
      cleaned = cleaned.replace(/\r\n|\r/g, '\n');
    }

    if (removeEmptyLines) {
      cleaned = cleaned.replace(/^\s*\n/gm, '');
    }

    if (maxLineLength) {
      cleaned = this.wrapLines(cleaned, maxLineLength);
    }

    return cleaned;
  }

  /**
   * Extract code blocks from text using various patterns
   */
  static extractCodeBlocks(text: string): Array<{ language?: string; code: string; line: number }> {
    const blocks: Array<{ language?: string; code: string; line: number }> = [];
    const lines = text.split('\n');
    
    let inBlock = false;
    let currentBlock = '';
    let currentLanguage = '';
    let blockStartLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for fenced code blocks (```)
      if (line.trim().startsWith('```')) {
        if (!inBlock) {
          // Starting a new block
          inBlock = true;
          currentLanguage = line.trim().substring(3).trim();
          currentBlock = '';
          blockStartLine = i + 1;
        } else {
          // Ending current block
          inBlock = false;
          blocks.push({
            language: currentLanguage || undefined,
            code: currentBlock.trim(),
            line: blockStartLine
          });
          currentBlock = '';
          currentLanguage = '';
        }
      } else if (inBlock) {
        currentBlock += line + '\n';
      }
    }

    // Handle unclosed blocks
    if (inBlock && currentBlock.trim()) {
      blocks.push({
        language: currentLanguage || undefined,
        code: currentBlock.trim(),
        line: blockStartLine
      });
    }

    return blocks;
  }

  /**
   * Convert text to various cases
   */
  static toCase = {
    camel: (str: string): string => {
      return str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
    },

    pascal: (str: string): string => {
      const camel = TextUtils.toCase.camel(str);
      return camel.charAt(0).toUpperCase() + camel.slice(1);
    },

    snake: (str: string): string => {
      return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
                .replace(/[-\s]+/g, '_')
                .replace(/^_/, '');
    },

    kebab: (str: string): string => {
      return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
                .replace(/[_\s]+/g, '-')
                .replace(/^-/, '');
    },

    title: (str: string): string => {
      return str.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    },

    sentence: (str: string): string => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
  };

  /**
   * Generate a slug from text
   */
  static slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  /**
   * Count words, characters, and lines
   */
  static count(text: string): { words: number; characters: number; lines: number; charactersNoSpaces: number } {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const lines = text.split('\n').length;

    return { words, characters, charactersNoSpaces, lines };
  }

  /**
   * Truncate text with ellipsis
   */
  static truncate(text: string, maxLength: number, suffix = '...'): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Wrap lines at specified length
   */
  static wrapLines(text: string, maxLength: number): string {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines.join('\n');
  }

  /**
   * Remove HTML tags from text
   */
  static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Escape HTML special characters
   */
  static escapeHtml(text: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    return text.replace(/[&<>"']/g, char => htmlEscapes[char]);
  }

  /**
   * Calculate text similarity using Levenshtein distance
   */
  static similarity(text1: string, text2: string): number {
    const matrix: number[][] = [];
    const len1 = text1.length;
    const len2 = text2.length;

    if (len1 === 0) return len2;
    if (len2 === 0) return len1;

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = text1[i - 1] === text2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
  }

  /**
   * Extract URLs from text
   */
  static extractUrls(text: string): string[] {
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    return text.match(urlRegex) || [];
  }

  /**
   * Extract email addresses from text
   */
  static extractEmails(text: string): string[] {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return text.match(emailRegex) || [];
  }

  /**
   * Highlight search terms in text
   */
  static highlight(text: string, searchTerms: string[], highlightClass = 'highlight'): string {
    if (!searchTerms.length) return text;
    
    const regex = new RegExp(`(${searchTerms.join('|')})`, 'gi');
    return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
  }

  /**
   * Generate a random string
   */
  static randomString(length: number, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  /**
   * Parse CSV text into arrays
   */
  static parseCSV(csvText: string, delimiter = ','): string[][] {
    const lines = csvText.split('\n');
    const result: string[][] = [];
    
    for (const line of lines) {
      if (line.trim()) {
        // Simple CSV parsing - doesn't handle quoted fields with commas
        result.push(line.split(delimiter).map(field => field.trim()));
      }
    }
    
    return result;
  }

  /**
   * Convert arrays to CSV text
   */
  static toCSV(data: string[][], delimiter = ','): string {
    return data.map(row => row.join(delimiter)).join('\n');
  }
}