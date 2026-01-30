# Dependency Management Policy

**Last Updated:** January 29, 2026

---

## 🎯 Philosophy

> **"Can I build this myself?"** should be your first question before installing any package.

We prioritize:
1. **Small bundle sizes** - Every KB affects user experience
2. **Native solutions** - Browser APIs are free and fast
3. **Custom implementations** - Full control, zero bloat
4. **Minimal dependencies** - Less to maintain, audit, and update

---

## 📊 Current State

### Dependency Count
- **Production:** ~30 packages
- **Dev:** ~50 packages
- **Target:** Keep production under 40

### Bundle Impact
- **Shared bundle:** 102 KB (excellent)
- **Dashboard:** 107 KB (excellent)
- **Landing:** 114 KB (excellent)

---

## 🚫 Banned Packages

These packages are **BANNED** without explicit project lead approval:

### Data Visualization
```
recharts        → Use custom D3 implementation
chart.js        → Use custom D3 implementation
victory         → Use custom D3 implementation
plotly.js       → Use custom D3 implementation
highcharts      → Use custom D3 implementation
```

**Why:** 500 KB - 5 MB for simple charts. Our custom D3 solution is 10 KB.

### Icons
```
lucide-react        → Use /components/ui/Icon.tsx
react-icons         → Use /components/ui/Icon.tsx
heroicons           → Use /components/ui/Icon.tsx
@mui/icons-material → Use /components/ui/Icon.tsx
@fortawesome/*      → Use /components/ui/Icon.tsx
```

**Why:** 150 KB - 2 MB for icons we barely use. Custom SVG is 3 KB.

### Animation
```
framer-motion   → Use CSS animations
react-spring    → Use CSS animations
anime.js        → Use CSS animations
gsap            → Use CSS animations (also commercial)
```

**Why:** 50 KB - 5 MB for simple animations. CSS is 1 KB and faster.

### Utilities
```
lodash          → Use native JS
underscore      → Use native JS
ramda           → Use native JS
jquery          → Never
```

**Why:** Modern JS has Array.prototype, Object methods, etc. No need for 500 KB of utilities.

### Date/Time
```
moment          → Use native Date or date-fns/esm
```

**Why:** 300 KB and unmaintained. Native Intl API is excellent.

---

## ✅ Approved Dependencies

### Core Framework
- ✅ `next` - Framework
- ✅ `react` - UI library
- ✅ `react-dom` - React renderer

### Database & Auth
- ✅ `@supabase/supabase-js` - Database client
- ✅ `@supabase/ssr` - Server-side auth

### Data Visualization (Minimal)
- ✅ `d3-scale` (~3 KB) - For custom charts
- ✅ `d3-shape` (~4 KB) - For custom charts
- ✅ `d3-array` (~3 KB) - For custom charts

**Total:** ~10 KB for full charting capability

### Styling
- ✅ `tailwindcss` - Utility CSS (dev dependency)
- ✅ `autoprefixer` - CSS compatibility (dev dependency)

### Type Safety
- ✅ `typescript` - Type checking (dev dependency)
- ✅ `@types/*` - Type definitions (dev dependencies)

### Development Tools
- ✅ `@next/bundle-analyzer` - Bundle analysis
- ✅ `eslint` - Code quality
- ✅ `prettier` - Code formatting

---

## 📝 Approval Process

### Before Installing ANY Package

1. **Check if it's banned** (see above)
2. **Search for alternatives** (bundlephobia.com)
3. **Consider building custom** (often faster!)
4. **Check bundle size** (see below)
5. **Get approval** (if > 50 KB)

### Bundle Size Check

```bash
# Check unpacked size
npm info <package> dist.unpackedSize

# Check minified + gzipped size
# Visit: https://bundlephobia.com/package/<package>@latest
```

**Thresholds:**
- ✅ **< 10 KB:** Install freely
- ⚠️ **10-50 KB:** Justify and document
- ❌ **50-100 KB:** Needs approval + alternatives explored
- 🛑 **> 100 KB:** Almost certainly banned

### Approval Template

If you need a package > 50 KB, create an issue with:

```markdown
## Package Request: [package-name]

### Why We Need It
[Describe the use case]

### Alternatives Considered
1. Custom implementation - [why not feasible]
2. [Alternative package 1] - [why not suitable]
3. [Alternative package 2] - [why not suitable]
4. Native API - [why not sufficient]

### Bundle Impact
- **Size:** XX KB (minified + gzipped)
- **Tree-shakeable:** Yes/No
- **ESM support:** Yes/No
- **Used in:** [Which routes/components]

### Mitigation
- [ ] Will use dynamic import
- [ ] Will lazy load
- [ ] Will tree-shake (import specific functions)
- [ ] Will replace X other packages

### Approval
- [ ] Tech lead reviewed
- [ ] Bundle analyzer run
- [ ] Performance budget verified
```

---

## 🔄 Dependency Lifecycle

### Adding Dependencies

1. **Research** - Check bundlephobia, alternatives, custom options
2. **Approve** - Get approval if needed (see above)
3. **Install** - `pnpm add <package>`
4. **Analyze** - `ANALYZE=true pnpm run build`
5. **Document** - Add to this file's "Current Dependencies" section
6. **Commit** - Include bundle analysis in PR

### Updating Dependencies

```bash
# Check what's outdated
pnpm outdated

# Update with care (test thoroughly)
pnpm update <package>

# Run bundle analyzer
ANALYZE=true pnpm run build

# Verify no size regression
```

