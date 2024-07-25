import React, {useState, useEffect} from "react";
import {Table} from "antd";
import "./AntTable.scss";
import {useLocation} from "react-router-dom";

const AntTable = ({serverSide = true, triggerChange, data, columns, totalItems, pageSize, setPageSize, CurrentPageNo, isExpandable, ExpandedComp, rowId}) => {
  const [pagination, setPagination] = useState(() => {
    if (serverSide) {
      return {current: CurrentPageNo, pageSize, total: totalItems};
    } else {
      return {current: 1, pageSize: 10, total: data.length};
    }
  });

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const location = useLocation();
  const handlePageChange = (page, updatedPageSize) => {
    if (serverSide) {
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: updatedPageSize,
      }));
      setPageSize(updatedPageSize);
      triggerChange(page, updatedPageSize);
    } else {
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: updatedPageSize,
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
        total: data.length,
      }));
    }
  }, [totalItems]);

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys(location.pathname === "/support/funded" ? [record.login_id] : [record.id]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  function getRowKey() {
    if (location.pathname === "/support/funded") {
      return "login_id";
    } else {
      return "id";
    }
  }

  return (
    <div className="ant_table_container">
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: serverSide ? CurrentPageNo : pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${serverSide ? totalItems : data?.length} items`,
          onChange: handlePageChange,
        }}
        scroll={{
          y: "100%",
          x: "max-content",
        }}
        // rowKey={(record) => record[getRowKey()]}
        rowKey={rowId}
        size={"large"}
        scrollToFirstRowOnChange={true}
        expandable={
          isExpandable
            ? {
                expandedRowRender: (record) => <ExpandedComp record={record} />,
                expandedRowKeys: expandedRowKeys,
                onExpand: handleExpand,
              }
            : undefined
        }
      />
    </div>
  );
};

export default AntTable;
