import React, { useEffect, useState } from "react";
import "./style.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import customStyles from "../../components/customStyles";

const Tabination = ({
  variant = 1,
  style,
  tabItems,
  tabStyle,
  setActiveTab,
  activeTab,
  showTabs,
}) => {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(activeTab);

  useEffect(() => {
    setItems(tabItems);
  }, [tabItems]);

  useEffect(() => {
    setActive(activeTab);
  }, [activeTab]);

  const handleTabination = (e, idx) => {
    setActiveTab(idx);
  };

  // Mobile Dropdown
  const options = items.map((item, index) => ({
    label: item?.name,
    value: [item?.path, index].join(","),
  }));

  const navigate = useNavigate();

  const handleTab = (e, idx) => {
    if (setActiveTab) {
      setActiveTab(Number(idx));
    }
    // navigate(e);
    setActive(Number(idx));
    // localStorage.setItem("activeTab", JSON.stringify(tabItems[idx]));
  };

  const handleMobileTab = (e, idx) => {
    if (setActiveTab) {
      setActiveTab(Number(idx));
    }
    setActive(Number(idx));
    // localStorage.setItem("activeTab", JSON.stringify(tabItems[idx]));
  };

  return (
    <>
      {variant === 1 && (
        <div className="tabination-container ">
          <div className="tabination-wrapper">
            <ul
              style={style}
              className="tabination-subcontainer  tabination-normal"
            >
              {showTabs &&
                items.map((item, index) => (
                  <Link to={item.path && item.path} key={index}>
                    <li
                      style={tabStyle}
                      className={
                        index === active
                          ? "tabination-button tabination-active-button"
                          : "tabination-button"
                      }
                      onClick={(e) => handleTabination(e, index)}
                    >
                      {item.name}
                    </li>
                  </Link>
                ))}
            </ul>
            <div className="tabination-mobile-subcontainer">
              {showTabs === false ? (
                ""
              ) : (
                <Select
                  name="tabs"
                  id="tabs"
                  className="tabination_mobile"
                  options={options}
                  styles={customStyles}
                  isSearchable={false}
                  value={options[activeTab]}
                  classNamePrefix="react-select"
                  onChange={(selectedOption) => {
                    const [path, index] = selectedOption.value.split(",");
                    handleTab(path, index);
                  }}
                />
              )}
            </div>
            <div className="tabination_wrapper">{items[active]?.content}</div>
          </div>
        </div>
      )}

      {variant === 2 && (
        <div className="tabination-container-variant2">
          <div className="tabination-wrapper-variant2">
            <ul
              style={style}
              className="tabination-subcontainer-variant2 tabination-normal"
            >
              {showTabs &&
                items.map((item, index) => (
                  <li
                    style={tabStyle}
                    className={
                      index === active
                        ? "tabination-button-variant2 tabination-active-button-variant2"
                        : "tabination-button-variant2"
                    }
                    onClick={(e) => handleTabination(e, index)}
                  >
                    {item.name}
                  </li>
                ))}
            </ul>
            <div className="tabination-mobile-subcontainer">
              {showTabs === false ? (
                ""
              ) : (
                <Select
                  name="tabs"
                  id="tabs"
                  className="tabination_mobile"
                  options={options}
                  styles={customStyles}
                  isSearchable={false}
                  value={options[activeTab]}
                  classNamePrefix="react-select"
                  onChange={(selectedOption) => {
                    const [path, index] = selectedOption.value.split(",");
                    handleTab(path, index);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* New variant: Variant 3 */}
      {variant === 3 && (
        <div className="tabination-container-variant2">
          <div className="tabination-wrapper-variant2">
            <ul style={style} className="tabination-subcontainer-variant2">
              {showTabs &&
                items.map((item, index) => (
                  <Link to={item.path && item.path} key={index}>
                    <li
                      style={tabStyle}
                      className={
                        index === active
                          ? "tabination-button-variant2 tabination-active-button-variant2"
                          : "tabination-button-variant2"
                      }
                      onClick={(e) => handleTabination(e, index)}
                    >
                      {item.name}
                    </li>
                  </Link>
                ))}
            </ul>
          </div>
        </div>
      )}

      {/* New variant: Variant 4 */}
      {variant === 4 && (
        <div className="tabination-container-variant4">
          <div className="tabination-wrapper-variant4 ">
            <ul
              style={style}
              className="tabination-subcontainer-variant4 tabination-normal"
            >
              {showTabs &&
                items.map((item, index) => (
                  <Link to={item.path && item.path} key={index}>
                    <li
                      style={tabStyle}
                      className={
                        index === active
                          ? "tabination-button-variant4 tabination-active-button-variant4"
                          : "tabination-button-variant4"
                      }
                      onClick={(e) => handleTabination(e, index)}
                    >
                      {item.name}
                    </li>
                  </Link>
                ))}
            </ul>
            <div className="tabination-mobile-subcontainer">
              {showTabs === false ? (
                ""
              ) : (
                <Select
                  name="tabs"
                  id="tabs"
                  className="react-select-container tabination_mobile"
                  classNamePrefix="react-select"
                  options={options}
                  styles={customStyles}
                  isSearchable={false}
                  value={options[activeTab]}
                  onChange={(selectedOption) => {
                    const [path, index] = selectedOption.value.split(",");
                    handleTab(path, index);
                  }}
                />
              )}
            </div>
            <div className="tabination_wrapper-variant4">
              {items[active]?.content}
            </div>
          </div>
        </div>
      )}

      {/* New variant: Variant 5 */}
      {variant === 5 && (
        <div className="tabination-container tab5">
          <div className="tabination-wrapper tab5">
            <ul
              style={style}
              className="tabination-subcontainer  tabination-normal tab5"
            >
              {showTabs &&
                items.map((item, index) => (
                  <Link to={item.path && item.path} key={index}>
                    <li
                      style={tabStyle}
                      className={
                        index === active
                          ? "tabination-button tabination-active-button tab5"
                          : "tabination-button tab5"
                      }
                      onClick={(e) => handleTabination(e, index)}
                    >
                      {item.name}
                    </li>
                  </Link>
                ))}
            </ul>
            <div className="tabination-mobile-subcontainer tab5">
              {showTabs === false ? (
                ""
              ) : (
                <Select
                  name="tabs"
                  id="tabs"
                  className="tabination_mobile"
                  options={options}
                  styles={customStyles}
                  isSearchable={false}
                  value={options[activeTab]}
                  classNamePrefix="react-select"
                  onChange={(selectedOption) => {
                    const [path, index] = selectedOption.value.split(",");
                    handleMobileTab(path, index);
                  }}
                />
              )}
            </div>
            <div className="tabination_wrapper">{items[active]?.content}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tabination;
