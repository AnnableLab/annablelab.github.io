# Content Changes During Migration

## Summary
While most markdown content was preserved, there were **intentional changes** made to adapt from Jekyll to Astro:

## Changes Made

### 1. **Frontmatter Updates** (All Files)
**Original:**
```yaml
---
layout: default
title: Page Title
permalink: /page-url
redirect_from:
  - /pages/page-url/
  - /pages/page-url.html
---
```

**New:**
```yaml
---
layout: ../layouts/BaseLayout.astro
title: Page Title
---
```

**Impact:** Removed `permalink` and `redirect_from` (handled differently in Astro)

---

### 2. **Image Paths** (architecture.md, trace.md)
**Original:**
```markdown
<img src="/assets/img/emhass_diagram.png" alt="..." width="800">
```

**New:**
```markdown
<img src="/img/emhass_diagram.png" alt="..." width="800">
```

**Impact:** Changed `/assets/img/` → `/img/` (Astro's public directory structure)

---

### 3. **Jekyll Liquid Tags → Markdown Code Blocks** (setup.md, emhass.md, dashboard.md, automation.md)

**Original (Jekyll syntax):**
```markdown
{% highlight yaml %} {% include emhass.yaml %} {% endhighlight %}
```

**New (Standard markdown):**
````markdown
```yaml
[Full YAML content embedded directly]
```
````

**Files affected:**
- `setup.md`: Embedded `emhass.yaml` (19 lines of YAML)
- `emhass.md`: Embedded `emhass_script.yaml` (~212 lines of YAML)
- `dashboard.md`: Embedded `dashboard.yaml` (~163 lines of YAML)
- `automation.md`: Embedded `battery_automation.yaml` (~110 lines) and `curtailment.yaml` (~80 lines)

**Impact:** YAML content that was in separate `_includes/*.yaml` files is now embedded directly in the markdown files

---

### 4. **Character Encoding Fixes**
**Original:**
```
ΓåÆ [Prerequisites](/prerequisites)
```

**New:**
```
→ [Prerequisites](/prerequisites)
```

**Impact:** Fixed arrow character encoding issues

---

### 5. **Trailing Newlines**
Added consistent trailing newlines to all files (standard practice).

---

## What Stayed the Same

✅ **All prose/text content** - No wording changes  
✅ **All links and URLs** - Same internal and external links  
✅ **All code examples** - Same technical content  
✅ **All headings and structure** - Same document hierarchy  
✅ **All lists and formatting** - Same markdown formatting  

## Reasoning

These changes were necessary because:

1. **Frontmatter:** Astro uses a different layout system than Jekyll
2. **Image paths:** Astro serves static files from `public/` directory at the root URL
3. **YAML embeds:** Astro doesn't have Jekyll's `{% include %}` system, so content was embedded as you requested ("code blocks for now")
4. **Character encoding:** Fixed display issues

## Verification

To verify no content was lost, you can:

```bash
# Compare specific sections from git
git show HEAD~1:pages/automation.md
git diff --no-index HEAD~1:pages/automation.md src/pages/automation.md
```

All the actual YAML content, documentation text, and technical information remains **identical** - only the presentation format changed to work with Astro's architecture.

