import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json());

  // Mock Community Feed Data
  let communityFeed = [
    {
      id: "1",
      type: "text",
      content: "BREAKING: Scientists have discovered a new planet made entirely of diamonds.",
      status: "Fake",
      score: 15,
      timestamp: Date.now() - 3600000,
    },
    {
      id: "2",
      type: "image",
      content: "Politician caught sleeping during an important meeting",
      status: "Suspicious",
      score: 45,
      timestamp: Date.now() - 7200000,
    },
    {
      id: "3",
      type: "text",
      content: "Local community garden expects record harvest this year.",
      status: "Verified",
      score: 95,
      timestamp: Date.now() - 14400000,
    }
  ];

  // API Routes
  app.get("/api/feed", (req, res) => {
    res.json(communityFeed);
  });

  app.post("/api/feed", (req, res) => {
    const newItem = {
      id: String(Date.now()),
      type: req.body.type,
      content: req.body.content,
      status: req.body.status,
      score: req.body.score,
      timestamp: Date.now(),
    };
    communityFeed = [newItem, ...communityFeed];
    res.json(newItem);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
