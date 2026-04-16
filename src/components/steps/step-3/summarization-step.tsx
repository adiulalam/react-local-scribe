import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DownloadProgress, type ProgressInfo } from "@/components/ui/download-progress";

interface SummarizationStepProps {
  transcription: string;
  onNext: (summary: string) => void;
}

export const SummarizationStep = ({ transcription, onNext }: SummarizationStepProps) => {
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<
    "initializing" | "loading" | "processing" | "complete" | "error"
  >("initializing");
  const [errorMsg, setErrorMsg] = useState("");
  const [progressItems, setProgressItems] = useState<Record<string, ProgressInfo>>({});

  const worker = useRef<Worker | null>(null);
  const summarizationStarted = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [summary]);

  useEffect(() => {
    if (!transcription || transcription.trim() === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      setErrorMsg("No transcription provided. Please ensure Step 2 completed successfully.");
      return;
    }

    if (!worker.current) {
      worker.current = new Worker(new URL("../../../workers/summary.worker.ts", import.meta.url), {
        type: "module",
      });

      worker.current.addEventListener("message", (e) => {
        const msg = e.data;

        switch (msg.type) {
          case "progress":
            setStatus("loading");
            setProgressItems((prev) => ({ ...prev, [msg.data.file]: msg.data }));
            break;
          case "ready":
            setProgressItems({}); // Clear download progress
            if (!summarizationStarted.current) {
              summarizationStarted.current = true;
              worker.current?.postMessage({ type: "process", text: transcription });
            }
            break;
          case "processing":
            setStatus("processing");
            break;
          case "update":
            setSummary((prev) => prev + msg.output);
            break;
          case "complete":
            setStatus("complete");
            setSummary(msg.result);
            break;
          case "error":
            setStatus("error");
            setErrorMsg(msg.error);
            break;
        }
      });

      worker.current.postMessage({ type: "load" });
    }

    return () => {
      worker.current?.terminate();
      worker.current = null;
    };
  }, [transcription]);

  return (
    <div className="space-y-4">
      <DownloadProgress progressItems={progressItems} />

      {status === "initializing" && (
        <p className="text-muted-foreground text-sm">Initializing Summarization Worker...</p>
      )}

      {status === "loading" && (
        <p className="text-muted-foreground text-sm">
          Downloading or loading DistilBART summary model chunks...
        </p>
      )}

      {status === "processing" && (
        <div className="flex items-center gap-3">
          <p className="text-muted-foreground text-sm">
            Summarizing text locally...
          </p>
        </div>
      )}

      {status === "error" && <p className="text-destructive text-sm">{errorMsg}</p>}

      {(status === "processing" || status === "complete") && (
        <div className="space-y-4">
          <Textarea
            ref={textareaRef}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={8}
            className="max-h-52 w-full resize-y text-base"
            placeholder={
              status === "processing"
                ? "Summarizing... Text will appear here."
                : "Review and edit the generated summary..."
            }
          />
          <div className="flex justify-end">
            <Button onClick={() => onNext(summary)} disabled={status !== "complete"}>
              Continue to Export
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
