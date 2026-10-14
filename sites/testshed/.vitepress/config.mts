import { defineSite } from '../../../theme/site'

export default defineSite({
  id: 'testshed',
  title: 'TestShed',
  description: 'A pytest plugin that hands your tests real Docker containers and Playwright browsers as fixtures.',
  tagline: 'The support crew for your test bench',
  wordmark: '<strong>test</strong>shed',
  accent: 'green',
  secondary: 'mauve',
  font: { package: '@fontsource-variable/figtree', family: 'Figtree Variable' },
  logo: { imageWidth: 498.5, x: 28, y: 17, width: 449, height: 89 },
  banner: {
    alt: 'A pytest test using the shed fixture, typing itself out and passing',
    imageWidth: 880, x: 482, y: 30, width: 372, height: 152,
  },
  operatingSystem: 'Linux, macOS, Windows',
  socialLinks: [{ icon: 'pypi', link: 'https://pypi.org/project/testshed/' }],

  sidebar: [
    {
      text: 'Guide',
      items: [
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Images', link: '/guide/images' },
        { text: 'Containers', link: '/guide/containers' },
        { text: 'Inside a Container', link: '/guide/inside-a-container' },
        { text: 'Readiness Probes', link: '/guide/readiness-probes' },
        { text: 'Playwright Browsers', link: '/guide/playwright-browsers' },
        { text: 'Cleanup and Parallel Runs', link: '/guide/cleanup' },
      ],
    },
    {
      text: 'Reference',
      items: [
        { text: 'Fixtures and Markers', link: '/reference/fixtures' },
        { text: 'Command-Line Options', link: '/reference/options' },
      ],
    },
  ],
})
