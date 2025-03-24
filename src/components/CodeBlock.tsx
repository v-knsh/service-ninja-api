
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeBlock = ({ code, language = 'json', title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg overflow-hidden my-4 bg-secondary">
      {title && (
        <div className="bg-secondary/70 backdrop-blur-sm px-4 py-2 text-xs font-mono text-secondary-foreground border-b border-border">
          {title}
        </div>
      )}
      <pre className="p-4 text-sm font-mono overflow-x-auto">
        <code className="language-json">{code}</code>
      </pre>
      <button 
        className="absolute top-3 right-3 p-2 rounded-md bg-muted/80 hover:bg-muted transition-colors"
        onClick={handleCopy}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
};

export default CodeBlock;
