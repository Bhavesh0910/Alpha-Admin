import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./AffiliateCode.scss";
import { fetchAffiliateCodes } from "../../../store/NewReducers/affiliateSlice"; // Update this path as necessary
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import dayjs from "dayjs";

const AffiliateCode = ({ user_id }) => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  const { codes, isLoading } = useSelector((state) => state.affiliate);
  const { idToken } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAffiliateCodes({ idToken, affiliateId: user_id, pageNo, pageSize, searchText }));
  }, [dispatch, pageNo, pageSize, searchText, idToken, user_id]);

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (text) => text || "-",
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
      render: (text) => (text ? `${text}%` : "-"), 
      width: 180
    },
    {
      title: "Pushed Leads",
      dataIndex: "pushed_leads",
      key: "pushed_leads",
      render: (text) => text || "-",
      width: 180
    },
    {
      title: "Consumed By Count",
      dataIndex: "consumed_by_count",
      key: "consumed_by_count",
      render: (text) => text || "-",
      width: 180
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (text) => text ? <a href={text} target="_blank" rel="noopener noreferrer">{text}</a> : "-",
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
    setPageNo(1); // Reset to first page on search
  };

  return (
    <div className="affiliate_code">
      <div className="header_wrapper">
        {/* <h3 className="page_header">Affiliate Codes</h3> */}
      </div>
      {/* <div className="search_box_wrapper">
        <Input
          placeholder="Search by Code..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onPressEnter={() => handleSearch(searchText)}
        />
      </div> */}
      {isLoading ? (
        <LoaderOverlay />
      ) : (
        <AntTable
          data={codes || []}
          columns={columns}
          totalPages={Math.ceil(codes?.length / pageSize)}
          totalItems={codes?.length}
          pageSize={pageSize}
          CurrentPageNo={pageNo}
          setPageSize={setPageSize}
          triggerChange={setPageNo}
          scrollY={400}
        />
      )}
    </div>
  );
};

export default AffiliateCode;
