const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateStatuses() {
  try {
    // Mettre à jour toutes les listes DRAFT en IN_PROGRESS
    const result = await prisma.shoppingList.updateMany({
      where: {
        status: 'DRAFT'
      },
      data: {
        status: 'IN_PROGRESS'
      }
    });

    console.log(`✅ ${result.count} liste(s) mise(s) à jour de DRAFT vers IN_PROGRESS`);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateStatuses();
