// Prints the build targets touched between two commits, as a JSON array.
// A target is "landing" or a folder name under sites/.
//
//   node scripts/changed-targets.mjs <base> [head]
//
// With no usable base (first push of a branch, manual run) every target is listed.
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'

const [base, head = 'HEAD'] = process.argv.slice(2)

const sites = (existsSync('sites') ? readdirSync('sites', { withFileTypes: true }) : [])
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)

const all = ['landing', ...sites]

// Files that every docs site is built from.
const shared = [/^theme\//, /^package(-lock)?\.json$/, /^\.github\/workflows\//]

// Files the landing page is built from, besides landing/ itself.
const landing = [/^landing\//, /^brand\//, /^theme\/tokens\.css$/, /^scripts\/build-landing\.mjs$/, /^package(-lock)?\.json$/]

function changedFiles() {
  if (!base || /^0+$/.test(base)) return null

  try {
    return execFileSync('git', ['diff', '--name-only', base, head], { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean)
  } catch {
    return null
  }
}

function targets(files) {
  if (files === null) return all

  const hit = new Set()

  for (const file of files) {
    if (landing.some(re => re.test(file))) hit.add('landing')
    if (shared.some(re => re.test(file))) sites.forEach(site => hit.add(site))
    if (/^\.github\/workflows\//.test(file)) hit.add('landing')

    const site = file.match(/^sites\/([^/]+)\//)?.[1]
    if (site && sites.includes(site)) hit.add(site)
  }

  return all.filter(target => hit.has(target))
}

console.log(JSON.stringify(targets(changedFiles())))
