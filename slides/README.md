# ANIMA 簡報規範（Deck）v1.4

對外簡報（業務提案、產品介紹、合作夥伴、投資人）看得到的樣子都照這份走。值寫在 [`anima-brand/references/tokens.css`](../anima-brand/references/tokens.css) 的 `--deck-*` token，這份文件說明怎麼用。

## 怎麼接

| | sales deck | 其他簡報 |
|---|---|---|
| `tokens.css` | 直接讀 `--deck-*` 和色階 token | 直接讀 |
| `slides.css`＋`slides.js` | 不引用，當示範頁對照版型 | 直接引用 class，從 `examples/layouts.html` 複製版型 |

- **只讀色階和 `--deck-*`。** 不要用 `--text-primary`、`--bg-card` 這類語意 token，它們在深色模式會換值。
- **不寫死顏色和字級。** 所有顏色、字級、圓角、間距都從 token 來；規範以外的值檢查工具會擋。
- **token 要改名或刪除，先通知 sales（Wayne）。** deck 正在用。改值不用通知，merge 進 main 就算發版。

## 畫布與縮放

- 規範以 **1920×1080** 為準。
- 所有尺寸 token 都乘上 `--deck-canvas-scale`。1920 畫布設 `1`；1440×810 畫布設 `0.75`，其他不用動。
- 要設在 `:root`，不能設在 `.deck` 之類的子元素：尺寸 token 在 `:root` 就算好了，設在下層不會跟著變。
- 這個 token 只管畫布換算。投影時依視窗大小整頁縮放是另一回事，用自己的變數（sales deck 現在的 `--deck-scale` 就是這個用途，不受影響）。

```css
:root { --deck-canvas-scale: 0.75; } /* 1440×810 的 deck 只要加這行，放在 tokens.css 之後 */
```

- 外圈邊距：左右、底、頁首到頂端都是 96（`--deck-pad-x`、`--deck-pad-bottom`）；標題頂線 `--deck-pad-top` 192。
- 間距只用 `--deck-space-1`～`7`：8／16／24／32／48／64／96。

## 字級（8 階，最小 24）

| token | 1920 | 1440 | 用在 | 行高 |
|---|---|---|---|---|
| `--deck-fs-display` | 96 | 72 | 封面主標、主張頁大字 | `--deck-lh-tight` 1.15 |
| `--deck-fs-number` | 112 | 84 | KPI 大數字（資料頁的主角，比標題大） | `--deck-lh-tight` |
| `--deck-fs-title` | 64 | 48 | 每頁標題（一頁一個） | `--deck-lh-title` 1.3 |
| `--deck-fs-heading` | 44 | 33 | 區塊標題、卡片大標 | `--deck-lh-title` |
| `--deck-fs-subheading` | 36 | 27 | 副標、卡片標題 | `--deck-lh-title` |
| `--deck-fs-body-lg` | 30 | 22.5 | 重點內文、引言 | `--deck-lh-body` 1.6 |
| `--deck-fs-body` | 26 | 19.5 | 一般內文 | `--deck-lh-body` |
| `--deck-fs-caption` | 24 | 18 | 註解、標籤、chip、圖表軸、資料來源 | `--deck-lh-body` |

- **字放不下就刪字或拆頁，不要縮字。** 沒有比 caption 更小的字。
- 一頁最多用 4 個字級。

## 一頁的內容上限（硬性）

資訊全部塞在同一頁，畫面很亂，聽的人也抓不到重點。下面的上限是**硬性規定**，超過就拆頁，不是縮字、縮間距硬塞。

**一頁只講一件事。** 標題就是這頁的結論，一句話、最多兩行。一頁要講兩個結論，就是兩頁。

| 項目 | 上限 | 怎麼算 |
|---|---|---|
| 內文字數 | **150 字** | 不含標題、頁首列、頁尾註解、圖例、軸標；英數字 2 個算 1 字 |
| 表格 | **6 列 × 5 欄** | 不含表頭那一列、不含第一欄的項目名 |
| 流程圖節點 | **10 個** | 泳道、單列流程、架構圖的 `.node` |
| 並列的區塊 | **4 個** | 一排的卡片（`.grid > .card`）、方案欄、數字卡；方案 5 欄（`.options.compact`）例外。功能格、指標拼貼這類每格只有一兩行的不算，由字數管 |
| 清單 | **6 項** | 每一組清單、目錄、議程、步驟 |
| 說明條 | **2 個** | `.callout` |

