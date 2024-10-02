import React from 'react'
import Pizzas from '../components/pizzas.js'

const IndexPage = ({
  data,
  data: {
    allPizzasJson: { edges: pizzas },
  },
}) => (
  <div>
    <p>
      <b>{pizzas.length}</b> Pizzas and counting...
    </p>
    <Pizzas pizzas={pizzas} />
    <p className="footer">
      <span>
        Created with ♥ by <a href="https://sirlisko.com">Luca Lischetti</a>.
      </span>
      <span>
        View project source on{' '}
        <a href="https://github.com/sirLisko/pizzaclub">Github</a>.
      </span>
    </p>
  </div>
)

export default IndexPage

export const query = graphql`
  query PizzasQuery {
    allPizzasJson {
      edges {
        node {
          pizza
          pizzeria
          date
          note
          where
          vote
          price
          slag
        }
      }
    }
  }
`
