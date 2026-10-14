// Assembles the landing page into dist/landing: the hand-written files, the brand files,
// the shared tokens and self-hosted fonts in place of Google Fonts.
import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const out = 'dist/landing'

// Brand files served from the site root, by the URLs pages and other sites already use.
const brand = {
  'favicon.ico': 'kloudkit-favicon.ico',
  'favicon.svg': 'kloudkit-favicon.svg',
  'logo.svg': 'kloudkit-avatar.svg',
  'logo.png': 'kloudkit-avatar.png',
  'og.png': 'kloudkit-social.png',
}

// [package, family, weight], latin subset only.
const fonts = [
  ['nunito-sans', 'Nunito Sans', 300],
  ['nunito-sans', 'Nunito Sans', 400],
  ['nunito-sans', 'Nunito Sans', 600],
  ['nunito-sans', 'Nunito Sans', 700],
  ['fira-code', 'Fira Code', 400],
]

await rm(out, { recursive: true, force: true })
await cp('landing', out, { recursive: true })
await cp('theme/tokens.css', join(out, 'tokens.css'))

for (const [to, from] of Object.entries(brand)) {
  await cp(join('brand', from), join(out, to))
}
await mkdir(join(out, 'fonts'), { recursive: true })

const faces = []

for (const [pkg, family, weight] of fonts) {
  const file = `${pkg}-latin-${weight}-normal.woff2`

  await cp(`node_modules/@fontsource/${pkg}/files/${file}`, join(out, 'fonts', file))

  faces.push(`@font-face {
  font-family: "${family}";
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url(/fonts/${file}) format("woff2");
}`)
}

await writeFile(join(out, 'fonts.css'), faces.join('\n\n') + '\n')

console.log(`landing → ${out}`)
