import React, { useState } from "react";
import "./style.scss";
import Spinner from "../spinner/Spinner.jsx";
import checkout_icon from "../../assets/icons/checkout_icon.svg";
import { applyCoupon } from "../../utils/apis/payment.js";
import { useDispatch, useSelector } from "react-redux";
import { returnErrors } from "../../store/reducers/error.js";

const RePaymentModal = ({
  open,
  setOpen,
  setPayload,
  handleSubmit,
  size,
  id,
  isLoading,
  initialAmount,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [load, setLoad] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  const dispatch = useDispatch();
  const { idToken } = useSelector((state) => state.auth);

  const handleClose = () => {
    setOpen(false);
  };

  const paymentMethods = [
    {
      method: "Stripe Payments",
      value: "stripe",
      icon: checkout_icon,
    },
  ];
  const { data } = useSelector((state) => state.accountMetrics.plans);
  const activeAccount = data?.find((item) => {
    return Number(item.login_id) === Number(id);
  });
  // console.log(activeAccount, "activeAccountactiveAccountactiveAccount");
  const handleApplyCode = async () => {
    if (!couponCode) {
      setCouponError("The coupon code should not be empty.");
      return;
    }
    try {
      setLoad(true);
      const res = await applyCoupon(id, couponCode, idToken);
      setLoad(false);
      // console.log(res, "resresresresresresres");
      if (res) {
        setPayload((prev) => ({
          ...prev,
          promo: res.coupon_applied,
        }));
        setPaymentInfo(res);
      }
    } catch (error) {
      // console.log(error, "resresresresres");
      setLoad(false);
      setCouponCode("");
      setPayload((prev) => ({
        ...prev,
        promo: "",
      }));
      setPaymentInfo(null);
      dispatch(
        returnErrors(error.response?.data.detail, error.response?.status)
      );
    }
  };

  return open ? (
    <div className="repayment-modal-overlay">
      <div className="repayment-modal-container">
        <div className="repayment-heading">
          <p>Re-Payment</p>
          <span onClick={handleClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="8.4"
                stroke="white"
                strokeWidth="1.2"
              />
              <path
                d="M16 8L8 16"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 8L16 16"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <div className="payment-container">
          <p>Payment Method</p>
          <div className="payment-methods">
            {paymentMethods.map((item, index) => (
              <div
                key={index}
                className="grayButton selected"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <img src={item.icon} alt="" height="100%" />
                <p>{item.method}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="coupon_container">
          <div className="x">
            <div className="flexColumn">
              <p className="title">Challenge</p>
              <p className="challengeTitle">Alpha Pro {size}</p>
            </div>
            <div className="couponWrapper">
              <input
                placeholder="Coupon"
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                onBlur={() => setCouponError("")}
              />
              <button onClick={handleApplyCode}>
                {load ? (
                  <Spinner size={20} />
                ) : !paymentInfo?.discount ? (
                  "Apply code"
                ) : (
                  "Applied"
                )}
              </button>
            </div>
            {couponError && <p className="error">{couponError}</p>}
            <div className="flexSpacebetween discountSection">
              <p>Discount</p>
              <span>${paymentInfo?.discount || 0}</span>
            </div>
            <div className="flexSpacebetween priceSection">
              <span>Total Price</span>
              <span>${paymentInfo?.final_price || initialAmount}</span>
            </div>
            <div className="flexCenter">
              <button
                className="standard-button width50"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? <Spinner size={20} /> : "Make Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default RePaymentModal;
