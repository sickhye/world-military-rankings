const countryMetadata = {
  DZ: { name: "アルジェリア", en: "Algeria" },
  AR: { name: "アルゼンチン", en: "Argentina" },
  AU: { name: "オーストラリア", en: "Australia" },
  BR: { name: "ブラジル", en: "Brazil" },
  CA: { name: "カナダ", en: "Canada" },
  CN: { name: "中国", en: "China" },
  EG: { name: "エジプト", en: "Egypt" },
  FR: { name: "フランス", en: "France" },
  DE: { name: "ドイツ", en: "Germany" },
  GR: { name: "ギリシャ", en: "Greece" },
  IN: { name: "インド", en: "India" },
  ID: { name: "インドネシア", en: "Indonesia" },
  IR: { name: "イラン", en: "Iran" },
  IL: { name: "イスラエル", en: "Israel" },
  IT: { name: "イタリア", en: "Italy" },
  JP: { name: "日本", en: "Japan" },
  MX: { name: "メキシコ", en: "Mexico" },
  KP: { name: "北朝鮮", en: "North Korea" },
  PK: { name: "パキスタン", en: "Pakistan" },
  PH: { name: "フィリピン", en: "Philippines" },
  PL: { name: "ポーランド", en: "Poland" },
  RU: { name: "ロシア", en: "Russia" },
  SA: { name: "サウジアラビア", en: "Saudi Arabia" },
  KR: { name: "韓国", en: "South Korea" },
  ZA: { name: "南アフリカ", en: "South Africa" },
  ES: { name: "スペイン", en: "Spain" },
  SE: { name: "スウェーデン", en: "Sweden" },
  DO: { name: "ドミニカきょうわこく", en: "Dominican Republic" },
  MM: { name: "ミャンマー", en: "Myanmar" },
  SY: { name: "シリア", en: "Syria" },
  TW: { name: "台湾", en: "Taiwan" },
  TH: { name: "タイ", en: "Thailand" },
  TR: { name: "トルコ", en: "Turkey / Turkiye" },
  UA: { name: "ウクライナ", en: "Ukraine" },
  GB: { name: "イギリス", en: "United Kingdom" },
  US: { name: "アメリカ", en: "United States" },
  VN: { name: "ベトナム", en: "Vietnam" },
  AE: { name: "アラブ首長国連邦", en: "United Arab Emirates" },
  CD: { name: "コンゴ民主共和国", en: "Democratic Republic of the Congo" },
  CF: { name: "中央アフリカ共和国", en: "Central African Republic" },
  CG: { name: "コンゴ共和国", en: "Republic of the Congo" },
  DO: { name: "ドミニカ共和国", en: "Dominican Republic" },
  MK: { name: "北マケドニア", en: "North Macedonia" },
  MM: { name: "ミャンマー", en: "Myanmar" },
  SS: { name: "南スーダン", en: "South Sudan" },
};

const countryRuby = {
  AE: { markup: "アラブ<ruby>首長国連邦<rt>しゅちょうこくれんぽう</rt></ruby>", reading: "しゅちょうこくれんぽう" },
  CD: { markup: "コンゴ<ruby>民主共和国<rt>みんしゅきょうわこく</rt></ruby>", reading: "みんしゅきょうわこく" },
  CF: { markup: "<ruby>中央<rt>ちゅうおう</rt></ruby>アフリカ<ruby>共和国<rt>きょうわこく</rt></ruby>", reading: "ちゅうおう きょうわこく" },
  CG: { markup: "コンゴ<ruby>共和国<rt>きょうわこく</rt></ruby>", reading: "きょうわこく" },
  CN: { markup: "<ruby>中国<rt>ちゅうごく</rt></ruby>", reading: "ちゅうごく" },
  DO: { markup: "ドミニカ<ruby>共和国<rt>きょうわこく</rt></ruby>", reading: "きょうわこく" },
  JP: { markup: "<ruby>日本<rt>にほん</rt></ruby>", reading: "にほん" },
  KP: { markup: "<ruby>北朝鮮<rt>きたちょうせん</rt></ruby>", reading: "きたちょうせん" },
  KR: { markup: "<ruby>韓国<rt>かんこく</rt></ruby>", reading: "かんこく" },
  MK: { markup: "<ruby>北<rt>きた</rt></ruby>マケドニア", reading: "きた" },
  SS: { markup: "<ruby>南<rt>みなみ</rt></ruby>スーダン", reading: "みなみ" },
  TW: { markup: "<ruby>台湾<rt>たいわん</rt></ruby>", reading: "たいわん" },
  ZA: { markup: "<ruby>南<rt>みなみ</rt></ruby>アフリカ", reading: "みなみ" },
};

