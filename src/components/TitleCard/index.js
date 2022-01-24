import React from 'react';
import './style.scss';

const TitleCard = ({id, title, backgroundImage, textColor, backgroundColor, iconColor, iconName, heading, borderColor}) => {
  return (
    <div className="title-card" style={{backgroundColor, backgroundImage, borderColor}} id={id}>
      <div className="title-card__icon" style={{ iconColor: iconColor }} id={id}>
        <img src={require(`#/assets/icons/${iconName}.svg`)} alt="icon"  id={id}/>
      </div>
      <h3 className={`${heading} title-card__type mt-3 text-center`} style={{color: textColor}} id={id}>{title}</h3>
    </div>
  );
}
export default TitleCard;
