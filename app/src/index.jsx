import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Ability from './ability';
import Pokemon from './pokemon';

// const App = () => (
//    <div>
//       <h1>Hello world!!</h1>
//       <Aaa/>
//    </div>
// )
const graphQlUrl = 'http://localhost:4000';

class View extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         data: {
            abilities: [],
            selectedPokemon: undefined,
            selectdAbility: undefined
         }
      }

      this.onPokemonSelected = this.onPokemonSelected.bind(this);
      this.onAbilitySelected = this.onAbilitySelected.bind(this);
      this.onCloseSelectedPokemon = this.onCloseSelectedPokemon.bind(this);
   }
   onPokemonSelected(pokemon) {
      this.setState({ selectedPokemon: pokemon });
   }

   onCloseSelectedPokemon(pokemon) {
      this.setState({ selectedPokemon: undefined });
   }

   onAbilitySelected(abilityId) {
      const query = {
         query: `{
      abilities(id:${abilityId}) {
      id
      name
      description
      generation
      pokemons {
        name
        abilities {
          id
          name
        }
        sprites {
          front
          back
        }
        types
      }
    }
  }
  ` };
      this.runQuery(query).then(data => {
         if (data) {
            this.setState({ selectdAbility: data.abilities[0] });
         } else {
            console.log("No data was found");
         }
      });
   }

   render() {
      return (
         <div>
            <Pokemon data={this.state.selectedPokemon} onAbilitySelected={this.onAbilitySelected} onCloseSelectedPokemon={this.onCloseSelectedPokemon} />
            <Ability data={this.state.selectdAbility} onPokemonSelected={this.onPokemonSelected} />
            <div className="container">
               <img className="logo" src="http://localhost:8080/src/logo.png" />
               {this.state.data ? this.state.data.abilities.map((ability) =>
                  <Ability data={ability} onPokemonSelected={this.onPokemonSelected} />
               ) : 'Loading...'}
            </div>
         </div>
      );
   }

   componentDidMount() {
      const query = {
         query: `{
      abilities {
        id
        name
        description
        generation
        pokemons {
          name
          abilities {
            id
            name
          }
          sprites {
            front
            back
          }
          types
        }
      }
    }
    ` };
      this.runQuery(query).then(data => {
         if (data) {
            this.setState({
               data
            });
         } else {
            console.log("No data was found");
         }
      });
   }

   runQuery(query) {
      return new Promise((resolve, reject) => {
         fetch(graphQlUrl, {
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(query)
         })
            .then(res => res.json())
            .then(({ data }) => {
               resolve(data);
            });
      });
   }
}

ReactDOM.render(<View />, document.getElementById('root'));