### Removing Dependencies

When removing a dependency:
1. Search codebase for all usages
2. Replace with custom/native/alternative
3. Run `pnpm remove <package>`
4. Run `pnpm dedupe` to clean up
5. Update this document
6. Celebrate smaller bundle! 🎉

---

## 📊 Current Dependencies (Production)

### Framework & Core
| Package | Size | Why | Alternatives |
|---------|------|-----|--------------|
| `next` | - | Framework | None |
| `react` | 42 KB | UI library | None |
| `react-dom` | 130 KB | Renderer | None |

### Database & Auth
| Package | Size | Why | Alternatives |
|---------|------|-----|--------------|
| `@supabase/supabase-js` | 50 KB | Database | None (required) |
| `@supabase/ssr` | 5 KB | Server auth | None (required) |

### Data Visualization
| Package | Size | Why | Alternatives |
|---------|------|-----|--------------|
| `d3-scale` | 3 KB | Chart scales | None (minimal) |
| `d3-shape` | 4 KB | Chart shapes | None (minimal) |
| `d3-array` | 3 KB | Data utils | Could use native, but convenient |

### Total Production Deps
~30 packages, ~102 KB shared bundle ✅

---

## 🛠 Custom Implementations

We've replaced heavy dependencies with custom implementations:

### Replaced recharts (5.2 MB → 10 KB)
- **Custom:** `/components/charts/LineChart.tsx`
- **Uses:** d3-scale, d3-shape, d3-array
- **Savings:** 5.19 MB
- **Features:** Line charts, reference lines, tooltips, responsive

### Replaced lucide-react (150 KB → 3 KB)
- **Custom:** `/components/ui/Icon.tsx`
- **Uses:** Inline SVG paths (33 icons)
- **Savings:** 147 KB
- **Features:** All commonly used icons, size control, className support

### Replaced framer-motion (5.3 MB → 1 KB)
- **Custom:** `/styles/animations.css`
- **Uses:** CSS keyframes
- **Savings:** 5.29 MB
- **Features:** Fade-ins, slides, pulses, particles, hover effects

**Total savings from custom implementations: 10.6+ MB** 🎉

---

## 📈 Metrics & Monitoring

### Weekly Check
```bash
# Check bundle size
pnpm run build

# Alert if any route > 150 KB
```

### Monthly Audit
```bash
# Full bundle analysis
ANALYZE=true pnpm run build
open .next/analyze/client.html

# Check for unused deps
npx depcheck

# Check for outdated deps
pnpm outdated

# Check for duplicates
pnpm dedupe --check
```

### Quarterly Review
- Review all dependencies (still needed?)
- Check for lighter alternatives
- Update this document
- Clean up unused code

---

## ⚠️ Red Flags

Watch out for these warning signs:

### During Development
- ❌ Bundle size suddenly increases
- ❌ Build time > 15 seconds
- ❌ New dependency > 50 KB
- ❌ Importing entire library instead of specific functions

### Code Review
- ❌ `import _ from 'lodash'` (use native JS)
- ❌ `import * as Icons from 'lucide-react'` (use custom icons)
- ❌ `import moment from 'moment'` (use native Date)
- ❌ New chart library (use custom D3)
- ❌ New animation library (use CSS)

### Pull Requests
- ❌ No bundle analysis included
- ❌ Package.json changes without justification
- ❌ Large dependency added without approval

---

## 🎓 Best Practices

### Import Strategically

```tsx
// ❌ Bad - Imports entire library
import _ from 'lodash'
const result = _.chunk(array, 2)

// ✅ Good - Use native JS
const result = array.reduce((acc, _, i) =>
  i % 2 === 0 ? [...acc, array.slice(i, i + 2)] : acc, []
)

// ❌ Bad - Imports all icons
import { User, Settings, Bell } from 'lucide-react'

// ✅ Good - Use custom icons
import { Icon } from '@/components/ui/Icon'
<Icon name="user" />
```

### Lazy Load Heavy Components

```tsx
// ❌ Bad - Loads immediately
import HeavyChart from './HeavyChart'

// ✅ Good - Lazy loads
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
})
```

### Use Native APIs

```tsx
// ❌ Bad - 300 KB dependency
import moment from 'moment'
const formatted = moment(date).format('MMM DD, YYYY')

// ✅ Good - Native API (0 KB)
const formatted = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
}).format(date)
```

---

## 📚 Resources

### Tools
- [Bundlephobia](https://bundlephobia.com) - Check package sizes before installing
- [npm trends](https://npmtrends.com) - Compare packages
- [Can I Use](https://caniuse.com) - Check browser API support

### Alternatives Guides
- [You Don't Need Lodash](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore)
- [You Don't Need Moment](https://github.com/you-dont-need/You-Dont-Need-Momentjs)
- [You Don't Need jQuery](https://github.com/you-dont-need/You-Dont-Need-jQuery)

### Learning
- [JavaScript Bundle Size](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
- [Web Performance](https://web.dev/performance/)

---

## 📝 Change Log

| Date | Change | Impact |
|------|--------|--------|
| 2026-01-29 | Initial policy created | Baseline established |
| 2026-01-29 | Removed recharts | -5.2 MB |
| 2026-01-29 | Removed lucide-react | -150 KB |
| 2026-01-29 | Removed framer-motion | -5.3 MB |

---

**Remember:** The best dependency is no dependency. Build custom when possible!
