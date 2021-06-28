import React, { Component } from 'react'
import { Statistic, Col, Row, Card } from 'antd';
import { CloudTwoTone, SettingTwoTone, StarTwoTone }from '@ant-design/icons';

export default class IntroduceRow extends Component {

    render() {
        const {total, online, loadingDev, loadingRec, recNum } = this.props
        return (
            <Row gutter={24}>
                <Col span={8}>
                    <Card
                        loading={loadingDev || loadingRec}
                        bordered={false}
                        title='总设备数'
                        bodyStyle={{
                            padding: '0px 24px 8px 24px',
                            fontSize: '35px',
                        }}>
                        <Statistic prefix={<SettingTwoTone />} title="Total Devices" value={total} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        loading={loadingDev || loadingRec}
                        bordered={false}
                        title='在线设备数'
                        bodyStyle={{
                            padding: '0px 24px 8px 24px',
                            fontSize: '35px',
                        }}>
                        <Statistic prefix={<CloudTwoTone />} title="Online Devices" value={online} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        loading={loadingRec || loadingDev}
                        bordered={false}
                        title='总数据量'
                        bodyStyle={{
                            padding: '0px 24px 8px 24px',
                            fontSize: '35px',
                        }}>
                        <Statistic prefix={<StarTwoTone />} title="Total Records" value={recNum} />
                    </Card>
                </Col>
            </Row>
        )
    }
}
