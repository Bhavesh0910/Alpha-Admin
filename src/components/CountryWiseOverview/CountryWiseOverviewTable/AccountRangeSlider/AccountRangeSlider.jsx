import { Button, Slider } from "antd";
import { useState } from "react";
import "./AccountRangeSlider.scss";
import crossIcon from "../../../../assets/icons/cross_icon_white.svg";
const AccountRangeSlider = ({ setIsRangeOpen, isRangeOpen }) => {
  const [value, setValue] = useState(30); // Default value is 30

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleCloseBtn = (newValue) => {
    setIsRangeOpen(!isRangeOpen);
  };

  return (
    <div
      className="accountRange_Wrapper"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="header_wapper">
        <h2>Accounts Range</h2>
        <img src={crossIcon} alt="cross_icon" onClick={handleCloseBtn} />
      </div>
      <div className="country_info">
        <p>
          Countries with <span>{value} accounts</span>
        </p>
      </div>
      <Slider
        value={value}
        min={0}
        max={100}
        onChange={handleChange}
        tooltip={{
          placement: "bottom",
          formatter: (value) => `${value} accounts`,
        }}
      />
      <div className="action_btn_wrapper">
        <Button className="clr_btn" onClick={() => setValue(0)}>
          Clear
        </Button>
        <Button className="apply_btn standard_button" type="primary">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default AccountRangeSlider;
