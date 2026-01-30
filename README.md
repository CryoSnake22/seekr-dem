# Seekr Frontend

AI-powered career intelligence and resume optimization platform for CS students and new grads.

---

## 🚀 Quick Start

**Prerequisites:** Node.js + pnpm

```bash
# Install dependencies
pnpm install

# Set up environment variables (create .env.local)
# See "Environment Setup" section below

# Run development server
pnpm dev

# Open http://localhost:3000
```

### Environment Setup

Create `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
BACKEND_API_URL=http://localhost:8000
```

---

## 📊 Performance

**Current Bundle Size:** 107 KB (dashboard) ✅
**Performance Budget:** 150 KB max per route
**Status:** Optimized (72.5% reduction from 389 KB baseline)

### Quick Checks

```bash
# Check bundle size
pnpm build

# Analyze bundle composition
pnpm analyze

# Check for banned dependencies
pnpm check-deps

# Verify all routes under budget
pnpm bundle-check
```

### Documentation

- **[PERFORMANCE.md](./PERFORMANCE.md)** - Performance guidelines and best practices
- **[docs/DEPENDENCIES.md](./docs/DEPENDENCIES.md)** - Dependency management policy
- **[Plan File](../.claude/plans/composed-hopping-book.md)** - Complete optimization history

---

## 🚫 Banned Dependencies

**NEVER install these without approval:**

- ❌ Chart libraries: `recharts`, `chart.js`, `victory` → Use `/components/charts/LineChart.tsx`
- ❌ Icon libraries: `lucide-react`, `react-icons`, `heroicons` → Use `/components/ui/Icon.tsx`
- ❌ Animation: `framer-motion`, `react-spring`, `anime.js` → Use CSS in `/styles/animations.css`
- ❌ Utilities: `lodash`, `moment`, `underscore` → Use native JavaScript

**See [docs/DEPENDENCIES.md](./docs/DEPENDENCIES.md) for full list and alternatives.**

---

## 🛠 Tech Stack

### Framework & Core
- **Next.js 15** (App Router)
- **React 19** (Server & Client Components)
- **TypeScript** (Strict mode)

### Database & Auth
- **Supabase** (Postgres + Auth + RLS)
- **@supabase/ssr** (Server-side auth)

### Styling
- **Tailwind CSS** (Utility-first CSS)
- **Custom CSS animations** (No framer-motion)

### Custom Implementations
- **Custom D3 charts** (No recharts) - `/components/charts/LineChart.tsx`
- **Custom SVG icons** (No lucide-react) - `/components/ui/Icon.tsx`
- **CSS animations** (No framer-motion) - `/styles/animations.css`

---

## 🛠 Custom Implementations

We've built lightweight custom components to replace heavy libraries:

### Charts (replaces recharts - 5.2 MB → 2 KB)
**File:** `/components/charts/LineChart.tsx`
**Uses:** d3-scale, d3-shape, d3-array (~10 KB total)

```tsx
import { LineChart } from '@/components/charts/LineChart'

<LineChart
  data={chartData}
  lines={[{ dataKey: 'score', stroke: '#8B5CF6' }]}
  yAxisFormatter={(v) => `${v}%`}
/>
```

### Icons (replaces lucide-react - 150 KB → 3 KB)
**File:** `/components/ui/Icon.tsx`
**Icons:** 33 commonly used icons

```tsx
import { Icon } from '@/components/ui/Icon'

<Icon name="user" size={24} className="text-primary" />
```

### Animations (replaces framer-motion - 5.3 MB → 1 KB)
**File:** `/styles/animations.css`
**Animations:** Fade-ins, slides, pulses, particles

```tsx
<div className="animate-fade-in">Content</div>
<div className="animate-fade-in-up">Slides up</div>
```

---

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, signup, reset)
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── (marketing)/       # Public landing pages
│   └── api/               # API routes
├── components/            # React components
│   ├── charts/           # Custom chart components (D3-based)
│   ├── dashboard/        # Dashboard-specific components
│   ├── landing/          # Landing page components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configs
│   ├── supabase/        # Supabase client configs
│   └── utils.ts         # Utility functions
├── styles/               # Global styles and animations
│   ├── globals.css      # Global styles
│   └── animations.css   # CSS keyframe animations
├── docs/                 # Documentation
│   ├── DEPENDENCIES.md   # Dependency policy
│   └── PRE_COMMIT_HOOK.sh # Git hook template
├── PERFORMANCE.md        # Performance guidelines
├── next.config.js        # Next.js configuration
└── package.json          # Dependencies & scripts
```

---

## 🔧 Development Workflow

### Before Adding Dependencies

1. **Check if it's banned** (see above or `docs/DEPENDENCIES.md`)
2. **Check bundle size:** `npm info <package> dist.unpackedSize`
3. **Consider alternatives:** Can you build it custom? Use native APIs?
4. **Get approval if > 50 KB** (create issue with justification)
5. **Run analyzer:** `pnpm analyze` after installing
6. **Document decision** in `docs/DEPENDENCIES.md`

### Before Committing

```bash
# Type check & build
pnpm build

