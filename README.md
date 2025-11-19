<div align="center">

# AI Website Generator

Create production-ready websites by filling out a guided form. The app collects structured content, sends it to DeepSeek for generation, and returns complete HTML/CSS/JS with a live preview and download bundle.

</div>

---

## 🚀 Features

- **Multi-type generation** – Portfolio, Business, Blog, News, and long-form Article experiences, each with tailored forms and prompts.
- **Rich data collection** – Dynamic sections (projects, services, articles, highlights, reporters, etc.) with add/remove controls and validation.
- **AI-backed creation** – Structured prompts sent to DeepSeek ensure complete, responsive HTML/CSS/JS output.
- **Preview & download** – Generated sites render in-app for review and can be downloaded instantly.
- **Robust UX** – Loading states, progress indicators, error handling, and contextual guidance guide the user through the process.
- **Secure & resilient** – Express middleware (Helmet, CORS, rate limiting) plus automatic post-processing of AI output guarantees usable code.

---

## 🧱 Project Structure

```
website-generator/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── forms/      # PortfolioForm, BusinessForm, BlogForm, NewsForm, ArticleForm
│   │   ├── contexts/
│   │   └── services/
│   └── package.json
├── server/                 # Express backend + DeepSeek integration
│   ├── prompts/            # Prompt templates per website type
│   ├── services/           # DeepSeek & Prompt service logic
│   ├── controllers/
│   └── package.json
├── shared/                 # (optional) shared resources
├── projectoverview.txt     # Full technical overview/reference
└── README.md
```

---

## 🧩 Architecture Overview

1. **Website type selection** – User chooses a type (portfolio, article, etc.) which loads the corresponding form.
2. **Form completion** – React Context tracks user data, color scheme, and step progress with real-time validation.
3. **Generation request** – The frontend posts `{ websiteType, userData, colorScheme }` to `POST /api/website/generate`.
4. **Prompt assembly** – Backend merges the selected base prompt with user data and sends it to DeepSeek.
5. **AI response validation** – The service ensures the HTML is complete (doctype/body/html tags), fixes mistakes, and packages it.
6. **Preview + download** – React renders the returned HTML in the preview step and shows download links.

---

## 🛠️ Tech Stack

| Layer      | Technologies                                      |
|----------- |---------------------------------------------------|
| Frontend   | React 18, Vite, Context API, custom CSS           |
| Backend    | Node.js, Express, Axios, Helmet, CORS, Rate Limit |
| AI Service | DeepSeek Chat Completions API                     |
| Tooling    | Nodemon, Lucide Icons, React Router DOM           |

---

## ⚙️ Setup & Development

### 1. Clone & install

```bash
git clone <repo-url>
cd website-generator

# Install frontend deps
cd client
npm install

# Install backend deps
cd ../server
npm install
```

### 2. Environment variables

Create `server/.env` with:

```
PORT=5000                 # optional, defaults to 5000
DEEPSEEK_API_KEY=your_api_key_here
```

### 3. Run locally

```bash
# Backend
cd server
npm run dev

# Frontend (in a new terminal)
cd client
npm run dev
```

Frontend defaults to `http://localhost:5173`, backend to `http://localhost:5000`.

---

## 📤 API Endpoints

| Method | Endpoint                     | Description                                   |
| ------ | ---------------------------- | --------------------------------------------- |
| GET    | `/api/health`                | Basic health check                            |
| GET    | `/api/prompts/types`         | List available website types                  |
| GET    | `/api/prompts/base/:type`    | Retrieve the base prompt for a given type     |
| POST   | `/api/website/generate`      | Trigger AI generation (expects JSON payload)  |

**Example payload**

```json
{
  "websiteType": "article",
  "userData": { ...form data... },
  "colorScheme": "modern-blue"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "html": "<!DOCTYPE html> ...",
    "downloadUrl": "/api/website/download/<id>",
    "metadata": {
      "websiteType": "article",
      "generatedAt": "2025-11-19T11:45:00.000Z",
      "colorScheme": "modern-blue",
      "codeLength": 18754
    }
  }
}
```

---

## 🧪 Testing / Validation Tips

- Use the built-in form validation before pressing “Generate”.
- Inspect the browser console for warnings/logs during generation.
- Check the backend logs (nodemon) for DeepSeek response issues.
- Verify the downloaded ZIP contains the expected `index.html` (and assets if applicable).

---

## 📘 Additional Notes

- Updating prompts: edit files in `server/prompts/*.prompt.js`. Ensure `${userData}` and `${colorScheme}` remain escaped (`\${...}`) so they’re injected at runtime.
- Adding new website types: create a prompt + form, register it in `promptService.js`, and update `WebsiteTypeSelector`/`App`.
- Sensitive data: `.env` files, logs, build artifacts, and editor folders are covered in `.gitignore` (frontend & backend).

---

Happy building! If you encounter issues or want to expand the generator, check `projectoverview.txt` for a deep dive into the architecture and data flow. 👇

```txt
projectoverview.txt
```
