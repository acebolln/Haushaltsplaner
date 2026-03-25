# Chat Interface Wireframes

## Mobile View (375px)

```
┌─────────────────────────────────────┐
│ ☰  Beleg-Chat           🗑️ ⚙️      │
│ Lade Belege hoch...                 │
├─────────────────────────────────────┤
│                                     │
│   ┌───────────────────────────┐    │
│   │ Willkommen! Lade einen    │    │
│   │ Beleg hoch...             │    │
│   └───────────────────────────┘    │
│                                     │
│                  ┌──────────────┐  │
│              🤖  │ Hallo! Wie   │  │
│                  │ kann ich dir │  │
│                  │ helfen?      │  │
│                  └──────────────┘  │
│                  10:23             │
│                                     │
│  ┌──────────────┐                  │
│  │ 📎 receipt.jpg│  👤              │
│  │ Analysieren   │                  │
│  └──────────────┘                  │
│  10:24         ✓                   │
│                                     │
│              🤖  ● ● ●              │
│                  [Typing...]        │
│                                     │
│                  ┌──────────────┐  │
│              🤖  │ Ich habe     │  │
│                  │ deinen Beleg │  │
│                  │ analysiert:  │  │
│                  └──────────────┘  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ⚡ Konfidenz: Hoch ●●●       │   │
│  ├─────────────────────────────┤   │
│  │ 🏪 Händler                  │   │
│  │    REWE                ✏️   │   │
│  │                             │   │
│  │ 📅 Datum                    │   │
│  │    15.03.2024          ✏️   │   │
│  │                             │   │
│  │ 💶 Betrag                   │   │
│  │    45,67 €             ✏️   │   │
│  │                             │   │
│  │ 🏷️ Kategorie                │   │
│  │    [Haushalt]          ✏️   │   │
│  │                             │   │
│  │ 💳 Zahlung                  │   │
│  │    [Karte]             ✏️   │   │
│  ├─────────────────────────────┤   │
│  │ [✓ Speichern] [✗ Verwerfen]│   │
│  └─────────────────────────────┘   │
│                                     │
│  [More messages scroll...]         │
│                                     │
├─────────────────────────────────────┤
│ 📎  [Nachricht...]          [↑]    │
│  Drag & Drop Zone                  │
└─────────────────────────────────────┘
```

