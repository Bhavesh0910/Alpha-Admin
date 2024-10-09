import React, {useState, useEffect} from "react";
import {Table} from "antd";
import "./AntTable.scss";
import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setIsExpandable} from "../../store/NewReducers/Support";

const AntTable = ({serverSide = true, triggerChange, data, scrollY = 460, columns, totalItems, pageSize, setPageSize, CurrentPageNo, isExpandable, ExpandedComp, rowId, customRowClass = false}) => {
  const [pagination, setPagination] = useState(() => {
    if (serverSide) {
      return {current: CurrentPageNo, pageSize, total: totalItems};
    } else {
      return {current: 1, pageSize: 10, total: data?.length};
    }
  });

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const handlePageChange = (page, updatedPageSize, sorter) => {
    if (serverSide) {
      setPagination((prev) => ({
        ...prev,
        current: page.current,
        pageSize: page.pageSize,
      }));
      setPageSize(page.pageSize);
      triggerChange(page.current, page.pageSize, sorter);
    } else {
      setPagination((prev) => ({
        ...prev,
        current: page.current,
        pageSize: page.pageSize,
      }));
    }
  };

  useEffect(() => {
    if (serverSide) {
      setPagination((prev) => ({
        ...prev,
        total: totalItems,
      }));
    } else {
      setPagination((prev) => ({
        ...prev,
        current: 1,
        total: data?.length,
      }));
    }
  }, [totalItems]);

  const dispatch = useDispatch();

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([record[rowId]]);
      dispatch(setIsExpandable(record[rowId]));
    } else {
      setExpandedRowKeys([]);
    }
  };

  useEffect(() => {
    console.log(expandedRowKeys, " expandedrowkey");
  }, [expandedRowKeys]);

  function handleSortingLogic(pagination, filters, sorter) {
    // triggerChange(page, updatedPageSize, sorter);
  }
  return (
    <div className="ant_table_container">
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: serverSide ? CurrentPageNo : pagination.current,
          pageSize: pagination.pageSize,
          total: serverSide ? totalItems : data?.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${serverSide ? totalItems : data?.length} items`,
          // onChange: handlePageChange,
        }}
        onChange={(pagination, filters, sorter) => {
          handlePageChange(pagination, filters, sorter);
        }}
        scroll={{
          y: scrollY,
          x: "max-content",
        }}
        rowKey={rowId}
        size={"large"}
        scrollToFirstRowOnChange={true}
        expandable={
          isExpandable
            ? {
                // expandedRowRender: expandedRowRender,
                expandedRowRender: (record) => <ExpandedComp record={record} />,
                expandedRowKeys: expandedRowKeys,
                onExpand: handleExpand,
              }
            : undefined
        }
        rowClassName={(record) => {
          if (customRowClass) {
            return record?.status === "Blacklisted" ? "Blacklisted" : record?.flag === "Warning" ? "Warning" : "Safe";
          } else {
            return null;
          }
        }}
      />
    </div>
  );
};

export default AntTable;
