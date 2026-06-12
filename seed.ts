import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Sample categories to seed
const categories = [
  {
    name: 'Roblox Games',
    slug: 'roblox-games',
    description: 'Rate and rank your favorite Roblox experiences',
    icon: '🎮'
  },
  {
    name: 'Anime',
    slug: 'anime',
    description: 'Rate anime series and movies',
    icon: '🎌'
  },
  {
    name: 'Movies',
    slug: 'movies',
    description: 'Rate movies across all genres',
    icon: '🎬'
  },
  {
    name: 'Minecraft Servers',
    slug: 'minecraft-servers',
    description: 'Rate Minecraft servers',
    icon: '⛏️'
  },
  {
    name: 'COD Mobile',
    slug: 'cod-mobile',
    description: 'Rate Call of Duty Mobile modes and maps',
    icon: '🔫'
  }
];

// Criteria for each category
const criteriaMap: Record<string, Array<{
  name: string;
  description: string;
  weight: number;
  minScore: number;
  maxScore: number;
  sortOrder: number;
}>> = {
  'roblox-games': [
    { name: 'Graphics', description: 'Visual quality and aesthetics', weight: 1, minScore: 1, maxScore: 10, sortOrder: 0 },
    { name: 'Gameplay', description: 'How fun and engaging the game is', weight: 2, minScore: 1, maxScore: 10, sortOrder: 1 },
    { name: 'Optimization', description: 'Performance and lag', weight: 1, minScore: 1, maxScore: 10, sortOrder: 2 },
    { name: 'Replayability', description: 'How long it stays engaging', weight: 1, minScore: 1, maxScore: 10, sortOrder: 3 },
    { name: 'Community', description: 'Player base and social features', weight: 1, minScore: 1, maxScore: 10, sortOrder: 4 }
  ],
  'anime': [
    { name: 'Story', description: 'Plot quality and writing', weight: 2, minScore: 1, maxScore: 10, sortOrder: 0 },
    { name: 'Animation', description: 'Visual quality', weight: 1, minScore: 1, maxScore: 10, sortOrder: 1 },
    { name: 'Characters', description: 'Character development and design', weight: 1, minScore: 1, maxScore: 10, sortOrder: 2 },
    { name: 'Soundtrack', description: 'Music and voice acting', weight: 1, minScore: 1, maxScore: 10, sortOrder: 3 },
    { name: 'Enjoyment', description: 'Overall watch experience', weight: 1, minScore: 1, maxScore: 10, sortOrder: 4 }
  ],
  'movies': [
    { name: 'Story', description: 'Plot and screenplay', weight: 2, minScore: 1, maxScore: 10, sortOrder: 0 },
    { name: 'Acting', description: 'Performance quality', weight: 1, minScore: 1, maxScore: 10, sortOrder: 1 },
    { name: 'Visual Effects', description: 'CGI and cinematography', weight: 1, minScore: 1, maxScore: 10, sortOrder: 2 },
    { name: 'Sound Design', description: 'Audio and music', weight: 1, minScore: 1, maxScore: 10, sortOrder: 3 },
    { name: 'Overall Quality', description: 'Complete package', weight: 1, minScore: 1, maxScore: 10, sortOrder: 4 }
  ],
  'minecraft-servers': [
    { name: 'Performance', description: 'Server stability and TPS', weight: 2, minScore: 1, maxScore: 10, sortOrder: 0 },
    { name: 'Community', description: 'Player base and staff', weight: 1, minScore: 1, maxScore: 10, sortOrder: 1 },
    { name: 'Features', description: 'Unique plugins and content', weight: 1, minScore: 1, maxScore: 10, sortOrder: 2 },
    { name: 'Gameplay', description: 'Fun factor', weight: 2, minScore: 1, maxScore: 10, sortOrder: 3 },
    { name: 'Uptime', description: 'Server availability', weight: 1, minScore: 1, maxScore: 10, sortOrder: 4 }
  ],
  'cod-mobile': [
    { name: 'Graphics', description: 'Visual quality on mobile', weight: 1, minScore: 1, maxScore: 10, sortOrder: 0 },
    { name: 'Gunplay', description: 'Weapon feel and balance', weight: 2, minScore: 1, maxScore: 10, sortOrder: 1 },
    { name: 'Maps', description: 'Map design variety', weight: 1, minScore: 1, maxScore: 10, sortOrder: 2 },
    { name: 'Performance', description: 'Frame rate and optimization', weight: 1, minScore: 1, maxScore: 10, sortOrder: 3 },
    { name: 'Competitive Balance', description: 'Meta and fairness', weight: 1, minScore: 1, maxScore: 10, sortOrder: 4 }
  ]
};

async function seed() {
  console.log('Seeding database...');

  for (const cat of categories) {
    // Check if category exists
    const existing = await sql`SELECT id FROM categories WHERE slug = ${cat.slug}`;
    if (existing.length > 0) {
      console.log(`Category ${cat.name} already exists, skipping`);
      continue;
    }

    // Create category
    const [newCat] = await sql`
      INSERT INTO categories (name, slug, description, icon, is_active)
      VALUES (${cat.name}, ${cat.slug}, ${cat.description}, ${cat.icon}, true)
      RETURNING id
    `;

    console.log(`Created category: ${cat.name}`);

    // Add criteria for this category
    const criteria = criteriaMap[cat.slug];
    if (criteria) {
      for (const c of criteria) {
        await sql`
          INSERT INTO criteria (category_id, name, description, weight, min_score, max_score, sort_order)
          VALUES (${newCat.id}, ${c.name}, ${c.description}, ${c.weight}, ${c.minScore}, ${c.maxScore}, ${c.sortOrder})
        `;
        console.log(`  Added criterion: ${c.name}`);
      }
    }
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed();