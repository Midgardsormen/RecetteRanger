const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMealDates() {
  console.log('=== Vérification des dates dans la base ===\n');

  // Date actuelle
  const now = new Date();
  const today = new Date(now.toISOString().split('T')[0]);
  console.log('Date actuelle (locale):', now);
  console.log('Date du jour (ISO string):', now.toISOString().split('T')[0]);
  console.log('Date du jour (objet Date à minuit local):', today);
  console.log('Date du jour (objet Date à minuit UTC):', new Date(today.toISOString().split('T')[0] + 'T00:00:00.000Z'));
  console.log('\n');

  // Récupérer tous les MealPlanDay
  const mealDays = await prisma.mealPlanDay.findMany({
    include: {
      items: {
        include: {
          recipe: true
        }
      }
    },
    orderBy: {
      date: 'desc'
    },
    take: 10
  });

  console.log(`Trouvé ${mealDays.length} jours de repas :\n`);

  mealDays.forEach((day, index) => {
    console.log(`${index + 1}. ID: ${day.id}`);
    console.log(`   Date stockée: ${day.date}`);
    console.log(`   Date ISO: ${day.date.toISOString()}`);
    console.log(`   Nombre d'items: ${day.items.length}`);
    day.items.forEach((item, i) => {
      console.log(`      ${i + 1}. ${item.slot}: ${item.recipe?.label || item.note || 'Sans recette'}`);
    });
    console.log('');
  });

  await prisma.$disconnect();
}

checkMealDates().catch(console.error);
