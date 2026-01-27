// data/products.ts
export interface ProductColor {
  name: string;
  code: string;
  imageUrl: string;
}

export interface ProductSize {
  size: string;
  inStock: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  category: string;
  tags: string[];
  stock: number;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Elegant Summer Dress",
    price: 49.99,
    description: "A beautiful floral summer dress perfect for warm days. Made from breathable cotton with an elastic waistband for comfort.",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1200&fit=crop&crop=left"
    ],
    colors: [
      { name: "Coral Pink", code: "#FF7BA3", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop" },
      { name: "Sky Blue", code: "#7BC5FF", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop&brightness=0.9" },
      { name: "Mint Green", code: "#7BFFC5", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop&brightness=1.1" },
    ],
    sizes: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: false },
      { size: 'XL', inStock: true }
    ],
    category: 'dresses',
    tags: ['summer', 'floral', 'casual', 'new'],
    stock: 45,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: "Classic Denim Jacket",
    price: 79.99,
    description: "Timeless denim jacket with a modern fit. Perfect for layering over any outfit.",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1200&fit=crop&crop=top"
    ],
    colors: [
      { name: "Light Blue", code: "#8AB3E1", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop" },
      { name: "Dark Indigo", code: "#1C2B4D", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop&brightness=0.7" },
      { name: "Black", code: "#000000", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop&brightness=0.5" }
    ],
    sizes: [
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: false }
    ],
    category: 'jackets',
    tags: ['denim', 'casual', 'unisex', 'bestseller'],
    stock: 32,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    name: "Silk Evening Gown",
    price: 199.99,
    description: "Luxurious silk gown with intricate embroidery. Perfect for special occasions.",
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=1200&fit=crop&crop=right"
    ],
    colors: [
      { name: "Emerald Green", code: "#008450", imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=600&fit=crop" },
      { name: "Royal Blue", code: "#0056B3", imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=600&fit=crop&brightness=0.8" },
      { name: "Burgundy", code: "#800020", imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=600&fit=crop&brightness=0.7" }
    ],
    sizes: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: false },
      { size: 'L', inStock: true }
    ],
    category: 'dresses',
    tags: ['formal', 'evening', 'luxury', 'premium'],
    stock: 12,
    rating: 4.9,
    reviews: 56
  },
  {
    id: 4,
    name: "Casual Linen Shirt",
    price: 39.99,
    description: "Breathable linen shirt for everyday wear. Wrinkle-resistant fabric with a relaxed fit.",
    images: [
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&h=1200&fit=crop&crop=left"
    ],
    colors: [
      { name: "Cream", code: "#FFFDD0", imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=600&fit=crop" },
      { name: "Navy", code: "#000080", imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=600&fit=crop&brightness=0.7" },
      { name: "Olive", code: "#808000", imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=600&fit=crop&brightness=0.8" }
    ],
    sizes: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: true }
    ],
    category: 'shirts',
    tags: ['linen', 'casual', 'summer', 'comfort'],
    stock: 67,
    rating: 4.5,
    reviews: 203
  },
  {
    id: 5,
    name: "Designer Leather Handbag",
    price: 149.99,
    description: "Premium genuine leather handbag with multiple compartments and gold hardware.",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1200&fit=crop&crop=right"
    ],
    colors: [
      { name: "Chestnut Brown", code: "#954535", imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=600&fit=crop" },
      { name: "Black", code: "#000000", imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=600&fit=crop&brightness=0.6" },
      { name: "Burgundy", code: "#800020", imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=600&fit=crop&brightness=0.7" }
    ],
    sizes: [
      { size: 'One Size', inStock: true }
    ],
    category: 'accessories',
    tags: ['leather', 'designer', 'premium', 'handbag'],
    stock: 23,
    rating: 4.7,
    reviews: 78
  }
];