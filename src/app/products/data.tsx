/**
 * Defines the strategic classification of a product,
 * typically based on consumer buying behavior and marketing considerations.
 */
type ProductClassification =
  "Convenience Good" |
  "Shopping Good" |
  "Specialty Good" |
  "Unsought Good";

/**
 * Represents geographical coordinates, useful for locating items in a store.
 */
interface Coordinates {
  x: number; // e.g., aisle number, section
  y: number; // e.g., shelf height, specific bay
}

/**
 * Represents a product, combining its classification and other inventory-related information.
 */
interface Product {
  id: string;
  name: string;
  classification: ProductClassification;
  quantity: number; // Current stock quantity
  available: boolean; // Is the product currently available for purchase?
  supplier: string; // The supplier of the product
  coordinates: Coordinates; // Location of the product in the store (e.g., aisle/shelf)
  price: number;
  description?: string; // Optional description
  dateAdded: string; // Date when product was added to inventory (ISO format)
  discount: number; // Discount percentage (0-100)
  image: string; // URL or path to product image
  expirationDate: string | null; // Expiration date (ISO format), null for non-perishable items
}

const products: Product[] = [
  {
    id: "RICE001",
    name: "Jasmine Rice 5kg",
    classification: "Convenience Good",
    quantity: 200,
    available: true,
    supplier: "Local Rice Millers Inc.",
    coordinates: { x: 5, y: 1 }, // Aisle 5, bottom shelf
    price: 350.00, // PHP
    description: "Premium fragrant Jasmine rice, a staple in Filipino households.",
    dateAdded: "2024-12-15T08:30:00.000Z",
    discount: 5,
    image: "/images/products/jasmine-rice-5kg.jpg",
    expirationDate: "2026-12-15T00:00:00.000Z" // Rice: ~2 years shelf life
  },
  {
    id: "NOODLE003",
    name: "Lucky Me! Pancit Canton (Original)",
    classification: "Convenience Good",
    quantity: 150,
    available: true,
    supplier: "Monde Nissin Corporation",
    coordinates: { x: 7, y: 2 }, // Aisle 7, middle shelf
    price: 15.00, // PHP
    description: "Instant noodles, a quick and popular snack or meal.",
    dateAdded: "2024-11-20T14:15:00.000Z",
    discount: 0,
    image: "/images/products/lucky-me-pancit-canton.jpg",
    expirationDate: "2025-11-20T00:00:00.000Z" // Instant noodles: ~1 year shelf life
  },
  {
    id: "FISHSAUCE001",
    name: "Datu Puti Patis 1L",
    classification: "Convenience Good",
    quantity: 80,
    available: true,
    supplier: "NutriAsia Inc.",
    coordinates: { x: 9, y: 3 }, // Aisle 9, eye-level shelf
    price: 90.00, // PHP
    description: "High-quality fish sauce, essential for Filipino cuisine.",
    dateAdded: "2025-01-05T10:45:00.000Z",
    discount: 0,
    image: "/images/products/datu-puti-patis-1l.jpg",
    expirationDate: "2027-01-05T00:00:00.000Z" // Fish sauce: ~2 years shelf life
  },
  {
    id: "COFFEE002",
    name: "Nescafe Classic 100g",
    classification: "Convenience Good",
    quantity: 120,
    available: true,
    supplier: "Nestle Philippines",
    coordinates: { x: 10, y: 2 }, // Aisle 10, middle shelf
    price: 120.00, // PHP
    description: "Instant coffee, a popular choice for daily consumption.",
    dateAdded: "2024-10-30T16:20:00.000Z",
    discount: 10,
    image: "/images/products/nescafe-classic-100g.jpg",
    expirationDate: "2026-10-30T00:00:00.000Z" // Instant coffee: ~2 years shelf life
  },
  {
    id: "MANGO005",
    name: "Fresh Carabao Mangoes (per kg)",
    classification: "Shopping Good", // Consumers might compare ripeness/size
    quantity: 30,
    available: true,
    supplier: "Local Farmers Cooperative",
    coordinates: { x: 1, y: 1 }, // Produce section, top bin
    price: 180.00, // PHP
    description: "Sweet and juicy Carabao mangoes, a national fruit.",
    dateAdded: "2025-08-10T06:00:00.000Z",
    discount: 15,
    image: "/images/products/carabao-mangoes.jpg",
    expirationDate: "2025-08-20T00:00:00.000Z" // Fresh fruit: ~7-10 days shelf life
  },
  {
    id: "LECHON001",
    name: "Frozen Lechon Belly (Pork)",
    classification: "Specialty Good", // Less frequent purchase, higher consideration
    quantity: 3,
    available: true,
    supplier: "Rico's Lechon",
    coordinates: { x: 15, y: 4 }, // Frozen foods, specialty freezer
    price: 1200.00, // PHP
    description: "Pre-cooked crispy roasted pork belly, a Filipino celebration dish.",
    dateAdded: "2024-12-01T09:30:00.000Z",
    discount: 20,
    image: "/images/products/lechon-belly-frozen.jpg",
    expirationDate: "2025-06-01T00:00:00.000Z" // Frozen meat: ~6 months shelf life
  },
  {
    id: "KAREOKE001",
    name: "Grand Videoke Symphony SE Pro",
    classification: "Specialty Good", // High-value, specific purchase
    quantity: 1,
    available: false, // Might be on order
    supplier: "Audio-Video World Inc.",
    coordinates: { x: 20, y: 1 }, // Electronics section, display
    price: 25000.00, // PHP
    description: "Premium karaoke system with extensive song library, for entertainment.",
    dateAdded: "2024-09-15T12:00:00.000Z",
    discount: 0,
    image: "/images/products/grand-videoke-symphony-se-pro.jpg",
    expirationDate: null // Electronics: no expiration date
  },
  {
    id: "TUNA001",
    name: "Century Tuna Flakes in Oil 180g",
    classification: "Convenience Good",
    quantity: 90,
    available: true,
    supplier: "Century Pacific Food Inc.",
    coordinates: { x: 8, y: 2 }, // Canned goods, middle shelf
    price: 45.00, // PHP
    description: "Canned tuna flakes, a popular and versatile pantry staple.",
    dateAdded: "2025-01-12T11:15:00.000Z",
    discount: 0,
    image: "/images/products/century-tuna-flakes-180g.jpg",
    expirationDate: "2028-01-12T00:00:00.000Z" // Canned goods: ~3 years shelf life
  },
  {
    id: "MILO001",
    name: "MILO Powder 220g",
    classification: "Convenience Good",
    quantity: 110,
    available: true,
    supplier: "Nestle Philippines",
    coordinates: { x: 10, y: 3 }, // Beverages/Powdered drinks, middle shelf
    price: 95.00, // PHP
    description: "Chocolate malt drink powder, a favorite among children and adults.",
    dateAdded: "2024-11-08T13:45:00.000Z",
    discount: 8,
    image: "/images/products/milo-powder-220g.jpg",
    expirationDate: "2026-11-08T00:00:00.000Z" // Powdered drinks: ~2 years shelf life
  },
  {
    id: "SOAP005",
    name: "Safeguard Bar Soap (White) 135g",
    classification: "Convenience Good",
    quantity: 180,
    available: true,
    supplier: "Procter & Gamble Philippines",
    coordinates: { x: 18, y: 1 }, // Personal care, bottom shelf
    price: 40.00, // PHP
    description: "Antiseptic bar soap for daily hygiene.",
    dateAdded: "2025-02-01T07:30:00.000Z",
    discount: 12,
    image: "/images/products/safeguard-bar-soap-white-135g.jpg",
    expirationDate: "2028-02-01T00:00:00.000Z" // Bar soap: ~3 years shelf life
  },
  {
    id: "TOOTHPASTE002",
    name: "Colgate Toothpaste Great Regular Flavor 100ml",
    classification: "Convenience Good",
    quantity: 130,
    available: true,
    supplier: "Colgate-Palmolive Philippines",
    coordinates: { x: 18, y: 2 }, // Personal care, middle shelf
    price: 65.00, // PHP
    description: "Fluoride toothpaste for oral hygiene.",
    dateAdded: "2024-12-20T15:00:00.000Z",
    discount: 0,
    image: "/images/products/colgate-toothpaste-regular-100ml.jpg",
    expirationDate: "2026-12-20T00:00:00.000Z" // Toothpaste: ~2 years shelf life
  },
  {
    id: "SUGAR001",
    name: "Refined Sugar 1kg",
    classification: "Convenience Good",
    quantity: 100,
    available: true,
    supplier: "Universal Robina Corporation",
    coordinates: { x: 6, y: 1 }, // Baking aisle, bottom shelf
    price: 80.00, // PHP
    description: "Granulated white sugar for cooking and baking.",
    dateAdded: "2025-01-18T09:00:00.000Z",
    discount: 0,
    image: "/images/products/refined-sugar-1kg.jpg",
    expirationDate: null // Sugar: indefinite shelf life if stored properly
  },
  {
    id: "COOKIES004",
    name: "Rebisco Crackers 250g",
    classification: "Convenience Good",
    quantity: 160,
    available: true,
    supplier: "Rebisco (Republic Biscuit Corporation)",
    coordinates: { x: 7, y: 4 }, // Snacks, top shelf
    price: 30.00, // PHP
    description: "Classic plain crackers, perfect for snacks or with coffee.",
    dateAdded: "2024-10-25T17:30:00.000Z",
    discount: 5,
    image: "/images/products/rebisco-crackers-250g.jpg",
    expirationDate: "2025-10-25T00:00:00.000Z" // Crackers: ~1 year shelf life
  },
  {
    id: "DETERGENT001",
    name: "Tide Powder Detergent 1kg",
    classification: "Convenience Good",
    quantity: 70,
    available: true,
    supplier: "Procter & Gamble Philippines",
    coordinates: { x: 19, y: 3 }, // Household essentials, middle shelf
    price: 220.00, // PHP
    description: "Powerful laundry detergent for tough stains.",
    dateAdded: "2024-11-12T08:45:00.000Z",
    discount: 15,
    image: "/images/products/tide-powder-detergent-1kg.jpg",
    expirationDate: "2026-11-12T00:00:00.000Z" // Detergent: ~2 years shelf life
  },
  {
    id: "OIL003",
    name: "Cooking Oil (Vegetable) 1L",
    classification: "Convenience Good",
    quantity: 95,
    available: true,
    supplier: "Golden Fiesta",
    coordinates: { x: 9, y: 1 }, // Cooking ingredients, bottom shelf
    price: 150.00, // PHP
    description: "All-purpose vegetable cooking oil.",
    dateAdded: "2025-01-20T14:20:00.000Z",
    discount: 0,
    image: "/images/products/cooking-oil-vegetable-1l.jpg",
    expirationDate: "2026-07-20T00:00:00.000Z" // Cooking oil: ~18 months shelf life
  },
  {
    id: "VINEGAR001",
    name: "Silver Swan Vinegar 1L",
    classification: "Convenience Good",
    quantity: 75,
    available: true,
    supplier: "NutriAsia Inc.",
    coordinates: { x: 9, y: 2 }, // Cooking ingredients, middle shelf
    price: 60.00, // PHP
    description: "Cane vinegar, a fundamental condiment in Filipino dishes.",
    dateAdded: "2024-12-28T11:10:00.000Z",
    discount: 0,
    image: "/images/products/silver-swan-vinegar-1l.jpg",
    expirationDate: null // Vinegar: indefinite shelf life
  },
  {
    id: "CHICKEN001",
    name: "Chicken Drumsticks (per kg)",
    classification: "Shopping Good", // Quality and price comparison
    quantity: 40,
    available: true,
    supplier: "San Miguel Pure Foods",
    coordinates: { x: 13, y: 2 }, // Meat section, refrigerated display
    price: 190.00, // PHP
    description: "Fresh chicken drumsticks, suitable for various recipes.",
    dateAdded: "2025-08-16T05:30:00.000Z",
    discount: 10,
    image: "/images/products/chicken-drumsticks.jpg",
    expirationDate: "2025-08-19T00:00:00.000Z" // Fresh chicken: ~3 days refrigerated
  },
  {
    id: "BEEF002",
    name: "Ground Beef (Lean) 500g",
    classification: "Shopping Good",
    quantity: 25,
    available: true,
    supplier: "Monterey Meats",
    coordinates: { x: 13, y: 3 }, // Meat section, refrigerated display
    price: 220.00, // PHP
    description: "Lean ground beef, ideal for various Filipino dishes like picadillo or spaghetti.",
    dateAdded: "2025-08-15T06:45:00.000Z",
    discount: 5,
    image: "/images/products/ground-beef-lean-500g.jpg",
    expirationDate: "2025-08-17T00:00:00.000Z" // Fresh ground beef: ~2 days refrigerated
  },
  {
    id: "SHAMPOO001",
    name: "Pantene Pro-V Shampoo 400ml",
    classification: "Shopping Good", // Brand/variant comparison
    quantity: 50,
    available: true,
    supplier: "Procter & Gamble Philippines",
    coordinates: { x: 17, y: 2 }, // Hair care, middle shelf
    price: 250.00, // PHP
    description: "Popular shampoo for healthy, shiny hair.",
    dateAdded: "2024-12-10T13:20:00.000Z",
    discount: 20,
    image: "/images/products/pantene-pro-v-shampoo-400ml.jpg",
    expirationDate: "2027-12-10T00:00:00.000Z" // Shampoo: ~3 years shelf life
  },
  {
    id: "DIAPERS001",
    name: "Pampers Baby Dry Diapers (Mega Pack)",
    classification: "Shopping Good", // Size/brand/value comparison
    quantity: 20,
    available: true,
    supplier: "Procter & Gamble Philippines",
    coordinates: { x: 21, y: 1 }, // Baby care, bottom shelf
    price: 700.00, // PHP
    description: "Absorbent diapers for babies, mega pack for better value.",
    dateAdded: "2025-01-25T10:15:00.000Z",
    discount: 25,
    image: "/images/products/pampers-baby-dry-mega-pack.jpg",
    expirationDate: null // Diapers: no expiration date
  },
  {
    id: "TV001",
    name: "Samsung 55-inch Smart TV",
    classification: "Specialty Good", // High-value, infrequent purchase
    quantity: 2,
    available: true,
    supplier: "Samsung Philippines",
    coordinates: { x: 22, y: 1 }, // Electronics section, display wall
    price: 35000.00, // PHP
    description: "High-definition smart television with advanced features.",
    dateAdded: "2024-08-20T12:00:00.000Z",
    discount: 18,
    image: "/images/products/samsung-55-smart-tv.jpg",
    expirationDate: null // Electronics: no expiration date
  },
  {
    id: "APPLIANCE001",
    name: "Hanabishi Rice Cooker 1.8L",
    classification: "Shopping Good", // Consumers compare features/brands
    quantity: 15,
    available: true,
    supplier: "Hanabishi Appliances",
    coordinates: { x: 23, y: 2 }, // Kitchen appliances, middle shelf
    price: 1500.00, // PHP
    description: "Essential kitchen appliance for cooking rice.",
    dateAdded: "2024-11-30T16:45:00.000Z",
    discount: 12,
    image: "/images/products/hanabishi-rice-cooker-1-8l.jpg",
    expirationDate: null // Appliances: no expiration date
  },
  {
    id: "FAN001",
    name: "Asahi Electric Fan (Stand Fan)",
    classification: "Shopping Good", // Different types/brands
    quantity: 10,
    available: true,
    supplier: "Asahi Electrical Manufacturing Corp.",
    coordinates: { x: 23, y: 1 }, // Home appliances, bottom shelf
    price: 1200.00, // PHP
    description: "Standard electric stand fan for cooling rooms.",
    dateAdded: "2025-03-10T14:30:00.000Z",
    discount: 8,
    image: "/images/products/asahi-electric-stand-fan.jpg",
    expirationDate: null // Appliances: no expiration date
  }
];

export { products };