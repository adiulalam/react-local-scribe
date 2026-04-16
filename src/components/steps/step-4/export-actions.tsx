import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";

interface ExportActionsProps {
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
}

export const ExportActions = ({ onCopy, onDownload, copied }: ExportActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={onCopy} className="gap-2">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <Button size="sm" variant="secondary" onClick={onDownload} className="gap-2">
        <Download className="w-4 h-4" />
        Download
      </Button>
    </div>
  );
};
