import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineConfig, type DefaultTheme, type HeadConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'
import type { Crop } from './components/CroppedImage.vue'
import italicSmallRenderer from './italicSmallRenderer'

type Accent =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach'
  | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender'

export interface SiteOptions {
  /** Repo name under github.com/kloudkit, and the folder under sites/. */
  id: string
  title: string
  description: string
  /** The product's slogan, as in its banner: the home hero's text, and the social card's alt. */
  tagline: string
  /** Defaults to https://<id>.kloudkit.com. */
  hostname?: string
  /** Catppuccin Frappé accent for links, buttons and the active sidebar item. */
  accent: Accent
  /** The logo's other colour: the hero tagline, and the second half of the feature bars. */
  secondary: Accent
  /** The nav title, written like the logo; wrap a bold part in <strong>. Defaults to the title. */
  wordmark?: string
  /** The logo's font: an @fontsource-variable package and its family name. */
  font: { package: string, family: string }
  /** The wordmark, cropped out of docs/public/logo.svg for the home hero. */
  logo: Omit<Crop, 'src'>
  /** The animated part of docs/public/banner.svg, as the home hero image. */
  banner: Omit<Crop, 'src'>
  /** schema.org SoftwareApplication field. */
  operatingSystem: string
  /** Links besides GitHub (package registries); also the page's schema.org sameAs. */
  socialLinks?: DefaultTheme.SocialLink[]
  /** Groups of pages; each group also becomes a nav link to its first page. */
  sidebar: DefaultTheme.SidebarItem[]
}

/** What the theme reads from themeConfig, beyond VitePress's own keys. */
export interface ThemeConfig extends DefaultTheme.Config {
  heroLogo: Crop
  heroImage: Crop
}

// The same organization kloudkit.com describes, linked by @id.
const publisher = {
  '@type': 'Organization',
  '@id': 'https://kloudkit.com/#org',
  name: 'KloudKIT',
  url: 'https://kloudkit.com/',
  logo: 'https://kloudkit.com/logo.png',
}

// Imports the site's accent and logo font, so a site needs no theme code of its own.
// The CSS variables that use them are set by a <style> in head, so they are in the server-rendered HTML too.
function brand({ accent, font }: SiteOptions) {
  const id = 'virtual:kloudkit-brand'

  return {
    name: 'kloudkit-brand',
    resolveId: (source: string) => (source === id ? `\0${id}` : undefined),
    load: (source: string) => source === `\0${id}`
      ? `import '@catppuccin/vitepress/theme/frappe/${accent}.css'\nimport '${font.package}'`
      : undefined,
  }
}

