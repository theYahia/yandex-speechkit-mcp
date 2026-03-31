import { z } from "zod";
import { synthesizeSpeech } from "../client.js";

export const synthesizeSchema = z.object({
  text: z.string().describe("Текст для синтеза речи (макс. 5000 символов)"),
  lang: z.string().default("ru-RU").describe("Язык синтеза (ru-RU, en-US, tr-TR)"),
  voice: z.string().default("filipp").describe("Голос (filipp, alena, ermil, jane, madirus, omazh, zahar)"),
  format: z.string().default("oggopus").describe("Формат аудио (oggopus, lpcm, mp3)"),
});

export async function handleSynthesize(params: z.infer<typeof synthesizeSchema>): Promise<string> {
  const audioBase64 = await synthesizeSpeech(params.text, params.lang, params.voice, params.format);
  return JSON.stringify({
    audio_base64: audioBase64,
    format: params.format,
    voice: params.voice,
    lang: params.lang,
  }, null, 2);
}
