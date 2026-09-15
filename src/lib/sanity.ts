import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client: SanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: import.meta.env.SANITY_API_READ_TOKEN,
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

export type Pizzeria = {
  _id: string
  name: string
  slug: string
  location: { city: string; country: string; raw?: string }
  geopoint?: { lat: number; lng: number }
  favourite?: boolean
}

export type PizzaEntry = {
  _id: string
  pizzaName: string
  pizzeria: Pizzeria
  dateEaten: string
  rating: number
  price?: { amount?: number; currency?: string; raw?: string }
  notes?: string
  photo?: SanityImageSource
  slug: string
}

const PIZZERIA_PROJECTION = /* groq */ `{
  _id,
  name,
  "slug": slug.current,
  location,
  geopoint,
  favourite
}`

const PIZZA_LIST_PROJECTION = /* groq */ `{
  _id,
  pizzaName,
  "pizzeria": pizzeria->${PIZZERIA_PROJECTION},
  dateEaten,
  rating,
  price,
  notes,
  photo,
  "slug": slug.current
}`

export async function getAllPizzas(): Promise<PizzaEntry[]> {
  return client.fetch(
    /* groq */ `*[_type == "pizzaEntry"] | order(dateEaten desc) ${PIZZA_LIST_PROJECTION}`
  )
}

export async function getAllPizzaSlugs(): Promise<string[]> {
  return client.fetch(
    /* groq */ `*[_type == "pizzaEntry" && defined(slug.current)].slug.current`
  )
}

export async function getPizzaBySlug(slug: string): Promise<PizzaEntry | null> {
  return client.fetch(
    /* groq */ `*[_type == "pizzaEntry" && slug.current == $slug][0] ${PIZZA_LIST_PROJECTION}`,
    { slug }
  )
}

export async function getAllPizzerias(): Promise<
  (Pizzeria & { visits: number })[]
> {
  return client.fetch(/* groq */ `*[_type == "pizzeria"] | order(name asc) {
      ...${PIZZERIA_PROJECTION},
      "visits": count(*[_type == "pizzaEntry" && references(^._id)])
    }`)
}

export async function getAllPizzeriaSlugs(): Promise<string[]> {
  return client.fetch(
    /* groq */ `*[_type == "pizzeria" && defined(slug.current)].slug.current`
  )
}

export async function getPizzeriaBySlug(
  slug: string
): Promise<Pizzeria | null> {
  return client.fetch(
    /* groq */ `*[_type == "pizzeria" && slug.current == $slug][0] ${PIZZERIA_PROJECTION}`,
    { slug }
  )
}

export async function getPizzasByPizzeria(
  pizzeriaId: string
): Promise<PizzaEntry[]> {
  return client.fetch(
    /* groq */ `*[_type == "pizzaEntry" && pizzeria._ref == $pizzeriaId] | order(dateEaten desc) ${PIZZA_LIST_PROJECTION}`,
    { pizzeriaId }
  )
}

export function formatPrice(price: PizzaEntry['price']): string | null {
  if (!price) return null
  if (price.amount != null && price.currency) {
    const symbols: Record<string, string> = {
      GBP: '£',
      EUR: '€',
      USD: '$',
      JPY: '¥',
    }
    const symbol = symbols[price.currency] ?? `${price.currency} `
    return `${symbol}${price.amount}`
  }
  return price.raw ?? null
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
