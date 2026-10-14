import { defineSite } from '../../../theme/site'

export default defineSite({
  id: 'looking-glass',
  hostname: 'https://lookingglass.kloudkit.com',
  title: 'Looking Glass',
  description: 'A drop-in HTTP request reflector: every request, on any method and path, answered with exactly what arrived.',
  tagline: 'See exactly what is hitting your service',
  // The logo's two o's: lavender, then yellow.
  wordmark: 'l<span style="color:var(--lavender)">o</span><span style="color:var(--yellow)">o</span>king glass',
  accent: 'yellow',
  secondary: 'lavender',
  font: { package: '@fontsource-variable/outfit', family: 'Outfit Variable' },
  // The byline sits under the "g" of "looking", so it is cut out rather than cropped off.
  logo: {
    imageWidth: 1081.34, imageHeight: 409.9, x: 25, y: 25, width: 1018, height: 362,
    exclude: { x: 870, y: 255, width: 180, height: 155 },
  },
  banner: {
    alt: 'A POST request on the left and its JSON reflection on the right',
    imageWidth: 1280, x: 688, y: 46, width: 524, height: 278,
  },
  operatingSystem: 'Linux (Docker)',
  socialLinks: [{ icon: 'docker', link: 'https://github.com/kloudkit/looking-glass/pkgs/container/looking-glass' }],

  sidebar: [
    {
      text: 'Guide',
      items: [
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Response Formats', link: '/guide/response-formats' },
        { text: 'Activity Log', link: '/guide/activity-log' },
        { text: 'Building From Source', link: '/guide/building-from-source' },
      ],
    },
    {
      text: 'Reference',
      items: [
        { text: 'Configuration', link: '/reference/configuration' },
        { text: 'JSON Response', link: '/reference/json-response' },
      ],
    },
  ],
})