**超過了怎麼辦**
1. 先刪：同一件事講兩次的、聽的人不需要的細節，拿掉。
2. 再拆：照論點拆成兩頁（例如「發現」和「建議」各一頁），不要照版面硬切成「上半頁、下半頁」。
3. 表格列數太多：只留要討論的列，完整版放附件或另一頁。

**一定要放在同一頁**（例如客戶要求整張表一頁看完）：**先告訴 Victor**，同意後在那一頁的 `<section>` 加 `data-dense="原因"`，例如 `data-dense="客戶要整張進度表一頁看完，Victor 11/13 同意"`。交付時在自檢報告裡列出這幾頁。

**自動檢查**：`slides.js` 會在每一頁載入時量上面這幾項。按 `O` 進總覽，超過的頁縮圖左上角會出現紅色標記，寫著哪一項超過；有 `data-dense` 的頁改成黃色標記。瀏覽器 console 也會列出來。標記只在總覽出現，投影和 PDF 不會印出來。

## 版面 v2（2026-11-13，依兩份參考簡報重訂）

- **頁首列**：左上頁名、右上 logo。封面、章節頁、結尾不放。不放頁碼、不放頁尾。標記仍寫 `<footer class="slide-foot">`，CSS 會把它放到上方；深底頁自動換白字 logo。
- **字重**：標題、大字、數字都用 regular，主次靠大小和顏色分。粗體只留給表格第一欄這類小地方。
- **數字的中文單位**：中文字面比數字大，大數字裡的單位（個月、萬、家、天）用 `<small>` 包起來，縮成 0.5 倍（最小不低於 caption）：`<span class="kpi-value">1<small>個月</small></span>`。
- **數字**：大數字用 `--deck-fs-number` 112，顏色 `--s-accent`（白底 Current 500、深底 Sky 300）。說明一行小字。
- **內容框**：整頁外圈只有一個邊距 `--deck-pad-x` 96：左、右、底、頁首到頂端都一樣。標題頂線固定在 `--deck-pad-top` 192，內容底線在 984。每一頁的內容都落在這個框裡：
  - 標題永遠在頂線，不垂直置中（封面、章節頁、主張頁、引言、結尾例外）。
  - 內容撐到底線；內容少的頁整組靠底線放，不放在中間。
  - 有底色的框四邊同一個內距（`--deck-card-pad` 40；流程節點、對話泡泡 24）。框照內容高度，不撐出空白；標題和大數字用 `text-box` 裁掉上下行距，字的頂和底才會切齊內距。
  - 卡片裡的內容從上往下排（靠上）。只有方案欄（`.option`）例外：最後的清單、說明壓在卡底，同一排方案的底部才對齊。
- **字的間距**：每組內容最外側的字裁掉行距，讓字的頂和底切齊框、線、頁面邊界；組內的字一定留距離，數值見下面「對齊與間距」。多行內文行高 1.6。
- **主張頁**：文字置中，一句一行（用 `<br>` 斷開），不加裝飾。**引言頁**：文字置中，一個大的淡色引號墊在文字後面。
- **預設封面**是 `.cover-phone` 配品牌流動玻璃背景（`.cover-bg.flow-06`，示範第 1 頁）；其他封面是備選：滿版流動玻璃（`.cover.ground-flow`）、畫面塊＋標題、自己的底圖＋手機、深色玻璃＋手機。
- **封面＋手機** `.cover-phone`：背景鋪滿、手機在右邊往下超出頁面、文字在左。背景三選一：`.cover-bg` 放自己的底圖（圖案太滿加 `.is-faded`）、`.cover-bg.flow-NN` 品牌流動玻璃、整頁 `.ground-dark` 深色玻璃。手機圖用 JPG，圓角由 CSS 裁。
- **深底頁**：白底為主，深底（Depth 900）大約三分之一，放在想讓人停下來的頁（目錄、重點數字、做法、見證）。深底上的卡片用 `--deck-card-bg-dark`（Depth 800）。
- **深色頁開關**：寫在 `<main class="deck" data-dark="…">`，整份一起切換，印 PDF 也照這個設定：
  - `all`（預設）：照每頁設的底色。
  - `sections`：只留章節頁和 logo 結尾頁是深底，其他深底頁自動換成白底版本。
  - `off`：全部白底。
  - 投影時右下角有「深色頁」按鈕可以循環預覽；網址加 `?dark=off` 也可以臨時切換。
  - 每一頁的版型都同時有深、白兩種樣子，切換時卡片、圖表、畫面塊、logo 會自動換色，不用改內容。
