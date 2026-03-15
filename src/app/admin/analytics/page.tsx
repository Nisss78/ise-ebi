"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, MousePointerClick, ShoppingCart, TrendingUp } from "lucide-react";

type AnalyticsEvent = {
  id: string;
  eventType: string;
  metadata: string | null;
  createdAt: string;
};

type AnalyticsData = {
  counts: {
    pageViews: number;
    linkClicks: number;
    orders: number;
  };
  totalRevenue: number;
  recentEvents: AnalyticsEvent[];
};

function eventTypeLabel(eventType: string): string {
  switch (eventType) {
    case "page_view":
      return "ページビュー";
    case "link_click":
      return "リンククリック";
    case "order":
      return "注文";
    default:
      return eventType;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => {
        if (!res.ok) throw new Error("データの取得に失敗しました");
        return res.json();
      })
      .then((json: AnalyticsData) => {
        setData(json);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">アナリティクス</h1>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ページビュー
            </CardTitle>
            <Eye className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data?.counts.pageViews.toLocaleString("ja-JP") ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              リンククリック
            </CardTitle>
            <MousePointerClick className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data?.counts.linkClicks.toLocaleString("ja-JP") ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              注文数
            </CardTitle>
            <ShoppingCart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data?.counts.orders.toLocaleString("ja-JP") ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              売上
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ¥{data?.totalRevenue.toLocaleString("ja-JP") ?? "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">最近のイベント</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recentEvents.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              まだイベントはありません
            </p>
          ) : (
            <div className="divide-y">
              {data?.recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                      {eventTypeLabel(event.eventType)}
                    </span>
                    {event.metadata && (
                      <span className="text-muted-foreground">
                        {(() => {
                          try {
                            const parsed = JSON.parse(event.metadata);
                            return Object.entries(parsed)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(", ");
                          } catch {
                            return event.metadata;
                          }
                        })()}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(event.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
