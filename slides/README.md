# ANIMA 簡報規範（Deck）v1.5

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

- 外框：左右、頁首列到頂都是 80（`--deck-pad-x`）；頁底品牌列到底 64（`--deck-brand-bottom`）。標題頂線 `--deck-pad-top` 144，內容底線 968（`--deck-pad-end` 離底 112）；關掉品牌列的頁內容底線 1000（`--deck-pad-bottom` 80）。頁首（標題、引言）到內容 40（`--deck-head-gap`）。2026-11-17 從 96／192／984 改成 80／144／936，2026-11-20 為了多一點內容空間改成現在的數字（內容區高 792 → 824）。
- 間距只用 `--deck-space-1`～`7`：8／16／24／32／48／64／96。

## 字級

**規範管範圍，不管數字**（2026-11-17，Wayne 提議、Victor 同意）。做 deck 的人在下面三條裡自己挑大小：

1. **最小字級**：投影的頁最小 **20**；附錄頁（`data-appendix`）最小 **16**；只發 PDF、不投影的簡報最小 **14**。
2. **級距**：同一頁用到的字級，相鄰兩級至少差 **4px**（1920 畫布；1440 畫布是 3px）。唯一例外是內文 26 配標籤／chip／軸的 caption 24，這兩個靠底色、顏色、位置分，不靠大小。
3. **一頁最多 4 級**（頁首列、頁底品牌列不算）。內文 26 和 caption 24 算**同一級**：例如三欄卡片頁用 64／36／30／26／24，算 4 級。

自己挑的大小一樣寫成 `calc(Npx * var(--deck-canvas-scale))`，不要寫死 px。沒有特別理由，就用下面的建議值（token）：

| token | 1920 | 1440 | 用在 | 行高 |
|---|---|---|---|---|
| `--deck-fs-display` | 96 | 72 | 封面主標、主張頁大字 | `--deck-lh-tight` 1.15 |
| `--deck-fs-number` | 112 | 84 | KPI 大數字（資料頁的主角，比標題大） | `--deck-lh-tight` |
| `--deck-fs-title` | 64 | 48 | 每頁標題（一頁一個） | `--deck-lh-title` 1.3 |
| `--deck-fs-heading` | 44 | 33 | 區塊標題、卡片大標 | `--deck-lh-title` |
| `--deck-fs-subheading` | 36 | 27 | 卡片標題 | `--deck-lh-title` |
| `--deck-fs-body-lg` | 30 | 22.5 | 標題下的副標、重點內文、引言 | `--deck-lh-body` 1.6 |
| `--deck-fs-body` | 26 | 19.5 | 一般內文 | `--deck-lh-body` |
| `--deck-fs-caption` | 24 | 18 | 標籤、chip、圖表軸、一般註解 | `--deck-lh-body` |
| `--deck-fs-small` | 20 | 15 | footnote、資料來源、小註解、頁底品牌列的 slogan（投影可用的最小值） | `--deck-lh-body` |
| `--deck-fs-micro` | 16 | 12 | 附錄：細表、條款小字 | `--deck-lh-body` |
| `--deck-fs-print` | 14 | 10.5 | 只發 PDF 的簡報：備註、條款、法律聲明、細表註腳 | `--deck-lh-body` |

- **字放不下，先縮短說法、再拆頁**，縮字是最後的選項。縮字也要守上面三條，不能縮間距、縮版面硬塞。
- 20 以下只放輔助資訊（footnote、資料來源、條款），不放這頁要講的重點。
- 同一份 deck 要投影，就不用 14。

## 一頁的內容上限（目標）

資訊全部塞在同一頁，畫面很亂，聽的人也抓不到重點。下面的上限是**目標**：做 deck 的時候照這個數字排，超過了先想辦法縮、拆。

**誰決定**（2026-11-17，Wayne 提議、Victor 同意）：怎麼縮、怎麼拆、要不要刪資訊、要不要讓某頁放多一點（`data-dense`）、拆完太空怎麼處理，**由做 deck 的人（用 skill 的人）決定，不用每次問 Victor**。Victor 負責視覺：版型、對齊、間距、字級、素材。內容（文字、數字、哪些資訊要留）由做 deck 的人負責。

**底線**（不管誰做都要守）：
- 總覽的紅色標記照樣會出現，提醒這頁超過目標。超過目標還是要放，就在那一頁 `<section>` 加 `data-dense="原因"`（例如 `data-dense="客戶要整張進度表一頁看完"`），不用等誰同意，但原因要寫，交付時列出這幾頁。
- 縮字要守「字級」那三條（最小字級、級距、一頁最多 4 級），不能縮間距、縮版面硬塞。
- **附錄不套上限**：附錄頁的 `<section>` 加 `data-appendix`，`slides.js` 就不檢查字數、表格、太空。
- 改模板本身（版型、樣式、token）仍要 Victor review。

**一頁只講一件事。** 標題就是這頁的結論，一句話、最多兩行。一頁要講兩個結論，就是兩頁。

| 項目 | 目標上限 | 怎麼算 |
|---|---|---|
| 內文字數 | **250 字** | 不含標題、副標、頁首列、頁底品牌列、頁尾註解、圖例、軸標；英數字 2 個算 1 字（2026-11-17 從 200 調到 250） |
| 副標 | **2 行、60 字** | 標題下的副標（`.lede`，封面、結尾頁的副標也算）另外算，不算進上面的 250 字；英數字 2 個算 1 字。行數只管全寬標題列的副標，窄欄版型（左右分欄、側欄標題）只看字數。副標是補一句脈絡，要講更多就放進內文 |
| 表格 | **8 列 × 5 欄** | 不含表頭那一列、不含第一欄的項目名 |
| 流程圖節點 | **10 個** | 泳道、單列流程、架構圖的 `.node` |
| 並列的區塊 | **4 個** | 一排的卡片（`.grid > .card`）、方案欄、數字卡；方案 5 欄（`.options.compact`）例外。功能格、指標拼貼這類每格只有一兩行的不算，由字數管 |
| 清單 | **8 項** | 每一組清單、目錄、議程、步驟 |
| 說明條 | **2 個** | `.callout` |

