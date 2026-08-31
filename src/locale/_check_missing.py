import json
import argparse


def load_keys(json_data, parent_key=""):
    keys = []
    for key, value in json_data.items():
        if value is None:
            continue
        full_key = f"{parent_key}.{key}" if parent_key else key
        keys.append(full_key)
        if isinstance(value, dict):
            keys.extend(load_keys(value, full_key))
    return keys


def main(locale: str):
    if locale.lower().endswith(".json"):
        locale = locale.strip(".json")

    en_json = "./en-US.json"
    with open(en_json, "r", encoding="utf-8") as f:
        en_data = json.load(f)

    en_keys = load_keys(en_data)

    file = f"./{locale}.json"

    with open(file, "r", encoding="utf-8") as f:
        locale_data = json.load(f)

    locale_keys = load_keys(locale_data)

    missing_keys = set(en_keys) - set(locale_keys)
    if missing_keys:
        print(f"Missing keys in {file}:")
        for key in sorted(missing_keys):
            print(f"  {key}")
    else:
        print(f"All keys are present in {file}.")

    print(f"{((len(en_keys) - len(missing_keys)) / len(en_keys) * 100):.2f}% complete")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Check locale JSON file for missing.")
    parser.add_argument(
        "--locale",
        type=str,
        required=True,
    )

    args = parser.parse_args()
    input_locale = args.locale
    if not input_locale:
        print("Please provide the input locale using --locale")
        exit(1)
    main(input_locale)