# Check for banned deps (if package.json changed)
pnpm check-deps

# Run bundle analyzer (if code changed significantly)
pnpm analyze

# Verify bundle size is still under budget
pnpm bundle-check
```

### Optional: Install Git Hook

```bash
# Install pre-commit hook to automate checks
cp docs/PRE_COMMIT_HOOK.sh ../.git/hooks/pre-commit
chmod +x ../.git/hooks/pre-commit
```

---

## 📈 Performance History

| Date | Bundle Size | Change | Notes |
|------|-------------|--------|-------|
| 2026-01-29 | 107 KB | -282 KB | Completed 7-phase optimization |
| - | 389 KB | Baseline | Before optimization |

### Optimization Timeline

1. ✅ **Phase 1:** Measurement & Analysis (389 KB baseline)
2. ✅ **Phase 2:** Replace Recharts with custom D3 charts (-37 KB)
3. ✅ **Phase 3:** Replace Lucide React with custom icons (-5 KB)
4. ✅ **Phase 4:** Replace Framer Motion with CSS animations (-38 KB)
5. ✅ **Phase 5:** Optimize data fetching (~200ms faster)
6. ✅ **Phase 6:** Code splitting (13.5 KB deferred)
7. ✅ **Phase 7:** Bug fix & final optimization (**107 KB final**)

**Total improvement: 72.5% reduction (389 KB → 107 KB)**

---

## 🎯 Performance Budget

| Route | Max First Load JS | Current | Status |
|-------|------------------|---------|--------|
| Dashboard | 150 KB | 107 KB | ✅ Under budget |
| Landing | 150 KB | 114 KB | ✅ Under budget |
| Profile | 150 KB | 107 KB | ✅ Under budget |
| Other pages | 120 KB | ~103 KB | ✅ Under budget |

**All routes comfortably under budget!**

---

## 📝 Available Scripts

```bash
# Development
pnpm dev              # Start dev server on localhost:3000
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Performance & Analysis
pnpm analyze          # Build with bundle analyzer
pnpm check-deps       # Check for banned dependencies
pnpm bundle-check     # Verify all routes under budget (runs build first)
```

---

## 🐛 Common Issues

### Build Fails After Adding Dependency

1. Check if it's a banned package: `pnpm check-deps`
2. Remove it: `pnpm remove <package>`
3. Find alternative in `docs/DEPENDENCIES.md`
4. Build custom if needed (see examples above)

### Bundle Size Increased

1. Run analyzer: `pnpm analyze`
2. Check recent commits: `git log --oneline -10`
3. Check package.json changes: `git diff main -- package.json`
4. See [PERFORMANCE.md](./PERFORMANCE.md#-performance-regression-protocol)

### Module Not Found Error

1. Clear build cache: `rm -rf .next`
2. Rebuild: `pnpm build`
3. If still failing, check `next.config.js` for custom webpack config (should be none)

---

## 📚 Key Documentation

### Setup & Configuration
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase setup guide (if exists)
- [EMAIL_CONFIRMATION.md](./EMAIL_CONFIRMATION.md) - Email confirmation behavior (if exists)
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Current phase & architecture (if exists)

### Performance & Dependencies
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Complete performance guidelines ⭐
- **[docs/DEPENDENCIES.md](./docs/DEPENDENCIES.md)** - Dependency policy ⭐
- [next.config.js](./next.config.js) - Next.js configuration (with warnings)
- [Plan File](../.claude/plans/composed-hopping-book.md) - Optimization history

---

## 🤝 Contributing

### Pull Request Checklist

- [ ] No banned dependencies added
- [ ] Bundle size checked (`pnpm analyze`)
- [ ] All routes under budget (`pnpm bundle-check`)
- [ ] Build passes (`pnpm build`)
- [ ] Types checked (included in build)
- [ ] Documented if adding new dependency

### Performance Requirements

Every PR that modifies code MUST:
1. Keep bundle size under 150 KB per route
2. Not add banned dependencies
3. Include bundle analysis if package.json changed

---

## 📚 Resources

### Tools
- [Bundlephobia](https://bundlephobia.com) - Check package sizes
- [npm trends](https://npmtrends.com) - Compare packages
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audits

### Learning
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation
- [You Don't Need Lodash](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore)
- [You Don't Need Moment](https://github.com/you-dont-need/You-Dont-Need-Momentjs)
- [Web Performance](https://web.dev/performance/)

---

## 📄 License

Private - Seekr Project

---

**Remember:** The best dependency is no dependency. Build custom when possible! 🚀

For detailed performance guidelines, see [PERFORMANCE.md](./PERFORMANCE.md).
