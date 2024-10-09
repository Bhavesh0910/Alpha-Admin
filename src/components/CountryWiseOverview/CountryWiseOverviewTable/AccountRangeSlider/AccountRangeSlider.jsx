import { Button, Slider } from "antd";
import { useState, useEffect } from "react";
import "./AccountRangeSlider.scss";
import crossIcon from "../../../../assets/icons/cross_icon_white.svg";

const AccountRangeSlider = ({ setIsRangeOpen, isRangeOpen, setAccRange, accRange, setRawValue }) => {
  const [value, setValue] = useState(accRange || 100);

  // console.log(accRange)
  // useEffect(() => {
  //   setValue(accRange || 100);
  // }, [accRange]);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleCloseBtn = () => {
    setIsRangeOpen(false);
  };

  const handleApply = () => {
    setAccRange(value === 0 ? null : value);
    setRawValue(null);
    handleCloseBtn();
  };

  return (
    <div
      className="accountRange_Wrapper"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="header_wapper">
        <h2>Accounts Range</h2>
        <img
          src={crossIcon}
          alt="cross_icon"
          onClick={handleCloseBtn}
        />
      </div>
      <div className="country_info">
        <p>
          Countries with <span>{">"}{value} accounts</span>
        </p>
      </div>
      <Slider
        value={value}
        min={0}
        max={1000}
        onChange={handleChange}
        tooltip={{
          placement: "bottom",
          formatter: (value) => `More than ${value} `,
        }}
      />
      <div className="action_btn_wrapper">
        <Button
          className="clr_btn"
          onClick={() => setValue(0)}
        >
          Clear
        </Button>
        <Button
          className="apply_btn standard_button"
          type="primary"
          onClick={handleApply}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default AccountRangeSlider;
