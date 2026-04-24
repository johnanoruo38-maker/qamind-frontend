import { useState, useRef, useEffect, useCallback } from "react";

// ─── Inline styles (no Tailwind needed – pure CSS-in-JSX) ──────────────────

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
`;

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #0a0b0f;
  --surface:     #111318;
  --surface2:    #1a1d26;
  --border:      #252830;
  --border2:     #2e3240;
  --accent:      #6c8fff;
  --accent2:     #a78bfa;
  --accent-glow: rgba(108,143,255,.18);
  --text:        #e8eaf2;
  --text2:       #8b8fa8;
  --text3:       #555870;
  --success:     #34d399;
  --warn:        #fbbf24;
  --error:       #f87171;
  --radius:      16px;
  --radius-sm:   10px;
  --shadow:      0 4px 24px rgba(0,0,0,.5);
  --shadow-lg:   0 8px 48px rgba(0,0,0,.7);
  --font-head:   'Syne', sans-serif;
  --font-body:   'DM Sans', sans-serif;
  --transition:  0.2s cubic-bezier(.4,0,.2,1);
}

[data-theme="light"] {
  --bg:          #f0f2f8;
  --surface:     #ffffff;
  --surface2:    #f7f8fc;
  --border:      #dde1ee;
  --border2:     #c8cce0;
  --accent:      #4a6ef5;
  --accent2:     #7c3aed;
  --accent-glow: rgba(74,110,245,.12);
  --text:        #1a1d2e;
  --text2:       #5a5e78;
  --text3:       #9095b0;
  --shadow:      0 4px 24px rgba(0,0,0,.08);
  --shadow-lg:   0 8px 48px rgba(0,0,0,.12);
}

html { font-size: 16px; -webkit-font-smoothing: antialiased; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── Layout ── */
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  max-width: 860px;
  margin: 0 auto;
  position: relative;
}

/* ── Header ── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 50;
  gap: 12px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  box-shadow: 0 0 20px var(--accent-glow);
}

.logo-text {
  font-family: var(--font-head);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: -.01em;
  color: var(--text);
}
.logo-text span {
  color: var(--accent);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface2);
  color: var(--text2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition);
  font-size: 15px;
  outline: none;
}
.icon-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-glow);
}
.icon-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-glow);
}

.kb-badge {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text3);
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 3px 10px;
  display: none;
}
@media (min-width: 480px) { .kb-badge { display: flex; align-items: center; gap: 5px; } }
.kb-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); display: inline-block; }

/* ── Messages ── */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-behavior: smooth;
}
.messages-area::-webkit-scrollbar { width: 4px; }
.messages-area::-webkit-scrollbar-track { background: transparent; }
.messages-area::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

/* ── Welcome Screen ── */
.welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 16px;
  gap: 20px;
  animation: fadeUp 0.5s ease both;
}

.welcome-orb {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  box-shadow: 0 0 40px var(--accent-glow), 0 0 80px rgba(108,143,255,.08);
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 40px var(--accent-glow); }
  50% { box-shadow: 0 0 60px rgba(108,143,255,.35), 0 0 100px rgba(167,139,250,.15); }
}

.welcome-title {
  font-family: var(--font-head);
  font-size: clamp(1.4rem, 5vw, 2rem);
  font-weight: 800;
  letter-spacing: -.03em;
  line-height: 1.1;
}
.welcome-title span { 
  background: linear-gradient(120deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-sub {
  font-size: 0.9rem;
  color: var(--text2);
  max-width: 380px;
  line-height: 1.6;
  font-weight: 300;
}

.suggestion-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
  max-width: 480px;
  margin-top: 4px;
}

.suggestion-chip {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  font-size: 0.78rem;
  color: var(--text2);
  cursor: pointer;
  text-align: left;
  transition: all var(--transition);
  line-height: 1.4;
  outline: none;
  font-family: var(--font-body);
}
.suggestion-chip:hover, .suggestion-chip:focus {
  border-color: var(--accent);
  color: var(--text);
  background: var(--accent-glow);
  transform: translateY(-1px);
}
.suggestion-chip strong {
  display: block;
  font-size: 0.72rem;
  color: var(--accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
  margin-bottom: 3px;
}

/* ── Messages ── */
.msg-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: fadeUp 0.3s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.msg-wrapper.user { align-items: flex-end; }
.msg-wrapper.assistant { align-items: flex-start; }

.msg-meta {
  font-size: 0.68rem;
  color: var(--text3);
  padding: 0 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.msg-meta .avatar {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
}

.msg-bubble {
  max-width: min(82%, 540px);
  padding: 12px 16px;
  border-radius: var(--radius);
  font-size: 0.9rem;
  line-height: 1.65;
  word-break: break-word;
}

.msg-wrapper.user .msg-bubble {
  background: linear-gradient(135deg, var(--accent), #5a7ef0);
  color: #fff;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 16px rgba(108,143,255,.25);
}

.msg-wrapper.assistant .msg-bubble {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  border-bottom-left-radius: 4px;
  box-shadow: var(--shadow);
}

.msg-wrapper.assistant .msg-bubble.error-bubble {
  border-color: rgba(248,113,113,.3);
  background: rgba(248,113,113,.06);
}

/* ── Confidence badge ── */
.confidence-bar-wrap {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.confidence-label {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--text3);
  white-space: nowrap;
}
.confidence-track {
  flex: 1;
  height: 3px;
  background: var(--border2);
  border-radius: 2px;
  overflow: hidden;
}
.confidence-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(.4,0,.2,1);
}
.conf-value {
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
}

.matched-q {
  margin-top: 8px;
  font-size: 0.72rem;
  color: var(--text3);
  font-style: italic;
  border-left: 2px solid var(--border2);
  padding-left: 8px;
  line-height: 1.4;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .06em;
  background: var(--accent-glow);
  color: var(--accent);
  border: 1px solid rgba(108,143,255,.25);
  padding: 2px 8px;
  border-radius: 20px;
  margin-top: 8px;
}

/* ── Typing / Loading ── */
.typing-bubble {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  border-bottom-left-radius: 4px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: var(--shadow);
}

.typing-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: typing-bounce 1.2s ease-in-out infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: .5; }
  30% { transform: translateY(-6px); opacity: 1; }
}

/* ── History Drawer ── */
.history-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg);
  z-index: 100;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
}
.history-panel.open { transform: translateX(0); }

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}
.history-title {
  font-family: var(--font-head);
  font-size: 1rem;
  font-weight: 700;
}
.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.history-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  cursor: pointer;
  transition: all var(--transition);
  outline: none;
}
.history-item:hover, .history-item:focus {
  border-color: var(--accent);
  background: var(--accent-glow);
}
.history-item-q {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.history-item-a {
  font-size: 0.72rem;
  color: var(--text2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.history-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  color: var(--text3);
  font-size: 0.85rem;
}

/* ── Input Area ── */
.input-area {
  padding: 12px 16px 16px;
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: var(--surface2);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 8px 8px 8px 14px;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.input-row:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.qa-textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.9rem;
  line-height: 1.5;
  resize: none;
  max-height: 120px;
  min-height: 24px;
  overflow-y: auto;
  padding: 2px 0;
}
.qa-textarea::placeholder { color: var(--text3); }
.qa-textarea::-webkit-scrollbar { width: 3px; }
.qa-textarea::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

.input-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mic-btn {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid var(--border2);
  background: transparent;
  color: var(--text3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition);
  font-size: 14px;
  outline: none;
  flex-shrink: 0;
}
.mic-btn:hover { color: var(--text); border-color: var(--text2); }
.mic-btn.listening {
  color: var(--error);
  border-color: var(--error);
  background: rgba(248,113,113,.1);
  animation: mic-pulse 1s ease-in-out infinite;
}
@keyframes mic-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(248,113,113,.4); }
  50% { box-shadow: 0 0 0 6px rgba(248,113,113,0); }
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, var(--accent), #5a7ef0);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition);
  font-size: 15px;
  outline: none;
  flex-shrink: 0;
  box-shadow: 0 2px 12px rgba(108,143,255,.3);
}
.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(108,143,255,.45);
}
.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}
.send-btn.loading {
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.input-hint {
  margin-top: 6px;
  font-size: 0.68rem;
  color: var(--text3);
  text-align: center;
  padding: 0 4px;
}

/* ── Divider ── */
.date-divider {
  text-align: center;
  font-size: 0.68rem;
  color: var(--text3);
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}
.date-divider::before, .date-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}
`;