export function defineSite(site: SiteOptions) {
  const { id, title, description, tagline, sidebar } = site
  const hostname = site.hostname ?? `https://${id}.kloudkit.com`
  const repo = `https://github.com/kloudkit/${id}`
  const socialLinks = [{ icon: 'github', link: repo }, ...(site.socialLinks ?? [])]
  const firstPage = (group: DefaultTheme.SidebarItem) => group.items?.[0]?.link ?? group.link

  const website = { '@type': 'WebSite', name: title, url: `${hostname}/`, publisher }

  return defineConfig<ThemeConfig>({
    title,
    // Same separator as the READMEs' "KloudKIT • Portico".
    titleTemplate: `:title • ${title}`,
    description,
    appearance: 'force-dark',
    cleanUrls: true,
    lastUpdated: true,
    srcDir: './docs',
    outDir: `../../dist/${id}`,
    srcExclude: ['partials/**'],

    sitemap: { hostname },

    // Every crawler is welcome, AI ones included, and pointed at the sitemap. _headers is read
    // by Cloudflare Pages: the raw .md pages (for LLMs) are served as Markdown.
    async buildEnd({ outDir }) {
      await writeFile(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${hostname}/sitemap.xml\n`)
      await writeFile(join(outDir, '_headers'), [
        '/*',
        '  X-Content-Type-Options: nosniff',
        '  Referrer-Policy: strict-origin-when-cross-origin',
        '',
        '/*.md',
        '  Content-Type: text/markdown; charset=utf-8',
        '',
        '/assets/*',
        '  Cache-Control: public, max-age=31536000, immutable',
        '',
      ].join('\n'))
    },

    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
      ['meta', { name: 'theme-color', content: '#303446' }],
      ['style', {}, `:root{--font-brand:"${site.font.family}",var(--font-sans);--brand-secondary:var(--${site.secondary})}`],
      ['meta', { property: 'og:site_name', content: title }],
      ['meta', { property: 'og:image', content: `${hostname}/og-image.png` }],
      ['meta', { property: 'og:image:width', content: '1280' }],
      ['meta', { property: 'og:image:height', content: '640' }],
      ['meta', { property: 'og:image:alt', content: `${title} — ${tagline.toLowerCase()} by KloudKIT` }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:image', content: `${hostname}/og-image.png` }],
    ],

    // Every home page gets the same hero: the name, the slogan and the same two buttons.
    // index.md only adds its own tagline (and features).
    transformPageData(pageData) {
      if (pageData.relativePath !== 'index.md') return

      pageData.title = `KloudKIT • ${title}`
      pageData.titleTemplate = false
      pageData.frontmatter.hero = {
        name: title,
        text: tagline,
        actions: [
          { theme: 'brand', text: 'Get Started', link: firstPage(sidebar[0]) },
          { theme: 'alt', text: 'GitHub', link: repo },
        ],
        ...pageData.frontmatter.hero,
      }
    },

    transformHead: ({ pageData }) => {
      const isHome = pageData.relativePath === 'index.md'
      const pageTitle = isHome ? pageData.title : `${pageData.title} • ${title}`
      const pageDescription = pageData.description || pageData.frontmatter.description || description
      const url = `${hostname}/` + pageData.relativePath.replace(/(index)?\.md$/, '').replace(/\/$/, '')
      const modified = pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : undefined

      const head: HeadConfig[] = [
        ['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }],
        ['meta', { property: 'og:title', content: pageTitle }],
        ['meta', { property: 'og:description', content: pageDescription }],
        ['meta', { property: 'og:url', content: url }],
        ['meta', { name: 'twitter:title', content: pageTitle }],
        ['meta', { name: 'twitter:description', content: pageDescription }],
        ['link', { rel: 'canonical', href: url }],
        ['script', { type: 'application/ld+json' }, JSON.stringify(
          isHome
            ? [
                { ...website, '@context': 'https://schema.org' },
                {
                  '@context': 'https://schema.org',
                  '@type': 'SoftwareApplication',
                  name: title,
                  description,
                  url: `${hostname}/`,
                  image: `${hostname}/og-image.png`,
                  applicationCategory: 'DeveloperApplication',
                  operatingSystem: site.operatingSystem,
                  license: 'https://opensource.org/licenses/MIT',
                  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                  sameAs: socialLinks.map(({ link }) => link),
                  publisher,
                },
              ]
            : {
                '@context': 'https://schema.org',
                '@type': 'TechArticle',
                headline: pageData.title || title,
                description: pageDescription,
                url,
                image: `${hostname}/og-image.png`,
                ...(modified && { dateModified: modified }),
                isPartOf: website,
                publisher,
              }
        )],
      ]

      if (modified && !isHome) {
        head.push(['meta', { property: 'article:modified_time', content: modified }])
      }

      return head
    },

    themeConfig: {
      nav: sidebar.map(group => ({ text: group.text!, link: firstPage(group)! })),
      sidebar,
      // The full lockup is unreadable at nav height: icon plus the name, in the logo font.
      logo: '/icon.svg',
      siteTitle: site.wordmark ?? title,
      outline: 'deep',
      search: { provider: 'local' },
      socialLinks,

      heroLogo: { src: '/logo.svg', alt: '', ...site.logo },
      heroImage: { src: '/banner.svg', ...site.banner },

      editLink: {
        pattern: `https://github.com/kloudkit/kloudkit.com/edit/main/sites/${id}/docs/:path`,
        text: 'Edit this page on GitHub',
      },

      docFooter: { next: false, prev: false },

      footer: {
        message: 'Released under the MIT License',
        copyright: `Copyright &copy; ${new Date().getFullYear()} <a href="https://kloudkit.com">KloudKIT</a>`,
      },
    },

    markdown: {
      // Like ws-docs: *(…)* renders as <em class="small">.
      config: md => {
        md.use(italicSmallRenderer)
      },

      theme: 'catppuccin-frappe',

      codeTransformers: [
        {
          // Tag comment tokens so CSS can set them in Victor Mono, independent of the theme's colours.
          preprocess(code, options) {
            options.includeExplanation = true
            return code
          },
          span(node, _line, _col, _lineEl, token) {
            if (token.explanation?.some(e => e.scopes.some(s => s.scopeName.startsWith('comment')))) {
              this.addClassToHast(node, 'comment')
            }
          },
        },
      ],

      container: {
        tipLabel: '💡 TIP',
        warningLabel: '⚠️ WARNING',
        dangerLabel: '🚨 DANGER',
        infoLabel: 'ℹ️ INFO',
      },
    },

    vite: {
      plugins: [
        brand(site),
        llmstxt({
          title,
          description,
          domain: hostname,
          sidebar: sidebar => (Array.isArray(sidebar) ? sidebar : sidebar?.['/']),
          customLLMsTxtTemplate: '# {title}\n\n{description}\n\n## Table of Contents\n\n{toc}\n',
        }),
      ],
    },
  })
}
