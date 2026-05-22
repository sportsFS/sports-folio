export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
  badgeClass?: string;
}

export const allProducts: Product[] = [
  { id: 1, name: "SS Ton Player English Willow Bat", category: "bats", price: 5999, oldPrice: 7999, image: "/images/products/product.jpg", rating: 4.8, reviews: 256, badge: "Bestseller" },
  { id: 2, name: "MRF Genius Grand Edition Bat", category: "bats", price: 8499, oldPrice: 10999, image: "/images/products/product.jpg", rating: 4.9, reviews: 189, badge: "Premium" },
  { id: 3, name: "SG Sierra 250 Kashmir Willow Bat", category: "bats", price: 2499, oldPrice: 3499, image: "/images/products/product.jpg", rating: 4.5, reviews: 342, badge: "" },
  { id: 4, name: "Gray-Nicolls Powerbow 6X Bat", category: "bats", price: 12999, oldPrice: 15999, image: "/images/products/product.jpg", rating: 4.9, reviews: 98, badge: "Pro" },
  { id: 5, name: "Kookaburra Ghost Pro Bat", category: "bats", price: 9999, oldPrice: 12499, image: "/images/products/product.jpg", rating: 4.7, reviews: 134, badge: "" },
  { id: 6, name: "DSC Condor Flite English Willow", category: "bats", price: 4299, oldPrice: 5499, image: "/images/products/product.jpg", rating: 4.6, reviews: 201, badge: "Hot", badgeClass: "hot" },
  { id: 7, name: "SG Test Match Red Leather Ball", category: "balls", price: 899, oldPrice: 1199, image: "/images/products/product.jpg", rating: 4.7, reviews: 567, badge: "Bestseller" },
  { id: 8, name: "Kookaburra Turf White Ball", category: "balls", price: 1299, oldPrice: 1599, image: "/images/products/product.jpg", rating: 4.6, reviews: 389, badge: "" },
  { id: 9, name: "SG Club Tennis Cricket Ball (Pack of 6)", category: "balls", price: 499, oldPrice: 699, image: "/images/products/product.jpg", rating: 4.4, reviews: 812, badge: "Value" },
  { id: 10, name: "SS Academy Batting Pads", category: "protection", price: 1899, oldPrice: 2499, image: "/images/products/product.jpg", rating: 4.5, reviews: 234, badge: "" },
  { id: 11, name: "SG Optipro Batting Gloves", category: "protection", price: 1299, oldPrice: 1799, image: "/images/products/product.jpg", rating: 4.6, reviews: 345, badge: "" },
  { id: 12, name: "SS Prince Helmet - Steel Grille", category: "protection", price: 2999, oldPrice: 3999, image: "/images/products/product.jpg", rating: 4.8, reviews: 178, badge: "Safety" },
  { id: 13, name: "DSC Intense Shoc Thigh Guard", category: "protection", price: 799, oldPrice: 999, image: "/images/products/product.jpg", rating: 4.3, reviews: 156, badge: "" },
  { id: 14, name: "GM Original Wicket Keeping Gloves", category: "protection", price: 2499, oldPrice: 3199, image: "/images/products/product.jpg", rating: 4.7, reviews: 123, badge: "Pro" },
  { id: 15, name: "Adidas Howzat Full Spike Shoes", category: "footwear", price: 4999, oldPrice: 6499, image: "/images/products/product.jpg", rating: 4.6, reviews: 267, badge: "" },
  { id: 16, name: "Puma Cricket 22 FH Shoes", category: "footwear", price: 3499, oldPrice: 4499, image: "/images/products/product.jpg", rating: 4.5, reviews: 198, badge: "" },
  { id: 17, name: "New Balance CK4040 Spike Shoes", category: "footwear", price: 7999, oldPrice: 9999, image: "/images/products/product.jpg", rating: 4.9, reviews: 89, badge: "Premium" },
  { id: 18, name: "SS Cricket Kit Bag Gladiator", category: "accessories", price: 3299, oldPrice: 4199, image: "/images/products/product.jpg", rating: 4.5, reviews: 234, badge: "" },
  { id: 19, name: "SG Bat Grip Chevron (Pack of 3)", category: "accessories", price: 299, oldPrice: 399, image: "/images/products/product.jpg", rating: 4.4, reviews: 678, badge: "Value" },
  { id: 20, name: "SS Stumps Set with Bails", category: "accessories", price: 1499, oldPrice: 1999, image: "/images/products/product.jpg", rating: 4.6, reviews: 145, badge: "" },
];
