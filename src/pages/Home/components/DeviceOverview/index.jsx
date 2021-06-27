import React, { Component } from 'react'
import { Statistic, Card, Col, Row } from 'antd';
import { ChartCard, MiniProgress, MiniArea } from 'ant-design-pro/lib/Charts';

export default class DeviceOverview extends Component {

    render() {

        const { onlineRate, newData, newTotal, loading } = this.props
        return (
            <Row
                gutter={24}
                style={{
                    marginTop: 24,  // 距离上一个component的距离
                }}>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Card
                        loading={loading}
                        bordered={false}
                        title="设备总览"
                        style={{
                            height: '100%',
                        }}>
                        <Row gutter={68}>
                            <Col
                                sm={12}
                                xs={24}
                                style={{
                                    marginBottom: 24,
                                }}>
                                <ChartCard
                                    title="在线率"
                                    total={onlineRate.toString() + "%"}
                                    contentHeight={46}>
                                    <MiniProgress percent={onlineRate} strokeWidth={8} target={onlineRate} />
                                </ChartCard>
                            </Col>
                            <Col
                                sm={12}
                                xs={24}
                                style={{
                                    marginBottom: 24,
                                }}>
                                <ChartCard
                                    title="近10日新增"
                                    total={<Statistic value={newTotal} />}
                                    contentHeight={46}>
                                    <MiniArea height={45} line={true} data={newData} />
                                </ChartCard>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        )
    }
}
