require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hungry-birds';

const menuItems = [
  // ── STARTERS ──────────────────────────────────────────────────────────────
  {
    name: 'Veg Spring Rolls',
    category: 'Starters',
    price: 120,
    isVeg: true,
    isPopular: false,
    spiceLevel: 'Mild',
    description: 'Crispy golden rolls packed with seasoned vegetables and glass noodles',
    image: 'https://images.pexels.com/photos/5908226/pexels-photo-5908226.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.1
  },
  {
    name: 'Chicken 65',
    category: 'Starters',
    price: 199,
    isVeg: false,
    isPopular: true,
    spiceLevel: 'Hot',
    description: 'Deep-fried spicy chicken marinated in red chili and curry leaves — a Hyderabadi classic',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.5
  },
  {
    name: 'Paneer Tikka',
    category: 'Starters',
    price: 179,
    isVeg: true,
    isPopular: true,
    spiceLevel: 'Medium',
    description: 'Marinated cottage cheese cubes grilled to perfection in a tandoor with bell peppers',
    image: 'https://images.pexels.com/photos/9609842/pexels-photo-9609842.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.3
  },
  {
    name: 'Gobi Manchurian',
    category: 'Starters',
    price: 149,
    isVeg: true,
    isPopular: false,
    spiceLevel: 'Medium',
    description: 'Crispy cauliflower florets tossed in a tangy Indo-Chinese sauce',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.0
  },
  {
    name: 'Mutton Seekh Kebab',
    category: 'Starters',
    price: 249,
    isVeg: false,
    isPopular: true,
    spiceLevel: 'Hot',
    description: 'Minced mutton skewers with aromatic spices, fresh herbs grilled over charcoal',
    image: 'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.6
  },

  // ── BIRYANI ───────────────────────────────────────────────────────────────
  {
    name: 'Chicken Biryani',
    category: 'Biryani',
    price: 220,
    isVeg: false,
    isPopular: true,
    spiceLevel: 'Medium',
    description: 'Fragrant basmati rice cooked with tender chicken pieces, saffron & whole spices',
    image: 'https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7
  },
  {
    name: 'Mutton Biryani',
    category: 'Biryani',
    price: 299,
    isVeg: false,
    isPopular: true,
    spiceLevel: 'Hot',
    description: 'Slow-cooked dum biryani with succulent mutton pieces in aromatic Andhra style',
    image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8
  },
  {
    name: 'Veg Biryani',
    category: 'Biryani',
    price: 180,
    isVeg: true,
    isPopular: false,
    spiceLevel: 'Mild',
    description: 'Garden fresh vegetables layered with basmati rice, caramelized onions & fried cashews',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.0
  },
  {
    name: 'Prawn Biryani',
    category: 'Biryani',
    price: 320,
    isVeg: false,
    isPopular: true,
    spiceLevel: 'Hot',
    description: 'Juicy coastal prawns marinated in bold spices, dum-cooked with aged basmati',
    image: 'https://images.pexels.com/photos/8992923/pexels-photo-8992923.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.5
  },
  {
    name: 'Egg Biryani',
    category: 'Biryani',
    price: 160,
    isVeg: false,
    isPopular: false,
    spiceLevel: 'Medium',
    description: 'Halved boiled eggs on a bed of spiced fragrant rice with mint & coriander',
    image: 'https://images.pexels.com/photos/6941028/pexels-photo-6941028.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.1
  },

  // ── TANDOORI ──────────────────────────────────────────────────────────────
  {
    name: 'Tandoori Chicken (Full)',
    category: 'Tandoori',
    price: 380,
    isVeg: false,
    isPopular: true,
    spiceLevel: 'Hot',
    description: 'Whole chicken marinated in yoghurt & spices, roasted in a clay oven till charred perfection',
    image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7
  },
  {
    name: 'Tandoori Chicken (Half)',
    category: 'Tandoori',
    price: 199,
    isVeg: false,
    isPopular: false,
    spiceLevel: 'Hot',
    description: 'Half chicken with signature red marinade, mint chutney & onion rings',
    image: 'https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.4
  },
  {
    name: 'Paneer Tikka Masala Skewer',
    category: 'Tandoori',
    price: 229,
    isVeg: true,
    isPopular: false,
    spiceLevel: 'Medium',
    description: 'Skewered cottage cheese with capsicum & onion grilled with malai marinade',
    image: 'https://images.pexels.com/photos/9785880/pexels-photo-9785880.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.2
  },
  {
    name: 'Murgh Malai Kebab',
    category: 'Tandoori',
    price: 279,
    isVeg: false,
    isPopular: true,
    spiceLevel: 'Mild',
    description: 'Creamy, melt-in-mouth chicken kebabs with cashew & cream marinade',
    image: 'https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.6
  },

  // ── MAIN COURSE ───────────────────────────────────────────────────────────
  {
    name: 'Butter Chicken',
    category: 'Main Course',
    price: 260,
    isVeg: false,
    isPopular: true,
    spiceLevel: 'Mild',
    description: 'Succulent chicken in rich tomato-cream sauce with butter and kasuri methi',
    image: 'https://images.pexels.com/photos/12737707/pexels-photo-12737707.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7
  },
  {
    name: 'Dal Makhani',
    category: 'Main Course',
    price: 189,
    isVeg: true,
    isPopular: false,
    spiceLevel: 'Mild',
    description: 'Slow-cooked black lentils in a silky butter-cream sauce, a North Indian favourite',
    image: 'https://images.pexels.com/photos/7353380/pexels-photo-7353380.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.2
  },
  {
    name: 'Palak Paneer',
    category: 'Main Course',
    price: 199,
    isVeg: true,
    isPopular: false,
    spiceLevel: 'Mild',
    description: 'Fresh spinach puree with soft paneer cubes in an aromatic gravy',
    image: 'https://images.pexels.com/photos/6260921/pexels-photo-6260921.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.1
  },
  {
    name: 'Mutton Rogan Josh',
    category: 'Main Course',
    price: 320,
    isVeg: false,
    isPopular: true,
    spiceLevel: 'Hot',
    description: 'Tender mutton slow-cooked with Kashmiri red chilies, fennel & whole spices',
    image: 'https://images.pexels.com/photos/5836401/pexels-photo-5836401.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.6
  },
  {
    name: 'Chicken Tikka Masala',
    category: 'Main Course',
    price: 269,
    isVeg: false,
    isPopular: true,
    spiceLevel: 'Medium',
    description: 'Grilled chicken tikka pieces simmered in a spiced tomato masala sauce',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.5
  },
  {
    name: 'Veg Hakka Noodles',
    category: 'Main Course',
    price: 159,
    isVeg: true,
    isPopular: false,
    spiceLevel: 'Medium',
    description: 'Wok-tossed noodles with crunchy vegetables in Indo-Chinese soy sauce',
    image: 'https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.0
  },
  {
    name: 'Chicken Fried Rice',
    category: 'Main Course',
    price: 189,
    isVeg: false,
    isPopular: false,
    spiceLevel: 'Medium',
    description: 'Fragrant fried rice with shredded chicken, scrambled egg & spring onions',
    image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.3
  },

  // ── BEVERAGES ─────────────────────────────────────────────────────────────
  {
    name: 'Mango Lassi',
    category: 'Beverages',
    price: 89,
    isVeg: true,
    isPopular: true,
    spiceLevel: 'Mild',
    description: 'Thick, chilled yoghurt blended with Alphonso mango pulp and a pinch of cardamom',
    image: 'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.5
  },
  {
    name: 'Masala Chai',
    category: 'Beverages',
    price: 49,
    isVeg: true,
    isPopular: false,
    spiceLevel: 'Mild',
    description: 'Aromatic spiced tea brewed with ginger, cardamom, cinnamon & fresh milk',
    image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.4
  },
  {
    name: 'Fresh Lime Soda',
    category: 'Beverages',
    price: 59,
    isVeg: true,
    isPopular: false,
    spiceLevel: 'Mild',
    description: 'Chilled soda with freshly squeezed lime, black salt and mint — sweet or salted',
    image: 'https://images.pexels.com/photos/1194030/pexels-photo-1194030.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.2
  },
  {
    name: 'Cold Coffee',
    category: 'Beverages',
    price: 99,
    isVeg: true,
    isPopular: false,
    spiceLevel: 'Mild',
    description: 'Creamy blended coffee with milk and vanilla ice cream — café style',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.3
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing menu items');

    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`🌱 Seeded ${inserted.length} menu items successfully!\n`);

    const categories = [...new Set(menuItems.map((i) => i.category))];
    categories.forEach((cat) => {
      const count = menuItems.filter((i) => i.category === cat).length;
      console.log(`   ${cat}: ${count} items`);
    });
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Done. MongoDB disconnected.');
  }
}

seed();
