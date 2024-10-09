import React, {useEffect, useMemo, useState} from "react";
import "./CountryWiseOverviewTable.scss";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import dayjs from "dayjs";
import {Button, DatePicker, notification, Select} from "antd";
import AccountRangeSlider from "./AccountRangeSlider/AccountRangeSlider";
import rangeIcon from "../../../assets/icons/range_icon_gray.svg";
import {useDispatch, useSelector} from "react-redux";
import {countryWiseListReq, resetCountryWiseData, setCountrySelectedFlag, setCountryWiseData} from "../../../store/NewReducers/countryWise";
import searchIcon from "../../../assets/icons/searchIcon.svg";

const {RangePicker} = DatePicker;
const CountryWiseOverviewTable = () => {
  const dispatch = useDispatch();
  const {idToken} = useSelector((state) => state.auth);
  const {listData, count, filterListData} = useSelector((state) => state.countryWise);
  const [dates, setDates] = useState(null);
  const [lastValidDates, setLastValidDates] = useState([dayjs().subtract(1, "month"), dayjs()]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [accRange, setAccRange] = useState(null);
  const [rawValue, setRawValue] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const [countriesLibrary, setCountriesLibrary] = useState({});
  const [isValidRange, setIsValidRange] = useState(true);

  const handleDateChange = (dates) => {
    setRawValue(null);
    if (dates) {
      setDates(dates);
      // fetchCountryWiseData();
    } else {
      setDates(null);
      setLastValidDates([dayjs().subtract(1, "month"), dayjs()]);
      // fetchCountryWiseData();
    }
  };

  console.log("listData", listData);

  useEffect(() => {
    if (idToken) {
      fetchCountryWiseData();
    }
    console.log("I am here");
  }, [idToken, dates, accRange]);

  const fetchCountryWiseData = () => {
    if (dates) {
      const [startDate, endDate] = dates;
      if (endDate.isAfter(dayjs()) || startDate.isAfter(dayjs())) {
        setIsValidRange(false);
        notification.error({
          message: "Invalid Date Range",
          description: `The selected date range (${startDate.format("DD/MMM/YYYY")} - ${endDate.format("DD/MMM/YYYY")}) contains future dates. Please select a valid range.`,
        });
        setDates(lastValidDates);
      } else {
        setIsValidRange(true);
        setLastValidDates([startDate, endDate]);

        const formattedStartDate = startDate.format("DD/MMM/YYYY");
        const formattedEndDate = endDate.format("DD/MMM/YYYY");

        dispatch(countryWiseListReq({idToken, query: `?start_date=${formattedStartDate}&end_date=${formattedEndDate}${accRange ? `&min_account_count=${accRange}` : ""}`}));
      }
    } else {
      setIsValidRange(true);
      dispatch(countryWiseListReq({idToken, query: `${accRange ? `?min_account_count=${accRange}` : ""}`, dispatch}));
    }
  };

  useEffect(() => {
    if (dates) {
      handleCountriesData();
    }
  }, [dates, countries]);

  const columns = useMemo(() => [
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 110,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "No. Of Payment",
      dataIndex: "no_of_payments",
      key: "totalPayments",
      width: 95,
      render: (text) => (text === 0 ? 0 : text ? text : "-"),
    },
    {
      title: "Total Payments($)",
      dataIndex: "total_payments",
      key: "totalPayments",
      width: 95,
      render: (text) => (text === 0 ? 0 : text ? Number(text).toFixed(2) : "-"),
    },
    {
      title: "Total Payouts($)",
      dataIndex: "total_payouts",
      key: "totalPayouts",
      width: 95,
      render: (text) => (text === 0 ? 0 : text ? Number(text).toFixed(2) : "-"),
    },
    {
      title: "No. of Payouts",
      dataIndex: "no_of_payouts",
      key: "totalPayouts",
      width: 95,
      render: (text) => (text === 0 ? 0 : text ? text : "-"),
    },
    {
      title: "Total users",
      dataIndex: "total_users",
      key: "totalPayouts",
      width: 95,
      render: (text) => (text === 0 ? 0 : text ? text : "-"),
    },
    {
      title: "Total No. of Violations",
      dataIndex: "total_violations",
      key: "totalPayouts",
      width: 95,
      render: (text) => (text === 0 ? 0 : text ? text : "-"),
    },
    {
      title: "Total No. of Breached Accounts",
      dataIndex: "total_breaches",
      key: "totalPayouts",
      width: 95,
      render: (text) => (text === 0 ? 0 : text ? text : "-"),
    },
    {
      title: "Percent Payments",
      dataIndex: "percent_payments",
      key: "totalPayouts",
      width: 95,
      render: (text) => (text === 0 ? 0 : text ? text : "-"),
    },
    {
      title: "Percent Payouts",
      dataIndex: "percent_payouts",
      key: "totalPayouts",
      width: 95,
      render: (text) => (text === 0 ? 0 : text ? text : "-"),
    },
  ]);

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
    const data = filterListData.map((item) => ({
      label: item.country ? item.country : "Unknown Country",
      value: item.country ? item.country : "unknown",
    }));
    setCountries(data);
    setFilteredCountries(data);
  }, [filterListData]);

  const handleSearchInput = (value) => {
    const filteredData = countries?.filter((item) => item.label.toLowerCase().includes(value.toLowerCase()));
    setFilteredCountries(filteredData);
  };

  useEffect(() => {
    const data = {};
    filterListData.forEach((item) => {
      data[item.country] = {
        country: item.country,
        total_payouts: item.total_payouts,
        no_of_payouts: item.no_of_payouts,
        total_payments: item.total_payments,
        no_of_payments: item.no_of_payments,
        total_users: item.total_users,
        total_breaches: item.total_breaches,
        total_violations: item.total_violations,
        percent_payments: item.percent_payments,
        percent_payouts: item.percent_payouts,
      };
    });
    setCountriesLibrary(data);
    return () => {
      dispatch(setCountrySelectedFlag(true));
    };
  }, [filterListData]);

  useEffect(() => {
    console.log("Component rendered or state updated");
  }, [dates, idToken, accRange]);

  function handleCountriesData(val = true) {
    const data = selectedCountries.map((item) => countriesLibrary[item]);
    if (val && selectedCountries && selectedCountries.length > 0) {
      dispatch(setCountrySelectedFlag(true));
      dispatch(setCountryWiseData(data));
    } else {
      dispatch(resetCountryWiseData());
      dispatch(setCountrySelectedFlag(false));
    }
    setFilteredCountries(countries);
  }

  useEffect(() => {
    console.log(filteredCountries, " filteredCountries");
  }, [filteredCountries]);
  return (
    <div className="countryWiseOverviewTable_wrapper">
      <div className="header_wrapper">
        <div className="countrySearch">
          <Select
            mode="multiple"
            placeholder="Please select countries"
            onSearch={handleSearchInput}
            onChange={(value) => {
              if (value === null) {
                handleCountriesData(false);
              }
              setRawValue(value);
              setSelectedCountries(value);
              setFilteredCountries(countries);
              console.log("Value : ", value);
            }}
            value={rawValue}
            options={filteredCountries}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     handleCountriesData();
            //   }
            // }}
            allowClear
          />
          <Button onClick={handleCountriesData}>Search</Button>
        </div>

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
              accRange={accRange}
              setRawValue={setRawValue}
            />
          ) : (
            ""
          )}
        </div>
        <RangePicker
          value={dates}
          presets={rangePresets}
          onChange={handleDateChange}
        />
      </div>
      <AntTable
        data={listData || []}
        columns={columns}
        serverSide={false}
      />
    </div>
  );
};

export default CountryWiseOverviewTable;
