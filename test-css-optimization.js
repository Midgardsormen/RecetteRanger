const fs = require('fs');
const m = JSON.parse(fs.readFileSync('dist/client/manifest.json', 'utf-8'));

function findChunkKeyForComponent(componentName) {
  const possibleKeys = [
    `src/view/features/${componentName.toLowerCase()}/${componentName}.svelte`,
    `src/view/features/articles/${componentName}.svelte`,
    `src/view/features/stores/${componentName}.svelte`,
    `src/view/features/plannings/${componentName}.svelte`,
    `src/view/features/shopping-lists/${componentName}.svelte`,
    `src/view/features/recipes/${componentName}.svelte`,
    `src/view/features/home/${componentName}.svelte`,
    `src/view/features/auth/${componentName}.svelte`,
    `src/view/features/profile/${componentName}.svelte`,
    `src/view/features/users/${componentName}.svelte`,
    `src/view/features/admin/${componentName}.svelte`,
    `src/view/features/privacy/${componentName}.svelte`,
    `src/view/features/legal/${componentName}.svelte`,
  ];
  for (const key of possibleKeys) if (m[key]) return key;
  const chunkPattern = componentName.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);
  for (const key of Object.keys(m)) {
    if (key.includes('!~{')) continue;
    if (key.startsWith('_feature-') && key.includes(chunkPattern)) return key;
  }
  return null;
}

function collectCss(name) {
  const css = new Set();
  const main = m['src/view/entry-client.ts'];
  if (main.css) main.css.forEach(c => css.add(c));
  const key = findChunkKeyForComponent(name);
  if (key && m[key]) {
    const chunk = m[key];
    if (chunk.css) chunk.css.forEach(c => css.add(c));
    if (chunk.imports) {
      chunk.imports.forEach(imp => {
        if (m[imp] && m[imp].css) m[imp].css.forEach(c => css.add(c));
      });
    }
  }
  for (const [k, e] of Object.entries(m)) {
    if ((k.startsWith('_components-') || k.startsWith('_ui-components-')) && e.css) {
      e.css.forEach(c => css.add(c));
    }
  }
  return css.size;
}

const pages = [
  'Home', 'Recipes', 'RecipeDetail', 'Ingredients', 'Articles', 'Stores',
  'MealPlanning', 'MealPlanningSettings', 'ShoppingLists', 'ShoppingListDetail',
  'Profile', 'Users', 'Admin', 'Login', 'Register', 'PrivacyPolicy', 'LegalNotice'
];

console.log('=== CSS Loading per Page (Optimized Solution) ===\n');
console.log('Total CSS files available: 20');
console.log('');

pages.forEach(p => {
  const count = collectCss(p);
  console.log(`${p.padEnd(25)} : ${count} CSS files (saves ${20 - count})`);
});
