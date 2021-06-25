import React, { Component } from 'react'
import { Statistic, Col, Row, Card } from 'antd';
import { CloudTwoTone, SettingTwoTone, StarTwoTone }from '@ant-design/icons';

export default class IntroduceRow extends Component {

    render() {
        return (
            <Row gutter={24}>
                <Col span={8}>
                    <Card
                        // loading={loading}
                        bordered={false}
                        title='总设备数'
                        bodyStyle={{
                            padding: '0px 24px 8px 24px',
                            fontSize: '35px',
                        }}>
                        <Statistic prefix={<SettingTwoTone />} title="Total Devices" value={112893} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        // loading={loading}
                        bordered={false}
                        title='在线设备数'
                        bodyStyle={{
                            padding: '0px 24px 8px 24px',
                            fontSize: '35px',
                        }}>
                        <Statistic prefix={<CloudTwoTone />} title="Online Devices" value={11} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        // loading={loading}
                        bordered={false}
                        title='总数据量'
                        bodyStyle={{
                            padding: '0px 24px 8px 24px',
                            fontSize: '35px',
                        }}>
                        <Statistic prefix={<StarTwoTone />} title="Total records" value={11293849} />
                    </Card>
                </Col>
            </Row>
        )
    }
}
