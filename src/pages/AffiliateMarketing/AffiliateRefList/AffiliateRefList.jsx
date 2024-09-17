import React, { useEffect, useState } from "react";
import "./AffiliateRefList.scss";
import { DatePicker, Button, notification, Modal } from "antd";
import { Link, useLocation } from "react-router-dom";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import exportBtnIcon from "../../../assets/icons/export_btn_icon.svg";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import LineChart from "./LineChart";
import { fetchReferredList, fetchAffExportData, fetchPushleadsChartData } from "../../../store/NewReducers/affiliateSlice";
import { returnErrors } from "../../../store/reducers/error";
import { returnMessages } from "../../../store/reducers/message";
import { CloseOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;



const AffiliateRefList = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("all");
    const [searchText, setSearchText] = useState("");
    const [category, setCategory] = useState("all");
    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);
    const [dates, setDates] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [exportDates, setExportDates] = useState(null);
    const [sessionId, setSessionId] = useState('');

    const { idToken } = useSelector((state) => state.auth);
    const { referredList, pushleadsChartData, affiliateExportData , isLoading, isExportLoading } = useSelector((state) => state.affiliate);
    const { state } = useLocation();
    const id = state?.id;
    const user_id = state?.user_id



    useEffect(() => {
        if (id) {
            dispatch(fetchReferredList({ idToken, affiliateId: id, activeTab }));
            dispatch(fetchPushleadsChartData({ idToken, user_id: user_id }));
        }
    }, [id, activeTab, idToken, dispatch ]);


    const handleSearch = (value) => {
        setPageNo(1);
        setSearchText(value);
    };

    const handleTabChange = (value) => {
        setPageNo(1);
        setActiveTab(value);
        dispatch(fetchReferredList({ idToken, affiliateId: id, activeTab: value }));
    };

    const handleCategoryChange = (value) => {
        setPageNo(1);
        setCategory(value);
    };

    const updateDateRange = (dates) => {
        setPageNo(1);
        if (dates) {
            setDates(dates.map((date) => date.format("DD MMM YYYY")));
        } else {
            setDates(null);
        }
    };

    const rangePresets = [
        { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
        { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
        { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
        { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
        { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] },
    ];

    const handleExport = async () => {
        if (exportDates && exportDates.length === 2) {
            const [startDate, endDate] = exportDates;
            try {
                const response =  dispatch(fetchAffExportData({ idToken, affiliateId: id, startDate, endDate }));
                if (affiliateExportData?.data?.s3_file_url) {
                    const s3_file_url = affiliateExportData?.data?.s3_file_url;
                    const link = document.createElement("a");
                    link.href = s3_file_url;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    console.log(s3_file_url)
                    dispatch(returnMessages("Export Successful", 200));
                } else {
                    console.error("Failed to fetch export data.");
                }
            } catch (error) {
                console.error("Error exporting data:", error);
                dispatch(returnErrors("Error exporting data", 400));
            } finally {
                setModalVisible(false);
            }
        } else {
            notification.warning({
                message: "Invalid Dates",
                description: "Please select a valid date range.",
            });
        }
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const updateExportDateRange = (dates) => {
        if (dates) {
            setExportDates(dates.map(date => date.format("YYYY-MM-DD")));
        } else {
            setExportDates(null);
        }
    };

    const columns = [
        {
            title: "Referred Trader",
            dataIndex: "referredTrader",
            key: "referredTrader",
        },
        {
            title: "Paid Amount",
            dataIndex: "paidAmount",
            key: "paidAmount",
            render: (text) => `$${text}`,
        },
        {
            title: "Commission Amount",
            dataIndex: "commissionAmount",
            key: "commissionAmount",
            render: (text) => `$${text}`,
        },
        {
            title: "Percentage",
            dataIndex: "percentage",
            key: "percentage",
            render: (text) => `${text}%`,
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: "Payment ID",
            dataIndex: "paymentId",
            key: "paymentId",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
    ];

    return (
        <div className="affreflist_container">
            <div className="header_wrapper"></div>
            <div className="table_header_filter">
                <div className="header_left">
                    <div className="search_box_wrapper">
                        <input
                            placeholder="Search..."
                            className="search_input"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch(e.target.value);
                                }
                            }}
                        />
                        <div className="searchImg" onClick={() => handleSearch(searchText)}>
                            <img src={searchIcon} alt="searchIcon" />
                        </div>
                    </div>
                    <div className="header_middle">
                        <div className="filter_buttons">
                            <Button
                                className={activeTab === "all" ? "active" : ""}
                                onClick={() => handleTabChange("all")}
                            >
                                All
                            </Button>
                            <Button
                                className={activeTab === "successful" ? "active" : ""}
                                onClick={() => handleTabChange("successful")}
                            >
                                Successful
                            </Button>
                            <Button
                                className={activeTab === "unsuccessful" ? "active" : ""}
                                onClick={() => handleTabChange("unsuccessful")}
                            >
                                Unsuccessful
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="header_bottom">
                <RangePicker
                    onChange={updateDateRange}
                    autoFocus
                    presets={rangePresets}
                />
                <div className="export_btn">
                    <Button onClick={openModal} loading={isExportLoading}>
                        <img src={exportBtnIcon} alt="export_btn_icon" />
                        Export
                    </Button>
                    <Link
                        to="/affiliate-marketing/affiliateMarketing-exportHistory"
                        style={{ color: "white" }}
                    >
                        View Export History
                    </Link>
                </div>
            </div>

            <div className="pushleads">
                <div className="chart_wrapper">
                    <h3 className="chart_title">Pushleads</h3>
                    <LineChart data={pushleadsChartData} />
                </div>
                <div className="ref_list_table">
                    <h3>Referred List</h3>    
                    <AntTable
                        columns={columns}
                        dataSource={referredList}
                    />
                </div>
            </div>

            <Modal
                title="Export Data"
                visible={isModalVisible}
                onCancel={closeModal}
                footer={[
                    <Button key="cancel" onClick={closeModal}>
                        Cancel
                    </Button>,
                    <Button
                        key="export"
                        type="primary"
                        onClick={handleExport}
                        loading={isExportLoading}
                    >
                        Export
                    </Button>
                ]}
            >
                <div>
                    <RangePicker
                        onChange={updateExportDateRange}
                        autoFocus
                        presets={rangePresets}
                        defaultValue={exportDates ? [
                            dayjs(exportDates[0]),
                            dayjs(exportDates[1])
                        ] : null}
                    />
                </div>
            </Modal>

            {isLoading && <LoaderOverlay />}
        </div>
    );
};

export default AffiliateRefList;
