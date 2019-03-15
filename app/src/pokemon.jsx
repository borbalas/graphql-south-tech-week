import React from "react";
import Sprite from "./sprite";

export default class Pokemon extends React.Component {
  render() {
    const pokemon = this.props.data;
    const generationStyles = {
      'generation-i': 'red',
      'generation-ii': 'gold',
      'generation-iii': 'turquoise',
      'generation-iv': 'lightGray',
      'generation-v': 'gray',
      'generation-vi': 'paleGreen',
      'generation-vii': 'orange',
      'generation-viii': 'pink',
      'kajskasj': 'lightblue'
    };
    const styles = {
      backgroundColor: generationStyles['kajskasj'],
      marginRight: 10
    };
    const titleStyles = {
      backgroundColor: generationStyles['generation-ii']
    };

    if (!pokemon) {
      return null;
    }

    return (
      <div className="column">
        <article className="ability">
          <h2 className="ability__category" style={titleStyles}>{pokemon.name}</h2>
          <div style={{ float: "right" }} className="ability__pokemon">
            {pokemon.types.map((type) => (<h3 className="ability__category" style={styles}>{type}</h3>))}
          </div>
          <div style={{ marginTop: 10 }}>
            <h3 className="ability__title">Abilities</h3>
            <ul>
              {pokemon.abilities.map((ability) =>
                <li onClick={e => (this.props.onAbilitySelected(ability.id))}>
                  {ability.name}
                </li>)}
            </ul>
          </div>
          <div style={{ float: "left" }} ><Sprite data={pokemon} /></div>
        </article>
      </div>
    );
  }
}
