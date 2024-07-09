import React, { useEffect } from "react";
import "./style.scss";
import ResetIcon from "../../assets/icons/ResetIcon.svg";

const ResetModal = ({ msg, open, setOpen, handleSubmit }) => {
  const handleClose = (e) => {
    setOpen(false);
  };

  return msg && open ? (
    <div className="reset-modal-overlay">
      <div className="reset-modal-container">
        <div className="reset-modal-icon">
          <img src={ResetIcon} alt="" />
        </div>
        <div className="reset-modal-info">
          <h2 className="modal-name">Reset Account</h2>
          <p className="modal-description">{msg}</p>
        </div>
        <div className="reset-modal-button">
          <button onClick={() => handleClose()} className="modal-button">
            Cancel
          </button>
          <button onClick={() => handleSubmit()} className="standard_button">
            Reset
          </button>
        </div>
      </div>
    </div>
  ) : (
    false
  );
};

export default ResetModal;