- **亮點卡** `.is-highlight`：實心 Current 500 ＋白字，一頁最多一張，標這頁最重要的一項。`.option.is-featured`、`.compare-col.after` 自動套用。深色面板不再加光暈。
- **畫面塊** `.art` ＋ `.flow-NN`：流動玻璃裁成圓角矩形放進版面；深底頁自動轉深色版。`.is-band` 是橫條、`.is-fill` 撐滿格子。
- **標題右側說明** `.slide-head.split`：標題左、兩三行說明靠右上。
- **標題不上色**：顏色交給數字和亮點卡，不在標題裡挑幾個字變色。
- **所有版型**：每頁右下角有按鈕（列印時不出現），點了看全部縮圖，點縮圖跳過去；也可以按 O。

## 對齊與間距（2026-11-13 逐頁校正後定下來的）

所有距離都量「看得到的字」：字用 `text-box: trim-both cap alphabetic` 裁掉行距，量的是字頂（cap）到字底（baseline）。改版型時用同一套數字，不要靠行高猜。

**層級：越裡面越小**
- 內距：外圈 96 → 卡片、深色面板、對照欄、數字卡 40（`--deck-card-pad`）→ 流程節點、對話泡泡、放射項目 24 → 最小的區塊（roadmap 頂端方塊）16。新增有底色的框，照它在第幾層挑一個，不要自己訂數字。
- 圓角：卡片、深色面板、畫面塊 12 → 標籤、說明條 8 → 按鈕 6；chip 是膠囊形。一層一個圓角。
- 底色：有底色的東西放進有底色的框裡，就深一階，才分得出層次。灰卡裡的 chip 從 Sky 50 換成 Sky 100、狀態標籤從 50 換成 100；卡片裡的小區塊在白底頁用白、在有底色的頁用 Depth 50。

**框的內距不疊加**
- 框四邊的內距由框負責，最後一列自己的 padding 歸零，底邊才不會比其他三邊寬。
- 反過來，框本身沒有上下內距的（例如對照欄，列要跟旁邊那欄對齊），就由欄標題的上方和最後一列的下方補到同樣的值。不管哪一種，量起來四邊都要一樣。

**線的三種深淺**
- 項目與項目之間：`--s-line`。
- 欄標題、卡片頭下方：`--s-line-strong`，深一階，看得出這是標題的線。
- 流程連接線：再深一點，一眼分得出哪條是流程、哪條是分隔線。
- 分隔線一律 2px。

**外框**
- 外圈 96：左、右、底，頁首列和封面 logo 到頂端也是 96。封面 logo 貼左上角（96／96）。
- 標題頂線 192，內容底線 984。內容少的頁整組靠底線放。

**標題＋副標（全 deck 同一套）**
- 小標題（26 以下）接副標或清單：**16**。
- 大標題（30 以上：卡片標題、feature、KPI 標籤、編號說明、橫向里程碑）接副標或清單：**28**。
- 卡片頂端的 chip 列、階段卡的編號圓，到標題也是 **28**，跟標題到內文一樣。
- 外層 flex／grid 自帶 gap 的，CSS 用 `--pair-g` 扣掉，避免 gap 和 margin 疊加。新增容器時要記得設。
- 只套在上下堆疊的組合；左右並排的（案例列「背景／卡點」、架構層名稱和 chip）不吃這個間距，頂端對齊。
- label 接大數字（儀表板）不算標題＋副標，維持原本間距。

**其他固定間距**
- 頁標題接引言（lede）：**24**。
- 大數字、價格接下面的說明：**16**。
- 一組數字接下一組（直排的 KPI、案例結果）：**32**。

