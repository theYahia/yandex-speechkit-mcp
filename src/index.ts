#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { recognizeSchema, handleRecognize } from "./tools/recognize.js";
import { synthesizeSchema, handleSynthesize } from "./tools/synthesize.js";

const server = new McpServer({
  name: "yandex-speechkit-mcp",
  version: "1.0.0",
});

server.tool(
  "recognize",
  "Распознавание речи через Yandex SpeechKit. Принимает аудио в Base64, возвращает текст.",
  recognizeSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleRecognize(params) }] }),
);

server.tool(
  "synthesize",
  "Синтез речи через Yandex SpeechKit. Принимает текст, возвращает аудио в Base64.",
  synthesizeSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleSynthesize(params) }] }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[yandex-speechkit-mcp] Сервер запущен. 2 инструмента. Требуется YANDEX_API_KEY и YANDEX_FOLDER_ID.");
}

main().catch((error) => {
  console.error("[yandex-speechkit-mcp] Ошибка:", error);
  process.exit(1);
});