const japaneseRegionNames = new Intl.DisplayNames(["ja"], { type: "region" });
const yearSelect = document.querySelector("#year-select");
const compareSelect = document.querySelector("#compare-select");
const searchInput = document.querySelector("#search-input");
const rankingContent = document.querySelector("#ranking-content");
const compareMessage = document.querySelector("#compare-message");
const resultCount = document.querySelector("#result-count");
const yearNote = document.querySelector("#year-note");
const olderButton = document.querySelector("#older-year");
const newerButton = document.querySelector("#newer-year");
let rankingArchive;

function flagEmoji(code) {
  return String.fromCodePoint(...[...code].map((letter) => letter.charCodeAt(0) + 127397));
}

function getCountryDetails(code, englishName) {
  const known = countryMetadata[code];
  if (known) return { ...known, reading: countryRuby[code]?.reading ?? "" };
  const localized = japaneseRegionNames.of(code);
  const name = localized && !/\p{Script=Han}/u.test(localized) ? localized : englishName;
  return { name: name || englishName, en: englishName, reading: "" };
}

function countryNameMarkup(code, fallbackName) {
  return countryRuby[code]?.markup ?? fallbackName;
}

function yearStatus(year) {
  return rankingArchive.years[String(year)]?.status ?? "missing";
}

function yearOptionLabel(year) {
  const status = yearStatus(year);
  if (status === "no-update") return `${year}年（更新なし）`;
  if (status === "missing") return `${year}年（データなし）`;
  const count = rankingArchive.years[String(year)].ranks.length;
  return `${year}年（${count}か国）`;
}

function populateYearSelect(select) {
  const years = Array.from({ length: 22 }, (_, index) => 2026 - index);
  select.replaceChildren(...years.map((year) => {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = yearOptionLabel(year);
    return option;
  }));
}

function renderRanking() {
  const year = Number(yearSelect.value);
  const yearData = rankingArchive.years[String(year)];
  const query = searchInput.value.trim().toLocaleLowerCase("ja");
  const rows = yearData?.ranks.map((record, index) => {
    const code = typeof record === "string" ? record : record.code;
    const englishName = typeof record === "string" ? countryMetadata[code]?.en : record.english;
    return {
      code,
      rank: typeof record === "string" ? index + 1 : record.rank,
      ...getCountryDetails(code, englishName),
    };
  }) ?? [];
  const filteredRows = rows.filter((entry) => (
    entry.name.toLocaleLowerCase("ja").includes(query)
    || entry.reading.toLocaleLowerCase("ja").includes(query)
    || entry.en.toLowerCase().includes(query)
    || entry.code.toLowerCase().includes(query)
  ));

  document.querySelector("#summary-year").textContent = `${year}年`;
  document.querySelector("#summary-status").textContent = yearData
    ? yearData.status === "no-update" ? "GFPは「こうしんなし」と記載" : "GFPの順位（じゅんい）"
    : "GFPの一覧（いちらん）に見つからず";
  document.querySelector("#summary-coverage").textContent = rows.length
    ? `${rows.length}か国`
    : "見つからず";
  resultCount.textContent = rows.length ? `${filteredRows.length} / ${rows.length}か国` : "";
  olderButton.disabled = year <= 2005;
  newerButton.disabled = year >= 2026;
  yearNote.hidden = true;

  if (!yearData) {
    rankingContent.innerHTML = '<div class="empty-state"><strong>この年（とし）の順位（じゅんい）は見（み）つかりません</strong>もとのページに一覧（いちらん）がないため、順位（じゅんい）は作（つく）っていません。</div>';
    return;
  }

  if (yearData.status === "no-update") {
    yearNote.textContent = `${year}年（ねん）はGFPに「更新（こうしん）なし」と書（か）かれています。下（した）の順位（じゅんい）はその年（とし）に新（あたら）しく調（しら）べたものではありません。`;
    yearNote.hidden = false;
  }

  if (!filteredRows.length) {
    rankingContent.innerHTML = '<div class="empty-state"><strong>国（くに）が見（み）つかりません</strong>名前（なまえ）をかえて、もう一度（いちど）さがしてください。</div>';
    return;
  }

  const list = document.createElement("div");
  list.className = "ranking-list";
  list.setAttribute("role", "list");
  for (const entry of filteredRows) {
    const row = document.createElement("article");
    row.className = "ranking-row";
    row.setAttribute("role", "listitem");
    row.innerHTML = `
      <span class="rank-number${entry.rank <= 3 ? " top-three" : ""}" aria-label="${entry.rank}位">
        <strong>${entry.rank}</strong><small><ruby>位<rt>い</rt></ruby></small>
      </span>
      <span class="country">
        <span class="flag" role="img" aria-label="${entry.name}の国旗">${flagEmoji(entry.code)}</span>
        <span><span class="country-name">${countryNameMarkup(entry.code, entry.name)}</span><span class="country-en">${entry.en}</span></span>
      </span>
    `;
    list.append(row);
  }
  rankingContent.replaceChildren(list);
}

