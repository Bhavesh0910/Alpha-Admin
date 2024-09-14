import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, Modal } from "antd";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import "./style.scss";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { fetchCertificatesDetails } from "../../../store/NewReducers/amSlice";
import certificateIcon from '../../../assets/icons/certificate.svg'
import downloadIcon from '../../../assets/icons/download.svg'
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
function AllCertificates({ user_id }) {
  const dispatch = useDispatch();
  const { certificatesDetails, isLoading } = useSelector((state) => state.accountMetrics);
  const idToken = useSelector((state) => state.auth.idToken);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchCertificatesDetails({ user_id, idToken }));
  }, [dispatch, user_id, idToken]);

  const handleViewCertificate = (url) => {
    setCertificateUrl(url);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCertificateUrl('');
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Login ID",
      dataIndex: "login_id",
      key: "login_id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Certificate Link",
      dataIndex: "link",
      key: "link",
      render: (text, record) => (
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            handleViewCertificate(text);
          }}
        >
          <img src={certificateIcon} alt="" />
        </a>
      ),
    },
  ];

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }


  return (
    <div className="all-certificates-wrapper">
      <div className="table_header_filter">
        <div className="search_box_wrapper">
          <input placeholder="Search by category wise" />
          <div className="searchImg">
            <img src={searchIcon} alt="searchIcon" />
          </div>
        </div>
        <div className="date">
          <DatePicker />
        </div>
      </div>
      {isLoading && <LoaderOverlay />}
      <AntTable
        columns={columns}
        data={certificatesDetails ?? []}
        totalPages={Math.ceil(certificatesDetails?.length / pageSize)}
        totalItems={certificatesDetails?.length}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
      />

      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width={800}
        className="custom-modal" 
        style={{ textAlign: 'center'}}
      >
        <div className="certificate_modal" >
          <img src={certificateUrl} alt="Certificate" style={{ maxWidth: '100%', maxHeight: '500px', width:'100%' }} />
          <a
            href={certificateUrl}
            download
            className="certificate_download_btn"
          >
            Download <img src={downloadIcon} alt="" />
          </a>
        </div>
      </Modal>
    </div>
  );
}

export default AllCertificates;
