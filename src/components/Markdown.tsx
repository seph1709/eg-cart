// components/Markdown.tsx
import React from "react";
import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownProps = Options & {
  className?: string;
};

export function Markdown({ className, children, ...props }: MarkdownProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} {...props}>
      {children as string}
    </ReactMarkdown>
  );
}
