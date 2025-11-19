from pathlib import Path
path = Path('server/services/promptService.js')
text = path.read_text(encoding='utf-8')
if "const articlePrompt" not in text:
    text = text.replace("const newsPrompt = require('../prompts/news.prompt');", "const newsPrompt = require('../prompts/news.prompt');\nconst articlePrompt = require('../prompts/article.prompt');")
news_block = "            news: {\n                name: 'News',\n                description: 'News portal or magazine website',\n                icon: 'dY\"?'\n            }\n"
if "article:" not in text:
    replacement = "            news: {\n                name: 'News',\n                description: 'News portal or magazine website',\n                icon: 'dY\"?'\n            },\n            article: {\n                name: 'Article',\n                description: 'Long-form editorial or magazine feature',\n                icon: 'dY\"?'\n            }\n"
    if news_block in text:
        text = text.replace(news_block, replacement, 1)
    else:
        raise SystemExit('news block not found')
prompt_block = "            blog: blogPrompt,\n            event: eventPrompt,\n            news: newsPrompt\n"
if "article: articlePrompt" not in text:
    if prompt_block in text:
        text = text.replace(prompt_block, prompt_block[:-1] + ",\n            article: articlePrompt\n", 1)
    else:
        raise SystemExit('prompt map block not found')
path.write_text(text, encoding='utf-8')