**分隔線列**（對照欄、資料盤點、部署選項）
- 每列上下 padding **24**，最後一列如果有底線也留 24。
- 對照欄（`.compare-col`）有底色，欄框四邊同一個內距 `--deck-card-pad` 40：欄標題上方、最後一列下方、左右都一樣，不用列的 24 代替。
- 小標題 26 semibold 深色，副標 24 muted。
- 欄標題下方第一條線用深一階的線色（`--s-line-strong`），跟 card-head 一致。

**清單**
- 每一項都裁成一樣，圓點、勾勾、方框對齊第一行字的中線（約 .36em）。
- 一般清單項目間距 32；勾選方框清單（雙方準備）48；編號說明（截圖標註）48。

**同一排等高**
- 同一排的卡片、方案欄、比例對照、資料轉換前後一律等高，整排靠底線。
- 卡片內距四邊一樣；roadmap 方塊到左右兩條泳道線都是 16。

**置中與對稱**
- 箭頭（＞）用視覺中心對齊，不是外框中心：往左補半個箭頭寬。
- 里程碑的點到上面日期、到下面標題等距（40），虛線穿過點的中心。
- 頭像列（團隊）置中；其他人物介紹靠左。

## 顏色的例外規則

- **亮點卡（藍底）裡**：chip、編號圓一律白底藍字。灰卡裡的 chip 用 Sky 100、狀態標籤用 100 階，這兩條都不能套到藍底上。
- **深底上的圖表**：Current 500 對比不夠，系列色換成 Sky 300、Current 300、Ripple 300、Depth 300、Sky 100、Depth 500；長條裡的字換深色。亮點卡和編號圓（實心色塊＋白字）維持 Current 500。
- **氛圍漸層底** `ground-ambient`：用在內容少、想要停一下的頁（議程、KPI、公司概要、大數字、結尾）。表格、甘特、泳道、矩陣、儀表板這類細線多的頁維持白底。

## 字重（4 階）

| token | 值 | 用在 |
|---|---|---|
| `--deck-fw-regular` | 400 | 內文 |
| `--deck-fw-medium` | 500 | 標籤、chip、表頭 |
| `--deck-fw-semibold` | 600 | 卡片標題、標語 |
| `--deck-fw-bold` | 700 | 頁標題、display、數字 |

數值是**看起來的粗細**。Nunito Sans 同數值比思源黑體輕一階，拉丁字要不要 +100 由使用端換算。

## 底色

一頁只用一種底色。

| token | 色階 | 用在 |
|---|---|---|
| `--deck-ground-page` | 白 | 預設 |
| `--deck-ground-neutral` | Depth 50 | 資料、脈絡、現況頁 |
| `--deck-ground-brand` | Sand 50 | ANIMA 說話：方案、標語、CTA |
| `--deck-ground-sky` | Sky 50 | 冷調品牌頁 |
| `--deck-ground-ambient` | 白→Sky 50→Sand 50 漸層 | 封面以外需要氛圍的頁 |
| `--deck-ground-dark` | Depth 900 | **只用在**章節頁、主張頁、logo 結尾頁 |
| `--deck-ground-dark-warm` | Sand 900 | 同上，需要溫度時 |

- Neutral 和 Brand 兩種底不要連續相鄰，中間隔一頁白底。
- 整份 deck 的 Sky＋Current 加起來約 15% 畫面以內，藍色只出現在識別點、重點數字、按鈕。

## 文字色

| token | 色階 | 對比 |
|---|---|---|
| `--deck-text` | Depth 700 | 白底 9.99:1 |
| `--deck-text-strong` | Depth 900 | 標題可選 |
| `--deck-text-muted` | Depth 600 | 白底 6.10:1、Depth 50 底 5.73:1 |
| `--deck-text-accent` | Current 500 | 白底 5.89:1，重點數字與強調 |
| `--deck-text-on-dark` | 白 | |
| `--deck-text-on-dark-muted` | Depth 200 | Depth 900 底 11.78:1 |
| `--deck-text-on-dark-accent` | Sky 300 | Depth 900 底 10.40:1 |

Sky 500（`--deck-brand`）只當識別點（logo、小圓點），不當文字色。

## 元件

