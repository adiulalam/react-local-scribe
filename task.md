# Local Scribe

The task is to create a local scribe application that can be used to summarize text from audio. This means we insert audio from file or microphone, use local LLM to extract the text, and then use local LLM to summarize the text. The application should be able to import audio and export the summary to a file.

We will use React, TypeScript, ShadCN UI, and Tailwind CSS for the frontend. We will also use Transformers.js for local LLM, the audio transformer model will be Whisper `distil-whisper/distil-large-v2` and the summarization model will be DistilBERT `Xenova/distilbart-cnn-6-6`.

For the UI, we will use simple Stepper component from `@stepperize/react` and `react-hook-form` for form handling. Examples of Sepper can be found on `src\components\stepper-with-form.tsx` and `src\components\stepper-with-variants.tsx`.

Somethings to note with the Stepper and design pattern:

- The Stepper should be a vertical stepper, which the example `src\components\stepper-with-variants.tsx` shows.
- Users can not go back to previous steps, instead a "Start Over" button should be displayed.
- Don't use unnessary Tailwind classes, keep it simple and clean. No need for animations or fancy transitions. Use flex with gap instead of margin.
- For each step, create a folder inside `src\components\steps\` and create a `index.tsx` file inside it.
- Use `react-hook-form` for form handling.
- Use `export const` instead of `export default`.
- Use `kebab-case` for file names and folder names but use `PascalCase` for component names.
- For functions, use `camelCase` and put them in the `libs` folder.

## Step 1: Audio Input

We need to create a form that will allow the user to select an audio file or record audio from the microphone. The form should have the following fields:

- Audio source: A radio button that allows the user to select between "File" and "Microphone".
- Audio file: A file input that allows the user to select an audio file.

As soon as the user selects an audio file or records audio from the microphone, we should start downloading the model `distil-whisper/distil-large-v2` if not already downloaded. We should display a floating progress card on the top right corner of the screen. The card should display the progress of the download and the estimated time remaining. If the model is already downloaded, we should display a toast that the model is already downloaded.

As soon as the model is downloaded, we should start processing the audio file. The audio processing should be done in the background and we should display a progress bar for the processing. The progress bar should display the progress of the processing and the estimated time remaining. If the processing is completed, we should display a toast that the processing is completed.

## Step 2: Text Extraction

As soon as the audio is processed, we should start extracting the text from the audio file. The text extraction should be done in the background and we should display a progress bar for the extraction. The progress bar should display the progress of the extraction and the estimated time remaining. If the extraction is completed, we should display a toast that the extraction is completed.

Once the text is extracted, we should display the text in a text area and allow the user to edit it.

## Step 3: Summarization

As soon as the text is extracted, we should start downloading the model `Xenova/distilbart-cnn-6-6` if not already downloaded. We should display a floating progress card on the top right corner of the screen. The card should display the progress of the download and the estimated time remaining. If the model is already downloaded, we should display a toast that the model is already downloaded.

As soon as the model is downloaded, we should start summarizing the text. The summarization should be done in the background and we should display a progress bar for the summarization. The progress bar should display the progress of the summarization and the estimated time remaining. If the summarization is completed, we should display a toast that the summarization is completed.

## Step 4: Export

As soon as the summarization is completed, we should display the summary in a text area and allow the user to edit it. The summary should be generated using the summarization model `Xenova/distilbart-cnn-6-6`. A button should be displayed to export the summary to a file. The file should be a text file and should be named `summary-<timestamp>.txt`.
