## AI Website Generator – Project Overview

This project is my ongoing build of an AI-powered website creator. The goal is simple: let anyone describe the site they need, gather all the structured details through a friendly form, and hand that context to DeepSeek so it can return a complete, production-ready HTML/CSS/JS experience—no manual coding required.

### What it currently supports
- **Website types**: Portfolio, Business, Blog, News, and Article (long-form editorial). Each type has its own detailed form and tailored prompt.
- **Rich data capture**: From projects and services to reporter bios, highlights, and CTA blocks, the forms help users provide everything the AI needs.
- **Generation flow**: After submission, the backend merges the user input with a base prompt, calls DeepSeek, validates the generated code, and sends it back for instant preview and download.

### How it’s built
- **Frontend**: React + Vite + Context API, custom CSS for the UI, and a focus on smooth loading states and validation.
- **Backend**: Node.js + Express with Axios handling DeepSeek requests, prompt management, and response hygiene (ensuring the HTML is complete and safe).
- **AI integration**: DeepSeek prompts live in `server/prompts/*.prompt.js`, and each prompt is tuned to demand full, responsive websites with modern styling.

### Philosophy
The repository isn’t about cloning and running scripts; it’s a reference implementation showing how I structure prompts, forms, and validation to get reliable results from an AI model. Feel free to explore the codebase, study the prompt patterns, or adapt the ideas for your own AI-driven tools. The focus is craftsmanship—tight prompts, thoughtful UX, and clear separation between user input, orchestration, and AI output.
