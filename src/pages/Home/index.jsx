import React, { Component } from 'react'
import { connect } from 'umi';
import IntroduceRow from './components/IntroduceRow';
import DeviceOverview from './components/DeviceOverview';
import RecordOverview from './components/RecordOverview';

class Home extends Component {
  state = {
    salesType: '全部',
  };

  handleChangeSalesType = (e) => {
    this.setState({
      salesType: e.target.value,
    });
  };

  render() {
    const { salesType } = this.state

    return (
      <div>
        <IntroduceRow></IntroduceRow>
        <DeviceOverview></DeviceOverview>
        <RecordOverview
          salesType = {salesType}
          handleChangeSalesType={this.handleChangeSalesType}
        ></RecordOverview>
      </div>
    )
  }
}

export default connect(({ device, loading }) => ({
  total: device.total,
  online: device.online,
  devices: device.devices,
  loading: loading.models.device,
  // loading: loading.effects['login/login'], // login effect是否正在运行
}))(Home);