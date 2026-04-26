# Get It Done — Design System v2

## Brand Vibe
**Bold & playful, but grown-up.** Confident, energetic, fun without being childish. The witty AI notifications carry the personality — the UI supports them with clean structure and a punchy hero color. Think: Linear meets Duolingo, leaning more Linear.

---

## Color Palette (Light Mode Only)

### Hero
- **Primary green** — `#10B981` — emerald-500. Used for: completed states, primary CTAs, FAB, accents. Sparingly. Don't drown in it.
- **Primary green hover/pressed** — `#059669` — emerald-600
- **Primary green soft** — `#D1FAE5` — emerald-100. Backgrounds for "completed" pill, success toasts.

### Neutrals (warm, not pure gray)
- **Background** — `#FAFAF9` — stone-50. App background.
- **Card / surface** — `#FFFFFF` — pure white for cards on background
- **Border subtle** — `#F5F5F4` — stone-100
- **Border** — `#E7E5E4` — stone-200
- **Text primary** — `#1C1917` — stone-900. Headings, todo titles.
- **Text secondary** — `#57534E` — stone-600. Subtitles, helper text.
- **Text tertiary** — `#A8A29E` — stone-400. Placeholders, timestamps.
- **Text disabled** — `#D6D3D1` — stone-300. Strikethrough on completed todos.

### Semantic
- **Destructive** — `#EF4444` — red-500. Delete actions only.
- **Warning** — `#F59E0B` — amber-500. Reserved for future use.

### Retire these
The current cream (`#FAF8F5`), iOS blue (`#007AFF`), iOS green (`#34C759`) — replace systematically.

---

## Typography

### Font Family
**SF Pro Rounded** — Apple's system rounded font. Free, native, friendly. Use Expo's built-in `Platform.select` to fall back to `'System'` on Android (until you ship Android).
```
fontFamily: Platform.OS === 'ios' ? 'SF Pro Rounded' : 'System'
```

iOS exposes weights via `fontWeight: '700'` etc.

### Weights
- 400 (Regular) — body
- 600 (Semibold) — todo titles, emphasis
- 700 (Bold) — buttons
- 800 (Heavy) — screen titles

### Type Scale
- **Display** — 34pt / 800 / -0.5 letter spacing — main screen title
- **Title** — 22pt / 700 — modal titles, section headers
- **Body large** — 17pt / 600 — todo titles
- **Body** — 15pt / 400 — descriptive text
- **Caption** — 13pt / 500 — metadata, labels
- **Micro** — 11pt / 600 / uppercase / +0.5 spacing — section labels

### Cleanup
Remove Raleway, Inter, Poppins, Montserrat from `useFonts()` in app entry. Faster app launch.

---

## Spacing System
**4pt grid.** Always use multiples of 4.
- 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

Common pairings:
- Card padding: 20 horizontal, 16 vertical
- Modal padding: 24 all around
- Screen padding: 20 horizontal
- Between items: 8 (tight) / 12 (normal) / 24 (sections)

---

## Border Radius
- **Small** (chips, badges) — 8
- **Medium** (cards, todo rows) — 14
- **Large** (modals, sheets) — 20
- **FAB** — fully circular (`width / 2`)
- **Buttons** — 12

---

## Shadows
Soft, single-layer. No harsh drop shadows.
```
// Card shadow
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.04,
shadowRadius: 8,
elevation: 2,

// FAB shadow (more pronounced — it floats)
shadowColor: '#10B981',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.25,
shadowRadius: 12,
elevation: 6,
```

---

## Iconography
Replace **all emoji** in UI chrome (🗑️, ✅, etc.) with **`@expo/vector-icons`** — specifically the `Ionicons` set (already iOS-flavored).

Mapping:
- Delete (🗑️) → `trash-outline`, 22pt, stone-400
- Check / complete → `checkmark`, white inside green circle
- Add → `add`, white inside green FAB
- Completed list → `checkmark-done-outline`
- Edit → `pencil-outline`
- Close modal → `close`, 24pt, stone-600

