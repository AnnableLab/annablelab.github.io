# YAML Files Extracted to Separate Files

## ✅ Completed

All YAML code blocks have been extracted from the markdown files into separate files in `src/includes/`, similar to Jekyll's `_includes/` pattern.

## File Structure

```
src/
├── includes/                      # YAML configuration files (like Jekyll's _includes)
│   ├── emhass.yaml               # REST command configuration (19 lines)
│   ├── emhass_script.yaml        # Main EMHASS script (212 lines)
│   ├── dashboard.yaml            # ApexCharts dashboard config (163 lines)
│   ├── battery_automation.yaml   # Battery control automation (110 lines)
│   └── curtailment.yaml          # Negative price handling (80 lines)
│
├── components/
│   ├── CodeBlock.astro           # Component to display code blocks
│   └── Redirect.astro            # Component for old URL redirects
│
├── pages/
│   ├── setup.astro               # Converted from .md, imports emhass.yaml
│   ├── emhass.astro              # Converted from .md, imports emhass_script.yaml
│   ├── dashboard.astro           # Converted from .md, imports dashboard.yaml
│   ├── automation.astro          # Converted from .md, imports battery_automation.yaml & curtailment.yaml
│   ├── index.md                  # (remains markdown)
│   ├── architecture.md           # (remains markdown)
│   ├── prerequisites.md          # (remains markdown)
│   ├── conclusion.md             # (remains markdown)
│   └── trace.md                  # (remains markdown)
```

## How It Works

### Pages with YAML Includes

Pages that need to display YAML content were converted from `.md` to `.astro` format. They now:

1. **Import YAML files** using Vite's `?raw` import:
   ```astro
   import emhassYaml from '../includes/emhass.yaml?raw';
   ```

2. **Display YAML in code blocks** using the CodeBlock component:
   ```astro
   <CodeBlock code={emhassYaml} lang="yaml" />
   ```

### Example: setup.astro

**Before (Jekyll markdown):**
```markdown
{% highlight yaml %} {% include emhass.yaml %} {% endhighlight %}
```

**After (Astro):**
```astro
---
import emhassYaml from '../includes/emhass.yaml?raw';
---
<CodeBlock code={emhassYaml} lang="yaml" />
```

## Benefits

1. ✅ **Separate YAML files** - Easy to edit and maintain
2. ✅ **No duplication** - Single source of truth for each YAML config
3. ✅ **Clean content** - Keeps page content focused on documentation
4. ✅ **Type safety** - Vite validates imports at build time
5. ✅ **Similar to Jekyll** - Familiar pattern for content authors

## Files Converted

| Page | Original | New | YAML Includes |
|------|----------|-----|---------------|
| Setup | `setup.md` | `setup.astro` | `emhass.yaml` |
| EMHASS | `emhass.md` | `emhass.astro` | `emhass_script.yaml` |
| Dashboard | `dashboard.md` | `dashboard.astro` | `dashboard.yaml` |
| Automation | `automation.md` | `automation.astro` | `battery_automation.yaml`, `curtailment.yaml` |

## Editing YAML Files

To update any YAML configuration:

1. Edit the file in `src/includes/`
2. Run `npm run dev` to see changes locally
3. Build with `npm run build`

The YAML content will automatically be embedded in the generated HTML pages.

## Build Verification

✅ Build completed successfully
✅ All 16 pages generated
✅ YAML content properly embedded in HTML
✅ Code blocks display correctly

## Testing

Run locally to verify:
```bash
npm run dev
# Visit http://localhost:4321
```

All pages with YAML includes should display the code blocks correctly.

