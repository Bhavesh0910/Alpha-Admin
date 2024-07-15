import React, {useEffect} from "react";
import "./FundingEvaluation.scss";
import CreatePlan from "../../components/FundingEvaluation/CreatePlan/CreatePlan";
import {Button} from "antd";
import {getFundingDetails} from "../../utils/api/apis";
import {getFundingDataFailure, getFundingDataSuccess} from "../../store/reducers/fundingSlice";
import {useDispatch, useSelector} from "react-redux";
import {returnErrors} from "../../store/reducers/error";
import {useNavigate} from "react-router-dom";
import {fetchFundingDetails} from "../../store/NewReducers/fundingSlice";
import SuccessModal from "../../components/Alerts/SuccessModal";
const FundingEvaluation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   getData();
  // }, []);
  const idToken = useSelector((state) => state.auth.idToken);

  // const getData = async () => {
  //   let response;
  //   try {
  //     response = await getFundingDetails(idToken);
  //   } catch (error) {
  //     dispatch(
  //       returnErrors(
  //         error?.response?.data?.detail || "Something went wrong! Try Again.",
  //         400
  //       )
  //     );
  //   }

  //   if (response?.status === 200) {
  //     dispatch(getFundingDataSuccess(response.data));
  //   } else {
  //     dispatch(getFundingDataFailure());
  //   }
  // };

  useEffect(() => {
    dispatch(fetchFundingDetails(idToken));
  }, [dispatch, idToken]);

  return (
    <div className="fundingEvaluation_container">
      <div className="mobile_headers">
        <h4>Funding Evaluation</h4>
      </div>
      <div className="viewLogs_button_wrapper">
        {/* <Button
          onClick={() =>
            navigate("/funding-evaluation/funding-evaluation-logs")
          }
          className="viewLogs_btn standard_button"
          type="primary"
        >
          View Logs
        </Button> */}
      </div>
      <CreatePlan />
    </div>
  );
};

export default FundingEvaluation;
