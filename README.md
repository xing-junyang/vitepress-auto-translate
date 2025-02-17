# vitepress-auto-translate

[![npm version](https://img.shields.io/npm/v/vitepress-auto-translate.svg?logo=npm)](https://www.npmjs.com/package/vitepress-auto-translate)
[![npm downloads](https://img.shields.io/npm/dm/vitepress-auto-translate.svg)](https://www.npmjs.com/package/vitepress-auto-translate)
[![License: MIT](https://img.shields.io/npm/l/vitepress-auto-translate.svg)](https://github.com/xing-junyang/vitepress-auto-translate/blob/master/LICENSE)

Internationalize `Vitepress` repository automatically by using LLMs. This tool is designed to help you translate your markdown files in a `Vitepress` repository to multiple languages **automatically**, leveraging the power of LLMs to generate high-quality translations.

## Quick Start

This section will take you a quick glance at how to use this tool to translate your `Vitepress` repository.

### Installation

Change to your `Vitepress` repository and install the tool using `npm`:

```bash
npm install vitepress-auto-translate
```

> [!NOTE]
> This tool requires `Node.js` version 16 or above.


### Prepare Your API Key

This tool now supports two LLM providers: [`SiliconFlow`](https://siliconflow.cn/zh-cn/) and [`OpenAI`](https://platform.openai.com/docs/guides/language-models). You need to get an API key from one of them to use this tool.

After you get the API key, you can set it in the environment file `.env` in the root directory of your vitepress repository:

```dotenv
# .env
API_KEY=your_api_key
```

### Translate Your Repository

Run the following command to translate your repository:

```bash
npx vitepress-auto-translate -s docs -l zh
```

This command will translate all the markdown files in the `docs` directory to Chinese. You can replace `docs` with your own directory and `zh` with your target language. The LLM provider is `SiliconFlow` by default. If you want to use `OpenAI`, you can specify it with the `-m` option:

```bash
npx vitepress-auto-translate -s docs -l zh -m openai
```

Multiple languages can be done at once:

```bash
npx vitepress-auto-translate -s docs -l zh en fr
```

> [!TIP]
> You can use the `-h` option to get more help information about the command.

## Features

- **High-Quality Translation**: This tool uses LLMs to generate high-quality translations.
- **Multiple Languages**: You can translate your repository to multiple languages at once.
- **Markdown Parsing**: This tool can parse markdown files, extract text, and translate them, which can preserve the code blocks, math blocks, etc.

## Full List of Options

Here is a full list of options you can use with this tool:

```bash
Usage: vitepress-auto-translate [options]
```

| Option                           | Description                                       | Default                      | Choices                                                                                       |
|----------------------------------|---------------------------------------------------|------------------------------|-----------------------------------------------------------------------------------------------|
| `-s, --source <source>`          | The source directory of the markdown files.       | `docs`                       | `<pathname>`                                                                                  |
| `-l, --languages <languages...>` | The target languages to translate to.             | `['es', 'fr']`               | `['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'ru', 'ja', 'ko', 'zh', 'tzh', 'ar', 'tr']` |
| `-p, --provider <provider>`      | The LLM provider to use.                          | `siliconflow`                | `['siliconflow', 'openai']`                                                                   |
| `-m, --model <model>`            | The LLM model to use.                             | `deepseek-ai/DeepSeek-V3`    | `<model>`                                                                                     |
| `-e --exclude <exclude...>`      | The filename pattern to exclude.                  | `[]`                         | `<regex>`                                                                                     |
| `-r --retries <retries>`         | The number of retries when the translation fails. | `3`                          | `<number>`                                                                                    |
| `-b, --baseURL <baseURL>`        | The base URL of LLM API.                          | `https://api.siliconflow.cn` | `<url>`                                                                                       |
| `-h, --help`                     | Display help for command.                         |                              |                                                                                               |

> [!TIP]
> The choices of `--languages` option correspond to the language listed below:
> | Code | Language           |
> |------|--------------------|
> | en   | English            |
> | es   | Spanish            |
> | fr   | French             |
> | de   | German             |
> | it   | Italian            |
> | pt   | Portuguese         |
> | nl   | Dutch              |
> | pl   | Polish             |
> | ru   | Russian            |
> | ja   | Japanese           |
> | ko   | Korean             |
> | zh   | Simplified Chinese |
> | tzh  | Traditional Chinese|
> | ar   | Arabic             |
> | tr   | Turkish            |


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
