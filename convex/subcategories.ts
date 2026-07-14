import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";
import {
  PRODUCT_SUBCATEGORIES,
  SUBCATEGORY_PARENT_CATEGORIES,
  getParentProductCategory,
  getProductSubcategories,
} from "../shared/productSubcategories";

const parentCategories = new Set<string>(SUBCATEGORY_PARENT_CATEGORIES);

function validateName(name: string) {
  const value = name.trim();
  if (value.length < 2 || value.length > 60) throw new Error("Subcategory names must be 2 to 60 characters");
  return value;
}

function validateParentCategory(parentCategory: string) {
  if (!parentCategories.has(parentCategory)) throw new Error("Choose a valid parent category");
  return parentCategory;
}

function validateSortOrder(sortOrder: number) {
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 999) {
    throw new Error("Display order must be a whole number between 0 and 999");
  }
  return sortOrder;
}

function subcategoryView(subcategory: any) {
  return {
    id: subcategory._id,
    name: subcategory.name,
    parentCategory: subcategory.parentCategory,
    isActive: subcategory.isActive,
    sortOrder: subcategory.sortOrder,
    key: subcategory.key,
  };
}

function sortSubcategories(a: any, b: any) {
  return a.parentCategory.localeCompare(b.parentCategory)
    || a.sortOrder - b.sortOrder
    || a.name.localeCompare(b.name);
}

async function ensureUniqueName(ctx: any, name: string, parentCategory: string, excludeId?: any) {
  const duplicate = (await ctx.db
    .query("subcategories")
    .withIndex("by_parentCategory", (q: any) => q.eq("parentCategory", parentCategory))
    .collect())
    .find((subcategory: any) => subcategory._id !== excludeId && subcategory.name.toLowerCase() === name.toLowerCase());
  if (duplicate) throw new Error("That subcategory already exists under this parent category");
}

export const storefront = query({
  args: {},
  handler: async (ctx) => {
    const subcategories = await ctx.db.query("subcategories").collect();
    return {
      initialized: subcategories.some(subcategory => Boolean(subcategory.key)),
      items: subcategories
        .filter(subcategory => subcategory.isActive)
        .sort(sortSubcategories)
        .map(subcategoryView),
    };
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return (await ctx.db.query("subcategories").collect()).sort(sortSubcategories).map(subcategoryView);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    parentCategory: v.string(),
    isActive: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const name = validateName(args.name);
    const parentCategory = validateParentCategory(args.parentCategory);
    const sortOrder = validateSortOrder(args.sortOrder);
    await ensureUniqueName(ctx, name, parentCategory);
    return await ctx.db.insert("subcategories", { name, parentCategory, isActive: args.isActive, sortOrder });
  },
});

export const update = mutation({
  args: {
    id: v.id("subcategories"),
    name: v.string(),
    parentCategory: v.string(),
    isActive: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Subcategory not found");
    const name = validateName(args.name);
    const parentCategory = validateParentCategory(args.parentCategory);
    const sortOrder = validateSortOrder(args.sortOrder);
    await ensureUniqueName(ctx, name, parentCategory, args.id);

    if (parentCategory !== existing.parentCategory) {
      const mismatchedProduct = (await ctx.db.query("products").collect()).find(product =>
        product.subcategoryIds?.includes(args.id)
        && getParentProductCategory(product) !== parentCategory
      );
      if (mismatchedProduct) throw new Error(`Reassign ${mismatchedProduct.name} before changing this parent category`);
    }

    await ctx.db.patch(args.id, { name, parentCategory, isActive: args.isActive, sortOrder });
  },
});

export const remove = mutation({
  args: { id: v.id("subcategories") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Subcategory not found");
    const referencedProduct = (await ctx.db.query("products").collect())
      .find(product => product.subcategoryIds?.includes(args.id));
    if (referencedProduct) throw new Error(`Remove this subcategory from ${referencedProduct.name} before deleting it`);
    await ctx.db.delete(args.id);
  },
});

export const migrateExisting = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.query("subcategories").collect();
    const idsByKey = new Map<string, any>();
    let created = 0;

    for (const [parentCategory, options] of Object.entries(PRODUCT_SUBCATEGORIES)) {
      for (const [sortOrder, option] of options.entries()) {
        let match = existing.find(subcategory => subcategory.key === option.value)
          ?? existing.find(subcategory =>
            subcategory.parentCategory === parentCategory
            && subcategory.name.toLowerCase() === option.label.toLowerCase()
          );
        if (!match) {
          const id = await ctx.db.insert("subcategories", {
            name: option.label,
            parentCategory,
            isActive: true,
            sortOrder,
            key: option.value,
          });
          const inserted = await ctx.db.get(id);
          if (!inserted) throw new Error("Could not create subcategory");
          match = inserted;
          created++;
        } else if (!match.key) {
          await ctx.db.patch(match._id, { key: option.value });
        }
        if (match) idsByKey.set(option.value, match._id);
      }
    }

    let assigned = 0;
    let unassigned = 0;
    for (const product of await ctx.db.query("products").collect()) {
      if (product.subcategoryIds !== undefined) continue;
      const subcategoryIds = getProductSubcategories(product).flatMap(key => {
        const id = idsByKey.get(key);
        return id ? [id] : [];
      });
      await ctx.db.patch(product._id, { subcategoryIds });
      if (subcategoryIds.length) assigned++;
      else unassigned++;
    }

    return { created, assigned, unassigned };
  },
});