**超過了，建議的處理順序**
1. 先縮說法：去掉重複、贅字。
2. 換省高度的元件（卡片 → 表格、清單 `.is-2col`、狀態磚 → chips）。
3. 照論點拆成兩頁（例如「發現」和「建議」各一頁），不要照版面硬切成「上半頁、下半頁」。表格列數太多就照論點分成兩張表。
4. 還是要放在同一頁：加 `data-dense="原因"`，或縮字（照「字級」那三條）。

**重做舊簡報（Victor 經手的重做案）另外照這幾條**（Victor 明令，2026-11-16）：
- 只優化設計，不改內容：原稿的文字、數字、例子、說明都要留著，只能縮說法（去掉重複、贅字），要刪資訊先問 Victor。
- 只有照上面的數字量過、真的超過才拆頁；「範本沒有剛好的版型」「排版放不下」「想讓每頁比較空」都不是拆頁的理由。
- 交付前逐頁跟原稿對照（可跑 `python3 slides/tools-audit-redo.py 原稿.html 新稿.html 結果.json`，會列出新頁對應的原稿頁、原稿每頁字數、新稿找不到的句子、新稿對應頁少掉的 logo 和圖；改寫過的句子要人工看）。拆頁和縮短的說法都要在交付時列出來。

**拆頁後太空**（2026-11-13 加）：拆完的頁內容很少，內容區空出一大塊（標題下和內容下方沒用到的高度合計超過內容區約四成），不要讓它空著，照順序處理：
1. **換版型**，用會撐滿高度的版型，內容不變：
   - 三張卡片 → 卡片裡的關鍵數字拉成 `.card-kpi`，或卡片加清單拉高，或階梯（示範第 89 頁）
   - 一兩個大數字 → 超大數字＋點陣（第 24 頁）或摘要大字＋一排數字（第 16 頁）
   - 短清單、兩三句說明 → 畫面塊＋文字（第 17、47 頁）
   - 換版型時可以加一句把這頁重點串起來的摘要（例如畫面塊旁的大字），但不能加新資訊。
2. **合併**：跟相鄰、講同一件事的頁合起來，合併後不要超過目標上限。
3. 都不適合，由做 deck 的人決定留著或改內容；不確定視覺怎麼處理再問 Victor。

不要用放大字級、拉大間距、加無關的圖來硬撐。

**不用每頁都撐滿**：卡片內容少（只有數字加一兩行）時，卡片不要硬拉到滿版，跟標題之間留一段呼吸空間反而好看（示範第 21 頁：卡片拉高到約內容區六成，`.stats.is-big.is-tall`，整頁加 `.is-bottom` 靠底線）。只有空到超過四成才算太空。

**自動檢查**：`slides.js` 會在每一頁載入時量上面這幾項。按 `O` 進總覽，超過的頁縮圖左上角會出現紅色標記，寫著哪一項超過；有 `data-dense` 的頁改成黃色標記；有 `data-appendix` 的頁不檢查。內容超出底線的頁也標紅（「內容超出底線」）。瀏覽器 console 也會列出來。太空的頁（內容區沒用到的高度超過四成）標藍色「太空」，處理方式見上面「拆頁後太空」。標記只在總覽出現，投影和 PDF 不會印出來。

## 版面 v2（2026-11-13，依兩份參考簡報重訂）

- **頁首列**：左上頁名、右上 logo。封面、章節頁、結尾不放。不放頁碼。標記仍寫 `<footer class="slide-foot">`，CSS 會把它放到上方；深底頁自動換白字 logo。
- **頁底品牌列**（2026-11-17，Wayne 要求、Victor 定版）：左下公司 slogan「Bringing intelligence into every workspace」、右下 ANIWEAVE logo，**每一頁都有**，`slides.js` 自動加，不用寫標記。
  - 位置：離底 64（`--deck-brand-bottom`，品牌列約 1000–1016）、左右 80；slogan 基線和 logo 底切齊。slogan 用 `--deck-fs-small` 20、`--s-muted`；logo 字高＝頁首 ANIMA logo 的字高（15.7）。
  - **不放的頁**：那一頁 `<section>` 加 `data-brand="off"`；整份都不放就加在 `<main class="deck">`。只有 Victor 或使用者說不用放才關。關掉的頁內容底線改到 1000（離底 80，`--deck-pad-bottom`）。
  - **手機封面（`.cover-phone`）例外**：手機延伸到底會壓到右下 logo，所以 ANIWEAVE logo 改放在 slogan 左邊（大小不變），中間隔 `--deck-space-3` 24，整組在左下。其他頁 ANIWEAVE 都在右下。
  - 換頁時不動（每頁都一樣）。深底、章節色帶、滿版圖頁自動換官方白字版（`ANIWEAVE_textlogo_primary_dark.svg`），白底用深字版（`ANIWEAVE_textlogo_primary.svg`）。
  - slogan 照品牌規範逐字照用、句尾不加句號，不跟 ANIMA logo 組成 lockup。
