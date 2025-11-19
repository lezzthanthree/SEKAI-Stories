import React from "react";

interface TranslatorsProps {
    lng: string;
}

const Translators: React.FC<TranslatorsProps> = ({ lng }) => {
    const translators: Record<string, { img: string; link: string }[]> = {
        es: [
            {
                img: "https://yt3.googleusercontent.com/bXEX1lrt2hFwcGYSGUuWDDYSd2VtHMJ-_-FnJMWzVRjcpQZMlpYeWe7MSCI9kszUAbydBSN5=s120-c-k-c0x00ffffff-no-rj",
                link: "https://www.youtube.com/@GatoMagoMusic",
            },
        ],
        zh: [
            {
                img: "https://avatars.githubusercontent.com/u/98752512?v=4",
                link: "https://github.com/MiddleRed",
            },
            {
                img: "https://avatars.githubusercontent.com/u/182323592?v=4",
                link: "https://github.com/SteveLF-bili",
            },
            {
                img: "https://avatars.githubusercontent.com/u/61617417?v=4",
                link: "https://github.com/emptylight370",
            },
        ],
        fil: [
            {
                img: "https://avatars.githubusercontent.com/u/63889032?v=4",
                link: "https://github.com/lezzthanthree",
            },
        ],
        ms: [
            {
                img: "https://avatars.githubusercontent.com/u/58261459?v=4",
                link: "https://github.com/fab144",
            },
        ],
        pl: [
            {
                img: "https://avatars.githubusercontent.com/u/33550839?v=4",
                link: "https://github.com/counter185",
            },
        ],
        th: [
            {
                img: "https://avatars.githubusercontent.com/u/117494034?v=4",
                link: "https://github.com/aungpaos",
            },
        ],
        fr: [
            {
                img: "https://avatars.githubusercontent.com/u/59890180?v=4",
                link: "https://github.com/39Choko",
            },
        ],
        zhTW: [
            {
                img: "https://avatars.githubusercontent.com/u/67418738?v=4",
                link: "https://github.com/lmaodick1239",
            },
        ],
        zhHK: [
            {
                img: "https://avatars.githubusercontent.com/u/67418738?v=4",
                link: "https://github.com/lmaodick1239",
            },
        ],
    };

    return (
        <div className="window__divider">
            {lng != "en" && translators[lng] && (
                <div className="window__divider flex flex-row items-center gap-10">
                    <p>Translators: </p>
                    <>
                        {translators[lng].map((translator, idx) => (
                            <a
                                key={idx}
                                href={translator.link}
                                target="_blank"
                                className="translators"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={translator.img}
                                    alt={`Translator ${idx + 1}`}
                                />
                            </a>
                        ))}
                    </>
                </div>
            )}
        </div>
    );
};

export default Translators;
