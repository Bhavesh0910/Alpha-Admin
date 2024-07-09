import i18next from '../../i18n/config';


const initialState = {
    title: null,
    msg: {},
    status: null,
};
  
const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ERRORS":
      return {
        msg: action.payload.msg,
        title: action.payload.title,
        status: action.payload.status,
      };
    case "CLEAR_ERRORS":
        return initialState;
    default:
      return state;
  }
}
  
export const returnErrors = (msg, status, title='') => {
    return {
      type: "GET_ERRORS",
      payload: { msg, status, title },
    };
};

export const clearErrors = () => {
    return {
      type: "CLEAR_ERRORS",
    };
};
  
  
export default errorReducer;