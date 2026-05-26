import { useEffect, useState } from "react";

function App() {
    const randText = [
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
        "It's pronounced 'DEKO-NINA'.",
        "Stream Moe Shop!",
        "Stream Jamie Paige!",
        "Untitled.",
    ];

    const [flavorText] = useState(
        randText[Math.floor(Math.random() * randText.length)],
    );
    const [countdown, setCountdown] = useState(2);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => Math.max(prev - 1, 0));
        }, 1000);

        if (countdown == 0) window.open("https://sekai-stories.pages.dev", "_self");

        return () => clearInterval(interval);
    }, [countdown]);

    return (
        <main>
            <div className="vercel-halt center">
                <h3>
                    Redirecting to{" "}
                    <a href="https://sekai-stories.pages.dev">
                        sekai-stories.pages.dev
                    </a>{" "}
                    in {countdown}...
                </h3>
                <p>{flavorText}</p>
            </div>
        </main>
    );
}

export default App;
