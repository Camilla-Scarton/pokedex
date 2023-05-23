const Card = ({ number, name, image }) => {
    return (
        <div className="card">
            <div className="number">{number}</div>
            <div className="name">{name[0].toUpperCase() + name.slice(1)}</div>
            <img src={image} alt={`pokemon-${name}`}/>
        </div>
    )
}

export default Card;