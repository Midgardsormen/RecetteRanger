import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Utiliser les variables d'environnement ou valeurs par défaut
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const adminPseudo = process.env.SEED_ADMIN_PSEUDO || 'Admin';
  const adminFirstName = process.env.SEED_ADMIN_FIRSTNAME || 'Admin';
  const adminLastName = process.env.SEED_ADMIN_LASTNAME || 'User';

  // Hash le mot de passe
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // Créer l'utilisateur admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      pseudo: adminPseudo,
      firstName: adminFirstName,
      lastName: adminLastName,
      email: adminEmail,
      passwordHash: passwordHash,
      role: 'ADMIN',
      accountStatus: 'APPROVED',
    },
  });

  console.log('✅ Admin user created:', admin.pseudo);
  console.log('📧 Email:', admin.email);
  console.log('👤 Role:', admin.role);
  console.log('✔️  Status:', admin.accountStatus);

  // Créer quelques stores de base
  const stores = [
    { name: 'Carrefour', color: '#0055A4' },
    { name: 'Leclerc', color: '#005CA9' },
    { name: 'Intermarché', color: '#E30613' },
    { name: 'Auchan', color: '#ED1C24' },
  ];

  console.log('\n🏪 Creating stores...');
  for (const store of stores) {
    await prisma.store.upsert({
      where: { name: store.name },
      update: {},
      create: store,
    });
    console.log(`  ✅ ${store.name}`);
  }

  console.log('\n🎉 Seed completed!');
  console.log('\n💡 Tip: You can now create articles and recipes through the UI!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