## Desktop View (1280px)

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Beleg-Chat                                            🗑️ Clear   ⚙️       │
│  Lade Belege hoch und lass sie automatisch analysieren                    │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                    ┌─────────────────────────────────┐                    │
│                    │ ✓ Willkommen! Lade einen Beleg  │                    │
│                    │   hoch oder ziehe ihn hierher.  │                    │
│                    └─────────────────────────────────┘                    │
│                                                                            │
│     ┌────────────┐                                                        │
│  🤖 │ Hallo! Ich │                                                        │
│     │ bin dein   │                                                        │
│     │ Beleg-     │                                                        │
│     │ Assistent. │                                                        │
│     └────────────┘                                                        │
│     10:23                                                                 │
│                                                                            │
│                                                ┌──────────────────┐  👤   │
│                                                │ 📎 receipt.jpg   │       │
│                                                │                  │       │
│                                                │ [Image Preview]  │       │
│                                                │                  │       │
│                                                │ Beleg analysieren│       │
│                                                └──────────────────┘       │
│                                                                   ✓ 10:24 │
│                                                                            │
│     ┌────────────┐                                                        │
│  🤖 │ Analysiere │                                                        │
│     │ Beleg...   │                                                        │
│     └────────────┘                                                        │
│     [● ● ●]                                                               │
│                                                                            │
│     ┌──────────────────────────────────────┐                             │
│  🤖 │ Ich habe deinen Beleg analysiert.    │                             │
│     │ Hier sind die extrahierten Daten:    │                             │
│     │                                       │                             │
│     │ Prüfe die Angaben und korrigiere sie │                             │
│     │ falls nötig. Wenn alles passt,       │                             │
│     │ klicke auf "Speichern".               │                             │
│     └──────────────────────────────────────┘                             │
│     10:24                                                                 │
│                                                                            │
│     ┌──────────────────────────────────────────────────────────┐         │
│     │  ⚡ Konfidenz: Hoch ●●●                                  │         │
│     ├──────────────────────────────────────────────────────────┤         │
│     │  🏪 Händler              │  📅 Datum                     │         │
│     │     REWE            ✏️   │     15.03.2024          ✏️   │         │
│     │                          │                               │         │
│     │  💶 Betrag               │  🏷️ Kategorie                 │         │
│     │     45,67 €         ✏️   │     [Haushalt Badge]    ✏️   │         │
│     │                          │                               │         │
│     │  💳 Zahlung              │                               │         │
│     │     [Karte Badge]   ✏️   │                               │         │
│     ├──────────────────────────────────────────────────────────┤         │
│     │           [✓ Speichern]        [✗ Verwerfen]             │         │
│     └──────────────────────────────────────────────────────────┘         │
│                                                                            │
│                                                  ┌──────────┐  👤         │
│                                                  │ Speichern│             │
│                                                  └──────────┘             │
│                                                           ✓ 10:25         │
│                                                                            │
│     ┌────────────────┐                                                    │
│  🤖 │ ✓ Beleg wurde  │                                                    │
│     │   gespeichert! │                                                    │
│     └────────────────┘                                                    │
│                                                                            │
│                                                                            │
│                                                                            │
│                      [Scroll to see more messages ↑]                      │
│                                                                            │
├───────────────────────────────────────────────────────────────────────────┤
│  📎   ┌────────────────────────────────────────────────────────┐   [↑]   │
│       │ Nachricht eingeben... (Enter to send, Shift+Enter new  │   Send  │
│       │ line)                                                  │         │
│       └────────────────────────────────────────────────────────┘         │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  Drag & Drop Overlay (when dragging file)                           │ │
│  │  ┌───────────────────────────────────────────────────────┐          │ │
│  │  │              📎                                        │          │ │
│  │  │        Beleg hier ablegen                             │          │ │
│  │  └───────────────────────────────────────────────────────┘          │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
```

## Edit Mode Flow

### 1. Hover State
```
┌──────────────────────────────┐
│ 🏪 Händler                   │
│    REWE               [✏️]   │ ← Edit button appears on hover
└──────────────────────────────┘
```

### 2. Edit Active
```
┌──────────────────────────────┐
│ 🏪 Händler                   │
│ ┌────────────────┐ [✓] [✗]  │ ← Input + Save/Cancel buttons
│ │ REWE           │           │
│ └────────────────┘           │
└──────────────────────────────┘
```

### 3. Dropdown Edit (Category/Payment)
```
┌──────────────────────────────┐
│ 🏷️ Kategorie                 │
│ ┌────────────────┐ [✓] [✗]  │
│ │ Haushalt    ▼  │           │
│ ├────────────────┤           │
│ │ Hausrenovierung│           │
│ │ Variable Kosten│           │
│ │ ...            │           │
│ └────────────────┘           │
└──────────────────────────────┘
```

## Responsive Breakpoints

| Size | Layout Changes |
|------|----------------|
| **< 768px** | Stack fields vertically, full-width bubbles (85%) |
| **768px - 1023px** | 2-column grid for receipt card, bubbles max 80% |
| **1024px+** | 2-column grid, max chat width 800px, bubbles max 70% |

## Color Reference

```
User Message:      bg-indigo-100   text-slate-900
Assistant Message: bg-slate-100    text-slate-900
System Message:    bg-emerald-50   text-emerald-700
Receipt Card:      bg-white        border-slate-200
Edit Active:       border-[#E6035F] ring-[#E6035F]
Primary Button:    bg-[#E6035F]    text-white
Hover Scale:       scale-[1.02]
```

## Accessibility Features

### Keyboard Navigation
- Tab: Navigate through fields
- Enter: Send message / Save edit
- Shift+Enter: New line in message
- Escape: Cancel edit
- Arrow Up/Down: Navigate message history

### Screen Reader Announcements
- New messages: `aria-live="polite"` on message list
- Typing indicator: "Assistant is typing"
- Edit mode: "Editing [field name]"
- Success: "Receipt saved successfully"

### Focus Management
- Auto-focus on input after sending
- Focus trap in edit mode
- Visible focus rings (pink 2px)

## Animation Timing

| Action | Duration | Easing |
|--------|----------|--------|
| Message slide-in | 300ms | ease-out |
| Typing dots | 800ms | loop |
| Button hover | 150ms | ease |
| Edit mode activate | 200ms | ease-in-out |
| Success toast | 300ms | ease-out |
| Scroll to bottom | 400ms | smooth |

---

**Design Status**: ✅ Complete
**Implementation Status**: ✅ Complete
**Testing**: Ready for QA
