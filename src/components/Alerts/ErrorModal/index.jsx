import React from "react";
import "./style.scss";
import errorModalIcon from "../../../assets/icons/error-modal-icon.png";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../../../store/reducers/error";

const ErrorModal = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    dispatch(clearErrors());
  };

  const { title, msg, status } = useSelector((state) => state.error);

  React.useEffect(() => {
    setOpen(true);
    setMessage(msg);
    if (status === 500 && !msg) {
      setMessage("Internal server error. Please try again later.");
    }
  }, [title, msg, status]);

  return msg && status ? (
    <div className="error-modal-overlay">
      <div className="error-modal-container">
        <div className="error-modal-icon">
          <img src={errorModalIcon} alt="errorModalIcon" />
        </div>
        <div className="error-modal-info">
          <h2 className="modal-name">Error!</h2>
          <p className="modal-description">
            Oh no<br></br>
            {msg}
          </p>
        </div>
        <div className="error-modal-button">
          <button onClick={() => handleClose()} className="modal-button">
            Try Again
          </button>
        </div>
      </div>
    </div>
  ) : (
    false
  );
};

export default ErrorModal;
