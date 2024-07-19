import React from "react";
import "./CountryWiseOverview.scss";
import CountryWiseOverviewTable from "../../components/CountryWiseOverview/CountryWiseOverviewTable/CountryWiseOverviewTable";
import PaymentChart from "../../components/CountryWiseOverview/PaymentChart/PaymentChart";
import PayoutChart from "../../components/CountryWiseOverview/PayoutChart/PayoutChart";

const CountryWiseOverview = () => {
  return (
    <div className="countryWiseOverview_container">
      <div className="row1_table_box">
        <CountryWiseOverviewTable />
      </div>
      <div className="row2_chart_box">
        <PaymentChart />
        <PayoutChart />
      </div>
    </div>
  );
};

export default CountryWiseOverview;
