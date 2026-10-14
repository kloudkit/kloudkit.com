import { defineSite } from '../../../theme/site'

export default defineSite({
  id: 'portico',
  title: 'Portico',
  description: 'Run every service of a web app and put one origin in front of them: one port, no CORS.',
  tagline: 'Many services, one front door',
  wordmark: 'portico',
  accent: 'peach',
  secondary: 'teal',
  font: { package: '@fontsource-variable/comfortaa', family: 'Comfortaa Variable' },
  logo: { imageWidth: 1073, x: 22, y: 22, width: 1030, height: 312 },
  banner: {
    alt: 'Portico routing port 4400 to a frontend on /, an API on /api and websockets on /ws',
    imageWidth: 1280, x: 810, y: 70, width: 430, height: 230,
  },
  operatingSystem: 'Linux',

  sidebar: [
    {
      text: 'Guide',
      items: [
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Configuration', link: '/guide/configuration' },
        { text: 'Routing', link: '/guide/routing' },
        { text: 'Containers', link: '/guide/containers' },
        { text: 'Running Services', link: '/guide/running-services' },
        { text: 'Proxy', link: '/guide/proxy' },
      ],
    },
    {
      text: 'Reference',
      items: [
        { text: 'Commands', link: '/reference/commands' },
        { text: 'Configuration File', link: '/reference/configuration' },
      ],
    },
  ],
})
