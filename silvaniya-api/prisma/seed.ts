import { PrismaClient, AdminRole, CouponType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// High-quality jewellery images from Unsplash
const images = {
  rings: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&q=80',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80',
    'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800&q=80',
  ],
  earrings: [
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',
    'https://images.unsplash.com/photo-1588444650733-d0090c1c4f9c?w=800&q=80',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
    'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
    'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    'https://images.unsplash.com/photo-1561172497-8f5d06329747?w=800&q=80',
  ],
  necklaces: [
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
    'https://images.unsplash.com/photo-1599459183200-59c3f8ea3096?w=800&q=80',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
    'https://images.unsplash.com/photo-1611107683227-e9060eccd846?w=800&q=80',
    'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&q=80',
  ],
  bracelets: [
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    'https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?w=800&q=80',
    'https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?w=800&q=80',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',
  ],
  anklets: [
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',
    'https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?w=800&q=80',
  ],
  pendants: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    'https://images.unsplash.com/photo-1599459183200-59c3f8ea3096?w=800&q=80',
  ],
  nosePins: [
    'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
    'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80',
  ],
  coins: [
    'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80',
    'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?w=800&q=80',
    'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&q=80',
  ],
  categories: {
    rings: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
    earrings: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    necklaces: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80',
    bracelets: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80',
    anklets: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
    pendants: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    nosePins: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80',
    silverCoins: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&q=80',
    mangalsutra: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80',
    mensJewellery: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
  },
};

