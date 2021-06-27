import React, { Component } from 'react'
import { Statistic, Card, Col, Row } from 'antd';
import { ChartCard, MiniProgress, MiniArea } from 'ant-design-pro/lib/Charts';

import moment from 'moment';

export default class DeviceOverview extends Component {


    render() {
        const visitData = [];
        const beginDay = new Date().getTime();
        for (let i = 0; i < 20; i += 1) {
            visitData.push({
                x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
                y: Math.floor(Math.random() * 10) + 2,
            });
        }


        return (
            <Row
                gutter={24}
                style={{
                    marginTop: 24,  // 距离上一个component的距离
                }}>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Card
                        // loading={loading}
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
                                    total="13%"
                                    contentHeight={46}>
                                    <MiniProgress percent={13} strokeWidth={8} target={15} />
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
                                    total={<Statistic value={155} />}
                                    contentHeight={46}>
                                    <MiniArea height={45} line={true} data={visitData} />
                                </ChartCard>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        )
    }
}
