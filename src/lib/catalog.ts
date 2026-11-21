import type { GarmentKind } from "@/components/ui/product-rail-gallery";

export type CategorySlug = "men" | "women" | "kids" | "accessories";
export interface Colorway { name: string; hex: string }
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: CategorySlug;
  price: number; // paise
  compareAt?: number;
  fabric: string;
  fit: string;
  kind: GarmentKind;
  colors: Colorway[];
  sizes: string[];
  stock: number;
  featured: boolean;
  isNew: boolean;
  popularity: number;
}

export const CATEGORIES: { slug: CategorySlug; name: string }[] = [
  { slug: "men", name: "Men" },
  { slug: "women", name: "Women" },
  { slug: "kids", name: "Kids" },
  { slug: "accessories", name: "Accessories" },
];

const A = ["XS", "S", "M", "L", "XL"];
const K = ["2-3Y", "4-5Y", "6-7Y", "8-9Y"];
const ONE = ["One size"];

type Seed = Omit<Product, "id" | "slug">;
const seed: Seed[] = [
  { name: "Everyday Supima Tee", description: "A dense, smooth crew-neck tee that keeps its shape wash after wash.", category: "men", price: 129900, fabric: "Supima cotton jersey, 200 gsm", fit: "Regular", kind: "tee", colors: [{ name: "Ink", hex: "#23262B" }, { name: "Bone", hex: "#E9E3D6" }, { name: "Olive", hex: "#4A5A3C" }], sizes: A, stock: 42, featured: true, isNew: false, popularity: 98 },
  { name: "Merino Crew Knit", description: "Fine-gauge merino with a soft hand and gentle drape. Warm without bulk.", category: "men", price: 349900, compareAt: 399900, fabric: "Extra-fine merino wool", fit: "Regular", kind: "knit", colors: [{ name: "Charcoal", hex: "#3B3D40" }, { name: "Oat", hex: "#D9CDB6" }], sizes: A, stock: 14, featured: true, isNew: true, popularity: 90 },
  { name: "Loopback Hoodie", description: "Heavy loopback cotton, double-layer hood and a clean kangaroo pocket.", category: "men", price: 279900, fabric: "Organic cotton loopback, 380 gsm", fit: "Relaxed", kind: "hoodie", colors: [{ name: "Moss", hex: "#5B6B47" }, { name: "Heather", hex: "#9C9A96" }], sizes: A, stock: 20, featured: true, isNew: false, popularity: 88 },
  { name: "Oxford Button-Down", description: "Crisp oxford cloth with a soft-roll collar. Gets better with every wear.", category: "men", price: 249900, fabric: "Cotton oxford", fit: "Tailored", kind: "shirt", colors: [{ name: "Sky", hex: "#B9CCE0" }, { name: "White", hex: "#F4F2EC" }], sizes: A, stock: 30, featured: true, isNew: false, popularity: 84 },
  { name: "Waxed Field Jacket", description: "Water-resistant waxed cotton with corduroy collar and four utility pockets.", category: "men", price: 499900, fabric: "Waxed cotton canvas", fit: "Regular", kind: "jacket", colors: [{ name: "Olive", hex: "#4A5A3C" }, { name: "Tobacco", hex: "#7A5534" }], sizes: A, stock: 6, featured: true, isNew: true, popularity: 76 },
  { name: "Wool Topcoat", description: "Single-breasted wool-blend topcoat cut just above the knee.", category: "men", price: 499900, fabric: "Italian wool blend", fit: "Tailored", kind: "coat", colors: [{ name: "Charcoal", hex: "#34363A" }, { name: "Camel", hex: "#B08A5E" }], sizes: A, stock: 9, featured: false, isNew: false, popularity: 70 },
  { name: "Linen Camp Shirt", description: "Breezy washed linen with a relaxed camp collar for warm days.", category: "men", price: 219900, fabric: "Washed European linen", fit: "Relaxed", kind: "shirt", colors: [{ name: "Sand", hex: "#D8C7A8" }, { name: "Sage", hex: "#A3B09A" }], sizes: A, stock: 0, featured: false, isNew: true, popularity: 65 },
  { name: "Pocket Tee", description: "Slightly heavier jersey with a single chest pocket.", category: "men", price: 99900, fabric: "Combed cotton jersey, 220 gsm", fit: "Regular", kind: "tee", colors: [{ name: "Rust", hex: "#B5552F" }, { name: "Navy", hex: "#2A3448" }], sizes: A, stock: 50, featured: false, isNew: false, popularity: 60 },

  { name: "Boxy Cotton Tee", description: "Cropped, boxy and soft. The tee you will reach for first.", category: "women", price: 109900, fabric: "Organic cotton jersey", fit: "Boxy", kind: "tee", colors: [{ name: "Bone", hex: "#ECE6DA" }, { name: "Terracotta", hex: "#B9643F" }], sizes: A, stock: 36, featured: true, isNew: true, popularity: 95 },
  { name: "Cashmere-Blend Sweater", description: "A cloud-soft crew in a cashmere blend with ribbed cuffs.", category: "women", price: 429900, compareAt: 489900, fabric: "Cashmere & merino blend", fit: "Relaxed", kind: "knit", colors: [{ name: "Cream", hex: "#EFE7D6" }, { name: "Dusk", hex: "#8E7A86" }], sizes: A, stock: 11, featured: true, isNew: false, popularity: 93 },
  { name: "Poplin Shirt", description: "Light cotton poplin with a longer back hem. Tuck it or wear it loose.", category: "women", price: 239900, fabric: "Cotton poplin", fit: "Oversized", kind: "shirt", colors: [{ name: "White", hex: "#F5F3EE" }, { name: "Stripe Blue", hex: "#9FB3CC" }], sizes: A, stock: 25, featured: true, isNew: false, popularity: 80 },
  { name: "Cropped Denim Jacket", description: "Rigid denim that softens to you, in a cropped, easy shape.", category: "women", price: 389900, fabric: "Japanese selvedge denim", fit: "Cropped", kind: "jacket", colors: [{ name: "Indigo", hex: "#34476B" }, { name: "Ecru", hex: "#E3DAC5" }], sizes: A, stock: 4, featured: false, isNew: true, popularity: 78 },
  { name: "Wrap Coat", description: "A belted wrap coat in brushed wool with deep pockets.", category: "women", price: 499900, fabric: "Brushed wool blend", fit: "Relaxed", kind: "coat", colors: [{ name: "Camel", hex: "#B58B5B" }, { name: "Black", hex: "#1F1F21" }], sizes: A, stock: 7, featured: true, isNew: false, popularity: 82 },
  { name: "Fleece Hoodie", description: "Brushed-back fleece in a slightly cropped length.", category: "women", price: 249900, fabric: "Cotton fleece, 340 gsm", fit: "Regular", kind: "hoodie", colors: [{ name: "Blush", hex: "#D9B3A6" }, { name: "Stone", hex: "#B8B2A6" }], sizes: A, stock: 18, featured: false, isNew: false, popularity: 66 },
  { name: "Ribbed Long Sleeve", description: "Stretch rib that holds close without clinging.", category: "women", price: 149900, fabric: "Modal rib", fit: "Slim", kind: "knit", colors: [{ name: "Espresso", hex: "#4A3427" }, { name: "Ivory", hex: "#F1ECE1" }], sizes: A, stock: 28, featured: false, isNew: true, popularity: 62 },
  { name: "Khadi Kurta Shirt", description: "Handspun khadi in a modern shirt cut with a mandarin collar.", category: "women", price: 199900, fabric: "Handspun khadi cotton", fit: "Relaxed", kind: "shirt", colors: [{ name: "Indigo", hex: "#3E4C7A" }, { name: "Natural", hex: "#E2D6BF" }], sizes: A, stock: 15, featured: false, isNew: false, popularity: 72 },

  { name: "Mini Everyday Tee", description: "Soft, durable tees made for playground days.", category: "kids", price: 59900, fabric: "Organic cotton jersey", fit: "Regular", kind: "tee", colors: [{ name: "Sun", hex: "#E3B54B" }, { name: "Sky", hex: "#9CC0DA" }], sizes: K, stock: 40, featured: false, isNew: false, popularity: 70 },
  { name: "Little Fleece Hoodie", description: "Cosy fleece hoodie with easy snap shoulders.", category: "kids", price: 129900, fabric: "Cotton fleece", fit: "Relaxed", kind: "hoodie", colors: [{ name: "Sage", hex: "#8FA07E" }, { name: "Berry", hex: "#9C4B5E" }], sizes: K, stock: 22, featured: true, isNew: true, popularity: 74 },
  { name: "Puffer Jacket", description: "Lightweight recycled-fill puffer that packs into its own pocket.", category: "kids", price: 219900, fabric: "Recycled nylon, recycled fill", fit: "Regular", kind: "jacket", colors: [{ name: "Tomato", hex: "#C2523C" }, { name: "Navy", hex: "#283247" }], sizes: K, stock: 3, featured: false, isNew: false, popularity: 58 },
  { name: "Chambray Shirt", description: "A tiny version of a classic, in soft chambray.", category: "kids", price: 99900, fabric: "Cotton chambray", fit: "Regular", kind: "shirt", colors: [{ name: "Chambray", hex: "#8FA3BF" }], sizes: K, stock: 17, featured: false, isNew: false, popularity: 50 },
  { name: "Cable Knit Cardigan", description: "Chunky cables and wooden-look buttons.", category: "kids", price: 159900, fabric: "Cotton & wool blend", fit: "Regular", kind: "knit", colors: [{ name: "Oat", hex: "#D8CCB4" }, { name: "Forest", hex: "#3F5544" }], sizes: K, stock: 12, featured: false, isNew: true, popularity: 55 },

  { name: "Merino Scarf", description: "Generously sized merino scarf with fringed ends.", category: "accessories", price: 149900, fabric: "Merino wool", fit: "One size", kind: "knit", colors: [{ name: "Charcoal", hex: "#3A3B3D" }, { name: "Rust", hex: "#A9532F" }], sizes: ONE, stock: 30, featured: false, isNew: false, popularity: 68 },
  { name: "Canvas Overshirt", description: "A sturdy canvas layer that works as a light jacket.", category: "accessories", price: 289900, fabric: "Cotton canvas", fit: "Relaxed", kind: "jacket", colors: [{ name: "Khaki", hex: "#A89A72" }], sizes: A, stock: 10, featured: false, isNew: false, popularity: 57 },
  { name: "Lounge Tee", description: "Slubby, airy and made for slow Sundays.", category: "accessories", price: 49900, compareAt: 79900, fabric: "Slub cotton", fit: "Relaxed", kind: "tee", colors: [{ name: "Ash", hex: "#BDB8AF" }], sizes: A, stock: 60, featured: false, isNew: false, popularity: 52 },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const PRODUCTS: Product[] = seed.map((p, i) => ({ ...p, id: `p${String(i + 1).padStart(2, "0")}`, slug: slugify(p.name) }));

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const ALL_COLORS = Array.from(new Map(PRODUCTS.flatMap((p) => p.colors).map((c) => [c.name, c])).values());
export const ALL_SIZES = Array.from(new Set(PRODUCTS.flatMap((p) => p.sizes)));
export const MAX_PRICE = Math.max(...PRODUCTS.map((p) => p.price));
