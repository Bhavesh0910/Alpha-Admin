import {Button} from "antd";
import React from "react";
import "./style.scss";
import CreateCertificate from "../../../components/Certificates/CreateCertificate";
import { useNavigate } from "react-router-dom";
const CreateCertificates = () => {
    const navigate=useNavigate()
  return (
    <div className="create_certificates_wrapper">
      <div className="viewLogs_button_wrapper">
        <Button
          className="viewLogs_btn standard_button"
          type="primary"
          onClick={() => navigate(`/certificates/create-certificates/view-logs`)}

        >
          View Logs
        </Button>
      </div>
      <CreateCertificate />
    </div>
  );
};

export default CreateCertificates;
