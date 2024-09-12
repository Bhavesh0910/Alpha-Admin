import React, {useEffect, useState} from "react";
import "./CountryWiseOverview.scss";
import CountryWiseOverviewTable from "../../components/CountryWiseOverview/CountryWiseOverviewTable/CountryWiseOverviewTable";
import PaymentChart from "../../components/CountryWiseOverview/PaymentChart/PaymentChart";
import PayoutChart from "../../components/CountryWiseOverview/PayoutChart/PayoutChart";
import {useSelector} from "react-redux";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";

const CountryWiseOverview = () => {
  const {listData, isCountrySelectedFlag,filterListData, isLoading} = useSelector((state) => state.countryWise);
  const [chartData, setChartData] = useState({series: [[], []], labels: [[], []], amounts: [[], []]});
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
        topNPayments = getTopNFields(listData, "payment_total_amount");
        topNPayouts = getTopNFields(listData, "payout_total_amount");
      } else {
        topNPayments = getTopNFields(listData, "payment_total_amount", false);
        topNPayouts = getTopNFields(listData, "payout_total_amount", false);
      }

      const total = filterListData.reduce(
        (acc, item) => {
          acc.totalPayment += item.payment_total_amount || 0;
          acc.totalPayout += item.payout_total_amount || 0;
          return acc;
        },
        {
          totalPayment: 0,
          totalPayout: 0,
        },
      );

      const paymentPercentages = topNPayments.map((item) => ({
        country: item.country,
        percentage: ((item.payment_total_amount / total.totalPayment) * 100).toFixed(2),
        paymentAmount: item.payment_total_amount?.toFixed(2),
      }));

      const payoutPercentages = topNPayouts.map((item) => ({
        country: item.country,
        percentage: ((item?.payout_total_amount / total.totalPayout) * 100).toFixed(2),
        payoutAmount: item?.payout_total_amount?.toFixed(2),
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

      if (!isCountrySelectedFlag && listData.length > inputVal) {
        paymentAmounts = [...paymentPercentages.map((item) => item.paymentAmount), total.totalPayment - paymentAmountSum].map((item) => (item ? item : "-"));
        paymentLabels = [...paymentPercentages.map((item) => item.country), "Other"].map((item) => (item ? item : "-"));
        paymentSeries = [...paymentPercentages.map((item) => parseFloat(item.percentage)), parseFloat((100 - topPaymentPercentageSum).toFixed(2))];

        payoutAmounts = [...payoutPercentages.map((item) => item.payoutAmount), total.totalPayout - payoutAmountSum].map((item) => (item ? item : "-"));
        payoutLabels = [...payoutPercentages.map((item) => item.country), "Other"].map((item) => (item ? item : "-"));
        payoutSeries = [...payoutPercentages.map((item) => parseFloat(item.percentage)), parseFloat((100 - topPayoutPercentageSum).toFixed(2))].map((item) => (isNaN(item) ? 0 : item));
      } else {
        paymentAmounts = paymentPercentages.map((item) => item.paymentAmount);
        paymentLabels = paymentPercentages.map((item) => item.country);
        paymentSeries = paymentPercentages.map((item) => parseFloat(item.percentage));

        payoutAmounts = payoutPercentages.map((item) => item.payoutAmount);
        payoutLabels = payoutPercentages.map((item) => item.country);
        payoutSeries = payoutPercentages.map((item) => parseFloat(item.percentage));
      }

      setChartData({series: [paymentSeries, payoutSeries], labels: [paymentLabels, payoutLabels], amounts: [paymentAmounts, payoutAmounts]});
      setTotalData(total);
    }
  }, [listData]);

  return (
    <div className="countryWiseOverview_container">
      {isLoading && <LoaderOverlay />}
      <div className="row1_table_box">
        <CountryWiseOverviewTable />
      </div>
      <div className="row2_chart_box">
        <PaymentChart chartData={{series: chartData.series[0], labels: chartData.labels[0], amounts: chartData.amounts[0]}} />
        <PayoutChart chartData={{series: chartData.series[1], labels: chartData.labels[1], amounts: chartData.amounts[1]}} />
      </div>
    </div>
  );
};

export default CountryWiseOverview;
