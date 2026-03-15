import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  BotMessageSquare,
  CheckCircle2,
  CreditCard,
  Link as LinkIcon,
  ShoppingBag,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: LinkIcon,
    title: "リンク集",
    description: "SNSやWebサイトを1ページに集約",
  },
  {
    icon: ShoppingBag,
    title: "商品販売",
    description: "デジタル商品をワンタップで販売",
  },
  {
    icon: CreditCard,
    title: "決済",
    description: "StripeでApple Pay/Google Pay対応",
  },
  {
    icon: BotMessageSquare,
    title: "AI接客",
    description: "商品レコメンドを自動化",
  },
  {
    icon: BarChart2,
    title: "分析",
    description: "PV・売上をダッシュボードで確認",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-bold">Stan Store Clone</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              はじめる
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              <Zap className="h-3.5 w-3.5" />
              日本語対応
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              リンクも商品も
              <br />
              1ページで売れる
            </h1>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              プロフィール、リンク集、商品販売、決済まで揃った
              クリエイター向けストアフロント
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
              >
                無料ではじめる
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/testuser"
                className="inline-flex items-center justify-center rounded-md border px-6 py-3 font-medium hover:bg-accent"
              >
                デモを見る
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              {["無料で開始", "日本円対応", "Apple Pay"].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section className="border-t py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                必要な機能をシンプルに
              </h2>
              <p className="mt-2 text-muted-foreground">
                クリエイターが商品を販売するために必要なものだけ
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
                >
                  <Icon className="mb-3 h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold">今すぐはじめる</h2>
            <p className="mt-2 text-muted-foreground">
              無料でアカウントを作成して、あなたのストアを作ろう
            </p>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90"
            >
              ストアを作成
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by Stan Store Clone</p>
        </div>
      </footer>
    </div>
  );
}
