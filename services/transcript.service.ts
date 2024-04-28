import env from "@config/config";
import { AssemblyAI } from "assemblyai";
import path from "path";

const client = new AssemblyAI({
  apiKey: env.assembly_api_key,
});

const transcribe = async (audioUrl: string) => {
  const transcript = await client.transcripts.transcribe({
    audio: audioUrl,
  });

  if (transcript.status === "error") {
    throw new Error(transcript.error);
  }

  return transcript.text;
};

export default transcribe;