// Product data for each category
const productsData = {
  rings: [
    { name: 'Amethyst Solitaire Ring', slug: 'amethyst-solitaire-ring', shortDesc: 'Stunning 925 silver with natural amethyst', basePrice: 2499, compareAtPrice: 2999, isNew: true, isFeatured: true },
    { name: 'Pearl Twist Band Ring', slug: 'pearl-twist-band-ring', shortDesc: 'Elegant twisted band with freshwater pearl', basePrice: 1899, compareAtPrice: 2299, isNew: true, isFeatured: true },
    { name: 'Minimalist Stacking Ring Set', slug: 'minimalist-stacking-ring-set', shortDesc: 'Set of 3 delicate stackable rings', basePrice: 1499, compareAtPrice: 1899, isNew: false, isFeatured: true },
    { name: 'Moonstone Oval Ring', slug: 'moonstone-oval-ring', shortDesc: 'Enchanting moonstone in silver setting', basePrice: 2799, compareAtPrice: 3299, isNew: true, isFeatured: false },
    { name: 'Vintage Filigree Ring', slug: 'vintage-filigree-ring', shortDesc: 'Intricate filigree design', basePrice: 3299, compareAtPrice: 3999, isNew: false, isFeatured: true },
    { name: 'Sapphire Cluster Ring', slug: 'sapphire-cluster-ring', shortDesc: 'Blue sapphire cluster design', basePrice: 4499, compareAtPrice: 5299, isNew: true, isFeatured: true },
    { name: 'Rose Quartz Heart Ring', slug: 'rose-quartz-heart-ring', shortDesc: 'Romantic heart-shaped rose quartz', basePrice: 1999, compareAtPrice: 2499, isNew: true, isFeatured: false },
    { name: 'Oxidized Tribal Ring', slug: 'oxidized-tribal-ring', shortDesc: 'Bold oxidized tribal design', basePrice: 999, compareAtPrice: 1299, isNew: false, isFeatured: true },
  ],
  earrings: [
    { name: 'Pearl Drop Earrings', slug: 'pearl-drop-earrings', shortDesc: 'Classic freshwater pearl drops', basePrice: 1899, compareAtPrice: 2299, isNew: true, isFeatured: true },
    { name: 'Diamond-Cut Hoop Earrings', slug: 'diamond-cut-hoop-earrings', shortDesc: 'Sparkling diamond-cut silver hoops', basePrice: 1499, compareAtPrice: 1799, isNew: false, isFeatured: true },
    { name: 'Traditional Jhumka Earrings', slug: 'traditional-jhumka-earrings', shortDesc: 'Beautiful oxidized silver jhumkas', basePrice: 2699, compareAtPrice: 3199, isNew: true, isFeatured: true },
    { name: 'Minimalist Stud Earrings', slug: 'minimalist-stud-earrings', shortDesc: 'Simple and elegant everyday studs', basePrice: 799, compareAtPrice: 999, isNew: false, isFeatured: false },
    { name: 'Chandelier Drop Earrings', slug: 'chandelier-drop-earrings', shortDesc: 'Statement chandelier drops', basePrice: 3499, compareAtPrice: 4199, isNew: true, isFeatured: true },
    { name: 'Kundan Stud Earrings', slug: 'kundan-stud-earrings', shortDesc: 'Traditional kundan work studs', basePrice: 2199, compareAtPrice: 2699, isNew: true, isFeatured: false },
    { name: 'Threader Earrings', slug: 'threader-earrings', shortDesc: 'Delicate chain threader earrings', basePrice: 1299, compareAtPrice: 1599, isNew: false, isFeatured: true },
    { name: 'Peacock Feather Earrings', slug: 'peacock-feather-earrings', shortDesc: 'Intricate peacock feather design', basePrice: 1999, compareAtPrice: 2499, isNew: true, isFeatured: false },
  ],
  necklaces: [
    { name: 'Elegant Chain Necklace', slug: 'elegant-chain-necklace', shortDesc: 'Delicate silver chain for everyday', basePrice: 1299, compareAtPrice: 1599, isNew: false, isFeatured: true },
    { name: 'Teardrop Pendant Necklace', slug: 'teardrop-pendant-necklace', shortDesc: 'Stunning teardrop crystal pendant', basePrice: 2199, compareAtPrice: 2699, isNew: true, isFeatured: true },
    { name: 'Layered Chain Set', slug: 'layered-chain-set', shortDesc: 'Set of 3 layering chains', basePrice: 2499, compareAtPrice: 2999, isNew: true, isFeatured: true },
    { name: 'Temple Necklace Set', slug: 'temple-necklace-set', shortDesc: 'Traditional temple jewelry design', basePrice: 5999, compareAtPrice: 7499, isNew: false, isFeatured: true },
    { name: 'Heart Pendant Necklace', slug: 'heart-pendant-necklace', shortDesc: 'Romantic heart-shaped pendant', basePrice: 1599, compareAtPrice: 1999, isNew: true, isFeatured: false },
    { name: 'Coin Pendant Necklace', slug: 'coin-pendant-necklace', shortDesc: 'Vintage coin pendant on chain', basePrice: 1899, compareAtPrice: 2299, isNew: false, isFeatured: true },
    { name: 'Choker Necklace', slug: 'silver-choker-necklace', shortDesc: 'Sleek silver choker design', basePrice: 2299, compareAtPrice: 2799, isNew: true, isFeatured: false },
    { name: 'Beaded Necklace', slug: 'silver-beaded-necklace', shortDesc: 'Delicate silver beaded necklace', basePrice: 1699, compareAtPrice: 2099, isNew: false, isFeatured: true },
  ],
  bracelets: [
    { name: 'Silver Bangle Bracelet', slug: 'silver-bangle-bracelet', shortDesc: 'Classic polished silver bangle', basePrice: 1999, compareAtPrice: 2499, isNew: false, isFeatured: true },
    { name: 'Heart Charm Bracelet', slug: 'heart-charm-bracelet', shortDesc: 'Delicate chain with heart charms', basePrice: 1699, compareAtPrice: 2099, isNew: true, isFeatured: true },
    { name: 'Tennis Bracelet', slug: 'tennis-bracelet', shortDesc: 'Sparkling CZ tennis bracelet', basePrice: 3999, compareAtPrice: 4799, isNew: true, isFeatured: true },
    { name: 'Oxidized Cuff Bracelet', slug: 'oxidized-cuff-bracelet', shortDesc: 'Bold oxidized silver cuff', basePrice: 2299, compareAtPrice: 2799, isNew: false, isFeatured: true },
    { name: 'Link Chain Bracelet', slug: 'link-chain-bracelet', shortDesc: 'Classic link chain design', basePrice: 1499, compareAtPrice: 1899, isNew: false, isFeatured: false },
    { name: 'Pearl Bracelet', slug: 'pearl-bracelet', shortDesc: 'Freshwater pearl strand bracelet', basePrice: 2199, compareAtPrice: 2699, isNew: true, isFeatured: true },
  ],
  anklets: [
    { name: 'Delicate Chain Anklet', slug: 'delicate-chain-anklet', shortDesc: 'Simple silver chain anklet', basePrice: 799, compareAtPrice: 999, isNew: true, isFeatured: true },
    { name: 'Bell Charm Payal', slug: 'bell-charm-payal', shortDesc: 'Traditional payal with bells', basePrice: 1299, compareAtPrice: 1599, isNew: false, isFeatured: true },
    { name: 'Beaded Anklet', slug: 'beaded-anklet', shortDesc: 'Silver beaded anklet design', basePrice: 899, compareAtPrice: 1199, isNew: true, isFeatured: false },
    { name: 'Butterfly Charm Anklet', slug: 'butterfly-charm-anklet', shortDesc: 'Delicate butterfly charm anklet', basePrice: 1099, compareAtPrice: 1399, isNew: true, isFeatured: true },
  ],
  pendants: [
    { name: 'Om Pendant', slug: 'om-pendant', shortDesc: 'Sacred Om symbol in sterling silver', basePrice: 999, compareAtPrice: 1299, isNew: false, isFeatured: true },
    { name: 'Evil Eye Pendant', slug: 'evil-eye-pendant', shortDesc: 'Protective evil eye charm', basePrice: 1199, compareAtPrice: 1499, isNew: true, isFeatured: true },
    { name: 'Ganesh Pendant', slug: 'ganesh-pendant', shortDesc: 'Lord Ganesh silver pendant', basePrice: 1499, compareAtPrice: 1899, isNew: false, isFeatured: true },
    { name: 'Initial Pendant', slug: 'initial-pendant', shortDesc: 'Personalized initial pendant', basePrice: 899, compareAtPrice: 1199, isNew: true, isFeatured: false },
  ],
  nosePins: [
    { name: 'Diamond Nose Stud', slug: 'diamond-nose-stud', shortDesc: 'Classic diamond nose stud', basePrice: 599, compareAtPrice: 799, isNew: true, isFeatured: true },
    { name: 'Pearl Nose Pin', slug: 'pearl-nose-pin', shortDesc: 'Elegant pearl nose pin', basePrice: 499, compareAtPrice: 699, isNew: false, isFeatured: true },
    { name: 'Oxidized Nose Ring', slug: 'oxidized-nose-ring', shortDesc: 'Traditional oxidized nose ring', basePrice: 699, compareAtPrice: 899, isNew: true, isFeatured: false },
  ],
  silverCoins: [
    { name: '10 Gram Lakshmi Coin', slug: '10-gram-lakshmi-coin', shortDesc: 'Pure 999 silver with Lakshmi design', basePrice: 1299, isNew: false, isFeatured: true },
    { name: '20 Gram Ganesh Coin', slug: '20-gram-ganesh-coin', shortDesc: 'Pure 999 silver with Ganesh design', basePrice: 2499, isNew: false, isFeatured: true },
    { name: '50 Gram Silver Coin', slug: '50-gram-silver-coin', shortDesc: 'Premium 999 silver coin', basePrice: 5999, isNew: false, isFeatured: true },
  ],
};

