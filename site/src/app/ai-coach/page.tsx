"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";

type Message = {
  role: "user" | "assistant" | "system";
  text: string;
  sources?: { fonte: string; categoria: string; score: number }[];
  related?: { risposta: string; fonte: string; score: number }[];
};

type WorkerStatus =
  | "idle"
  | "loading"
  | "indexing"
  | "ready"
  | "thinking"
  | "error";

const SUGGESTIONS = [
  "Cosa mangiare prima di un ultra trail?",
  "Come assumere abbastanza proteine vegetali?",
  "Quali integratori per un runner vegano?",
  "Come prepararsi per una maratona?",
  "Chi è Scott Jurek?",
  "Smoothie di recupero post corsa?",
];

export default function AiCoach() {
  const { supabase } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<WorkerStatus>("idle");
  const [statusText, setStatusText] = useState("");
  const [progress, setProgress] = useState(0);
  const [indexProgress, setIndexProgress] = useState({ done: 0, total: 0 });
  const workerRef = useRef<Worker | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, status, scrollToBottom]);

  // Initialize worker + load KB from Supabase
  useEffect(() => {
    if (!supabase) return;

    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const { type, data } = e.data;

      switch (type) {
        case "status":
          setStatus("loading");
          setStatusText(data);
          break;
        case "progress":
          setProgress(data.percent);
          break;
        case "indexing":
          setStatus("indexing");
          setIndexProgress(data);
          break;
        case "ready":
          setStatus("ready");
          setStatusText("");
          break;
        case "thinking":
          setStatus("thinking");
          break;
        case "answer":
          setStatus("ready");
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: data.text,
              sources: data.sources,
              related: data.related,
            },
          ]);
          break;
        case "error":
          setStatus("error");
          setStatusText(data);
          setMessages((prev) => [
            ...prev,
            { role: "system", text: data },
          ]);
          break;
        case "reset-done":
          // Re-init after reset
          init();
          break;
      }
    };

    // Load knowledge base from Supabase, then init worker
    const init = async () => {
      setStatus("loading");
      setStatusText("Caricamento knowledge base...");

      const { data: kb, error } = await supabase
        .from("ai_knowledge_base")
        .select("*")
        .order("ordine");

      if (error || !kb) {
        setStatus("error");
        setStatusText("Errore caricamento knowledge base");
        return;
      }

      worker.postMessage({ type: "init", data: { knowledgeBase: kb } });
    };

    init();

    return () => {
      worker.terminate();
    };
  }, [supabase]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || status !== "ready") return;

      setMessages((prev) => [...prev, { role: "user", text: text.trim() }]);
      setInput("");
      workerRef.current?.postMessage({ type: "query", data: { text: text.trim() } });
      inputRef.current?.focus();
    },
    [status]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = useCallback(() => {
    setMessages([]);
    setStatus("loading");
    setStatusText("Reset cache e modello...");
    setProgress(0);
    workerRef.current?.postMessage({ type: "reset" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 mb-4 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                AI Coach
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Assistente locale per running, ultra-trail e nutrizione plant-based.
                Basato su <span className="italic">The Plant-Based Athlete</span>,{" "}
                <span className="italic">Eat &amp; Run</span>,{" "}
                <span className="italic">Finding Ultra</span> e{" "}
                <span className="italic">Andiamo a correre</span>.
                Il modello gira nel tuo browser (~23 MB).
              </p>
            </div>
            <button
              onClick={handleReset}
              title="Reset cache e ricarica modello"
              className="ml-3 mt-1 px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Status bar */}
        {status !== "ready" && status !== "idle" && (
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-4 transition-colors">
            {status === "loading" && (
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">{statusText}</p>
                {progress > 0 && (
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            )}
            {status === "indexing" && (
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  Indicizzazione domande... {indexProgress.done}/{indexProgress.total}
                </p>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${indexProgress.total ? (indexProgress.done / indexProgress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {status === "thinking" && (
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                Ricerca in corso...
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-700 dark:text-red-300">{statusText}</p>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0">
          {messages.length === 0 && status === "ready" && (
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
                <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Fonti:
                    </p>
                    {msg.sources.map((s, j) => (
                      <span
                        key={j}
                        className="inline-block mr-2 mb-1 px-2 py-0.5 rounded-full text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                      >
                        {s.fonte} ({s.score}%)
                      </span>
                    ))}
                  </div>
                )}

                {/* Related answers */}
                {msg.related && msg.related.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      Vedi anche:
                    </p>
                    {msg.related.map((r, j) => (
                      <div
                        key={j}
                        className="mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs"
                      >
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {r.risposta}
                        </p>
                        <span className="text-gray-400 dark:text-gray-500 text-[10px]">
                          {r.fonte} ({r.score}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Disclaimer */}
                {msg.role === "assistant" && (
                  <p className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-[10px] italic text-gray-400 dark:text-gray-500 leading-snug">
                    Le risposte sono generate da un sistema sperimentale basato su ricerca semantica. Non sostituiscono il parere di un professionista. Usale come spunto, non come indicazione definitiva.
                  </p>
                )}
              </div>
            </div>
          ))}

          {status === "thinking" && messages.length > 0 && (
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

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              status === "ready"
                ? "Scrivi la tua domanda..."
                : "Caricamento modello..."
            }
            disabled={status !== "ready"}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
          />
          <button
            type="submit"
            disabled={status !== "ready" || !input.trim()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Invia
          </button>
        </form>
      </main>
    </div>
  );
}
