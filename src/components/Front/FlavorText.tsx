import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* 
    For reference of the jokes in English flavor text, scroll below
*/

const randomText = {
    en: [
        "Can you hear the ominous bells tolling?",
        "Nene is playing maimai. The map is Xaleid◆scopiX.",
        "Rui with his ThinkPad laptop.",
        "Rui is on his way to recreate GLaDOS for their next show.",
        "Tsukasa is laughing in the hallway like a kid again.",
        'Emu breaks the fourth wall, staring at you and says "Wonderhoy!"',
        "Ichika is fangirling over Miku. Again.",
        "Saki collapses after walking for 10 meters.",
        "Honami is driving without her driver license.",
        "Shiho is forming a new band with her little Phennies.",
        "Shizuku is giving Shiho some make up.",
        "In a parallel universe, where Minori is the leader of ASRUN.",
        "Haruka becomes the wife of Minori.",
        "Airi lost her fang.",
        "Setsuna has been mistakenly called Kanade for the 1888th time.",
        'K and OWN made music together titled "Kamui". [v=Z64pjmgHg4I]',
        "Mizuki is five kilometers away from your house.",
        "Mizuki stole the precious thing.",
        "Mizu-Mizu-Kii!",
        "Come here, Mafuyu-chan.",
        "Ena threw a large basin on Akito.",
        "Ena fights against AI Art.",
        "Ena was caught pirating Ph〇to〇hop.",
        "Toya is enjoying Tsukasa's loud laugh.",
        "Kohane has been bitten by her pet snake.",
        "An woke up and started speaking in English.",
        "Akito is spotted unconscious after eating Ena's favorite cheesecake.",
        "ABSOLUTE CINEMA",
        "The Disapperance of Hatsune Miku",
        "Listening to Heat Abnormal (WxS Version)",
        "Do not overdose yourself with shipping~",
        "Please take only the recommended shipping dosage.",
        "Just Monika.",
        "What if Movie Miku appeared on my screen all of the sudden?",
        "MinoHaru is canon.",
        "AnHane is canon.",
        "MizuEna is canon.",
        "Won won!?",
        "WONDERHOY!",
        "Lovely, Fairy, Momoi Airi!",
        "Meet SEKAI Stories's cousin, SIFAS Dialogue Sandbox!",
        '"Smilie, how many more Lo〇e Li〇e! VA joke are you going to make!?"',
        "Girls are now composing...",
        "Squad is now vibing...",
        "Idols are now practicing...",
        "Troupe is now rehearsing...",
        "Band is now playing...",
        "私は雨。(turns into ame-chan)",
        "██ ██ ██ ██ /  ██ ██ ██",
        "kurukurukurukurukurikaesu",
        "saa anyo anyo kocchi oide",
        "恋をして",
        "jamie paige is so mid. i mean, sincerely, who listen to ts?",
        "I spend my hours doing alchemy",
        "じゃ！",
        "Burn Your Dread.",
        "It's a amazing!",
        "This was a triumph.",
        "Bonds of people is the true power.",
        "11037",
        "Mukuro Ikusaba. The sixteenth student, lying hidden somewhere in this school. The one they call the Ultimate Despair. Watch out for her.",
        "It's pronounced 'DEKO-NINA'.",
        "Stream Moe Shop!",
        "Stream Jamie Paige!",
        "Untitled.",
    ],
    fil: [
        "Nadidinig mo ba ang mga kampana na tumitindig?",
        "Naglalaro si Nene ng maimai. Pinagod ng Xaleid◆scopiX.",
        "Si Rui at ang kanyang ThinkPad.",
        "Tumatawa nanaman ng parang baliw si Tsukasa.",
        'Nakatingin ngayon si Emu sa\'yo. Sabihin mo lang, "Salamat, Emu!".',
        "Pinatugtog ng Magbalik si Ichika.",
        "Hinihingal si Saki matapos lumakad ng isang kilometro",
        "Nahuli ng MMDA si Honami.",
        "Sumabay naman si Shiho sa Magbalik ni Ichika.",
        "Natagpuan si Shizuku sa Megamll at hindi na makauwi.",
        "Napanaginipan ni Minori na naging sila ni Haruka.",
        "Nawala ang nag-iisang ngipin ni Airi.",
        "Pang-apat na araw nang hindi naliligo si Kanade.",
        "Iboto si Mizuki sa susunod na halalan.",
        "Halika rito, Mafuyu-chan~",
        "Binatuhan ng tabo ni Ena si Akito.",
        "Nakitang tumatawa si Toya kasama si Tsukasa",
        "Hinahanap ni Kohane ang kanyang An.",
        "Maniniwala ba kayo na isang Filipino si An?", // TL Note: Sumi Tomomi Jiena is half-Filipino
        "BALITA: Isang estudyante nangangalang Akito, dead on the spot matapos kainin ang keyk ng kanyang kapatid.",
        "Si Mizuki lamang.",
        "Mabuhay ang MizuEna.", // A parody on the massive AlDub Cult "Mabuhay ang AlDub"
        "Mabuhay ang AnHane.", // A parody on the massive AlDub Cult "Mabuhay ang AlDub"
        "Mabuhay ang MinoHaru.", // A parody on the massive AlDub Cult "Mabuhay ang AlDub"
        "WANDERHOY!",
        "UY PILIPINS.",
        "Sumasayaw si T〇to ng Machine Love (Budots Edition).",
        "ANG INETTTTTTTTTT",
        "?lat=15.779313780199093 &lng=119.98590787177731 &zoom=13", // wplace.live/
    ],
    zh: [
        "宁宁在玩乌蒙地插，铺面是系ぎて",
        "类带着他的Thinkpad笔电",
        "怪人一二的司君又双叒叕在神高走廊大笑了",
        "笑梦酱打破了第四面墙，对着你说：“旺大吼！！！”",
        "一歌依然是第一Miku推",
        "Saki酱发烧了",
        "有一个人带着超多的苹果派走了，会是谁呢？好难猜啊",
        "Shiho又和蕾欧妮的几人吵架了，想组建一个新乐队",
        "szk在十字路口迷路了！豆腐人们快扣1帮她找到路吧！x",
        "在平行宇宙里，实乃理是ASRUN的人",
        "啊啊啊啊！！！！翻译真的难！！！",
        "爱莉失去了偶像工作",
        "setsuna已经被叫成knd1888次了",
        "MZK已经离TA家18千米远了，据说是ena追的（糖5还在追）",
        "Mafuyu吓唬Emu，让她停止打破第四堵墙（联系上下文）",
        "东云姐弟打起来了！",
        "ena姐：杜绝AIGC从你我做起",
        "toya和tks在看舞台剧",
        "心羽被她的宠物蛇咬伤了",
        "an早上起床就开始练习英语，让我们为她的好学点赞（）",
        "电影 -Akito箱后曲",
        "初音未来的消失 -高难易度谱面",
        "你能听到tks的叫声吗？",
        "携带恋话",
        "不要铺张浪费哦！",
        "你知道吗？中文汉化者SteveLF是个25推",
        "莫妮卡来了（心惊肉跳文学部）",
        "如果初音未来突然出现在我的屏幕上怎么办？（这是PJSK电影的剧情，好奇的可以去看看电影）",
        "我是雨！",
        "ena：愛して！　愛して！　愛して！　もっともっと！！！（ena姐在25电台#38的solo）",
        "我们赢了吗？",
        "汪大吼！！",
        "L！O！V！E！mnr！",
        "恋をして",
        "来看看作者的偶像梦幻祭剧情生成器吧！",
        "Untitled.",
        "我绘我名",
    ],
    zhTW: [
        "寧寧在打maimai，鋪面是Xaleid◆scopiX",
        "你能聽到那個不祥的鐘聲嗎？",
        "神代類給某人發送了一個信息。 他並沒有得到回覆。", // 類帶著他的Thinkpad筆電
        "在mizu5之後再了看一遍《神山高校祭》。 我好心痛💔",
        "司君像個孩子般又在神高走廊大笑了",
        "笑夢醬打破了第四面牆，對著你說：“旺大吼！！！”",
        "一歌依然是第一Miku推",
        "Saki.Saki着火了？",
        "有一個人帶著超多的蘋果派走了，會是誰呢？好難猜啊",
        "Shiho想和她的范尼們組建一個新樂隊",
        "szk在十字路口迷路了！豆腐人們快扣1幫她找到路吧！x",
        "在平行宇宙裡，實乃理是ASRUN的人",
        "遥成了實乃理的妻子",
        "愛莉掉了她的牙齒",
        "setsuna已經被叫成kanade1888次了",
        "瑞希看起來毫無精神呢。", // Change this after Nov 30, 2025
        "瑞希離你家18公里遠了",
        "真冬只顧著吃魷魚。", // Change this after Nov 30, 2025
        "繪名在找某人。", // Change this after Nov 30, 2025
        "ena姐：杜絕AIGC從你我做起",
        "toya和tks在看舞台劇",
        "心羽被她的寵物蛇咬傷了",
        "an早上起床就開始練習英語，讓我們為她的好學點讚（）",
        "彰人在想為什麼繪名現在看起來很難過。", // Change this after Nov 30, 2025
        "絕對電影。",
        "初音未來的消失",
        "聽著 / / // / /",
        "只有莫妮卡。",
        "如果無法歌唱的初音突然出現在我的屏幕上怎麼辦？",
        "私は雨。(變成糖糖了)",
        "WON WON!?",
        "旺大吼！！",
        "L！O！V！E！mnr！",
        "戀をして",
        "來看看作者的偶像夢幻祭劇情生成器吧！",
        "無題.",
        "我繪我名",
        "是唸「デコ　ニナ」啦！",
        "瑞繪99",
    ],

    zhHK: [] as string[],
};