- **字重**：標題、大字用 `--deck-fw-title`（比內文粗一點），大數字用 `--deck-fw-number`（bold），其他照「字重」表。
- **數字的中文單位**：中文字面比數字大，大數字裡的單位（個月、萬、家、天）用 `<small>` 包起來，縮成 0.5 倍（最小不低於 caption）：`<span class="kpi-value">1<small>個月</small></span>`。
- **數字**：大數字用 `--deck-fs-number` 112，顏色 `--s-accent`（白底 Current 500、深底 Sky 300）。說明一行小字。
- **內容框**：整頁外框只有一個邊距 `--deck-pad-x` 80：左、右、頁首列到頂、頁底品牌列到底都一樣。標題頂線固定在 `--deck-pad-top` 144，內容底線在 968（`--deck-pad-end`，內容區高 824）。每一頁的內容都落在這個框裡：
  - 標題永遠在頂線，不垂直置中（封面、章節頁、主張頁、引言、結尾例外）。
  - 內容接在標題下方往下排（2026-11-20 改，Wayne 提、Victor 同意：原本整組靠底線，中等份量的頁標題下會空一大塊，內容太多時還會往上壓到標題）。放不下時往下超出底線，總覽標紅「內容超出底線」，不會壓到標題。
  - 內容少、刻意留白的頁（只有一排數字卡、一個大數字＋小圖）在 `<section class="slide is-bottom">` 加 `.is-bottom`，整組靠底線放，跟標題之間留一段呼吸空間。範本第 21、31、60 頁是這種。
  - 有底色的框四邊同一個內距（`--deck-card-pad` 40；流程節點、對話泡泡 24）。框照內容高度，不撐出空白；標題和大數字用 `text-box` 裁掉上下行距，字的頂和底才會切齊內距。
  - 卡片裡的內容從上往下排（靠上）。只有方案欄（`.option`）例外：最後的清單、說明壓在卡底，同一排方案的底部才對齊。
- **字的間距**：每組內容最外側的字裁掉行距，讓字的頂和底切齊框、線、頁面邊界；組內的字一定留距離，數值見下面「對齊與間距」。多行內文行高 1.6。
- **主張頁**：文字置中，一句一行（用 `<br>` 斷開），不加裝飾。**引言頁**：文字置中，一個大的淡色引號墊在文字後面。
- **預設封面**是 `.cover-phone` 配品牌流動玻璃背景（`.cover-bg.flow-06`，示範第 2 頁）；其他封面是備選：滿版流動玻璃（`.cover.ground-flow`）、畫面塊＋標題、自己的底圖＋手機、深色玻璃＋手機。
- **封面＋手機** `.cover-phone`：背景鋪滿、手機在右邊往下超出頁面、文字在左。背景三選一：`.cover-bg` 放自己的底圖（圖案太滿加 `.is-faded`）、`.cover-bg.flow-NN` 品牌流動玻璃、整頁 `.ground-dark` 深色玻璃。手機圖用 JPG，圓角由 CSS 裁。
- **預設全部白底（Victor 決定，2026-11-16）**：做簡報一律用白底，Victor 明講要深色才開深底。`data-dark` 沒寫就是 `off`。
- **sales deck 預設漸層底（Wayne 決定，2026-11-17）**：業務簡報（sales deck、客戶提案）在 `<main class="deck">` 寫 `data-dark="ambient"`，內容頁全部用淡漸層底（`.ground-ambient`）。漸層底上的淺色塊（ANIMA 步驟、人員處理、完成、缺口、圖例色塊、chip、灰標籤、說明條 `.callout`）會自動換深一階（Sky／Warning／Success／Error／Depth 100），灰底的流程節點、卡片改白底，不用自己調。
- **深底頁**（Victor 要求時才用）：深底（Depth 900）大約三分之一，放在想讓人停下來的頁（目錄、重點數字、做法、見證）。深底上的卡片用 `--deck-card-bg-dark`（Depth 800）。
- **深色頁開關**：寫在 `<main class="deck" data-dark="…">`，整份一起切換，印 PDF 也照這個設定：
  - `all`：照每頁設的底色（深底頁變深）。
  - `sections`：只留章節頁和 logo 結尾頁是深底，其他深底頁自動換成白底版本。
  - `off`（預設）：真的全白。深底、淡漸層、Sky、Sand、灰底的頁都換成白底；只有流動玻璃圖片頁（`.ground-flow`）不動。
  - `ambient`：全部淡漸層。白底、深底、淺色底的頁都換成 `.ground-ambient`（白 → Sky 50 → Sand 50）；只有流動玻璃圖片頁不動。給偏好不要全白的人用。
  - 投影時右下角有「深色頁」按鈕可以循環預覽；網址加 `?dark=off` 也可以臨時切換。
  - 每一頁的版型都同時有深、白兩種樣子，切換時卡片、圖表、畫面塊、logo 會自動換色，不用改內容。
- **亮點卡** `.is-highlight`：實心 Current 500 ＋白字，一頁最多一張，標這頁最重要的一項。`.option.is-featured`、`.compare-col.after` 自動套用。深色面板不再加光暈。
- **畫面塊** `.art` ＋ `.flow-NN`：流動玻璃裁成圓角矩形放進版面；深底頁自動轉深色版。`.is-band` 是橫條、`.is-fill` 撐滿格子。
- **標題右側說明** `.slide-head.split`：標題左、兩三行說明靠右上。
- **標題可以挑字上色**（2026-11-13 照參考簡報開放）：用 `<span class="accent">` 包住一個詞組，一個標題最多一處，挑這頁的重點（數字、結果、對比裡要強調的那一半）。顏色只用主色（白底 Current 500、深底 Sky 300），不加粗、不換字級。不是每頁都要，整份大約三分之一以內；主張頁、摘要大字（`.summary`）也適用。示範見第 16、20、26、27、32、35、58、80、84、93 頁。
- **所有版型**：每頁右下角有按鈕（列印時不出現），點了看全部縮圖，點縮圖跳過去；也可以按 O。

## 對齊與間距（2026-11-13 逐頁校正後定下來的）

所有距離都量「看得到的字」：字用 `text-box: trim-both text` 裁掉行距，量的是中文字墨跡的頂到底（2026-11-13 改：原本裁到英文 cap，中文字會比框高出約 0.135em，圖文並排時字頂比圖頂高）。做法是把 Nunito Sans 的 ascent／descent 設成中文字墨跡的 84%／8.3%；純英文、數字的元素（大數字、價格、編號、英文標籤）由 `slides.js` 自動改回 `cap alphabetic`，所以不用自己判斷。CSS 裡寫裁切時一律寫 `text`，編號偽元素（`::before`）JS 改不到，要自己寫 `cap alphabetic`。內容放不下時，表格加 `.table.is-dense`、泳道圖加 `.lanes.is-dense`、架構矩陣加 `.arch.is-dense`、方案欄加 `.options.compact`。改版型時用同一套數字，不要靠行高猜。

