// Seed Products Script
// Populates database with 30 products in 3 categories:
// - Équipement Tactique & Paramilitaire (8 products)
// - Nutrition & Suppléments (8 products)
// - Équipement Sport & Combat (10 products)

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
dotenv.config({ path: './backend/.env' });

// Product Schema (must match backend/index.js)
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

// 30 products catalog
const products = [
  // ========== ÉQUIPEMENT TACTIQUE & PARAMILITAIRE (8 produits) ==========
  {
    name: 'Gilet Tactique Multi-Poches',
    description: 'Gilet tactique professionnel avec système MOLLE, 12 poches modulables, construction en nylon 1000D résistant à l\'eau. Bretelles réglables et panneau dorsal ventilé pour un confort maximal. Idéal pour l\'outdoor, l\'airsoft et les entraînements tactiques.',
    price: 89.99,
    category: 'Équipement Tactique',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1585076800984-66ba9b56e6f4?w=500'
  },
  {
    name: 'Casque Tactique Protection',
    description: 'Casque de protection balistique niveau IIIA, coque ABS haute densité avec système de suspension interne ajustable. Rails latéraux pour accessoires, padding confortable et sangle mentonnière renforcée. Protection optimale pour entraînements intensifs.',
    price: 149.99,
    category: 'Équipement Tactique',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=500'
  },
  {
    name: 'Pantalon Cargo Tactique',
    description: 'Pantalon cargo militaire en tissu ripstop renforcé, 8 poches dont 2 cargo avec fermeture velcro. Genoux renforcés avec emplacements pour protections. Taille élastique et ceinture intégrée. Coupe ergonomique pour mobilité maximale.',
    price: 69.99,
    category: 'Équipement Tactique',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500'
  },
  {
    name: 'Holster Cuisse Universel',
    description: 'Holster de cuisse ajustable pour pistolet, fixation par sangles réglables avec système de largage rapide. Compatible avec la plupart des armes de poing. Poches additionnelles pour chargeurs. Construction robuste en nylon balistique.',
    price: 44.99,
    category: 'Équipement Tactique',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=500'
  },
  {
    name: 'Bottes Tactiques Militaires',
    description: 'Bottes militaires 8 pouces, cuir pleine fleur imperméable et nylon balistique. Semelle antidérapante Vibram, protection orteil composite. Membrane respirante et isolation thermique. Maintien de cheville renforcé pour terrains difficiles.',
    price: 119.99,
    category: 'Équipement Tactique',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500'
  },
  {
    name: 'Gants Tactiques Pro',
    description: 'Gants tactiques renforcés, paume en cuir synthétique antidérapant, dos en lycra respirant. Protection des articulations, compatibles écrans tactiles. Fermeture velcro au poignet. Parfaits pour le tir, la conduite et les activités outdoor.',
    price: 34.99,
    category: 'Équipement Tactique',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1544923246-77307d671f2c?w=500'
  },
  {
    name: 'Sac à Dos Militaire 45L',
    description: 'Sac à dos tactique 45L avec système MOLLE externe, compartiments multiples avec séparateurs amovibles. Dos et bretelles rembourrés, sangle ventrale et pectorale. Hydratation compatible. Construction ultra-résistante pour missions longue durée.',
    price: 99.99,
    category: 'Équipement Tactique',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
  },
  {
    name: 'Ceinture Tactique Rigide',
    description: 'Ceinture militaire rigide 1.75 pouces, boucle cobra en aluminium aviation. Supporte jusqu\'à 2000kg de charge. Réglable et coupe rapide. Idéale pour porter holster, pochettes et équipement lourd. Tissage haute résistance.',
    price: 39.99,
    category: 'Équipement Tactique',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1566308855-05bdb0a0e859?w=500'
  },

  // ========== NUTRITION & SUPPLÉMENTS (8 produits) ==========
  {
    name: 'Protéine Whey Isolate Pro 2kg',
    description: 'Isolat de whey ultra-pur 90% de protéines, absorption rapide post-entraînement. Sans lactose, faible en glucides et lipides. Enrichie en BCAA et glutamine. Goût chocolat intense. Parfaite pour la récupération musculaire et la prise de masse sèche.',
    price: 59.99,
    category: 'Nutrition',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500'
  },
  {
    name: 'BCAA Complex 8:1:1',
    description: 'Acides aminés BCAA ratio optimal 8:1:1 (Leucine:Isoleucine:Valine). Formule enrichie en vitamines B6 et B12 pour réduire la fatigue. 500g - 50 portions. Goût citron. Réduit le catabolisme musculaire et accélère la récupération.',
    price: 34.99,
    category: 'Nutrition',
    stock: 38,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500'
  },
  {
    name: 'Créatine Monohydrate',
    description: 'Créatine monohydrate pure micronisée 200 mesh, sans additifs. 500g - 100 portions de 5g. Améliore force, puissance et volume musculaire. Favorise la récupération entre les séries. Qualité pharmaceutique testée en laboratoire.',
    price: 24.99,
    category: 'Nutrition',
    stock: 52,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500'
  },
  {
    name: 'Multivitamines Militaire Complex',
    description: 'Complexe multivitaminé spécial performance physique intense. 25 vitamines et minéraux essentiels, extraits de plantes adaptogènes (rhodiola, ginseng). Soutient système immunitaire, concentration et résistance au stress. 90 capsules.',
    price: 29.99,
    category: 'Nutrition',
    stock: 41,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500'
  },
  {
    name: 'Pre-Workout Extreme',
    description: 'Booster pre-entraînement haute intensité: caféine 250mg, bêta-alanine, citrulline malate, taurine. Énergie explosive, focus mental, congestion musculaire maximale. Goût fruits rouges. 300g - 30 portions. Performance garantie!',
    price: 39.99,
    category: 'Nutrition',
    stock: 33,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500'
  },
  {
    name: 'Oméga-3 Fish Oil 2000mg',
    description: 'Huile de poisson concentrée 2000mg par dose, EPA 660mg + DHA 440mg. Favorise santé cardiovasculaire, articulations et fonctions cognitives. Capsules sans goût de poisson. 120 softgels. Pêche durable certifiée.',
    price: 27.99,
    category: 'Nutrition',
    stock: 47,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500'
  },
  {
    name: 'Barres Protéinées Combat Pack 12',
    description: 'Pack de 12 barres protéinées 20g de protéines par barre. Enrobage chocolat, cœur caramel-cacahuètes. Faible en sucre, riche en fibres. Snack idéal entre les repas ou post-entraînement. Format compact pour transport facile.',
    price: 24.99,
    category: 'Nutrition',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500'
  },
  {
    name: 'Glutamine Pure 500g',
    description: 'L-Glutamine pure qualité pharmaceutique. Acide aminé essentiel pour récupération musculaire et système immunitaire. Réduit les courbatures, améliore la synthèse protéique. Neutre sans goût, se mélange facilement. 500g - 100 portions.',
    price: 29.99,
    category: 'Nutrition',
    stock: 36,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500'
  },

  // ========== ÉQUIPEMENT SPORT & COMBAT (10 produits) ==========
  {
    name: 'Kettlebell Competition 16kg',
    description: 'Kettlebell compétition 16kg, fonte d\'acier avec finition lisse. Poignée ergonomique diamètre standard 35mm. Base plate stable. Idéale pour swings, snatches, cleans et entraînement fonctionnel. Qualité professionnelle gym et crossfit.',
    price: 54.99,
    category: 'Sport & Combat',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'
  },
  {
    name: 'Corde à Sauter Combat Speed',
    description: 'Corde à sauter vitesse professionnelle, câble en acier gainé PVC. Poignées ergonomiques avec roulements à billes pour rotation fluide. Longueur ajustable 3m. Parfaite pour cardio, double-unders, entraînement boxe. Légère et durable.',
    price: 19.99,
    category: 'Sport & Combat',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'
  },
  {
    name: 'Sac de Frappe 120cm',
    description: 'Sac de frappe suspendu 120cm, toile synthétique renforcée ultra-résistante. Rembourrage haute densité multi-couches. Diamètre 35cm, poids 35kg environ. Fixations renforcées. Pour boxe, muay-thai, MMA. Livré non rempli.',
    price: 129.99,
    category: 'Sport & Combat',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500'
  },
  {
    name: 'Gants de Boxe Pro 14oz',
    description: 'Gants de boxe professionnels 14oz, cuir synthétique premium. Rembourrage mousse multi-densité pour absorption optimale. Fermeture velcro large, pouce attaché. Ventilation intégrée. Parfaits pour sparring et entraînement intensif.',
    price: 69.99,
    category: 'Sport & Combat',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500'
  },
  {
    name: 'Gilet Lesté Ajustable 20kg',
    description: 'Gilet lesté ajustable de 5 à 20kg, poids amovibles par blocs de 1kg. Sangles réglables épaules et taille, néoprène confortable. Répartition équilibrée du poids. Idéal pour musculation, course, crossfit. Augmente intensité des entraînements.',
    price: 89.99,
    category: 'Sport & Combat',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'
  },
  {
    name: 'Bandes de Résistance Set Pro',
    description: 'Set 5 bandes élastiques résistance progressive 5-50kg. Latex naturel ultra-résistant, poignées ergonomiques mousses. Ancrage porte, sangles chevilles inclus. Pochette transport. Parfait pour musculation maison, rééducation, mobilité.',
    price: 34.99,
    category: 'Sport & Combat',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'
  },
  {
    name: 'Tapis de Sol Tactique XL',
    description: 'Tapis entraînement extra-large 180x60cm épaisseur 15mm. Mousse NBR haute densité, antidérapant double face. Motif camouflage tactique. Résistant eau et sueur. Sangle transport incluse. Pour yoga, stretching, exercices au sol, camping.',
    price: 39.99,
    category: 'Sport & Combat',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500'
  },
  {
    name: 'Chronomètre Interval Training',
    description: 'Timer programmable pour entraînement par intervalles (HIIT, Tabata, EMOM). Écran LED large, mode compte à rebours et chrono. 99 intervalles programmables. Alarme sonore puissante. Fixation murale ou portable. Pile incluse.',
    price: 44.99,
    category: 'Sport & Combat',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500'
  },
  {
    name: 'Sangles TRX Suspension Pro',
    description: 'Système d\'entraînement suspension TRX professionnel. Sangles nylon militaire ajustables, poignées et cale-pieds rembourrés. Ancrage porte et extérieur inclus. Plus de 300 exercices possibles. Poids supporté: 180kg. Pochette transport.',
    price: 99.99,
    category: 'Sport & Combat',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'
  },
  {
    name: 'Battle Rope 15m',
    description: 'Corde d\'entraînement ondulatoire 15m diamètre 38mm. Fibres synthétiques ultra-résistantes à l\'usure. Extrémités thermoscellées anti-effilochage. Poids 8kg. Exercice complet cardio et force. Pour crossfit, préparation physique intense.',
    price: 79.99,
    category: 'Sport & Combat',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/workoutbrothers';
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if products already exist
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Database already contains ${existingCount} products`);
      console.log('Skipping seed to avoid duplicates. Delete existing products first if you want to re-seed.');
      await mongoose.connection.close();
      return;
    }

    // Insert products
    console.log(`📦 Inserting ${products.length} products...`);
    const result = await Product.insertMany(products);
    console.log(`✅ Successfully inserted ${result.length} products!`);

    // Display summary
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    console.log('\n📊 Products by category:');
    categories.forEach(cat => {
      console.log(`  - ${cat._id}: ${cat.count} products`);
    });

    console.log('\n✅ Seed completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts, products };
