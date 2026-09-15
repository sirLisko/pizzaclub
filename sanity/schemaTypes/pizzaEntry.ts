import { defineField, defineType, type SlugSourceContext } from 'sanity'

const CURRENCIES = ['GBP', 'EUR', 'USD', 'PLN', 'JPY', 'other']

export const pizzaEntry = defineType({
  name: 'pizzaEntry',
  title: 'Pizza entry',
  type: 'document',
  fields: [
    defineField({
      name: 'pizzaName',
      title: 'Pizza',
      type: 'string',
      description: 'The pizza itself, e.g. "Bufalina" or "Margherita (Doppia Mozzarella)"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pizzeria',
      title: 'Pizzeria',
      type: 'reference',
      to: [{ type: 'pizzeria' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dateEaten',
      title: 'Date eaten',
      type: 'date',
      validation: (Rule) =>
        Rule.required().max(new Date().toISOString().slice(0, 10)),
    }),
    defineField({
      name: 'rating',
      title: 'Rating (slices)',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(0).max(5),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'object',
      fields: [
        defineField({ name: 'amount', title: 'Amount', type: 'number' }),
        defineField({
          name: 'currency',
          title: 'Currency',
          type: 'string',
          options: { list: CURRENCIES },
        }),
        defineField({
          name: 'raw',
          title: 'Original text',
          type: 'string',
          description: 'Fallback for prices that don’t cleanly parse into amount + currency.',
        }),
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: async (doc: any, context: SlugSourceContext) => {
          const pizzeriaRef = doc.pizzeria?._ref
          const pizzeriaName = pizzeriaRef
            ? await context
                .getClient({ apiVersion: '2024-01-01' })
                .fetch(`*[_id == $id][0].name`, { id: pizzeriaRef })
            : undefined
          return `${pizzeriaName ?? ''}-${doc.dateEaten ?? ''}`
        },
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'pizzeria.name',
      pizzaName: 'pizzaName',
      rating: 'rating',
      media: 'photo',
    },
    prepare({ title, pizzaName, rating, media }) {
      return {
        title,
        subtitle: `${pizzaName ?? ''}${rating != null ? ` • ${rating}/5` : ''}`,
        media,
      }
    },
  },
})
