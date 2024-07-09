import React, { useEffect, useState } from "react";
import crossIcon from "../../../assets/icons/cross_icon_white.svg";
import "./UserDetails.scss";
import exportBtnIcon from "../../../assets/icons/export_btn_icon.svg";
import verifiedIcon from "../../../assets/icons/verified_green_circleIcon.svg";
import notVerfifiedIcon from "../../../assets/icons/notverified_red_circleIcon.svg";
import { Button, Radio } from "antd";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import moment from "moment";
import { traderAffiliateRefList } from "../../../utils/api/apis";
import { useSelector } from "react-redux";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
const UserDetails = ({ isUserDetailOpened, setIsUserDetailOpened, id }) => {
  const [status, setStatus] = useState("success");

  const onChange = (e) => {
    setStatus(e.target.value);
  };

  const [referredList, setReferredList] = useState([]);
  const idToken = useSelector((state) => state.auth.idToken);
  const [isLoading, setisLoading] = useState(true);

  const data = async () => {
    if (isUserDetailOpened === true) {
      const data = await traderAffiliateRefList(idToken, id);
      setReferredList(data);
      setisLoading(false);
    }
  };
  useEffect(() => {
    data();
  }, [isUserDetailOpened]);
  const columns = [
    {
      title: 'Refered Trader',
      dataIndex: 'referedTrader',
      key: 'referedTrader',
    },
    {
      title: 'Paid Amount',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (text) => `$${text}`, 
    },
    {
      title: 'Commission Amount',
      dataIndex: 'commissionAmount',
      key: 'commissionAmount',
      render: (text) => `$${text}`,
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text) => `${text}%`,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Payment ID',
      dataIndex: 'paymentId',
      key: 'paymentId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  const dummyData = [
    {
      key: "1",
      name: "Jacob Jones",
      email: "debra.holt@example.com",
      country: "Georgia",
      date: "12/4/17",
      flag: "https://flagcdn.com/w320/de.png", // Example flag URL
      account_purchase: "200K",
      isPurchaseVerified: true,
    },
  ];

  const handleCloseBtn = () => {
    setIsUserDetailOpened(!isUserDetailOpened);
  };

  return (
    <div className="userDetails_wrapper">
      <div className="header_wapper">
        <h2 className="page_header">Accounts Range</h2>
        <img src={crossIcon} alt="cross_icon" onClick={handleCloseBtn} />
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
                <img src={exportBtnIcon} alt="export_btn_icon" />
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
      <AntTable data={referredList} columns={columns} />
    </div>
  );
};

export default UserDetails;