| 元件 | 規則 |
|---|---|
| 卡片 | `--deck-card-bg` Depth 50（在 Depth 50／Sand 50 底上改用 `--deck-card-bg-alt` 白）、圓角 12、內距 40、**不加陰影、不加邊框**。不要卡片裡再放卡片。 |
| Chip | Sky 50 底、Sky 800 字、pill 圓角、caption 字級、medium 字重。用在分類、關鍵字、系統名稱。放在灰卡裡改 Sky 100 底；放在亮點卡裡改白底藍字。 |
| 狀態標籤 | 圓角 8，字用 `-text`（700）、底用 `-bg`（50），不加前置小圓點（標籤本身的底色已經表達狀態）；`-mark`（600）用在圖表、長條這類圖形。success＝自動／完成，warning＝待確認／部分，error＝風險／錯誤。 |
| 按鈕 | Current 500 底、白字、圓角 6、bold。一頁最多一顆。 |
| 說明條 | Sky 50 底、Depth 700 字、圓角 8。**不加左側色條**。 |
| 深色面板 | Depth 900 底、圓角 12（跟卡片同一層）、內距 40（`--deck-card-pad`，跟卡片一樣），不加光暈。一頁最多一塊，用在 ANIMA 方案或重點結論。`--deck-panel-dark-pad`（56）、`--deck-panel-dark-glow` 這兩個 token 版型不再使用。 |
| 線條 | `--deck-line` Depth 100、`--deck-line-strong` Depth 200；深底用 `--deck-line-on-dark`。 |

**不用裝飾色條、不用陰影分層、不用 emoji。**

## 狀態色

`success`、`warning`、`error` 三組 10 階色階，只表達狀態，不當裝飾色。Error 沿用 Web DS；Success、Warning 用同樣方法（明度跟 Current 一樣，只換 OKLCH 色相）推出。

| | 文字（700）／淺底（50） | 對比 |
|---|---|---|
| success | `#116D44` / `#EEF6F1` | 5.79:1 |
| warning | `#7C5200` / `#FAF2E9` | 6.18:1 |
| error | `#9F2E29` / `#FEF0EE` | 6.53:1 |

## 圖表

- 系列色依序取用 `--deck-chart-1`～`6`：Current 500、Sky 300、Current 800、Ripple 700、Depth 600、Depth 900，藍色系為主。兩兩色差 ≥ 16（OKLab ×100）。多數圖表只用前兩色加 other。深底頁自動換成亮色版（見「顏色的例外規則」）。
- 超過 6 組，把次要的併成「其他」，用 `--deck-chart-other`（Depth 200）。對照組、基準線也用它。
- 格線 `--deck-chart-grid`、軸與標籤 `--deck-chart-axis`，字級用 caption。
- 只有一組資料時用 chart-1；要強調其中一根，強調那根用 chart-1、其餘用 other。

## PDF

- 每一頁不靠動畫也要能完整讀懂，PDF 只會印出最後的狀態。
- 字型要嵌靜態 TTF（Chrome 會把可變字型嵌成 Type 3，LINE 檢視器會破字）。Nunito Sans 400–800 的靜態檔在 `anima-brand/assets/fonts/static/`；`slides.css` 已經接好，寫 `font-weight: 700` 會自動用重一階的 800 檔。
- 用 Chrome 列印或 headless `--print-to-pdf`，`slides.css` 會一頁印一張 1920×1080。
- 只用 `--deck-font` 這組字型。等寬字（`ui-monospace`、SF Mono）這類系統字型在 PDF 裡也會變成 Type 3。
- 圖片用 JPG 或不透明 PNG；帶透明的 PNG 印成 PDF 會拆成兩張圖。

## Logo 與素材

- sales deck 素材：檔名帶 `-dark` 的是給深色底用的**白色版**。
- 品牌 repo 的 `assets/logo/`：`primary_dark` 是深色底用的白字版；`mono_light` 是白色單色、`mono_dark` 是深色單色。深色底用 `primary_dark` 或 `mono_light`。
- 封面底圖、4A 頁 GIF 的規則照 sales 交接文件；新版素材之後補。

## 液態玻璃（照 ANIMA Web DS）

