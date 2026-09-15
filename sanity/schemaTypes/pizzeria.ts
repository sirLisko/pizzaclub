import { defineField, defineType } from 'sanity'

export const pizzeria = defineType({
  name: 'pizzeria',
  title: 'Pizzeria',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({ name: 'city', title: 'City', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'country', title: 'Country', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({
          name: 'raw',
          title: 'Original text',
          type: 'string',
          description: 'Unparsed original location text, kept for audit purposes.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'geopoint',
      title: 'Map location',
      type: 'geopoint',
      description: 'Latitude/longitude for the map view.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'favourite',
      title: 'Personal favourite',
      type: 'boolean',
      description:
        'Call this place out in its own "Personal favourites" section on the stats page, regardless of how many times you\'ve been or how it ranks.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      city: 'location.city',
      country: 'location.country',
      favourite: 'favourite',
    },
    prepare({ title, city, country, favourite }) {
      return {
        title: favourite ? `★ ${title}` : title,
        subtitle: [city, country].filter(Boolean).join(', '),
      }
    },
  },
})
