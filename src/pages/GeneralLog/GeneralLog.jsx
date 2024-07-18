import { Select } from "antd";
import "./GeneralLog.scss";
import React, { useState, useEffect } from "react";
import searchIcon from "../../assets/icons/searchIcon.svg";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneralLog } from "../../store/NewReducers/generalSlice";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import dayjs from "dayjs";

const { Option } = Select;

const GeneralLog = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);

  const dispatch = useDispatch();
  const { generalLogData, isLoading } = useSelector((state) => state.general);
  const idToken = useSelector((state) => state.auth.idToken);
 console.log(generalLogData)
  useEffect(() => {
    if (idToken) {
      dispatch(fetchGeneralLog({ idToken, pageNo, pageSize, search: searchText }));
    }
  }, [dispatch, idToken, pageNo, pageSize, searchText]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchText(e.target.value);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };


  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }



  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => text || "N/A",
    },
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
      render: (text) => text || "N/A",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      render: (text) => text || "N/A",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Updated",
      dataIndex: "updated",
      key: "updated",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];
  return (
    <div className="generalLog_container">
      <div className="header_wrapper">
        <h3> General Log</h3>
        <div className="search_box_wrapper">
          <Select
            className="category_dropdown"
            defaultValue="all"
            onChange={handleCategoryChange}
          >
            <Option value="all">All Categories</Option>
            <Option value="swift">Swift</Option>
            <Option value="wire">Wire</Option>
          </Select>
          <input
            placeholder="Search..."
            className="search_input"
            onKeyDown={(e) => handleSearch(e)}
          />
          <div className="searchImg">
            <img src={searchIcon} alt="searchIcon" />
          </div>
        </div>
      </div>
      {isLoading && <LoaderOverlay />}
      <AntTable
           data={generalLogData?.results}
           columns={columns}
           totalPages={Math.ceil(generalLogData?.count / pageSize)}
           totalItems={generalLogData?.count}
           pageSize={pageSize}
           CurrentPageNo={pageNo}
           setPageSize={setPageSize}
           triggerChange={triggerChange}
      />
    </div>
  );
};

export default GeneralLog;
