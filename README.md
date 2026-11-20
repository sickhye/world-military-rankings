# 世界ランキング

GitHub Pagesで公開する、年ごとの世界ランキングサイトです。軍事力・人口・名目GDP・国土面積を切り替えて、国旗付きランキングや年ごとの比較、ランキングレースを表示します。日本語UI、ふりがな、国名検索、年選択、前後の年へのボタン移動とスワイプ操作に対応し、スマートフォンでも使いやすいレイアウトです。初期表示はランキングタブです。

## データと範囲

- **軍事力** — Global Firepower（GFP）の[最新ランキング](https://www.globalfirepower.com/countries-listing.php)と[過去年一覧](https://www.globalfirepower.com/global-ranks-previous.php)。2026年は145か国、過去年は公開アーカイブの上位25か国です。2008・2009年は「更新なし」、2013年は一覧がありません。過去年のPowerIndexスコアは公開されていないため順位のみを使い、レースの棒は順位を示す表示で公式スコアではありません。
- **人口** — World Bankの[Population, total](https://data.worldbank.org/indicator/SP.POP.TOTL)、2005〜2025年。
- **GDP（名目）** — World Bankの[GDP (current US$)](https://data.worldbank.org/indicator/NY.GDP.MKTP.CD)、2005〜2025年。米ドル建ての当年価格で、物価調整や購買力平価による比較ではありません。
- **国土面積** — World Bankの[Land area](https://data.worldbank.org/indicator/AG.LND.TOTL.K2)、2005〜2024年。内水面を除いた陸地面積（平方キロメートル）です。

World Bankのデータは国・地域や年により欠けている場合があり、値がある対象だけを順位に含めます。軍事力アーカイブも上位25か国のみです。一覧にないことは、順位がない、または圏外であることを意味しません。出典と指標ごとの制限はサイト内にも表示しています。

## データの更新・追加

World Bankのデータを更新するには、リポジトリのルートで実行します。

```sh
python3 scripts/build_world_bank_rankings.py
```

取得元のAPIエンドポイント、期間、表示名、単位、説明は `site/data/datasets.json` にあります。新しいWorld Bank指標を追加する場合は、そこに指標コードと設定を登録し、同じ形式の年別JSONを生成します。軍事力データはGFPの公開資料を確認して `site/data/rankings.json` を更新してください。

## GitHub Pages

`main`ブランチへのpushで `.github/workflows/pages.yml` が `site/` をデプロイします。リポジトリの **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選択してください。