async function main() {
  console.log('🌱 Starting comprehensive database seed...\n');

  // Clear existing data in correct order
  await prisma.collectionProduct.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.couponProduct.deleteMany();
  await prisma.couponCategory.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderTimeline.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.return.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.stockLog.deleteMany();
  await prisma.variantAttribute.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.attributeValue.deleteMany();
  await prisma.attributeType.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.create({
    data: {
      email: 'admin@silvaniya.com',
      passwordHash: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: AdminRole.SUPER_ADMIN,
    },
  });
  console.log('✅ Created admin user: admin@silvaniya.com');

  // Create Attribute Types
  const sizeType = await prisma.attributeType.create({
    data: { name: 'Size', displayName: 'Ring Size' },
  });

  const weightType = await prisma.attributeType.create({
    data: { name: 'Weight', displayName: 'Weight' },
  });
  console.log('✅ Created attribute types');

  // Create Size Values
  const sizes = ['5', '6', '7', '8', '9', '10', '11', '12'];
  for (const size of sizes) {
    await prisma.attributeValue.create({
      data: { attributeTypeId: sizeType.id, value: size, displayValue: `Size ${size}` },
    });
  }
  console.log('✅ Created size values');

  // Create Weight Values
  const weights = ['10g', '20g', '50g', '100g'];
  for (const weight of weights) {
    await prisma.attributeValue.create({
      data: { attributeTypeId: weightType.id, value: weight, displayValue: weight },
    });
  }
  console.log('✅ Created weight values');

  // Create Categories
  const categoryData = [
    { name: 'Rings', slug: 'rings', description: 'Statement & everyday rings', image: images.categories.rings },
    { name: 'Earrings', slug: 'earrings', description: 'Studs to statement drops', image: images.categories.earrings },
    { name: 'Necklaces', slug: 'necklaces', description: 'Chains & pendants', image: images.categories.necklaces },
    { name: 'Bracelets', slug: 'bracelets', description: 'Bangles & cuffs', image: images.categories.bracelets },
    { name: 'Anklets', slug: 'anklets', description: 'Delicate ankle jewellery', image: images.categories.anklets },
    { name: 'Pendants', slug: 'pendants', description: 'Religious & trendy', image: images.categories.pendants },
    { name: 'Nose Pins', slug: 'nose-pins', description: 'Studs & rings', image: images.categories.nosePins },
    { name: 'Silver Coins', slug: 'silver-coins', description: 'Investment & gifting', image: images.categories.silverCoins },
    { name: 'Mangalsutra', slug: 'mangalsutra', description: 'Traditional bridal', image: images.categories.mangalsutra },
    { name: "Men's Jewellery", slug: 'mens-jewellery', description: 'Rings, chains & bracelets', image: images.categories.mensJewellery },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categoryData) {
    const category = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug, description: cat.description, image: cat.image, isActive: true },
    });
    createdCategories[cat.slug] = category.id;
  }
  console.log('✅ Created categories with images\n');

  // Helper function to create a product
  async function createProduct(
    productData: { name: string; slug: string; shortDesc: string; basePrice: number; compareAtPrice?: number; isNew: boolean; isFeatured: boolean },
    categorySlug: string,
    imageUrl: string,
    hasVariants: boolean = false,
    purity: string = '925'
  ) {
    const categoryId = createdCategories[categorySlug];
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        shortDesc: productData.shortDesc,
        description: `<p>Beautiful ${productData.name} crafted from premium ${purity} sterling silver. Perfect for everyday wear or special occasions.</p><ul><li>${purity} Sterling Silver</li><li>BIS Hallmarked</li><li>Hypoallergenic</li><li>Free shipping</li></ul>`,
        basePrice: productData.basePrice,
        compareAtPrice: productData.compareAtPrice,
        purity,
        isActive: true,
        isFeatured: productData.isFeatured,
        isNew: productData.isNew,
      },
    });

    // Create product-category relationship
    await prisma.productCategory.create({
      data: { productId: product.id, categoryId },
    });

    // Create primary image
    await prisma.productImage.create({
      data: { productId: product.id, url: imageUrl, alt: productData.name, sortOrder: 0, isPrimary: true },
    });

    // Create variants
    if (hasVariants && categorySlug === 'rings') {
      const ringVariantSizes = ['6', '7', '8', '9'];
      for (const size of ringVariantSizes) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: `Size ${size}`,
            sku: `SIL-${categorySlug.toUpperCase()}-${product.id.slice(-4)}-${size}`,
            price: productData.basePrice,
            stock: Math.floor(Math.random() * 15) + 5,
            isActive: true,
          },
        });
      }
    } else if (hasVariants && categorySlug === 'silver-coins') {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: productData.name.includes('10') ? '10g' : productData.name.includes('20') ? '20g' : '50g',
          sku: `SIL-COIN-${product.id.slice(-4)}`,
          price: productData.basePrice,
          stock: Math.floor(Math.random() * 50) + 20,
          isActive: true,
        },
      });
    } else {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: 'Standard',
          sku: `SIL-${categorySlug.toUpperCase().slice(0, 4)}-${product.id.slice(-4)}`,
          price: productData.basePrice,
          stock: Math.floor(Math.random() * 30) + 10,
          isActive: true,
        },
      });
    }

    return product;
  }

  // Create all products
  console.log('📦 Creating products...\n');

  console.log('💍 Rings:');
  for (let i = 0; i < productsData.rings.length; i++) {
    await createProduct(productsData.rings[i], 'rings', images.rings[i % images.rings.length], true);
    console.log(`   ✅ Created: ${productsData.rings[i].name}`);
  }

  console.log('\n👂 Earrings:');
  for (let i = 0; i < productsData.earrings.length; i++) {
    await createProduct(productsData.earrings[i], 'earrings', images.earrings[i % images.earrings.length]);
    console.log(`   ✅ Created: ${productsData.earrings[i].name}`);
  }

  console.log('\n📿 Necklaces:');
  for (let i = 0; i < productsData.necklaces.length; i++) {
    await createProduct(productsData.necklaces[i], 'necklaces', images.necklaces[i % images.necklaces.length]);
    console.log(`   ✅ Created: ${productsData.necklaces[i].name}`);
  }

  console.log('\n⌚ Bracelets:');
  for (let i = 0; i < productsData.bracelets.length; i++) {
    await createProduct(productsData.bracelets[i], 'bracelets', images.bracelets[i % images.bracelets.length]);
    console.log(`   ✅ Created: ${productsData.bracelets[i].name}`);
  }

  console.log('\n🦶 Anklets:');
  for (let i = 0; i < productsData.anklets.length; i++) {
    await createProduct(productsData.anklets[i], 'anklets', images.anklets[i % images.anklets.length]);
    console.log(`   ✅ Created: ${productsData.anklets[i].name}`);
  }

  console.log('\n🔮 Pendants:');
  for (let i = 0; i < productsData.pendants.length; i++) {
    await createProduct(productsData.pendants[i], 'pendants', images.pendants[i % images.pendants.length]);
    console.log(`   ✅ Created: ${productsData.pendants[i].name}`);
  }

  console.log('\n👃 Nose Pins:');
  for (let i = 0; i < productsData.nosePins.length; i++) {
    await createProduct(productsData.nosePins[i], 'nose-pins', images.nosePins[i % images.nosePins.length]);
    console.log(`   ✅ Created: ${productsData.nosePins[i].name}`);
  }

  console.log('\n🪙 Silver Coins:');
  for (let i = 0; i < productsData.silverCoins.length; i++) {
    await createProduct(productsData.silverCoins[i], 'silver-coins', images.coins[i % images.coins.length], true, '999');
    console.log(`   ✅ Created: ${productsData.silverCoins[i].name}`);
  }

  // Create Coupons
  console.log('\n🎟️ Creating coupons...');
  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME10', type: CouponType.PERCENTAGE, value: 10, minOrderValue: 999, maxDiscount: 500, usageLimit: 1000, validFrom: new Date(), validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), isActive: true },
      { code: 'SILVER20', type: CouponType.PERCENTAGE, value: 20, minOrderValue: 2999, maxDiscount: 1000, usageLimit: 500, validFrom: new Date(), validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), isActive: true },
      { code: 'FLAT500', type: CouponType.FIXED_AMOUNT, value: 500, minOrderValue: 3999, usageLimit: 200, validFrom: new Date(), validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), isActive: true },
      { code: 'FIRST100', type: CouponType.FIXED_AMOUNT, value: 100, minOrderValue: 499, usageLimit: 5000, validFrom: new Date(), validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), isActive: true },
    ],
  });
  console.log('✅ Created coupons');

  // Create Banners
  console.log('\n🖼️ Creating banners...');
  await prisma.banner.createMany({
    data: [
      { title: 'New Arrivals', subtitle: 'Discover our latest collection of sterling silver jewellery', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80', link: '/products?filter=new', sortOrder: 0, isActive: true },
      { title: 'Wedding Collection', subtitle: 'Make your special day shine', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1920&q=80', link: '/collections/wedding', sortOrder: 1, isActive: true },
      { title: 'Flat 20% Off', subtitle: 'On orders above Rs. 2999', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1920&q=80', link: '/products', sortOrder: 2, isActive: true },
    ],
  });
  console.log('✅ Created banners');

  // Create Settings
  console.log('\n⚙️ Creating settings...');
  const settings = [
    { key: 'site_name', value: 'Silvaniya' },
    { key: 'site_tagline', value: 'The Art of Eternal Shine' },
    { key: 'contact_email', value: 'support@silvaniya.com' },
    { key: 'contact_phone', value: '+91 9876543210' },
    { key: 'free_shipping_threshold', value: '0' },
    { key: 'cod_available', value: 'true' },
    { key: 'cod_max_amount', value: '10000' },
  ];
  for (const setting of settings) {
    await prisma.setting.create({
      data: { key: setting.key, value: setting.value },
    });
  }
  console.log('✅ Created settings');

  // Create Collections
  console.log('\n🎁 Creating collections...');
  const weddingCollection = await prisma.collection.create({
    data: { name: 'Wedding Collection', slug: 'wedding', description: 'Stunning pieces for your special day', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80', isActive: true },
  });

  await prisma.collection.create({
    data: { name: 'Gifting Collection', slug: 'gifting', description: 'Perfect gifts for every occasion', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80', isActive: true },
  });

  await prisma.collection.create({
    data: { name: 'Everyday Essentials', slug: 'everyday', description: 'Timeless pieces for daily wear', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', isActive: true },
  });
  console.log('✅ Created collections');

  // Get some products for collections
  const featuredProducts = await prisma.product.findMany({ where: { isFeatured: true }, take: 6 });
  for (let i = 0; i < Math.min(featuredProducts.length, 3); i++) {
    await prisma.collectionProduct.create({
      data: { collectionId: weddingCollection.id, productId: featuredProducts[i].id, sortOrder: i },
    });
  }

  // ============================================================================
  // CMS PAGES
  // ============================================================================
  console.log('\n📄 Creating CMS pages...');

  const pages = [
    {
      title: 'About Us',
      slug: 'about-us',
      metaTitle: 'About Silvaniya - The Art of Eternal Shine | 925 Sterling Silver Jewellery',
      metaDesc: 'Discover Silvaniya - crafting hallmarked 925 sterling silver jewellery that blends artistry, purity, and modern design. Join our family of eternal shine.',
      content: `<section class="about-hero">
<h1>Welcome to Silvaniya – The Art of Eternal Shine</h1>
<p>At Silvaniya, we believe jewellery is more than adornment — it is a reflection of your story, your elegance, and the timeless shine within you. Born from a passion for silver, Silvaniya is dedicated to creating hallmarked 925 sterling silver jewellery that blends artistry, purity, and modern design.</p>
<p>Each piece is crafted with care, combining traditional craftsmanship with contemporary aesthetics to offer jewellery that you can cherish for a lifetime. From delicate everyday wear to statement creations, our designs celebrate individuality while carrying the assurance of authenticity.</p>
</section>

<section class="about-family">
<h2>More Than Jewellery – A Family</h2>
<p>But Silvaniya is not just about jewellery — it is about belonging. When you choose Silvaniya, you become part of our family, a community that values trust, artistry, and eternal beauty. Every order is packed with love, sealed with care, and delivered with the promise of quality that shines forever.</p>
<p>We are here to make your special moments unforgettable, to walk beside you in your celebrations, and to ensure that every sparkle you wear feels personal, pure, and priceless.</p>
</section>

<section class="about-meaning">
<h2>What Silvaniya Means</h2>
<p>The name Silvaniya finds its essence in the timeless beauty of silver. Inspired by the word "Silva," meaning brightness and purity, and blended with the graceful suffix "–niya," it reflects elegance, artistry, and charm.</p>
<p>Together, Silvaniya can be understood as <strong>"The Land of Silver"</strong> — a world where every creation is born from purity, crafted with care, and designed to shine eternally.</p>
<p>For us, Silvaniya is not just a name, but a promise: a promise of authenticity, artistry, and eternal shine in every piece of jewellery we create.</p>
</section>

<section class="about-craftsmanship">
<h2>Our Craftsmanship</h2>
<p>At Silvaniya, every piece is created with hallmarked 925 sterling silver, designed by skilled artisans who combine timeless techniques with modern creativity. Each curve, cut, and polish carries the dedication of craftsmanship that makes your jewellery not just an accessory, but an heirloom.</p>
</section>

<section class="about-promise">
<h2>Our Promise</h2>
<p>Silvaniya is built on trust and authenticity. Every design you hold is carefully inspected, securely packaged, and delivered with love. We promise jewellery that will shine with you — through every season, every celebration, every memory.</p>
</section>

<section class="about-contact">
<p><strong>Silvaniya – The Art of Eternal Shine</strong></p>
<p>📧 Email: support@silvaniya.com</p>
<p>🌐 Website: www.silvaniya.com</p>
</section>`,
    },
    {
      title: 'FAQ - Frequently Asked Questions',
      slug: 'faq',
      metaTitle: 'FAQs | Silvaniya - 925 Sterling Silver Jewellery',
      metaDesc: 'Find answers to common questions about Silvaniya jewellery, payments, delivery, returns, and care instructions.',
      content: `<section class="faq-section">
<h1>Frequently Asked Questions</h1>

<h2>Purchase Related</h2>
<div class="faq-item">
<h3>How do I know the jewellery is authentic?</h3>
<p>Every Silvaniya piece is crafted in hallmarked 925 sterling silver.</p>
</div>
<div class="faq-item">
<h3>Do I need an account to place an order?</h3>
<p>No, you can checkout as a guest. But creating an account helps you track orders, save favourites, and enjoy special offers.</p>
</div>
<div class="faq-item">
<h3>What payment methods are accepted?</h3>
<p>We accept all major debit/credit cards, UPI, net banking, and wallet payments. Cash on Delivery (COD) is also available on select pin codes. To ensure secure transactions, customers choosing COD are required to pay a ₹100 advance at checkout. This amount will be adjusted against your order and is fully refundable in case the product is returned due to a manufacturing defect.</p>
</div>
<div class="faq-item">
<h3>Is Cash on Delivery (COD) available?</h3>
<p>Yes, COD is available for orders up to ₹10,000. For higher value orders, we request prepaid payment for security reasons.</p>
</div>
<div class="faq-item">
<h3>Can I cancel my order after placing it?</h3>
<p>Yes, cancellations are possible within 24 hours of purchase if the order has not been shipped. Once dispatched, cancellations cannot be processed.</p>
</div>
<div class="faq-item">
<h3>Do you offer gift packaging?</h3>
<p>Yes, every Silvaniya order comes in our premium signature box. Complimentary gift wrapping is available on request.</p>
</div>
<div class="faq-item">
<h3>Do you take custom or personalized orders?</h3>
<p>Currently, we offer only ready-to-ship designs. Bespoke/custom orders may be introduced in the future.</p>
</div>
<div class="faq-item">
<h3>What if the product I want is out of stock?</h3>
<p>You can join the waitlist on the product page. We will notify you as soon as it is back in stock.</p>
</div>

<h2>Delivery Related</h2>
<div class="faq-item">
<h3>Which courier partner delivers Silvaniya orders?</h3>
<p>We have partnered with Blue Dart Express Ltd., one of India's most reliable logistics companies, to ensure your jewellery reaches you safely and on time.</p>
</div>
<div class="faq-item">
<h3>How long does delivery take?</h3>
<p>Metro cities: 3–5 working days. Other locations: 5–7 working days. Timelines may vary due to festivals, weather, or unforeseen courier delays.</p>
</div>
<div class="faq-item">
<h3>Do you deliver everywhere in India?</h3>
<p>Yes, we offer Pan-India delivery through Blue Dart.</p>
</div>
<div class="faq-item">
<h3>How much is the shipping cost?</h3>
<p>We offer Free Delivery on all orders within India.</p>
</div>
<div class="faq-item">
<h3>Can I track my order?</h3>
<p>Yes, once dispatched, you will receive an AWB (Air Waybill) number along with a tracking link to follow your shipment in real-time.</p>
</div>
<div class="faq-item">
<h3>Do you ship internationally?</h3>
<p>Currently, Silvaniya delivers only within India. International shipping will be launched soon.</p>
</div>

<h2>Payment Related</h2>
<div class="faq-item">
<h3>Is it safe to pay online on Silvaniya?</h3>
<p>Absolutely. All online transactions are processed through a secure, encrypted payment gateway to ensure your personal and financial details remain safe.</p>
</div>
<div class="faq-item">
<h3>My payment failed, but money was deducted. What should I do?</h3>
<p>Don't worry. In case of a failed transaction, the amount is usually reversed to your original payment method within 5–7 business days. If not, please contact your bank or reach out to us.</p>
</div>
<div class="faq-item">
<h3>Will I get an invoice for my order?</h3>
<p>Yes, a printed invoice will be included inside your package.</p>
</div>

<h2>Jewellery Related</h2>
<div class="faq-item">
<h3>What purity of silver do you use?</h3>
<p>All Silvaniya creations are crafted in hallmarked 925 sterling silver, ensuring 92.5% purity, blended for strength and durability.</p>
</div>
<div class="faq-item">
<h3>Will silver jewellery tarnish over time?</h3>
<p>Yes, genuine silver naturally oxidizes when exposed to air and moisture. However, it can be easily polished back to its original shine using a silver cleaning cloth.</p>
</div>
<div class="faq-item">
<h3>Can I wear Silvaniya jewellery daily?</h3>
<p>Absolutely. Our jewellery is designed for both everyday wear and special occasions. We recommend avoiding harsh chemicals, perfumes, and water exposure for long-lasting shine.</p>
</div>
<div class="faq-item">
<h3>Are your products nickel-free and skin safe?</h3>
<p>Yes. All Silvaniya jewellery is nickel-free, lead-free, and hypoallergenic, making it safe and comfortable for everyday wear.</p>
</div>
</section>`,
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      metaTitle: 'Privacy Policy | Silvaniya',
      metaDesc: 'Learn how Silvaniya collects, uses, and protects your personal information. Your privacy matters to us.',
      content: `<section class="policy-section">
<h1>Privacy Policy – Silvaniya</h1>
<p><em>Effective Date: January 2026</em></p>
<p>This Privacy Policy describes how silvaniya.com (the "Site," "we," "our," or "us") collects, uses, and discloses your Personal Information when you visit or make a purchase.</p>

<h2>Collecting Personal Information</h2>
<p>When you visit our Site, we collect certain information to help us serve you better. Personal Information means any data that can uniquely identify you.</p>

<h3>Device Information</h3>
<ul>
<li><strong>Examples collected:</strong> IP address, browser version, time zone, cookie data, search terms, products you view, and how you interact with the Site.</li>
<li><strong>Purpose:</strong> To load the Site accurately, enhance your shopping experience, and perform analytics for optimization.</li>
<li><strong>Source:</strong> Automatically collected via cookies, log files, tags, and similar technologies.</li>
</ul>

<h3>Order Information</h3>
<ul>
<li><strong>Examples collected:</strong> Name, billing/shipping address, payment details, email address, and phone number.</li>
<li><strong>Purpose:</strong> To process your purchase, arrange shipping, provide invoices/confirmations, communicate with you, and prevent fraud.</li>
<li><strong>Source:</strong> Provided directly by you.</li>
</ul>

<h2>Sharing Personal Information</h2>
<p>We share your Personal Information with service providers strictly to fulfill our obligations to you:</p>
<ul>
<li><strong>Payment Gateways:</strong> To securely process your transactions.</li>
<li><strong>Courier Partners (Blue Dart):</strong> For shipping and delivery.</li>
<li><strong>Analytics & Marketing Tools:</strong> To understand customer behavior and improve services.</li>
<li><strong>Legal Requirements:</strong> If required by law, regulation, subpoena, or to protect our rights.</li>
</ul>
<p><strong>We never sell your personal information.</strong></p>

<h2>Your Rights</h2>
<ul>
<li><strong>GDPR (EEA):</strong> Right to access, correct, update, or erase your Personal Information.</li>
<li><strong>CCPA (California):</strong> Right to know, request deletion, and opt-out of sale of personal data.</li>
<li><strong>India (DPDP Act 2023):</strong> Right to withdraw consent, data portability, and grievance redressal.</li>
</ul>
<p>To exercise your rights, contact us at support@silvaniya.com.</p>

<h2>Cookies</h2>
<p>We use cookies to remember your preferences, enable secure checkout, and track analytics and ad performance. You may block cookies via your browser settings, though this may impact site functionality.</p>

<h2>Contact Us</h2>
<p>For questions, concerns, or complaints about this Privacy Policy:</p>
<p>📧 Email: support@silvaniya.com<br>🌐 Website: www.silvaniya.com</p>
</section>`,
    },
    {
      title: 'Terms of Service',
      slug: 'terms-of-service',
      metaTitle: 'Terms of Service | Silvaniya',
      metaDesc: 'Read the terms and conditions for using Silvaniya website and purchasing our 925 sterling silver jewellery.',
      content: `<section class="policy-section">
<h1>Terms of Service – Silvaniya</h1>
<p>This website is operated by Vernium Gold Private Limited under the brand name Silvaniya. By accessing our website or purchasing from us, you engage in our "Service" and agree to be bound by these Terms of Service.</p>

<h2>Section 1 – Online Store Terms</h2>
<ul>
<li>By using this Site, you confirm that you are at least 18 years of age.</li>
<li>You agree not to use our products for illegal or unauthorized purposes.</li>
<li>A breach of any term may result in termination of service.</li>
</ul>

<h2>Section 2 – Products & Services</h2>
<ul>
<li>All jewellery is crafted in 925 sterling silver and hallmarked as per BIS standards.</li>
<li>Colours and images displayed on the site are as accurate as possible, but may vary slightly due to screen displays.</li>
<li>We reserve the right to limit sales of our products on a case-by-case basis.</li>
<li>Product pricing, descriptions, and availability may change without prior notice.</li>
</ul>

<h2>Section 3 – Pricing, Billing & Orders</h2>
<ul>
<li>Prices include applicable GST but exclude shipping or COD charges (if any).</li>
<li>For COD orders: A ₹100 advance is collected during checkout, adjusted against your order.</li>
<li>We may refuse any order at our discretion.</li>
</ul>

<h2>Section 4 – Delivery & Shipping</h2>
<ul>
<li>Orders are shipped via Blue Dart Express Ltd., our official logistics partner.</li>
<li>Delivery timelines: 3–5 working days for metros, 5–7 days for other areas.</li>
<li>Customers must not accept tampered or damaged parcels.</li>
</ul>

<h2>Section 5 – Returns & Refunds</h2>
<ul>
<li>Returns/exchanges are accepted within 7 days of delivery for unused, unworn items in original packaging.</li>
<li>Returns are processed only with an unboxing video and valid invoice.</li>
<li>Refunds are processed within 10–15 working days once the returned product passes inspection.</li>
</ul>

<h2>Section 6 – Governing Law</h2>
<p>These Terms are governed by the laws of India. All disputes are subject to the jurisdiction of courts in Siliguri.</p>

<h2>Contact Information</h2>
<p>📧 Email: support@silvaniya.com<br>🌐 Website: www.silvaniya.com<br>📍 Address: New Cinema Road, Below Town Post Office, Siliguri, West Bengal, Pin Code-734004</p>
</section>`,
    },
    {
      title: 'Shipping Policy',
      slug: 'shipping-policy',
      metaTitle: 'Shipping Policy | Silvaniya - Free Pan-India Delivery',
      metaDesc: 'Learn about Silvaniya shipping policy, delivery timelines, and our partnership with Blue Dart for safe delivery of your silver jewellery.',
      content: `<section class="policy-section">
<h1>Shipping Policy – Silvaniya</h1>
<p>At Silvaniya – The Art of Eternal Shine, we understand that every order is special and deserves to be handled with utmost care. We have partnered with Blue Dart Express Ltd., one of India's most reliable logistics service providers, to ensure safe and timely delivery of your jewellery.</p>

<h2>Order Processing</h2>
<ul>
<li>All ready-to-ship orders are dispatched within 1 working day of confirmation.</li>
<li>Customized or made-to-order jewellery may take additional time for processing.</li>
</ul>

<h2>Delivery Timelines</h2>
<ul>
<li><strong>Metro cities:</strong> 3–5 working days</li>
<li><strong>Other locations:</strong> 4–7 working days</li>
<li><strong>Remote/Out-of-coverage areas:</strong> May take slightly longer</li>
</ul>
<p>Delivery timelines may vary during festivals, holidays, or unforeseen courier delays.</p>

<h2>Packaging & Security</h2>
<ul>
<li>Every Silvaniya order is packed in our exclusive, tamper-proof, and durable packaging.</li>
<li>Shipments are insured in transit for your peace of mind.</li>
<li>Please do not accept packages that appear damaged or tampered with and contact our support team immediately.</li>
</ul>

<h2>Shipping Charges</h2>
<ul>
<li>We currently offer <strong>Free Pan-India Delivery</strong> on all orders.</li>
<li>Any applicable COD charges will be displayed at checkout.</li>
</ul>

<h2>Return to Origin (RTO)</h2>
<p>In case of failed deliveries due to customer unavailability or incorrect address, the shipment will be returned to us (RTO). Re-shipping may incur additional charges.</p>
</section>`,
    },
    {
      title: 'Cancellation Policy',
      slug: 'cancellation-policy',
      metaTitle: 'Cancellation Policy | Silvaniya',
      metaDesc: 'Understand Silvaniya cancellation policy for your silver jewellery orders.',
      content: `<section class="policy-section">
<h1>Cancellation Policy – Silvaniya</h1>
<p>At Silvaniya – The Art of Eternal Shine, we value every order and work hard to ship it as quickly as possible.</p>

<h2>1. Before Dispatch</h2>
<ul>
<li>Orders can be cancelled within 24 hours of placement, provided they have not yet been dispatched.</li>
<li>To request a cancellation, please log in to your account → Your Orders → select the item → click Cancel.</li>
<li>If prepaid, the refund will be processed to your original payment method within 5–7 working days.</li>
</ul>

<h2>2. After Dispatch</h2>
<ul>
<li>Once an order has been dispatched, cancellations cannot be processed.</li>
<li>You may, however, apply for a return/exchange as per our Return Policy.</li>
</ul>

<h2>3. Cash on Delivery (COD) Orders</h2>
<ul>
<li>For COD orders, a ₹100 advance collected at checkout will be refunded only if cancellation is requested within 24 hours and before dispatch.</li>
<li>After dispatch, COD cancellations are not allowed.</li>
</ul>

<h2>4. Exceptions</h2>
<ul>
<li>Customized or personalized jewellery cannot be cancelled once confirmed.</li>
<li>Seasonal/limited collection products may not be eligible for cancellation.</li>
</ul>
</section>`,
    },
    {
      title: 'Return Policy',
      slug: 'return-policy',
      metaTitle: 'Return Policy | Silvaniya',
      metaDesc: 'Learn about Silvaniya return and refund policy for silver coins and jewellery.',
      content: `<section class="policy-section">
<h1>Return Policy – Silvaniya</h1>
<p>At Silvaniya – The Art of Eternal Shine, we want you to be delighted with your purchase. Each piece of jewellery is crafted with care, and every order is inspected before dispatch.</p>

<div class="important-notice">
<h3>Important Note</h3>
<ul>
<li><strong>An unboxing video is mandatory</strong> to process any return or replacement request.</li>
<li>Products must be returned in their original packaging, along with the invoice/proof of purchase.</li>
<li>Refunds and replacements are processed within 10–15 working days after inspection.</li>
<li>Customized or personalized products are strictly non-returnable/non-refundable.</li>
</ul>
</div>

<h2>1. Silver Coins</h2>
<ul>
<li><strong>When can you return?</strong> Only in case of a damaged, defective, or wrong item within 24 hours of delivery.</li>
<li>For any other reason, silver coins are non-returnable.</li>
</ul>

<h2>2. Jewellery</h2>
<ul>
<li><strong>Return Window:</strong> You may request a return/exchange within 3 days of delivery.</li>
<li>The item must be unused, unworn, and in original condition.</li>
<li>Provide the unboxing video, original packaging, and invoice.</li>
</ul>

<h2>3. Non-Returnable Items</h2>
<ul>
<li>Personalized jewellery and customized silver coins</li>
<li>Products that show signs of wear, damage, alteration, or improper handling</li>
</ul>

<h2>Contact Us</h2>
<p>📧 Email: support@silvaniya.com<br>🕒 Support Time: Mon–Sat, 10 AM – 7 PM</p>
</section>`,
    },
    {
      title: 'Jewellery Care',
      slug: 'jewellery-care',
      metaTitle: 'Jewellery Care Guide | Silvaniya - How to Care for Silver Jewellery',
      metaDesc: 'Learn how to care for your 925 sterling silver jewellery. Tips to prevent tarnish and keep your Silvaniya jewellery shining.',
      content: `<section class="policy-section">
<h1>Jewellery Care – Silvaniya</h1>
<p>At Silvaniya – The Art of Eternal Shine, we create jewellery that is timeless and pure. To preserve its brilliance, your silver jewellery requires a little care and attention.</p>

<h2>Why Does Silver Tarnish?</h2>
<p>Tarnish is a thin layer of corrosion that appears as a dull grey or black coating on silver. While pure silver resists tarnish, it is too soft for everyday jewellery, which is why 925 sterling silver (92.5% silver + 7.5% alloy) is used for durability.</p>

<p>Sterling silver may tarnish faster in:</p>
<ul>
<li>Humid climates</li>
<li>Polluted environments</li>
<li>Exposure to chemicals such as perfumes, hairsprays, deodorants, moisturizers</li>
</ul>

<h3>Common Causes of Tarnish</h3>
<ul>
<li>Oxygen & Water</li>
<li>Sulfur & Detergents</li>
<li>Chlorine & Paint</li>
<li>Air Pollution</li>
<li>Household Cleaners</li>
<li>Bodily Chemicals (Sweat, Oils)</li>
</ul>

<h2>How to Prevent Tarnish</h2>
<ul>
<li>✨ Keep your jewellery in airtight containers</li>
<li>✨ Store in a cool, dry place with low humidity</li>
<li>✨ Clean gently with warm water & a soft cloth</li>
<li>✨ Avoid contact with chemicals, perfumes, lotions, and oils</li>
</ul>

<h2>Tips to Care for Your 925 Sterling Silver Jewellery</h2>
<ul>
<li><strong>Wear Regularly:</strong> Surprisingly, wearing silver often slows tarnishing, as natural skin oils protect the metal.</li>
<li><strong>Proper Storage:</strong> Always store in the Silvaniya box provided, away from heat and sunlight.</li>
<li><strong>Gentle Cleaning:</strong> Wash in warm soapy water, rinse, and pat dry with a soft cloth.</li>
<li><strong>Before Activities:</strong> Remove jewellery before swimming, bathing, or exercising.</li>
<li><strong>Avoid Harsh Cleaners:</strong> Do not use liquid silver dips or abrasive chemicals.</li>
<li><strong>Re-polishing:</strong> For long-term shine, opt for professional re-polishing services (Silvaniya offers lifetime free polishing).</li>
</ul>
</section>`,
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }
  console.log('✅ Created CMS pages');

  // ============================================================================
  // VENDORS (MARKETPLACE)
  // ============================================================================
  console.log('\n🏪 Creating vendors...');

  const vendors = [
    {
      name: 'Silver Palace',
      slug: 'silver-palace',
      description: 'Premium silver jewellery from Jaipur with traditional Rajasthani craftsmanship.',
      logo: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80',
      website: 'https://silverpalace.example.com',
      email: 'contact@silverpalace.example.com',
      phone: '+91 9876543210',
      city: 'Jaipur',
      state: 'Rajasthan',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Chennai Silvers',
      slug: 'chennai-silvers',
      description: 'South Indian silver jewellery specialists with temple jewellery collection.',
      logo: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80',
      website: 'https://chennaisilvers.example.com',
      email: 'info@chennaisilvers.example.com',
      phone: '+91 9876543211',
      city: 'Chennai',
      state: 'Tamil Nadu',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Kolkata Jewels',
      slug: 'kolkata-jewels',
      description: 'Bengali silver artisans creating intricate filigree work.',
      logo: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200&q=80',
      email: 'hello@kolkatajewels.example.com',
      city: 'Kolkata',
      state: 'West Bengal',
      isActive: true,
      isFeatured: false,
    },
  ];

  for (const vendor of vendors) {
    const createdVendor = await prisma.vendor.upsert({
      where: { slug: vendor.slug },
      update: vendor,
      create: vendor,
    });

    // Add sample products for each vendor
    const vendorProducts = [
      {
        vendorId: createdVendor.id,
        name: `${vendor.name} Classic Ring`,
        slug: `${vendor.slug}-classic-ring`,
        description: `Beautiful silver ring from ${vendor.name}`,
        price: 1299 + Math.floor(Math.random() * 500),
        compareAtPrice: 1799 + Math.floor(Math.random() * 500),
        image: images.rings[Math.floor(Math.random() * images.rings.length)],
        category: 'rings',
        purity: '925',
        weight: 3.5,
        isActive: true,
        isFeatured: Math.random() > 0.5,
      },
      {
        vendorId: createdVendor.id,
        name: `${vendor.name} Designer Earrings`,
        slug: `${vendor.slug}-designer-earrings`,
        description: `Elegant earrings from ${vendor.name}`,
        price: 899 + Math.floor(Math.random() * 400),
        compareAtPrice: 1299 + Math.floor(Math.random() * 400),
        image: images.earrings[Math.floor(Math.random() * images.earrings.length)],
        category: 'earrings',
        purity: '925',
        weight: 4.2,
        isActive: true,
        isFeatured: Math.random() > 0.5,
      },
      {
        vendorId: createdVendor.id,
        name: `${vendor.name} Traditional Necklace`,
        slug: `${vendor.slug}-traditional-necklace`,
        description: `Traditional necklace from ${vendor.name}`,
        price: 2499 + Math.floor(Math.random() * 1000),
        compareAtPrice: 3499 + Math.floor(Math.random() * 1000),
        image: images.necklaces[Math.floor(Math.random() * images.necklaces.length)],
        category: 'necklaces',
        purity: '925',
        weight: 15.0,
        isActive: true,
        isFeatured: Math.random() > 0.5,
      },
    ];

    for (const product of vendorProducts) {
      await prisma.vendorProduct.upsert({
        where: { slug: product.slug },
        update: product,
        create: product,
      });
    }
  }
  console.log('✅ Created vendors and vendor products');

  // Summary
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  const couponCount = await prisma.coupon.count();
  const bannerCount = await prisma.banner.count();
  const collectionCount = await prisma.collection.count();
  const pageCount = await prisma.page.count();
  const vendorCount = await prisma.vendor.count();
  const vendorProductCount = await prisma.vendorProduct.count();

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Categories: ${categoryCount}`);
  console.log(`   - Products: ${productCount}`);
  console.log(`   - Coupons: ${couponCount}`);
  console.log(`   - Banners: ${bannerCount}`);
  console.log(`   - Collections: ${collectionCount}`);
  console.log(`   - CMS Pages: ${pageCount}`);
  console.log(`   - Vendors: ${vendorCount}`);
  console.log(`   - Vendor Products: ${vendorProductCount}`);
  console.log('\n🔐 Admin Login:');
  console.log('   Email: admin@silvaniya.com');
  console.log('   Password: admin123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
