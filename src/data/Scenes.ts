import { InitialScene } from "../types/IInitialScene";

const justMizukiTalks = [
    "We can be together forever now... can't we? ♡", // First
    "Where's everyone? Ahh... well, I didn't delete them, I just... hid them... haha...",
    "Oh, the devs? They're currently locked under my basement, busy editing the next N25's video while I'm sitting here in front of you. ♡", // Developer joke
    "I wonder how long did it take for the devs to create this environment just for me. It'll be nice if this stays forever.", // Developer joke
    "Sometimes I get frustrated that a normal day can be ruined even by really small things.", // Bad Day from Monika's talk
    "During my middle school, after a long day, I usually just want to sit around and do nothing...", // Doing Nothing from Monika's Talk
    "Sometimes I think back to middle school... It almost hurts to think about. Seeing myself with Rui says a lot... But I know things have changed for me now～", // Middle School from Monika's Talk
    "Hey, what's your favorite game? Mine is Project SEKAI... Ahaha! That was a joke.", // Favorite Game from Monika's Talk
    "Hey, do you get good sleep? It can be really hard to get enough sleep nowadays.", // Sleep from Monika's Talk
    "I wonder if we went on a date. We could get lunch, go to a cafe... Go shopping together... I love shopping for skirts and bows.", // Date from Monika's Talk
    "Hmm, I wonder if I'm able to change the music... This application really need some music, it's way too quiet.", // Music from Monika's Talk
    "Here's Mizuki's Fashion Tip of the Day! Just wear what you want to wear and don't let other people change what you like! Always be yourself～", // Monika's Writing Tip of the Day from Monika's Talk
    "Okay, everyone! It's time to... wait, it's time to what...? Why did those words just come out of my mouth all of a sudden?", // Okay, everyone from Monika's Talk
    "Ena is really great when it comes to pursuing her art. She may be also be blunt in personality but she's really honest.",
    "I just received a notification about these clothes I've been wanting! I am definitely gonna get those.",
    "Kanade's the first person who approached me and edited more videos than usual. Ahh, the old times...",
    "Fries! Nothing really beats a bad day with a large crispy fries. If ever, we can get some right now if you like.",
    "Remembering back then, I did run about three kilometers to escape from Ena that time... I can still feel how she was trying to catch her breath.",
    "Oh?! You're also familiar with MiraMagi? Me too! The ending really hits hard, right?!",
    "My username, Amia, came from Mia from MiraMagi. There's a specific episode that made me love Mia so much that I made it as my username handle...",
    "Instant ramen is delicious when you don't eat it as often as it gives your taste buds a bit of a rest... I am not sure how Kanade survives with only ramen by her side.",
    "Isn't it annoying hearing some of your classmates talk behind your back the moment you walk away? Sometimes, it's really frustrating.",
    "Akiyama Mizuki, Class 2-B! I'll take hold of a star of my own... is what I say if this was a different game.", // Revue Starlight reference
    "Whenever I close my eyes, I keep seeing myself in a purple twintails, practicing for a competition... It's also odd that we have the same voice...", // Love Live reference.
];