官網和 Web DS 常用的液態玻璃，在簡報裡只用這三種，數值照 Web DS 原樣，不自創。

**用量要少，它是重點，不是底色。** 一份簡報：
- 流動玻璃底圖：封面、結尾必用；中間最多再一頁（例如淺色章節頁）。
- 玻璃框：只包產品畫面，一份最多兩頁。
- 展示台：只放「產品在做事」的示意（群組對話、操作畫面），一份最多兩頁。流程圖、架構圖、資料頁不要放。
- 合計大約 5 頁以內。主張頁、引言、圖表、表格、流程圖不要加玻璃，用平面底色。


| 用法 | class | 用在 |
|---|---|---|
| 流動玻璃底圖 | `.ground-flow` ＋ `.flow-01`～`.flow-13` | 封面、結尾，中間最多再一頁 |
| 玻璃框 | `.glass` ＞ `.glass-in` | 包住產品畫面；只放在流動玻璃底圖或有色底上 |
| 展示台 | `.stage` ＋ `.flow-NN` | 產品在做事的示意（群組對話、操作畫面） |

- 底圖 13 張在 `anima-brand/assets/backgrounds/flow/`，已轉成 JPG（PDF 不會拆圖）。每張都有一塊留白給文字，挑玻璃跟文字錯開的那張；`slides.css` 裡每張都註明玻璃在哪一側。
- token：`--deck-glass-bg`（白 32%）、`--deck-glass-ring`（白 70%）、`--deck-glass-backdrop`（blur 20px＋saturate 140%）、`--deck-glass-pad` 10px、`--deck-glass-shadow`、`--deck-stage-blur` 10px。
- 字多的頁要壓淡底圖，加 `.is-faint`。
- 列印時展示台上的陰影會自動拿掉（Chrome 會把它印成灰色方塊）。

## sales deck 現有顏色對照（v1.3 色階外的 26 色）

把 deck 裡寫死的值換成右欄的 token，就能清到零。

| deck 現值 | 用在 | 換成 |
|---|---|---|
| `--paper` `#FAFCFD` | 紙面底 | `--deck-ground-page` |
| `#EAF1F4`、`#E7EEF2`、`#EEF4F6` | body／`.deck` 外框底（不進 PDF） | `--depth-100` |
| `--green` `#27865A` | 成功色 | `--deck-success-mark` |
| `--green-soft` `#E7F6ED` | 成功淺底 | `--deck-success-bg` |
| `#1C6B46` | `.tier-badge`（auto）字 | `--deck-success-text` |
| `rgba(39,134,90,…)` | 綠色光圈 | `--success-600` 搭 `color-mix()` |
| `--amber` `#9A6714` | 警示色 | `--deck-warning-mark` |
| `--amber-soft` `#FFF3D8` | 警示淺底 | `--deck-warning-bg` |
| `#805F12` | `.feature-mark.partial` 字 | `--deck-warning-text` |
| `#F7EDC9` | `.feature-mark.partial` 底 | `--deck-warning-bg` |
| `#E0B268`、`#EDC98D` | `.hcard.gate` 邊框 | `--warning-300`、`--warning-200` |
| `--red` `#BC4B40` | 錯誤色 | `--deck-error-mark` |
| `--red-soft` `#FCEBEA` | 錯誤淺底 | `--deck-error-bg` |
| `#8B5A5A` | `.feature-mark.no` 字 | `--deck-text-muted`（「不支援」用中性色，不用紅） |
| `#F4E7E7` | `.feature-mark.no` 底 | `--deck-ground-neutral` |
| `#D9A6A0` | `.pain-chip`、`.gap-item` 左側色條 | **拿掉**（不用裝飾色條）；要分類就改用狀態標籤 |
| `#0F4C67` | `.tier-list li`（assist）字 | `--deck-chip-text` |
| `#38C6D2`、`#9FB2BB` | `.hstage` 連接線 | `--deck-line-strong` |
| `#4FCFE4`、`#DEF8F9` | `.question-bar` 長條 | `--deck-chart-*` 依序 |
| `rgba(0,126,181,…)`、`rgba(32,75,94,…)` | 卡片陰影 | `--deck-card-shadow`（none） |
| `rgba(219,230,235,…)` | 淺線 | `--deck-line` |

