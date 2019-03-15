import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLString
} from 'graphql';
import fetch from 'node-fetch';
import DataLoader from 'dataloader';

function fetchJson(keys) {
  return fetch(keys)
    .then(res => res.json());
}

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const cacheMap = new Map();

// Use DataLoader!!!
//const loadByURL = new DataLoader(keys => Promise.all(keys.map(fetchJson)), {cacheMap});
const loadByURL = { load: fetchJson };


const Pokemon = new GraphQLObjectType({
  name: 'Pokemon',
  description: 'Type representing the Pokemon 🐀 Gotta Catch \'Em All!!',
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    abilities: {
      type: new GraphQLList(Ability),
      resolve: (root) => root.abilities.map((item) => loadByURL.load(item.ability.url))
    },
    sprites: {
      type: Sprite
    },
    types: {
      type: new GraphQLList(GraphQLString),
      resolve: (root) => root.types.map((item) => item.type.name)
    },
  })
});

const Ability = new GraphQLObjectType({
  name: 'Ability',
  description: 'Type representing the ability',
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString,
      resolve: (root) => root.effect_entries ? root.effect_entries[0].short_effect : null
    },
    generation: {
      type: GraphQLString,
      resolve: (root) => root.generation.name
    },
    pokemons: {
      type: new GraphQLList(Pokemon),
      resolve: (root) => root.pokemon.map((item) => loadByURL.load(item.pokemon.url))
    }
  })
});

const Sprite = new GraphQLObjectType({
  name: 'Sprite',
  description: 'Type representing the Sprite',
  fields: () => ({
    front: {
      type: GraphQLString,
      resolve: (root) => root.front_default
    },
    back: {
      type: GraphQLString,
      resolve: (root) => root.back_default
    }
  })
});

export default new GraphQLObjectType({
  name: 'Query',
  description: 'Top-level query',
  fields: () => ({
    abilities: {
      type: new GraphQLList(Ability),
      args: {
        id: {
          type: GraphQLInt
        }
      },
      resolve: (root, args) => args.id ?
        loadByURL.load(`${POKEAPI_BASE_URL}/ability/${args.id}/`)
          .then(json => [json]) :
        loadByURL.load(`${POKEAPI_BASE_URL}/ability?limit=300`)
          .then(json => json.results.map((item) => loadByURL.load(item.url)))
    }
  })
});