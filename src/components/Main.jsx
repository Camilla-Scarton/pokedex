import React, { useEffect, useState } from "react";
import "../style/main.css";
import axios from "axios";
import Card from "./Card";
import InfoCard from "./InfoCard";

const Main = () => {
  const url = "https://pokeapi.co/api/v2/pokemon/";

  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 15,
    pokemonSelected: null,
  });

  const [pokemonList, setPokemonList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);

  const [pokemonInfo, setPokemonInfo] = useState([]);
  const [loadingInfo, setLoadingInfo] = useState(false);

  const [statusData, setStatusData] = useState(false);
  const [statusError, setStatusError] = useState(false);

  async function getPokemonList() {
    setLoadingList(true);
    setStatusError(false);
    try {
      const { data } = await axios.get(url, {
        params: { offset: pagination.offset, limit: pagination.limit },
      });
      setPokemonList(data.results);
      setLoadingList(false);
    } catch (err) {
      setLoadingList(false);
      setStatusError(true);
      console.log(err);
    }
  }

  async function getPokemonInfo(pokemonList) {
    setLoadingInfo(true);
    setStatusError(false);
    try {
      pokemonList.map(async (pokemon) => {
        setPokemonInfo([]);
        const { data } = await axios.get(pokemon.url);
        const { name, id, height, weight, abilities, types, sprites } = data;
        setPokemonInfo((prev) => [
          ...prev,
          {
            url: pokemon.url,
            name,
            id,
            height,
            weight,
            types,
            abilities,
            image: sprites.front_default,
          },
        ]);
      });
      setPokemonInfo((prev) => prev.sort((a, b) => a.id > b.id));
      setStatusData(true);
      setLoadingInfo(false);
    } catch (err) {
      setLoadingInfo(false);
      setStatusError(true);
      console.log(err);
    }
    setLoadingInfo(false);
  }

  useEffect(() => {
    setPokemonList([]);
    setPokemonInfo([]);
    getPokemonList();
  }, []);

  useEffect(() => {
    getPokemonInfo(pokemonList);
  }, [pokemonList]);

  useEffect(() => {
    setPokemonList([]);
    setPokemonInfo([]);
    setStatusData(false);
    getPokemonList();
  }, [pagination.offset]);

  const [filters, setFilters] = useState([
    "normal",
    "grass",
    "fire",
    "water",
    "ground",
    "ice",
    "electric",
    "flying",
  ]);
  const [activeFilters, setActiveFilters] = useState({
    normal: true,
    grass: true,
    fire: true,
    water: true,
    ground: true,
    ice: true,
    electric: true,
    flying: true,
  });
  const [listFiltered, setListFiltered] = useState(false);
  const [filter, setFilter] = useState(null);

  function handleCheckbox(evt) {
    const { name, checked } = evt.target;
    if (!listFiltered || checked) {
      filters.forEach((label) => {
        setActiveFilters((prev) => ({
          ...prev,
          [label]: label === name,
        }));
      });
      setFilter(name);
      filterPokemon(name);
      setListFiltered(true);
    } else if (!checked) {
      getPokemonList();
      filters.forEach((label) => {
        setActiveFilters((prev) => ({
          ...prev,
          [label]: true,
        }));
      });
      setFilter(null);
      setFilteredPokemonList([]);
      setListFiltered(false);
    }
  }

  function filterPokemon(filter) {
    setFilteredPokemonList([]);
    let newPokemonList = [];
    pokemonInfo.forEach((pokemon) => {
      pokemon.types.forEach((typeObj) => {
        if (typeObj.type.name === filter) newPokemonList.push(pokemon);
      });
    });
    setFilteredPokemonList(newPokemonList);
  }

  const [pokemonSelected, setPokemonSelected] = useState(null);

  function handleCardClick(pokemon) {
    setPokemonSelected(pokemon);
  }

  return (
    <main>
      <h1>My Pokédex</h1>
      <div className="main-container">
        <div className="instructions">
          <h2>Instructions</h2>
          <p>
            Play with the Pokémon list: select what you want and see the details
            in the Pokédex!
          </p>
        </div>
        <div>
          <form className="filters-container">
            <h2>Filters</h2>
            <div className="filters">
              {filters.map((label, i) => (
                <span key={i}>
                  <input
                    type="checkbox"
                    id={label}
                    name={label}
                    value={label}
                    checked={activeFilters[label]}
                    onChange={handleCheckbox}
                  />
                  <label htmlFor={label}>
                    {label[0].toUpperCase() + label.slice(1)}
                  </label>
                </span>
              ))}
            </div>
          </form>
          <div className="filter-banner">
            <h2>
              <span className="filter">
                {listFiltered && filter[0].toUpperCase() + filter.slice(1)}
              </span>{" "}
              Pokémon from{" "}
              <span className="range">#{pagination.offset + 1}</span> to{" "}
              <span className="range">
                #{pagination.offset + pagination.limit}
              </span>
            </h2>
          </div>
          <div className="cards-container">
            {loadingList && (
              <h2 className="loading">Loading Pokémon list...</h2>
            )}
            {loadingInfo && (
              <h2 className="loading">Loading Pokémon info...</h2>
            )}
            {statusData &&
              !filter &&
              pokemonInfo
                .sort((a, b) => (a.id > b.id ? 1 : -1))
                .map((pokemon, i) => (
                  <div key={i} onClick={() => handleCardClick(pokemon)}>
                    <Card
                      number={pokemon.id}
                      name={pokemon.name}
                      image={pokemon.image}
                    />
                  </div>
                ))}
            {filteredPokemonList.length > 0 &&
              filteredPokemonList.map((pokemon, i) => (
                <div key={i} onClick={() => handleCardClick(pokemon)}>
                  <Card
                    number={pokemon.id}
                    name={pokemon.name}
                    image={pokemon.image}
                  />
                </div>
              ))}
            {filter && filteredPokemonList.length === 0 && (
              <h2>No matching type Pokémon!</h2>
            )}
            {statusError && <h2 className="error">Something went wrong!</h2>}
          </div>
          <div className="buttons-container">
            <button
              type="button"
              disabled={pagination.offset === 0}
              onClick={() => {
                filters.forEach((label) => {
                  setActiveFilters((prev) => ({
                    ...prev,
                    [label]: true,
                  }));
                });
                setFilter(null);
                setListFiltered(false);
                setPagination({
                  ...pagination,
                  offset: pagination.offset - pagination.limit,
                });
              }}
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => {
                filters.forEach((label) => {
                  setActiveFilters((prev) => ({
                    ...prev,
                    [label]: true,
                  }));
                });
                setFilter(null);
                setListFiltered(false);
                setPagination({
                  ...pagination,
                  offset: pagination.offset + pagination.limit,
                });
              }}
            >
              Next
            </button>
          </div>
        </div>
        <div>
          <h2 className="pokedex-title">Pokédex Info</h2>
          {pokemonSelected ? (
            <InfoCard pokemon={pokemonSelected} />
          ) : (
            <h2 className="info-instruction">Select a Pokémon</h2>
          )}
        </div>
      </div>
    </main>
  );
};

export default Main;
