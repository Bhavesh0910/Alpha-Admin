import React, { useEffect, useState } from "react";
import { Button, Radio } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import "./UserDetails.scss";
import exportBtnIcon from "../../../assets/icons/export_btn_icon.svg";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { traderAffiliateRefList } from "../../../utils/api/apis";
import { useSelector } from "react-redux";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";

const UserDetails = ({ isUserDetailOpened, setIsUserDetailOpened, id }) => {
  const [status, setStatus] = useState("success");
  const [referredList, setReferredList] = useState([]);
  const idToken = useSelector((state) => state.auth.idToken);
  const [isLoading, setisLoading] = useState(true);

  const onChange = (e) => {
    setStatus(e.target.value);
  };

  const fetchData = async () => {
    if (isUserDetailOpened) {
      setisLoading(true);
      try {
        const data = await traderAffiliateRefList(idToken, id);
        setReferredList(data);
      } catch (error) {
        console.error("Error fetching referred list:", error);
      } finally {
        setisLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [isUserDetailOpened]);

  const columns = [
    {
      title: "Referred Trader",
      dataIndex: "referredTrader",
      key: "referredTrader",
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (text) => `$${text}`,
    },
    {
      title: "Commission Amount",
      dataIndex: "commissionAmount",
      key: "commissionAmount",
      render: (text) => `$${text}`,
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
      render: (text) => `${text}%`,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Payment ID",
      dataIndex: "paymentId",
      key: "paymentId",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  const handleCloseBtn = () => {
    setIsUserDetailOpened(false);
  };

  return (
    <div className={`userDetails_wrapper ${isUserDetailOpened ? 'open' : 'closed'}`}>
      <div className="header_wrapper">
        <h2 className="page_header">Accounts Range</h2>
        <CloseOutlined
          className="close_icon"
          onClick={handleCloseBtn}
        />
      </div>
      <div className="topSection_wrapper">
        <div className="list_header">Referred List</div>
        <div className="rightSection">
          <div className="groupA tabs_wrapper">
            <Radio.Group value={status} onChange={onChange}>
              <Radio.Button value="success">Success</Radio.Button>
              <Radio.Button value="failed">Failed</Radio.Button>
            </Radio.Group>
          </div>
          <div className="groupB">
            <div className="export_btn">
              <Button>
                <img src={exportBtnIcon} alt="Export" />
                Export
              </Button>
            </div>
            <a href="/affiliate-marketing/affiliateMarketing-exportHistory">
              <p>View Export History</p>
            </a>
          </div>
        </div>
      </div>
      {isLoading && <LoaderOverlay />}
      <AntTable
        data={referredList}
        columns={columns}
      />
    </div>
  );
};

export default UserDetails;
