import "../style/infoCard.css";

const InfoCard = ({ pokemon }) => {
  const { image, name, id, height, weight, abilities, types, sprites } =
    pokemon;
  return (
    <div className="info-card">
      <div className="image-container">
        <img className="card-photo" src={image} alt={`${name}`} />
      </div>

      <div className="description-box">
        <div className="info">
          Number: <span className="value">{id}</span>
        </div>
        <div className="info">
          Name:{" "}
          <span className="value">{name[0].toUpperCase() + name.slice(1)}</span>
        </div>
        <div className="info">
          Height: <span className="value">{height}</span>
        </div>
        <div className="info">
          Weight: <span className="value">{weight}</span>
        </div>
        <div className="info list">
          Abilities:
          {abilities.map((el, i) => (
            <div key={i} className="value">
              {el.ability.name[0].toUpperCase() + el.ability.name.slice(1)}
            </div>
          ))}
        </div>
        <div className="info list">
          Types:
          {types.map((el, i) => (
            <div key={i} className="value">
              {el.type.name[0].toUpperCase() + el.type.name.slice(1)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
