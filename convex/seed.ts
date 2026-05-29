import { mutation } from "./_generated/server";
import { hashPassword } from "./crypto";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", "admin@sportsfolio.com"))
      .first();
    if (existing) return;

    const hashed = await hashPassword("admin123");
    await ctx.db.insert("users", {
      name: "Admin",
      email: "admin@sportsfolio.com",
      password: hashed,
      role: "admin",
    });

    const products = [
      { name: "SS Ton Player Cricket Bat", price: 199, oldPrice: 249, image: "/images/products/product.jpg", category: "bats", rating: 4.8, reviews: 256, badge: "Bestseller", description: "Premium Kashmir willow bat with balanced pickup." },
      { name: "MRF Genius Grand Cricket Bat", price: 349, image: "/images/products/product.jpg", category: "bats", rating: 4.9, reviews: 189, badge: "Premium", description: "Top-grade English willow. Used by professionals." },
      { name: "Gray-Nicolls Kaboom Bat", price: 279, image: "/images/products/product.jpg", category: "bats", rating: 4.7, reviews: 134, description: "Power-packed bat with large sweet spot." },
      { name: "Kookaburra Kahuna Bat", price: 319, image: "/images/products/product.jpg", category: "bats", rating: 4.6, reviews: 98, description: "Professional grade bat for competitive play." },
      { name: "GM Purist Cricket Bat", price: 259, image: "/images/products/product.jpg", category: "bats", rating: 4.8, reviews: 201, description: "Hand-crafted with premium willow." },
      { name: "SG Test Cricket Bat", price: 229, image: "/images/products/product.jpg", category: "bats", rating: 4.5, reviews: 342, description: "Durable and lightweight. Great for all formats." },
      { name: "Dukes Crown Cricket Ball", price: 29, image: "/images/products/product.jpg", category: "balls", rating: 4.7, reviews: 567, badge: "Bestseller", description: "Premium hand-stitched leather ball." },
      { name: "SG Club Cricket Ball", price: 19, image: "/images/products/product.jpg", category: "balls", rating: 4.5, reviews: 812, badge: "Value", description: "Durable machine-stitched ball for practice." },
      { name: "Kookaburra Turf Ball", price: 35, image: "/images/products/product.jpg", category: "balls", rating: 4.8, reviews: 389, description: "Official match ball used in professional cricket." },
      { name: "SS Pro Pad", price: 89, image: "/images/products/product.jpg", category: "protection", rating: 4.6, reviews: 234, description: "High-impact protection with comfortable fit." },
      { name: "Gray-Nicolls Velocity Gloves", price: 69, image: "/images/products/product.jpg", category: "protection", rating: 4.7, reviews: 345, description: "Premium batting gloves with maximum flexibility." },
      { name: "Shrey Helmet", price: 129, image: "/images/products/product.jpg", category: "protection", rating: 4.8, reviews: 178, description: "Lightweight titanium grill helmet." },
      { name: "SG Arm Guard", price: 49, image: "/images/products/product.jpg", category: "protection", rating: 4.4, reviews: 156, description: "Comfortable arm protection for batting." },
      { name: "SS Abdominal Guard", price: 39, image: "/images/products/product.jpg", category: "protection", rating: 4.5, reviews: 123, description: "Essential protection with ergonomic design." },
      { name: "Nike Air Zoom Cricket Shoes", price: 149, image: "/images/products/product.jpg", category: "footwear", rating: 4.8, reviews: 267, description: "Professional-grade shoes with superior grip." },
      { name: "Adidas Adipower Shoes", price: 159, image: "/images/products/product.jpg", category: "footwear", rating: 4.7, reviews: 198, description: "Lightweight and durable bowling shoes." },
      { name: "SG Cricket Shoes", price: 99, image: "/images/products/product.jpg", category: "footwear", rating: 4.5, reviews: 89, description: "Comfortable all-round cricket shoes." },
      { name: "Puma Cricket Kit Bag", price: 119, image: "/images/products/product.jpg", category: "accessories", rating: 4.6, reviews: 234, description: "Spacious bag with multiple compartments." },
      { name: "Gray-Nicolls Bat Grip", price: 12, image: "/images/products/product.jpg", category: "accessories", rating: 4.4, reviews: 678, badge: "Value", description: "Comfortable grip for better bat control." },
      { name: "SG Wicket Keeping Gloves", price: 79, image: "/images/products/product.jpg", category: "accessories", rating: 4.5, reviews: 145, description: "Professional keeping gloves with excellent padding." },
    ];

    for (const product of products) {
      await ctx.db.insert("products", product);
    }
  },
});
