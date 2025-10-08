import { v4 as uuidv4 } from 'uuid';

/**
 * Custom markdown to BlockNote parser that properly handles single line breaks
 * by creating separate paragraph blocks for each line, preserving the original structure
 */
export const parseMarkdownToBlockNoteBlocks = (markdown: string) => {
  if (!markdown || markdown.trim() === '') {
    return [];
  }

  // Split the markdown into lines
  const lines = markdown.split('\n');
  const blocks: any[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip empty lines (they represent paragraph breaks)
    if (line.trim() === '') {
      continue;
    }

    // Create a new paragraph block for each non-empty line
    const block = {
      id: uuidv4(),
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: parseLineContent(line),
      children: [],
    };

    blocks.push(block);
  }

  return blocks;
};

/**
 * Parse a single line content, handling links and text
 */
const parseLineContent = (line: string) => {
  const content: any[] = [];
  
  // Simple URL regex to detect links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(line)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      const textBefore = line.substring(lastIndex, match.index);
      if (textBefore.trim()) {
        content.push({
          type: 'text',
          text: textBefore,
          styles: {},
        });
      }
    }

    // Add the link
    content.push({
      type: 'link',
      href: match[0],
      content: [
        {
          type: 'text',
          text: match[0],
          styles: {},
        },
      ],
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last link
  if (lastIndex < line.length) {
    const textAfter = line.substring(lastIndex);
    if (textAfter.trim()) {
      content.push({
        type: 'text',
        text: textAfter,
        styles: {},
      });
    }
  }

  // If no links were found, add the entire line as text
  if (content.length === 0) {
    content.push({
      type: 'text',
      text: line,
      styles: {},
    });
  }

  return content;
};
