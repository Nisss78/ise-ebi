"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  ShoppingBagIcon,
  Loader2,
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  thumbnailUrl: string | null;
  fileUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  thumbnailUrl: string;
  fileUrl: string;
}

const emptyForm: ProductFormData = {
  title: "",
  description: "",
  price: "",
  thumbnailUrl: "",
  fileUrl: "",
};

function formatPrice(price: number) {
  return `¥${price.toLocaleString("ja-JP")}`;
}

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Product | null;
  onSaved: () => void;
}

function ProductFormDialog({
  open,
  onOpenChange,
  initialData,
  onSaved,
}: ProductFormDialogProps) {
  const isEditing = Boolean(initialData);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          title: initialData.title,
          description: initialData.description ?? "",
          price: String(initialData.price),
          thumbnailUrl: initialData.thumbnailUrl ?? "",
          fileUrl: initialData.fileUrl ?? "",
        });
      } else {
        setForm(emptyForm);
      }
      setError(null);
    }
  }, [open, initialData]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsedPrice = parseInt(form.price, 10);
    if (!form.title.trim()) {
      setError("商品名を入力してください。");
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("価格は0以上の整数で入力してください。");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        price: parsedPrice,
        thumbnailUrl: form.thumbnailUrl.trim() || null,
        fileUrl: form.fileUrl.trim() || null,
      };

      const url = isEditing
        ? `/api/admin/products/${initialData!.id}`
        : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "エラーが発生しました。");
        return;
      }

      onSaved();
      onOpenChange(false);
    } catch {
      setError("ネットワークエラーが発生しました。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "商品を編集" : "商品を追加"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prod-title">商品名</Label>
            <Input
              id="prod-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="例：デジタル写真集"
              required
              disabled={saving}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prod-description">説明</Label>
            <Textarea
              id="prod-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="商品の詳細説明を入力してください"
              disabled={saving}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prod-price">価格（円）</Label>
            <Input
              id="prod-price"
              name="price"
              type="number"
              min={0}
              step={1}
              value={form.price}
              onChange={handleChange}
              placeholder="1000"
              required
              disabled={saving}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prod-thumbnailUrl">サムネイルURL</Label>
            <Input
              id="prod-thumbnailUrl"
              name="thumbnailUrl"
              type="url"
              value={form.thumbnailUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              disabled={saving}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prod-fileUrl">ファイルURL</Label>
            <Input
              id="prod-fileUrl"
              name="fileUrl"
              type="url"
              value={form.fileUrl}
              onChange={handleChange}
              placeholder="https://example.com/file.zip"
              disabled={saving}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving && <Loader2 className="size-4 animate-spin" />}
              保存
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onDeleted: () => void;
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  product,
  onDeleted,
}: DeleteConfirmDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "削除中にエラーが発生しました。");
        return;
      }
      onDeleted();
      onOpenChange(false);
    } catch {
      setError("ネットワークエラーが発生しました。");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>商品を削除</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          「{product.title}」を削除してもよろしいですか？この操作は元に戻せません。
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            キャンセル
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2"
          >
            {deleting && <Loader2 className="size-4 animate-spin" />}
            削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) {
        const data = await res.json();
        setFetchError(data.error || "商品の取得に失敗しました。");
        return;
      }
      const data = await res.json();
      setProducts(data);
    } catch {
      setFetchError("ネットワークエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">商品管理</h1>
          <p className="text-sm text-muted-foreground">
            デジタル商品の追加・編集・削除ができます
          </p>
        </div>
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="gap-2"
        >
          <PlusIcon className="size-4" />
          商品を追加
        </Button>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {fetchError}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !fetchError && products.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <ShoppingBagIcon className="size-10 text-muted-foreground/50" />
          <div>
            <p className="text-sm font-medium">商品がまだありません</p>
            <p className="text-xs text-muted-foreground">
              「商品を追加」から最初の商品を登録しましょう
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setAddDialogOpen(true)}
            className="gap-1.5"
          >
            <PlusIcon className="size-3.5" />
            商品を追加
          </Button>
        </div>
      )}

      {/* Product grid */}
      {!loading && products.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-sm"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {product.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.thumbnailUrl}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBagIcon className="size-8 text-muted-foreground/40" />
                  </div>
                )}
                {/* Active badge */}
                <span
                  className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                    product.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {product.isActive ? "販売中" : "非公開"}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-1 p-3">
                <p className="line-clamp-1 text-sm font-medium">
                  {product.title}
                </p>
                {product.description && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {product.description}
                  </p>
                )}
                <p className="mt-auto pt-2 text-base font-semibold">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 border-t p-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => setEditingProduct(product)}
                >
                  <PencilIcon className="size-3.5" />
                  編集
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setDeletingProduct(product)}
                >
                  <Trash2Icon className="size-3.5" />
                  削除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add dialog */}
      <ProductFormDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        initialData={null}
        onSaved={fetchProducts}
      />

      {/* Edit dialog */}
      {editingProduct && (
        <ProductFormDialog
          open={Boolean(editingProduct)}
          onOpenChange={(open) => {
            if (!open) setEditingProduct(null);
          }}
          initialData={editingProduct}
          onSaved={fetchProducts}
        />
      )}

      {/* Delete confirm dialog */}
      {deletingProduct && (
        <DeleteConfirmDialog
          open={Boolean(deletingProduct)}
          onOpenChange={(open) => {
            if (!open) setDeletingProduct(null);
          }}
          product={deletingProduct}
          onDeleted={fetchProducts}
        />
      )}
    </div>
  );
}
