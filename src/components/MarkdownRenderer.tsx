'use client';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    const result: React.ReactNode[] = [];
    let i = 0;
    let listItems: string[] = [];
    let orderedListItems: string[] = [];

    const flushLists = () => {
      if (listItems.length > 0) {
        result.push(
          <ul key={`ul-${result.length}`} className="list-disc list-inside mb-4 space-y-1 text-text-secondary">
            {listItems.map((item, idx) => (
              <li key={idx} className="ml-2">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
      if (orderedListItems.length > 0) {
        result.push(
          <ol key={`ol-${result.length}`} className="list-decimal list-inside mb-4 space-y-1 text-text-secondary">
            {orderedListItems.map((item, idx) => (
              <li key={idx} className="ml-2">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
        orderedListItems = [];
      }
    };

    while (i < lines.length) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Headers
      if (trimmedLine.startsWith('## ')) {
        flushLists();
        result.push(
          <h2 key={`h2-${result.length}`} className="text-2xl font-bold text-text mt-6 mb-3">
            {parseInlineMarkdown(trimmedLine.slice(3))}
          </h2>
        );
      } else if (trimmedLine.startsWith('# ')) {
        flushLists();
        result.push(
          <h1 key={`h1-${result.length}`} className="text-3xl font-bold text-text mt-8 mb-4">
            {parseInlineMarkdown(trimmedLine.slice(2))}
          </h1>
        );
      }
      // Unordered lists
      else if (trimmedLine.startsWith('- ')) {
        listItems.push(trimmedLine.slice(2));
      }
      // Ordered lists
      else if (/^\d+\.\s/.test(trimmedLine)) {
        const match = trimmedLine.match(/^\d+\.\s(.*)$/);
        if (match) {
          orderedListItems.push(match[1]);
        }
      }
      // Empty lines
      else if (trimmedLine === '') {
        flushLists();
        if (i > 0 && i < lines.length - 1) {
          result.push(<div key={`br-${result.length}`} className="mb-2" />);
        }
      }
      // Regular paragraphs
      else if (trimmedLine.length > 0) {
        flushLists();
        result.push(
          <p key={`p-${result.length}`} className="text-text-secondary leading-relaxed mb-4">
            {parseInlineMarkdown(trimmedLine)}
          </p>
        );
      }

      i++;
    }

    flushLists();
    return result;
  };

  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let currentPos = 0;

    // Regex to find **bold**, *italic*, and regular text
    const regex = /\*\*(.+?)\*\*|\*(.+?)\*|([^*]+)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        // Bold
        result.push(
          <strong key={`bold-${result.length}`} className="font-semibold text-text">
            {match[1]}
          </strong>
        );
      } else if (match[2]) {
        // Italic
        result.push(
          <em key={`italic-${result.length}`} className="italic text-text-secondary">
            {match[2]}
          </em>
        );
      } else if (match[3]) {
        // Regular text
        result.push(match[3]);
      }
    }

    return result.length > 0 ? result : [text];
  };

  return <div className="prose prose-sm max-w-none">{parseMarkdown(content)}</div>;
}
