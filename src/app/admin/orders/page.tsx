"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Eye, Mail, Calendar, Loader2 } from "lucide-react";

type Order = {
  id: string;
  buyerEmail: string;
  buyerName: string | null;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  product: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
  };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("注文履歴の取得に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  }

  const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    pending: { label: "処理中", variant: "secondary" },
    completed: { label: "完了", variant: "default" },
    cancelled: { label: "キャンセル", variant: "destructive" },
  };

  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">注文履歴</h1>
        <Badge variant="outline" className="text-base">
          売上: ¥{totalRevenue.toLocaleString("ja-JP")}
        </Badge>
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              総注文数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              完了した注文
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "completed").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              総売上
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{totalRevenue.toLocaleString("ja-JP")}</div>
          </CardContent>
        </Card>
      </div>

      {/* 注文一覧 */}
      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingBag className="mx-auto size-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">まだ注文がありません</p>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
                >
                  {/* 商品画像 */}
                  {order.product.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={order.product.thumbnailUrl}
                      alt={order.product.title}
                      className="size-12 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <ShoppingBag className="size-5 text-muted-foreground" />
                    </div>
                  )}

                  {/* 注文情報 */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{order.product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.buyerEmail}
                    </p>
                  </div>

                  {/* 金額・ステータス */}
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">¥{order.amount.toLocaleString("ja-JP")}</p>
                    <Badge variant={statusLabels[order.status]?.variant || "secondary"}>
                      {statusLabels[order.status]?.label || order.status}
                    </Badge>
                  </div>

                  {/* 詳細ボタン */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 詳細ダイアログ */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>注文詳細</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* 商品情報 */}
              <div className="flex items-center gap-3 rounded-lg border p-3">
                {selectedOrder.product.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedOrder.product.thumbnailUrl}
                    alt={selectedOrder.product.title}
                    className="size-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-lg bg-muted">
                    <ShoppingBag className="size-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{selectedOrder.product.title}</p>
                  <p className="text-lg font-bold text-primary">
                    ¥{selectedOrder.amount.toLocaleString("ja-JP")}
                  </p>
                </div>
              </div>

              {/* 購入者情報 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{selectedOrder.buyerEmail}</span>
                </div>
                {selectedOrder.buyerName && (
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.buyerName}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span>
                    {new Date(selectedOrder.createdAt).toLocaleString("ja-JP")}
                  </span>
                </div>
              </div>

              {/* ステータス */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ステータス</span>
                <Badge variant={statusLabels[selectedOrder.status]?.variant || "secondary"}>
                  {statusLabels[selectedOrder.status]?.label || selectedOrder.status}
                </Badge>
              </div>

              {/* 注文ID */}
              <p className="text-xs text-muted-foreground">
                注文ID: {selectedOrder.id}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
