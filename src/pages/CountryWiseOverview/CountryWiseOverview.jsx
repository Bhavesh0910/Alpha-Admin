import React, { useEffect, useState } from "react";
import "./CountryWiseOverview.scss";
import CountryWiseOverviewTable from "../../components/CountryWiseOverview/CountryWiseOverviewTable/CountryWiseOverviewTable";
import PaymentChart from "../../components/CountryWiseOverview/PaymentChart/PaymentChart";
import PayoutChart from "../../components/CountryWiseOverview/PayoutChart/PayoutChart";
import { useSelector } from "react-redux";

const CountryWiseOverview = () => {
  const { listData } = useSelector((state) => state.countryWise);
  const [chartData, setChartData] = useState({ series: [[], []], labels: [[], []] });
  const [totalData, setTotalData] = useState({ totalPayment: 0, totalPayout: 0 });

  useEffect(() => {
    if (listData && Array.isArray(listData) && listData.length > 0) {
      const getTop10ByField = (data, field) => {
        return [...data]
          .filter((item) => item && item[field] !== undefined && item[field] !== null) // Filter out null/undefined values
          .sort((a, b) => b[field] - a[field])
          .slice(0, 8); // Top 8 items
      };

      const top10Payments = getTop10ByField(listData, "payment_total_amount");
      const top10Payouts = getTop10ByField(listData, "payout_total_amount");

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

      const paymentPercentages = top10Payments.map((item) => ({
        country: item.country,
        percentage: ((item.payment_total_amount / total.totalPayment) * 100).toFixed(2),
      }));

      const payoutPercentages = top10Payouts.map((item) => ({
        country: item.country,
        percentage: ((item.payout_total_amount / total.totalPayout) * 100).toFixed(2),
      }));

      const topPaymentPercentageSum = paymentPercentages.reduce((sum, item) => sum + parseFloat(item.percentage), 0);
      const topPayoutPercentageSum = payoutPercentages.reduce((sum, item) => sum + parseFloat(item.percentage), 0);

      const paymentLabels = [...paymentPercentages.map((item) => item.country), "Other"];
      const paymentSeries = [...paymentPercentages.map((item) => parseFloat(item.percentage)), parseInt((100 - topPaymentPercentageSum).toFixed(2))];

      const payoutLabels = [...payoutPercentages.map((item) => item.country), "Other"];
      const payoutSeries = [...payoutPercentages.map((item) => parseFloat(item.percentage)), parseInt((100 - topPayoutPercentageSum).toFixed(2))];

      console.log(topPaymentPercentageSum)
      console.log(topPayoutPercentageSum)
      console.log(payoutSeries)
      console.log(payoutLabels)
      console.log(paymentSeries)
      console.log(paymentLabels)

      setChartData({ series: [paymentSeries, payoutSeries], labels: [paymentLabels, payoutLabels] });
      setTotalData(total);
    }
  }, [listData]);

  return (
    <div className="countryWiseOverview_container">
      <div className="row1_table_box">
        <CountryWiseOverviewTable />
      </div>
      <div className="row2_chart_box">
        <PaymentChart chartData={{ series: chartData.series[0], labels: chartData.labels[0] }} />
        <PayoutChart chartData={{ series: chartData.series[1], labels: chartData.labels[1] }} />
      </div>
    </div>
  );
};

export default CountryWiseOverview;