const Icon = ({ path, size = 16, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {path}
  </svg>
);

const Icons = {
  send:    <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
  sun:     <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
  moon:    <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
  history: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  close:   <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  mic:     <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>,
  bot:     <><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></>,
  trash:   <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
  loader:  <><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></>,
};

const SUGGESTIONS = [
  { label: "AI & ML", text: "What is machine learning?" },
  { label: "NLP",     text: "What is TF-IDF?" },
  { label: "Backend", text: "What is FastAPI?" },
  { label: "Data",    text: "What is the difference between SQL and NoSQL?" },
];

const confColor = (c) => {
  if (c >= 0.6) return "#34d399";
  if (c >= 0.3) return "#fbbf24";
  return "#f87171";
};

const confLabel = (c) => {
  if (c >= 0.6) return "High";
  if (c >= 0.3) return "Medium";
  return "Low";
};

// ─── THIS IS THE ONLY LINE THAT CHANGED ───────────────────────────────────────
const BACKEND_URL = "https://qamind-backend.onrender.com";
// ─────────────────────────────────────────────────────────────────────────────

async function askClaude(question, knowledgeContext) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are a precise Q&A assistant. Answer concisely (2-4 sentences max) based on this knowledge base context. Always respond with valid JSON only, no markdown.

Knowledge Base Topics: Machine Learning, Deep Learning, Neural Networks, NLP, TF-IDF, Cosine Similarity, Tokenization, Stop Words, Python, FastAPI, React, REST APIs, Docker, Git, CI/CD, Databases, SQL, NoSQL, Cloud Computing, Kubernetes, CORS, scikit-learn, Transformers, BERT.

Respond ONLY with this JSON (no backticks):
{"answer":"...","confidence":0.85,"category":"ai_ml","matched_question":"..."}

confidence: 0.0-1.0 based on how well you can answer from the knowledge base.
category: one of [ai_ml, nlp, programming, devops, data, cloud, general]
matched_question: rephrase the user's question cleanly.`,
      messages: [{ role: "user", content: question }],
    }),
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "{}";
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return {
      answer: parsed.answer || "I couldn't find a confident answer for that question.",
      confidence: parsed.confidence ?? 0.5,
      category: parsed.category ?? "general",
      matched_question: parsed.matched_question ?? question,
      source: "claude_api",
    };
  } catch {
    return {
      answer: text,
      confidence: 0.5,
      category: "general",
      matched_question: question,
      source: "claude_api",
    };
  }
}

