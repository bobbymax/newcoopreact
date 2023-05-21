import React from "react";

const PageHeader = ({
  pageName = "",
  text = "",
  resource = false,
  isLoading = false,
  handleClick = undefined,
  icon = "add_box",
  headerIcon = "newspaper",
}) => {
  return (
    <div className="page__header mb-5">
      <div className="page__attr">
        <span className="material-icons-sharp">{headerIcon}</span>
        <h2>{pageName}</h2>
      </div>
      {resource && (
        <div className="resource">
          <button
            type="button"
            className="custom__logout__btn bg__primary"
            onClick={() => handleClick()}
            disabled={isLoading}
          >
            <span className="material-icons-sharp">{icon}</span>
            <p>{text}</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
