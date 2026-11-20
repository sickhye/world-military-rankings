#!/usr/bin/env python3
import json
import re
from datetime import date
from pathlib import Path
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "site" / "data"
API_ROOT = "https://api.worldbank.org/v2"


def fetch_json(url):
    request = Request(url, headers={"User-Agent": "world-rankings-static-data-builder"})
    with urlopen(request, timeout=60) as response:
        return json.load(response)


def fetch_all_pages(url):
    first_page = fetch_json(f"{url}&page=1")
    metadata, rows = first_page
    result = list(rows or [])
    for page in range(2, metadata["pages"] + 1):
        result.extend(fetch_json(f"{url}&page={page}")[1] or [])
    return result


def country_metadata():
    rows = fetch_all_pages(f"{API_ROOT}/country?format=json&per_page=400")
    return {
        row["iso2Code"].upper(): row
        for row in rows
        if re.fullmatch(r"[A-Z]{2}", row.get("iso2Code", "").upper())
        and row.get("region", {}).get("id") != "NA"
    }


def build_dataset(dataset_id, config, countries):
    indicator = config["indicator"]
    start_year = config["startYear"]
    end_year = config["endYear"]
    url = (
        f"{API_ROOT}/country/all/indicator/{indicator}"
        f"?date={start_year}:{end_year}&format=json&per_page=20000"
    )
    rows = fetch_all_pages(url)
    years = {}
    for row in rows:
        code = row.get("country", {}).get("id", "").upper()
        country = countries.get(code)
        value = row.get("value")
        if country is None or value is None:
            continue
        year = str(row["date"])
        years.setdefault(year, []).append({
            "code": code,
            "english": country["name"],
            "value": value,
        })

    ranked_years = {}
    for year, entries in sorted(years.items()):
        entries.sort(key=lambda entry: (-entry["value"], entry["english"].casefold()))
        ranked_years[year] = {
            "status": "published",
            "ranks": [
                {"rank": rank, **entry}
                for rank, entry in enumerate(entries, start=1)
            ],
        }

    return {
        "source": url.split("?")[0],
        "indicator": indicator,
        "retrieved": date.today().isoformat(),
        "years": ranked_years,
    }


def main():
    catalog = json.loads((DATA_DIR / "datasets.json").read_text(encoding="utf-8"))
    countries = country_metadata()
    for dataset_id, config in catalog["datasets"].items():
        if "indicator" not in config:
            continue
        result = build_dataset(dataset_id, config, countries)
        path = DATA_DIR / config["file"]
        path.write_text(
            json.dumps(result, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        counts = {
            year: len(data["ranks"])
            for year, data in result["years"].items()
        }
        print(f"{dataset_id}: {len(counts)} years, {counts}")


if __name__ == "__main__":
    main()