function renderComparison() {
  const year = Number(yearSelect.value);
  const compareYear = Number(compareSelect.value);
  const selectedData = rankingArchive.years[String(year)];
  const compareData = rankingArchive.years[String(compareYear)];

  if (!selectedData || !compareData) {
    compareMessage.textContent = "どちらかの年（とし）に順位（じゅんい）がないため、くらべられません。";
    return;
  }
  if (selectedData.status === "no-update" || compareData.status === "no-update") {
    compareMessage.textContent = "どちらかの年（とし）は「更新（こうしん）なし」です。順位（じゅんい）の変化（へんか）はくらべられません。";
    return;
  }
  if (year === compareYear) {
    compareMessage.textContent = "同（おな）じ年（とし）です。くらべる年（とし）をかえてください。";
    return;
  }

  const countryCode = (record) => typeof record === "string" ? record : record.code;
  const comparisonRanks = new Map(compareData.ranks.map((record, index) => [countryCode(record), index + 1]));
  const shared = selectedData.ranks
    .map((record, index) => ({ code: countryCode(record), rank: index + 1 }))
    .filter(({ code }) => comparisonRanks.has(code));

  if (!shared.length) {
    compareMessage.textContent = "両方（りょうほう）の年（とし）にある国（くに）は見（み）つかりませんでした。";
    return;
  }

  compareMessage.textContent = `${year}年（ねん）と${compareYear}年（ねん）の順位（じゅんい）をくらべています。`;
  const list = document.createElement("div");
  list.className = "change-list";
  for (const entry of shared) {
    const delta = comparisonRanks.get(entry.code) - entry.rank;
    const trend = delta > 0
      ? `<span class="change-up">${delta}ランクあがった</span>`
      : delta < 0
        ? `<span class="change-down">${Math.abs(delta)}ランクさがった</span>`
        : "かわらない";
    const row = document.createElement("div");
    row.className = "change-row";
    const country = getCountryDetails(entry.code, "");
    row.innerHTML = `<span>${countryNameMarkup(entry.code, country.name)}</span><strong>${compareYear}年 #${comparisonRanks.get(entry.code)} → ${year}年 #${entry.rank} · ${trend}</strong>`;
    list.append(row);
  }
  compareMessage.after(list);
  compareMessage.dataset.hasRows = "true";
}

function updateComparison() {
  document.querySelectorAll(".change-list").forEach((list) => list.remove());
  delete compareMessage.dataset.hasRows;
  renderComparison();
}

function selectYear(year) {
  yearSelect.value = String(year);
  const url = new URL(window.location.href);
  url.searchParams.set("year", String(year));
  window.history.replaceState(null, "", url);
  renderRanking();
  updateComparison();
}

function moveYear(amount) {
  const year = Number(yearSelect.value) + amount;
  if (year >= 2005 && year <= 2026) selectYear(year);
}

function renderError(error) {
  console.error("ランキングデータを読み込めませんでした。", error);
  rankingContent.innerHTML = '<div class="empty-state"><strong>ランキングを読みこめませんでした</strong>ページをもう一度ひらいてください。</div>';
  document.querySelector("#summary-status").textContent = "エラー";
  compareMessage.textContent = "データを読（よ）めなかったため、くらべられません。";
}

async function initialize() {
  try {
    const response = await fetch("./data/rankings.json");
    if (!response.ok) throw new Error(`ランキングデータの取得に失敗しました: HTTP ${response.status}`);
    rankingArchive = await response.json();

    populateYearSelect(yearSelect);
    populateYearSelect(compareSelect);
    const requestedYear = Number(new URLSearchParams(window.location.search).get("year"));
    yearSelect.value = String(requestedYear >= 2005 && requestedYear <= 2026 ? requestedYear : 2026);
    compareSelect.value = "2025";

    yearSelect.addEventListener("change", () => selectYear(Number(yearSelect.value)));
    compareSelect.addEventListener("change", updateComparison);
    searchInput.addEventListener("input", renderRanking);
    olderButton.addEventListener("click", () => moveYear(-1));
    newerButton.addEventListener("click", () => moveYear(1));

    let touchStart;
    rankingContent.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });
    rankingContent.addEventListener("touchend", (event) => {
      if (!touchStart) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      touchStart = undefined;
      if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.3) return;
      moveYear(deltaX > 0 ? -1 : 1);
    }, { passive: true });

    renderRanking();
    updateComparison();
  } catch (error) {
    renderError(error);
  }
}

initialize();
