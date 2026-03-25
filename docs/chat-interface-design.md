# Receipt Chat Interface - UX Design Specification

## 🎨 Design Philosophy

**Conversational Receipt Management**: Transform receipt processing from a form-based workflow into a natural conversation with an AI assistant that guides users through data extraction, verification, and corrections.

---

## 📐 Layout Structure

### Full-Screen Chat Layout

```
┌─────────────────────────────────────────────────────────┐
│  [Header: "Beleg-Chat" | [Clear] [Settings]]            │ ← Sticky, white bg
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [System Message: Welcome]                              │ ← Centered, gray bg
│                                                          │
│  [User Message with Image Attachment] ──→               │ ← Right-aligned, indigo
│     📎 receipt.jpg                                       │
│                                                          │
│  ←── [Assistant Message]                                │ ← Left-aligned, slate
│       "Ich analysiere deinen Beleg..."                  │
│                                                          │
│  ←── [Receipt Card Component]                           │ ← Full-width, white card
│       ┌──────────────────────────────┐                  │
│       │ 🏪 Händler: REWE             │                  │
│       │ 📅 Datum: 2024-03-15         │ ← Click to edit  │
│       │ 💶 Betrag: 45,67€            │                  │
│       │ 🏷️ Kategorie: Haushalt       │                  │
│       │ 💳 Karte                      │                  │
│       │ ⚡ Konfidenz: Hoch            │ ← Badge         │
│       │                               │                  │
│       │ [✓ Speichern] [✏️ Korrigieren]│                  │
│       └──────────────────────────────┘                  │
│                                                          │
│  [User Message] ──→                                     │
│     "Kategorie ändern"                                  │
│                                                          │
│  ←── [Assistant Message]                                │
│       "Welche Kategorie soll ich verwenden?"            │
│       [Quick Actions: 🏠 Hausrenovierung | ...]         │
│                                                          │
│  ↓ Auto-scroll to bottom                                │
├─────────────────────────────────────────────────────────┤
│  [📎] [Text Input: "Nachricht eingeben..."]  [Send ↑]  │ ← Fixed bottom bar
│  Drag & Drop Zone (overlay when dragging)              │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 User Journey

### Primary Flow: Upload → Verify → Save

```
1. ENTRY
   User: Drops image or clicks 📎
   ↓
2. UPLOAD CONFIRMATION
   User Message: [Image preview] "Beleg analysieren"
   ↓
3. PROCESSING
   System: [Typing indicator dots...]
   ↓
4. EXTRACTION RESULT
   Assistant: "Ich habe deinen Beleg analysiert:"
   [Receipt Card with extracted data]
   "Passt das so?"
   ↓
5a. HAPPY PATH
    User: Clicks "✓ Speichern"
    → Assistant: "✓ Beleg gespeichert!"
    → DONE

5b. CORRECTION PATH
    User: Clicks field to edit (e.g., Kategorie)
    → Inline edit mode activates
    → User changes value
    → Auto-update in card
    → Assistant: "Kategorie auf 'X' geändert. Speichern?"
    → User: "Ja" or clicks "✓ Speichern"
    → DONE
