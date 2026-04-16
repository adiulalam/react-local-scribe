# Local Scribe

The task is to create a local scribe application that can be used to summarize text from audio. This means we insert audio from file or microphone, use local LLM to extract the text, and then use local LLM to summarize the text. The application should be able to import audio and export the summary to a file.

We will use React, TypeScript, ShadCN UI, and Tailwind CSS for the frontend. We will also use `Transformers.js` for local LLM inference. The audio transformer model will be Whisper `distil-whisper/distil-large-v2` and the summarization model will be DistilBERT `Xenova/distilbart-cnn-6-6`.

### UI and Design Patterns

For the UI, we will use the simple Stepper component from `@stepperize/react` and `react-hook-form` for form handling. Examples of the Stepper can be found in `src/components/stepper-with-form.tsx` and `src/components/stepper-with-variants.tsx`.

Critical design and architecture rules:

- **State Management:** See example in `src/components/stepper-with-form.tsx` or if needed use react context.
- **Web Workers:** All `Transformers.js` model downloading and inference MUST be done inside Web Workers. The main thread must never be blocked. Use `postMessage` to send data and receive progress/output from the workers.
- The Stepper should be a vertical stepper (like the `stepper-with-variants.tsx` example).
- Users cannot go back to previous steps; instead, a "Start Over" button should be displayed that resets the form and stepper.
- Don't use unnecessary Tailwind classes. Keep it simple and clean. No need for animations or fancy transitions. Use flex with gap instead of margin.
- For each step, create a folder inside `src/components/steps/` and create an `index.tsx` file inside it.
- Use `export const` instead of `export default`.
- Use `kebab-case` for file names and folder names but use `PascalCase` for component names.
- For functions, use `camelCase` and put them in the `src/libs/` folder.
- **Error Handling:** Implement error boundaries or toast notifications for issues like Out-of-Memory (OOM), unsupported audio formats, or microphone permission denials.

## Step 1: Audio Input & Preprocessing

We need to create a form that will allow the user to select an audio file or record audio from the microphone. The form should have:

- Audio source: A radio button that allows the user to select between "File" and "Microphone".
- Audio file: A file input that allows the user to select an audio file.
- Microphone: Use the browser's `MediaRecorder` API. Provide "Start Recording" and "Stop Recording" buttons. Handle microphone permissions gracefully. When recording stops, combine the chunks into a Blob.

**Audio Preprocessing:** Whisper requires specific audio formats. Whether the user uploads a file or records a WebM blob via microphone, you must use the browser's `AudioContext` API to decode the audio, resample it to a 16kHz sample rate, and convert it into a mono `Float32Array`.
Once the `Float32Array` is generated, save it to the form state.

## Step 2: Text Extraction (Transcription)

As soon as this step loads, we should send the `Float32Array` from the form state to a Web Worker to begin transcription.

- **Downloading:** The worker should check if `distil-whisper/distil-large-v2` is downloaded. If not, start downloading. We should display a floating progress card on the top right corner of the screen showing download progress and estimated time remaining. If already downloaded, show a toast indicating so.
- **Processing:** Once the model is ready, run the pipeline for automatic speech recognition. Display a loading spinner or progress indicator while inference is running. When completed, display a toast notification.
- **Output:** The worker returns the extracted text to the main thread. Save this text to the form state, display it in a text area, and allow the user to edit it. Provide a "Continue to Summarization" button.

## Step 3: Summarization

As soon as the user confirms the text and advances, send the extracted text to a Web Worker for summarization.

- **Downloading:** The worker should check if `Xenova/distilbart-cnn-6-6` is downloaded. Display a floating progress card for the download progress. If already downloaded, show a toast.
- **Processing:** Run the summarization pipeline in the background. Display a progress bar or spinner. When completed, display a toast notification.
- **Output:** The worker returns the summary to the main thread. Save it to the form state and automatically proceed to Step 4.

## Step 4: Export

Display the final summary in a text area, allowing the user to make any final edits. Provide an "Export Summary" button that downloads the text as a file. The file should be a standard text file named `summary-<timestamp>.txt`.
