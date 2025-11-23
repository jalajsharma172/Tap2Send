# PayPhone Design Guidelines

## Design Approach
**Reference-Based Conversion**: This is a direct conversion of an existing HTML design into React. All visual specifications must match the provided HTML/CSS exactly.

## Core Design Elements

### Typography
- **Primary Font**: Roboto, 'Segoe UI', Tahoma (sans-serif stack)
- **Monospace Font**: 'Courier New' for wallet addresses and transaction displays
- **Hierarchy**:
  - H1: 1.4em, weight 500, color #333333
  - Subtitle: 0.8em, weight 400, color #666666
  - Phone Input: 1.5em, weight 400, letter-spacing 1px
  - Keypad Buttons: 1.4em, weight 300
  - Labels: 0.7em, uppercase, letter-spacing 0.5px

### Color Palette
- **Background**: Pure black (#000000)
- **Container**: White (#ffffff)
- **Text Primary**: #333333
- **Text Secondary**: #666666
- **Text Tertiary**: #999999, #aaaaaa
- **Borders**: #e0e0e0
- **Backgrounds Secondary**: #f5f5f5, #f9f9f9
- **Transaction Green**: #00ff00 with glow effect
- **Action Button**: #4CAF50 with green shadow
- **User Transaction Highlight**: White (#ffffff) with intense glow
- **Success**: #d4edda with #155724 text
- **Error**: #f8d7da with #721c24 text

### Layout System
- **Container**: max-width 380px, border-radius 20px, padding 20px 18px
- **Spacing Units**: Use 4px, 5px, 6px, 8px, 10px, 12px, 15px, 16px, 18px, 20px
- **Keypad Gap**: 10px between buttons
- **Section Margins**: 16-18px between major sections

### Component Library

**Animated Background**:
- Fixed position fullscreen overlay
- Moving transaction elements with phone numbers, arrows, amounts
- Six animation directions: left-to-right, right-to-left, diagonal TL, TR, BL, BR
- Base opacity 0.7, green (#00ff00) text with glow
- User transaction: opacity 1, white text with intense shadow glow

**Header**:
- Centered layout
- Logo emoji: 📱💸 at 1.8em
- Title and subtitle stacked

**Receiver Info Card**:
- Light gray background (#f5f5f5)
- 1px border, 10px border-radius
- Monospace wallet address in white nested box

**Phone Display**:
- Light gray background (#f9f9f9)
- Centered input, 1.5em size
- Min-height 60px
- Hint text below at 0.65em

**Keypad**:
- 3-column grid
- Circular buttons (border-radius 50%, aspect-ratio 1:1)
- White background with light border (#e0e0e0)
- Subtle shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
- Hover: scale(0.95), background #f5f5f5
- Active: scale(0.9), background #e0e0e0

**Action Buttons**:
- Pill-shaped (border-radius 25px)
- Clear: #f5f5f5 background, gray text
- Send: #4CAF50 with 0 4px 12px rgba(76, 175, 80, 0.3) shadow
- Uppercase text, letter-spacing 0.5px

**Status Messages**:
- slideDown animation
- Success/Error states with appropriate colors
- Display none by default

### Animations
- **Transaction Movements**: 6 keyframe animations for different directions, 10-15s duration
- **Hover States**: scale transforms (0.95-0.9)
- **Active States**: scale(0.98) for buttons
- **Transitions**: 0.15s to 0.2s ease timing

### Responsive Behavior
Mobile (max-width 480px):
- Container padding: 20px 15px
- Maintain all sizing
- Reduce transaction text: 11px base, 13px for user transaction
- Keypad font: 1.5em

### Special Effects
- Transaction text-shadow: 0 0 10px #00ff00 for regular, 0 0 20px/30px #ffffff for user
- Button shadows on green action button
- Smooth scale transforms on all interactive elements
- Black background with white glow effects creating high contrast

## Images
No images required - this is a pure UI design with emoji icons and animated text elements.