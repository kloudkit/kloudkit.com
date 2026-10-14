import { useData, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { defineComponent, h } from 'vue'
import CroppedImage from './components/CroppedImage.vue'
import SeeAlso from './components/SeeAlso.vue'
import type { ThemeConfig } from './site'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/fira-sans'
import '@fontsource/fira-sans/500.css'
import '@fontsource/fira-sans/600.css'
import '@fontsource/fira-sans/700.css'
import '@fontsource/fira-sans/400-italic.css'
import '@fontsource/fira-sans/500-italic.css'
import '@fontsource/victor-mono/400-italic.css'
import 'virtual:kloudkit-brand'
import './tokens.css'
import './styles.css'

export default {
  extends: DefaultTheme,
  Layout: defineComponent(() => {
    const { theme } = useData<ThemeConfig>()

    // The home hero: the wordmark in place of the name (which stays in the <h1> for search and
    // screen readers), and the banner's animated part as the image. See defineSite().
    return () => h(DefaultTheme.Layout, null, {
      'aside-outline-after': () => h(SeeAlso),
      'home-hero-info-before': () => h(CroppedImage, { class: 'HeroLogo', crop: theme.value.heroLogo, 'aria-hidden': 'true' }),
      'home-hero-image': () => h(CroppedImage, { class: 'HeroImage', crop: theme.value.heroImage }),
    })
  }),
} satisfies Theme