const FlavorText: React.FC = () => {
    const [text, setText] = useState<string>("");
    const { i18n } = useTranslation();
    const lng = i18n.language as keyof typeof randomText;

    randomText["zhHK"] = randomText["zhTW"];

    useEffect(() => {
        const languageRandomText = randomText[lng]
            ? randomText[lng]
            : randomText.en;
        setText(
            languageRandomText[
                Math.floor(Math.random() * languageRandomText.length)
            ],
        );
    }, [lng]);
    return <p id="flavor-text">{text}</p>;
};

export default FlavorText;

/* 
    LAST UPDATE: 04/30/2026
    Will not list the obvious PJSK references.
    Placed here for people who needs explaination when translating.

    "Can you hear the ominous bells tolling?"
        -> Mizu5 Joke
    "Nene is playing maimai. The map is Xaleid◆scopiX."
        -> maimai is SEGA's arcade game. 
        -> Xaleid◆scopiX is currently the hardest chart.
    "Rui is on his way to recreate GlaDOS for their next show."
        -> GlaDOS is the main antagonist of the Portal series.
    "Rui with his ThinkPad laptop."
        -> ThinkPads are usually associated with engineers and programmers.
        -> can also be a programming socks humor (iykwim)
    "Saki. Saki on fire?"
        -> A viral TikTok of someone accidentally burning one of her Saki plush.
        -> https://www.tiktok.com/@liloubow/video/7464075124753370398 (dead link :<)
    "Honami is driving without her driver license."
        -> A reoccuring joke of someone having a dream of Honami running over Tsukasa with a car.
    "Setsuna has been mistakenly called Kanade for the 1888th time."
        -> Setsuna is a character from O.N.G.E.K.I., a SEGA Arcade Game.
        -> She is the character on the Don't Fight The Music's jacket.
        -> People mistakenly thought it was Kanade on the said jacket.
        -> 1888 is the maximum Master combo on the said chart.
    "Mizu-Mizu-Kii!"
        -> Nico Yazawa's catchphrase's "Nico Nico Nii!" from Love Live!
    "Come here, Mafuyu-chan."
        -> A popular Akito/Mafuyu ship fanfic
        -> https://old.reddit.com/r/ProjectSekai/comments/11j0ih2/come_here_mafuyuchan/jb363p0/
    "Do not overdose yourself with shipping~"
        -> Needy Streamer Overload reference.
    "Please take only the recommended shipping dosage."
        -> Needy Streamer Overload reference.
    "Just Monika."
        -> Doki Doki Literature Club reference
    "私は雨。(turns into ame-chan)"
        -> (watashi wa ame)
        -> Song Reference: "I am the rain"
        -> Needy Streamer Overload reference.
    "恋をして"
        -> (koi o shite)
        -> Song Reference: "Song of a Eared Robot" and "Machine Love"
    "jamie paige is so mid. i mean, sincerely, who listen to ts?",
        -> Jamie Paige Song Reference: "Aggrandicize"
    "I spend my hours doing alchemy",
        -> Jamie Paige Song Reference: "Cadmium Colors"
    "じゃ！",
        -> Jamie Paige's Song Signature
    "██ ██ ██ ██ / ██ ██ ██",
        -> Song Reference: "Letter to the Black World"
        -> Yes, it spells that morse code from the song
    "kurukurukurukurukurikaesu"
        -> Song Reference: "Looping the Rooms"
    "Burn Your Dread.",
        -> Persona 3 Song Reference: "Burn My Dread" and "Full Moon Full Life"
    "It's a amazing!",
        -> Song Reference: "Envy Baby"
    "Mizuki stole the precious thing."
        -> Touhou Reference: "Marisa Stole the Precious Thing" by IOSYS
    "This was a triumph.",
        -> Portal Song Reference: "Still Alive"
    "Bonds of people is the true power.",
        -> Persona 4 Song Reference: "Beauty of Destiny"
    "Meet SEKAI Stories's cousin SIFAS Dialogue Sandbox!"
        -> lezzthanthree's Love Live! SIFAS Story Generator
    "11037"
    "Mukuro Ikusaba. The sixteenth student, lying hidden somewhere in this school. The one they call the Ultimate Despair. Watch out for her."
        -> Danganronpa References
    '"Smilie, how many more Lo〇e Li〇e! VA jokes are you going to make!?"'
        -> Smilie is lezzthanthree's other name.
        -> Lo〇e Li〇e! = Love Live!
        -> In the default scenes, there are three VA jokes.
            -> Satou Hinata, VA of Akiyama Mizuki, is the same VA of Kazuno Leah from LLS!
            -> Furihata Ai, VA of Momoi Airi, is the same VA of Kurosawa Ruby from LLS!
            -> Kusunoki Tomori, VA of Yoisaki Kanade, was the past VA of Yuki Setsuna from LL! Nijigaku
    "Girls are now composing..."
    "Squad is now vibing..."
    "Idols are now practicing..."
    "Troupe is now rehearsing..."
    "Band is now playing..."
        -> Touhou Loading Reference
        -> "Girls" is for N25 characters.
        -> "Squad" is for the VBS members.
        -> "Idols" is for the MMJ members.
        -> "Troupe" is for the WxS members.
        -> "Band" is for the L/N members.
    "It's pronounced 'DEKO-NINA'."
        -> DECO*27
*/