async function askQuestion(question) {
  try {
    const res = await fetch(`${BACKEND_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (backendErr) {
    console.info("Backend unavailable, using Claude API fallback:", backendErr.message);
    return await askClaude(question);
  }
}

export default function QAApp() {
  const [theme, setTheme]       = useState("dark");
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory]   = useState([]);
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, []);

  const toggleVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Speech recognition not supported in this browser.");
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev ? prev + " " + transcript : transcript);
      setTimeout(resizeTextarea, 0);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  }, [listening, resizeTextarea]);

  const handleSubmit = useCallback(async (questionText) => {
    const q = (questionText ?? input).trim();
    if (!q || loading) return;

    const userMsg = { role: "user", content: q, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const data = await askQuestion(q);
      const botMsg = {
        role: "assistant",
        content: data.answer,
        confidence: data.confidence,
        category: data.category,
        matched_question: data.matched_question,
        source: data.source,
        id: Date.now() + 1,
      };
      setMessages(prev => [...prev, botMsg]);
      setHistory(prev => [{ question: q, answer: data.answer }, ...prev.slice(0, 49)]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `⚠️ ${err.message || "Something went wrong. Please try again."}`,
        error: true,
        id: Date.now() + 1,
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [input, loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");
  const clearChat   = () => setMessages([]);

  return (
    <>
      <style>{FONTS}{CSS}</style>
      <div className="app-shell" data-theme={theme}>
        <div className={`history-panel ${showHistory ? "open" : ""}`} role="dialog" aria-label="Question history">
          <div className="history-header">
            <span className="history-title">History</span>
            <div style={{ display: "flex", gap: 8 }}>
              {history.length > 0 && (
                <button className="icon-btn" onClick={() => setHistory([])} aria-label="Clear history">
                  <Icon path={Icons.trash} size={15} />
                </button>
              )}
              <button className="icon-btn" onClick={() => setShowHistory(false)} aria-label="Close history">
                <Icon path={Icons.close} size={15} />
              </button>
            </div>
          </div>
          <div className="history-list" role="list">
            {history.length === 0 ? (
              <div className="history-empty">
                <span style={{ fontSize: "2rem" }}>📭</span>
                <span>No history yet</span>
              </div>
            ) : history.map((item, i) => (
              <button
                key={i}
                className="history-item"
                role="listitem"
                onClick={() => {
                  setShowHistory(false);
                  handleSubmit(item.question);
                }}
                aria-label={`Ask again: ${item.question}`}
              >
                <div className="history-item-q">{item.question}</div>
                <div className="history-item-a">{item.answer}</div>
              </button>
            ))}
          </div>
        </div>

        <header className="header" role="banner">
          <div className="logo-area">
            <div className="logo-icon" aria-hidden="true">🧠</div>
            <span className="logo-text">QA<span>Mind</span></span>
          </div>
          <div className="kb-badge">
            <span className="kb-dot" aria-hidden="true" />
            75 topics
          </div>
          <div className="header-actions">
            {messages.length > 0 && (
              <button className="icon-btn" onClick={clearChat} aria-label="Clear conversation">
                <Icon path={Icons.trash} size={15} />
              </button>
            )}
            <button
              className={`icon-btn ${showHistory ? "active" : ""}`}
              onClick={() => setShowHistory(true)}
              aria-label="View history"
            >
              <Icon path={Icons.history} size={15} />
            </button>
            <button className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              <Icon path={theme === "dark" ? Icons.sun : Icons.moon} size={15} />
            </button>
          </div>
        </header>

        <main className="messages-area" role="main" aria-live="polite" aria-label="Conversation">
          {messages.length === 0 ? (
            <div className="welcome" role="region" aria-label="Welcome">
              <div className="welcome-orb" aria-hidden="true">🧠</div>
              <h1 className="welcome-title">Ask anything about<br/><span>tech & AI</span></h1>
              <p className="welcome-sub">
                Powered by TF-IDF retrieval + Claude fallback. Ask about machine learning, NLP, APIs, databases, DevOps, and more.
              </p>
              <div className="suggestion-grid" role="list" aria-label="Suggested questions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="suggestion-chip"
                    role="listitem"
                    onClick={() => handleSubmit(s.text)}
                    aria-label={`Ask: ${s.text}`}
                  >
                    <strong>{s.label}</strong>
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="date-divider" aria-hidden="true">Today</div>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`msg-wrapper ${msg.role}`}
                  role="article"
                  aria-label={msg.role === "user" ? "Your question" : "Answer"}
                >
                  {msg.role === "assistant" && (
                    <div className="msg-meta">
                      <div className="avatar" aria-hidden="true">🧠</div>
                      QAMind
                      {msg.source === "claude_api" && (
                        <span style={{ color: "var(--accent)", fontSize: "0.65rem" }}>· Claude</span>
                      )}
                    </div>
                  )}
                  <div className={`msg-bubble ${msg.error ? "error-bubble" : ""}`}>
                    {msg.content}
                    {msg.role === "assistant" && !msg.error && msg.confidence != null && (
                      <>
                        <div className="confidence-bar-wrap" aria-label={`Confidence: ${Math.round(msg.confidence * 100)}%`}>
                          <span className="confidence-label">Confidence</span>
                          <div className="confidence-track">
                            <div
                              className="confidence-fill"
                              style={{
                                width: `${Math.round(msg.confidence * 100)}%`,
                                background: confColor(msg.confidence),
                              }}
                            />
                          </div>
                          <span className="conf-value" style={{ color: confColor(msg.confidence) }}>
                            {confLabel(msg.confidence)} · {Math.round(msg.confidence * 100)}%
                          </span>
                        </div>
                        {msg.category && (
                          <span className="category-tag">
                            # {msg.category.replace("_", " ")}
                          </span>
                        )}
                        {msg.matched_question && (
                          <div className="matched-q">
                            Matched: "{msg.matched_question}"
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="msg-meta" style={{ justifyContent: "flex-end" }}>
                      You
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {loading && (
            <div className="msg-wrapper assistant" aria-label="Loading answer">
              <div className="msg-meta">
                <div className="avatar" aria-hidden="true">🧠</div>
                QAMind
              </div>
              <div className="typing-bubble" aria-live="polite" aria-label="Thinking...">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} aria-hidden="true" />
        </main>

        <footer className="input-area" role="contentinfo">
          <div className="input-row">
            <textarea
              ref={textareaRef}
              className="qa-textarea"
              value={input}
              onChange={(e) => { setInput(e.target.value); resizeTextarea(); }}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question… (Enter to send)"
              rows={1}
              aria-label="Type your question"
              aria-multiline="true"
              disabled={loading}
              maxLength={500}
            />
            <div className="input-actions">
              <button
                className={`mic-btn ${listening ? "listening" : ""}`}
                onClick={toggleVoice}
                aria-label={listening ? "Stop listening" : "Start voice input"}
                title="Voice input"
              >
                <Icon path={Icons.mic} size={14} />
              </button>
              <button
                className={`send-btn ${loading ? "loading" : ""}`}
                onClick={() => handleSubmit()}
                disabled={!input.trim() || loading}
                aria-label="Send question"
              >
                <Icon path={loading ? Icons.loader : Icons.send} size={14} />
              </button>
            </div>
          </div>
          <p className="input-hint" aria-hidden="true">
            Shift+Enter for new line · {input.length}/500
          </p>
        </footer>
      </div>
    </>
  );
}