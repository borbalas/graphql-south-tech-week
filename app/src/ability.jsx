import React from "react";
import Sprite from "./sprite";

export default class Ability extends React.Component {
  render() {
    const ability = this.props.data;

    if (!ability) {
      return null;
    }

    const generationStyles = {
      'generation-i': 'red',
      'generation-ii': 'gold',
      'generation-iii': 'turquoise',
      'generation-iv': 'lightGray',
      'generation-v': 'gray',
      'generation-vi': 'paleGreen',
      'generation-vii': 'orange',
      'generation-viii': 'pink'
    };
    const styles = {
      backgroundColor: generationStyles[ability.generation]
    };

    return (
      <div className="column">
        <article className="ability">
          <h3 className="ability__category" style={styles}>{ability.name}</h3>
          <p className="ability__excerpt">{ability.description}</p>
          <div className="ability__pokemon">
            {ability.pokemons.map((pokemon) => (<Sprite data={pokemon} onClick={this.props.onPokemonSelected} />))}
          </div>
        </article>
      </div>
    );
  }
}
