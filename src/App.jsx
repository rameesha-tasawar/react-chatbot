import { useState } from "react";
import axios from "axios";

function App() {
  const [userQuery, setUserQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const question = userQuery.trim();
    if (!question || loading) return;

    setConversation((prev) => [
      ...prev,
      { role: "user", content: question },
    ]);
    setUserQuery("");
    setLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      const apiRes = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful software engineer named Rameesha.
Answer software engineering questions in 1–2 concise lines.
Politely refuse unrelated questions.`,
                },
                { text: question },
              ],
            },
          ],
        },
        {
          headers: {
            "x-goog-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const reply =
        apiRes.data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || "")
          .join("") || "No response received.";

      setConversation((prev) => [
        ...prev,
        { role: "ai", content: reply },
      ]);
    } catch (error) {
      console.error(error);
      setConversation((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">

      <div className="w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl shadow-purple-950/30">

        {/* Header */}
        <header className="flex items-center gap-4 border-b border-slate-700 bg-slate-900/90 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-xl font-bold shadow-lg">
            R
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-wide">
              Rameesha AI
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Your Software Engineering Assistant
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            AI Assistant
          </div>
        </header>

        {/* Chat messages */}
        <main className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-8">

          {conversation.length === 0 && (
            <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600/30 to-cyan-500/20 text-4xl ring-1 ring-violet-400/30">
                ✨
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Hello, Developer!
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                I'm Rameesha AI. Ask me anything about React,
                JavaScript, APIs, or software engineering.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  "What is React?",
                  "Explain JavaScript promises",
                  "What is an API?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setUserQuery(suggestion)}
                    className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:border-violet-500 hover:bg-violet-500/10 hover:text-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {conversation.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.role === "ai" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 font-bold text-white">
                  R
                </div>
              )}

              <div
                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-7 sm:max-w-[75%] ${
                  message.role === "user"
                    ? "rounded-tr-sm bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-950/20"
                    : "rounded-tl-sm border border-slate-700 bg-slate-800 text-slate-200"
                }`}
              >
                {message.content}
              </div>

              {message.role === "user" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-sm font-bold">
                  You
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 font-bold">
                R
              </div>

              <div className="flex items-center gap-1 rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4">
                <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]"></span>
              </div>
            </div>
          )}
        </main>

        {/* Message input */}
        <footer className="border-t border-slate-700 bg-slate-900 p-4 sm:p-5">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 p-2 transition focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20"
          >
            <input
              type="text"
              name="userQuery"
              id="userQuery"
              value={userQuery}
              placeholder="Ask a software engineering question..."
              onChange={(e) => setUserQuery(e.target.value)}
              disabled={loading}
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!userQuery.trim() || loading}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>Send</span>
              <span aria-hidden="true">➤</span>
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-slate-500">
            Powered by Gemini AI · Built with React & Tailwind CSS
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;