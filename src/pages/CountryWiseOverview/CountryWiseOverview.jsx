import React, {useEffect, useState} from "react";
import "./CountryWiseOverview.scss";
import CountryWiseOverviewTable from "../../components/CountryWiseOverview/CountryWiseOverviewTable/CountryWiseOverviewTable";
import PaymentChart from "../../components/CountryWiseOverview/PaymentChart/PaymentChart";
import PayoutChart from "../../components/CountryWiseOverview/PayoutChart/PayoutChart";
import {useSelector} from "react-redux";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";

const CountryWiseOverview = () => {
  const {listData, isCountrySelectedFlag, filterListData, isLoading} = useSelector((state) => state.countryWise);
  const [chartData, setChartData] = useState({series: [[], []], labels: [[], []], amounts: [[], []], percent: [[], []]});
  const [totalData, setTotalData] = useState({totalPayment: 0, totalPayout: 0});

  useEffect(() => {
    if (listData && Array.isArray(listData) && listData.length > 0) {
      let inputVal = 8;
      const getTopNFields = (data, field, slice = true, key = inputVal) => {
        if (slice) {
          return [...data]
            .filter((item) => item && item[field] !== undefined && item[field] !== null)
            .sort((a, b) => b[field] - a[field])
            .slice(0, key);
        } else {
          return [...data].map((item) => (item ? item : "-")).sort((a, b) => b[field] - a[field]);
        }
      };
      //filter((item) => item && item[field] !== undefined && item[field] !== null)
      let topNPayments;
      let topNPayouts;
      if (listData.length > inputVal) {
        topNPayments = getTopNFields(listData, "total_payments");
        topNPayouts = getTopNFields(listData, "total_payouts");
      } else {
        topNPayments = getTopNFields(listData, "total_payments", false);
        topNPayouts = getTopNFields(listData, "total_payouts", false);
      }

      let topNPaymentPercent = topNPayments.map((item) => item.percent_payments ?? 0);
      let topNPayoutPercent = topNPayments.map((item) => item.percent_payouts ?? 0);

      const total = filterListData.reduce(
        (acc, item) => {
          acc.totalPayment += item.total_payments || 0;
          acc.totalPayout += item.total_payouts || 0;
          return acc;
        },
        {
          totalPayment: 0,
          totalPayout: 0,
        },
      );

      const paymentPercentages = topNPayments.map((item) => ({
        country: item.country,
        percentage: ((item.total_payments / total.totalPayment) * 100).toFixed(2),
        paymentAmount: item.total_payments?.toFixed(2),
      }));

      const payoutPercentages = topNPayouts.map((item) => ({
        country: item.country,
        percentage: ((item?.total_payouts / total.totalPayout) * 100).toFixed(2),
        payoutAmount: item?.total_payouts?.toFixed(2),
      }));

      const topPaymentPercentageSum = paymentPercentages.reduce((sum, item) => sum + parseFloat(item.percentage), 0);
      const topPayoutPercentageSum = payoutPercentages.reduce((sum, item) => sum + parseFloat(item.percentage), 0);

      let payoutSeries = [];
      let payoutLabels = [];
      let payoutAmounts = [];
      let paymentSeries = [];
      let paymentAmounts = [];
      let paymentLabels = [];

      const paymentAmountSum = paymentPercentages.reduce((sum, item) => sum + parseFloat(item.paymentAmount), 0);
      const payoutAmountSum = payoutPercentages.reduce((sum, item) => sum + parseFloat(item.payoutAmount), 0);

      // if (!isCountrySelectedFlag && listData.length > inputVal) {
      //   paymentAmounts = [...paymentPercentages.map((item) => item.paymentAmount), total.totalPayment - paymentAmountSum].map((item) => (item ? item : "-"));
      //   paymentLabels = [...paymentPercentages.map((item) => item.country), "Other"].map((item) => (item ? item : "-"));
      //   paymentSeries = [...paymentPercentages.map((item) => parseFloat(item.percentage)), parseFloat((100 - topPaymentPercentageSum).toFixed(2))];

      //   payoutAmounts = [...payoutPercentages.map((item) => item.payoutAmount), total.totalPayout - payoutAmountSum].map((item) => (item ? item : "-"));
      //   payoutLabels = [...payoutPercentages.map((item) => item.country), "Other"].map((item) => (item ? item : "-"));
      //   payoutSeries = [...payoutPercentages.map((item) => parseFloat(item.percentage)), parseFloat((100 - topPayoutPercentageSum).toFixed(2))].map((item) => (isNaN(item) ? 0 : item));
      // } else {
      paymentAmounts = paymentPercentages.map((item) => item.paymentAmount ?? 0);
      paymentLabels = paymentPercentages.map((item) => item.country || "N/A");
      paymentSeries = paymentPercentages.map((item) => parseFloat(item.percentage) ?? 0);

      payoutAmounts = payoutPercentages.map((item) => item.payoutAmount ?? 0);
      payoutLabels = payoutPercentages.map((item) => item.country || "N/A");
      payoutSeries = payoutPercentages.map((item) => parseFloat(item.percentage) ?? 0);
      // }

      setChartData({series: [topNPaymentPercent, topNPayoutPercent], labels: [paymentLabels, payoutLabels], amounts: [paymentAmounts, payoutAmounts], percent: [topNPaymentPercent, topNPayoutPercent]});
      setTotalData(total);
    }
  }, [listData]);

  // useEffect(()=>{
  //   console.log("chartData : ",chartData)
  //   console.log(" ====== ")
  // },[chartData])

  return (
    <div className="countryWiseOverview_container">
      {isLoading && <LoaderOverlay />}
      <div className="row1_table_box">
        <CountryWiseOverviewTable />
      </div>
      <div className="row2_chart_box">
        <PaymentChart chartData={{series: chartData.series[0], labels: chartData.labels[0], amounts: chartData.amounts[0], percent:chartData.percent[0]}} />
        <PayoutChart chartData={{series: chartData.series[1], labels: chartData.labels[1], amounts: chartData.amounts[1], percent:chartData.percent[1]}} />
      </div>
    </div>
  );
};

export default CountryWiseOverview;
