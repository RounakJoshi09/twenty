import { parseMarkdownToBlockNoteBlocks } from '../custom-markdown-to-blocknote-parser.util';

describe('parseMarkdownToBlockNoteBlocks', () => {
  it('should create separate paragraph blocks for each line', () => {
    const markdown = `Rounaks Company signedup on 2025-10-07T18:31:00.162Z
This is the first outreach call. Capture Company type if known
https://github.com/twentyhq/twenty/issues/14879 - This link is for the issue of next line
This is in next line`;

    const result = parseMarkdownToBlockNoteBlocks(markdown);

    expect(result).toHaveLength(4);
    expect(result[0].type).toBe('paragraph');
    expect(result[0].content[0].text).toBe(
      'Rounaks Company signedup on 2025-10-07T18:31:00.162Z',
    );

    expect(result[1].type).toBe('paragraph');
    expect(result[1].content[0].text).toBe(
      'This is the first outreach call. Capture Company type if known',
    );

    expect(result[2].type).toBe('paragraph');
    expect(result[2].content[0].type).toBe('link');
    expect(result[2].content[0].href).toBe(
      'https://github.com/twentyhq/twenty/issues/14879',
    );
    expect(result[2].content[1].text).toBe(
      ' - This link is for the issue of next line',
    );

    expect(result[3].type).toBe('paragraph');
    expect(result[3].content[0].text).toBe('This is in next line');
  });

  it('should handle empty lines by skipping them', () => {
    const markdown = `Line 1

Line 2

Line 3`;

    const result = parseMarkdownToBlockNoteBlocks(markdown);

    expect(result).toHaveLength(3);
    expect(result[0].content[0].text).toBe('Line 1');
    expect(result[1].content[0].text).toBe('Line 2');
    expect(result[2].content[0].text).toBe('Line 3');
  });

  it('should handle links within text correctly', () => {
    const markdown = `Check out this link: https://example.com for more info`;

    const result = parseMarkdownToBlockNoteBlocks(markdown);

    expect(result).toHaveLength(1);
    expect(result[0].content[0].text).toBe('Check out this link: ');
    expect(result[0].content[1].type).toBe('link');
    expect(result[0].content[1].href).toBe('https://example.com');
    expect(result[0].content[2].text).toBe(' for more info');
  });

  it('should handle empty markdown', () => {
    const result = parseMarkdownToBlockNoteBlocks('');

    expect(result).toEqual([]);
  });

  it('should handle markdown with only whitespace', () => {
    const result = parseMarkdownToBlockNoteBlocks('   \n  \n  ');

    expect(result).toEqual([]);
  });

  it('should generate unique IDs for each block', () => {
    const markdown = `Line 1
Line 2`;

    const result = parseMarkdownToBlockNoteBlocks(markdown);

    expect(result[0].id).toBeDefined();
    expect(result[1].id).toBeDefined();
    expect(result[0].id).not.toBe(result[1].id);
  });
});
