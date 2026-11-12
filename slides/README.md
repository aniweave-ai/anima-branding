# ANIMA 簡報規範（Deck）v1.4

對外簡報（業務提案、產品介紹、合作夥伴、投資人）看得到的樣子都照這份走。值寫在 [`anima-brand/references/tokens.css`](../anima-brand/references/tokens.css) 的 `--deck-*` token，這份文件說明怎麼用。

## 怎麼接

| | sales deck | 其他簡報 |
|---|---|---|
| `tokens.css` | 直接讀 `--deck-*` 和色階 token | 直接讀 |
| `slides.css`（之後補） | 不引用，當示範頁對照版型 | 直接引用 class 和模板 |

- **只讀色階和 `--deck-*`。** 不要用 `--text-primary`、`--bg-card` 這類語意 token，它們在深色模式會換值。
- **不寫死顏色和字級。** 所有顏色、字級、圓角、間距都從 token 來；規範以外的值檢查工具會擋。
- **token 要改名或刪除，先通知 sales（Wayne）。** deck 正在用。改值不用通知，merge 進 main 就算發版。

## 畫布與縮放

- 規範以 **1920×1080** 為準。
- 所有尺寸 token 都乘上 `--deck-scale`。1920 畫布設 `1`；1440×810 畫布設 `0.75`，其他不用動。

```css
.deck { --deck-scale: 0.75; } /* 1440×810 的 deck 只要加這行 */
```

- 安全邊界：左右 `--deck-pad-x` 128、上 `--deck-pad-top` 112、下 `--deck-pad-bottom` 96。
- 間距只用 `--deck-space-1`～`7`：8／16／24／32／48／64／96。

## 字級（8 階，最小 24）

| token | 1920 | 1440 | 用在 | 行高 |
|---|---|---|---|---|
| `--deck-fs-display` | 120 | 90 | 封面主標、主張頁大字 | `--deck-lh-tight` 1.15 |
| `--deck-fs-number` | 96 | 72 | KPI 大數字 | `--deck-lh-tight` |
| `--deck-fs-title` | 64 | 48 | 每頁標題（一頁一個） | `--deck-lh-title` 1.3 |
| `--deck-fs-heading` | 44 | 33 | 區塊標題、卡片大標 | `--deck-lh-title` |
| `--deck-fs-subheading` | 36 | 27 | 副標、卡片標題 | `--deck-lh-title` |
| `--deck-fs-body-lg` | 30 | 22.5 | 重點內文、引言 | `--deck-lh-body` 1.6 |
| `--deck-fs-body` | 26 | 19.5 | 一般內文 | `--deck-lh-body` |
| `--deck-fs-caption` | 24 | 18 | 註解、標籤、chip、圖表軸、資料來源 | `--deck-lh-body` |

- **字放不下就刪字或拆頁，不要縮字。** 沒有比 caption 更小的字。
- 一頁最多用 4 個字級。

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
| `--deck-ground-dark` | Depth 900 | **只用在**章節頁、主張頁 |
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
| Chip | Sky 50 底、Sky 800 字、pill 圓角、caption 字級、medium 字重。用在分類、關鍵字、系統名稱。 |
| 狀態標籤 | 圓角 8，字用 `-text`（700）、底用 `-bg`（50），前面可加 `-mark`（600）小圓點。success＝自動／完成，warning＝待確認／部分，error＝風險／錯誤。 |
| 按鈕 | Current 500 底、白字、圓角 6、bold。一頁最多一顆。 |
| 說明條 | Sky 50 底、Depth 700 字、圓角 8。**不加左側色條**。 |
| 深色面板 | Depth 900 底＋`--deck-panel-dark-glow`（右上 Sky 光暈）、圓角 16、內距 56。一頁最多一塊，用在 ANIMA 方案或重點結論。 |
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

- 系列色依序取用 `--deck-chart-1`～`6`：Current 500、Sky 500、Ripple 700、Sky 800、Ripple 300、Depth 800。兩兩色差 ≥ 14（OKLab ×100）。
- 超過 6 組，把次要的併成「其他」，用 `--deck-chart-other`（Depth 200）。對照組、基準線也用它。
- 格線 `--deck-chart-grid`、軸與標籤 `--deck-chart-axis`，字級用 caption。
- 只有一組資料時用 chart-1；要強調其中一根，強調那根用 chart-1、其餘用 other。

## PDF

- 每一頁不靠動畫也要能完整讀懂，PDF 只會印出最後的狀態。
- 字型要嵌靜態 TTF（Chrome 會把可變字型嵌成 Type 3，LINE 檢視器會破字）。靜態 TTF 之後補進 `anima-brand/assets/fonts/`。
- 圖片用 JPG 或不透明 PNG；帶透明的 PNG 印成 PDF 會拆成兩張圖。

## Logo 與素材

- 檔名帶 `-dark` 的是給深色底用的**白色版**。
- 封面底圖、4A 頁 GIF 的規則照 sales 交接文件；新版素材之後補。

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

## 版本

- v1.4（草稿）：新增狀態色階（success／warning／error）、`--deck-*` 簡報 token、這份文件。
