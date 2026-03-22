import { Download, RefreshCcw, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";

export function ResultActionBar({
  onRegenerate,
  onRetry,
  pdfUrl
}: {
  assignmentId: string;
  onRegenerate: () => void;
  onRetry: () => void;
  pdfUrl: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button asChild variant="surface" className="h-10 bg-white text-[#232323]">
        <a href={pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download as PDF
        </a>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRegenerate}
        className="h-10 bg-white/10 px-4 text-white hover:bg-white/14 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" />
        Regenerate
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRetry}
        className="h-10 bg-white/10 px-4 text-white hover:bg-white/14 hover:text-white"
      >
        <RefreshCcw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}