## slides.css 版型

`examples/layouts.html` 是 71 頁版型示範；三份舊簡報每一頁要用哪個版型，見 `examples/coverage.md`，每頁一種，複製需要的 `<section>` 改文字就好，不要另外寫樣式。

| class | 版型 | 用在 |
|---|---|---|
| `.cover` | 封面 | 客戶名、主標、一句說明 |
| `.agenda` | 議程 | 3–6 項，`.is-current` 標目前章節 |
| `.section` + `.ground-dark` | 章節頁 | 章節編號＋大標 |
| `.statement` | 主張頁 | 一句話，`<em>` 標重點 |
| `.grid.cols-2/3/4` + `.card` | 卡片欄 | 並列 2–4 件事 |
| `.kpis` + `.kpi` | 大數字 | 2–4 個數字，不放卡片 |
| `.split` | 左文右圖 | 產品畫面、截圖 |
| `.flow` | 流程 | 3–5 步，最後一步常是人工確認 |
| `.compare` | 現況 vs 導入後 | 一列一個對照，右欄用深色面板 |
| `.table` | 對照表 | 功能比較，`.is-us` 標我方欄 |
| `.timeline` + `.bar` | 時程 | 甘特圖，`--from`／`--to` 是第幾週 |
| `.options` + `.option` | 方案 | 2–3 欄，`.is-featured` 標推薦 |
| `.quote` | 引言 | 客戶說的話 |
| `.closing` | 結尾 | 一句話＋按鈕＋聯絡方式 |
| `.facts` | 公司概要 | 一段介紹＋4–6 個事實數字 |
| `.layers` | 分層架構 | 3–5 層，右側深色面板統籌 |
| `.hub` | 中心放射 | 左邊來源、中間核心、右邊結果 |
| `.case` | 案例 | 背景／卡點／做法＋深色面板放結果 |
| `.ratio` | 比例對照 | 兩塊寬度照 `--share` 比例 |
| `.bars` | 長條圖 | 排名、占比；要強調一根，其餘加 `.is-other` |
| `.stages` | 階段路徑 | 3–4 階，一階比一階高 |
| `.options` + `.option-rows` | 選項比較（無價格） | 部署方式等，一列一個面向 |
| `.table.matrix` + `.mark` | 權限矩陣 | ● 有、○ 部分、－ 沒有 |
| `.list.boxes` | 準備清單 | 雙方各一欄，方框勾選 |
| `.transform` | 資料轉換前後 | `.pii` 標個資、`.token` 標代號 |
| `.people` | 團隊 | 頭像、姓名、職稱、一句經歷 |
| `.logos` | logo 牆 | 客戶 logo 自動轉單色；沒授權寫產業名 |
| `.market` | 市場規模 | TAM／SAM／SOM 同心圓 |
| `.chart` | 折線圖 | SVG 用 `.series-1`、`.grid-line` 等 class 取色 |
| `.quadrant` | 競爭定位 2×2 | 點的位置用 `--x`、`--y` |
| `.milestones` | 里程碑 | `.is-done`／`.is-now`／未來 |
| `.annotated` | 截圖加標註 | 圖上 `.pin` 對應右邊編號說明 |
| `.features` | 功能格 | icon＋標題＋一句話，6–8 格 |
| `.split-3` | 合作分工 | 我方／一起做／夥伴 |
| `.fullbleed` | 全版圖片 | 圖片用 JPG，文字壓在下方漸層 |
| `.ask` | 大數字主張 | 一個超大數字置中＋一排小數字（募資、核心成果） |
| `.dots` | 點陣比例 | 100 個點亮 N 個，「每 100 人有 93 人」 |
| `.stats.is-big` | 大數字卡 | 一排 3～4 張，一張 `.is-highlight` |
| `.tiles` | 指標拼貼 | 3×2 數字磚，一亮一深（`.stat.is-dark`） |
| `.donut` | 甜甜圈 | `--a --b --c` 是前三段百分比，中間放總數 |
| `.section-band` | 章節帶 | 上方畫面塊、下方色帶、超大淡色編號 |
| `.quotes` | 見證 | 一則大的亮點＋兩則小的；只用取得同意的原話 |
| `.roadmap` | 路線圖 | 階梯式，`--i` 是第幾階 |
| `.toc-big` | 目錄 | 兩欄大編號 |
| `.sharebar` ＋ `.shares` | 比例條 | 一條堆疊條＋每段數字 |
| `.numlist` | 編號清單 | 大字條列＋小編號，常搭畫面塊 |
| `.numcols` | 編號三欄 | 大編號＋標題＋說明，不放卡片 |
| `.contact-row` | 聯絡資訊 | 結尾頁三欄 |
| `.cover-body` + `.cover-aside` + `.toc` | 封面＋目錄 | 右邊深色面板列今天的議程 |
| `.cover-phone` | 封面＋手機 | 三種背景：自己的底圖、流動玻璃、深色玻璃 |
| `.slide.center` | 置中封面、logo 結尾頁 | logo 結尾頁可用深色底 |
| `.chain` | 單列流程 | 節點橫排，`.node-group` 是同時進行的一組 |
| `.lanes` + `.lane` | 泳道流程 | As-is／To-be；節點用 `--lane`、`--step`、`--span` 定位 |
| `.arch` | 架構矩陣 | 層別 × 方案，格子用 `grid-column`／`grid-row` 定位 |
| `.hub.wide-core` + `.hub-core.rect` | 調度中心 | 中間是長方形面板，放分工步驟 |
| `.stats` + `.stat` | 數字卡 | 儀表板小 KPI，`.stat-delta.is-up／is-down` 標和上次比 |
| `.timeline.has-end` | 甘特：預定 vs 實際 | `.bar.is-plan`＋`.bar.is-actual` 同一 `--row`；`.timeline-today` 今天線；`.timeline-end` 差幾天 |
| `.columns` + `.col` | 直條圖 | `--v` 是高度 0–100，`data-v` 是顯示的數字 |
| `.callout.is-success／is-warning／is-error` | 狀態說明條 | 結論是好消息、要注意、有風險 |
| `.chat` + `.msg` | 對話示意 | 群組裡的訊息，`.is-me` 是同仁 |
| `.entries` + `.entry` | 資料來源盤點 | 標題、規格、說明、觀察 |
| `.excerpt` + `<mark>` | 原文摘錄 | 出處一行＋原文，重點用 `<mark>` |
| `.rows` | 帶標籤清單 | 左邊項目、右邊來源或狀態 |
| `.steps` | 直向步驟 | 下一步、做法；`.is-current` 標目前這步 |
| `.milestones.vertical` | 直向時間軸 | 歷程、募資紀錄 |
| `.options.compact` | 方案 4–5 欄 | 價格縮成 heading |

