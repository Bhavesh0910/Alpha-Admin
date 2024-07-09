import React, { useState, useEffect } from "react";
import { Table } from "antd";
import "./AntTable.scss";

const AntTable = ({
  triggerChange,
  data,
  columns,
  totalItems,
  pageSize,
  setPageSize,
  CurrentPageNo,
  isExpandable,
}) => {
  const [pagination, setPagination] = useState({
    current: CurrentPageNo,
    pageSize,
    total: totalItems,
  });

  const handlePageChange = (page, updatedPageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: updatedPageSize,
    }));
    setPageSize(updatedPageSize);
    triggerChange(page, updatedPageSize);
  };

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: totalItems,
    }));
  }, [totalItems]);

  return (
    <div className="ant_table_container">
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${totalItems} items`,
          onChange: handlePageChange,
        }}
        scroll={{
          y: "100%",
          x: "max-content",
        }}
        rowKey="key"
        size={"large"}
        scrollToFirstRowOnChange={true}
        expandable={
          isExpandable
            ? {
                expandedRowRender: (record) => (
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    {record.description}
                  </p>
                ),
              }
            : undefined
        }
      />
    </div>
  );
};

export default AntTable;
