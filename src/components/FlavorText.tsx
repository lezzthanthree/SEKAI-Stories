import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* 
    For reference of the jokes in English flavor text, scroll below
*/

const randomText = {
    en: [
        "Can you hear the ominous bells tolling?",
        "If you re-read \"Kamiyama High Festival\" story after Mizu5, it'll hit you even hard.",
        "Nene is playing maimai. The map is Xaleid◆scopiX.",
        "Rui messaged someone. He didn't get any response.", // Change this after Nov 30, 2025. Original: Rui with his ThinkPad laptop.
        "Tsukasa is laughing in the hallway like a kid again.",
        'Emu breaks the fourth wall, staring at you and says "Wonderhoy!"',
        "Ichika is fangirling over Miku. Again.",
        "Saki. Saki on fire?",
        "Honami is driving without her driver license.",
        "Shiho is forming a new band with her little Phennies.",
        "Shizuku is giving Shiho some make up.",
        "In a parallel universe, where Minori is the leader of ASRUN.",
        "Haruka becomes the wife of Minori.",
        "Airi lost her fang.",
        "Setsuna has been mistakenly called Kanade for the 1888th time.",
        "ReferenceError: mizuki is not defined", // Change this after Nov 30, 2025. Original: Mizuki is 18 kilometers away from your house
        "Mafuyu is just eating some squid.", // Change this after Nov 30, 2025. Original: Mafuyu scares Emu from breaking the fourth wall.
        "Ena is looking for someone.", // Change this after Nov 30, 2025. Original: Ena throw a large basin on Akito.
        "Ena fights against AI Art.",
        "Toya is enjoying Tsukasa's loud laugh.",
        "Kohane has been bitten by her pet snake.",
        "An woke up and started speaking in English.",
        "Akito is wondering why Ena is sad right now.", // Change this after Nov 30, 2025
        "ABSOLUTE CINEMA",
        "The Disapperance of Hatsune Miku",
        "Listening to / / // / /",
        "Do not overdose yourself with shipping~",
        "Please take only the recommended shipping dosage.",
        "Just Monika.",
        "What if Movie Miku appeared on my screen all of the sudden?",
        "私は雨。(turns into ame-chan)",
        "MinoHaru is canon.",
        "AnHane is canon.",
        // "MizuEna is canon.", // Uncomment after Nov 30, 2025
        "Won won!?",
        "WONDERHOY!",
        "Lovely, Fairy, Momoi Airi!",
        "恋をして",
        "Meet SEKAI Stories's cousin, SIFAS Dialogue Sandbox!",
        "It's pronounced 'DEKO-NINA'.",
        "saa anyo anyo kocchi oide",
        "Untitled.",
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
        "神代類給某人發送了一個信息。 他並沒有得到回覆。",// 類帶著他的Thinkpad筆電
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
        "ReferenceError: mizuki 未下定義", // Change this after Nov 30, 2025. Original: 瑞希離你家18公里遠了
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
        // "瑞繪99", // Uncomment after Nov 30, 2025
    ],
	
	zhHK:[] as string[],
};

const FlavorText: React.FC = () => {
    const [text, setText] = useState<string>("");
    const { i18n } = useTranslation();
    const lng = i18n.language as keyof typeof randomText;
    const daysLeft = Math.ceil(
        (new Date("November 30, 2025 23:00:00 UTC").getTime() -
            new Date().getTime()) /
            (1000 * 60 * 60 * 24)
    ); // <---- ena5
    const quote =
        daysLeft < 0
            ? "Thank you, Mizuki~"
            : `${daysLeft} ${
                  daysLeft === 1 ? "day remains" : "days remain"
              }.`;
    randomText.en.push(quote);
	
    const quote_zh =
        daysLeft < 0
            ? "我们在一起吧，瑞希"
            : `还有大约${daysLeft}天。`;

    const quote_zhTW =
        daysLeft < 0
            ? "我們在一起吧，瑞希"
            : `還有大約${daysLeft}天。`;
    randomText.zh.push(quote_zh);
    randomText.zhTW.push(quote_zhTW);
    randomText.zhHK.push(...(randomText.zhTW));
    useEffect(() => {
        const languageRandomText = randomText[lng]
            ? randomText[lng]
            : randomText.en;
        setText(
            languageRandomText[
                Math.floor(Math.random() * languageRandomText.length)
            ]
        );
    }, [lng]);
    return <p id="flavor-text">{text}</p>;
};

export default FlavorText;

/* 
    LAST UPDATE: 10/16/2025
    Will not list the obvious PJSK references.
    Placed here for people who needs explaination when translating.

    "Can you hear the ominous bells tolling?"
        -> Mizu5 Joke
    "Nene is playing maimai. The map is Xaleid◆scopiX."
        -> maimai is SEGA's arcade game. 
        -> Xaleid◆scopiX is currently the hardest chart.
    "Rui with his ThinkPad laptop."
        -> ThinkPads are usually associated with engineers and programmers.
        -> can also be a programming socks humor (iykwim)
    "Saki. Saki on fire?"
        -> A viral TikTok of someone accidentally burning one of her Saki plush.
        -> https://www.tiktok.com/@liloubow/video/7464075124753370398
    "Honami is driving without her driver license."
        -> A reoccuring joke of someone having a dream of Honami running over Tsukasa with a car.
    "Setsuna has been mistakenly called Kanade for the 1888th time."
        -> Setsuna is a character from O.N.G.E.K.I., a SEGA Arcade Game.
        -> She's is the character on the Don't Fight The Music's jacket.
        -> People mistakenly thought it was Kanade on the said jacket.
        -> 1888 is the maximum Master combo on the said chart.
    "Listening to / / // / /"
        -> x0o0x's song about Kisaragi Station
    "Do not overdose yourself with shipping~"
        -> Needy Streamer Overload reference.
    "Please take only the recommended shipping dosage."
        -> Needy Streamer Overload reference.
    "Just Monika."
        -> Doki Doki Literature Club reference
    "私は雨。(turns into ame-chan)"
        -> (watashi wa ame)
        -> Needy Streamer Overload reference.
    "恋をして"
        -> (koi o shite)
        -> "Song of a Eared Robot"
        -> "Machine Love"
    "Meet SEKAI Stories's cousin SIFAS Dialogue Sandbox!"
        -> lezzthanthree's Love Live! SIFAS Story Generator
    "It's pronounced 'DEKO-NINA'."
        -> DECO*27

*/
