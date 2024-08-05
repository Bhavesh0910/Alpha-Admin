import React, {useEffect, useState} from "react";
import "./CountryWiseOverview.scss";
import CountryWiseOverviewTable from "../../components/CountryWiseOverview/CountryWiseOverviewTable/CountryWiseOverviewTable";
import PaymentChart from "../../components/CountryWiseOverview/PaymentChart/PaymentChart";
import PayoutChart from "../../components/CountryWiseOverview/PayoutChart/PayoutChart";
import {useSelector} from "react-redux";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";

const CountryWiseOverview = () => {
  const {listData, isLoading} = useSelector((state) => state.countryWise);
  const [chartData, setChartData] = useState({series: [[], []], labels: [[], []]});
  const [totalData, setTotalData] = useState({totalPayment: 0, totalPayout: 0});

  useEffect(() => {
    if (listData && Array.isArray(listData) && listData.length > 0) {
      const getTop10ByField = (data, field, slice = true) => {
        if (slice) {
          return [...data]
            .filter((item) => item && item[field] !== undefined && item[field] !== null)
            .sort((a, b) => b[field] - a[field])
            .slice(0, 8); // Top 8 items
        } else {
          return [...data].map((item) => (item ? item : "-")).sort((a, b) => b[field] - a[field]);
        }
      };
      //filter((item) => item && item[field] !== undefined && item[field] !== null)
      let top10Payments;
      let top10Payouts;
      if (listData.length > 8) {
        top10Payments = getTop10ByField(listData, "payment_total_amount");
        top10Payouts = getTop10ByField(listData, "payout_total_amount");
      } else {
        top10Payments = getTop10ByField(listData, "payment_total_amount", false);
        top10Payouts = getTop10ByField(listData, "payout_total_amount", false);
      }

      console.log("Top 10 Payments: ", top10Payments);
      console.log("Top 10 Payouts: ", top10Payouts);

      const total = listData.reduce(
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

      console.log("Total Payments: ", total.totalPayment);
      console.log("Total Payouts: ", total.totalPayout);

      const paymentPercentages = top10Payments.map((item) => ({
        country: item.country,
        percentage: ((item.payment_total_amount / total.totalPayment) * 100).toFixed(2),
      }));

      const payoutPercentages = top10Payouts.map((item) => ({
        country: item.country,
        percentage: ((item.payout_total_amount / total.totalPayout) * 100).toFixed(2),
      }));

      console.log("Payment Percentages: ", paymentPercentages);
      console.log("Payout Percentages: ", payoutPercentages);

      const topPaymentPercentageSum = paymentPercentages.reduce((sum, item) => sum + parseFloat(item.percentage), 0);
      const topPayoutPercentageSum = payoutPercentages.reduce((sum, item) => sum + parseFloat(item.percentage), 0);

      console.log("Top Payment Percentage Sum: ", topPaymentPercentageSum);
      console.log("Top Payout Percentage Sum: ", topPayoutPercentageSum);

      const paymentLabels = [...paymentPercentages.map((item) => item.country), "Other"].map((item) => (item ? item : "-"));
      const paymentSeries = [...paymentPercentages.map((item) => parseFloat(item.percentage)), parseFloat((100 - topPaymentPercentageSum).toFixed(2))];

      const payoutLabels = [...payoutPercentages.map((item) => item.country), "Other"].map((item) => (item ? item : "-"));
      const payoutSeries = [...payoutPercentages.map((item) => parseFloat(item.percentage)), parseFloat((100 - topPayoutPercentageSum).toFixed(2))];

      console.log("Payment Series: ", paymentSeries);
      console.log("Payment Labels: ", paymentLabels);
      console.log("Payout Series: ", payoutSeries);
      console.log("Payout Labels: ", payoutLabels);

      setChartData({series: [paymentSeries, payoutSeries], labels: [paymentLabels, payoutLabels]});
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
        <PaymentChart chartData={{series: chartData.series[0], labels: chartData.labels[0]}} />
        <PayoutChart chartData={{series: chartData.series[1], labels: chartData.labels[1]}} />
      </div>
    </div>
  );
};

export default CountryWiseOverview;
