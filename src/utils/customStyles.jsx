import "./style.scss";

const customStyles = {
  singleValue: (provided) => ({
    ...provided,
    fontFamily: "Nunito Sans",
    color: "#FFF",
  }),
  control: (provided) => ({
    ...provided,
    fontFamily: "Nunito Sans",
    color: "#000",
    // maxWidth: "130px",
    minWidth: "100px",
    height: "48px",
    borderRadius: "10px",
    border: "1px solid var(--brand-gradient, #4BB390);",
    background:
      "var(--background-gradient, linear-gradient(240deg, #FFF -93.51%, rgba(255, 255, 255, 0.40) -93.49%, rgba(255, 255, 255, 0.00) 95.73%))",
    cursor: "pointer",
    boxShadow: "none",
    paddingRight: "20px",
    paddingLeft: "10px",
    fontSize: "14px",
    fontWeight: 500,
    "&:hover": {
      border: "1px solid var(--brand-gradient, #4BB390);",
    },
  }),
  option: (provided, { isFocused, isSelected }) => ({
    ...provided,
    color: isSelected ? "#fff" : "#FFF",
    backgroundColor: isSelected ? "#4BB390" : "",
    padding: "10px",
    cursor: "pointer",
    fontFamily: "Nunito Sans",
    fontSize: "14px",
    fontWeight: "400",
    "&:hover": {
      background:
        "var(--brand-gradient, linear-gradient(90deg, #4BB390 18.4%, #4BB390 100%))",
      color: "white",
    },
  }),
  menu: (provided) => ({
    ...provided,
    maxHeight: "maxContent",
    zIndex: "11111111",
    overflow: "hidden",
    maxWidth: "100%",
    minWidth: "100px",
    borderRadius: "10px",
    border: "1px solid var(--brand-gradient, #0273FF)",
    background: "var(--bg, #030504)",
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#fff",
    padding: "0px",
  }),
};

export default customStyles;
