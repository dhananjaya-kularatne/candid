const BASE = 'http://localhost:8080/api';

const accounts = [
  { email: 'aisha@candid.test',   password: 'Password123' },
  { email: 'marcus@candid.test',  password: 'Password123' },
  { email: 'priya@candid.test',   password: 'Password123' },
  { email: 'james@candid.test',   password: 'Password123' },
  { email: 'sofia@candid.test',   password: 'Password123' },
  { email: 'liam@candid.test',    password: 'Password123' },
  { email: 'zara@candid.test',    password: 'Password123' },
  { email: 'noah@candid.test',    password: 'Password123' },
  { email: 'chloe@candid.test',   password: 'Password123' },
  { email: 'ethan@candid.test',   password: 'Password123' },
];

const posts = [
  { content: `Woke up at 5:30am and sat with my coffee watching the sun rise. There's something about those first quiet minutes of the day that feel like the whole world belongs to you. Slow mornings are genuinely underrated.`, mood: 'grateful' },
  { content: `I've been thinking about how we use "busy" as a badge of honor. Busy doing what exactly? I spent three hours scrolling yesterday and still called myself busy. That's not busy. That's avoiding.`, mood: 'reflective' },
  { content: `Ran 8km this morning for the first time without stopping. My lungs were arguing with me the whole time. But somewhere around the 6km mark something clicked and I just kept going. That feeling is addictive.`, mood: 'excited' },
  { content: `Work has been relentless lately. Back-to-back meetings that could have been emails, deadlines stacking up. I keep reminding myself this is a season, not a sentence. Tired but not broken.`, mood: 'tired' },
  { content: `My grandmother called today to tell me about her garden. She described every flower by name. I could have listened for hours. She has more patience than anyone I know. #family #grateful`, mood: 'grateful' },
  { content: `I've started keeping a small notebook on my bedside table for thoughts that come at 2am. Last night I wrote "what if kindness is just attention?" and now I can't stop thinking about it.`, mood: 'reflective' },
  { content: `Three years ago today I quit a job that was making me miserable. I had no plan, minimal savings, and everyone thought I was having a crisis. It was the right kind of crisis. #anniversary`, mood: 'grateful' },
  { content: `I've been experimenting with not checking my phone for the first hour after waking up. Day 4. It's harder than quitting caffeine. The muscle memory of reaching for it is wild.`, mood: 'reflective' },
  { content: `Spent Sunday afternoon doing absolutely nothing productive and I refuse to feel bad about it. Watched two movies, ate cereal for dinner, talked on the phone with an old friend for two hours.`, mood: 'chill' },
  { content: `There's a coffee shop I used to go to every Saturday that closed down last year. I drove past the empty space today and felt genuinely sad. That quiet grief for small good things that disappear.`, mood: 'reflective' },
  { content: `Attended a live music event for the first time since 2019. I forgot how different it feels to hear music with your whole body — the bass in your chest, the crowd moving together. I cried a little.`, mood: 'happy' },
  { content: `Burnout doesn't announce itself. One day you just realise you've been running on empty for so long that empty started to feel normal. I'm in the slow process of refilling.`, mood: 'tired' },
  { content: `Made a list of things that made me happy this week: the smell of rain on warm pavement, a perfectly ripe mango, finding a parking spot immediately, my cat sitting on my laptop during a meeting.`, mood: 'happy' },
  { content: `Hot take: learning to say "I don't know" is one of the most undervalued skills. The first time I said it in a meeting — people respected me more, not less.`, mood: 'reflective' },
  { content: `Cooked jollof rice for the first time without calling my mum for help halfway through. It wasn't perfect but it was mine. There's something profound about making your mother's food with your own hands.`, mood: 'happy' },
  { content: `Genuinely struggling with social media lately. The comparison spiral, the performative outrage. Taking a step back. Reading more. Thinking more. Scrolling less.`, mood: 'reflective' },
  { content: `I've been journaling every day for 90 days now. Writing doesn't solve things but it untangles them. I discovered I have a lot more going on inside than I usually let on — even to myself.`, mood: 'reflective' },
  { content: `Made a decision today that felt scary and right at the same time. I've learned those feelings together usually mean you're heading somewhere important. Trusting the process.`, mood: 'excited' },
  { content: `Had a long conversation with my dad tonight that we'd been avoiding for years. It wasn't perfect. There were pauses and half-finished sentences. But something moved. That's enough for now.`, mood: 'reflective' },
  { content: `I bought a plant last month. It's still alive. This is the most committed relationship I've had in two years and I stand by everything I just said.`, mood: 'happy' },
  { content: `Paris in October is a different city than Paris in July. Emptier, more honest. The tourists are gone and the light turns amber. I live here and still catch myself stopping on bridges just to look.`, mood: 'grateful' },
  { content: `I've started writing one true thing every day. Not a diary entry — just one sentence that is completely honest. Today's: I am afraid of being forgotten.`, mood: 'reflective' },
  { content: `My mother tongue and my daily language are two different things. There are feelings I can only describe in one and thoughts I can only process in the other. I live in the gap between them.`, mood: 'reflective' },
  { content: `Spent Saturday afternoon in a used bookshop for two hours. Left with five books I don't strictly need and absolutely no regrets. Some purchases are investments in future versions of yourself.`, mood: 'happy' },
  { content: `Six months into freelancing — the freedom is real, the instability is also real. Some weeks are amazing. Some weeks I miss the salary. Holding both without one cancelling the other.`, mood: 'reflective' },
  { content: `Went hiking alone for the first time. There's something about moving through a landscape with only your own thoughts for company that reorganises things inside you. #hiking #nature`, mood: 'chill' },
  { content: `I think I've been confusing rest with distraction for years. Rest is restorative. Distraction is just delay. They feel similar in the moment but you know which one you got when you come out.`, mood: 'reflective' },
  { content: `Had the kind of conversation today that makes you feel smarter and more human afterward. With someone I met two hours ago. Some people are just built to open up space in you.`, mood: 'grateful' },
  { content: `Morning pages day 47. I've noticed my handwriting changes depending on my mood — tight and cramped when anxious, loose and looping when things feel okay. The body writes the truth.`, mood: 'reflective' },
  { content: `There's a specific kind of tired that sleep doesn't fix. Not sad, just... translucent. Going through the days with a slight delay. Being gentle with myself about it.`, mood: 'tired' },
  { content: `Made a friend today the old-fashioned way — sitting next to someone at a cafe, noticing what they were reading, saying something about it. That's it. People want to be seen.`, mood: 'happy' },
  { content: `Cleaned out my closet and donated three bags of clothes. Every item you remove is a decision you no longer have to make in the morning. There's something clarifying about owning less.`, mood: 'chill' },
  { content: `Called my sister just to say I've been thinking about her. No agenda, no purpose. She said it made her day. I'm going to do the purposeless call more. The love with no occasion.`, mood: 'grateful' },
  { content: `I started meditating four months ago. I haven't become enlightened. I have become slightly less likely to send an email I'll regret. I'll take it. #meditation`, mood: 'reflective' },
  { content: `The thing nobody tells you about chasing a dream is that the chase changes you. By the time you get there, the version of you who arrives is not the one who started. That might be the point.`, mood: 'reflective' },
  { content: `Took a half day off for no reason other than it was sunny. Walked along the canal, got ice cream, sat on a bench and watched dogs. Sometimes the best days are the ones with the lowest stakes.`, mood: 'happy' },
  { content: `Week check-in: I survived it. The deadlines, the difficult conversation, the thing I was dreading. All of it happened and I'm still here. That counts for something. #weeklyreflection`, mood: 'grateful' },
  { content: `I've started cooking proper breakfasts on weekdays. Not because I have more time. But starting the day with something made by your own hands sets a different tone. Scrambled eggs as philosophy.`, mood: 'chill' },
  { content: `Someone asked me what I would do if money wasn't a factor. I answered without thinking and was surprised by my own answer. The quick response is always the true one.`, mood: 'reflective' },
  { content: `I've been walking 30 minutes every evening after dinner. It's changed how I sleep, how I think, and how I feel about the neighbourhood I've lived in for three years without really seeing. #habit`, mood: 'chill' },
  { content: `Currently in that phase of a project where everything is a mess and you can't see the shape of it yet. I know from experience that clarity comes. I know it and I'm still impatient.`, mood: 'tired' },
  { content: `Heard a song today I hadn't heard in 10 years. Instant time travel. I was 17 again for about 45 seconds. I don't miss those problems but I do miss that certainty, even when it was wrong.`, mood: 'reflective' },
  { content: `Had a meal with someone I hadn't seen in two years and we just picked up exactly where we left off. That's the truest test of a friendship — not distance but return.`, mood: 'happy' },
  { content: `Wrote something today that I actually liked. Not just tolerated — actually liked. That doesn't happen often. Saving it before the morning version of me edits the confidence out of it.`, mood: 'excited' },
  { content: `Two months without social media on my phone. I read more, I'm bored more, I'm more comfortable with being bored, and I've started noticing things again in the actual world. #digitaldetox`, mood: 'reflective' },
  { content: `The real luxury isn't money or status — it's time that belongs entirely to you. An afternoon with no obligations. A weekend with no performances. Just you and your own idea of an hour.`, mood: 'chill' },
  { content: `My neighbour left fresh bread outside my door this morning with a note saying she made too much. No occasion, no expectation. I've been thinking about it all day. Generosity as a reflex.`, mood: 'grateful' },
  { content: `A year ago I said I wanted to write more. Today I'm actually writing, imperfectly and publicly. The gap between intention and action has finally closed. Late start counts. #writing`, mood: 'excited' },
  { content: `Bad day. The kind where small things add up into something heavier. Not going to perform recovery I haven't done yet. Just acknowledging it. Tomorrow is different and that's enough.`, mood: 'tired' },
  { content: `It's 11pm and I'm writing this instead of sleeping because this is when the thoughts get clear and I've stopped fighting it. I'm a night person pretending to be a morning person.`, mood: 'chill' },
];

