# 🎨 Tailwind CSS Animations Guide

This document provides a comprehensive guide to all available Tailwind CSS animations in the AI School Dashboard application.

## 📚 Table of Contents

- [Setup](#setup)
- [Animation Classes](#animation-classes)
- [Utility Classes](#utility-classes)
- [Component Classes](#component-classes)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)

---

## Setup

The Tailwind CSS animations are configured in `tailwind.config.js` and imported through `src/styles/global.css`.

### Installation
Tailwind CSS is already installed. The animations are ready to use!

---

## Animation Classes

### 🎭 Fade Animations

| Class | Description | Duration |
|-------|-------------|----------|
| `animate-fade-in` | Simple fade in effect | 0.5s |
| `animate-fade-out` | Simple fade out effect | 0.5s |
| `animate-fade-in-up` | Fade in while moving up | 0.6s |
| `animate-fade-in-down` | Fade in while moving down | 0.6s |
| `animate-fade-in-left` | Fade in from the left | 0.6s |
| `animate-fade-in-right` | Fade in from the right | 0.6s |

**Example:**
```jsx
<div className="animate-fade-in-up">
  This content will fade in from below
</div>
```

---

### 🎢 Slide Animations

| Class | Description | Duration |
|-------|-------------|----------|
| `animate-slide-in-up` | Slide in from bottom | 0.4s |
| `animate-slide-in-down` | Slide in from top | 0.4s |
| `animate-slide-in-left` | Slide in from left | 0.4s |
| `animate-slide-in-right` | Slide in from right | 0.4s |

**Example:**
```jsx
<Card className="animate-slide-in-right">
  This card slides in from the right
</Card>
```

---

### 📏 Scale Animations

| Class | Description | Duration |
|-------|-------------|----------|
| `animate-scale-in` | Scale up with fade | 0.3s |
| `animate-scale-up` | Scale up to 105% | 0.3s |
| `animate-scale-down` | Scale down to 95% | 0.3s |

**Example:**
```jsx
<button className="animate-scale-in">
  Click me!
</button>
```

---

### 🎾 Bounce Animations

| Class | Description | Duration |
|-------|-------------|----------|
| `animate-bounce-in` | Bounce effect on entry | 0.6s |
| `animate-bounce-gentle` | Gentle continuous bounce | 1s (infinite) |

**Example:**
```jsx
<Badge count={5} className="animate-bounce-gentle">
  <BellOutlined />
</Badge>
```

---

### 💫 Pulse Animations

| Class | Description | Duration |
|-------|-------------|----------|
| `animate-pulse-slow` | Slow pulsing effect | 3s (infinite) |
| `animate-pulse-fast` | Fast pulsing effect | 1s (infinite) |

---

### 🔄 Spin Animations

| Class | Description | Duration |
|-------|-------------|----------|
| `animate-spin-slow` | Slow rotation | 3s (infinite) |
| `animate-spin-fast` | Fast rotation | 0.5s (infinite) |

**Example:**
```jsx
<LoadingOutlined className="animate-spin-slow" />
```

---

### 🎪 Special Effects

| Class | Description | Duration |
|-------|-------------|----------|
| `animate-shake` | Shake horizontally | 0.5s |
| `animate-wiggle` | Rotate back and forth | 1s (infinite) |
| `animate-float` | Float up and down | 3s (infinite) |
| `animate-gradient` | Animated gradient background | 3s (infinite) |
| `animate-shimmer` | Shimmer loading effect | 2s (infinite) |

---

## Utility Classes

### 🎯 Hover Effects

| Class | Description |
|-------|-------------|
| `hover-grow` | Scales to 105% on hover |
| `hover-lift` | Lifts up with shadow on hover |
| `card-hover` | Card-specific hover effect |

**Example:**
```jsx
<Button className="hover-grow btn-press">
  Hover and click me!
</Button>
```

---

### ⏱️ Stagger Delays

Use these classes to create staggered animations for lists:

| Class | Delay |
|-------|-------|
| `stagger-1` | 100ms |
| `stagger-2` | 200ms |
| `stagger-3` | 300ms |
| `stagger-4` | 400ms |
| `stagger-5` | 500ms |

**Example:**
```jsx
{items.map((item, index) => (
  <Card key={item.id} className={`animate-fade-in-up stagger-${index + 1}`}>
    {item.content}
  </Card>
))}
```

---

### 🎨 Background Effects

| Class | Description |
|-------|-------------|
| `gradient-animate` | Animated gradient (must set background-image) |
| `shimmer` | Loading shimmer effect |

**Example:**
```jsx
<div className="shimmer h-20 rounded-lg">
  Loading placeholder
</div>
```

---

## Component Classes

### 📦 Ready-to-Use Components

| Class | Description |
|-------|-------------|
| `animated-card` | Pre-styled animated card |
| `animated-button` | Pre-styled animated button |
| `loading-spinner` | Spinning loader |
| `notification-badge` | Animated notification badge |
| `progress-bar` | Progress bar container |
| `progress-bar-fill` | Progress bar fill |
| `skeleton` | Skeleton loader |

**Examples:**

#### Loading Spinner
```jsx
<div className="loading-spinner"></div>
```

#### Progress Bar
```jsx
<div className="progress-bar">
  <div className="progress-bar-fill" style={{ width: '75%' }}></div>
</div>
```

#### Skeleton Loader
```jsx
<div className="space-y-2">
  <div className="skeleton h-4 w-full"></div>
  <div className="skeleton h-4 w-3/4"></div>
  <div className="skeleton h-4 w-1/2"></div>
</div>
```

---

## Usage Examples

### 📊 Dashboard Statistics Cards

```jsx
import StatisticsCards from '../components/dashboard/StatisticsCards';

const Dashboard = () => (
  <div>
    <StatisticsCards stats={stats} />
    {/* Cards will animate in with staggered delays */}
  </div>
);
```

### 🔔 Notification Alerts

```jsx
const [showNotif, setShowNotif] = useState(false);

<div className="fixed top-4 right-4 animate-slide-in-notification">
  <Alert message="Success!" />
</div>
```

### 🎯 Interactive Buttons

```jsx
<Button
  type="primary"
  className="hover-grow btn-press"
  onClick={handleSubmit}
>
  Submit
</Button>
```

### 📋 List Items with Stagger

```jsx
{data.map((item, idx) => (
  <div
    key={item.id}
    className={`animate-fade-in-up stagger-${(idx % 5) + 1}`}
  >
    {item.content}
  </div>
))}
```

### 🎨 Gradient Card

```jsx
<Card
  className="gradient-animate"
  style={{
    background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)'
  }}
>
  Animated gradient background
</Card>
```

---

## Best Practices

### ✅ Do's

1. **Use stagger delays** for lists to create smooth sequential animations
2. **Combine animations** thoughtfully (e.g., `animate-fade-in-up stagger-2`)
3. **Add hover effects** to interactive elements
4. **Use loading states** with shimmer or spinner
5. **Test on slower devices** to ensure smooth performance

### ❌ Don'ts

1. **Don't overuse animations** - too many can be distracting
2. **Don't animate critical actions** - keep important buttons simple
3. **Don't use long durations** for frequently occurring animations
4. **Don't forget accessibility** - respect `prefers-reduced-motion`
5. **Don't nest too many animated elements** - can cause performance issues

### 🎯 Performance Tips

1. Use `transform` and `opacity` for animations (GPU accelerated)
2. Avoid animating `width`, `height`, or `margin`
3. Use `will-change` sparingly for complex animations
4. The config includes `prefers-reduced-motion` support automatically

---

## 🎬 Demo Component

To see all animations in action, check out:
```
frontend/src/components/demo/AnimationShowcase.jsx
```

Add this route to see the showcase:
```jsx
<Route path="/animations" element={<AnimationShowcase />} />
```

---

## 🔧 Customization

To add custom animations, edit `tailwind.config.js`:

```js
theme: {
  extend: {
    animation: {
      'my-animation': 'myKeyframes 1s ease-in-out',
    },
    keyframes: {
      myKeyframes: {
        '0%': { /* start state */ },
        '100%': { /* end state */ },
      },
    },
  },
}
```

---

## 🎨 Color Variables

Pre-configured color schemes available:

- `primary-*`: Blue shades (50-900)
- `success-*`: Green shades
- `warning-*`: Orange shades
- `error-*`: Red shades

Use in Tailwind classes:
```jsx
<div className="bg-primary-500 text-white">
  Primary colored background
</div>
```

---

## 📱 Responsive Animations

Combine with Tailwind's responsive prefixes:

```jsx
<div className="animate-fade-in-up md:animate-slide-in-right">
  Mobile: fade up, Desktop: slide right
</div>
```

---

## 🚀 Quick Reference Card

| Use Case | Recommended Animation |
|----------|---------------------|
| Page entry | `animate-fade-in-up` |
| Card hover | `hover-lift` or `card-hover` |
| Button click | `btn-press` |
| Loading state | `loading-spinner` or `shimmer` |
| List items | `animate-fade-in-up` + `stagger-*` |
| Notifications | `animate-slide-in-notification` |
| Important badge | `animate-bounce-gentle` |
| Progress | `progress-bar-fill` |

---

## 📞 Need Help?

For questions or issues with animations:
1. Check this documentation
2. Review `tailwind.config.js`
3. Inspect `src/styles/global.css`
4. See examples in `AnimationShowcase.jsx`

Happy animating! 🎉