**層級：越裡面越小**
- 內距：外框 80 → 卡片、深色面板、對照欄、數字卡 40（`--deck-card-pad`）→ 流程節點、對話泡泡、放射項目 24 → 最小的區塊（roadmap 頂端方塊）16。新增有底色的框，照它在第幾層挑一個，不要自己訂數字。
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
- 外框 80：左、右，頁首列和封面 logo 到頂都是 80；頁底品牌列到底 64。封面 logo 貼左上角（80／80）。
- 頁首列頂到標題頂線 64：標題頂線 144。內容底線 968，到頁底品牌列頂 32。內容接在標題下方；刻意留白的頁加 `.is-bottom` 靠底線。

**標題＋副標（全 deck 同一套）**
- 小標題（26 以下）接副標或清單：**16**。
- 大標題（30 以上：卡片標題、feature、KPI 標籤、編號說明、橫向里程碑）接副標或清單：**28**。
- 卡片頂端的 chip 列、階段卡的編號圓，到標題也是 **28**，跟標題到內文一樣。
- 外層 flex／grid 自帶 gap 的，CSS 用 `--pair-g` 扣掉，避免 gap 和 margin 疊加。新增容器時要記得設。
- 只套在上下堆疊的組合；左右並排的（案例列「背景／卡點」、架構層名稱和 chip）不吃這個間距，頂端對齊。
- label 接大數字（儀表板）不算標題＋副標，維持原本間距。

**其他固定間距**
- 頁標題接引言（lede）：**16**（`.slide-head` 的 gap）。
- 頁首（標題、引言）接內容：**40**（`--deck-head-gap`）。
- 大數字、價格接下面的說明：**16**。
- 一組數字接下一組（直排的 KPI、案例結果）：**32**。

**分隔線列**（對照欄、資料盤點、部署選項）
- 每列上下 padding **24**，最後一列如果有底線也留 24。
- 對照欄（`.compare-col`）有底色，欄框四邊同一個內距 `--deck-card-pad` 40：欄標題上方、最後一列下方、左右都一樣，不用列的 24 代替。
- 小標題 26 semibold 深色，副標 24 muted。
- 欄標題下方第一條線用深一階的線色（`--s-line-strong`），跟 card-head 一致。

**清單**
- 每一項都裁成一樣。勾勾的中心對齊第一行字的中線（中文 .4615em，純英文 .5cap）；圓點、方框約 .36em。
- 一般清單項目間距 32；勾選方框清單（雙方準備）48；編號說明（截圖標註）48。

**同一排等高**
- 同一排的卡片、方案欄、比例對照、資料轉換前後一律等高。
- 卡片內距四邊一樣；roadmap 方塊到左右兩條泳道線都是 16。

**置中與對稱**
- 箭頭（＞）用視覺中心對齊，不是外框中心：往左補半個箭頭寬。
- 里程碑的點到上面日期、到下面標題等距（40），虛線穿過點的中心。日期用內文 26、標題 30：標題比日期重要，日期不能比標題大。
- 頭像列（團隊）置中；其他人物介紹靠左。

## 顏色的例外規則

- **亮點卡（藍底）裡**：chip、編號圓一律白底藍字。灰卡裡的 chip 用 Sky 100、狀態標籤用 100 階，這兩條都不能套到藍底上。
- **深底上的圖表**：Current 500 對比不夠，系列色換成 Sky 300、Current 300、Ripple 300、Depth 300、Sky 100、Depth 500；長條裡的字換深色。亮點卡和編號圓（實心色塊＋白字）維持 Current 500。
- **氛圍漸層底** `ground-ambient`：用在內容少、想要停一下的頁（議程、KPI、公司概要、大數字、結尾）。表格、甘特、泳道、矩陣、儀表板這類細線多的頁維持白底。

## 字重（4 階）

| token | 值 | 用在 |
|---|---|---|
| `--deck-fw-regular` | 400 | 內文 |
| `--deck-fw-medium` | 500 | 頁標題、display、主張頁大字、摘要大字（`--deck-fw-title`）；卡片標題、表頭、方案名、數字下面的標籤 |
| `--deck-fw-semibold` | 600 | 表格第一欄、清單裡的粗體詞、小標籤、引言、封面客戶名 |
| `--deck-fw-bold` | 700 | 大數字（`--deck-fw-number`：KPI、價格、比例、章節編號、流程大編號）；小地方的強調：我方欄表頭、圖表數值、說明條標題、流程編號、里程碑 |

**標題用 `--deck-fw-title`、大數字用 `--deck-fw-number`**（2026-11-17 Victor 定，回應 sales 的回饋）：標題用 medium（比內文粗一點），大數字用 bold。其他地方照上表。

數值是**看起來的粗細**。Nunito Sans 同數值比思源黑體輕一階，拉丁字要不要 +100 由使用端換算（`slides.css` 已經換好）。

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
| 深色面板 | Depth 900 底、圓角 12（跟卡片同一層）、內距 40（`--deck-card-pad`，跟卡片一樣），不加光暈。一頁最多一塊，用在 ANIMA 方案或重點結論。要換成液態玻璃底，加 `.panel-flow` ＋ `.flow-NN`（見「液態玻璃」）。`--deck-panel-dark-pad`（56）、`--deck-panel-dark-glow` 這兩個 token 版型不再使用。 |
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

## 素材與動畫（跟官網同一套，2026-11-16）

簡報裡的每個素材都從 ANIMA Web DS 來，不自己畫、不找網路圖，這樣每次做出來的風格都跟官網一致。

