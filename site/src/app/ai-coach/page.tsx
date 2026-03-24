"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant" | "system";
  text: string;
};

const SUGGESTIONS = [
  "Cosa mangiare prima di un ultra trail?",
  "Come assumere abbastanza proteine vegetali?",
  "Quali integratori per un runner vegano?",
  "Come prepararsi per una maratona?",
  "Chi è Scott Jurek?",
  "Smoothie di recupero post corsa?",
];

export default function AiCoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: Message = { role: "user", text: text.trim() };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const apiMessages = newMessages
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role, content: m.text }));

        const res = await fetch("/api/ai-coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `Errore ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let assistantText = "";
        let buffer = "";

        setMessages((prev) => [...prev, { role: "assistant", text: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantText += delta;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    text: assistantText,
                  };
                  return updated;
                });
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          const msg = (err as Error).message;
          if (msg.includes("Troppe richieste") || msg.includes("429")) {
            setToast("Troppe richieste. Riprova tra qualche secondo.");
            setTimeout(() => setToast(null), 4000);
          } else if (!msg.includes("413")) {
            setMessages((prev) => [
              ...prev,
              { role: "system", text: `Errore: ${msg}` },
            ]);
          }
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
        inputRef.current?.focus();
      }
    },
    [isStreaming, messages]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setIsStreaming(false);
  }, []);

  return (
    <div
      className="h-[100dvh] bg-gray-100 dark:bg-gray-950 transition-colors flex flex-col"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Toast popup */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-in">
          {toast}
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-4 md:py-8 flex flex-col flex-1 min-h-0 w-full">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 mb-4 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                AI Coach
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Assistente AI per running, ultra-trail e nutrizione plant-based.
                Basato su <span className="italic">The Plant-Based Athlete</span>,{" "}
                <span className="italic">Eat &amp; Run</span>,{" "}
                <span className="italic">Finding Ultra</span> e{" "}
                <span className="italic">Andiamo a correre</span>.
                Powered by Llama 3.3 70B.
              </p>
            </div>
            <button
              onClick={handleReset}
              title="Nuova conversazione"
              className="ml-3 mt-1 px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Nuova chat
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Chiedimi qualcosa su running, trail, nutrizione plant-based!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-4 ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white"
                    : msg.role === "system"
                    ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                    : "bg-white dark:bg-gray-900 shadow-md text-gray-800 dark:text-gray-200"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
                )}

                {/* Disclaimer */}
                {msg.role === "assistant" && msg.text && (
                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] italic text-gray-400 dark:text-gray-500 leading-snug">
                      Generato da Llama 3.3 70B. Le risposte sono sperimentali e non sostituiscono il parere di un professionista.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input - anchored to bottom */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 pt-2 pb-[env(safe-area-inset-bottom)] sticky bottom-0 bg-gray-100 dark:bg-gray-950"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi la tua domanda..."
            disabled={isStreaming}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Invia
          </button>
        </form>
      </main>
    </div>
  );
}