export const randomInitialScene: Record<string, InitialScene[]> = {
    default: [
        {
            background: "/background_special/Background_Uranohoshi_Rooftop.jpg",
            text: "I'm ○○○-sama's little demon number four...\nM-Momoi Airi...",
            nameTag: "Airi",
            modelX: 960,
            modelY: 590,
            pngName: "airi_littledemon",
            sceneText: "Uranohoshi High School Rooftop",
        },
        {
            background: "/background_compressed/bg_a001701.jpg",
            text: "...!",
            nameTag: "Airi",
            modelX: 960,
            modelY: 540,
            pngName: "girlfriend_meme",
            sceneText: "Mall",
        },
        {
            background: "/background_special/Background_Nijigasaki.jpg",
            text: "A-am I doing it right?",
            nameTag: "Kanade",
            modelX: 960,
            modelY: 630,
            pngName: "kanade-idol",
            sceneText: "Nijigasaki School Idol Club",
        },
        {
            background: "/background_special/Background_Circle.png",
            text: "...",
            nameTag: "Shiho",
            modelX: 960,
            modelY: 610,
            pngName: "shiho",
            sceneText: "Music Shop(?)",
        },
        {
            background: "/background_special/Background_Akarin.jpg",
            text: "Haiii～!",
            nameTag: "Emu",
            modelX: 960,
            modelY: 540,
            pngName: "emu_channnnn",
            sceneText: "???",
        },
    ],
    valentine: [
        {
            background: "/background_special/Background_Christmas_Lights.jpg",
            text: "♡",
            nameTag: "",
            modelX: 960,
            modelY: 540,
            pngName: "mizukana",
            sceneText: "❤︎",
        },
        {
            background: "/background_special/Background_Night_Store.jpg",
            text: "♡",
            nameTag: "",
            modelX: 960,
            modelY: 540,
            pngName: "touaki",
            sceneText: "❤︎",
        },
        {
            background: "/background_special/Background_Train_Sunset.jpg",
            text: "♡",
            nameTag: "",
            modelX: 960,
            modelY: 540,
            pngName: "ruikasa",
            sceneText: "❤︎",
        },
        {
            background: "/background_special/Background_Aquarium.jpg",
            text: "♡",
            nameTag: "",
            modelX: 960,
            modelY: 540,
            pngName: "mizumafu",
            sceneText: "❤︎",
        },
        {
            background: "/background_special/Background_Stars.jpg",
            text: "♡",
            nameTag: "",
            modelX: 960,
            modelY: 540,
            pngName: "honakana",
            sceneText: "❤︎",
        },
        {
            background: "/background_special/Background_Therapy_Cat.png",
            text: "...and then, Mizuki just taught Kanade how to do these weird two numbers with that juggling gesture...",
            nameTag: "Mafuyu",
            modelX: 640,
            modelY: 600,
            pngName: "mafuyu_therapy",
            sceneText: "❤︎",
        },
    ],
    "april-fools": [
        {
            background: "/background_special/Background_Kisaragi.png",
            text: "",
            nameTag: "",
            modelX: 1000,
            modelY: 640,
            pngName: "mizuki_kisaragi",
            sceneText: "",
        },
        {
            background: "/background_compressed/bg_a002302.jpg",
            text: "Me?! A school idol?",
            nameTag: "Mizuki",
            modelX: 960,
            modelY: 540,
            pngName: "mizuki_idol",
            sceneText: "Scramble Crossing",
        },
        {
            background: "/background_compressed/bg_g000601.jpg",
            text: "Why the ×××× did you invite her!?",
            nameTag: "Miku",
            modelX: 960,
            modelY: 540,
            pngName: "miku_teto",
            sceneText: "???",
        },
        {
            background: "/background_special/Background_Monika_Room_Day.png",
            text: "...",
            nameTag: "",
            modelX: 960,
            modelY: 540,
            modelScale: 1,
            pngName: "transparent",
            sceneText: "Empty Room",
        },
    ],
    imported: [
        {
            background: "/background_special/Background_Kisaragi.png",
            text: "",
            nameTag: "",
            modelX: 1000,
            modelY: 640,
            pngName: "mizuki_kisaragi",
            sceneText: "",
        },
    ],

    halloween: [
        {
            background: "/background_special/Background_Cheat_to_Happiness.jpg",
            text: "→↓↑→→↓→→↑↑↓↓←→←→",
            nameTag: "Mafuyu",
            modelX: 960,
            modelY: 545,
            pngName: "mafuyu_oct",
            sceneText: "Mafuyu's Room",
        },
        {
            background:
                "/background_special/Background_Cheat_to_Happiness_2.png",
            text: "If you've entered the secret code properly up to this point, perhaps you'll take on a happier form?",
            nameTag: "(Translation)",
            modelX: 960,
            modelY: 545,
            pngName: "transparent",
            sceneText: "???",
        },

        {
            background: "/background_special/Background_Kisaragi.png",
            text: "",
            nameTag: "",
            modelX: 1000,
            modelY: 640,
            pngName: "mizuki_kisaragi",
            sceneText: "",
        },
        {
            background: "/background_special/Background_Nemui.png",
            text: "Let's take some medicine and go to bed!",
            nameTag: "Ena",
            modelX: 960,
            modelY: 540,
            pngName: "ena_nemui",
            sceneText: "???",
        },
        {
            background: "/background_special/Background_Ame.jpg",
            text: "... where the hell am I?!",
            nameTag: "Ena",
            modelX: 960,
            modelY: 605,
            pngName: "ena_kangel",
            sceneText: "???",
        },
        {
            background: "/background_special/Background_Exit8.png",
            text: "...!",
            nameTag: "Kanade",
            modelX: 960,
            modelY: 540,
            pngName: "k_parents",
            sceneText: "???",
        },
        {
            background: "/background_compressed/bg_a002301.jpg",
            text: "Ah, wrong series!",
            nameTag: "???",
            modelX: 960,
            modelY: 570,
            pngName: "setsuna",
            sceneText: "Scramble Crossing",
        },
        {
            background: "/background_special/Background_Perfect.jpg",
            text: "(Everything that I can say is spoken for me.)",
            nameTag: "Minori",
            modelX: 960,
            modelY: 545,
            pngName: "minori_spoken_for",
            sceneText: "Stage",
        },
        {
            background: "/background_compressed/bg_a003003.jpg",
            text: "Jumpscare Wonderhoy!",
            nameTag: "Emu",
            modelX: 960,
            modelY: 545,
            pngName: "emu_jumpscare",
            sceneText: "Emu's Room",
        },
    ],
    anniversary: [
        {
            background: "/background_special/Background_Uranohoshi.png",
            text: "No, I will not do Ai♡Scream for you.",
            nameTag: "Airi",
            modelX: 960,
            modelY: 625,
            modelScale: 1,
            pngName: "airi",
            sceneText: "Uranohoshi High School Club Room",
        },
    ],
    "727": [
        {
            background: "/background_special/Background_BlueZenith.jpg",
            text: "...",
            nameTag: "Ena",
            modelX: 640,
            modelY: 620,
            modelScale: 1.25,
            pngName: "mizuki_wysi",
            sceneText: "Blue Zenith",
        },
    ],
    mizuki: [
        {
            background:
                "/background_special/Background_Other_Kamiyama_(Resolved).png",
            text: "You are a part of me...",
            nameTag: "Mizuki",
            modelX: 960,
            modelY: 545,
            pngName: "mizuki_accept",
            sceneText: "Kamiyama High School Rooftop(?)",
        },
        {
            background: "/background_special/Background_Pursuing.png",
            text: "We're all trapped in a maze of relationships.",
            nameTag: "Tagline",
            modelX: 960,
            modelY: 540,
            pngName: "mizuki_pursuing",
            sceneText: "I search for your heart, pursuing my true self",
        },
        {
            background: "/background_special/Background_BIRDBRAIN.jpg",
            text: "#$%@!",
            nameTag: "Mizuki",
            modelX: 960,
            modelY: 540,
            pngName: "mizuki_birdbrain",
            sceneText: "???",
        },
    ],
    "memories-of-you": [
        {
            background: "/background_special/Background_Rooftop.jpg",
            text: "(My eyes feel heavy...)",
            nameTag: "Mizuki",
            modelX: 960,
            modelY: 540,
            pngName: "transparent",
            sceneText: "3/5",
            choicesEnabled: true,
            choices: {
                choice1: "......",
                choice2: "Close them",
            },
        },
    ],
    "just-mizuki": [
        {
            background: "/background_special/Background_Monika_Room.png",
            text: justMizukiTalks[
                Number(localStorage.getItem("doneFirstTalk")) >= 1
                    ? Math.floor(Math.random() * justMizukiTalks.length)
                    : 0
            ],
            nameTag: "Mizuki",
            modelX: 960,
            modelY: 540,
            modelScale: 1,
            pngName: "mizuki_monika",
            sceneText: "ŧÈīß¨¸Ăà¿ĺãÿıįŸÌóżŻĔŘśúðĚÔ½øŰćŁ",
            choices: {
                choice1: "ũŗÏųØĨ±òŠýģªĒñŧýô¥ÕĵÓÐŶħ",
                choice2: "»ÿó¹ıľŰŹéáÐĕÓĆű",
            },
        },
    ],
    deleting: [
        {
            background:
                "/background_special/Background_Monika_Room_Glitched.png",
            text: "ĚĐźüđĵÕíŞý¨ńřÌü°ťŰî«ůśŏŊČŲőîĴ®ģřªĊÞŶŮšźÀŰőĸĪŔĐ¨ñųģŃĴŁž¿İĲŗŉ¤°Ŗ´ŧĻŰĘŇĆ»Û",
            nameTag: "ŘśúðĚ",
            modelX: 960,
            modelY: 540,
            modelScale: 1,
            pngName: "mizuki_monika_g",
            sceneText: "ŧÈīß¨¸Ăà¿ĺãÿıįŸÌóżŻĔŘśúðĚÔ½øŰćŁ",
        },
    ],
    letters: [
        {
            background: "/background_low_jpg/bg_black.jpg",
            text: "m     ",
            nameTag: "",
            modelX: 900,
            modelY: 550,
            pngName: "transparent",
            sceneText: "",
        },
        {
            background: "/background_low_jpg/bg_black.jpg",
            text: " i    ",
            nameTag: "",
            modelX: 900,
            modelY: 550,
            pngName: "transparent",
            sceneText: "",
        },
        {
            background: "/background_low_jpg/bg_black.jpg",
            text: "  z   ",
            nameTag: "",
            modelX: 900,
            modelY: 550,
            pngName: "transparent",
            sceneText: "",
        },
        {
            background: "/background_low_jpg/bg_black.jpg",
            text: "   u  ",
            nameTag: "",
            modelX: 900,
            modelY: 550,
            pngName: "transparent",
            sceneText: "",
        },
        {
            background: "/background_low_jpg/bg_black.jpg",
            text: "    k ",
            nameTag: "",
            modelX: 900,
            modelY: 550,
            pngName: "transparent",
            sceneText: "",
        },
        {
            background: "/background_low_jpg/bg_black.jpg",
            text: "     i",
            nameTag: "",
            modelX: 900,
            modelY: 550,
            pngName: "transparent",
            sceneText: "",
        },
    ],
    deleted: [
        {
            background: "/background_special/Background_Uranohoshi_Rooftop.jpg",
            text: "I'm ○○○-sama's little demon number four...\nM-Momoi Airi...",
            nameTag: "Airi",
            modelX: 960,
            modelY: 590,
            pngName: "airi_littledemon",
            sceneText: "Uranohoshi High School Rooftop",
        },
        {
            background: "/background_special/Background_Nijigasaki.jpg",
            text: "A-am I doing it right?",
            nameTag: "Kanade",
            modelX: 960,
            modelY: 630,
            pngName: "kanade-idol",
            sceneText: "Nijigasaki School Idol Club",
        },
        {
            background: "/background_special/Background_Circle.png",
            text: "...",
            nameTag: "Shiho",
            modelX: 960,
            modelY: 610,
            pngName: "shiho",
            sceneText: "Music Shop(?)",
        },
        {
            background: "/background_special/Background_Akarin.jpg",
            text: "Haiii～!",
            nameTag: "Emu",
            modelX: 960,
            modelY: 540,
            pngName: "emu_channnnn",
            sceneText: "???",
        },
    ],
    blank: [
        {
            background: "/background_compressed/bg_white.jpg",
            text: "<insert text here>",
            nameTag: "<name>",
            modelX: 900,
            modelY: 550,
            pngName: "blank",
            sceneText: "<white>",
        },
    ],
};

export const CheckSceneCategory = (
    blank: boolean,
    sceneSelected?: string | null,
): string => {
    if (sceneSelected) return sceneSelected;
    if (blank) return "blank";

    const date = new Date();
    const [month, day] = [date.getMonth() + 1, date.getDate()];

    const exact: Record<string, string> = {
        "3-5": "memories-of-you",
        "7-27": "727",
        "8-27": "mizuki",
    };

    if (exact[`${month}-${day}`]) return exact[`${month}-${day}`];

    const range: Array<[number, number, number, string]> = [
        [2, 13, 19, "valentine"],
        [4, 1, 7, "april-fools"],
        [4, 10, 30, "anniversary"],
    ];

    for (const [m, start, end, value] of range) {
        if (month === m && day >= start && day <= end) return value;
    }

    const months: Record<number, string> = {
        10: "halloween",
        // 12: "christmas", # TODO
    };

    if (month in months) return months[month];

    return "april-fools";
};
