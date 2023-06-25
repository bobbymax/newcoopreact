import React from "react";
import { formatCompactNumber } from "../app/helpers";

const DashboardCards = ({
  icon,
  name,
  value,
  currency = false,
  variant = "card__dark",
}) => {
  return (
    <div
      className={`insight__cards ${
        variant === "card__dark" ? "card__text-white" : "card__text-mute"
      } ${variant}`}
    >
      <span className="material-icons-sharp span__dark-shade">{icon}</span>
      <small>{name}</small>
      <h1>{currency ? formatCompactNumber(value) : value}</h1>
    </div>
  );
};

export default DashboardCards;
