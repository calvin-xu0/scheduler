import React from "react";
import "components/DayListItem.scss";
const classNames = require('classnames');

export default function DayListItem(props) {
  const dayClass = classNames(
    "day-list__item",
    {
      "day-list__item--selected": props.selected,
      "day-list__item--full": props.spots === 0
    }
  );

  function formatSpots(numSpots) {
    let spotString = "";
    if (numSpots === 0) {
      spotString += "no spots";
    } else if (numSpots === 1) {
      spotString += "1 spot";
    } else {
      spotString += numSpots + " spots";
    }
    return spotString;
  }

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)} remaining</h3>
    </li>
  );
}