| 素材 | 放在哪 | 怎麼用 | 來源（Web DS 改了要同步） |
|---|---|---|---|
| Icon | `anima-brand/assets/icons/ui`、`domain` | `.ico ico-名稱`，見「Icon」 | `anima-web/design-system/assets/icons/` |
| 工具 logo（LINE、Slack、Gmail…，233 個；去白底版 `tools-plain` 另含 copilot） | `anima-brand/assets/logos/tools` | `<img src="…/logos/tools/名稱.svg">`；深底用 `名稱-dark.svg` | `anima-web/design-system/assets/logos/tools/` |
| AI 助理 logo（Claude、OpenAI、Grok 文字標） | `anima-brand/assets/logos/assistants` | 同工具 logo；深底用 `名稱-dark.svg` | `anima-web/design-system/assets/logos/assistants/` |
| AI 標誌 icon（Claude、ChatGPT、Grok） | `anima-brand/assets/icons/ai` | `<img class="logo" src="…/icons/ai/名稱.svg">` | `anima-web/design-system/assets/icons/ai/` |
| 流動玻璃圖 | `anima-brand/assets/backgrounds/flow` | `.flow-01`～`.flow-13` | `anima-web/design-system/assets/images/flow/` |
| ANIMA logo | `anima-brand/assets/logo` | 頁首、封面、結尾自動處理 | 品牌 repo 本身 |
| 動畫 | `slides.js` 的「官網動畫」 | `<div class="art flow-NN story" data-story="名稱">` | `anima-web/index.html` 的 Story 區程式動畫 |

- **重做舊簡報時不改內容**：只換成這套版型與視覺，文字、數字、圖的構圖都照原本那頁。原本有一張圖，就照那張圖做動畫（例如 `tools` 就是舊 sales deck 第 2 頁的圖）；不要換成官網另一段內容不同的動畫。放動畫前先對照：動畫裡出現的東西，原本那頁都要有。
- **原稿的 logo 和圖一張都不能少（2026-11-16，Victor 明令）**：舊稿裡出現的工具 logo（LINE、Slack、Sheets…）、AI 產品 logo（比較表表頭）、客戶與合作夥伴 logo、截圖、示意圖，重做後都要在對應的頁上。字留下來、logo 拿掉也算漏。
  - 素材順序：Web DS 有的用 Web DS（`anima-brand/assets/logos/tools`、`partners`）；Web DS 沒有的，用舊稿自己的素材檔（舊 sales deck 的在 `~/Downloads/from-wc/assets`，複製到 `redo/assets/old/`）；兩邊都找不到才問 Victor。
  - 放法：字前面 `<img class="logo">`（表頭、清單標題、資料來源、流程節點都可用）；logo 本身就是名字時（例：比較表的 ANIMA 欄頭用 `ANIMA_horizontal_primary.svg`）只放 logo、不重複寫字，加 `.is-wordmark` 讓它照字高；chip 裡直接放 `<img>` 就是 logo＋文字的標籤（`<span class="chip"><img src="…/tools-plain/line.svg" alt="">LINE</span>`，工具卡片、流程頁列工具用這個）；一排 logo 用 `.logo-row`（卡片底部的小 logo 加 `.is-sm`）；logo 牆數量多用 `.logos.is-sm`（一排 5 格）；原稿一張圖的內容比 DS 元件多、拆不出來時，整張放回去用 `.figure-full`，不要自己重畫成少了東西的圖。
  - 交付前跑 `tools-audit-redo.py`，最後一段「圖片」要顯示「圖片全部對上」；有缺要寫進交付說明並問 Victor。
- **logo 不加白底（2026-11-16，Victor 明令）**：除非 Victor 說要，logo 一律直接放在底色上，不墊白色方塊。Web DS 的工具與合作夥伴 logo 檔案內建白底，簡報一律用去白底版 `anima-brand/assets/logos/tools-plain/`、`partners-plain/`（由 `tools/`、`partners/` 拿掉白色 rect 產生，Web DS 更新後要重產）；舊稿的 png 有白底要先去背。
- **同一頁的 logo 大小視覺要一致**：`slides.js` 會自動把 chip、`img.logo`、`.logo-row`、`.logo-cell` 裡的 logo 裁到實際圖案範圍，再依寬高比換算大小（圖示等高、橫式文字 logo 接近等面積），所以檔案留白不同也會一樣大。一排都是公司或計畫的文字 logo 時用 `.logo-row.is-wordmark`（基準較大）。流程節點的 logo 放在編號旁 `<span class="node-top">編號＋logo</span>`，不要塞進標題擠到換行。交付前逐頁截圖看：同一頁的 logo 有沒有一顆特別大、特別小、特別淡。
  - 字前面的 `img.logo` 由 `slides.js` 量旁邊第一個字的中線，自動算 vertical-align 讓圖跟字中線對齊；不要手動寫 vertical-align。交付前放大看表頭、清單標題、資料來源列，圖跟字要在同一條中線上。
  - 自動校正要讀圖片像素，只在 http 開啟時有效（`file://` 讀不到，會照原檔大小）。輸出 PDF 一律從 `http://127.0.0.1:8766/…` 印。
- **動畫一律從官網程式碼移植**，時間軸、彈簧曲線、尺寸、顏色照抄，不另外設計。目前有：
  - `context`：從分散資訊到完整脈絡（官網首頁 Story 3）。六個工具散在四周 → 拉線接到 ANIMA → 收成一張「會議前重點」，工具飛進每一行變成來源標記。
  - `tools`：工具原樣不動（舊 sales deck 第 2 頁的圖）。深色 ANIMA 條在上、六張工具卡在下，用官網的彈簧與浮現依序出現、拉線，停格時小點沿線從工具流向 ANIMA。
- 要用官網其他動畫（例如 Story 1「主動完成」、Story 2「團隊共用」）時，先在 `anima-web/index.html` 找到那段 `Story…Scene`，照 `context` 的寫法移植成 `SCENES.名稱`，不要憑截圖重畫。
- **底圖**：照畫面塊原本的流動玻璃，只加模糊（`.story` 自動加，跟官網 `SHIFT_BLUR` 同樣比例），不換圖、不加色塊。
- 只有投影到那一頁才播；總覽、印 PDF、系統「減少動態效果」時停在最後一格（完整畫面）。
- 找不到合適的官網素材時，留空並先問 Victor，不要自己畫替代品。

