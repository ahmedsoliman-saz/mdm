---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

## Project-Specific Constraints (Sazience MDM Prototype)

This project is an enterprise MDM platform prototype using **Ant Design 5**. The design must feel like polished, professional enterprise software — not a consumer app or creative portfolio.

**Component Library**: Use Ant Design 5 components exclusively. Do NOT write arbitrary HTML/CSS where an Ant Design component exists. Use `antd` imports: `Table`, `Card`, `Statistic`, `Tag`, `Badge`, `Drawer`, `Modal`, `Form`, `Steps`, `Timeline`, `Tree`, `Descriptions`, `Space`, `Button`, `Select`, `DatePicker`, etc.

**Theme**:
- Light theme only — no dark mode
- Primary color: `#1677ff` (Ant Design default blue)
- Success: `#52c41a`, Warning: `#faad14`, Error: `#ff4d4f`
- Backgrounds: white (`#ffffff`) and light gray (`#f5f5f5`)
- Subtle card shadows, not flat boxes

**Typography**: Use Ant Design's default typography system. Do NOT import external fonts.

**Charts**: Use **Recharts** for all charts and data visualizations (bar charts, line charts, area charts, pie/donut charts, radar charts). Import from `recharts`.

**Data**: All data is hardcoded mock data in `src/data/`. No API calls, no fetch, no async data loading.

**Layout**: Every page uses the shared `AppLayout` with persistent sidebar and header. Do not build standalone pages outside the layout shell.

**DQ Badges**: Data Quality score badges follow this rule — green ≥85, yellow 60–84, red <60. Use Ant Design `Badge` or `Tag` with the appropriate color.

**Navigation**: Use React Router v6 (`useNavigate`, `Link`, `useParams`). All sidebar links, row clicks, and breadcrumbs must be wired to real routes.

**Mock Data Minimums**: Entity browse needs 50+ records, matching proposals 20+, DQ issues 30+, tasks 15+, audit log 50+.

**Tone**: Data-dense but organized. Generous use of Ant Design `Table`, `Card`, and `Descriptions` components. Avoid decorative flourishes — every element should serve a functional purpose.