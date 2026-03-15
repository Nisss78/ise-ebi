"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "こんにちは！商品のおすすめやストア運営についてお手伝いします。",
};

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"} items-end`}
    >
      {!isUser && (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="size-4" />
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted text-foreground"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export default function AiPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    const userMessage: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) throw new Error("エラーが発生しました");

      const data = (await res.json()) as Message;
      setMessages((prev) => [...prev, data]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "申し訳ありません。エラーが発生しました。もう一度お試しください。",
        },
      ]);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] flex-col gap-0 overflow-hidden rounded-xl border bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-5 py-3.5">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="size-4" />
        </div>
        <div>
          <h1 className="text-sm font-semibold">AIアシスタント</h1>
          <p className="text-xs text-muted-foreground">ストア運営のサポート</p>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-4">
          {messages.map((message, index) => (
            <ChatBubble key={index} message={message} />
          ))}
          {sending && (
            <div className="flex items-end gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="size-4" />
              </div>
              <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5">
                <span className="flex gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t bg-background px-5 py-4">
        <div className="flex items-end gap-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力"
            rows={1}
            className="min-h-[2.5rem] max-h-36 resize-none rounded-xl"
            disabled={sending}
          />
          <Button
            onClick={() => void handleSend()}
            disabled={!input.trim() || sending}
            size="icon"
            className="shrink-0 rounded-xl"
          >
            <Send className="size-4" />
            <span className="sr-only">送信</span>
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Enterで送信、Shift+Enterで改行
        </p>
      </div>
    </div>
  );
}
