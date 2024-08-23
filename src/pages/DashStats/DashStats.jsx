import React, { useEffect, useRef, useState } from 'react';
import './DashStats.scss';
import { Button, DatePicker,  Dropdown, Menu, Modal } from 'antd';
import LineChart from '../MoreAdvancedStatistics/TradingPairs/Charts/LineChart';
import AntTable from '../../ReusableComponents/AntTable/AntTable';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import exportBtnIcon from "../../assets/icons/export_btn_icon.svg";
import { Link } from 'react-router-dom';
import CalendarIcon from '../../assets/icons/calendar.svg';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;


function DashStats() {
    
  const [activeTab, setActiveTab] = useState("D");
  const [selectedStage, setSelectedStage] = useState("Stage 1");
  const [isModalVisible, setModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const calendarRef = useRef(null);
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [dates, setDates] = useState();

  function updateDateRange(dates) {
    setPageNo(1);
    if (dates) {
      setDates(dates.map((date) => date.format("DD MMM YYYY")));
    } else {
      setDates(null);
    }
  }

  const rangePresets = [
    { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
    { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
    { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
    { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
    { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] },
  ];

  const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
          setCalendarVisible(false);
      }
  };

  useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);


  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleStageChange = (e) => {
    setSelectedStage(e.key);
  };

  const menu = (
    <Menu onClick={handleStageChange}>
      <Menu.Item key="Stage 1">Stage 1</Menu.Item>
      <Menu.Item key="Stage 2">Stage 2</Menu.Item>
    </Menu>
  );


  const handleExport = () => {
    console.log('')
  }
  const columns = [
    {
      title: 'Currency Pairs',
      dataIndex: 'currency_pairs',
      key: 'currency_pairs',
    },
    {
      title: 'Trades',
      dataIndex: 'trades',
      key: 'trades',
      render: (text) => text || "-",
    },
    {
      title: 'Lots',
      dataIndex: 'lots',
      key: 'lots',
      render: (text) => text || "-",
    },
    {
      title: 'P&L',
      dataIndex: 'pl',
      key: 'pl',
      render: (text) => text !== null ? `$${text.toFixed(2)}` : "-",
    },
    {
      title: 'Total Volume',
      dataIndex: 'total_volume',
      key: 'total_volume',
      render: (text) => text !== null ? `$${text.toFixed(2)}` : "-",
    },
    {
      title: 'Net Pip Loss',
      dataIndex: 'net_pip_loss',
      key: 'net_pip_loss',
      render: (text) => text !== null ? `${text} pips` : "-",
    },
    {
      title: 'Commission',
      dataIndex: 'commission',
      key: 'commission',
      render: (text) => text !== null ? `$${text.toFixed(2)}` : "-",
    },
  ];

  const data = [
    {
      key: '1',
      currency_pairs: 'EUR/USD',
      trades: 10,
      lots: 5.2,
      pl: 123.45,
      total_volume: 5000,
      net_pip_loss: 30,
      commission: 50,
    },
    {
      key: '2',
      currency_pairs: 'GBP/USD',
      trades: 8,
      lots: 3.8,
      pl: -67.89,
      total_volume: 3000,
      net_pip_loss: 15,
      commission: 30,
    },
  ];

  return (
    <div className='dashStats'>
        <div className='header'>
      <h2 className='page_header'>Dash Stats</h2>
      <div className="export_btn">
          <Button onClick={handleOpenModal}>
            <img
              src={exportBtnIcon}
              alt="export_btn_icon"
            />
            Export
          </Button>
          <Link className="link"
            to={"/advance-statistics/new-page/export-history"}
          >
            View Export History
          </Link>
        </div>
    
      </div>
      <div className='chart_box_wrapper'>
        <div className='header'>
          <Dropdown overlay={menu} trigger={['click']} className="ant-dropdown-trigger">
            <Button>{selectedStage} <DownOutlined /></Button>
          </Dropdown>
          <div className="filter_button_wrapper">
            <Button
              className={activeTab === "D" ? "active" : ""}
              onClick={() => handleTabChange("D")}
            >
              D
            </Button>
            <Button
              className={activeTab === "W" ? "active" : ""}
              onClick={() => handleTabChange("W")}
            >
              W
            </Button>
            <Button
              className={activeTab === "M" ? "active" : ""}
              onClick={() => handleTabChange("M")}
            >
              M
            </Button>
            <Button
              className={activeTab === "Y" ? "active" : ""}
              onClick={() => handleTabChange("Y")}
            >
              Y
            </Button>
          </div>
        </div>

        <div className='chart_wrapper'>
          <LineChart period={activeTab} stage={selectedStage} />
        </div>
        </div>

        <div className='table_wrapper'>
          <div className='table_date'>
          <div className='date_box' ref={calendarRef}>
                    <img src={CalendarIcon} alt='Calendar Icon' onClick={() => setCalendarVisible(!calendarVisible)} />
                    <p onClick={() => setCalendarVisible(!calendarVisible)}>
                    <DatePicker
                                onChange={(date) => {
                                    console.log(date); 
                                    setCalendarVisible(false); 
                                }} 
                                format='YYYY-MM-DD' 
                            />
                    </p>
                     
                </div>
          </div>
          <AntTable columns={columns} data={data} />
        </div>

        <Modal
      title="Export"
      visible={isModalVisible}
      onCancel={handleCloseModal} 
      footer={null} 
      className="export_modal" 
      closeIcon={<CloseOutlined style={{ color: '#fff' }} />} 
    >
      <div className="export_modal_wrapper">
        <RangePicker
          onChange={updateDateRange}
          autoFocus
          presets={rangePresets}
          style={{ width: '100%' }} 
        />
      </div>
      <p style={{ color: '#fff' }}>File will contain information of the date you’ve selected.</p>
      <div className="btn_wrapper">
        <Button
          type="primary"
          onClick={handleExport}
          style={{
            backgroundColor: '#1890ff', 
            borderColor: '#1890ff',
            color: '#fff',
          }}
        >
          Export
        </Button>
      </div>
    </Modal>
    </div>
  );
}

export default DashStats;
