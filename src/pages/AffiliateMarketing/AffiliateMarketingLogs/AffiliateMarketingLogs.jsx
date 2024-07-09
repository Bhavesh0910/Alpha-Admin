import { Breadcrumb, Card } from 'antd';
import React, { useEffect, useState } from 'react';
import AntTable from '../../../ReusableComponents/AntTable/AntTable';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchCodeList } from '../../../store/NewReducers/affiliateSlice';
import LoaderOverlay from '../../../ReusableComponents/LoaderOverlay';

const AffiliateMarketingLogs = () => {
  const [size, setSize] = useState('small');
  const onChange = (e) => {
    setSize(e.target.value);
  };
  const location = useLocation();

  const idToken = useSelector((state) => state.auth.idToken);
  const codeData = useSelector((state) => state.affiliate.codeData);
  const {  totalPages, totalItems  } = useSelector((state) => state.affiliate);
  console.log(totalItems , totalPages)

  const loading = useSelector(state => state.affiliate.isLoading)
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  console.log(codeData)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');
    dispatch(fetchCodeList({ idToken, pageNo, pageSize, email }));
  }, [pageNo, pageSize, location.search, idToken, dispatch]);

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  const columns = [
    {
      title: 'Admin Email ID',
      dataIndex: 'email',
      key: 'adminEmailId',
    },
    {
      title: 'Date and Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
    },
    {
      title: 'Affiliate Code',
      dataIndex: 'code',
      key: 'affiliateCode',
    },
    {
      title: 'Commission',
      dataIndex: 'commission',
      key: 'commission',
    },
    {
      title: 'Repeat Commission',
      dataIndex: 'percentage_repeat',
      key: 'repeatCommission',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
    },
  ];

  return (
    <Card className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <a href="/affiliate-marketing/">Affiliate List</a>,
            },
            {
              title: 'Log',
            },
          ]}
        />
      </div>
      {loading && <LoaderOverlay />}
      <AntTable columns={columns} data={codeData}
        totalPages={Math.ceil(totalItems / pageSize)}
        totalItems={totalItems}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
      />
    </Card>
  );
};

export default AffiliateMarketingLogs;
