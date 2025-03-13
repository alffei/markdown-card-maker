"use client";

import React, { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// Theme styles
const themeStyles = {
  default: {
    card: "bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 w-[600px] max-w-[600px] font-sans",
    content: "prose dark:prose-invert max-w-none",
    border: "border-l-4 border-blue-500 pl-6 my-4",
    heading: "text-xl font-bold mb-4 text-blue-600 dark:text-blue-400",
  },
  modern: {
    card: "bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800 rounded-xl shadow-lg p-10 w-[600px] max-w-[600px] font-sans",
    content: "prose dark:prose-invert max-w-none",
    border: "border-l-4 border-purple-500 pl-6 my-4",
    heading: "text-2xl font-bold mb-6 text-purple-600 dark:text-purple-400",
  },
  minimal: {
    card: "bg-white dark:bg-black rounded-none p-8 w-[600px] max-w-[600px] font-mono",
    content: "prose dark:prose-invert max-w-none",
    border: "border-l-0 border-t border-b border-gray-200 dark:border-gray-800 py-4 my-4",
    heading: "text-xl font-normal mb-4 text-gray-900 dark:text-gray-100",
  },
  elegant: {
    card: "bg-[#f8f5f0] dark:bg-[#1a1814] rounded-lg shadow-md p-10 w-[600px] max-w-[600px] font-serif",
    content: "prose dark:prose-invert max-w-none",
    border: "border-l-0 border-t-2 border-b-2 border-[#d4bea5] dark:border-[#a08c77] py-4 my-4",
    heading: "text-2xl font-bold mb-6 text-[#8a5a44] dark:text-[#d4bea5]",
  },
  vibrant: {
    card: "bg-gradient-to-r from-pink-500 to-orange-500 dark:from-purple-600 dark:to-blue-600 rounded-lg shadow-lg p-8 w-[600px] max-w-[600px] font-sans text-white",
    content: "prose prose-invert max-w-none",
    border: "border-l-4 border-white pl-6 my-4",
    heading: "text-2xl font-extrabold mb-6 text-white",
  },
  social: {
    card: "bg-white dark:bg-black rounded-xl shadow-lg p-7 w-[400px] max-w-[400px] font-sans",
    content: "prose dark:prose-invert max-w-none text-sm",
    border: "border-l-0 border-t border-gray-100 dark:border-gray-800 pt-4 mt-4",
    heading: "text-lg font-bold mb-3",
  },
  blog: {
    card: "bg-white dark:bg-zinc-900 rounded-none border border-gray-200 dark:border-gray-800 p-10 w-[700px] max-w-[700px] font-serif",
    content: "prose dark:prose-invert max-w-none",
    border: "border-l-0 border-t border-gray-200 dark:border-gray-800 pt-4 mt-4",
    heading: "text-3xl font-bold mb-6",
  },
  code: {
    card: "bg-[#1e1e1e] text-[#d4d4d4] rounded-lg p-8 w-[600px] max-w-[600px] font-mono",
    content: "prose prose-invert max-w-none",
    border: "border-l-4 border-[#569cd6] pl-6 my-4",
    heading: "text-xl font-bold mb-4 text-[#569cd6]",
  },
  // New themes
  nature: {
    card: "bg-[#f0f9e8] dark:bg-[#1f2a1d] rounded-lg shadow-md p-8 w-[600px] max-w-[600px] font-sans",
    content: "prose dark:prose-invert max-w-none",
    border: "border-l-4 border-[#6a994e] pl-6 my-4",
    heading: "text-xl font-bold mb-4 text-[#386641] dark:text-[#a7c957]",
  },
  ocean: {
    card: "bg-gradient-to-b from-[#e0f7fa] to-[#bbdefb] dark:from-[#0d47a1] dark:to-[#01579b] rounded-lg shadow-md p-8 w-[600px] max-w-[600px] font-sans",
    content: "prose dark:prose-invert max-w-none",
    border: "border-l-4 border-[#0288d1] pl-6 my-4",
    heading: "text-xl font-bold mb-4 text-[#01579b] dark:text-[#4fc3f7]",
  },
  sunset: {
    card: "bg-gradient-to-r from-[#ffecd2] to-[#fcb69f] dark:from-[#4a0404] dark:to-[#9d4e4e] rounded-lg shadow-md p-8 w-[600px] max-w-[600px] font-sans",
    content: "prose dark:prose-invert max-w-none",
    border: "border-l-4 border-[#ff8a65] pl-6 my-4",
    heading: "text-xl font-bold mb-4 text-[#e64a19] dark:text-[#ffab91]",
  },
  retro: {
    card: "bg-[#fdf6e3] dark:bg-[#002b36] rounded-none border-2 border-[#073642] dark:border-[#839496] p-8 w-[600px] max-w-[600px] font-mono",
    content: "prose dark:prose-invert max-w-none",
    border: "border-l-0 border-t-2 border-b-2 border-[#073642] dark:border-[#839496] py-4 my-4",
    heading: "text-xl font-bold mb-4 text-[#073642] dark:text-[#93a1a1]",
  },
  newspaper: {
    card: "bg-[#f5f5f0] dark:bg-[#1a1a1a] p-8 w-[700px] max-w-[700px] font-serif border border-gray-300 dark:border-gray-700",
    content: "prose dark:prose-invert max-w-none",
    border: "border-l-0 border-t-2 border-b-0 border-gray-400 dark:border-gray-600 pt-4 mt-4",
    heading: "text-3xl font-black mb-4 uppercase tracking-tight text-black dark:text-white",
  },
  magazine: {
    card: "bg-white dark:bg-black rounded-none p-8 w-[600px] max-w-[600px] font-sans",
    content: "prose dark:prose-invert max-w-none",
    border: "border-l-0 border-t-8 border-b-0 border-red-500 dark:border-red-700 pt-4 mt-4",
    heading: "text-4xl font-extrabold mb-6 text-black dark:text-white",
  },
};

interface CardPreviewProps {
  markdown: string;
  theme: string;
  bgColor?: string;
  textColor?: string;
}

const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(
  ({ markdown, theme, bgColor, textColor }, ref) => {
    // Default to "default" theme if the selected theme doesn't exist
    const selectedTheme = themeStyles[theme as keyof typeof themeStyles] || themeStyles.default;

    // Apply custom colors if provided
    const customStyles = {
      backgroundColor: bgColor || '',
      color: textColor || '',
      maxWidth: '100%', // 确保卡片最大宽度不超出容器
      margin: '0 auto' // 居中显示
    };

    // Custom components for markdown rendering
    const components = {
      blockquote: ({ children }: { children: React.ReactNode }) => (
        <blockquote className={selectedTheme.border}>{children}</blockquote>
      ),
      h1: ({ children }: { children: React.ReactNode }) => (
        <h1 className={selectedTheme.heading}>{children}</h1>
      ),
      // You can add more custom components here for different markdown elements
      img: (props: any) => (
        <img
          {...props}
          className="max-w-full h-auto"
          style={{ display: 'block', margin: '1rem auto' }}
        />
      ),
    };

    return (
      <div
        ref={ref}
        className={selectedTheme.card}
        style={customStyles}
      >
        <div className={`${selectedTheme.content} px-2`}>
          <ReactMarkdown
            components={components}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    );
  }
);

CardPreview.displayName = "CardPreview";

export default CardPreview;
