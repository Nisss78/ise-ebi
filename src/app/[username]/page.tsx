import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StorefrontClient from "./storefront-client";

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    select: { name: true, bio: true, username: true },
  });

  if (!user) {
    return { title: "ユーザーが見つかりません" };
  }

  return {
    title: `${user.name ?? user.username} | Stan Store`,
    description: user.bio ?? `${user.name ?? user.username}のストアフロント`,
  };
}

export default async function StorefrontPage({ params }: PageProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Record page_view analytics event (fire-and-forget, don't block render)
  prisma.analytics
    .create({
      data: {
        userId: user.id,
        eventType: "page_view",
        metadata: JSON.stringify({ username }),
      },
    })
    .catch(() => {
      // Silently fail — analytics must never break the page
    });

  // Serialize data so it can be safely passed to the client component
  const serializedUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    themeColor: user.themeColor,
    themeName: user.themeName,
    twitterUrl: user.twitterUrl,
    instagramUrl: user.instagramUrl,
    youtubeUrl: user.youtubeUrl,
    tiktokUrl: user.tiktokUrl,
    websiteUrl: user.websiteUrl,
  };

  const serializedLinks = user.links.map((link) => ({
    id: link.id,
    title: link.title,
    url: link.url,
    order: link.order,
    icon: link.icon,
    isActive: link.isActive,
  }));

  const serializedProducts = user.products.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    currency: product.currency,
    thumbnailUrl: product.thumbnailUrl,
    fileUrl: product.fileUrl,
    isActive: product.isActive,
  }));

  return (
    <StorefrontClient
      user={serializedUser}
      links={serializedLinks}
      products={serializedProducts}
    />
  );
}
