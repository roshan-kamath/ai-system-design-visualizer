# ArchGen AI

Ever tried to explain a system design and ended up drawing boxes on a whiteboard for 20 minutes? Yeah. This fixes that.

**ArchGen AI** takes a plain English description — like "Design Twitter" — and instantly generates a proper architecture diagram alongside a full technical breakdown of every component.

🔗 **Live demo:** https://system-design-visualizer-zeta.vercel.app

---

## What it does

Type something like *"Design a URL shortener"* or *"Design Netflix"* and you get:

- A clean architecture diagram showing all the key components and how they connect
- A written breakdown explaining each component, the data flow, and the design decisions behind it

It's useful if you're studying for system design interviews, trying to quickly prototype an architecture idea, or just want to understand how large-scale systems are structured.

---

## Built with

- **React + Vite** — frontend
- **Gemini 2.5 Flash** — the AI brain
- **Mermaid.js** — turns the AI's output into actual diagrams
- **Vercel** — hosting and deployment

---

## Running it locally

You'll need a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

```bash
git clone https://github.com/roshan-kamath/ai-system-design-visualizer.git
cd ai-system-design-visualizer
npm install --legacy-peer-deps
```

Create a `.env.local` file in the root:

```
VITE_GEMINI_API_KEY=your_key_here
```

Then start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` and you're good to go.

---

## Try these prompts

- Design Twitter
- Design Netflix
- Design a URL Shortener
- Design WhatsApp
- Design Uber
- Design an E-commerce Platform

---

## How it works

1. You type a system description
2. The prompt gets sent to Gemini 2.5 Flash with a strict instruction to return structured JSON
3. The JSON contains a Mermaid diagram definition and a markdown explanation
4. Mermaid.js renders the diagram in the browser
5. The explanation gets parsed and displayed alongside it

The tricky part was getting the AI to consistently return valid Mermaid syntax. Gemini occasionally goes off-script, so there's a regex-based JSON extractor that catches edge cases before they blow up the parser.

---

## License

MIT — do whatever you want with it.