### 連接線

流程圖、架構圖的箭頭不用自己畫。外層加 `.diagram`，每個節點給 `id`，起點加 `data-to="目標id"`，`slides.js` 會自動畫直角箭頭；`data-to-style="dashed"` 畫虛線、`"accent"` 畫藍線。

```html
<div class="lanes diagram" style="--steps: 4;">
  <div class="node is-human" id="a" data-to="b" style="--lane: 1; --step: 1;"><b>一句話下指令</b></div>
  <div class="node is-ai" id="b" style="--lane: 2; --step: 2;"><b>讀取資料</b></div>
</div>
```

節點顏色：`.node` 一般、`.is-ai` ANIMA 做的、`.is-human` 人做的、`.is-done` 完成、`.is-gap` 缺口（紅虛線）、`.is-ghost` 之後才有的（灰虛線）。

- 有深色面板的版型（`.case`、`.ratio`、`.stages`、`.compare`、`.options`、`.layers`、`.hub`）一頁只放一塊。
- 示範頁裡的數字都是示意，寫進真的簡報前要換成有出處的數字。

- 底色用 `.ground-neutral`／`-brand`／`-sky`／`-ambient`／`-dark`／`-dark-warm`。深色底的文字、線條、卡片會自動換色。
- 換頁：方向鍵、空白、點畫面；`#5` 跳頁；`O` 總覽；`F` 全螢幕。

## 版本

- v1.4（草稿）：新增狀態色階（success／warning／error）、`--deck-*` 簡報 token、這份文件、`slides.css`／`slides.js`／版型示範、Nunito Sans 靜態 TTF。
