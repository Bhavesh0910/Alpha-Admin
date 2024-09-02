import React from "react";
import "./style.scss";
import UK from "../../../../../assets/icons/United-Kingdom.png";
import USA from "../../../../../assets/icons/United-States-of-America.png";
import blueFlag from "../../../../../assets/icons/BlueFlag.svg";
import Japan from "../../../../../assets/icons/Japan.png";
const data = [
  {
    label: "Most Traded Symbol",
    dollar: "$ 72,67,421",
    dollarUnit: "(GBP/USD)",
    flags: [UK, USA],
    footer: "$12,753",
    footerText: "No. of positions placed",
    color: "#04d9ff"
  },
  {
    label: "Most Traded Symbol",
    dollar: "$ 88,43,000",
    dollarUnit: "(EUR/USD)",
    flags: [blueFlag, USA],
    footer: "$50,945",
    footerText: "collective profits made per symbol of all traders",
    color: "#009017"
  },
  {
    label: "Most Traded Symbol",
    dollar: "$ 88,43,000",
    dollarUnit: "(GBP/JPY)",
    flags: [blueFlag, Japan],
    footer: "7,479",
    footerText: "Most Losses",
    color: "#F20000"
  },
  {
    label: "Most Traded Symbol",
    dollar: "$ 72,67,421",
    dollarUnit: "(JPY/USD)",
    flags: [blueFlag, Japan],
    footer: "$84,457",
    footerText: "Total Traded Volume",
    color: "#F26419"
  }
];

export const Infobox = () => {
  return (
    <div className="Infobox_Wrapper">
      {data.map((item, index) => (
        <div className="Infobox_content" key={index}>
          <p className="Infobox_label">{item.label}</p>
          <div className="Infobox_dollar">
            <p className="Infobox_flags">
              {item.flags.map((flag, flagIndex) => (
                <img
                  className={`Infobox_country${flagIndex + 1}`}
                  src={flag}
                  key={flagIndex}
                />
              ))}
            </p>
            <h2>{item.dollar}</h2>
            <h4>{item.dollarUnit}</h4>
          </div>
          <div className="Infobox_footer">
            <p>{item.footerText}</p>
            <h2 style={{ color: item.color }}>{item.footer}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};