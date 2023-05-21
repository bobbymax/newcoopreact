import { useState, useEffect } from "react";

export const TextInput = ({
  multiline = 0,
  label = "",
  name = "",
  type = "text",
  value,
  onChange,
  size = "",
  placeholder = "",
  description = "",
  borderRadius = false,
  disabled = false,
}) => {
  return (
    <div className="form-group">
      {multiline < 1 ? (
        <>
          {label !== "" && (
            <label className="label-font" htmlFor={name}>
              {label}
            </label>
          )}
          {description !== "" && (
            <small className="label-description">{description}</small>
          )}
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className={`custom__form-control ${
              borderRadius ? "custom__input-border-radius" : ""
            } ${size === "lg" ? "custom__form-control-lg" : ""}`}
            placeholder={placeholder}
            disabled={disabled}
          />
        </>
      ) : (
        <>
          {label !== "" && (
            <label className="label-font" htmlFor={name}>
              {label}
            </label>
          )}
          <textarea
            name={name}
            rows={multiline}
            value={value}
            onChange={onChange}
            className="custom__form-control"
            placeholder={placeholder}
            disabled={disabled}
          />
        </>
      )}
    </div>
  );
};
export const CustomSelect = ({
  label = "",
  name = "",
  value,
  onChange,
  children,
  size = "",
  disabled = false,
}) => {
  return (
    <div className="form-group">
      {label !== "" && (
        <label className="label-font" htmlFor={name}>
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`form-control select__input ${
          size === "lg" && "form-control-lg"
        }`}
        disabled={disabled}
      >
        {children}
      </select>
    </div>
  );
};
export const CustomSelectOptions = ({
  value = "",
  label,
  disabled = false,
}) => {
  return (
    <option value={value} disabled={disabled}>
      {label}
    </option>
  );
};
export const Boxes = ({
  label = "",
  value,
  onChange,
  type = "checkbox",
  name = "",
}) => {
  return (
    <div className="form-check">
      <input
        id={name}
        className="form-check-input"
        type={type}
        value={value}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={name}>
        {label}
      </label>
    </div>
  );
};
export const Button = ({
  type = "button",
  text,
  isLoading = false,
  icon = "",
  disabled = false,
  variant = "primary",
  handleClick = undefined,
}) => {
  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    const colorCodes = [
      {
        name: "primary",
        className: "bg__primary",
      },
      {
        name: "dark",
        className: "bg__dark",
      },
      {
        name: "secondary",
        className: "bg__secondary",
      },
      {
        name: "success",
        className: "bg__success",
      },
      {
        name: "danger",
        className: "bg__danger",
      },
      {
        name: "info",
        className: "bg__info",
      },
    ];

    const cr = colorCodes.filter((code) => code?.name === variant)[0];

    setBgColor(cr?.className);
  }, [variant]);

  return (
    <button
      type={type}
      className={`custom__logout__btn modal__btn mb-2 ${bgColor}`}
      disabled={isLoading || disabled}
      onClick={() => type === "button" && handleClick()}
    >
      {isLoading ? (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
      ) : (
        <>
          {icon !== "" && <span className="material-icons-sharp">{icon}</span>}
          <p>{text}</p>
        </>
      )}
    </button>
  );
};
export const ImageBox = () => {};
