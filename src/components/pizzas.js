import React from 'react'
import { withPrefix } from 'gatsby-link'

import PizzaSlice from './sliceIcon'

const rating = vote => Array.from(Array(vote), (_, i) => <PizzaSlice key={i} />)

const Pizza = ({ node: pizza }) => (
  <li key={JSON.stringify(pizza)} className="pizza">
    <p className="pizza__pizzeria">{pizza.pizzeria}</p>
    <p>
      <time dateTime="{ pizza.date }">{pizza.date}</time>
    </p>
    {pizza.slag ? (
      <img
        className="pizza__pic"
        src={withPrefix(`./imgs/${pizza.slag}.jpg`)}
      />
    ) : (
      <img src="./pizza.svg" />
    )}
    <p>{rating(pizza.vote)}</p>
    <p>{pizza.where}</p>
    <p>{pizza.price}</p>
    {pizza.note && (
      <p
        className="pizza__note"
        dangerouslySetInnerHTML={{
          __html: `"${pizza.note}"`,
        }}
      />
    )}
  </li>
)

const Pizzas = ({ pizzas }) => <ul>{pizzas.map(Pizza)}</ul>

export default Pizzas
