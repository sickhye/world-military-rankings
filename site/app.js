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
const datasetSelect = document.querySelector("#dataset-select");
const datasetTitle = document.querySelector("#dataset-title");
const datasetCoverage = document.querySelector("#dataset-coverage");
const rankingContent = document.querySelector("#ranking-content");
const compareMessage = document.querySelector("#compare-message");
const viewTabs = Array.from(document.querySelectorAll(".view-tab"));
const resultCount = document.querySelector("#result-count");
const yearNote = document.querySelector("#year-note");
const olderButton = document.querySelector("#older-year");
const newerButton = document.querySelector("#newer-year");
const racePlayButton = document.querySelector("#race-play");
const raceYearLabel = document.querySelector("#race-year");
const raceRange = document.querySelector("#race-range");
const raceCountSelect = document.querySelector("#race-count");
const raceStatus = document.querySelector("#race-status");
const raceChart = document.querySelector("#race-chart");
const raceNote = document.querySelector("#race-note");
const sourceDescription = document.querySelector("#source-description");
const sourceLimitation = document.querySelector("#source-limitation");
const sourceLink = document.querySelector("#source-link");
let datasetCatalog;
let datasetArchives;
let activeDataset;
let rankingArchive;
let defaultDatasetId;
let raceYears = [];
let raceIndex = 0;
let raceTimer;
const raceRows = new Map();
const raceRowHeight = 52;

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

function formatMetricValue(value) {
  if (value === null || value === undefined) return "";
  if (activeDataset.valueFormat === "people") {
    return `${new Intl.NumberFormat("ja-JP", { notation: "compact", maximumFractionDigits: 1 }).format(value)}人`;
  }
  if (activeDataset.valueFormat === "usd") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  if (activeDataset.valueFormat === "area") {
    return `${new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 }).format(value)} km²`;
  }
  return "";
}

function getRankingRows(year) {
  const yearData = rankingArchive.years[String(year)];
  return yearData?.ranks.map((record, index) => {
    const code = typeof record === "string" ? record : record.code;
    const englishName = typeof record === "string" ? countryMetadata[code]?.en : record.english;
    const value = typeof record === "string" ? null : record.value ?? null;
    return {
      code,
      rank: typeof record === "string" ? index + 1 : record.rank,
      value,
      valueText: formatMetricValue(value),
      ...getCountryDetails(code, englishName),
    };
  }) ?? [];
}

function getDatasetYears() {
  return Object.keys(rankingArchive.years).map(Number).sort((a, b) => a - b);
}

function getDatasetYearBounds() {
  const years = getDatasetYears();
  return { first: years[0] ?? 2005, last: years.at(-1) ?? 2026 };
}

function yearStatus(year) {
  return rankingArchive.years[String(year)]?.status ?? "missing";
}

function yearOptionLabel(year) {
  const status = yearStatus(year);
  if (status === "no-update") return `${year}年（更新なし）`;
  if (status === "missing") return `${year}年（データなし）`;
  const count = rankingArchive.years[String(year)].ranks.length;
  return `${year}年（${count}か国・地域）`;
}

