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

// Switch in order to check DataLoader!!!
const loadByURL = new DataLoader(keys => Promise.all(keys.map(fetchJson)), { cacheMap });
//const loadByURL = { load: fetchJson };

const Ability = new GraphQLObjectType({
  name: 'Ability',
  description: 'Type representing the ability',
  fields: () => ({
    id: {
      description: 'Unique identifier',
      type: GraphQLInt
    },
    name: {
      description: 'Name of the Ability',
      type: GraphQLString
    },
    description: {
      description: 'Description of the Ability',
      type: GraphQLString,
      resolve: (root) => root.effect_entries && root.effect_entries.length > 0 ? root.effect_entries[0].short_effect : null
    },
    generation: {
      description: 'Name of the generarion [i|ii|iii|iv|v|vi|vii|viii]',
      type: GraphQLString,
      resolve: (root) => root.generation.name
    },
    pokemons: {
      description: 'List of the Pokémons with this ability',
      type: new GraphQLList(Pokemon),
      resolve: (root) => root.pokemon.map((item) => loadByURL.load(item.pokemon.url))
    }
  })
});

const Pokemon = new GraphQLObjectType({
  name: 'Pokemon',
  description: `Type representing the Pokémon 🐀
    Gotta Catch 'Em All!!`,
  fields: () => ({
    id: {
      description: 'Unique identifier',
      type: GraphQLInt
    },
    name: {
      description: 'Name of the Pokémon',
      type: GraphQLString
    },
    abilities: {
      description: 'List of the abilities',
      type: new GraphQLList(Ability),
      resolve: (root) => root.abilities.map((item) => loadByURL.load(item.ability.url))
    },
    sprites: {
      description: 'Front and Back sprites',
      type: Sprite
    },
    types: {
      description: 'List of Pokémon types',
      type: new GraphQLList(GraphQLString),
      resolve: (root) => root.types.map((item) => item.type.name)
    },
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
    }, 
    default: {
      type: GraphQLString,
      deprecationReason: 'Use "front"',
      resolve: (root) => root.front_default
    }    
  })
});

export default new GraphQLObjectType({
  name: 'Query',
  description: 'Top-level query',
  fields: () => ({
    abilities: {
      description: 'Query for one or all the Pokémon abilities',
      type: new GraphQLList(Ability),
      args: {
        id: {
          description: 'An array with only one Ability defined will be reterived if the Id argument is defined',
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