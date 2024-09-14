import { Card } from "antd";
import React from "react";
import CertificateViewLogTbale from "../../../../components/Certificates/CreateCertificate/ViewLogs";
import './style.scss'
const CreateCertificateViewLogs = () => {
  return (
    <div className="logs">
      <Card className="table-wrapper">
        <CertificateViewLogTbale />
      </Card>
    </div>
  );
};

export default CreateCertificateViewLogs;
