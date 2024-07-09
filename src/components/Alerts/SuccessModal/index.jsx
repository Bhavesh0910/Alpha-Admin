import React from "react";
import "./style.scss";
import successModalIcon from "../../../assets/icons/success-modal-icon.png";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages } from "../../../store/reducers/message";

const SuccessModal = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const dispatch = useDispatch();

  const handleClose = (e) => {
    if (e) e.preventDefault();
    setOpen(false);
    dispatch(clearMessages());
  };

  const { title, msg, status } = useSelector((state) => state.message);

  React.useEffect(() => {
    setOpen(true);
    setMessage(msg);
    if (status === 500 && !msg) {
      setMessage("Internal server error. Please try again later.");
    }
  }, [title, msg, status]);


  return msg && status ? (
    <div className="success-modal-overlay">
      <div className="success-modal-container">
        <div className="success-modal-icon">
          <img src={successModalIcon} alt="" />
        </div>
        <div className="success-modal-info">
          <h2 className="modal-name">Success</h2>
          <p className="modal-description">
            Woo-hoo<br></br>
            {msg}
          </p>
        </div>
        <div className="success-modal-button">
          <button onClick={() => handleClose()} className="modal-button">
            Done
          </button>
        </div>
      </div>
    </div>
  ) : (
    false
  );
};

export default SuccessModal;
