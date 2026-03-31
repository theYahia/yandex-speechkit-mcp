# @theyahia/yandex-speechkit-mcp

MCP-сервер для Yandex SpeechKit API — распознавание и синтез речи. **2 инструмента.**

[![npm](https://img.shields.io/npm/v/@theyahia/yandex-speechkit-mcp)](https://www.npmjs.com/package/@theyahia/yandex-speechkit-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Часть серии [Russian API MCP](https://github.com/theYahia/russian-mcp) (50 серверов) by [@theYahia](https://github.com/theYahia).

## Установка

### Claude Desktop

```json
{
  "mcpServers": {
    "yandex-speechkit": {
      "command": "npx",
      "args": ["-y", "@theyahia/yandex-speechkit-mcp"],
      "env": { "YANDEX_API_KEY": "your-api-key", "YANDEX_FOLDER_ID": "your-folder-id" }
    }
  }
}
```

### Claude Code

```bash
claude mcp add yandex-speechkit -e YANDEX_API_KEY=your-api-key -e YANDEX_FOLDER_ID=your-folder-id -- npx -y @theyahia/yandex-speechkit-mcp
```

### VS Code / Cursor

```json
{ "servers": { "yandex-speechkit": { "command": "npx", "args": ["-y", "@theyahia/yandex-speechkit-mcp"], "env": { "YANDEX_API_KEY": "your-api-key", "YANDEX_FOLDER_ID": "your-folder-id" } } } }
```

> Требуется `YANDEX_API_KEY` и `YANDEX_FOLDER_ID`. Получите в [консоли Yandex Cloud](https://console.cloud.yandex.ru/).

## Инструменты (2)

| Инструмент | Описание |
|------------|----------|
| `recognize` | Распознавание речи из аудио (Base64) в текст |
| `synthesize` | Синтез речи из текста, возвращает аудио в Base64 |

## Примеры

```
Распознай речь из аудиофайла
Синтезируй голосом filipp текст "Привет, как дела?"
```

## Лицензия

MIT
