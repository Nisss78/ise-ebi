"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Profile {
  id: string;
  username: string;
  email: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  themeColor: string;
  themeName: string;
  twitterUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  websiteUrl: string | null;
}

const themeOptions = [
  { value: "default", label: "デフォルト" },
  { value: "ocean", label: "オーシャン" },
  { value: "sunset", label: "サンセット" },
  { value: "sakura", label: "さくら" },
  { value: "dark", label: "ダーク" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatarUrl: "",
    themeColor: "#6366f1",
    themeName: "default",
    twitterUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
    websiteUrl: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/admin/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data: Profile = await res.json();
      setProfile(data);
      setFormData({
        name: data.name ?? "",
        bio: data.bio ?? "",
        avatarUrl: data.avatarUrl ?? "",
        themeColor: data.themeColor,
        themeName: data.themeName,
        twitterUrl: data.twitterUrl ?? "",
        instagramUrl: data.instagramUrl ?? "",
        youtubeUrl: data.youtubeUrl ?? "",
        tiktokUrl: data.tiktokUrl ?? "",
        websiteUrl: data.websiteUrl ?? "",
      });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "プロフィールの取得に失敗しました" });
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");
      setMessage({ type: "success", text: "プロフィールを保存しました" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "保存に失敗しました" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="text-sm text-muted-foreground">読み込み中...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">プロフィール編集</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile?.username && `@${profile.username}`}
        </p>
      </div>

      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold">基本情報</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">名前</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="表示名を入力"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">自己紹介</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="自己紹介を入力"
                rows={4}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="avatarUrl">アバターURL</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
        </section>

        {/* Theme */}
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold">テーマ</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="themeColor">テーマカラー</Label>
              <div className="flex items-center gap-3">
                <input
                  id="themeColor"
                  name="themeColor"
                  type="color"
                  value={formData.themeColor}
                  onChange={handleChange}
                  className="h-8 w-12 cursor-pointer rounded border border-input bg-transparent p-0.5"
                />
                <Input
                  name="themeColor"
                  value={formData.themeColor}
                  onChange={handleChange}
                  placeholder="#6366f1"
                  className="w-32 font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>テーマ</Label>
              <select
                value={formData.themeName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, themeName: e.target.value }))
                }
                className="flex h-9 w-48 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {themeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Social links */}
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold">SNSリンク</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="twitterUrl">Twitter / X</Label>
              <Input
                id="twitterUrl"
                name="twitterUrl"
                type="url"
                value={formData.twitterUrl}
                onChange={handleChange}
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="instagramUrl">Instagram</Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="youtubeUrl">YouTube</Label>
              <Input
                id="youtubeUrl"
                name="youtubeUrl"
                type="url"
                value={formData.youtubeUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/@channel"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tiktokUrl">TikTok</Label>
              <Input
                id="tiktokUrl"
                name="tiktokUrl"
                type="url"
                value={formData.tiktokUrl}
                onChange={handleChange}
                placeholder="https://tiktok.com/@username"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="websiteUrl">ウェブサイト</Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg">
            {saving ? "保存中..." : "保存する"}
          </Button>
        </div>
      </form>
    </div>
  );
}
