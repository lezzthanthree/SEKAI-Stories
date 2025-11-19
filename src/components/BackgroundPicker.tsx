import React, {
    useContext,
    useEffect,
    useState,
    // ChangeEvent,
    // useCallback,
    // useDeferredValue,
    // useEffect,
    // useMemo,
} from "react";
import data from "../background.json";
import { getBackground } from "../utils/GetBackground";
import { useTranslation } from "react-i18next";
import IBackground from "../types/IBackground";
import { SoftErrorContext } from "../contexts/SoftErrorContext";
import { IBackgroundBookmark } from "../types/IBackgroundBookmark";
// import { fuzzy } from "fast-fuzzy";

const pngList = ["bg_transparent"];
interface IBackgroundList {
    update: string;
    background: {
        [key: string]: string[];
    };
}

interface BackgroundPickerProps {
    background: IBackground;
    setFunction: (bg: string) => void;
}

const backgroundList: IBackgroundList = data;

const BackgroundPicker: React.FC<BackgroundPickerProps> = ({
    background,
    setFunction,
}) => {
    const backgroundBookmarkCookie = localStorage.getItem("backgroundBookmark");
    const { t } = useTranslation();

    const [show, setShow] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState<string>("all");
    const [backgroundBookmarks, setBackgroundBookmarks] =
        useState<IBackgroundBookmark>([]);

    const softError = useContext(SoftErrorContext);

    if (!softError) throw new Error("Context not found");
    const { setErrorInformation } = softError;

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setShow(false);
            }
        };
        document.addEventListener("keydown", handleEsc);

        if (!backgroundBookmarkCookie) {
            localStorage.setItem("backgroundBookmark", JSON.stringify([]));
        } else {
            const bookmarks: IBackgroundBookmark = JSON.parse(
                backgroundBookmarkCookie
            );
            setBackgroundBookmarks(bookmarks);
        }
    }, []);

    useEffect(() => {
        if (show && background?.filename) {
            const selectedBackground = document.querySelector(
                `img[src="${background.filename.replace(
                    "/background_compressed/",
                    "/background_low_jpg/"
                )}"]`
            );
            selectedBackground?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [show, background?.filename]);
    const handleChangeBackground = async (bg: string) => {
        try {
            const isPNG = pngList.includes(bg);
            const filePath = isPNG
                ? `/background_compressed/${bg}.png`
                : `/background_compressed/${bg}.jpg`;

            const backgroundSprite = await getBackground(filePath);

            background?.backgroundContainer.removeChildAt(0);
            background?.backgroundContainer.addChildAt(backgroundSprite, 0);
            setFunction(filePath);

            setFilterValue("all");
            if (bg.includes("bg_s000362")) {
                setErrorInformation("Give her a break. She's happy now.");
            }
        } catch (error) {
            setErrorInformation(String(error));
            console.error(error);
        }
    };

    const handleBackgroundBookmark = async () => {
        if (!background) return;

        if (!background.filename.startsWith("/background_compressed/")) {
            if (background?.filename.includes("Kisaragi")) {
                setErrorInformation(" ");
            } else {
                setErrorInformation(t("error.background-bookmark"));
            }
            return;
        }

        const currentBackground = background.filename
            .replace("/background_compressed/", "")
            .replace(".jpg", "")
            .replace(".png", "");
        if (backgroundBookmarks.includes(currentBackground)) {
            const index = backgroundBookmarks.indexOf(currentBackground);
            if (index > -1) {
                backgroundBookmarks.splice(index, 1);
            }
        } else {
            backgroundBookmarks.push(currentBackground);
        }
        setBackgroundBookmarks([...backgroundBookmarks]);
        localStorage.setItem(
            "backgroundBookmark",
            JSON.stringify(backgroundBookmarks)
        );
    };

    const renderBackgroundType = (type: string) => {
        if (type === "bookmarks" && backgroundBookmarks.length === 0) return;
        if (filterValue === "all" && type === "cards") return;

        return (
            <div
                className="flex-wrap center flex-vertical picker-type-div"
                key={type}
            >
                <div className="width-100 center text-center">
                    <h1 className="white">{t(`group.${type}`)}</h1>
                </div>
                <div className="flex-wrap center width-100">
                    {type === "bookmarks"
                        ? backgroundBookmarks.map((bg) => (
                              <img
                                  key={bg}
                                  className={`picker-item background-picker-item ${
                                      background?.filename ===
                                      `/background_compressed/${bg}.jpg`
                                          ? "picker-item-selected"
                                          : ""
                                  }`}
                                  src={`/background_low_jpg/${bg}.jpg`}
                                  onClick={async () => {
                                      handleChangeBackground(bg);
                                      setShow(false);
                                  }}
                              />
                          ))
                        : backgroundList.background[type].map((bg) => (
                              <img
                                  key={bg}
                                  className={`picker-item background-picker-item ${
                                      background?.filename ===
                                      `/background_compressed/${bg}.jpg`
                                          ? "picker-item-selected"
                                          : ""
                                  }`}
                                  src={`/background_low_jpg/${bg}.jpg`}
                                  onClick={async () => {
                                      handleChangeBackground(bg);
                                      setShow(false);
                                  }}
                              />
                          ))}
                </div>
            </div>
        );
    };

    return (
        <>
            {show && (
                <div id="picker">
                    <button
                        id="picker-close"
                        className="btn-circle btn-pink"
                        onClick={() => {
                            setShow(false);
                        }}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                    <select
                        name="picker-filter"
                        id="picker-filter"
                        onChange={(e) => {
                            document.getElementById("picker")?.scrollTo(0, 0);
                            setFilterValue(e.target.value);
                        }}
                        value={filterValue}
                    >
                        <option value="all">{t("group.all")}</option>
                        {Object.keys(backgroundList.background).map((type) => {
                            return (
                                <option key={type} value={type}>
                                    {`${t(`group.${type}`)} ${
                                        type === "cards"
                                            ? `(${backgroundList.update})`
                                            : ""
                                    }`}
                                </option>
                            );
                        })}
                    </select>

                    <div className="flex-wrap relative center">
                        {backgroundBookmarks &&
                            filterValue === "all" &&
                            renderBackgroundType("bookmarks")}
                        {filterValue === "all"
                            ? Object.keys(backgroundList.background).map(
                                  renderBackgroundType
                              )
                            : renderBackgroundType(filterValue)}
                    </div>
                </div>
            )}
            <div className="option__background">
                <div className="relative">
                    <img
                        src={background?.filename}
                        alt="background-selected"
                        id="background-picker"
                        onClick={() => {
                            setShow(!show);
                        }}
                    />
                    <i
                        className={
                            backgroundBookmarks.includes(
                                background?.filename
                                    .replace("/background_compressed/", "")
                                    .replace(".jpg", "")
                            )
                                ? "bi bi-star-fill background-bookmark"
                                : "bi bi-star background-bookmark"
                        }
                        onClick={handleBackgroundBookmark}
                    />
                </div>

                <button
                    className="btn-regular btn-extend-width btn-blue"
                    onClick={() => {
                        setShow(!show);
                    }}
                >
                    {t("background.select")}
                </button>
            </div>
        </>
    );
};

export default BackgroundPicker;

// const [searchValue, setSearchValue] = useState("");
// const handleSearchValueChange = useCallback(
//     (e: ChangeEvent<HTMLInputElement>) => {
//         setSearchValue(e.target.value);
//     },
//     []
// );
// const deferredSearchValue = useDeferredValue(searchValue);
// const filteredBackgrounds = useMemo(() => {
//     if (!deferredSearchValue) {
//         return data.background;
//     }
//     return data.background.filter((bg) => {
//         return (
//             fuzzy(deferredSearchValue, bg.replace(/[^a-z0-9]/gi, "")) > 0.5
//         );
//     });
// }, [deferredSearchValue]);
// useEffect(() => {
//     const onKeyDown = (keyDownEvent: KeyboardEvent) => {
//         if (keyDownEvent.key === "Escape") {
//             if (searchValue) {
//                 setSearchValue("");
//             } else {
//                 setShow(false);
//             }
//         }
//     };
//     window.addEventListener("keydown", onKeyDown);
//     return () => {
//         window.removeEventListener("keydown", onKeyDown);
//     };
// }, [searchValue]);
/* <input
    type="text"
    value={searchValue}
    onChange={handleSearchValueChange}
    placeholder="Search background"
    style={{
        position: "fixed",
        top: 10,
        width: "80%",
        zIndex: 9999,
    }}
/> */
