@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  --color-primary: #1E3A8A; /* Dark Blue */
  --color-primary-dark: #1E40AF;
  --color-surface: #ffffff;
  --color-background: #F3F4F6;
  --color-text-main: #111827;
  --color-text-muted: #6B7280;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-background);
  color: var(--color-text-main);
  margin: 0;
  padding: 0;
}
