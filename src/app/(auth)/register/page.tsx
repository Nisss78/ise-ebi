"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Register
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "登録中にエラーが発生しました。");
      setLoading(false);
      return;
    }

    // Auto-login after successful registration
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("登録は完了しましたが、ログインに失敗しました。");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>アカウント作成</CardTitle>
        <CardDescription>
          新しいアカウントを作成してください。
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              type="text"
              placeholder="山田 太郎"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">ユーザー名</Label>
            <Input
              id="username"
              type="text"
              placeholder="yamada_taro"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              autoComplete="username"
            />
            <p className="text-xs text-muted-foreground">
              小文字の英数字またはアンダースコア（3〜20文字）
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full mt-1" disabled={loading}>
            {loading ? "作成中..." : "アカウント作成"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        すでにアカウントをお持ちの方は{" "}
        <Link
          href="/login"
          className="ml-1 text-foreground underline underline-offset-4 hover:text-primary"
        >
          ログイン
        </Link>
      </CardFooter>
    </Card>
  );
}