```

### Alternative Flows

**Multi-correction Flow**:
```
User: "Datum ist falsch, muss 12.03 sein"
Assistant: Updates receipt card + confirms
User: "Betrag auch, war 47,50€"
Assistant: Updates + confirms
User: "Ok speichern"
Assistant: Saves receipt
```

**Rejection Flow**:
```
User: Clicks "❌ Verwerfen"
Assistant: "Beleg verworfen. Neuen Beleg hochladen?"
```

---

## 🎨 Visual Design

### Color Palette (from globals.css)

| Element | Color | Usage |
|---------|-------|-------|
| User Messages | `bg-indigo-100` `text-slate-900` | Right-aligned bubbles |
| Assistant Messages | `bg-slate-100` `text-slate-900` | Left-aligned bubbles |
| System Messages | `bg-emerald-50` `text-emerald-700` | Centered, success states |
| Receipt Card | `bg-white` `border-slate-200` | Full-width, elevated |
| Primary Button | `bg-[#E6035F]` (pink) | Save/Confirm actions |
| Input Focus | `ring-[#E6035F]` | Pink accent ring |

### Typography

- **Message Text**: `text-base` (18px desktop, 16px mobile), `font-light` (300)
- **Card Labels**: `text-xs uppercase tracking-wider text-slate-500 font-semibold`
- **Card Values**: `text-lg font-medium text-slate-900`
- **Timestamps**: `text-xs text-slate-400`

### Spacing (8pt Grid)

- Message padding: `p-4` (32px)
- Message gap: `gap-4` (32px)
- Card padding: `p-6` (48px)
- Input height: `h-14` (112px with padding)
- Bottom bar: `pb-6` (safe area)

---

## 🧩 Component Specifications

### 1. ChatInterface.tsx (Main Container)

**Responsibilities**:
- Manage chat state (messages array)
- Handle file upload events
- Scroll management (auto-scroll to bottom)
- Keyboard shortcuts (Enter to send)

**State**:
```typescript
{
  messages: ChatMessage[]           // All messages in conversation
  currentReceipt: Receipt | null    // Receipt being discussed
  isTyping: boolean                 // Show typing indicator
  dragActive: boolean               // Drag & drop overlay
}
```

**Layout**:
- Full viewport height (`h-screen`)
- Flex column layout
- Scrollable message area with `pb-32` (space for input)
- Fixed bottom input bar

---

### 2. ChatMessage.tsx (Message Bubble)

**Props**:
```typescript
{
  message: ChatMessage
  onFieldEdit?: (field, value) => void  // For receipt card edits
}
```

**Message Types**:
- `user`: Right-aligned, indigo background, user avatar
- `assistant`: Left-aligned, slate background, AI avatar
- `system`: Centered, no avatar, green/yellow/red background

**Features**:
- Markdown support in text content
- Timestamp on hover
- Avatar icons (User = 👤, AI = 🤖)
- Smooth fade-in animation

---

### 3. ReceiptChatCard.tsx (Inline Receipt Display)

**Props**:
```typescript
{
  receipt: Receipt
  editable: boolean
  onEdit: (field, value) => void
  onConfirm: () => void
  onReject: () => void
  confidenceLevel: 'high' | 'medium' | 'low'
}
```

**Layout** (Compact Card in Chat):
```
┌────────────────────────────────────┐
│ 🏪 Händler: [REWE]          [Edit] │ ← Click to edit inline
│ 📅 Datum: [15.03.2024]      [Edit] │
│ 💶 Betrag: [45,67 €]        [Edit] │
│ 🏷️ Kategorie: [Haushalt]    [Edit] │
│ 💳 Zahlung: [Karte]         [Edit] │
│                                     │
│ ⚡ Konfidenz: [Hoch ●●●]           │ ← Visual indicator
│                                     │
│ [✓ Speichern] [✏️ Korrigieren]     │ ← Primary actions
└────────────────────────────────────┘
```

**Inline Edit Mode**:
- Click field → Input appears in place
- ESC to cancel, Enter to save
- Visual feedback (border glow)
- Auto-focus on input

**Confidence Indicator**:
- High: Green badge + 3 dots
- Medium: Yellow badge + 2 dots
- Low: Orange badge + 1 dot

---

### 4. ChatInput.tsx (Bottom Input Bar)

**Features**:
- Text input with auto-grow (max 3 lines)
- File upload button (paperclip icon)
- Send button (arrow up icon, pink)
- Drag & drop overlay when dragging files
- Disabled state while uploading/processing

**Layout**:
```
┌───────────────────────────────────────────────┐
│ [📎] [  Nachricht eingeben...  ] [Send ↑]   │
│      └─ Auto-grow input ─────┘    └─Pink─┘   │
└───────────────────────────────────────────────┘
```

**Keyboard Shortcuts**:
- Enter: Send message
- Shift+Enter: New line
- Ctrl+V: Paste image from clipboard

---

### 5. MessageAttachment.tsx (Image Preview in Message)

**Features**:
- Thumbnail preview (max 200px height)
- Click to open full-size lightbox
- File info tooltip (size, type)
- Loading skeleton while uploading

---

## 📱 Responsive Behavior

### Desktop (1024px+)
- Max chat width: 800px (centered)
- Message bubbles: max 70% width
- Receipt card: full width within chat
- Two-column edit mode (label | value)

### Tablet (768px - 1023px)
- Full width chat
- Message bubbles: max 80% width
- Receipt card: full width
- Single column edits

### Mobile (< 768px)
- Full width, no margins
- Message bubbles: max 85% width
- Bottom input bar: full width, `pb-safe` for notch
- Large touch targets (48px min)
- Simplified card layout (stacked fields)

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance

**Keyboard Navigation**:
- Tab through all interactive elements
- Arrow keys for message history navigation
- Escape to cancel edits
- Enter to send/save

**Screen Readers**:
- `aria-label` on all icon buttons
- `role="log"` for message list (announces new messages)
- `aria-live="polite"` for typing indicator
- Alt text for all images

**Color Contrast**:
- All text meets 4.5:1 ratio
- Focus states: 3:1 ratio pink ring
- Confidence badges: icon + color + text

**Focus Management**:
- Auto-focus input after sending
- Trap focus in lightbox modal
- Visible focus indicators (pink ring)

---

## 🎭 Microinteractions

### Animations (Respect `prefers-reduced-motion`)

1. **Message Appearance**: Fade + slide from edge (200ms)
2. **Typing Indicator**: Bouncing dots (800ms loop)
3. **Button Hover**: Scale 1.02 + shadow (150ms)
4. **Card Edit Mode**: Border glow pulse (300ms)
5. **Success Toast**: Slide up from bottom (300ms)
6. **Drag Overlay**: Fade in + border dash animation (200ms)

### Haptic Feedback (Mobile)
- Light tap on send
- Medium tap on save
- Error vibration on validation failure

---

## 🔄 State Management

### Message Types

```typescript
type ChatMessageRole = 'user' | 'assistant' | 'system'

type ChatMessageContent =
  | { type: 'text'; text: string }
  | { type: 'image'; url: string; file?: File }
  | { type: 'receipt'; receipt: Receipt; editable: boolean }

interface ChatMessage {
  id: string
  role: ChatMessageRole
  content: ChatMessageContent[]
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
}
```

### Conversation Context

```typescript
interface ChatContext {
  conversationId: string
  messages: ChatMessage[]
  currentReceipt: Receipt | null
  awaitingConfirmation: boolean
}
```

**LocalStorage Persistence**:
- Save last 20 messages per session
- Clear on successful save or explicit "Clear Chat"
- Resume conversation on reload

---

## 🚀 Performance Optimizations

1. **Virtual Scrolling**: Only render visible messages (>50 messages)
2. **Image Optimization**: Lazy load, compress thumbnails
3. **Debounced Input**: 300ms delay on auto-save edits
4. **Optimistic Updates**: Instant UI feedback, async save
5. **Code Splitting**: Lazy load lightbox component

---

## 🧪 Edge Cases

### Handling Errors

| Scenario | Behavior |
|----------|----------|
| Upload fails | System message: "Upload fehlgeschlagen. Bitte erneut versuchen." + Retry button |
| Extraction fails | Assistant: "Ich konnte den Beleg nicht analysieren. Bitte manuell eingeben." + Empty card |
| Save fails | Error message + Keep data in card + Retry button |
| Network offline | Queue message, show "Offline" indicator, sync on reconnect |
| Invalid file type | System message: "Nur JPG, PNG, HEIC erlaubt (max 10MB)" |

### Low Confidence Data

When `confidence === 'low'`:
- Assistant message: "Ich bin mir bei einigen Feldern unsicher. Bitte überprüfen:"
- Fields with low confidence: Yellow highlight + warning icon
- Auto-focus first uncertain field for editing

### Multi-receipt Session

- Each receipt gets its own conversation thread
- System message divider: "─── Neuer Beleg ───"
- Clear chat button to reset

---

## 📊 Success Metrics

### UX Goals

1. **Speed**: Upload → Save in < 15 seconds (90th percentile)
2. **Accuracy**: < 10% correction rate on high-confidence extractions
3. **Satisfaction**: NPS > 8 for chat experience
4. **Accessibility**: 100% keyboard navigable, WCAG AA compliant

---

## 🎯 Implementation Priority

### Phase 1: Core Chat (This PR)
- ✅ ChatInterface container
- ✅ ChatMessage component
- ✅ ChatInput component
- ✅ Basic message flow (user → assistant → system)
- ✅ File upload + image preview
- ✅ API integration (/api/receipts/chat)

### Phase 2: Receipt Interaction
- ✅ ReceiptChatCard component
- ✅ Inline field editing
- ✅ Confirmation flow
- ✅ Error handling

### Phase 3: Polish
- ⬜ Typing indicator
- ⬜ LocalStorage persistence
- ⬜ Keyboard shortcuts
- ⬜ Mobile optimization
- ⬜ Accessibility audit

### Phase 4: Advanced Features
- ⬜ Multi-file upload
- ⬜ Voice input
- ⬜ Receipt search in chat
- ⬜ Export conversation

---

## 🔗 Related Files

**Components**:
- `components/receipts/ChatInterface.tsx`
- `components/receipts/ChatMessage.tsx`
- `components/receipts/ChatInput.tsx`
- `components/receipts/ReceiptChatCard.tsx`
- `components/receipts/MessageAttachment.tsx`

**Hooks**:
- `hooks/useChatMessages.ts`
- `hooks/useReceiptChat.ts`

**API**:
- `app/api/receipts/chat/route.ts`

**Types**:
- `types/chat.ts` (new)
- `types/receipt.ts` (extend)

**Pages**:
- `app/belege/page.tsx` (update to use ChatInterface)

---

## 📝 Design Decisions

### Why Chat over Forms?

1. **Natural Flow**: Mirrors how users think ("I have a receipt → analyze it → fix errors → save")
2. **Guided Corrections**: AI can ask clarifying questions vs. silent form validation
3. **Context Awareness**: Conversation history helps resolve ambiguities
4. **Reduced Cognitive Load**: One task at a time vs. overwhelming form fields
5. **Modern UX**: Familiar ChatGPT-style interaction pattern

### Why Inline Editing in Card?

- **Speed**: Click-to-edit faster than opening modal
- **Context**: See all fields while editing one
- **Visibility**: Changes immediately visible
- **Mobile-Friendly**: No modal stack on small screens

### Why LocalStorage for Messages?

- **MVP Scope**: No backend needed for chat history
- **Privacy**: Messages stay client-side
- **Speed**: Instant load, no API call
- **Cleanup**: Auto-clear old conversations (20 msg limit)

---

**Design Review**: Ready for implementation ✅
**Stakeholder**: Christian (Solo Developer)
**Approval Date**: 2024-03-16
