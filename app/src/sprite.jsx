import React from "react";

export default class Sprite extends React.Component {
  render() {
    const pokemon = this.props.data;

    if (!pokemon) {
      return null;
    }

    const styles = {
      backgroundImage: `url(${pokemon.sprites.front != null ? pokemon.sprites.front : 'http://localhost:8080/src/images/interrogation.png'})`
    };

    return (
      <div className="sprite" style={styles}
        onMouseOver={e => (e.currentTarget.style.backgroundImage = `url(${pokemon.sprites.back != null ? pokemon.sprites.back : 'http://localhost:8080/src/images/interrogation.png'})`)}
        onMouseOut={e => (e.currentTarget.style.backgroundImage = `url(${pokemon.sprites.front != null ? pokemon.sprites.front : 'http://localhost:8080/src/images/interrogation.png'})`)}
        onClick={e => (this.props.onClick(pokemon))}
        title={pokemon.name}
      />
    );
  }
}
