import React, { useState } from "react";
import "./CountryWiseOverviewTable.scss";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import dayjs from "dayjs";
import { Button, DatePicker } from "antd";
import AccountRangeSlider from "./AccountRangeSlider/AccountRangeSlider";
import rangeIcon from "../../../assets/icons/range_icon_gray.svg";
const { RangePicker } = DatePicker;
const CountryWiseOverviewTable = () => {
  const columns = [
    {
      title: "",
      dataIndex: "",
      key: "",
      render: (text, record, index) => {
        return <div className="index_cell">{index + 1}</div>;
      },
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "No. Of Payment",
      dataIndex: "noOfPayment",
      key: "noOfPayment",
    },
    {
      title: "Total Payments($)",
      dataIndex: "totalPayments",
      key: "totalPayments",
    },
    {
      title: "Total Payouts($)",
      dataIndex: "totalPayouts",
      key: "totalPayouts",
    },
    {
      title: "Total No. Of Account",
      dataIndex: "totalAccounts",
      key: "totalAccounts",
    },
    {
      title: "Total No. Of Violence",
      dataIndex: "totalViolence",
      key: "totalViolence",
    },
    {
      title: "Total No. Of Breached Accounts",
      dataIndex: "breachedAccounts",
      key: "breachedAccounts",
    },
  ];

  const dummyData = [
    {
      key: 1,
      country: "Japan",
      noOfPayment: 56,
      totalPayments: "$778.35",
      totalPayouts: "$106.58",
      totalAccounts: 78,
      totalViolence: 18,
      breachedAccounts: 8,
    },
    {
      key: 2,
      country: "Iceland",
      noOfPayment: 36,
      totalPayments: "$106.58",
      totalPayouts: "$328.85",
      totalAccounts: 36,
      totalViolence: 26,
      breachedAccounts: 12,
    },
    {
      key: 3,
      country: "Japan",
      noOfPayment: 86,
      totalPayments: "$778.35",
      totalPayouts: "$778.35",
      totalAccounts: 86,
      totalViolence: 6,
      breachedAccounts: 5,
    },
    {
      key: 4,
      country: "India",
      noOfPayment: 78,
      totalPayments: "$328.85",
      totalPayouts: "$778.35",
      totalAccounts: 78,
      totalViolence: 10,
      breachedAccounts: 12,
    },
    {
      key: 5,
      country: "Bahrain",
      noOfPayment: 56,
      totalPayments: "$406.27",
      totalPayouts: "$854.08",
      totalAccounts: 56,
      totalViolence: 8,
      breachedAccounts: 8,
    },
    {
      key: 6,
      country: "India",
      noOfPayment: 46,
      totalPayments: "$293.01",
      totalPayouts: "$219.78",
      totalAccounts: 78,
      totalViolence: 8,
      breachedAccounts: 6,
    },
    {
      key: 7,
      country: "Guinea",
      noOfPayment: 56,
      totalPayments: "$475.22",
      totalPayouts: "$351.02",
      totalAccounts: 56,
      totalViolence: 6,
      breachedAccounts: 2,
    },
    {
      key: 8,
      country: "Poland",
      noOfPayment: 78,
      totalPayments: "$219.78",
      totalPayouts: "$293.01",
      totalAccounts: 78,
      totalViolence: 18,
      breachedAccounts: 3,
    },
    {
      key: 9,
      country: "Monaco",
      noOfPayment: 56,
      totalPayments: "$779.58",
      totalPayouts: "$406.27",
      totalAccounts: 56,
      totalViolence: 26,
      breachedAccounts: 6,
    },
    {
      key: 10,
      country: "Brazil",
      noOfPayment: 78,
      totalPayments: "$351.02",
      totalPayouts: "$779.58",
      totalAccounts: 56,
      totalViolence: 16,
      breachedAccounts: 5,
    },
  ];

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      // console.log("From: ", dates[0], ", to: ", dates[1]);
      // console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
    } else {
      // console.log("Clear");
    }
  };

  const rangePresets = [
    { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
    { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
    { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
    { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
    { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] }, // Assuming "All time" covers a very long period
  ];

  const [isRangeOpen, setIsRangeOpen] = useState(false);

  const handleRangeBtn = (e) => {
    setIsRangeOpen(!isRangeOpen);
  };

  return (
    <div className="countryWiseOverviewTable_wrapper">
      <div className="header_wrapper">
        <div className="rangeBtn_wrapper">
          <Button className="accnt_range_btn" onClick={handleRangeBtn}>
            <img src={rangeIcon} alt="range_icn" />
            Accounts Range
          </Button>
          {isRangeOpen === true ? (
            <AccountRangeSlider
              isRangeOpen={isRangeOpen}
              setIsRangeOpen={setIsRangeOpen}
            />
          ) : (
            ""
          )}
        </div>
        <RangePicker presets={rangePresets} onChange={onRangeChange} />
      </div>
      <AntTable data={dummyData} columns={columns} />
    </div>
  );
};

export default CountryWiseOverviewTable;
