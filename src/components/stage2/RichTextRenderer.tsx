import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold my-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold my-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-medium my-2">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-base my-2 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-600 my-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 my-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 my-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="my-1">{children}</li>,
    number: ({ children }) => <li className="my-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {children}
      </a>
    ),
  },
};

type RichTextRendererProps = {
  value: PortableTextBlock[];
};

const RichTextRenderer = ({ value }: RichTextRendererProps) => {
  return <PortableText value={value} components={components} />;
};

export default RichTextRenderer;
