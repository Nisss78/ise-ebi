import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">決済を中止しました</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          購入は完了していません。内容を確認して、必要であれば再度お試しください。
        </p>
        <Link
          href="/landing"
          className="mt-6 inline-flex rounded-xl border px-4 py-2 text-sm font-semibold"
        >
          トップへ戻る
        </Link>
      </div>
    </main>
  );
}
