const STT_BASE = "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize";
const TTS_BASE = "https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize";
const TIMEOUT = 60_000;
const MAX_RETRIES = 3;

function getApiKey(): string {
  const apiKey = process.env.YANDEX_API_KEY;
  if (!apiKey) throw new Error("YANDEX_API_KEY не задан");
  return apiKey;
}

function getFolderId(): string {
  const folderId = process.env.YANDEX_FOLDER_ID;
  if (!folderId) throw new Error("YANDEX_FOLDER_ID не задан");
  return folderId;
}

export async function recognizeSpeech(audioBase64: string, lang: string, format: string): Promise<unknown> {
  const folderId = getFolderId();
  const audioBuffer = Buffer.from(audioBase64, "base64");

  const params = new URLSearchParams({
    lang,
    folderId,
    format,
  });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(`${STT_BASE}?${params.toString()}`, {
        method: "POST",
        headers: {
          "Authorization": `Api-Key ${getApiKey()}`,
          "Content-Type": "application/octet-stream",
        },
        body: audioBuffer,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) return response.json();

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        console.error(`[yandex-speechkit-mcp] ${response.status}, повтор через ${delay}мс (${attempt}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      const text = await response.text().catch(() => "");
      throw new Error(`SpeechKit STT HTTP ${response.status}: ${text || response.statusText}`);
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES) {
        console.error(`[yandex-speechkit-mcp] Таймаут, повтор (${attempt}/${MAX_RETRIES})`);
        continue;
      }
      throw error;
    }
  }
  throw new Error("SpeechKit STT: все попытки исчерпаны");
}

export async function synthesizeSpeech(text: string, lang: string, voice: string, format: string): Promise<string> {
  const folderId = getFolderId();

  const formBody = new URLSearchParams({
    text,
    lang,
    voice,
    format,
    folderId,
  });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(TTS_BASE, {
        method: "POST",
        headers: {
          "Authorization": `Api-Key ${getApiKey()}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer).toString("base64");
      }

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        console.error(`[yandex-speechkit-mcp] ${response.status}, повтор через ${delay}мс (${attempt}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      const errText = await response.text().catch(() => "");
      throw new Error(`SpeechKit TTS HTTP ${response.status}: ${errText || response.statusText}`);
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES) {
        console.error(`[yandex-speechkit-mcp] Таймаут, повтор (${attempt}/${MAX_RETRIES})`);
        continue;
      }
      throw error;
    }
  }
  throw new Error("SpeechKit TTS: все попытки исчерпаны");
}
