// Runs before `astro build` (see package.json's "prebuild" script) to catch incomplete
// Sanity Studio entries early, with a clear error, instead of a cryptic build failure.
import { createClient } from '@sanity/client'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Local dev reads secrets from .env; Netlify (and CI generally) injects them into
// process.env directly, so there's no .env file to load there.
const envPath = fileURLToPath(new URL('.env', import.meta.url))
if (existsSync(envPath)) {
  process.loadEnvFile(envPath)
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

const REQUIRED_ENTRY_FIELDS = [
  'pizzaName',
  'pizzeria._ref',
  'dateEaten',
  'rating',
  'slug.current',
]
const REQUIRED_PIZZERIA_FIELDS = ['name', 'location.city', 'location.country', 'slug.current']

function get(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

const entries = await client.fetch(
  `*[_type == "pizzaEntry"]{_id, pizzaName, pizzeria, dateEaten, rating, slug}`
)
const pizzerias = await client.fetch(`*[_type == "pizzeria"]{_id, name, location, slug}`)

const errors = []
for (const doc of entries) {
  for (const field of REQUIRED_ENTRY_FIELDS) {
    if (get(doc, field) == null) {
      errors.push(`${doc._id} (${doc.pizzaName ?? 'untitled'}) is missing required field "${field}"`)
    }
  }
}
for (const doc of pizzerias) {
  for (const field of REQUIRED_PIZZERIA_FIELDS) {
    if (get(doc, field) == null) {
      errors.push(`${doc._id} (${doc.name ?? 'untitled'}) is missing required field "${field}"`)
    }
  }
}

if (errors.length) {
  console.error(`\nContent validation failed — ${errors.length} issue(s) found in Sanity Studio:\n`)
  errors.forEach((e) => console.error(`  - ${e}`))
  console.error('\nFix these in Studio before building.\n')
  process.exit(1)
}

console.log(
  `Content validation passed for ${entries.length} pizzaEntry and ${pizzerias.length} pizzeria documents.`
)
