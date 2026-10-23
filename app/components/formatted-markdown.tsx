import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children }) => (
    <p className="text-base font-semibold leading-6 text-sift-ink">{children}</p>
  ),
  h2: ({ children }) => (
    <p className="text-base font-semibold leading-6 text-sift-ink">{children}</p>
  ),
  h3: ({ children }) => (
    <p className="text-sm font-semibold leading-6 text-sift-ink">{children}</p>
  ),
  h4: ({ children }) => (
    <p className="text-sm font-semibold leading-6 text-sift-ink">{children}</p>
  ),
  h5: ({ children }) => (
    <p className="text-sm font-semibold leading-6 text-sift-ink">{children}</p>
  ),
  h6: ({ children }) => (
    <p className="text-sm font-semibold leading-6 text-sift-ink">{children}</p>
  ),
  p: ({ children }) => (
    <p className="leading-6 [&+p]:mt-3">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-1 pl-5 leading-6">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-1 pl-5 leading-6">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-sift-ink">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-sift-accent pl-4 text-sift-ink-2">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      className="font-medium text-sift-accent underline underline-offset-2"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-sift-paper-3 px-1 py-0.5 font-mono text-[0.9em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg bg-sift-paper-3 p-3 text-xs leading-5">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <table className="w-full border-collapse text-left text-sm">{children}</table>
  ),
  th: ({ children }) => (
    <th className="border-b border-sift-rule px-2 py-1 font-semibold text-sift-ink">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-sift-rule px-2 py-1 align-top">{children}</td>
  ),
};

function normalizeMarkdown(markdown: string) {
  return markdown
    .replace(/\r\n?/g, "\n")
    .replace(/([^\n])\s+(#{1,6}\s+)/g, "$1\n\n$2")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function plainTextPreview(markdown: string, maxLength = 220) {
  const text = normalizeMarkdown(markdown)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength
    ? `${text.slice(0, maxLength).trimEnd()}…`
    : text;
}

export default function FormattedMarkdown({
  children,
}: {
  children: string;
}) {
  return (
    <div className="min-w-0 space-y-3 break-words text-sm text-sift-ink-2 [&_hr]:border-sift-rule">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {normalizeMarkdown(children)}
      </ReactMarkdown>
    </div>
  );
}
