# Настройка MCP-серверов в Claude Code

## Файл конфигурации

Глобальные MCP-серверы прописываются в файле:

```
C:\Users\<username>\.claude.json
```

Это главный конфиг Claude Code CLI. Помимо служебных полей, он содержит ключ `mcpServers`, в котором перечислены все подключённые MCP-серверы.

## Структура

Внутри `.claude.json` найди (или создай) ключ `mcpServers` на верхнем уровне:

```jsonc
{
  // ...другие поля (numStartups, installMethod и т.д.)...

  "mcpServers": {
    "имя-сервера": {
      // конфигурация сервера
    }
  }
}
```

## Форматы подключения

### stdio (через npx)

Самый распространённый вариант — сервер запускается как дочерний процесс:

```json
"имя-сервера": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "package-name@latest"]
}
```

С переменными окружения:

```json
"имя-сервера": {
  "type": "stdio",
  "command": "cmd",
  "args": ["/c", "npx", "package-name"],
  "env": {
    "API_KEY": "your-key-here"
  }
}
```

> На Windows используй `"command": "cmd"` и `"args": ["/c", "npx", ...]`.
> На macOS/Linux — `"command": "npx"` и `"args": ["-y", "package-name@latest"]`.

### stdio (через uv tool)

Если MCP-сервер установлен через `uv tool install`, он доступен как локальный бинарник. На Windows указывай **полный путь** к исполняемому файлу:

```json
"имя-сервера": {
  "command": "C:\\Users\\<username>\\.local\\bin\\имя-сервера.exe"
}
```

Узнать путь: `where имя-сервера` (cmd) или `which имя-сервера` (bash).

### stdio (через claude mcp add)

Claude Code CLI позволяет добавить сервер из командной строки:

```bash
claude mcp add имя-сервера -- command arg1 arg2
```

Проверить подключённые серверы: `claude mcp list`.

### HTTP (удалённый или локальный сервер)

Если MCP-сервер уже запущен и слушает HTTP:

```json
"имя-сервера": {
  "type": "http",
  "url": "http://127.0.0.1:3846/mcp"
}
```

## Пример полной конфигурации

```jsonc
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "ctx7sk-..."
      }
    },
    "shadcn": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "shadcn@latest", "mcp"]
    },
    "chrome-devtools": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "chrome-devtools-mcp@latest"]
    },
    "next-devtools": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "next-devtools-mcp@latest"]
    },
    "convex": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "convex@latest", "mcp", "start"]
    },
    "notebooklm-mcp": {
      "command": "notebooklm-mcp"
    },
    "vibe-annotations": {
      "type": "http",
      "url": "http://127.0.0.1:3846/mcp"
    }
  }
}
```

## NotebookLM MCP

MCP-сервер для программного доступа к Google NotebookLM — управление блокнотами, источниками, запросы, генерация аудио/видео/слайдов.

### Установка

```bash
uv tool install notebooklm-mcp-cli
```

Это даёт две команды:
- `nlm` — CLI для NotebookLM
- `notebooklm-mcp` — MCP-сервер для Claude Code и других AI-ассистентов

### Аутентификация

Перед использованием нужно авторизоваться (извлечение cookies Google-аккаунта через браузер):

```bash
nlm login
nlm login --check   # проверить статус
```

Несколько профилей (разные Google-аккаунты):

```bash
nlm login --profile work
nlm login --profile personal
nlm login profile list
nlm login switch <profile>
```

### Подключение к Claude Code

Автоматически:

```bash
nlm setup add claude-code
```

Или вручную — добавить в `.claude.json` → `mcpServers`:

```json
"notebooklm-mcp": {
  "command": "notebooklm-mcp"
}
```

### Диагностика

```bash
nlm doctor
```

### Основные CLI-команды

```bash
nlm notebook list                       # список блокнотов
nlm notebook create "Research Project"  # создать блокнот
nlm source add <notebook> --url "URL"   # добавить источник
nlm notebook query <notebook> "вопрос"  # запрос к блокноту
nlm studio create <notebook>            # генерация контента
nlm download audio <notebook> <id>      # скачать аудио
```

## Как добавить новый сервер

1. Открой `C:\Users\<username>\.claude.json` в любом редакторе.
2. Найди ключ `"mcpServers"`.
3. Добавь новый объект внутрь, через запятую после последнего сервера.
4. Сохрани файл.
5. Перезапусти Claude Code (`/exit` → запустить заново), чтобы изменения подхватились.

Альтернативно — через CLI: `claude mcp add имя-сервера -- command args...`

## Как удалить сервер

Удали соответствующий ключ из `mcpServers` и перезапусти Claude Code.

Или через CLI: `claude mcp remove имя-сервера`

## Проверка

После перезапуска Claude Code подключённые серверы отображаются в статусной строке. Их инструменты становятся доступны через `ToolSearch` с префиксом `mcp__имя-сервера__`.

Проверить все серверы: `claude mcp list`
