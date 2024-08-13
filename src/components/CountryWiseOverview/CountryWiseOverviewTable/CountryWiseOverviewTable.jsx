import React, {useEffect, useState} from "react";
import "./CountryWiseOverviewTable.scss";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import dayjs from "dayjs";
import {Button, DatePicker, Select} from "antd";
import AccountRangeSlider from "./AccountRangeSlider/AccountRangeSlider";
import rangeIcon from "../../../assets/icons/range_icon_gray.svg";
import {useDispatch, useSelector} from "react-redux";
import {countryWiseListReq} from "../../../store/NewReducers/countryWise";
const {RangePicker} = DatePicker;
const CountryWiseOverviewTable = () => {
  const dispatch = useDispatch();
  const {idToken} = useSelector((state) => state.auth);
  const {listData, count} = useSelector((state) => state.countryWise);
  const [dates, setDates] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [accRange, setAccRange] = useState(null);
  const [countries, setCountries] = useState(listData);
  useEffect(() => {
    // let query = `?page=${pageNo}&page_size=${pageSize}`;
    let query = "";
    if (dates) {
      query += `?start_date=${dates[0]}&end_date=${dates[1]}`;
    }
    if (accRange) {
      query = dates ? query + `&min_account_count=${accRange}` : `?min_account_count=${accRange}`;
    }
    dispatch(countryWiseListReq({idToken, query, dispatch}));
  }, [dates, idToken, accRange]);

  const columns = [
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Total Payments($)",
      dataIndex: "payment_total_amount",
      key: "totalPayments",
      render: (text) => (text ? Number(text).toFixed(2) : "-"),
    },
    {
      title: "Payment Count",
      dataIndex: "payment_total_count",
      key: "totalAccounts",
      render: (text) => text || "-",
    },
    {
      title: "Total Payouts($)",
      dataIndex: "payout_total_amount",
      key: "totalPayouts",
      render: (text) => (text ? Number(text).toFixed(2) : "-"),
    },
    {
      title: "Payouts Count",
      dataIndex: "payout_total_count",
      key: "totalPayouts",
      render: (text) => text || "-",
    },
  ];

  const handleDateChange = (dates, dateStrings) => {
    if (dates) {
      setDates(dates.map((item) => item.format("YYYY-MM-DD")));
    } else {
      setDates(dates);
    }
  };

  useEffect(() => {
    const data = listData.map((item) => item.country);
    setCountries(data);
  }, [listData]);

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }
  const rangePresets = [
    {label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()]},
    {label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()]},
    {label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()]},
    {label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()]},
    {label: "All time", value: [dayjs().subtract(20, "years"), dayjs()]}, // Assuming "All time" covers a very long period
  ];

  const [isRangeOpen, setIsRangeOpen] = useState(false);

  const handleRangeBtn = (e) => {
    setIsRangeOpen(!isRangeOpen);
  };
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    const data = listData.map((item) => ({
      label: item.country ? item.country : "Unknown Country",
      value: item.country ? item.country : "unknown",
    }));
    setCountries(data);
    setFilteredCountries(data);
  }, [listData]);

  const handleSearchInput = (value) => {
    const filteredData = countries.filter((item) =>
      item.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCountries(filteredData);
  };



  return (
    <div className="countryWiseOverviewTable_wrapper">
      <div className="header_wrapper">
      {/* <Select
      mode="multiple"
      placeholder="Please select countries"
      onSearch={handleSearchInput}
      options={filteredCountries}
    /> */}
        <div className="rangeBtn_wrapper">
          <Button
            className="accnt_range_btn"
            onClick={handleRangeBtn}
          >
            <img
              src={rangeIcon}
              alt="range_icn"
            />
            Accounts Range
          </Button>
          {isRangeOpen === true ? (
            <AccountRangeSlider
              isRangeOpen={isRangeOpen}
              setIsRangeOpen={setIsRangeOpen}
              setAccRange={setAccRange}
            />
          ) : (
            ""
          )}
        </div>
        <RangePicker
          presets={rangePresets}
          onChange={handleDateChange}
        />
      </div>
      <AntTable
        data={listData || []}
        columns={columns}
        serverSide={false}
        // totalPages={Math.ceil(count / pageSize)}
        // totalItems={count}
        // pageSize={pageSize}
        // CurrentPageNo={pageNo}
        // setPageSize={setPageSize}
        // triggerChange={triggerChange}
      />
    </div>
  );
};

export default CountryWiseOverviewTable;
