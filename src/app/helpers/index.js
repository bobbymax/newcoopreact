/* eslint-disable eqeqeq */
export const splitRoute = (pathname) => {
  const url = pathname.split("/")[1];
  return "/" + url;
};

export const currency = (fig, label = false) => {
  // const amount = parseFloat(fig);
  let currency = Intl.NumberFormat("en-US");
  return `${label ? "" : "NGN "}${currency.format(fig)}`;
};

export const getChildren = (mods, modId) => {
  return mods?.filter((mod) => mod?.parentId === modId);
};

export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const formatSelectOptions = (data, value, label, extra = null) =>
  data?.length > 0 &&
  data.map((val) => ({
    value: val[value],
    label: val[label],
    id: val[extra] ?? null,
    properties: {
      ...val,
    },
  }));

export const getStatus = (status) => {
  let className = "";
  switch (status) {
    case "registered":
      className = "bg__info";
      break;

    case "approved":
      className = "bg__primary";
      break;

    case "denied":
      className = "bg__danger";
      break;
    default:
      className = "bg__warning";
      break;
  }

  return className;
};

export const breakRangeFigures = (range) => {
  const broken = range?.split(" - ");
  return {
    start: parseInt(broken[0]),
    end: parseInt(broken[1]),
  };
};

export const between = (val, min, max) => {
  return val >= min && val <= max;
};

export const EXTS = ["xlsx", "xls", "csv"];

export const banks = [
  "Zenith Bank",
  "FCMD",
  "Guaranteed Trust Bank",
  "Stanbic IBTC",
  "UBA",
  "Polaris Bank",
  "Access Bank",
  "OPay",
  "PalmPay",
  "Moniepoint",
  "Firstbank",
  "Ecobank",
  "Wema Bank",
  "Fidelity Bank",
  "Keystone Bank",
];

export const ImportTypes = [
  {
    id: 1,
    label: "Members",
    value: "members",
  },
  {
    id: 2,
    label: "Budget Heads",
    value: "budget-heads",
  },
  {
    id: 3,
    label: "Sub Budget Heads",
    value: "sub-budget-heads",
  },
  {
    id: 5,
    label: "Modules",
    value: "modules",
  },
  {
    id: 6,
    label: "Roles",
    value: "roles",
  },
  {
    id: 8,
    label: "Categories",
    value: "categories",
  },
  {
    id: 9,
    label: "Contributions",
    value: "contributions",
  },
];

export const getExtension = (file) => {
  const parts = file.name.split(".");
  const ext = parts[parts.length - 1];
  return EXTS.includes(ext);
};

export const convertToJson = (headers, data) => {
  const rows = [];
  data.forEach((row) => {
    let rowData = {};
    row.forEach((el, index) => {
      rowData[headers[index]] = el;
    });
    rows.push(rowData);
  });

  return rows;
};

export const expenditureTypes = [
  {
    key: "inflow",
    label: "Inflow",
  },
  {
    key: "outflow",
    label: "Outflow",
  },
];

export const expenditureCategories = [
  {
    key: "loan",
    label: "Loan",
  },
  {
    key: "deposit",
    label: "Deposit",
  },
  {
    key: "salary",
    label: "Salaries",
  },
  {
    key: "contribution",
    label: "Contribution",
  },
  {
    key: "dividend",
    label: "Dividend",
  },
  {
    key: "other",
    label: "Other",
  },
];

export const expenditureMethods = [
  {
    key: "cash",
    label: "Cash",
  },
  {
    key: "electronic",
    label: "Electronic",
  },
  {
    key: "check",
    label: "Check",
  },
  {
    key: "other",
    label: "Other",
  },
];

export const paymentTypes = [
  {
    key: "staff",
    label: "Staff",
  },
  {
    key: "member",
    label: "Member",
  },
  {
    key: "third-party",
    label: "Third Party",
  },
  {
    key: "other",
    label: "Other",
  },
];

// const characters =
//   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const characters = "0123456789";

export const generateUniqueString = (prefix = "", length) => {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  result = prefix + result;

  return result.replaceAll(" ", "");
};

export const batchRules = [
  {
    name: "staff",
    display_name: "Staff",
    slot: 6,
    sameBudget: true,
    prefix: "SP",
    generated: 5,
    default: false,
  },
  {
    name: "member",
    display_name: "Member",
    slot: 6,
    sameBudget: true,
    prefix: "MP",
    generated: 5,
    default: true,
  },
  {
    name: "third-party",
    display_name: "Third Party",
    slot: 1,
    sameBudget: true,
    prefix: "TPP",
    generated: 4,
    default: false,
  },
];

export const formatCompactNumber = (number) => {
  if (number < 1000) {
    return number;
  } else if (number >= 1000 && number < 1_000_000) {
    return (number / 1000).toFixed(1) + "K";
  } else if (number >= 1_000_000 && number < 1_000_000_000) {
    return (number / 1_000_000).toFixed(1) + "M";
  } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
    return (number / 1_000_000_000).toFixed(1) + "B";
  } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
    return (number / 1_000_000_000_000).toFixed(1) + "T";
  }
};

export const locations = [
  "Lagos",
  "Abuja FCT",
  "Port Harcourt City (PHC)",
  "Owerri",
  "Ibadan",
  "Benin",
  "Calabar",
  "Uyo",
  "Kano",
  "Kaduna",
  "Oyo",
  "Ogun",
  "Anambra",
  "Enugu",
  "Sokoto",
  "Warri",
  "Jos",
  "Yenagoa",
];

export const range = (start, stop, step) => {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );
};
