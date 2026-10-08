import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Secure, styled Markdown renderer for project content and documentation.
 *
 * Employs `react-markdown` with GitHub Flavored Markdown (`remark-gfm`),
 * strictly sanitizes raw HTML by default, and customizes semantic tags
 * with accessible, high-contrast Tailwind styling.
 */
export function MarkdownContent({
  content,
  className = "",
}: MarkdownContentProps) {
  return (
    <div className={`prose-container max-w-none text-gray-700 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-8 mb-4 border-b border-gray-200 pb-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-7 mb-3 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-2 text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-3.5 text-base leading-relaxed text-gray-700 sm:text-lg">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-4 list-outside list-disc space-y-1.5 pl-6 text-base text-gray-700 sm:text-lg">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 list-outside list-decimal space-y-1.5 pl-6 text-base text-gray-700 sm:text-lg">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 rounded-r-lg border-l-4 border-blue-500 bg-blue-50/40 py-2.5 pr-4 pl-4 italic text-gray-700">
              {children}
            </blockquote>
          ),
          code: ({ className: codeClassName, children, ...props }) => {
            const isInline = !codeClassName && typeof children === "string" && !children.includes("\n");

            if (isInline) {
              return (
                <code
                  className="rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-blue-700 sm:text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className={`font-mono text-xs text-gray-100 sm:text-sm ${codeClassName || ""}`}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-5 overflow-x-auto rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5 shadow-inner">
              {children}
            </pre>
          ),
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="font-semibold text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-700"
              >
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 font-semibold text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-gray-200 px-4 py-2.5 text-gray-700">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-gray-200" />,
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || "Project diagram or illustration"}
              loading="lazy"
              className="my-6 max-h-96 w-auto rounded-xl border border-gray-200 shadow-sm"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
