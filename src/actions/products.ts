"use server";

import { db } from "@/lib/db";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { Prisma } from "@prisma/client";
import type { ProductFilters, PaginatedResult, ProductWithImages, ProductListItem } from "@/types";

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResult<ProductListItem>> {
  const { category, fabric, occasion, minPrice, maxPrice, sort, search, page = 1 } = filters;
  const pageSize = ITEMS_PER_PAGE;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (category) {
    where.category = { slug: category };
  }

  if (fabric && fabric.length > 0) {
    where.fabric = { in: fabric as Prisma.EnumFabricFilter["in"] };
  }

  if (occasion && occasion.length > 0) {
    where.occasion = { hasSome: occasion as Prisma.EnumOccasionNullableListFilter["hasSome"] };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "popular":
      orderBy = { orderItems: { _count: "desc" } };
      break;
  }

  const [items, total] = await Promise.all([
    db.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        stock: true,
        fabric: true,
        color: true,
        isActive: true,
        isFeatured: true,
        isNewArrival: true,
        codAvailable: true,
        images: {
          select: { id: true, url: true, alt: true },
          orderBy: { position: "asc" },
          take: 2,
        },
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
  ]);

  return {
    items: items as unknown as ProductListItem[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasNext: page * pageSize < total,
    hasPrev: page > 1,
  };
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithImages | null> {
  return db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      reviews: {
        where: { isVisible: true },
        include: { user: { select: { name: true, phone: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  }) as unknown as ProductWithImages | null;
}

export async function getFeaturedProducts(limit = 8) {
  return db.product.findMany({
    where: { isActive: true, isFeatured: true },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      stock: true,
      fabric: true,
      color: true,
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      codAvailable: true,
      images: {
        select: { id: true, url: true, alt: true },
        orderBy: { position: "asc" },
        take: 1,
      },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getNewArrivals(limit = 8) {
  return db.product.findMany({
    where: { isActive: true, isNewArrival: true },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      stock: true,
      fabric: true,
      color: true,
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      codAvailable: true,
      images: {
        select: { id: true, url: true, alt: true },
        orderBy: { position: "asc" },
        take: 1,
      },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getBudgetProducts(maxPrice = 1500, limit = 8) {
  return db.product.findMany({
    where: { isActive: true, price: { lte: maxPrice } },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      stock: true,
      fabric: true,
      color: true,
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      codAvailable: true,
      images: {
        select: { id: true, url: true, alt: true },
        orderBy: { position: "asc" },
        take: 1,
      },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { price: "asc" },
    take: limit,
  });
}

export async function getCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
}

export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
  return db.product.findMany({
    where: {
      isActive: true,
      id: { not: productId },
      ...(categoryId ? { categoryId } : {}),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      stock: true,
      fabric: true,
      color: true,
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      codAvailable: true,
      images: {
        select: { id: true, url: true, alt: true },
        orderBy: { position: "asc" },
        take: 2,
      },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
