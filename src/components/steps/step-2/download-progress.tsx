import { Progress } from "@/components/ui/progress";

export interface ProgressInfo {
  status: string;
  name: string;
  file: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

interface DownloadProgressProps {
  progressItems: Record<string, ProgressInfo>;
}

export const DownloadProgress = ({ progressItems }: DownloadProgressProps) => {
  const files = Object.values(progressItems);
  if (files.length === 0) return null;

  // We keep all files visible. "done" files will naturally show 100%.
  // The progress component is entirely unmounted when status becomes "processing" anyway.
  const activeDownloads = files;

  return (
    <div className="bg-background fixed top-4 right-4 z-50 w-80 space-y-4 rounded-lg border p-4 shadow-lg">
      <h4 className="text-sm font-semibold">Downloading AI Model</h4>
      <div className="max-h-[30vh] space-y-3 overflow-y-auto">
        {activeDownloads.map((data, idx) => (
          <div key={`${data.file}-${idx}`} className="space-y-1">
            <div className="text-muted-foreground flex justify-between text-xs">
              <span className="w-48 truncate" title={data.file}>
                {data.file}
              </span>
              <span>{Math.round(data.progress || 0)}%</span>
            </div>
            <Progress value={data.progress || 0} className="h-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
};
