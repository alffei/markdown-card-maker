"use client";

import { useState, useRef, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import {
  CopyIcon,
  ImageIcon,
  PaletteIcon,
  Share2Icon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import CardPreview from "./card-preview";
import ThemeSelector from "./theme-selector";
import ExportOptions from "./export-options";
import ColorPicker from "./color-picker";
import { useI18n } from "@/i18n/i18n-provider";

// Import MD Editor with client-side only (no SSR)
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function MarkdownCardEditor() {
  const { t, getDefaultMarkdown } = useI18n();
  const [markdown, setMarkdown] = useState<string>("");
  const [theme, setTheme] = useState<string>("default");
  const [scale, setScale] = useState<number>(100);
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);

  // Set default markdown based on the current language
  useEffect(() => {
    setMarkdown(getDefaultMarkdown());
  }, [getDefaultMarkdown]);

  // Handle markdown changes
  const handleMarkdownChange = (value?: string) => {
    if (value !== undefined) {
      setMarkdown(value);
    }
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown)
      .then(() => toast.success(t("editor.copiedSuccess", { defaultValue: "Markdown copied to clipboard!" })))
      .catch(() => toast.error(t("editor.copyFailed", { defaultValue: "Failed to copy to clipboard" })));
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">{t("app.title")}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <CopyIcon className="mr-2 h-4 w-4" />
            {t("editor.copy")}
          </Button>
          <ExportOptions cardRef={cardRef} />
        </div>
      </div>

      <PanelGroup direction="horizontal" className="min-h-[600px] border rounded-lg">
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full p-2">
            <Tabs defaultValue="editor">
              <TabsList className="mb-2">
                <TabsTrigger value="editor">{t("editor.title")}</TabsTrigger>
                <TabsTrigger value="preview">{t("editor.preview")}</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="h-[calc(100%-40px)]">
                <div className="h-full" data-color-mode="auto">
                  <MDEditor
                    value={markdown}
                    onChange={handleMarkdownChange}
                    height="100%"
                    preview="edit"
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="h-[calc(100%-40px)] overflow-auto">
                <div className="prose dark:prose-invert max-w-none p-4">
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm]}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Panel>

        <PanelResizeHandle className="w-[1px] bg-border hover:bg-primary hover:w-[3px] transition-all" />

        <Panel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">{t("card.preview")}</span>
                </div>

                <ThemeSelector value={theme} onValueChange={setTheme} />

                <div className="flex items-center gap-2">
                  <ColorPicker
                    label={t("card.background")}
                    color={backgroundColor}
                    onChange={setBackgroundColor}
                    icon={<PaletteIcon className="h-3.5 w-3.5" />}
                  />

                  <ColorPicker
                    label={t("card.text")}
                    color={textColor}
                    onChange={setTextColor}
                  />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground">{t("app.zoom")}:</span>
                  <Slider
                    className="w-[100px]"
                    defaultValue={[100]}
                    min={50}
                    max={150}
                    step={10}
                    onValueChange={(value) => setScale(value[0])}
                  />
                  <span className="text-sm w-12">{scale}%</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-8 bg-gray-100 dark:bg-gray-900 flex justify-center items-start">
              <div
                style={{ transform: `scale(${scale / 100})`, transformOrigin: 'top center' }}
                className="transition-transform duration-200 p-4"
              >
                <CardPreview
                  ref={cardRef}
                  markdown={markdown}
                  theme={theme}
                  bgColor={backgroundColor}
                  textColor={textColor}
                />
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
