import React from 'react';
import './style.scss';

const TitleCard = ({id, title, backgroundImage, textColor, backgroundColor, iconColor, iconName, heading, borderColor}) => {
  return (
    <div className="title-card" style={{backgroundColor, backgroundImage, borderColor}} id={id}>
      <div className="title-card__icon" style={{ iconColor: iconColor }}>
        <img src={require(`#/assets/icons/${iconName}.svg`)} alt="icon" />
      </div>
      <h3 className={`${heading} title-card__type mt-3 text-center`} style={{color: textColor}}>{title}</h3>
    </div>
  );
}
export default TitleCard;
