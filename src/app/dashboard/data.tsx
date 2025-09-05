"use client";
import { Product } from "./types";

const products: Product[] = [
  {
    id: "RICE001",
    name: "Jasmine Rice",
    classification: "Convenience Good",
    quantity: 200,
    available: true,
    supplier: "Local Rice Millers Inc.",
    coordinates: { x: 5, y: 1 }, // Aisle 5, bottom shelf
    price: 350.0, // PHP
    description:
      "Premium fragrant Jasmine rice, a staple in Filipino households.",
    dateAdded: "2024-12-15T08:30:00.000Z",
    discount: 5,
    image:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSlbErigZewwjzY70pSuQXe0zMw_NYQPRYj3EC_Hxq9R0PsxNe7NP4G73-ShklS9mWhXzs_D67-lZsz4EzR-JPLMtUFkNUsViMKpMYhQJFg__CPEJt4PGGoD8A",
    expirationDate: "2026-12-15T00:00:00.000Z", // Rice: ~2 years shelf life
    weight: "5kg",
    brand: "Premium Select",
    category: "Grains & Rice",
    barcode: "8901234567890",
    unit: "bag",
    minStockLevel: 50,
    maxStockLevel: 500,
    costPrice: 320.0,
    profitMargin: 9.38,
  },
  {
    id: "NOODLE003",
    name: "Lucky Me! Pancit Canton (Original)",
    classification: "Convenience Good",
    quantity: 150,
    available: true,
    supplier: "Monde Nissin Corporation",
    coordinates: { x: 7, y: 2 }, // Aisle 7, middle shelf
    price: 15.0, // PHP
    description: "Instant noodles, a quick and popular snack or meal.",
    dateAdded: "2024-11-20T14:15:00.000Z",
    discount: 0,
    image:
      "https://shopmetro.ph/imus-supermarket/wp-content/uploads/2024/05/SM102169577-1-8.jpg",
    expirationDate: "2025-11-20T00:00:00.000Z", // Instant noodles: ~1 year shelf life
    weight: "80g",
    brand: "Lucky Me!",
    category: "Instant Noodles",
    barcode: "8901234567891",
    unit: "pack",
    minStockLevel: 30,
    maxStockLevel: 300,
    costPrice: 12.5,
    profitMargin: 20.0,
  },
  {
    id: "FISHSAUCE001",
    name: "Datu Puti Patis",
    classification: "Convenience Good",
    quantity: 80,
    available: true,
    supplier: "NutriAsia Inc.",
    coordinates: { x: 9, y: 3 }, // Aisle 9, eye-level shelf
    price: 90.0, // PHP
    description: "High-quality fish sauce, essential for Filipino cuisine.",
    dateAdded: "2025-01-05T10:45:00.000Z",
    discount: 0,
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcShub6ejSKpUaplj3j99AffG3CWwfJ2V82tMnrBoagRnVyvkfxjLHoL9zBKHvebHVcoGB0nqIzY2Ut4tdb6LpyGhUgGXP-v0MgskAerwOB5W79OElvMDym4",
    expirationDate: "2027-01-05T00:00:00.000Z", // Fish sauce: ~2 years shelf life
    weight: "1L",
    brand: "Datu Puti",
    category: "Condiments & Sauces",
    barcode: "8901234567892",
    unit: "bottle",
    minStockLevel: 20,
    maxStockLevel: 150,
    costPrice: 75.0,
    profitMargin: 20.0,
  },
  {
    id: "COFFEE002",
    name: "Nescafe Classic",
    classification: "Convenience Good",
    quantity: 120,
    available: true,
    supplier: "Nestle Philippines",
    coordinates: { x: 10, y: 2 }, // Aisle 10, middle shelf
    price: 120.0, // PHP
    description: "Instant coffee, a popular choice for daily consumption.",
    dateAdded: "2024-10-30T16:20:00.000Z",
    discount: 10,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTDyw5iXOysnhy0GyyG1vNx4BzNYCAeiExwaIh8vjRCJHjsvhTBeJ9WbZEsYCrXlx1VaiH81iSyQbALbQTT_u1pwLsL9saPZ8DXIijEIAbFdbsXkRcj9HQtjFE",
    expirationDate: "2026-10-30T00:00:00.000Z", // Instant coffee: ~2 years shelf life
    weight: "100g",
    brand: "Nescafe",
    category: "Beverages",
    barcode: "8901234567893",
    unit: "jar",
    minStockLevel: 25,
    maxStockLevel: 200,
    costPrice: 95.0,
    profitMargin: 26.32,
  },
  {
    id: "MANGO005",
    name: "Fresh Carabao Mangoes",
    classification: "Shopping Good", // Consumers might compare ripeness/size
    quantity: 30,
    available: true,
    supplier: "Local Farmers Cooperative",
    coordinates: { x: 1, y: 1 }, // Produce section, top bin
    price: 180.0, // PHP
    description: "Sweet and juicy Carabao mangoes, a national fruit.",
    dateAdded: "2025-08-10T06:00:00.000Z",
    discount: 15,
    image: "",
    expirationDate: "2025-08-20T00:00:00.000Z", // Fresh fruit: ~7-10 days shelf life
    weight: "per kg",
    brand: "Local Farm Fresh",
    category: "Fresh Fruits",
    barcode: "2901234567894",
    unit: "kg",
    minStockLevel: 10,
    maxStockLevel: 100,
    costPrice: 140.0,
    profitMargin: 28.57,
  },
  {
    id: "LECHON001",
    name: "Frozen Lechon Belly (Pork)",
    classification: "Specialty Good", // Less frequent purchase, higher consideration
    quantity: 3,
    available: true,
    supplier: "Rico's Lechon",
    coordinates: { x: 15, y: 4 }, // Frozen foods, specialty freezer
    price: 1200.0, // PHP
    description:
      "Pre-cooked crispy roasted pork belly, a Filipino celebration dish.",
    dateAdded: "2024-12-01T09:30:00.000Z",
    discount: 20,
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSFHWKebhGkTvLQrhfmLdviUBFXyhGswWNeDdOG-o0vc2nphYrczqQcTAD8aeZXLMBuZM8S9fSXe50BgMJYT-YBXOEMF07mbvThZA0ig09Z6kd0gl2QGDPeSQ",
    expirationDate: "2025-06-01T00:00:00.000Z", // Frozen meat: ~6 months shelf life
    weight: "1kg",
    brand: "Rico's",
    category: "Frozen Meat",
    barcode: "8901234567895",
    unit: "pack",
    minStockLevel: 1,
    maxStockLevel: 10,
    costPrice: 950.0,
    profitMargin: 26.32,
  },
  {
    id: "TUNA001",
    name: "Century Tuna Flakes in Oil",
    classification: "Convenience Good",
    quantity: 90,
    available: true,
    supplier: "Century Pacific Food Inc.",
    coordinates: { x: 8, y: 2 }, // Canned goods, middle shelf
    price: 45.0, // PHP
    description: "Canned tuna flakes, a popular and versatile pantry staple.",
    dateAdded: "2025-01-12T11:15:00.000Z",
    discount: 0,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRJoBlu0TjA-8NyoqktXYtJdnonjhpstsJpWMafJf42R8OJh-DYvKUXjvCRq524FWjJUl2u9YRGw3XTgXeszZx6Pwn9O8upCSKqMSNBzDyqUsjRbRTKpeTaLF05",
    expirationDate: "2028-01-12T00:00:00.000Z", // Canned goods: ~3 years shelf life
    weight: "180g",
    brand: "Century",
    category: "Canned Goods",
    barcode: "8901234567896",
    unit: "can",
    minStockLevel: 20,
    maxStockLevel: 200,
    costPrice: 38.0,
    profitMargin: 18.42,
  },
  {
    id: "MILO001",
    name: "MILO Powder",
    classification: "Convenience Good",
    quantity: 110,
    available: true,
    supplier: "Nestle Philippines",
    coordinates: { x: 10, y: 3 }, // Beverages/Powdered drinks, middle shelf
    price: 95.0, // PHP
    description:
      "Chocolate malt drink powder, a favorite among children and adults.",
    dateAdded: "2024-11-08T13:45:00.000Z",
    discount: 8,
    image: "https://zbga.shopsuki.ph/products/milo-activ-go-300g",
    expirationDate: "2026-11-08T00:00:00.000Z", // Powdered drinks: ~2 years shelf life
    weight: "220g",
    brand: "MILO",
    category: "Beverages",
    barcode: "8901234567897",
    unit: "pouch",
    minStockLevel: 25,
    maxStockLevel: 200,
    costPrice: 78.0,
    profitMargin: 21.79,
  },
  {
    id: "SOAP005",
    name: "Safeguard Bar Soap (White)",
    classification: "Convenience Good",
    quantity: 180,
    available: true,
    supplier: "Procter & Gamble Philippines",
    coordinates: { x: 18, y: 1 }, // Personal care, bottom shelf
    price: 40.0, // PHP
    description: "Antiseptic bar soap for daily hygiene.",
    dateAdded: "2025-02-01T07:30:00.000Z",
    discount: 12,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR6LfRjMqVk70syCckBivFJNpsRlbZEDPncIWtdpvJya_Xi9YED9tD_rfOSTrmaHpIFK2PC44y8GuRHmFuMpLKxK35hZ6Vuxpo63SKgYPjcuBOHpsgypbDs",
    expirationDate: "2028-02-01T00:00:00.000Z", // Bar soap: ~3 years shelf life
    weight: "135g",
    brand: "Safeguard",
    category: "Personal Care",
    barcode: "8901234567898",
    unit: "bar",
    minStockLevel: 50,
    maxStockLevel: 300,
    costPrice: 32.0,
    profitMargin: 25.0,
  },
  {
    id: "TOOTHPASTE002",
    name: "Colgate Toothpaste Great Regular Flavor",
    classification: "Convenience Good",
    quantity: 130,
    available: true,
    supplier: "Colgate-Palmolive Philippines",
    coordinates: { x: 18, y: 2 }, // Personal care, middle shelf
    price: 65.0, // PHP
    description: "Fluoride toothpaste for oral hygiene.",
    dateAdded: "2024-12-20T15:00:00.000Z",
    discount: 0,
    image: "https://shopsuki.ph/cdn/shop/files/102051569_800x.png?v=1722857661",
    expirationDate: "2026-12-20T00:00:00.000Z", // Toothpaste: ~2 years shelf life
    weight: "100ml",
    brand: "Colgate",
    category: "Personal Care",
    barcode: "8901234567899",
    unit: "tube",
    minStockLevel: 30,
    maxStockLevel: 200,
    costPrice: 52.0,
    profitMargin: 25.0,
  },
  // {
  //   id: "SUGAR001",
  //   name: "Refined Sugar",
  //   classification: "Convenience Good",
  //   quantity: 100,
  //   available: true,
  //   supplier: "Universal Robina Corporation",
  //   coordinates: { x: 6, y: 1 }, // Baking aisle, bottom shelf
  //   price: 80.0, // PHP
  //   description: "Granulated white sugar for cooking and baking.",
  //   dateAdded: "2025-01-18T09:00:00.000Z",
  //   discount: 0,
  //   image: "",
  //   expirationDate: null, // Sugar: indefinite shelf life if stored properly
  //   weight: "1kg",
  //   brand: "Sweet Choice",
  //   category: "Baking & Cooking",
  //   barcode: "8901234567800",
  //   unit: "bag",
  //   minStockLevel: 25,
  //   maxStockLevel: 200,
  //   costPrice: 68.0,
  //   profitMargin: 17.65,
  // },
  // {
  //   id: "COOKIES004",
  //   name: "Rebisco Crackers",
  //   classification: "Convenience Good",
  //   quantity: 160,
  //   available: true,
  //   supplier: "Rebisco (Republic Biscuit Corporation)",
  //   coordinates: { x: 7, y: 4 }, // Snacks, top shelf
  //   price: 30.0, // PHP
  //   description: "Classic plain crackers, perfect for snacks or with coffee.",
  //   dateAdded: "2024-10-25T17:30:00.000Z",
  //   discount: 5,
  //   image: "",
  //   expirationDate: "2025-10-25T00:00:00.000Z", // Crackers: ~1 year shelf life
  //   weight: "250g",
  //   brand: "Rebisco",
  //   category: "Snacks",
  //   barcode: "8901234567801",
  //   unit: "pack",
  //   minStockLevel: 40,
  //   maxStockLevel: 300,
  //   costPrice: 24.0,
  //   profitMargin: 25.0,
  // },
  // {
  //   id: "DETERGENT001",
  //   name: "Tide Powder Detergent",
  //   classification: "Convenience Good",
  //   quantity: 70,
  //   available: true,
  //   supplier: "Procter & Gamble Philippines",
  //   coordinates: { x: 19, y: 3 }, // Household essentials, middle shelf
  //   price: 220.0, // PHP
  //   description: "Powerful laundry detergent for tough stains.",
  //   dateAdded: "2024-11-12T08:45:00.000Z",
  //   discount: 15,
  //   image: "",
  //   expirationDate: "2026-11-12T00:00:00.000Z", // Detergent: ~2 years shelf life
  //   weight: "1kg",
  //   brand: "Tide",
  //   category: "Household Essentials",
  //   barcode: "8901234567802",
  //   unit: "box",
  //   minStockLevel: 15,
  //   maxStockLevel: 100,
  //   costPrice: 180.0,
  //   profitMargin: 22.22,
  // },
  // {
  //   id: "OIL003",
  //   name: "Cooking Oil (Vegetable)",
  //   classification: "Convenience Good",
  //   quantity: 95,
  //   available: true,
  //   supplier: "Golden Fiesta",
  //   coordinates: { x: 9, y: 1 }, // Cooking ingredients, bottom shelf
  //   price: 150.0, // PHP
  //   description: "All-purpose vegetable cooking oil.",
  //   dateAdded: "2025-01-20T14:20:00.000Z",
  //   discount: 0,
  //   image: "",
  //   expirationDate: "2026-07-20T00:00:00.000Z", // Cooking oil: ~18 months shelf life
  //   weight: "1L",
  //   brand: "Golden Fiesta",
  //   category: "Cooking Ingredients",
  //   barcode: "8901234567803",
  //   unit: "bottle",
  //   minStockLevel: 20,
  //   maxStockLevel: 150,
  //   costPrice: 125.0,
  //   profitMargin: 20.0,
  // },
  // {
  //   id: "VINEGAR001",
  //   name: "Silver Swan Vinegar",
  //   classification: "Convenience Good",
  //   quantity: 75,
  //   available: true,
  //   supplier: "NutriAsia Inc.",
  //   coordinates: { x: 9, y: 2 }, // Cooking ingredients, middle shelf
  //   price: 60.0, // PHP
  //   description: "Cane vinegar, a fundamental condiment in Filipino dishes.",
  //   dateAdded: "2024-12-28T11:10:00.000Z",
  //   discount: 0,
  //   image: "",
  //   expirationDate: null, // Vinegar: indefinite shelf life
  //   weight: "1L",
  //   brand: "Silver Swan",
  //   category: "Condiments & Sauces",
  //   barcode: "8901234567804",
  //   unit: "bottle",
  //   minStockLevel: 15,
  //   maxStockLevel: 120,
  //   costPrice: 48.0,
  //   profitMargin: 25.0,
  // },
  // {
  //   id: "CHICKEN001",
  //   name: "Chicken Drumsticks",
  //   classification: "Shopping Good", // Quality and price comparison
  //   quantity: 40,
  //   available: true,
  //   supplier: "San Miguel Pure Foods",
  //   coordinates: { x: 13, y: 2 }, // Meat section, refrigerated display
  //   price: 190.0, // PHP
  //   description: "Fresh chicken drumsticks, suitable for various recipes.",
  //   dateAdded: "2025-08-16T05:30:00.000Z",
  //   discount: 10,
  //   image: "",
  //   expirationDate: "2025-08-19T00:00:00.000Z", // Fresh chicken: ~3 days refrigerated
  //   weight: "per kg",
  //   brand: "San Miguel Pure Foods",
  //   category: "Fresh Meat",
  //   barcode: "2901234567805",
  //   unit: "kg",
  //   minStockLevel: 10,
  //   maxStockLevel: 80,
  //   costPrice: 160.0,
  //   profitMargin: 18.75,
  // },
  // {
  //   id: "BEEF002",
  //   name: "Ground Beef (Lean)",
  //   classification: "Shopping Good",
  //   quantity: 25,
  //   available: true,
  //   supplier: "Monterey Meats",
  //   coordinates: { x: 13, y: 3 }, // Meat section, refrigerated display
  //   price: 220.0, // PHP
  //   description:
  //     "Lean ground beef, ideal for various Filipino dishes like picadillo or spaghetti.",
  //   dateAdded: "2025-08-15T06:45:00.000Z",
  //   discount: 5,
  //   image: "",
  //   expirationDate: "2025-08-17T00:00:00.000Z", // Fresh ground beef: ~2 days refrigerated
  //   weight: "500g",
  //   brand: "Monterey Meats",
  //   category: "Fresh Meat",
  //   barcode: "2901234567806",
  //   unit: "pack",
  //   minStockLevel: 5,
  //   maxStockLevel: 50,
  //   costPrice: 185.0,
  //   profitMargin: 18.92,
  // },
  // {
  //   id: "SHAMPOO001",
  //   name: "Pantene Pro-V Shampoo",
  //   classification: "Shopping Good", // Brand/variant comparison
  //   quantity: 50,
  //   available: true,
  //   supplier: "Procter & Gamble Philippines",
  //   coordinates: { x: 17, y: 2 }, // Hair care, middle shelf
  //   price: 250.0, // PHP
  //   description: "Popular shampoo for healthy, shiny hair.",
  //   dateAdded: "2024-12-10T13:20:00.000Z",
  //   discount: 20,
  //   image: "",
  //   expirationDate: "2027-12-10T00:00:00.000Z", // Shampoo: ~3 years shelf life
  //   weight: "400ml",
  //   brand: "Pantene",
  //   category: "Personal Care",
  //   barcode: "8901234567807",
  //   unit: "bottle",
  //   minStockLevel: 10,
  //   maxStockLevel: 100,
  //   costPrice: 195.0,
  //   profitMargin: 28.21,
  // },
  // {
  //   id: "DIAPERS001",
  //   name: "Pampers Baby Dry Diapers (Mega Pack)",
  //   classification: "Shopping Good", // Size/brand/value comparison
  //   quantity: 20,
  //   available: true,
  //   supplier: "Procter & Gamble Philippines",
  //   coordinates: { x: 21, y: 1 }, // Baby care, bottom shelf
  //   price: 700.0, // PHP
  //   description: "Absorbent diapers for babies, mega pack for better value.",
  //   dateAdded: "2025-01-25T10:15:00.000Z",
  //   discount: 25,
  //   image: "",
  //   expirationDate: null, // Diapers: no expiration date
  //   weight: "54 pieces",
  //   brand: "Pampers",
  //   category: "Baby Care",
  //   barcode: "8901234567808",
  //   unit: "pack",
  //   minStockLevel: 5,
  //   maxStockLevel: 50,
  //   costPrice: 525.0,
  //   profitMargin: 33.33,
  // },
  // {
  //   id: "BREAD001",
  //   name: "Gardenia White Bread",
  //   classification: "Convenience Good",
  //   quantity: 50,
  //   available: true,
  //   supplier: "Gardenia Bakeries Philippines",
  //   coordinates: { x: 3, y: 2 }, // Bakery section, middle shelf
  //   price: 65.0, // PHP
  //   description: "Soft white bread loaf, perfect for sandwiches and breakfast.",
  //   dateAdded: "2025-08-30T06:00:00.000Z",
  //   discount: 0,
  //   image: "",
  //   expirationDate: "2025-09-05T00:00:00.000Z", // Fresh bread: ~5-6 days shelf life
  //   weight: "600g",
  //   brand: "Gardenia",
  //   category: "Bakery",
  //   barcode: "8901234567809",
  //   unit: "loaf",
  //   minStockLevel: 15,
  //   maxStockLevel: 100,
  //   costPrice: 52.0,
  //   profitMargin: 25.0,
  // },
  // {
  //   id: "EGGS001",
  //   name: "Fresh Chicken Eggs",
  //   classification: "Convenience Good",
  //   quantity: 80,
  //   available: true,
  //   supplier: "San Miguel Pure Foods",
  //   coordinates: { x: 12, y: 1 }, // Dairy/Eggs section, refrigerated
  //   price: 85.0, // PHP
  //   description:
  //     "Fresh Grade A chicken eggs, essential for cooking and baking.",
  //   dateAdded: "2025-08-28T05:30:00.000Z",
  //   discount: 0,
  //   image: "",
  //   expirationDate: "2025-09-15T00:00:00.000Z", // Fresh eggs: ~2-3 weeks refrigerated
  //   weight: "1 dozen",
  //   brand: "Farm Fresh",
  //   category: "Dairy & Eggs",
  //   barcode: "2901234567810",
  //   unit: "tray",
  //   minStockLevel: 20,
  //   maxStockLevel: 150,
  //   costPrice: 70.0,
  //   profitMargin: 21.43,
  // },
  // {
  //   id: "MILK001",
  //   name: "Alaska Condensed Milk",
  //   classification: "Convenience Good",
  //   quantity: 90,
  //   available: true,
  //   supplier: "Alaska Milk Corporation",
  //   coordinates: { x: 11, y: 2 }, // Dairy section, middle shelf
  //   price: 45.0, // PHP
  //   description: "Sweetened condensed milk for coffee, desserts, and cooking.",
  //   dateAdded: "2025-01-15T09:20:00.000Z",
  //   discount: 0,
  //   image: "",
  //   expirationDate: "2027-01-15T00:00:00.000Z", // Canned milk: ~2 years shelf life
  //   weight: "300ml",
  //   brand: "Alaska",
  //   category: "Dairy & Eggs",
  //   barcode: "8901234567811",
  //   unit: "can",
  //   minStockLevel: 20,
  //   maxStockLevel: 150,
  //   costPrice: 38.0,
  //   profitMargin: 18.42,
  // },
  // {
  //   id: "BANANA001",
  //   name: "Saba Bananas",
  //   classification: "Convenience Good",
  //   quantity: 40,
  //   available: true,
  //   supplier: "Local Farmers Cooperative",
  //   coordinates: { x: 1, y: 2 }, // Produce section, middle bin
  //   price: 60.0, // PHP
  //   description: "Fresh saba bananas, perfect for cooking or eating fresh.",
  //   dateAdded: "2025-08-29T07:00:00.000Z",
  //   discount: 0,
  //   image: "",
  //   expirationDate: "2025-09-05T00:00:00.000Z", // Fresh bananas: ~1 week
  //   weight: "per kg",
  //   brand: "Local Farm Fresh",
  //   category: "Fresh Fruits",
  //   barcode: "2901234567812",
  //   unit: "kg",
  //   minStockLevel: 10,
  //   maxStockLevel: 100,
  //   costPrice: 45.0,
  //   profitMargin: 33.33,
  // },
  // {
  //   id: "ONION001",
  //   name: "Red Onions",
  //   classification: "Convenience Good",
  //   quantity: 60,
  //   available: true,
  //   supplier: "Baguio Vegetables Trading",
  //   coordinates: { x: 2, y: 1 }, // Produce section, bottom bin
  //   price: 120.0, // PHP
  //   description: "Fresh red onions, essential ingredient for Filipino cooking.",
  //   dateAdded: "2025-08-25T08:15:00.000Z",
  //   discount: 5,
  //   image: "",
  //   expirationDate: "2025-09-25T00:00:00.000Z", // Fresh onions: ~1 month
  //   weight: "per kg",
  //   brand: "Highland Fresh",
  //   category: "Fresh Vegetables",
  //   barcode: "2901234567813",
  //   unit: "kg",
  //   minStockLevel: 15,
  //   maxStockLevel: 120,
  //   costPrice: 95.0,
  //   profitMargin: 26.32,
  // },
  // {
  //   id: "GARLIC001",
  //   name: "Fresh Garlic",
  //   classification: "Convenience Good",
  //   quantity: 35,
  //   available: true,
  //   supplier: "Baguio Vegetables Trading",
  //   coordinates: { x: 2, y: 2 }, // Produce section, middle bin
  //   price: 200.0, // PHP
  //   description:
  //     "Fresh garlic bulbs, fundamental seasoning for Filipino dishes.",
  //   dateAdded: "2025-08-20T07:45:00.000Z",
  //   discount: 0,
  //   image: "",
  //   expirationDate: "2025-10-20T00:00:00.000Z", // Fresh garlic: ~2 months
  //   weight: "per kg",
  //   brand: "Highland Fresh",
  //   category: "Fresh Vegetables",
  //   barcode: "2901234567814",
  //   unit: "kg",
  //   minStockLevel: 10,
  //   maxStockLevel: 80,
  //   costPrice: 160.0,
  //   profitMargin: 25.0,
  // },
];

export { products };
