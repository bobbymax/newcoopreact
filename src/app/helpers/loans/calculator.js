import Loan from "./classes/Loan";
import Special from "./classes/Special";
import Regular from "./classes/Regular";
import Electronic from "./classes/Electronic";
import Car from "./classes/Car";

export const checkOfferLimit = (feature, requested) => {
  return requested <= parseFloat(feature?.offer_limit);
};

export const calculator = (subBudgetHead, loan) => {
  let params = {};
  switch (subBudgetHead?.code) {
    case "C004":
      const special = new Special(loan);
      params = special.init();
      break;

    case "C005":
      const regular = new Regular(loan);
      params = regular.init();
      break;

    case "C006":
      const electronic = new Electronic(loan);
      params = electronic.init();
      break;

    case "C008":
      const car = new Car(loan);
      params = car.init();
      break;

    default:
      const parent = new Loan(loan);
      params = parent.init();
      break;
  }

  return params;
};

export const getDateComponents = () => {
  const date = new Date();
  const months = getMonths();

  return {
    day: date.getDate(),
    month:
      date.getDate() >= 15
        ? months[date.getMonth() + 1]
        : months[date.getMonth()],
    year: date.getFullYear(),
  };
};

export const getYears = () => {
  const date = new Date();
  return [
    date.getFullYear() - 2,
    date.getFullYear() - 1,
    date.getFullYear(),
    date.getFullYear() + 1,
    date.getFullYear() + 2,
  ];
};

export const getMonths = () => {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
};

export const getVariant = (feature, tenor) => {
  const variants = feature?.variants;
  const tenors = [];

  variants?.map((vR) => tenors.push(vR?.tenor));
  tenors.sort((a, b) => a - b);
  const period = getTenor(tenors, tenor);
  return (
    variants?.filter((va) => parseInt(va?.tenor) === period)[0] ?? variants[0]
  );
};

export const getRange = (feature) => {
  const variants = feature?.variants;
  const tenors = [];

  variants.map((va) => tenors.push(parseInt(va?.tenor)));
  const max = Math.max(...tenors);
  return range(max);
};

const range = (max) => {
  return Array.from({ length: max }, (_, index) => index + 1);
};

const getTenor = (tenors, target) => {
  let tenor = 0;

  for (let i = 0; i < tenors.length; i++) {
    const current = tenors[i];
    if (target <= current) {
      tenor = current;
      break;
    }
  }

  return tenor ?? 1;
};
