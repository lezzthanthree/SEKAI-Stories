import datetime
import json
import os
import re
import subprocess
import sys
import urllib.request
import zipfile
from pathlib import Path

import requests

# Constants

ASSETSTUDIO_URL = "https://github.com/RazTools/Studio/releases/download/v1.36.00/net8.0-e1d7f5301aa015a3386e245312205969f763c9ae.zip"
APP_HASH_URL = "https://raw.githubusercontent.com/YangTheParrot/sekai-apphash/refs/heads/master/jp/apphash.json"
UNITY_VERSION = "2022.3.21f1"
DB_PATH = Path.home() / ".sssekai/abcache.db"
BACKGROUND_REGEX = r"bg_[a-is][0-9]{6}$"

SEKAI_STORIES_JSON = "./background.json"

WORKSPACE = Path("./sssekai")  # put this in .gitignore

ASSETSTUDIO_ZIP = WORKSPACE / "AssetStudio.zip"
ASSETSTUDIO_DIR = WORKSPACE / "AssetStudio"
BUNDLES_DIR = WORKSPACE / "bundles/scenario/background"
OUTPUT_DIR = WORKSPACE / "output"

EXPORT_DIR = BUNDLES_DIR / "export"
NEW_DIR = BUNDLES_DIR / "new"

TEXTURE_DIR = EXPORT_DIR / "Texture2D"

BACKGROUND_DIR = OUTPUT_DIR / "background_compressed"
PREVIEW_DIR = OUTPUT_DIR / "background_low_jpg"

PUBLIC_DIR = Path("../public")

PUBLIC_BACKGROUND_DIR = PUBLIC_DIR / "background_compressed"
PUBLIC_PREVIEW_DIR = PUBLIC_DIR / "background_low_jpg"


app = {
    "hash": None,
    "version": None,
    "ab_version": None,
    "region": None,
    "platform": None,
}


def run(command, shell=True):
    print(f"\n>> {command}")
    subprocess.run(command, shell=shell, check=True)


def copy_files(src_dir, dest_dir):
    if not Path(dest_dir).exists():
        Path(dest_dir).mkdir(parents=True)

    for file in os.listdir(src_dir):
        src_file = Path(src_dir) / file
        dest_file = Path(dest_dir) / file
        if not os.path.exists(dest_file):
            print(f"Copying {file} to {dest_dir}")
            dest_file.write_bytes(src_file.read_bytes())


def ensure_sssekai():
    run("pip install -U sssekai")


def download_assetstudio():
    if not Path(ASSETSTUDIO_ZIP).exists():
        print("Downloading AssetStudio...")
        urllib.request.urlretrieve(ASSETSTUDIO_URL, ASSETSTUDIO_ZIP)
    else:
        print("AssetStudio.zip already exists.")

    if not Path(ASSETSTUDIO_DIR).exists():
        print("Extracting AssetStudio...")
        with zipfile.ZipFile(ASSETSTUDIO_ZIP, "r") as zip_ref:
            zip_ref.extractall(ASSETSTUDIO_DIR)
    else:
        print("AssetStudio directory already extracted.")


def get_app_hash():
    details = requests.get(APP_HASH_URL)
    app["region"] = details.json()["production_android"]["app_region"]
    app["hash"] = details.json()["production_android"]["app_hash"]
    app["version"] = details.json()["production_android"]["app_version"]
    app["platform"] = details.json()["production_android"]["app_platform"]
    app["ab_version"] = details.json()["production_android"]["ab_version"]

    print(
        f"App Version: {app['version']}. App Hash: {app['hash']}. App AB Version: {app['ab_version']}. App Region: {app['region']}. App Platform: {app['platform']}."
    )


def prepare_abcache():
    run(
        f'sssekai abcache --db "{DB_PATH}" --app-region {app["region"]} --app-version {app["version"]} --app-appHash {app["hash"]} --app-abVersion {app["ab_version"]} --app-platform {app["platform"]}'
    )


def download_backgrounds():
    run(
        f'sssekai --unity-version "{UNITY_VERSION}" abcache --db "{DB_PATH}" --no-update --download-dir {WORKSPACE}/bundles --download-filter '
        + ".*bg_[a-is][0-9]{6}"
    )


def check_differences():
    existing_backgrounds = set()
    with open(SEKAI_STORIES_JSON, "r") as f:
        json_data = json.load(f)
        background = json_data.get("background", {})
        for value in background.values():
            for bg in value:
                existing_backgrounds.add(bg)

    updated_backgrounds = os.listdir(BUNDLES_DIR)
    updated_backgrounds = {
        bg
        for bg in updated_backgrounds
        if re.match(BACKGROUND_REGEX, os.path.splitext(bg)[0])
    }
    new_backgrounds = updated_backgrounds - existing_backgrounds

    if not new_backgrounds:
        print("No new backgrounds found. You're up to date!")
        sys.exit(0)

    print(f"New backgrounds: {new_backgrounds}")
    return new_backgrounds