Emoji is **fine in user-generated content** (todo titles users type) — just not in app chrome.

---

## Component Specs

### Todo Row (highest priority — most-seen UI)
- White card, 14pt radius, soft shadow
- 16pt vertical padding, 20pt horizontal
- 12pt margin between rows
- Layout left-to-right: [checkbox circle] [16pt gap] [title, 17/600] [auto] [trash icon]
- **Incomplete:** stone-900 title, white card, stone-200 border (1pt)
- **Complete:** stone-300 title with strikethrough, emerald-100 left bar (4pt wide), stone-100 border
- Tap title → edit. Tap circle → toggle. Tap trash → confirm + delete.
- Press feedback: `Pressable` with subtle background tint on press (`#F5F5F4`)

### Checkbox Circle
- 26pt diameter
- **Empty:** 2pt stone-300 border, transparent fill
- **Checked:** emerald-500 fill, white checkmark inside, no border
- Existing animation stays — do not modify.

### FAB (the + button)
- 56pt circular
- emerald-500 background, white plus icon (28pt)
- Bottom-right, 24pt from screen edge, 24pt from bottom safe area
- Shadow as specified above

### "Completed" Button (bottom-left)
- Pill shape: ~52pt height, auto width, fully rounded
- White background, 1pt stone-200 border, soft shadow
- Inside: small checkmark-done icon (emerald-500) + count + "Done" label
- Bottom-left, 24pt from edges
- Tapping opens CompletedModal

### Add/Edit Modal
- Bottom sheet style instead of centered modal — more iOS-native
- 20pt top radius, drag handle bar at top (40pt × 4pt, stone-300, centered)
- Padded 24pt all around
- Title at top: "New task" or "Edit task"
- Text input: stone-100 background, 12pt radius, 16pt padding, 17pt body large font
- Two buttons stacked or side-by-side at bottom:
  - **Primary** (Add/Save): emerald-500 bg, white text, 700 weight, 14pt radius, 16pt vertical padding, full width
  - **Secondary** (Cancel): transparent bg, stone-600 text, 600 weight

### Completed Modal
- Full screen slide-up (already exists)
- Same color/typography refresh as above
- Section header micro-style: "COMPLETED" — 11pt / 600 / uppercase / stone-400
- Each row: stone-300 strikethrough title, smaller (15pt body), no card bg, just dividers

### Empty State
- Centered vertically in screen
- Icon: large `checkmark-done-circle-outline` 64pt in stone-200
- Title: "All clear ✨" — 22pt / 700 / stone-900
- Subtitle: "Add your first task to get started" — 15pt / 400 / stone-500
- 16pt gap between elements

### Screen Header (main TodoList)
- "Get It Done" title — 34pt / 800, stone-900
- Optional subtitle: today's date in stone-500, 15pt
- Top safe area padding + 8pt
- Left aligned, no centering

---

## What NOT to Touch
- Toggle animation in TodoItem (keep existing)
- Haptics (keep existing)
- Notification logic
- Cloudflare Worker
- Storage / AsyncStorage logic
- Routing

---

## Implementation Order (Highest Impact First)
1. **Global theme constants file** — create `constants/theme.ts` exporting colors/spacing/typography. Single source of truth.
2. **TodoItem.tsx** — most-seen component, biggest visual win
3. **TodoList.tsx screen** — header, layout, FAB, completed button
4. **AddTodoModal.tsx + EditTodoModal.tsx** — bottom sheet refresh
5. **CompletedModal.tsx** — section styling
6. **Empty state** (if not present, add it)
7. **Cleanup** — remove unused fonts (Inter, Poppins, Montserrat, Raleway), remove unused NativeWind config if not migrating

---

## Tech Notes
- All styling stays in `StyleSheet.create` (don't migrate to NativeWind in this pass)
- Use `Pressable` (not `TouchableOpacity`) for new pressables — better feedback control
- Use `expo-symbols` or `@expo/vector-icons` for icons — already installed