function populateYearSelect(select) {
  const { first, last } = getDatasetYearBounds();
  const years = Array.from({ length: last - first + 1 }, (_, index) => last - index);
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
  const rows = getRankingRows(year);
  const filteredRows = rows.filter((entry) => (
    entry.name.toLocaleLowerCase("ja").includes(query)
    || entry.reading.toLocaleLowerCase("ja").includes(query)
    || entry.en.toLowerCase().includes(query)
    || entry.code.toLowerCase().includes(query)
  ));

  document.querySelector("#summary-year").textContent = `${year}年`;
  document.querySelector("#summary-status").textContent = yearData
    ? yearData.status === "no-update" ? activeDataset.noUpdateText : `${activeDataset.label}の順位（じゅんい）`
    : `${activeDataset.label}のデータなし`;
  document.querySelector("#summary-coverage").textContent = rows.length
    ? `${rows.length}か国・地域`
    : "見つからず";
  resultCount.textContent = rows.length ? `${filteredRows.length} / ${rows.length}か国・地域` : "";
  const { first, last } = getDatasetYearBounds();
  olderButton.disabled = year <= first;
  newerButton.disabled = year >= last;
  yearNote.hidden = true;

  if (!yearData) {
    rankingContent.innerHTML = '<div class="empty-state"><strong>この年（とし）のデータは見（み）つかりません</strong>公開（こうかい）された値（あたい）がないため、順位（じゅんい）は作（つく）っていません。</div>';
    return;
  }

  if (yearData.status === "no-update") {
    yearNote.textContent = activeDataset.noUpdateText;
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
      <span class="metric-value" ${entry.valueText ? "" : "hidden"}>${entry.valueText}</span>
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
  const recordRank = (record, index) => typeof record === "string" ? index + 1 : record.rank;
  const comparisonRanks = new Map(compareData.ranks.map((record, index) => [
    countryCode(record),
    recordRank(record, index),
  ]));
  const shared = selectedData.ranks
    .map((record, index) => ({ code: countryCode(record), rank: recordRank(record, index) }))
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

function createRaceRow() {
  const row = document.createElement("div");
  row.className = "race-row";
  row.setAttribute("role", "listitem");

  const rank = document.createElement("span");
  rank.className = "race-rank";
  const track = document.createElement("span");
  track.className = "race-track";
  const fill = document.createElement("span");
  fill.className = "race-fill";
  const label = document.createElement("span");
  label.className = "race-label";
  const flag = document.createElement("span");
  flag.className = "race-flag";
  flag.setAttribute("role", "img");
  const name = document.createElement("span");
  name.className = "race-country";
  const value = document.createElement("span");
  value.className = "race-value";
  label.append(flag, name);
  track.append(fill, label);
  row.append(rank, track, value);
  raceChart.append(row);
  return { row, rank, fill, flag, name, value };
}

function renderRace() {
  if (!raceYears.length) return;
  const year = raceYears[raceIndex];
  const entries = getRankingRows(year);
  const limit = raceCountSelect.value === "all"
    ? entries.length
    : Math.min(entries.length, Number(raceCountSelect.value));
  const visibleEntries = entries.slice(0, limit);
  const visibleCodes = new Set(visibleEntries.map((entry) => entry.code));
  const maxValue = Math.max(0, ...visibleEntries.map((entry) => Number(entry.value) || 0));

  raceYearLabel.textContent = `${year}年`;
  raceRange.value = String(raceIndex);
  raceRange.setAttribute("aria-valuetext", `${year}年`);
  raceChart.setAttribute("aria-label", `${year}年の順位レース`);
  raceChart.style.height = `${visibleEntries.length * raceRowHeight}px`;
  raceStatus.textContent = `${year}年、${visibleEntries.length}か国・地域を表示しています。`;
  raceNote.textContent = activeDataset.raceNote;

  for (const [code, item] of raceRows) {
    if (!visibleCodes.has(code)) item.row.hidden = true;
  }

  visibleEntries.forEach((entry, index) => {
    const item = raceRows.get(entry.code) ?? createRaceRow();
    raceRows.set(entry.code, item);
    item.row.hidden = false;
    item.row.style.transform = `translateY(${index * raceRowHeight}px)`;
    item.rank.textContent = `#${entry.rank}`;
    const relativeValue = maxValue > 0
      ? Math.max(1.5, (Number(entry.value) / maxValue) * 100)
      : ((limit - index) / limit) * 100;
    item.fill.style.width = `${relativeValue}%`;
    item.fill.classList.toggle("top-one", entry.rank === 1);
    item.fill.classList.toggle("top-two", entry.rank === 2);
    item.fill.classList.toggle("top-three", entry.rank === 3);
    item.flag.textContent = flagEmoji(entry.code);
    item.flag.setAttribute("aria-label", `${entry.name}の国旗`);
    item.name.innerHTML = countryNameMarkup(entry.code, entry.name);
    item.value.textContent = entry.valueText;
    item.value.hidden = !entry.valueText;
  });
}

function updateRacePlayButton() {
  const playing = raceTimer !== undefined;
  racePlayButton.textContent = playing ? "Ⅱ とめる" : "▶ 再生";
  racePlayButton.setAttribute("aria-label", playing ? "ランキングレースを止める" : "ランキングレースを再生");
  racePlayButton.setAttribute("aria-pressed", String(playing));
}

function stopRace() {
  if (raceTimer !== undefined) {
    window.clearInterval(raceTimer);
    raceTimer = undefined;
  }
  updateRacePlayButton();
}

function advanceRace() {
  if (raceIndex >= raceYears.length - 1) {
    stopRace();
    return;
  }
  raceIndex += 1;
  renderRace();
  if (raceIndex >= raceYears.length - 1) stopRace();
}

function startRace() {
  if (raceYears.length < 2) return;
  if (raceIndex >= raceYears.length - 1) {
    raceIndex = 0;
    renderRace();
  }
  raceTimer = window.setInterval(advanceRace, 1300);
  updateRacePlayButton();
}

function setRaceYear(index) {
  stopRace();
  raceIndex = Math.max(0, Math.min(index, raceYears.length - 1));
  renderRace();
}

function selectDataset(datasetId, updateUrl = false) {
  const config = datasetCatalog[datasetId];
  const archive = datasetArchives[datasetId];
  if (!config || !archive) throw new Error(`Unknown ranking dataset: ${datasetId}`);

  stopRace();
  activeDataset = config;
  rankingArchive = archive;
  datasetSelect.value = datasetId;
  datasetTitle.textContent = config.title;
  document.title = `世界${config.title}ランキング | 年別比較`;

  const years = getDatasetYears();
  const { first, last } = getDatasetYearBounds();
  const publishedYears = years.filter((year) => (
    yearStatus(year) !== "no-update" && rankingArchive.years[String(year)].ranks?.length
  ));
  if (!publishedYears.length) throw new Error(`Ranking dataset has no data: ${datasetId}`);

  datasetCoverage.textContent = first === last
    ? `${config.label} · ${last}年のデータ`
    : `${config.label} · ${first}〜${last}年のデータ`;
  sourceDescription.textContent = config.description;
  sourceLimitation.textContent = config.limitation;
  sourceLink.href = config.sourceUrl;
  sourceLink.textContent = `データ出典：${config.sourceLabel}`;

  populateYearSelect(yearSelect);
  populateYearSelect(compareSelect);
  const latestYear = publishedYears.at(-1);
  const previousYear = [...publishedYears].reverse().find((year) => year < latestYear) ?? latestYear;
  yearSelect.value = String(latestYear);
  compareSelect.value = String(previousYear);
  searchInput.value = "";
  if (updateUrl) {
    const url = new URL(window.location.href);
    if (datasetId === defaultDatasetId) url.searchParams.delete("dataset");
    else url.searchParams.set("dataset", datasetId);
    url.searchParams.set("year", String(latestYear));
    window.history.replaceState(null, "", url);
  }

  raceYears = publishedYears;
  raceIndex = 0;
  raceRange.max = String(Math.max(0, raceYears.length - 1));
  racePlayButton.disabled = raceYears.length < 2;
  raceRange.disabled = raceYears.length < 2;
  renderRanking();
  renderRace();
  updateComparison();
}

function selectViewTab(selectedTab, moveFocus = false) {
  for (const tab of viewTabs) {
    const selected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
  }
  if (selectedTab.id !== "tab-race") stopRace();
  if (moveFocus) selectedTab.focus();
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
  const { first, last } = getDatasetYearBounds();
  if (year >= first && year <= last) selectYear(year);
}

function renderError(error) {
  stopRace();
  console.error("ランキングデータを読み込めませんでした。", error);
  rankingContent.innerHTML = '<div class="empty-state"><strong>ランキングを読みこめませんでした</strong>ページをもう一度ひらいてください。</div>';
  document.querySelector("#summary-status").textContent = "エラー";
  compareMessage.textContent = "データを読（よ）めなかったため、くらべられません。";
}

async function initialize() {
  try {
    const catalogResponse = await fetch("./data/datasets.json");
    if (!catalogResponse.ok) throw new Error(`ランキング一覧の取得に失敗しました: HTTP ${catalogResponse.status}`);
    const catalog = await catalogResponse.json();
    datasetCatalog = catalog.datasets;
    defaultDatasetId = catalog.defaultDataset;
    const loadedDatasets = await Promise.all(Object.entries(datasetCatalog).map(async ([id, config]) => {
      const response = await fetch(`./data/${config.file}`);
      if (!response.ok) throw new Error(`${config.label}データの取得に失敗しました: HTTP ${response.status}`);
      return [id, await response.json()];
    }));
    datasetArchives = Object.fromEntries(loadedDatasets);

    const options = Object.entries(datasetCatalog).map(([id, config]) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = config.label;
      return option;
    });
    datasetSelect.replaceChildren(...options);
    if (!datasetCatalog[catalog.defaultDataset]) {
      throw new Error(`Default ranking dataset is missing: ${catalog.defaultDataset}`);
    }

    yearSelect.addEventListener("change", () => selectYear(Number(yearSelect.value)));
    compareSelect.addEventListener("change", updateComparison);
    datasetSelect.addEventListener("change", () => selectDataset(datasetSelect.value, true));
    searchInput.addEventListener("input", renderRanking);
    olderButton.addEventListener("click", () => moveYear(-1));
    newerButton.addEventListener("click", () => moveYear(1));
    viewTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectViewTab(tab));
      tab.addEventListener("keydown", (event) => {
        let nextIndex;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % viewTabs.length;
        else if (event.key === "ArrowLeft") nextIndex = (index - 1 + viewTabs.length) % viewTabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = viewTabs.length - 1;
        if (nextIndex === undefined) return;
        event.preventDefault();
        selectViewTab(viewTabs[nextIndex], true);
      });
    });
    racePlayButton.addEventListener("click", () => {
      if (raceTimer === undefined) startRace();
      else stopRace();
    });
    raceRange.addEventListener("input", () => setRaceYear(Number(raceRange.value)));
    raceCountSelect.addEventListener("change", renderRace);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopRace();
    });

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

    const params = new URLSearchParams(window.location.search);
    const requestedDataset = params.get("dataset");
    selectDataset(datasetCatalog[requestedDataset] ? requestedDataset : defaultDatasetId);
    const requestedYear = Number(params.get("year"));
    const { first, last } = getDatasetYearBounds();
    if (requestedYear >= first && requestedYear <= last) {
      yearSelect.value = String(requestedYear);
      const publishedYears = getDatasetYears().filter((year) => (
        yearStatus(year) !== "no-update" && rankingArchive.years[String(year)].ranks?.length
      ));
      const comparisonYear = [...publishedYears].reverse().find((year) => year < requestedYear)
        ?? publishedYears.find((year) => year > requestedYear)
        ?? requestedYear;
      compareSelect.value = String(comparisonYear);
      renderRanking();
      updateComparison();
    }
  } catch (error) {
    renderError(error);
  }
}

initialize();
