<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

// One region of an image, cropped with CSS so the file itself is untouched. Values are in the
// image's own units (an SVG's viewBox, a bitmap's pixels): the whole image's width, and the box.
// `exclude` cuts a further rectangle out of that box (e.g. a byline) and needs `imageHeight`.
export interface Crop {
  src: string
  alt?: string
  imageWidth: number
  imageHeight?: number
  x: number
  y: number
  width: number
  height: number
  exclude?: { x: number, y: number, width: number, height: number }
}

const props = defineProps<{ crop: Crop }>()

// --ratio lets a parent size the frame by height: width: calc(<height> * var(--ratio)).
const frame = computed(() => ({
  aspectRatio: `${props.crop.width} / ${props.crop.height}`,
  '--ratio': props.crop.width / props.crop.height,
}))

// Percentages of the frame's width, so the crop scales with it (vertical margins too).
const image = computed(() => {
  const { imageWidth, imageHeight = 0, x, y, width, exclude } = props.crop

  return {
    width: `${(imageWidth / width) * 100}%`,
    marginLeft: `${(-x / width) * 100}%`,
    marginTop: `${(-y / width) * 100}%`,
    ...(exclude && { clipPath: hole(exclude, imageWidth, imageHeight) }),
  }
})

// The whole image minus one rectangle: an even-odd polygon of the outline plus the hole.
function hole(r: NonNullable<Crop['exclude']>, w: number, h: number) {
  const px = (v: number) => `${(v / w) * 100}%`
  const py = (v: number) => `${(v / h) * 100}%`
  const [x1, y1, x2, y2] = [px(r.x), py(r.y), px(r.x + r.width), py(r.y + r.height)]

  return `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${x1} ${y1}, ${x2} ${y1}, ${x2} ${y2}, ${x1} ${y2}, ${x1} ${y1})`
}
</script>

<template>
  <div class="CroppedImage" :style="frame">
    <img :src="withBase(crop.src)" :alt="crop.alt ?? ''" :style="image">
  </div>
</template>

<style scoped>
.CroppedImage {
  overflow: hidden;
}

.CroppedImage img {
  display: block;
  max-width: none;
  height: auto;
}
</style>
