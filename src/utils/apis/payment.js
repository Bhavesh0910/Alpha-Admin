import axios from "axios";
import { removeLastPayment } from "../../store/NewReducers/accountMetrics";

export const initiatePayment = async (body, idToken) => {
  try {
    const res = await axios.post(`payment/initiate-payment/`, body, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const applyCoupon = async (id, code, idToken) => {
  const res = await axios.get(`payment/final-price/${id}/?coupon=${code}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (res.data) return res.data;
};
export const getPaymentStatus = async (idToken, body, dispatch) => {
  let config = {
    headers: { Authorization: `Bearer ${idToken}` },
  };
  try {
    const res = await axios.post(`payment/payment-status/`, body, config);
    res?.status < 399 && dispatch(removeLastPayment());
    return res.data;
  } catch (err) {
    throw err;
  }
};