def copy_new_backgrounds(new_backgrounds):
    if not NEW_DIR.exists():
        NEW_DIR.mkdir(parents=True)

    files_in_new_dir = set(os.listdir(NEW_DIR))
    for file in files_in_new_dir:
        file_path = NEW_DIR / file
        if file_path.is_file():
            file_path.unlink()

    for bg in new_backgrounds:
        src_file = Path(BUNDLES_DIR) / f"{bg}"
        dest_file = NEW_DIR / f"{bg}"
        dest_file.write_bytes(src_file.read_bytes())


def convert_unity_to_img(new_backgrounds=None):
    cli_path = Path(ASSETSTUDIO_DIR) / "AssetStudio.CLI.exe"
    if not cli_path.exists():
        print(f"AssetStudio CLI not found at {cli_path}")
        sys.exit(1)
    if not EXPORT_DIR.exists():
        EXPORT_DIR.mkdir(parents=True)

    run(
        f'"{cli_path}" "{NEW_DIR if new_backgrounds else BUNDLES_DIR}" "{EXPORT_DIR}" --game ProjectSekai --unity_version "{UNITY_VERSION}"'
    )


def convert_img_to_lowres(new_backgrounds=None, only_save_json=False):
    if new_backgrounds is None:
        new_backgrounds = []

    data = {
        "update": str(datetime.datetime.now().date()),
        "background": {
            "general": [
                "bg_transparent",
                "bg_white",
                "bg_black",
                "bg_green",
                "bg_blue",
                "bg_magenta",
            ],
            "mmj": [],
            "vbs": [],
            "wxs": [],
            "n25": [],
            "ln": [],
            "vs": [],
            "split": [],
            "temp": [],
            "cards": [],
        },
    }

    exported_backgrounds = sorted(os.listdir(f"./{TEXTURE_DIR}/"))

    if not os.path.exists(OUTPUT_DIR):
        print(f"Creating lowres directory at {OUTPUT_DIR}")
        os.mkdir(OUTPUT_DIR)
    if not os.path.exists(BACKGROUND_DIR):
        print(f"Creating compressed directory at {BACKGROUND_DIR}")
        os.mkdir(BACKGROUND_DIR)
    if not os.path.exists(PREVIEW_DIR):
        print(f"Creating preview directory at {PREVIEW_DIR}")
        os.mkdir(PREVIEW_DIR)

    for background in exported_backgrounds:
        filename = os.path.splitext(background)[0]
        if not background.lower().endswith((".jpg", ".png")) or not re.match(
            BACKGROUND_REGEX, filename
        ):
            continue

        prefix = filename[:4]
        match prefix:
            case "bg_a" if re.match(r"bg_a0000[0-9]{2}$", filename):
                data["background"]["cards"].append(filename)
            case "bg_a":
                data["background"]["general"].append(filename)
            case "bg_b":
                data["background"]["mmj"].append(filename)
            case "bg_c":
                data["background"]["vbs"].append(filename)
            case "bg_d":
                data["background"]["wxs"].append(filename)
            case "bg_e":
                data["background"]["n25"].append(filename)
            case "bg_f":
                data["background"]["ln"].append(filename)
            case "bg_g":
                data["background"]["vs"].append(filename)
            case "bg_h":
                data["background"]["split"].append(filename)
            case "bg_i":
                data["background"]["temp"].append(filename)
            case "bg_s":
                data["background"]["cards"].append(filename)

        if only_save_json:
            continue

        if filename in new_backgrounds:
            print(f"Processing {background}")

            compressed_path = os.path.join(BACKGROUND_DIR, f"{filename}.jpg")
            preview_path = os.path.join(PREVIEW_DIR, f"{filename}.jpg")
            input_path = os.path.join(TEXTURE_DIR, background)
            run(
                f'ffmpeg -hide_banner -loglevel error -n -i "{input_path}" -vf scale=300:-1 "{preview_path}" '
            )
            run(
                f'ffmpeg -hide_banner -loglevel error -n -i "{input_path}" "{compressed_path}"'
            )
            run("cls")

    with open("_background.json", "w") as f:
        json.dump(data, f, indent=4)


def copy_to_public():
    if not PUBLIC_BACKGROUND_DIR.exists():
        print(f"Creating public background directory at {PUBLIC_BACKGROUND_DIR}")
        PUBLIC_BACKGROUND_DIR.mkdir(parents=True)
    if not PUBLIC_PREVIEW_DIR.exists():
        print(f"Creating public preview directory at {PUBLIC_PREVIEW_DIR}")
        PUBLIC_PREVIEW_DIR.mkdir(parents=True)

    copy_files(BACKGROUND_DIR, PUBLIC_BACKGROUND_DIR)
    copy_files(PREVIEW_DIR, PUBLIC_PREVIEW_DIR)


def main():
    if not Path(WORKSPACE).exists():
        print(f"Creating workspace directory at {WORKSPACE}")
        WORKSPACE.mkdir()
    ensure_sssekai()
    download_assetstudio()
    get_app_hash()
    prepare_abcache()
    download_backgrounds()
    new = check_differences()
    copy_new_backgrounds(new_backgrounds=new)
    convert_unity_to_img(new_backgrounds=new)
    convert_img_to_lowres(new_backgrounds=new)
    copy_to_public()
    os.replace("_background.json", SEKAI_STORIES_JSON)


if __name__ == "__main__":
    main()
