import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';
import { generateChatCompletion } from '../lib/groq';

async function seedBlogs() {
  try {
    const q = query(collection(db, 'blogs'), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      console.log('Blogs already exist, skipping seed.');
      return;
    }

    console.log('Seeding blog posts...');
    const themes = [
      'Traditional vs AI-Powered Investing: The Shift in 2026',
      'Understanding Crypto Risk Management for Beginners',
      'The Future of Decentralized Finance and Institutional Adoption'
    ];

    for (const theme of themes) {
      try {
        console.log(`Generating AI insight for theme: ${theme}...`);
        const prompt = `Write a comprehensive, professional investment blog post for "NexusFinPro".
        Theme: ${theme}
        Format: JSON { title, excerpt, content, category }
        Content: Markdown format, at least 600 words, expert analysis, data-driven.
        Category options: Market Analysis, AI Trends, Wealth Building.
        Only return the JSON.`;

        const response = await generateChatCompletion([
          { role: 'system', content: 'You are a elite financial analyst and tech researcher for a top-tier investment firm.' },
          { role: 'user', content: prompt }
        ]);

        const data = JSON.parse(response || '{}');
        
        await addDoc(collection(db, 'blogs'), {
          ...data,
          author: 'NexusFinPro Strategy Bot',
          date: serverTimestamp(),
          image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop',
        });
        console.log(`✅ Successfully seeded: ${data.title}`);
      } catch (e) {
        console.error('Error seeding individual post:', e);
      }
    }
    console.log('Seeding complete.');
  } catch (e) {
    console.error('Core seeding error (likely permissions):', e);
  }
}

export default seedBlogs;