const IMAGE_POST_INDICES = new Set([0, 10, 20, 30, 40]);
const IMAGE_URLS = [
  'https://picsum.photos/seed/cnd1/800/600',
  'https://picsum.photos/seed/cnd2/800/600',
  'https://picsum.photos/seed/cnd3/800/600',
  'https://picsum.photos/seed/cnd4/800/600',
  'https://picsum.photos/seed/cnd5/800/600',
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function login(account) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  });
  if (!res.ok) throw new Error(`Login failed for ${account.email}: ${res.status}`);
  return (await res.json()).token;
}

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image download failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function createPost(token, content, mood, imageUrl) {
  if (imageUrl) {
    // Multipart upload with image
    const imgBuffer = await downloadImage(imageUrl);
    const formData = new FormData();
    formData.append('content', content);
    if (mood) formData.append('mood', mood);
    formData.append('images', new Blob([imgBuffer], { type: 'image/jpeg' }), 'image.jpg');

    const res = await fetch(`${BASE}/posts`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error(`Post failed: ${res.status} ${await res.text()}`);
    return res.json();
  } else {
    const formData = new URLSearchParams();
    formData.append('content', content);
    if (mood) formData.append('mood', mood);

    const res = await fetch(`${BASE}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    if (!res.ok) throw new Error(`Post failed: ${res.status} ${await res.text()}`);
    return res.json();
  }
}

async function main() {
  console.log('=== Candid Seed Script ===\n');

  console.log('Logging in...');
  const tokens = [];
  for (const account of accounts) {
    try {
      const token = await login(account);
      tokens.push(token);
      console.log(`  ✓ ${account.email}`);
    } catch (err) {
      console.error(`  ✗ ${account.email}: ${err.message}`);
    }
    await sleep(100);
  }

  if (tokens.length === 0) {
    console.error('\nNo accounts ready. Is the backend running on http://localhost:8080?');
    process.exit(1);
  }

  console.log(`\n${tokens.length}/${accounts.length} accounts ready.\n`);
  console.log('Creating 50 posts...');

  let created = 0;
  let imageIdx = 0;

  for (let i = 0; i < posts.length; i++) {
    const token = tokens[i % tokens.length];
    const { content, mood } = posts[i];
    const imageUrl = IMAGE_POST_INDICES.has(i) ? IMAGE_URLS[imageIdx++] : null;

    try {
      await createPost(token, content, mood, imageUrl);
      created++;
      process.stdout.write(`\r  ${created}/50 posts created...`);
    } catch (err) {
      console.error(`\n  ERROR post ${i + 1}: ${err.message}`);
    }
    await sleep(120);
  }

  console.log(`\n\n=== Done! ===`);
  console.log(`Posts created: ${created}/50`);
  console.log(`\nTimestamps are live — posts will show "just now", then "1m", "2m" etc. as time passes.`);
}

main().catch(console.error);
