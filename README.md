# vitepress-auto-translate

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