## 換頁與進場（照官網 MOTION.md，2026-11-16）

動態一律跟官網同一套（`anima-web/design-system/MOTION.md`），`slides.css`、`slides.js` 已經內建，做簡報不用另外寫。

| 項目 | 規格 |
|---|---|
| 換頁：背景 | 背景（底色、底圖、流動玻璃）不消失：新頁疊在舊頁上 600ms 溶接過去，曲線緩起緩停 `cubic-bezier(.45,0,.2,1)`（Victor 明令：背景要有融合感，不要整個不見再出現） |
| 換頁：內容 | 舊頁內容淡出＋6px 模糊 200ms，接著新頁內容從 6px 模糊淡入 400ms，曲線用官網 `--ease-swap`（`cubic-bezier(.22,.7,.2,1)`）。內容不重疊（兩頁的字溶接會疊字） |
| 頁首列 | 前後兩頁一樣的部分固定不動、不做轉場：右上 logo（同一個檔、同樣式、同大小同位置）、左上頁名（同一段字、同字型顏色、同位置）。不一樣的（例：換章節頁名不同、白底換深底 logo 換版、換到沒有頁首的封面）才跟內容一起淡出淡入。`slides.js` 自動判斷 |
| 方向 | 不分前進後退，同一個效果；不滑動、不推頁、不翻轉、不縮放 |
| 頁內進場 | 淡入 500ms＋往上浮 600ms，曲線用官網 `--ease-nav-gentle`。文字上浮 16px，圖、畫面塊、玻璃框 24px |
| 順序 | 標題 0 → 副標、引言 90 → 主內容 180（卡片、清單、數字卡每個再錯開 110，第 6 個以後同時）→ 備註 320。換頁時整串再往後 200ms，等舊頁淡出完。順序由 `slides.js` 自動排，不用手寫 |
| 頁內動畫 | `.art.story` 等換頁和進場跑完（約 0.9 秒）才開始播 |
| 連按 | 上一次換頁 600ms 內又換頁，直接切到最後狀態，不播 |
| 不播的時候 | 總覽、印 PDF、系統「減少動態效果」、整份設 `<main class="deck" data-transition="none">`（正式場合、錄影） |
| 不要的效果 | 照官網否決清單：光暈、放大閃一下、飛入、逐行亮起、3D 翻頁、卡片浮起加陰影 |

## Icon（照 ANIMA Web DS，2026-11-16）

簡報裡的 icon 一律用 `anima-brand/assets/icons/` 這套，跟官網同一套（來源：`anima-web/design-system/assets/icons/`，Web DS 改了要同步過來）。**不要自己畫 SVG、不要用 emoji、不要用 ✓ ✕ △ 這類符號字。**

- **規格**：24×24 線條、1.5px 圓角筆畫，顏色跟著字（currentColor）。不填色、不漸層、不雙色、不加粗。
- **怎麼畫**：`slides.js` 把每個 `.ico`、比較表符號、打勾清單、流程箭頭換成內嵌 `<svg>`（CSS 遮罩印成 PDF 會在框邊留一條細線）。SVG 內嵌在 `slides.css` 的 `--icon-名稱`，所以 `file://` 開也看得到。Web DS 的 icon 同步到 `anima-brand/assets/icons/` 之後，跑 `python3 slides/tools-icons.py` 重產這段。
- **用法**：`<i class="ico ico-check"></i>`。大小預設 1em（跟字一樣大），要調用 `style="--ico-size: 32px"` 或 `font-size`。顏色用 `color`。
- **ui/（29 個）**：介面與狀態符號。狀態 `check` `check-circle` `warning` `sparkle` `clock` `bell` `mention` `task` `hourglass`；操作 `plus` `minus` `close` `chevron-left` `chevron-right` `chevron-down` `arrow-up` `arrow-right` `search` `fit-all` `fullscreen`；物件 `document` `chat` `help` `building` `calendar` `paperclip` `lock` `shield` `shield-check`。
- **domain/（29 個）**：業務領域，**一個領域只有一個 icon，內容提到那個領域就用它，不要拿相近的代替**：approval 簽核、audit-log 稽核紀錄、finance 財務、growth 成長、leadership 經營管理、legal 法務、marketing 行銷、procurement 採購、projects 專案管理、roles 權限管理、sales 業務銷售、support 客服、trading 貿易、travel 旅遊、anima ANIMA、admin 管理員、user 使用者、trial 實例試行、auto 自動執行、data-in-place 資料留在原處、sync 持續同步、hosted 託管服務、tools 可用工具、de-identify 去識別化、private-cloud 私有雲、on-premises 地端、operations 營運、learn 自主學習、shared-context 共享脈絡。
- **沒有適合的 icon**：位置留空，先問 Victor（新的要照同一個 24 格、1.5px 畫，加進 Web DS 再同步過來）。
- **已經換成這套的元件**（不用另外寫）：
  - 比較表、權限矩陣（`.check`／`.mark`）：有＝`check`（主色）、部分＝`minus`（主色）、沒有＝`close`（淡色）。圖例寫「打勾／橫線／叉」。
  - 打勾清單 `.list.checks`：`check`。
  - 流程卡、資料轉換、對照欄之間的箭頭：`chevron-right`。
  - 部署選項：雲端專用環境＝`hosted`、hybrid＝`de-identify`、完全地端＝`on-premises`。

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
| 玻璃面板 | `.panel-dark.panel-flow` ＋ `.flow-NN` | 深色面板的淺色版（照官網「四層架構」）：Sky 底＋流動玻璃、深色字、chip 改白底。版面跟深色面板一樣，一頁最多一塊 |

