import React, { useState, useEffect } from "react";
import { Select } from "antd";
import "./GeneralLog.scss";
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
      width:70,
      render: (text) => text || "-",
    },
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
      width:70,
      render: (text) => text || "-",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      width:70,
      render: (text) => text || "-",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width:100,
    },
  
  ];

  return (
    <div className="generalLog_container">
      <div className="header_wrapper">
        <h3> General Log</h3>
        <div className="search_box_wrapper">
          <input
            placeholder="Search by category or email..."
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
        scrollY={440}
        isExpandable={true}
        ExpandedComp={ExpandedRowRender}
        rowId="id"
      />
    </div>
  );
};



export default GeneralLog;




const ExpandedRowRender = ({ record }) => {
  return (
    <div className="expanded-row-content">
      <div>
        <p className="value"><strong>Created at: </strong> : {dayjs(record.created).format("YYYY-MM-DD HH:mm:ss")}</p>
      </div>
      <div>
        <p className="value"><strong>Updated at: </strong> {dayjs(record.updated).format("YYYY-MM-DD HH:mm:ss")}</p>
      </div>
    </div>
  );
};