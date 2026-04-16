import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

export const AudioInputStep = ({ onNext }: { onNext: (audioData: Float32Array) => void }) => {
  const [source, setSource] = useState<"file" | "mic">("file");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleProcessBlob = async (blob: Blob) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const arrayBuffer = await blob.arrayBuffer();
      // Whisper needs 16kHz
      const audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000,
      });
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const float32Array = audioBuffer.getChannelData(0); // Mono channel
      onNext(float32Array);
    } catch (error) {
      console.error("Error processing audio", error);
      setErrorMsg("Failed to process audio. Please ensure the file is a valid audio format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleProcessBlob(file);
    }
  };

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        handleProcessBlob(blob);
        // Stop all tracks to turn off the microphone
        mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone permission denied or error", error);
      setErrorMsg("Microphone permission denied or an error occurred.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRecording]);

  return (
    <div className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Select Audio Source</FieldLabel>
          <RadioGroup
            value={source}
            onValueChange={(val) => setSource(val as "file" | "mic")}
            className="mt-2 flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="file" id="source-file" />
              <Label htmlFor="source-file" className="font-normal">
                File Upload
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mic" id="source-mic" />
              <Label htmlFor="source-mic" className="font-normal">
                Microphone
              </Label>
            </div>
          </RadioGroup>
        </Field>
      </FieldGroup>

      {source === "file" && (
        <div className="space-y-2">
          <Label htmlFor="audio-file">Upload Audio</Label>
          <Input
            id="audio-file"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={isProcessing}
            className="cursor-pointer"
          />
        </div>
      )}

      {source === "mic" && (
        <div className="flex flex-col items-start gap-4">
          <Label>Record Audio</Label>
          {!isRecording ? (
            <Button onClick={startRecording} disabled={isProcessing}>
              Start Recording
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium">Recording...</span>
              <Button onClick={stopRecording} variant="destructive">
                Stop Recording
              </Button>
            </div>
          )}
        </div>
      )}

      {isProcessing && <p className="text-muted-foreground text-sm">Processing audio...</p>}

      {errorMsg && <p className="text-destructive text-sm">{errorMsg}</p>}
    </div>
  );
};