- 底圖 13 張在 `anima-brand/assets/backgrounds/flow/`，已轉成 JPG（PDF 不會拆圖）。每張都有一塊留白給文字，挑玻璃跟文字錯開的那張；`slides.css` 裡每張都註明玻璃在哪一側。
- token：`--deck-glass-bg`（白 32%）、`--deck-glass-ring`（白 70%）、`--deck-glass-backdrop`（blur 20px＋saturate 140%）、`--deck-glass-pad` 10px、`--deck-glass-shadow`、`--deck-stage-blur` 10px。
- 字多的頁要壓淡底圖，加 `.is-faint`。
- 玻璃是放圖和短標籤（標題、數字、chip）用的；清單、內文直接壓在玻璃上讀不清楚，要放在白色內層上。玻璃面板（`.panel-flow`）、玻璃框（`.glass`）裡直接放的 `.list`、`p` 會自動墊白色內層（`--deck-card-bg-alt`）。
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

`examples/layouts.html` 是 91 種版型的示範，照用途分成 11 類，每類前面有一張分類頁（共 102 頁，2026-11-17 重排）；三份舊簡報每一頁要用哪個版型，見 `examples/coverage.md`。每頁一種，複製需要的 `<section>` 改文字就好，不要另外寫樣式。

| 分類 | 分類頁 | 版型 | 內容 |
|---|---|---|---|
| 01 開頭 | 第 1 頁 | 第 2–9 頁 | 封面、目錄、議程 |
| 02 穿插 | 第 10 頁 | 第 11–18 頁 | 章節、主張、引言、見證、全版圖片 |
| 03 數字 | 第 19 頁 | 第 20–29 頁 | 大數字、KPI、點陣、儀表板 |
| 04 圖表 | 第 30 頁 | 第 31–40 頁 | 長條、直條、比例、曲線、甜甜圈 |
| 05 卡片與清單 | 第 41 頁 | 第 42–52 頁 | 卡片、功能格、編號清單、摘錄 |
| 06 圖文素材 | 第 53 頁 | 第 54–62 頁 | 圖文、截圖、對話、團隊、logo |
| 07 流程與架構 | 第 63 頁 | 第 64–77 頁 | 流程、泳道、前後對照、架構、調度中心 |
| 08 比較與表格 | 第 78 頁 | 第 79–85 頁 | 對照表、打勾比較、矩陣、定位 |
| 09 時程 | 第 86 頁 | 第 87–94 頁 | 甘特、里程碑、路線圖、時間軸 |
| 10 方案 | 第 95 頁 | 第 96–99 頁 | 方案、價格、部署選項 |
| 11 結尾 | 第 100 頁 | 第 101–102 頁 | 結尾頁、聯絡資訊 |

分類頁（`.is-divider`，整頁藍底）只是範本的目錄，不是版型：樣式寫在 `layouts.html` 自己的 `<style>`，不在 `slides.css`，也不跟底色模式切換；不要複製進 deck、不要當版型參考。

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
| `.hub.wide-core.orch` | 調度中心完整版（範本第 73 頁） | 中間面板加四格功能 `.orch-grid`、排先後清單 `.orch-queue`；右邊分組交辦 `.hub-item.is-group`。sales deck「接下來」頁用這個，不用 `orchestrator-sales.png` |
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
| `.numbers-chart` ＋ `.chart-block` ＋ `.kpis.is-inline` | 左長條圖、右三個大數字（示範第 27 頁） | 問題的數字、延誤集中在哪 |
| `.slide-head.head-kpi` ＋ `.columns.is-wide` | 標題右邊一個大數字、下面整排長條（第 28 頁） | 漏斗、成長、逐期比較 |
| `.summary` ＋ `.kpis` | 摘要大字＋一排大數字（第 16 頁，`.summary-body`） | 開場摘要、一句話結論 |
| `.media-split` ＋ `.media-text` ＋ `.art` | 畫面塊＋文字（第 17、47 頁；`.is-flip` 左右對調） | 使命願景、功能總覽、做法 |
| `.media-split` ＋ `.media-text` ＋ `.art.story` | 文字＋動畫（sales deck 第 2 頁用 `tools`，加 `.is-wide-media` 讓圖那欄寬一點：文字 5、圖 7）：畫面塊原樣加模糊，上面播官網首頁的程式動畫，見「素材與動畫」 | 一句主張配一段示範，取代另開一頁放示意圖 |
| `.numgrid`（`.is-big`） | 編號 2×2，編號在標題上方（第 47 頁） | 四個功能、四個理由 |
| `.big-claim` ＋ `.dots.is-wide` | 超大數字＋說明，寬點陣鋪滿下方（第 24 頁） | 一個比例撐一整頁 |
| `.tallcards` ＋ `.tallcards-side` | 高卡、數字壓卡底，右邊放標題（第 48 頁） | 競品、替代方案 |
| `.quad` ＋ `.quad-cell` | 定位四象限，自家那格 `.is-highlight`（第 84 頁） | 市場定位 |
| `.donuts` ＋ `.donut-item` | 小甜甜圈 2×2，旁邊放金額（第 37 頁） | 資金用途、比例拆分 |
| `.table.is-checks` ＋ `.check.is-yes／is-part／is-no` | 打勾比較表（第 80 頁），圖示取代文字標籤 | 能力比較 |
| `.track` | 上下交錯時間軸，`.is-next` 是還沒到的點（第 93 頁） | 里程碑、歷程 |
| `.titlecols` ＋ `.tally` | 名稱欄：幾項就幾欄、不放卡片，名稱 44 是主角、工具列（`.chips.is-plain`）壓欄底；下面一條小計（第 51 頁）。4 欄時名稱縮成 36 | workflow、方案、產品線總覽 |
| `.sources` ＋ `.rank-list`（`.rank-head`、`.rank-top`、`.rank-row`） | 左：大標題（`.title.is-xl`）＋來源清單（logo｜名稱｜一句）；右：排序清單，第一名一張亮點卡、右邊「今天要做的事」（第 52 頁） | 案例：從哪些訊號排出優先順序 |
| `.relay` ＋ `.relay-step`／`.relay-ai` | 接力步驟：人做的步驟（`.node-num.is-human`、字小一級）夾著 ANIMA 做的步驟（一張亮點卡，右邊直式 logo，卡裡的工具 logo 用 `-dark` 版）；左欄同第 52 頁（第 77 頁） | 案例：一件事從人到 ANIMA 再回到人 |
| `.split-3` ＋ `.card.is-ruled` | 圖表＋洞察＋下一步：前兩欄不放底色（上方一條線），最後一欄亮點卡放直向步驟；長條圖放窄欄也看得出長短（第 40 頁） | 從數字講到原因和行動 |
| `.option-axis`（`.option-axis-head`、`.option-axis-tag`） | 選項軸：幾個選項排成一條軸（圓點＋線），下面一列一個面向，列名只寫一次；下面可接 `.features.is-stacked.is-sm`（標題 30、說明 24）（第 99 頁） | 部署方式、方案差異 |
| `.strip` ＋ `.grid.cols-3 > .card.is-ruled` ＋ `.callout.is-row` | 一條橫列（別家 logo＋共同能力標籤＋一句說明）、下面三欄差異（卡片標題前 `.num` 編號，chip 去膠囊），最後一條橫排說明條（第 86 頁）。標籤裡的勾用 `<i class="ico ico-check">`，不打「✓」 | 競爭定位：先承認大家都有，再講差在哪 |
| `.team-sheet` ＋ `.logo-row.is-spread`／`.is-grid` ＋ `.milestones.vertical.is-compact` ＋ `.list.checks.is-circle` | 團隊與公司現況：左邊人物（`.person-name.is-lg` 44）、經歷 logo 一排撐滿、團隊組成、亮點、成員 logo 格子；右邊一張卡放精簡時間軸（日期小字在上、實線空心點）和入選計畫（第 62 頁）。深底 logo 用 `team-plain`／`partners-plain` 的 `-dark` 白色版，`.logo-on-light`／`.logo-on-dark` 成對放，不加濾鏡 | 公司介紹、募資的團隊頁 |
| `.fanout` ＋ `.fanout-bar`／`.fanout-items`／`.fanout-groups` | 一對多：上面一條亮點卡（主角），往下連到一排工具，底下標分組（第 76 頁；欄數 `--cols`、分組寬 `--span`）。文字欄配 `.lead-text`（36）＋`.lead-text.is-accent` | 產品接在既有工具上、一個平台串多個來源 |

