// WorkoutBrothers - Product Seeding Script
// Seeds the database with tactical gear, nutrition supplements, and sports equipment
// 
// BUSINESS MODEL: Dropshipping / Print-on-Demand / White Label
// - Textile: POD via Printful (stock illimité = 9999)
// - Nutrition: White label Bulk Powders (stock géré manuellement)
// - Équipement: Dropshipping CJDropshipping (stock illimité = 9999)
// 
// Tous les produits portent la marque WorkoutBrothers avec logo personnage masqué + haltères

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Product Schema (matching backend/index.js)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      userId: String,
      username: String,
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

// Product data organized by category
const products = [
  // TACTICAL & PARAMILITARY GEAR
  {
    name: 'Gilet Tactique Multi-Poches',
    description: 'Gilet tactique professionnel avec système MOLLE, 12 poches modulaires. Idéal pour l\'entraînement outdoor et les opérations sur le terrain. Construction en nylon 1000D résistant à l\'eau. Ajustable pour toutes morphologies.',
    price: 89.99,
    category: 'Équipement Tactique',
    stock: 50,
    image: '/images/tactical-vest.jpg',
  },
  {
    name: 'Casque Tactique de Protection',
    description: 'Casque balistique niveau IIIA, léger et résistant. Système de fixation rail pour accessoires. Padding intérieur confortable pour sessions prolongées. Norme militaire.',
    price: 149.99,
    category: 'Équipement Tactique',
    stock: 30,
    image: '/images/tactical-helmet.jpg',
  },
  {
    name: 'Pantalon Cargo Tactique Renforcé',
    description: 'Pantalon cargo multipoches en tissu ripstop résistant. Genoux renforcés, ceinture élastique. 8 poches fonctionnelles. Parfait pour entraînement intensif et terrain accidenté.',
    price: 69.99,
    category: 'Textile Tactique',
    stock: 100,
    image: '/images/tactical-pants.jpg',
  },
  {
    name: 'Holster de Cuisse Universel',
    description: 'Holster drop-leg ajustable, compatible avec la plupart des modèles. Système de fixation rapide, sangles anti-glisse. Matériaux durables pour usage intensif.',
    price: 44.99,
    category: 'Équipement Tactique',
    stock: 75,
    image: '/images/holster.jpg',
  },
  {
    name: 'Bottes Tactiques Militaires',
    description: 'Bottes militaires haute performance, semelle antidérapante Vibram. Résistantes à l\'eau, respirantes. Support de cheville renforcé. Confort optimal pour marches longues.',
    price: 119.99,
    category: 'Textile Tactique',
    stock: 60,
    image: '/images/tactical-boots.jpg',
  },
  {
    name: 'Gants Tactiques Pro',
    description: 'Gants tactiques renforcés, protection des phalanges. Paumes antidérapantes, compatibles écrans tactiles. Respirants et résistants à l\'abrasion.',
    price: 34.99,
    category: 'Équipement Tactique',
    stock: 120,
    image: '/images/tactical-gloves.jpg',
  },
  {
    name: 'Sac à Dos Militaire 45L',
    description: 'Sac militaire grande capacité avec système MOLLE. Compartiments multiples, hydratation compatible. Sangles de compression, dos rembourré ergonomique.',
    price: 99.99,
    category: 'Équipement Tactique',
    stock: 45,
    image: '/images/military-backpack.jpg',
  },
  {
    name: 'Ceinture Tactique Rigide',
    description: 'Ceinture tactique rigide avec boucle cobra. Charge maximale 2000kg. Système de fixation rapide pour accessoires. Nylon militaire haute résistance.',
    price: 39.99,
    category: 'Équipement Tactique',
    stock: 90,
    image: '/images/tactical-belt.jpg',
  },

  // NUTRITION & SUPPLEMENTS
  {
    name: 'Protéine Whey Isolate Pro 2kg',
    description: 'Protéine whey isolate ultra-pure 90%. 25g de protéines par dose, très faible en lactose. Parfait pour la récupération musculaire et la prise de masse. Saveur chocolat.',
    price: 59.99,
    category: 'Nutrition & Suppléments',
    stock: 150,
    image: '/images/whey-protein.jpg',
  },
  {
    name: 'BCAA Complex 8:1:1',
    description: 'Acides aminés branchés ratio 8:1:1 optimisé. Favorise la récupération, réduit la fatigue musculaire. Sans sucre, 400g - 40 portions.',
    price: 34.99,
    category: 'Nutrition & Suppléments',
    stock: 180,
    image: '/images/bcaa.jpg',
  },
  {
    name: 'Créatine Monohydrate Micronisée',
    description: 'Créatine monohydrate pure à 99.9%. Améliore force et performance. Micronisée pour absorption optimale. 500g - 100 portions de 5g.',
    price: 24.99,
    category: 'Nutrition & Suppléments',
    stock: 200,
    image: '/images/creatine.jpg',
  },
  {
    name: 'Multivitamines Militaire Complex',
    description: 'Formule complète 30 vitamines et minéraux. Spécialement conçu pour sportifs et opérationnels. Énergie, immunité, récupération. 90 capsules.',
    price: 29.99,
    category: 'Nutrition & Suppléments',
    stock: 160,
    image: '/images/multivitamin.jpg',
  },
  {
    name: 'Pre-Workout Extreme',
    description: 'Booster pre-workout haute intensité. Caféine, beta-alanine, citrulline. Énergie explosive, focus mental, congestion musculaire. 30 doses.',
    price: 39.99,
    category: 'Nutrition & Suppléments',
    stock: 130,
    image: '/images/pre-workout.jpg',
  },
  {
    name: 'Oméga-3 Fish Oil 2000mg',
    description: 'Huile de poisson premium EPA/DHA. Santé cardiovasculaire, articulations, récupération. 120 capsules softgel hautement concentrées.',
    price: 27.99,
    category: 'Nutrition & Suppléments',
    stock: 170,
    image: '/images/omega3.jpg',
  },
  {
    name: 'Barres Protéinées Combat - Pack 12',
    description: 'Barres protéinées haute énergie 20g de protéines. Parfait pour terrain ou déplacement. Saveurs assorties, faible en sucre. Pack de 12 barres.',
    price: 24.99,
    category: 'Nutrition & Suppléments',
    stock: 100,
    image: '/images/protein-bars.jpg',
  },
  {
    name: 'Glutamine Pure 500g',
    description: 'L-Glutamine pure à 100%. Récupération musculaire, système immunitaire, santé intestinale. 100 portions de 5g. Sans additifs.',
    price: 29.99,
    category: 'Nutrition & Suppléments',
    stock: 140,
    image: '/images/glutamine.jpg',
  },

  // SPORTS & COMBAT EQUIPMENT
  {
    name: 'Kettlebell Competition 16kg',
    description: 'Kettlebell professionnel standard compétition. Fonte solide, poignée ergonomique. Idéal pour force fonctionnelle et conditioning.',
    price: 54.99,
    category: 'Équipement Sport',
    stock: 80,
    image: '/images/kettlebell.jpg',
  },
  {
    name: 'Corde à Sauter Combat Speed',
    description: 'Corde à sauter professionnelle roulements à billes. Câble acier gainé, poignées ergonomiques. Longueur ajustable. Pour cardio et coordination.',
    price: 19.99,
    category: 'Équipement Sport',
    stock: 200,
    image: '/images/jump-rope.jpg',
  },
  {
    name: 'Sac de Frappe 120cm',
    description: 'Sac de frappe professionnel 35kg. Cuir synthétique renforcé, chaîne robuste incluse. Pour Muay Thai, boxe, MMA. Idéal entraînement intensif.',
    price: 129.99,
    category: 'Équipement Sport',
    stock: 40,
    image: '/images/punching-bag.jpg',
  },
  {
    name: 'Gants de Boxe Pro 14oz',
    description: 'Gants de boxe cuir véritable, rembourrage multicouche. Protection optimale, fermeture velcro. Pour sparring et entraînement. 14oz.',
    price: 69.99,
    category: 'Équipement Sport',
    stock: 70,
    image: '/images/boxing-gloves.jpg',
  },
  {
    name: 'Gilet Lesté Ajustable 20kg',
    description: 'Gilet lesté professionnel ajustable 5-20kg. Poids amovibles par 1kg. Distribue uniformément la charge. Pour conditioning et force.',
    price: 89.99,
    category: 'Équipement Sport',
    stock: 55,
    image: '/images/weighted-vest.jpg',
  },
  {
    name: 'Bandes de Résistance Set Pro',
    description: 'Set 5 bandes élastiques résistance progressive (5-50kg). Mousquetons métal, poignées confort. Parfait musculation fonctionnelle et rééducation.',
    price: 34.99,
    category: 'Équipement Sport',
    stock: 110,
    image: '/images/resistance-bands.jpg',
  },
  {
    name: 'Tapis de Sol Tactique XL',
    description: 'Tapis entraînement haute densité 15mm. Surface antidérapante, facile à nettoyer. 180x60cm. Pour fitness, yoga, stretching, core training.',
    price: 39.99,
    category: 'Équipement Sport',
    stock: 95,
    image: '/images/exercise-mat.jpg',
  },
  {
    name: 'Chronomètre Interval Training',
    description: 'Timer professionnel pour HIIT et interval training. Grand écran LED, programmable. Alarmes sonores puissantes. Batterie longue durée.',
    price: 44.99,
    category: 'Équipement Sport',
    stock: 85,
    image: '/images/interval-timer.jpg',
  },
  {
    name: 'Sangles TRX Suspension Pro',
    description: 'Système suspension training professionnel. Ancrage porte et extérieur inclus. Entraînement complet corps au poids de corps. Portable.',
    price: 99.99,
    category: 'Équipement Sport',
    stock: 65,
    image: '/images/trx-straps.jpg',
  },
  {
    name: 'Battle Rope 15m',
    description: 'Corde de combat 15 mètres, diamètre 38mm. Nylon tressé ultra-résistant. Extrémités protégées. Pour conditioning et explosivité.',
    price: 79.99,
    category: 'Équipement Sport',
    stock: 50,
    image: '/images/battle-rope.jpg',
  },
];

// Database connection and seeding
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workoutbrothers', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({});
    // console.log('🗑️  Cleared existing products');

    // Insert products
    const result = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${result.length} products!`);

    // Display summary by category
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' },
        },
      },
    ]);

    console.log('\n📊 Products by category:');
    categories.forEach((cat) => {
      console.log(`  - ${cat._id}: ${cat.count} products, ${cat.totalStock} items in stock`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();
