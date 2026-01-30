# Performance Guidelines

**Last Updated:** January 29, 2026
**Current Bundle Size:** 107 KB (dashboard)
**Performance Budget:** 150 KB max per route

---

## 📊 Current Performance

### Bundle Sizes

| Route | First Load JS | Status |
|-------|--------------|--------|
| `/dashboard` | 107 KB | ✅ Excellent |
| `/` (landing) | 114 KB | ✅ Excellent |
| `/profile` | 107 KB | ✅ Excellent |
| All other pages | ~103 KB | ✅ Excellent |

### Shared Bundle

- `chunks/4940-*.js`: 45.6 KB
- `chunks/ced0ff3d-*.js`: 54.2 KB
- Other chunks: 2.12 KB
- **Total shared:** 102 KB

---

## 🚫 Banned Dependencies

**NEVER install these packages without explicit approval and performance testing:**

### Charts & Data Visualization
- ❌ `recharts` (5.2 MB) - Use custom D3 implementation
- ❌ `chart.js` (500+ KB) - Use custom D3 implementation
- ❌ `victory` (1+ MB) - Use custom D3 implementation
- ❌ `plotly.js` (3+ MB) - Use custom D3 implementation
- ❌ `highcharts` (Commercial + heavy) - Use custom D3 implementation

**✅ Approved:** `d3-scale`, `d3-shape`, `d3-array` (~10 KB total)

### Icons
- ❌ `lucide-react` (150+ KB) - Use `/components/ui/Icon.tsx`
- ❌ `react-icons` (1+ MB) - Use custom SVG icons
- ❌ `heroicons` (200+ KB) - Use custom SVG icons
- ❌ `@mui/icons-material` (2+ MB) - Use custom SVG icons

**✅ Approved:** Inline SVG paths in `/components/ui/Icon.tsx`

### Animation Libraries
- ❌ `framer-motion` (5.3 MB) - Use CSS animations
- ❌ `react-spring` (500+ KB) - Use CSS animations
- ❌ `anime.js` (50+ KB) - Use CSS animations
- ❌ `gsap` (Commercial + heavy) - Use CSS animations

**✅ Approved:** CSS keyframes in `/styles/animations.css`

### Utility Libraries
- ❌ `lodash` (500+ KB) - Use native JS
- ❌ `moment` (300+ KB) - Use native `Date` or `date-fns/esm`
- ❌ `underscore` (50+ KB) - Use native JS
- ❌ `jquery` (90+ KB) - Absolutely not

**✅ Approved:** Native JavaScript (Array.prototype, Object methods, etc.)

### Date/Time
- ❌ `moment` (300+ KB) - Use native or date-fns/esm
- ❌ `date-fns` (full) (200+ KB) - Use individual functions from date-fns/esm
- ❌ `dayjs` (Only if needed, <10 KB is acceptable)

**✅ Approved:** Native `Intl.DateTimeFormat`, `Date` methods, or `date-fns/esm` (individual imports)

---

## ✅ Dependency Checklist

Before installing ANY new dependency:

### 1. Check Bundle Size
```bash
# Check unpacked size
npm info <package> dist.unpackedSize

# Check gzipped size (look for size badges on npm/bundlephobia)
# Visit: https://bundlephobia.com/package/<package>@latest
```

**Rules:**
- ⚠️ If > 50 KB: Requires justification
- ❌ If > 100 KB: Needs approval + alternatives explored
- ❌ If > 500 KB: Almost certainly banned

### 2. Check Tree-Shaking Support
```bash
npm info <package> | grep "module\|exports"
```

**Look for:**
- ✅ `"module": "esm/index.js"` - Good tree-shaking
- ✅ `"exports": { "import": "..." }` - ESM support
- ❌ Only `"main": "dist/index.js"` - Poor tree-shaking

### 3. Consider Alternatives

Ask yourself:
1. Can I build this myself? (Often yes for simple features)
2. Is there a smaller alternative? (Check bundlephobia comparisons)
3. Can I use native APIs? (Date, Intl, Array methods, etc.)
4. Do I only need 1-2 functions? (Import individually or copy)

### 4. Run Bundle Analyzer

```bash
# Install the dependency
pnpm add <package>

# Build and analyze
ANALYZE=true pnpm run build

# Check the report
open .next/analyze/client.html
```

**Look for:**
- New chunks created
- Size of vendor bundle
- Total First Load JS per route

### 5. Document Your Decision

If approved, add to `docs/DEPENDENCIES.md`:
- Why this package was needed
- What alternatives were considered
- Bundle size impact
- Tree-shaking verification

---

## 🎯 Performance Budget

### Hard Limits (Will Break Build)

| Metric | Limit | Current |
|--------|-------|---------|
| Dashboard First Load | 150 KB | 107 KB ✅ |
| Landing First Load | 150 KB | 114 KB ✅ |
| Other Pages First Load | 120 KB | 103 KB ✅ |
| Shared Bundle | 120 KB | 102 KB ✅ |

### Soft Limits (Warning)

| Metric | Warning | Current |
|--------|---------|---------|
| Any route > 130 KB | ⚠️ Review | All under ✅ |
| Total deps > 50 | ⚠️ Audit | TBD |
| Build time > 15s | ⚠️ Investigate | 7.4s ✅ |

---

## 🛠 Custom Implementations

We've built lightweight custom implementations for common features. **Use these instead of heavy libraries.**