**撐滿高度用的變化**（2026-11-16，處理「太空」頁時加的；內容少的卡片拉到約內容區六成高，跟標題留呼吸空間，不要硬撐到滿版）

| class | 做法 | 示範 |
|---|---|---|
| `.agenda.is-big`（`--rows`） | 議程、目錄：大編號在標題上方，每項上方一條線，平均撐滿 | 範本第 8、9 頁 |
| `.card-kpi` | 卡片標題下面放一個大數字，把卡片裡原本就有的關鍵數字拉出來 | jingdu 第 2、4、12、27 頁 |
| `.kpis.is-before-after` | 每個大數字上方一組「原本／導入後」直條 | 範本第 20 頁 |
| `.stats.is-big.is-tall`（`.is-accent` 數字改主色） | 數字卡拉高，數字在上、標籤壓卡底 | 範本第 21 頁、jingdu 第 17 頁 |
| `.calc-row` | 數字卡底部一排「規則／推算／實際」三格 | jingdu 第 17 頁 |
| `.flow.is-tall` | 流程卡拉高，大編號在上、標題和說明壓卡底；最後的標籤移到右上角 | 範本第 64 頁 |
| `.bars-split` | 橫條圖裡最大的一項拉成左邊大數字，橫條加粗 | 範本第 31 頁 |
| `.status-tiles` ＋ `.shares`（`--cols-tpl`） | 一個工項一格燈號，下面的數字照格數分欄對齊 | 範本第 33 頁 |
| `.transform.is-tall` ＋ `.map` | 資料轉換卡拉高加大編號；`.map` 是「原文 → 代號」對照表 | 範本第 69 頁 |
| `.logo-wall` | 左邊總數大數字，右邊客戶／產業格（沒有 logo 也用卡片底） | 範本第 60 頁 |
| `.split-3.is-tall` | 分工三欄拉高，欄標題放大在上、清單壓卡底 | 範本第 61 頁 |
| `.card > .card-text + .list` | 卡片說明接清單自動留 24（不用另外加 class） | 範本第 42 頁 |

其他：時間軸同一排的日期和標題統一照中文字頂切齊（範本第 90 頁）；時間軸上方可以加一條畫面塊 `.art.is-band` 填空白。

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

- v1.6（2026-11-20）：內容多一點空間：頁首到內容 64 → 40、標題接引言 40 → 16、內容底線 936 → 968、頁底品牌列離底 80 → 64（新 token `--deck-pad-end`、`--deck-brand-bottom`、`--deck-head-gap`；`data-brand="off"` 的頁底線維持 1000）。
- v1.5（2026-11-17，回應 sales 的 v1.4 回饋）：外框 96 → 80、標題頂線 192 → 144、內容底線 984 → 936（內容區高度不變）；每頁加頁底品牌列（slogan＋ANIWEAVE logo，`data-brand="off"` 可關）；字級改成管範圍（投影最小 20、附錄 16、只發 PDF 14；同頁相鄰兩級差 4px；一頁最多 4 級），token 當建議值，caption 下補 `small` 20／`micro` 16／`print` 14；標題字重 `--deck-fw-title`、大數字 `--deck-fw-number`（bold）；一頁的內容上限從硬性改成目標，由做 deck 的人決定怎麼縮、拆、用 `data-dense`，新增 `data-appendix`（附錄不檢查）；內文字數上限 200 → 250（副標不算），副標另訂 2 行、60 字；ANIWEAVE logo 換官方深字／白字版。
- v1.4（草稿）：新增狀態色階（success／warning／error）、`--deck-*` 簡報 token、這份文件、`slides.css`／`slides.js`／版型示範、Nunito Sans 靜態 TTF。
