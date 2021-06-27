import React, { useState, useEffect } from 'react'
import { connect } from 'umi';
import IntroduceRow from './components/IntroduceRow';
import DeviceOverview from './components/DeviceOverview';
import RecordOverview from './components/RecordOverview';

const Home = (props) => {

  const { dispatch, total, online, newData, newTotal, records, loadingDev, loadingRec } = props;
  const [salesType, handleSalesType] = useState(5)

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'record/fetch',
      });
    }
    dispatch({
      type: 'device/fetch',
    });
  }, []);

  return (
    <div>
      <IntroduceRow
        total={total}
        online={online}
        loadingDev={loadingDev}
        loadingRec={loadingRec}
        recNum={records.length}
      ></IntroduceRow>
      <DeviceOverview
        loading={loadingDev}
        onlineRate={(online * 100 / total).toFixed()}
        newData={newData}
        newTotal={newTotal}
      ></DeviceOverview>
      <RecordOverview
        loading={loadingRec}
        salesType={salesType}
        handleChangeSalesType={handleSalesType}
      ></RecordOverview>
    </div>
  )
}

export default connect(({ device, record, loading }) => ({
  total: device.total,
  online: device.online,
  newData: device.newData,
  newTotal: device.newTotal,
  records: record.records,
  loadingDev: loading.models.device,
  loadingRec: loading.models.record,
}))(Home);