### Charts (Replaces recharts, chart.js, etc.)

**File:** `/components/charts/LineChart.tsx`
**Size:** ~2 KB
**Uses:** d3-scale, d3-shape, d3-array (~10 KB total)

```tsx
import { LineChart } from '@/components/charts/LineChart'

<LineChart
  data={chartData}
  lines={[{ dataKey: 'score', stroke: '#8B5CF6' }]}
  yAxisFormatter={(v) => `${v}%`}
/>
```

**Features:**
- Line charts with multiple series
- Reference lines (milestones)
- Responsive SVG
- Tooltips
- Custom formatters

**To add:** Bar charts, area charts (follow same pattern with d3-shape)

### Icons (Replaces lucide-react, react-icons, etc.)

**File:** `/components/ui/Icon.tsx`
**Size:** ~3 KB (33 icons)
**Uses:** Inline SVG paths

```tsx
import { Icon } from '@/components/ui/Icon'

<Icon name="user" size={24} className="text-primary" />
```

**Available icons:** Check `/components/ui/Icon.tsx` for full list

**To add new icons:**
1. Find SVG path from [Lucide](https://lucide.dev) or [Heroicons](https://heroicons.com)
2. Add to `iconPaths` object in `Icon.tsx`
3. Export individual component for backward compatibility

### Animations (Replaces framer-motion, react-spring, etc.)

**File:** `/styles/animations.css`
**Size:** ~1 KB
**Uses:** CSS keyframes

```tsx
// Fade in on mount
<div className="animate-fade-in">Content</div>

// Fade in + slide up
<div className="animate-fade-in-up">Content</div>

// Pulse effect
<div className="animate-pulse-glow">Content</div>

// Custom delay
<div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
  Content
</div>
```

**Available animations:**
- `animate-fade-in` - Opacity 0 → 1
- `animate-fade-in-up` - Fade in + slide up
- `animate-slide-in` - Slide from left
- `animate-pulse-glow` - Continuous glow effect
- `particle-float` - Floating particle effect

**To add new animations:**
1. Add `@keyframes` to `/styles/animations.css`
2. Create utility class (e.g., `animate-*`)
3. Document here

---

## 📦 Code Splitting Strategy

### Above-the-Fold (Load Immediately)
- Critical UI components
- Navigation/header
- Primary content
- Anything visible without scrolling

### Below-the-Fold (Lazy Load)

Use `next/dynamic` for components that are:
- Below the fold
- In tabs/dialogs (not immediately visible)
- Heavy (charts, rich editors, etc.)

**Example:**

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  {
    loading: () => <Skeleton />,
    ssr: false, // If component uses browser APIs
  }
)
```

### Current Lazy-Loaded Components

1. `MatchScoreChart` - Heavy chart (above fold but lazy for SSR)
2. `AIAdvisorCard` - Below fold
3. `SkillsGapList` - Below fold
4. `MarketTrends` - Below fold
5. `RecommendedProjects` - Below fold
6. `RoleManagementDialog` - Dialog (only load when opened)

---

## 🔍 Monitoring & Audits

### Weekly Checks

```bash
# Build and check bundle size
pnpm run build

# Look for size increases
git diff main -- .next/build-manifest.json
```

### Monthly Audits

```bash
# Full bundle analysis
ANALYZE=true pnpm run build
open .next/analyze/client.html

# Check for unused dependencies
npx depcheck

# Check for outdated packages
pnpm outdated

# Check for duplicate dependencies
pnpm dedupe --check
```

### Quarterly Review

1. Review all dependencies (are they still needed?)
2. Check for lighter alternatives
3. Update performance budgets if needed
4. Run Lighthouse audit
5. Update this document

---

## 🚨 Performance Regression Protocol

If bundle size increases unexpectedly:

### 1. Identify the Cause

```bash
# Compare builds
git diff main -- .next/build-manifest.json

# Run bundle analyzer
ANALYZE=true pnpm run build
```

### 2. Investigate

- Check recent commits: `git log --oneline -10`
- Check recent package additions: `git diff main -- package.json`
- Check bundle analyzer: Which chunk grew?

### 3. Fix

**Options (in order of preference):**

1. **Remove the dependency** - Can we build it custom?
2. **Find lighter alternative** - Check bundlephobia
3. **Lazy load it** - Make it a dynamic import
4. **Tree-shake better** - Import only what you need
5. **Split into separate chunk** - Isolate if unavoidable

### 4. Verify

```bash
# Rebuild and confirm fix
pnpm run build

# Check bundle size is back under budget
```

### 5. Document

Add note to this file explaining:
- What caused the regression
- How it was fixed
- How to prevent it in future

---

## 🎓 Learning Resources

### Next.js Performance
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)

### Tools
- [Bundlephobia](https://bundlephobia.com) - Check package sizes
- [Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Best Practices
- [Web.dev Performance](https://web.dev/performance/)
- [JavaScript Bundle Size](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Tree Shaking](https://web.dev/reduce-javascript-payloads-with-tree-shaking/)

---

## 📝 Version History

| Date | Bundle Size | Change | Notes |
|------|-------------|--------|-------|
| 2026-01-29 | 107 KB | Initial | Completed 7-phase optimization |
| - | - | - | - |

---

**Remember:** Every KB counts. Start with "Can I build this myself?" before reaching for npm.
