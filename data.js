const sellers = [ "Riya", "Arjun", "Meera", "Kabir", "Neha", "Aman", "Ishita", "Vikram", "Sara", "Dev", ];

const images = {
  phone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  car: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
  bike: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
  // Additional varied images for more visual diversity
  iphone: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=900&q=80",
  samsung: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
  suv: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
  sportbike: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80",
  macbook: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"
};

const products = [
  ["Mobile Phones", "📱", images.phone, [
    ["Apple iPhone 13", 42000], ["Apple iPhone 14", 52000], ["Apple iPhone 15", 65000], ["Apple iPhone 15 Pro", 98000], ["Samsung Galaxy S22", 28000],
    ["Samsung Galaxy S23", 42000], ["Samsung Galaxy S24", 62000], ["Samsung Galaxy A54", 24000], ["OnePlus 11", 38000], ["OnePlus 12", 58000],
    ["Google Pixel 7", 32000], ["Google Pixel 8", 52000], ["Nothing Phone 2", 35000], ["Xiaomi 14", 48000], ["Redmi Note 13 Pro", 26000],
    ["Realme GT 6", 36000], ["Vivo V30", 34000], ["Oppo Reno 11", 32000], ["Motorola Edge 50", 30000], ["Nokia G42", 15000],
    ["Samsung Galaxy Z Flip 5", 70000], ["iPhone 12 Mini", 30000], ["OnePlus Nord CE 3", 22000], ["Poco X6 Pro", 26000], ["Asus ROG Phone 7", 72000]
  ]],
  ["Cars", "🚗", images.car, [
    ["Maruti Suzuki Swift", 485000], ["Toyota Fortuner", 3200000], ["Mahindra Scorpio", 1850000], ["Hyundai Creta", 1650000], ["Tata Nexon", 950000],
    ["Maruti Suzuki Baleno", 720000], ["Hyundai i20", 780000], ["Tata Punch", 750000], ["Kia Seltos", 1450000], ["Honda City", 1350000],
    ["Mahindra Thar", 1750000], ["Toyota Innova Crysta", 2450000], ["Volkswagen Virtus", 1450000], ["Skoda Slavia", 1500000], ["MG Hector", 1850000],
    ["Renault Kwid", 480000], ["Maruti Suzuki Brezza", 1050000], ["Hyundai Venue", 1150000], ["Tata Harrier", 1950000], ["Kia Sonet", 1100000],
    ["Jeep Compass", 2450000], ["Honda Amaze", 850000], ["Maruti Suzuki Dzire", 800000], ["Toyota Glanza", 850000], ["Citroen C3", 750000]
  ]],
  ["Bikes", "🏍️", images.bike, [
    ["Royal Enfield Classic 350", 165000], ["Royal Enfield Bullet 350", 155000], ["Royal Enfield Hunter 350", 150000], ["Yamaha MT-15", 132000], ["Yamaha R15 V4", 185000],
    ["Bajaj Pulsar NS200", 145000], ["Bajaj Pulsar 150", 115000], ["TVS Apache RTR 200", 145000], ["KTM Duke 390", 300000], ["KTM Duke 250", 240000],
    ["Honda Hornet 2.0", 145000], ["Honda CB350", 205000], ["Suzuki Gixxer", 140000], ["Hero Xpulse 200", 155000], ["Hero Splendor Plus", 80000],
    ["Bajaj Dominar 400", 235000], ["Kawasaki Ninja 300", 340000], ["BMW G 310 R", 300000], ["Jawa 42", 195000], ["Husqvarna Svartpilen 250", 220000],
    ["TVS Ronin", 170000], ["Yamaha FZ-FI", 120000], ["Honda Shine", 90000], ["Hero Karizma XMR", 180000], ["Triumph Speed 400", 240000]
  ]],
  ["Laptops", "💻", images.laptop, [
    ["Dell Inspiron 15", 36000], ["Dell XPS 13", 85000], ["HP Pavilion 14", 48000], ["HP Victus Gaming", 72000], ["Lenovo IdeaPad Slim 5", 52000],
    ["Lenovo Legion 5", 95000], ["Apple MacBook Air M1", 65000], ["Apple MacBook Air M2", 85000], ["Apple MacBook Pro M3", 145000], ["Asus Vivobook 15", 42000],
    ["Asus ROG Strix G16", 125000], ["Acer Aspire 5", 38000], ["Acer Nitro V", 76000], ["Microsoft Surface Laptop 5", 90000], ["Samsung Galaxy Book 3", 72000],
    ["MSI Modern 14", 55000], ["MSI Katana Gaming", 88000], ["LG Gram 16", 110000], ["Razer Blade 15", 160000], ["Chuwi HeroBook", 22000],
    ["Dell Latitude 5420", 45000], ["HP Envy x360", 68000], ["Lenovo ThinkPad E14", 58000], ["Acer Swift Go", 62000], ["Asus Zenbook 14", 78000]
  ]]
];

export const starterProducts = products.flatMap(([category, emoji, defaultImage, names], categoryIndex) => 
  names.map(([title, price], productIndex) => {
    let customImage = defaultImage;
    
    // Assign specific images based on keywords in the product title
    if (title.toLowerCase().includes("iphone")) customImage = images.iphone;
    else if (title.toLowerCase().includes("samsung")) customImage = images.samsung;
    else if (title.toLowerCase().includes("fortuner") || title.toLowerCase().includes("scorpio") || title.toLowerCase().includes("thar")) customImage = images.suv;
    else if (title.toLowerCase().includes("ninja") || title.toLowerCase().includes("ktm") || title.toLowerCase().includes("r15")) customImage = images.sportbike;
    else if (title.toLowerCase().includes("macbook")) customImage = images.macbook;

    return {
      id: categoryIndex * 25 + productIndex + 1,
      title,
      price,
      category,
      seller: sellers[(categoryIndex * 25 + productIndex) % sellers.length],
      emoji,
      image: customImage,
      description: `${title} in good condition. Seller has added product details for buyers.`
    };
  })
);