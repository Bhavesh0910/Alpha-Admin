import React, { useEffect, useMemo, useState } from "react";
import { DatePicker, Modal, Select } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import "./style.scss";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { fetchCertificatesDetails } from "../../../store/NewReducers/amSlice";
import certificateIcon from '../../../assets/icons/certificate.svg';
import downloadIcon from '../../../assets/icons/download.svg';
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

function AllCertificates({ user_id }) {
  const dispatch = useDispatch();
  const { certificatesDetails, isLoading } = useSelector((state) => state.accountMetrics);
  const idToken = useSelector((state) => state.auth.idToken);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dates, setDates] = useState(null);
  const [certificateType, setCertificateType] = useState(null);

  useEffect(() => {
    let query = `${user_id}?page=${pageNo}&page_size=${pageSize}`;

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      query += `&start_date=${startDate.format("YYYY-MM-DD")}&end_date=${endDate.format("YYYY-MM-DD")}`;
    }

    if (certificateType && certificateType != "All") {
      query += `&certificate_type=${certificateType}`;
    }

    dispatch(fetchCertificatesDetails({ idToken, query }));
  }, [dispatch, user_id, idToken, pageNo, pageSize, dates, certificateType]);

  const columns = useMemo(() => [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Login ID",
      dataIndex: "login_id",
      key: "login_id",
      render: (text) => text ? text : "-",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => text ? text : "-",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => text ? text : "-",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => text ? text : "-",
    },
    {
      title: "Certificate Link",
      dataIndex: "link",
      key: "link",
      render: (text, record) => (
        <a href="#!" onClick={(e) => {
          e.preventDefault();
          handleViewCertificate(text);
        }}>
          <img src={certificateIcon} alt="" />
        </a>
      ),
    },
  ]);

  const handleViewCertificate = (url) => {
    setCertificateUrl(url);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCertificateUrl('');
  };

  const updateDateRange = (dates) => {
    setPageNo(1);
    if (dates) {
      setDates(dates);
    } else {
      setDates(null);
    }
  };

  const handleCertificateTypeChange = (value) => {
    setCertificateType(value);
    setPageNo(1); // Reset to first page when filter changes
  };

  return (
    <div className="all-certificates-wrapper">
      <div className="table_header_filter">
        <div className="date">
          <RangePicker
            format="DD/MMM/YYYY"
            onChange={updateDateRange}
          />
        </div>
        <div className="certificate-type-filter">
          <Select
            placeholder="Select Certificate Type"
            onChange={handleCertificateTypeChange}
            allowClear
            style={{ width: 200 }}
          >
            <Option value="All">All</Option>
            <Option value="Stage 1 Pass">Stage 1 Pass</Option>
            <Option value="Stage 2 Pass">Stage 2 Pass</Option>
            <Option value="Profit Split">Profit Split</Option>
            <Option value="Funded Profit">Funded Profit</Option>
            <Option value="Qualified">Qualified</Option>
          </Select>
        </div>
      </div>
      {isLoading && <LoaderOverlay />}
      <AntTable
        columns={columns}
        data={certificatesDetails?.results ?? []}
        totalPages={Math.ceil(certificatesDetails?.count / pageSize)}
        totalItems={certificatesDetails?.count}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={(page, updatedPageSize) => {
          setPageNo(page);
          setPageSize(updatedPageSize);
        }}
      />
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width={800}
        className="custom-modal"
        style={{ textAlign: 'center' }}
      >
        <div className="certificate_modal">
          <img src={certificateUrl} alt="Certificate" style={{ maxWidth: '100%', maxHeight: '500px', width: '100%' }} />
          <a href={certificateUrl} download className="certificate_download_btn">
            Download <img src={downloadIcon} alt="" />
          </a>
        </div>
      </Modal>
    </div>
  );
}

export default AllCertificates;
