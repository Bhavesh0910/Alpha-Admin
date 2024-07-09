import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/icons/searchIcon.svg';
import AntTable from '../../ReusableComponents/AntTable/AntTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAffiliateList } from '../../store/NewReducers/affiliateSlice';
import LoaderOverlay from '../../ReusableComponents/LoaderOverlay';

import "./AffiliateMarketing.scss";
import exportBtnIcon from "../../assets/icons/export_btn_icon.svg";
import UserDetails from "../../components/AffiliateMarketing/UserDetails/UserDetails";
const { Option } = Select;

const AffiliateMarketing = ({ userData }) => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState([]);

  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const { affiliateData, currentPage, totalPages, totalItems , isLoading } = useSelector((state) => state.affiliate);
  const idToken = useSelector((state) => state.auth.idToken);

  console.log(totalItems , totalPages)
  useEffect(() => {
    dispatch(fetchAffiliateList({
      idToken,
      pageNo,
      pageSize,
      searchText,
      
    }));
  }, [pageNo , pageSize, , searchText , currentPage, dispatch]);


  useEffect(() => {
    setFilterData(affiliateData)
  }, [affiliateData])
  const handleRowClick = (affiliateId, email) => {
    const url = `/affiliate-marketing/affiliateMarketing-logs?email=${email}`;
    navigate(url);
  };


  const [isUserDetailOpened, setIsUserDetailOpened] = useState(false);
  const [id, setId] = useState()
  const handleViewDetailsBtn = (id) => {
    setIsUserDetailOpened(!isUserDetailOpened);
    setId(id)
    console.log(id)
  };

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text, record) => (
        <div onClick={() => handleRowClick(record.id, record.email)} className="country_flag_div">
          <img src={text.flag} alt="flag" />
          {text}
        </div>
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullname',
      render: (text, record) => (
        <div onClick={() => handleRowClick(record.id, record.email)}>
          {text
            ?.split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text, record) => (
        <div onClick={() => handleRowClick(record.id, record.email)} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {text
            ?.split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </div>
      ),
    },
    {
      title: "Referred List",
      dataIndex: "referredList",
      key: "referredList",
      render: (text, record) => (
        <button
          className="view_details_btn standard_button"
          onClick={() => handleViewDetailsBtn(record.id)}
        >
          View Details
        </button>
      ),
    },
  ];

  const dummyData = [
    {
      key: "1",
      name: "Jacob Jones",
      email: "debra.holt@example.com",
      country: "Georgia",
      flag: "https://flagcdn.com/w320/de.png", // Example flag URL
      referredCount: 1,
      commissionEarned: "$202.87",
      challenge200k: 4,
      challenge300k: 2,
      referredList: "View Details",
    },
  ];

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log(searchText , e.key)
      setSearchText(e.target.value);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  return (
    <div className="affiliateMarketing_container">
      <div className="header_wrapper">
        <h3 className="page_header">Affiliate List</h3>
        <Button
          // onClick={() => navigate('affiliateMarketing-logs')}
          className="view_logs__btn standard_button"
        >
          View Logs
        </Button>
      </div>
      <div className="table_header_filter">
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
        <div className="export_btn">
          <Button
            onClick={() =>
              navigate("/affiliate-marketing/create-affiliate-code")
            }
          >
            <img src={exportBtnIcon} alt="create_btn_icon" />
            Create
          </Button>
        </div>
      </div>
      {isLoading && <LoaderOverlay />}
      <AntTable data={filterData} columns={columns} 
            totalPages={Math.ceil(totalItems / pageSize)}
            totalItems={totalItems}
            pageSize={pageSize}
            CurrentPageNo={pageNo}
            setPageSize={setPageSize}
            triggerChange={triggerChange}
      />

      {isUserDetailOpened && isUserDetailOpened === true ? (
        <div className="userDetails_container">
          <UserDetails
            id={id}
            isUserDetailOpened={isUserDetailOpened}
            setIsUserDetailOpened={setIsUserDetailOpened}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AffiliateMarketing;
