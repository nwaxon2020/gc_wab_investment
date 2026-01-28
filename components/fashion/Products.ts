import { tr } from "framer-motion/client";

// data/products.ts
export interface Review {
  id: string;
  authorId?: string;
  name: string;
  comment: string;
  date: string;
}

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
  colors: ProductColor[]; // Images are now exclusively here
  sizes: ProductSize[];
  category: string;
  tags: string[];
  stock: number;
  likes: number;
  reviews: Review[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Elegant Summer Dress",
    price: 4900.00,
    description: "A beautiful floral summer dress perfect for warm days. Made from breathable cotton with an elastic waistband for comfort.",
    colors: [
      { name: "Coral Pink", code: "#FF7BA3", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1200&fit=crop" },
      { name: "Sky Blue", code: "#7BC5FF", imageUrl: "https://www.simpleprom-dresses.com/cdn/shop/files/42LMRNF_I_SSDK_S_B_UKE.png?v=1704417267&width=1445" },
      { name: "Mint Green", code: "#1a2c20", imageUrl: "https://media.istockphoto.com/id/1303623997/photo/woman-black-dress-fashion-elegant-lady-in-hat-model-silhouette-in-evening-long-black-gown.jpg?s=612x612&w=0&k=20&c=JfAR1P_iyzf_suo2PGmq2uL10Y8cB9a8R_DAkqhoiUQ=" },
    ],
    sizes: [{ size: 'XS', inStock: true }, { size: 'S', inStock: true }, { size: 'M', inStock: true }, { size: 'L', inStock: false }, { size: 'XL', inStock: true }],
    category: 'dresses',
    tags: ['summer', 'floral', 'casual', 'new'],
    stock: 45,
    likes: 148,
    reviews: [{ id: 'r1', name: 'Amaka', comment: 'Perfect for the Lagos sun!', date: '2026-01-20' }]
  },
  {
    id: 2,
    name: "Classic Denim Jacket",
    price: 7950.50,
    description: "Timeless denim jacket with a modern fit. Perfect for layering over any outfit.",
    colors: [
      { name: "Light Blue", code: "#8AB3E1", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800" },
      { name: "Red", code: "#da1a1a", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvGzNK32uf6YYnJetpwY6_33L6M9cpG07voQ&s" }

    ],
    sizes: [{ size: 'M', inStock: true }, { size: 'L', inStock: true }],
    category: 'jackets',
    tags: ['denim', 'bestseller'],
    stock: 32,
    likes: 605,
    reviews: [{ id: 'r2', name: 'Tunde', comment: 'Quality is really good.', date: '2026-01-22' }]
  },
  {
    id: 3,
    name: "Silk Evening Gown",
    price: 1999.99,
    description: "Luxurious silk gown with intricate embroidery. Perfect for special occasions.",
    colors: [
      { name: "Sky Blue", code: "#8AB3E1", imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800" }
    ],
    sizes: [{ size: 'S', inStock: true }, { size: 'M', inStock: false }],
    category: 'dresses',
    tags: ['formal', 'luxury'],
    stock: 12,
    likes: 401,
    reviews: [{ id: 'r3', name: 'Ngozi', comment: 'Elegant and classy.', date: '2026-01-24' }]
  },
  {
    id: 4,
    name: "Casual Linen Shirt",
    price: 390.99,
    description: "Breathable linen shirt for everyday wear.",
    colors: [
      { name: "Cream", code: "#FFFDD0", imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800" },
      { name: "Yellow", code: "#f0e406", imageUrl: "https://media.istockphoto.com/id/1136908898/photo/yellow-shirt-design-template.jpg?s=612x612&w=0&k=20&c=W1_OeTl1vJh_F5c8w3UOrvNJqV0lSTKep8xY_sE6ybY=" },
      { name: "Gray", code: "#686863", imageUrl: "https://media.istockphoto.com/id/1134011734/photo/mens-grey-blank-t-shirt-template-from-two-sides-natural-shape-on-invisible-mannequin-for-your.jpg?s=612x612&w=0&k=20&c=pYSbXt4B308_BLGvLxNjRe_2zKBmF0GMN-QCBAtbMhc=" },
      { name: "Black", code: "#000", imageUrl: "https://t4.ftcdn.net/jpg/07/09/49/71/360_F_709497194_IvwpO1Tav6o66hfUwYrR8yZIQMf2JUeP.jpg" },
    ],
    sizes: [{ size: 'M', inStock: true }],
    category: 'shirts',
    tags: ['linen', 'summer'],
    stock: 67,
    likes: 45,
    reviews: [{ id: 'r4', name: 'Ahmed', comment: 'Very comfortable.', date: '2026-01-25' }]
  },
  {
    id: 5,
    name: "Designer Leather Handbag",
    price: 14250.00,
    description: "Premium genuine leather handbag.",
    colors: [
      { name: "Black", code: "#000000", imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800" }
    ],
    sizes: [{ size: 'One Size', inStock: true }],
    category: 'bags',
    tags: ['Shoes', 'Leather'],
    stock: 23,
    likes: 371,
    reviews: [
      { id: 'r5', name: 'Ify', comment: 'Pure luxury.', date: '2026-01-26' },
      { id: 'r6', name: 'Gladis', comment: 'Great Texture of fabric.', date: '2025-10-21' }
    ]
  },
  {
    id: 6,
    name: "TimberLand Boot",
    price: 149900.00,
    description: "Premium genuine leather Shoe.",
    colors: [
      { name: "Brown", code: "#da981e", imageUrl: "https://thumbs.dreamstime.com/b/brown-warm-mountain-winter-timberland-tracking-shoes-boots-sneakers-trainers-wooden-background-sport-casual-brown-warm-mountain-346042157.jpg" },
      { name: "Gray", code: "#746565", imageUrl: "https://assets.timberland.com/images/t_img/f_auto,h_340,e_sharpen:60,w_340/dpr_2.0/v1744044793/TB0A6CW1A4O-HERO/Mens-GreenStride-Motion-6-Sneaker.png" },
      { name: "Dark Brown", code: "#f57905", imageUrl: "https://assets.timberland.com/images/t_img/f_auto,h_650,e_sharpen:60,w_650/dpr_2.0/v1738621051/TB0A6BXEEM6-ALT4/Mens-Parker-Street-HighTop-Sneaker.png" },
    ],
     sizes: [{ size: '32', inStock: true }, { size: '38', inStock: true }, { size: '41', inStock: true }, { size: '42', inStock: false }, { size: '45', inStock: true }],
    category: 'Shoes',
    tags: ['leather', 'premium'],
    stock: 23,
    likes: 371,
    reviews: [
      { id: 'r5', name: 'Ify', comment: 'Pure luxury.', date: '2026-01-26' },
      { id: 'r6', name: 'Gladis', comment: 'Great Texture of fabric.', date: '2025-10-21' }
    ]
  },
  {
    id: 7,
    name: "Designer Bra",
    price: 8300.00,
    description: "Premium genuine Bra.",
    colors: [
      { name: "Black", code: "#000000", imageUrl: "https://www.shutterstock.com/image-photo/confident-beautiful-young-asian-woman-600nw-2622667259.jpg" },
      { name: "White", code: "#f1e9e9", imageUrl: "https://s.alicdn.com/@sc04/kf/H68f0590a058c4b4d83a9c68930a8b814U/Lace-Bra-Manufacturer-Weiyesi-ODM-Lacy-Girls-Push-up-Bra-and-Panty-Hot-Sexy-Thong-Photo-White-Lace-Girls-Transparent-Panty-Set.jpg" }
    ],
     sizes: [{ size: 'XS', inStock: true }, { size: 'S', inStock: true }, { size: 'M', inStock: true }, { size: 'L', inStock: true }, { size: 'XL', inStock: true }],
    category: 'Bra',
    tags: ['leather', 'premium'],
    stock: 23,
    likes: 371,
    reviews: [
      { id: 'r5', name: 'Ify', comment: 'Pure luxury.', date: '2026-01-26' },
      { id: 'r6', name: 'Gladis', comment: 'Great Texture of fabric.', date: '2025-10-21' }
    ]
  },
  {
    id: 8,
    name: "Designer Men Suits",
    price: 97000.00,
    description: "Premium leather Men Suit.",
    colors: [
      { name: "Black", code: "#000000", imageUrl: "https://img.freepik.com/free-psd/realistic-suit-illustration_23-2151236795.jpg" },
      { name: "Dark Green", code: "#0a4d07", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZVxfOZFtyJIqz-Jw7F7xsZKeYcYzit_M_CQ&s" },
      { name: "Brown", code: "#6b4007", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTUBEEco-sTzijLY9FE2wNhkpVAPFaMy3EBw&s"}
    ],
     sizes: [{ size: 'XS', inStock: true }, { size: 'S', inStock: true }, { size: 'M', inStock: true }, { size: 'L', inStock: true }, { size: 'XL', inStock: true }],
    category: 'Suits',
    tags: ['leather', 'premium', 'suits'],
    stock: 23,
    likes: 371,
    reviews: [
      { id: 'r5', name: 'Ify', comment: 'Pure luxury.', date: '2026-01-26' },
      { id: 'r6', name: 'Gladis', comment: 'Great Texture of fabric.', date: '2025-10-21' }
    ]
  },
  {
    id: 9,
    name: "12 Karat Gold Wrist Watch Set",
    price: 78000.00,
    description: "Best selling Gold Wriste watch and Bracelet.",
    colors: [
      { name: "Gold", code: "#b4b10c", imageUrl: "https://media.istockphoto.com/id/471712723/photo/watch.jpg?s=612x612&w=0&k=20&c=iMEdtY6uP3iFURngL9qAzzMnWYSkPmHrxIlYIEfduvM=" },
      { name: "Gold", code: "#b4b10c", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH7f_vqzbxzc6kjTuL6dsXGXlgmRL-143WpA&s" }
    ],
    sizes: [{ size: 'One Size', inStock: true }],
    category: 'Wrist Watch',
    tags: ['wrist watch', 'premium', "fine"],
    stock: 23,
    likes: 371,
    reviews: [
      { id: 'r5', name: 'Ify', comment: 'Pure luxury.', date: '2026-01-26' },
      { id: 'r6', name: 'Gladis', comment: 'Great Texture of fabric.', date: '2025-10-21' }
    ]
  },
  {
    id: 10,
    name: "Italian Gown",
    price: 420700.00,
    description: "Italian Original Trade mark dress.",
    colors: [
      { name: "Blue", code: "#1d28b9", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSntLZ_OgH6lJ8IhC7KNKCgkxqizLvQGlUgfQ&s" }
    ],
    sizes: [{ size: 'One Size', inStock: true }],
    category: 'Dresses',
    tags: ['Fabric', 'Cotton'],
    stock: 23,
    likes: 371,
    reviews: [
      { id: 'r5', name: 'Ify', comment: 'Pure luxury.', date: '2026-01-26' },
      { id: 'r6', name: 'Gladis', comment: 'Great Texture of fabric.', date: '2025-10-21' }
    ]
  },
  {
    id: 11,
    name: "Vintage Men Shirt",
    price: 35000.00,
    description: "Premium genuine leather handbag.",
    colors: [
      { name: "Black & Brown", code: "#000000", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ92_B6aqhvlPsNq7nvscFR5hIiWht1TC85Kw&s" },
      { name: "Blue & White", code: "#9da9cf", imageUrl: "https://www.cartrollers.com/wp-content/uploads/2022/05/HIGH-QUALITY-DESIGNER-VINTAGE-SHIRT.jpeg" },
      { name: "Brownish", code: "#4b3007", imageUrl: "https://s.alicdn.com/@sc04/kf/H9688fda32cdf49ea98fd266227f32edbF/High-Quality-Vintage-Bohemian-Ethnic-Print-Long-Sleeve-Casual-Street-Wear-with-Lapel-Buttons-Oversized-Fit-Men-s-t-Shirt.jpg_300x300.jpg" },
      { name: "Black & Gold", code: "#0000", imageUrl: "https://i.ebayimg.com/images/g/pFUAAOSwPCdmMdOi/s-l400.png" }
    ],
     sizes: [{ size: 'XS', inStock: true }, { size: 'S', inStock: false }, { size: 'M', inStock: true }, { size: 'L', inStock: false }, { size: 'XL', inStock: true }],
    category: 'Shirts',
    tags: ['Shirts', 'Men'],
    stock: 23,
    likes: 371,
    reviews: [
      { id: 'r5', name: 'Ify', comment: 'Pure luxury.', date: '2026-01-26' },
      { id: 'r6', name: 'Gladis', comment: 'Great Texture of fabric.', date: '2025-10-21' }
    ]
  },
  {
    id: 12,
    name: "Wedding Dress",
    price: 850000.00,
    description: "Perfect wedding Dress.",
    colors: [
      { name: "White", code: "#c7b1b1", imageUrl: "https://usercontent.one/wp/loveweddingsng.com/wp-content/uploads/2020/04/Ebere-Alozie-and-Raphael-Nwojos-Nigerian-White-Wedding-in-Houston-LoveWeddingsNG-6.png" }
    ],
    sizes: [{ size: 'One Size', inStock: true }],
    category: 'Dresses',
    tags: ['Wedding', 'Cloth', 'Style'],
    stock: 23,
    likes: 371,
    reviews: [
      { id: 'r5', name: 'Ify', comment: 'Pure luxury.', date: '2026-01-26' },
      { id: 'r6', name: 'Gladis', comment: 'Great Texture of fabric.', date: '2025-10-21' }
    ]
  },
];