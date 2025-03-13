"use client";

import { useState, useEffect } from "react";
import { toPng, toJpeg, toSvg } from "html-to-image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  DownloadIcon,
  ImageIcon,
  Share2Icon,
  CopyIcon,
  FileIcon,
  PictureInPictureIcon,
  ClipboardCopyIcon,
  PlusCircleIcon,
  ScanIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";

interface ExportOptionsProps {
  cardRef: React.RefObject<HTMLDivElement>;
}

// File format options
type FormatOption = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  exportFn: (node: HTMLElement, options: any) => Promise<string>;
  mimeType: string;
  extension: string;
};

export default function ExportOptions({ cardRef }: ExportOptionsProps) {
  const [quality, setQuality] = useState<number>(95);
  const [scale, setScale] = useState<number>(2);
  const [includeBackground, setIncludeBackground] = useState<boolean>(true);
  const [fileName, setFileName] = useState<string>(`markdown-card-${new Date().toISOString().split('T')[0]}`);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<string>("png");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [canCopyToClipboard, setCanCopyToClipboard] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("format");

  // Check if clipboard API is available
  useEffect(() => {
    setCanCopyToClipboard(
      navigator.clipboard !== undefined &&
      typeof navigator.clipboard.write === 'function'
    );
  }, []);

  // Clear preview on dialog close
  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl("");
      setExportError("");
    }
  }, [isOpen]);

  // Format options
  const formatOptions: FormatOption[] = [
    {
      id: "png",
      name: "PNG",
      description: "Best for most uses, supports transparency",
      icon: <ImageIcon className="h-4 w-4" />,
      exportFn: toPng,
      mimeType: "image/png",
      extension: "png"
    },
    {
      id: "jpeg",
      name: "JPEG",
      description: "Smaller file size, no transparency",
      icon: <ImageIcon className="h-4 w-4" />,
      exportFn: toJpeg,
      mimeType: "image/jpeg",
      extension: "jpg"
    },
    {
      id: "svg",
      name: "SVG",
      description: "Vector format, best for scalability",
      icon: <FileIcon className="h-4 w-4" />,
      exportFn: toSvg,
      mimeType: "image/svg+xml",
      extension: "svg"
    }
  ];

  // Get selected format option
  const getSelectedFormat = () => {
    return formatOptions.find(format => format.id === selectedFormat) || formatOptions[0];
  };

  // Export options
  const getExportOptions = () => {
    const baseOptions = {
      quality: quality / 100,
      pixelRatio: scale,
      skipAutoScale: false,
      cacheBust: true,
      style: {
        background: includeBackground ? undefined : "transparent",
      },
    };

    // JPEG doesn't support transparency, so enforce background for JPEG
    if (selectedFormat === "jpeg") {
      return {
        ...baseOptions,
        style: { background: "#ffffff" },
      };
    }

    return baseOptions;
  };

  // Generate preview
  const generatePreview = async () => {
    if (!cardRef.current) return;

    setIsProcessing(true);
    setExportError("");

    try {
      const format = getSelectedFormat();
      const options = getExportOptions();
      const dataUrl = await format.exportFn(cardRef.current, options);
      setPreviewUrl(dataUrl);
    } catch (error) {
      console.error("Error generating preview:", error);
      setExportError("Failed to generate preview. Try a different format or settings.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Export image in selected format
  const exportImage = async () => {
    if (!cardRef.current) return;

    setIsProcessing(true);
    setExportError("");

    try {
      const format = getSelectedFormat();
      const options = getExportOptions();
      const dataUrl = await format.exportFn(cardRef.current, options);

      // Create download link
      const link = document.createElement("a");
      link.download = `${fileName}.${format.extension}`;
      link.href = dataUrl;
      link.click();

      setIsOpen(false);
      toast.success(`Card exported as ${format.name}`);
    } catch (error) {
      console.error("Error exporting image:", error);
      setExportError("Failed to export image. Try a different format or settings.");
      toast.error("Failed to export image");
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!cardRef.current || !canCopyToClipboard) return;

    setIsProcessing(true);
    setExportError("");

    try {
      const format = getSelectedFormat();
      const options = getExportOptions();
      const dataUrl = await format.exportFn(cardRef.current, options);
      const blob = await fetch(dataUrl).then(res => res.blob());

      // Create clipboard data
      const clipboardData = new ClipboardItem({
        [format.mimeType]: blob
      });

      // Copy to clipboard
      await navigator.clipboard.write([clipboardData]);

      setIsOpen(false);
      toast.success("Image copied to clipboard");
    } catch (error) {
      console.error("Error copying image:", error);
      setExportError("Failed to copy to clipboard. Try a different format.");
      toast.error("Failed to copy image");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Export Card</DialogTitle>
          <DialogDescription>
            Customize your export settings before downloading.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="border-b">
            <div className="flex -mb-px">
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'format' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('format')}
              >
                Format
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'settings' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'preview' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => {
                  setActiveTab('preview');
                  generatePreview();
                }}
              >
                Preview
              </button>
            </div>
          </div>

          <div className="py-4">
            {activeTab === 'format' && (
              <div className="grid gap-4">
                {formatOptions.map((format) => (
                  <div
                    key={format.id}
                    className={`flex items-center space-x-3 border rounded-md p-3 cursor-pointer transition-colors ${
                      selectedFormat === format.id ? 'border-primary bg-accent/50' : 'hover:bg-accent'
                    }`}
                    onClick={() => setSelectedFormat(format.id)}
                  >
                    <div className={`p-2 rounded-full ${selectedFormat === format.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {format.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{format.name}</h3>
                      <p className="text-xs text-muted-foreground">{format.description}</p>
                    </div>
                    {selectedFormat === format.id && <CheckIcon className="h-4 w-4 text-primary" />}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">File Name</label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Enter file name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Quality: {quality}%</label>
                    <span className="text-xs text-muted-foreground">Higher is better</span>
                  </div>
                  <Slider
                    value={[quality]}
                    min={50}
                    max={100}
                    step={5}
                    onValueChange={(value) => setQuality(value[0])}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Scale: {scale}x</label>
                    <span className="text-xs text-muted-foreground">Higher for larger images</span>
                  </div>
                  <Slider
                    value={[scale]}
                    min={1}
                    max={4}
                    step={0.5}
                    onValueChange={(value) => setScale(value[0])}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium block">Include Background</label>
                    <span className="text-xs text-muted-foreground">
                      {selectedFormat === "jpeg" ? "JPEG doesn't support transparency" : "Turn off for transparent background"}
                    </span>
                  </div>
                  <Switch
                    checked={includeBackground || selectedFormat === "jpeg"}
                    onCheckedChange={setIncludeBackground}
                    disabled={selectedFormat === "jpeg"}
                  />
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="min-h-[200px]">
                {isProcessing ? (
                  <div className="h-[200px] flex flex-col items-center justify-center">
                    <ScanIcon className="h-8 w-8 animate-pulse text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Generating preview...</p>
                  </div>
                ) : exportError ? (
                  <div className="h-[200px] flex flex-col items-center justify-center">
                    <XIcon className="h-8 w-8 text-destructive mb-2" />
                    <p className="text-sm text-destructive">{exportError}</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={generatePreview}>
                      Try Again
                    </Button>
                  </div>
                ) : previewUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="relative border rounded-md overflow-hidden mb-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-[250px] object-contain"
                      />
                      <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs">
                        {getSelectedFormat().name} • {scale}x • {quality}%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      This is a preview. The exported image will be full quality.
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] flex flex-col items-center justify-center">
                    <PictureInPictureIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click the button below to generate a preview</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={generatePreview}>
                      Generate Preview
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator />

        <DialogFooter className="mt-4 sm:justify-between flex-wrap gap-2">
          <div className="flex gap-2 flex-wrap">
            <Button variant="default" size="sm" onClick={exportImage} disabled={isProcessing}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button>
            {canCopyToClipboard && (
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={isProcessing}>
                <ClipboardCopyIcon className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {getSelectedFormat().name} • {scale}x • {quality}%
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
