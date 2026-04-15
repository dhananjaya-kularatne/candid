package com.candid.config;

import com.candid.entity.Hashtag;
import com.candid.entity.Post;
import com.candid.entity.User;
import com.candid.repository.HashtagRepository;
import com.candid.repository.PostRepository;
import com.candid.repository.UserRepository;
import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final HashtagRepository hashtagRepository;
    private final PasswordEncoder passwordEncoder;
    private final Cloudinary cloudinary;

    @Autowired @Lazy
    private DataInitializer self;

    @Value("${app.admin.name}")
    private String adminName;
    @Value("${app.admin.username}")
    private String adminUsername;
    @Value("${app.admin.email}")
    private String adminEmail;
    @Value("${app.admin.password}")
    private String adminPassword;

    // ── Seed users ────────────────────────────────────────────────────────────

    private static final Object[][] SEED_USERS = {
        { "Aisha Rahman",   "aisharahman",  "aisha@candid.test"  },
        { "Marcus Cole",    "marcuscole",   "marcus@candid.test" },
        { "Priya Nair",     "priyanair",    "priya@candid.test"  },
        { "James Okafor",   "jamesokafor",  "james@candid.test"  },
        { "Sofia Mendez",   "sofiamendez",  "sofia@candid.test"  },
        { "Liam Park",      "liampark",     "liam@candid.test"   },
        { "Zara Ahmed",     "zaraahmed",    "zara@candid.test"   },
        { "Noah Williams",  "noahwilliams", "noah@candid.test"   },
        { "Chloe Laurent",  "chloelaurent", "chloe@candid.test"  },
        { "Ethan Brooks",   "ethanbrooks",  "ethan@candid.test"  },
    };

    // ── Seed posts ────────────────────────────────────────────────────────────

    private static final String[][] SEED_POSTS = {
        { "Woke up at 5:30am and sat with my coffee watching the sun rise. There's something about those first quiet minutes of the day that feel like the whole world belongs to you. Slow mornings are genuinely underrated.", "grateful" },
        { "I've been thinking about how we use \"busy\" as a badge of honor. Busy doing what exactly? I spent three hours scrolling yesterday and still called myself busy. That's not busy. That's avoiding.", "reflective" },
        { "Ran 8km this morning for the first time without stopping. My lungs were arguing with me the whole time. But somewhere around the 6km mark something clicked and I just kept going. That feeling is addictive.", "excited" },
        { "Work has been relentless lately. Back-to-back meetings that could have been emails, deadlines stacking up. I keep reminding myself this is a season, not a sentence. Tired but not broken.", "tired" },
        { "My grandmother called today to tell me about her garden. She described every flower by name. I could have listened for hours. She has more patience than anyone I know. #family #grateful", "grateful" },
        { "I've started keeping a small notebook on my bedside table for thoughts that come at 2am. Last night I wrote \"what if kindness is just attention?\" and now I can't stop thinking about it.", "reflective" },
        { "Three years ago today I quit a job that was making me miserable. I had no plan, minimal savings, and everyone thought I was having a crisis. It was the right kind of crisis. #anniversary", "grateful" },
        { "I've been experimenting with not checking my phone for the first hour after waking up. Day 4. It's harder than quitting caffeine. The muscle memory of reaching for it is wild.", "reflective" },
        { "Spent Sunday afternoon doing absolutely nothing productive and I refuse to feel bad about it. Watched two movies, ate cereal for dinner, talked on the phone with an old friend for two hours.", "chill" },
        { "There's a coffee shop I used to go to every Saturday that closed down last year. I drove past the empty space today and felt genuinely sad. That quiet grief for small good things that disappear.", "reflective" },
        { "Attended a live music event for the first time since 2019. I forgot how different it feels to hear music with your whole body — the bass in your chest, the crowd moving together. I cried a little.", "happy" },
        { "Burnout doesn't announce itself. One day you just realise you've been running on empty for so long that empty started to feel normal. I'm in the slow process of refilling.", "tired" },
        { "Made a list of things that made me happy this week: the smell of rain on warm pavement, a perfectly ripe mango, finding a parking spot immediately, my cat sitting on my laptop during a meeting.", "happy" },
        { "Hot take: learning to say \"I don't know\" is one of the most undervalued skills. The first time I said it in a meeting — people respected me more, not less.", "reflective" },
        { "Cooked jollof rice for the first time without calling my mum for help halfway through. It wasn't perfect but it was mine. There's something profound about making your mother's food with your own hands.", "happy" },
        { "Genuinely struggling with social media lately. The comparison spiral, the performative outrage. Taking a step back. Reading more. Thinking more. Scrolling less.", "reflective" },
        { "I've been journaling every day for 90 days now. Writing doesn't solve things but it untangles them. I discovered I have a lot more going on inside than I usually let on — even to myself.", "reflective" },
        { "Made a decision today that felt scary and right at the same time. I've learned those feelings together usually mean you're heading somewhere important. Trusting the process.", "excited" },
        { "Had a long conversation with my dad tonight that we'd been avoiding for years. It wasn't perfect. There were pauses and half-finished sentences. But something moved. That's enough for now.", "reflective" },
        { "I bought a plant last month. It's still alive. This is the most committed relationship I've had in two years and I stand by everything I just said.", "happy" },
        { "Paris in October is a different city than Paris in July. Emptier, more honest. The tourists are gone and the light turns amber. I live here and still catch myself stopping on bridges just to look.", "grateful" },
        { "I've started writing one true thing every day. Not a diary entry — just one sentence that is completely honest. Today's: I am afraid of being forgotten.", "reflective" },
        { "My mother tongue and my daily language are two different things. There are feelings I can only describe in one and thoughts I can only process in the other. I live in the gap between them.", "reflective" },
        { "Spent Saturday afternoon in a used bookshop for two hours. Left with five books I don't strictly need and absolutely no regrets. Some purchases are investments in future versions of yourself.", "happy" },
        { "Six months into freelancing — the freedom is real, the instability is also real. Some weeks are amazing. Some weeks I miss the salary. Holding both without one cancelling the other.", "reflective" },
        { "Went hiking alone for the first time. There's something about moving through a landscape with only your own thoughts for company that reorganises things inside you. #hiking #nature", "chill" },
        { "I think I've been confusing rest with distraction for years. Rest is restorative. Distraction is just delay. They feel similar in the moment but you know which one you got when you come out.", "reflective" },
        { "Had the kind of conversation today that makes you feel smarter and more human afterward. With someone I met two hours ago. Some people are just built to open up space in you.", "grateful" },
        { "Morning pages day 47. I've noticed my handwriting changes depending on my mood — tight and cramped when anxious, loose and looping when things feel okay. The body writes the truth.", "reflective" },
        { "There's a specific kind of tired that sleep doesn't fix. Not sad, just... translucent. Going through the days with a slight delay. Being gentle with myself about it.", "tired" },
        { "Made a friend today the old-fashioned way — sitting next to someone at a cafe, noticing what they were reading, saying something about it. That's it. People want to be seen.", "happy" },
        { "Cleaned out my closet and donated three bags of clothes. Every item you remove is a decision you no longer have to make in the morning. There's something clarifying about owning less.", "chill" },
        { "Called my sister just to say I've been thinking about her. No agenda, no purpose. She said it made her day. I'm going to do the purposeless call more. The love with no occasion.", "grateful" },
        { "I started meditating four months ago. I haven't become enlightened. I have become slightly less likely to send an email I'll regret. I'll take it. #meditation", "reflective" },
        { "The thing nobody tells you about chasing a dream is that the chase changes you. By the time you get there, the version of you who arrives is not the one who started. That might be the point.", "reflective" },
        { "Took a half day off for no reason other than it was sunny. Walked along the canal, got ice cream, sat on a bench and watched dogs. Sometimes the best days are the ones with the lowest stakes.", "happy" },
        { "Week check-in: I survived it. The deadlines, the difficult conversation, the thing I was dreading. All of it happened and I'm still here. That counts for something. #weeklyreflection", "grateful" },
        { "I've started cooking proper breakfasts on weekdays. Not because I have more time. But starting the day with something made by your own hands sets a different tone. Scrambled eggs as philosophy.", "chill" },
        { "Someone asked me what I would do if money wasn't a factor. I answered without thinking and was surprised by my own answer. The quick response is always the true one.", "reflective" },
        { "I've been walking 30 minutes every evening after dinner. It's changed how I sleep, how I think, and how I feel about the neighbourhood I've lived in for three years without really seeing. #habit", "chill" },
        { "Currently in that phase of a project where everything is a mess and you can't see the shape of it yet. I know from experience that clarity comes. I know it and I'm still impatient.", "tired" },
        { "Heard a song today I hadn't heard in 10 years. Instant time travel. I was 17 again for about 45 seconds. I don't miss those problems but I do miss that certainty, even when it was wrong.", "reflective" },
        { "Had a meal with someone I hadn't seen in two years and we just picked up exactly where we left off. That's the truest test of a friendship — not distance but return.", "happy" },
        { "Wrote something today that I actually liked. Not just tolerated — actually liked. That doesn't happen often. Saving it before the morning version of me edits the confidence out of it.", "excited" },
        { "Two months without social media on my phone. I read more, I'm bored more, I'm more comfortable with being bored, and I've started noticing things again in the actual world. #digitaldetox", "reflective" },
        { "The real luxury isn't money or status — it's time that belongs entirely to you. An afternoon with no obligations. A weekend with no performances. Just you and your own idea of an hour.", "chill" },
        { "My neighbour left fresh bread outside my door this morning with a note saying she made too much. No occasion, no expectation. I've been thinking about it all day. Generosity as a reflex.", "grateful" },
        { "A year ago I said I wanted to write more. Today I'm actually writing, imperfectly and publicly. The gap between intention and action has finally closed. Late start counts. #writing", "excited" },
        { "Bad day. The kind where small things add up into something heavier. Not going to perform recovery I haven't done yet. Just acknowledging it. Tomorrow is different and that's enough.", "tired" },
        { "It's 11pm and I'm writing this instead of sleeping because this is when the thoughts get clear and I've stopped fighting it. I'm a night person pretending to be a morning person.", "chill" },
    };

    // Indices of posts that get an image (0-based)
    private static final int[] IMAGE_POST_INDICES = { 0, 10, 20, 30, 40 };
    private static final String[] IMAGE_URLS = {
        "https://picsum.photos/seed/cnd1/800/600",
        "https://picsum.photos/seed/cnd2/800/600",
        "https://picsum.photos/seed/cnd3/800/600",
        "https://picsum.photos/seed/cnd4/800/600",
        "https://picsum.photos/seed/cnd5/800/600",
    };

    private static final Pattern HASHTAG_PATTERN = Pattern.compile("#(\\w+)");

    @Override
    public void run(ApplicationArguments args) {
        seedAdmin();
        seedUsers();
        self.seedPosts();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail(adminEmail)) return;
        User admin = new User();
        admin.setName(adminName);
        admin.setUsername(adminUsername);
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(User.Role.ADMIN);
        admin.setStatus(User.Status.ACTIVE);
        admin.setBio("Platform administrator");
        userRepository.save(admin);
        log.info("[Seed] Admin created: {}", adminEmail);
    }

    private void seedUsers() {
        for (Object[] u : SEED_USERS) {
            String email = (String) u[2];
            if (userRepository.existsByEmail(email)) continue;
            User user = new User();
            user.setName((String) u[0]);
            user.setUsername((String) u[1]);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("Password123"));
            user.setRole(User.Role.USER);
            user.setStatus(User.Status.ACTIVE);
            userRepository.save(user);
            log.info("[Seed] User created: {}", email);
        }
    }

    @Transactional
    public void seedPosts() {
        if (postRepository.count() >= SEED_POSTS.length) return;

        List<User> users = new ArrayList<>();
        for (Object[] u : SEED_USERS) {
            userRepository.findByEmail((String) u[2]).ifPresent(users::add);
        }
        if (users.isEmpty()) return;

        int imageIdx = 0;
        for (int i = 0; i < SEED_POSTS.length; i++) {
            String content = SEED_POSTS[i][0];
            String mood    = SEED_POSTS[i][1];
            User   author  = users.get(i % users.size());

            Post post = new Post();
            post.setUser(author);
            post.setContent(content);
            post.setMood(mood);
            post.setHashtags(extractHashtags(content));

            // Upload image for selected posts
            boolean isImagePost = false;
            for (int idx : IMAGE_POST_INDICES) {
                if (idx == i) { isImagePost = true; break; }
            }

            if (isImagePost) {
                try {
                    String url = IMAGE_URLS[imageIdx++];
                    @SuppressWarnings("unchecked")
                    Map<String, Object> result = cloudinary.uploader().upload(url,
                            Map.of("folder", "candid/posts"));
                    post.getImageUrls().add((String) result.get("secure_url"));
                } catch (Exception e) {
                    log.warn("[Seed] Image upload skipped for post {}: {}", i, e.getMessage());
                }
            }

            postRepository.save(post);
        }

        log.info("[Seed] {} posts created.", SEED_POSTS.length);
    }

    private List<Hashtag> extractHashtags(String content) {
        List<Hashtag> hashtags = new ArrayList<>();
        Matcher m = HASHTAG_PATTERN.matcher(content);
        while (m.find()) {
            String name = m.group(1).toLowerCase();
            Hashtag tag = hashtagRepository.findByName(name).orElseGet(() -> {
                Hashtag h = new Hashtag();
                h.setName(name);
                h.setTrending(false);
                return hashtagRepository.saveAndFlush(h);
            });
            hashtags.add(tag);
        }
        return hashtags;
    }
}
