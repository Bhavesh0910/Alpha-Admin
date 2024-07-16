import React from "react";
import "./style.scss";
import errorModalIcon from "../../../assets/icons/error-modal-icon.svg";
import {useDispatch, useSelector} from "react-redux";
import {clearErrors} from "../../../store/reducers/error";

const ErrorModal = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    dispatch(clearErrors());
  };

  const {title, msg, status} = useSelector((state) => state.error);

  React.useEffect(() => {
    setOpen(true);
    setMessage(msg);
    if (status === 500 && !msg) {
      setMessage("Internal server error. Please try again later.");
    }
  }, [title, msg, status]);

  return msg && status ? (
    <div className="error-modal-overlay">
      <div className="error_modal_wrapper">
        <div className="error_modal_container_top">
          <div className="error_icon">
            <img
              src={errorModalIcon}
              alt="errorModalIcon"
            />
          </div>
        </div>
        <div className="error-modal-container">
          <div className="error_modal_container_bottom">
            <h1>Error</h1>
            <p> {msg}</p>
          </div>
          <div className="error-modal-button">
            <button
              onClick={() => handleClose()}
              className="modal-button"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    false
  );
};

export default ErrorModal;
