import React from "react";
import ApexCharts from "react-apexcharts";
import "./Stage2Chart.scss";
import {useSelector} from "react-redux";

const Stage2Chart = ({data}) => {
  const {accountOverviewData} = useSelector((state) => state.risk);

  const passPercent = data?.pass_percent || 0;
  const failPercent = data?.fail_percent || 0;
  const inProgressPercent = data?.in_progress_percent || 0;
  const othersPercent = 100 - (passPercent + failPercent + inProgressPercent);

  const options = {
    // series: [passPercent, failPercent, inProgressPercent, othersPercent],
    series: [passPercent, failPercent, inProgressPercent],
    // labels: ["Total Pass", "Total Fail", "Total In progress", "Others"],
    labels: ["Total Pass", "Total Fail", "Total In progress"],
    // colors: ["#A3EA93", "#F97F7F", "#efef35", "#efef35"],
    colors: ["#A3EA93", "#F97F7F", "#efef35", "#efef35"],
    chart: {
      width: 380,
      type: "donut",
      offsetY: 0,
      offsetX: 0,
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    legend: {
      position: "right",
      offsetY: 0,
      height: 230,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "35%",
        },
      },
    },
    stroke: {
      show: true,
      curve: "straight",
      lineCap: "butt",
      colors: undefined,
      width: 2,
      dashArray: 0,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}%`,
      },
    },
  };
  const assessmentData = [
    {
      label: "Total Pass",
      value: accountOverviewData?.stage2?.pass_count || "-",
      tooltip: accountOverviewData?.stage2?.pass_count || "-",
    },
    {
      label: "Total Fail",
      value: accountOverviewData?.stage2?.fail_count || "-",
      tooltip: accountOverviewData?.stage2?.fail_count || "-",
    },
    {
      label: "Total In Progress",
      value: accountOverviewData?.stage2?.in_progress_count || "-",
      tooltip: accountOverviewData?.stage2?.in_progress_count || "-",
    },
  ];
  const roundedValues = assessmentData.map((item) => {
    const value = item?.value;
    if (value && value > 999999) {
      return {
        ...item,
        value: `${Math.floor(value / 1000)}k`,
      };
    }
    return item;
  });
  return (
    <div className="pieChart_wrapper">
      <h2>Stage 02</h2>
      <div className="row1_wrapper">
        <div id="chart">
          <ApexCharts
            options={options}
            series={options.series}
            type="donut"
            width={330}
            height={150}
          />
        </div>
        <div className="labels_container">
          {/* {[accountOverviewData?.stage2?.pass_count || 0, accountOverviewData?.stage2?.fail_count || 0, accountOverviewData?.stage2?.in_progress_count || 0]?.map((label, index) => (
            <div
              key={index}
              className="label_with_value"
            >
              <span className="value">{label}</span>
            </div>
          ))} */}
          {roundedValues?.map((item, index) => (
            <div
              key={index}
              className="label_with_value"
            >
              <span
                className="value"
                title={item.tooltip}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
        <div className="mobileLabels_container">
          {assessmentData?.map((item, index) => (
            <div
              key={index}
              className="label_with_value"
            >
              <div className="labels">
                <span
                  className="square"
                  style={{backgroundColor: options.colors[index]}}
                ></span>
                <span className="label">{item?.label}:</span>
              </div>
              <span
                className="value"
                title={item?.tooltip}
              >
                {item?.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stage2Chart;
