import React from "react";

export default class Sprite extends React.Component {
  render() {
    const pokemon = this.props.data;

    if (!pokemon) {
      return null;
    }

    const styles = {
      backgroundImage: `url(${pokemon.sprites.front})`
    };

    return (
      <div className="pokemon" style={styles}
        onMouseOver={e => (e.currentTarget.style.backgroundImage = `url(${pokemon.sprites.back})`)}
        onMouseOut={e => (e.currentTarget.style.backgroundImage = `url(${pokemon.sprites.front})`)}
        onClick={e => (this.props.onClick(pokemon))}
        title={pokemon.name}
      />
    );
  }
}
