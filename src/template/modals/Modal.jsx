import React from "react";

const Modal = ({
  title = "",
  handleClose = undefined,
  show = false,
  lg = false,
  children,
}) => {
  const showHideClass = show ? "modal block" : "modal none";

  return (
    <div className={showHideClass}>
      <section className={`modal-main ${lg ? " large" : ""}`}>
        <div className="custom__modal-header">
          <h3 className="custom__modal-title">{title}</h3>
          <button
            type="button"
            className="custom__modal-btn"
            onClick={handleClose}
          >
            <span className="material-icons-sharp">close</span>
          </button>
        </div>

        <div className="custom__modal-body">
          <div className="modal__content">{children}</div>
        </div>
      </section>
    </div>
  );
};

export default Modal;
