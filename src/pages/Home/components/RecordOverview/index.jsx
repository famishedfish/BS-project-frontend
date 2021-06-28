import React, { Component } from 'react'
import { Radio, Card, Col, Row } from 'antd';
import { Bar } from 'ant-design-pro/lib/Charts';


export default class RecordOverview extends Component {
    render() {
        const salesData = [];
        const endDay = new Date().getTime();
        const beginDay = endDay - 86400000 * 29
        for (let i = 0; i < 30; i += 1) {
            const date = new Date(beginDay + 86400000 * i)
            salesData.push({
                x: `${date.getDate()}日`,
                y: Math.floor(Math.random() * 30) + 2,
            });
        }

        const { salesType, handleChangeSalesType, loading } = this.props

        return (
            <Row
                gutter={24}
                style={{
                    marginTop: 24,
                }}>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Card
                        loading={loading}
                        bordered={false}
                        title="分类查看数据"
                        style={{
                            height: '100%',
                        }}
                        extra={
                            <div>   {/* 修改成遍历的形式 */}
                                <Radio.Group value={salesType} onChange={handleChangeSalesType}>
                                    <Radio.Button value={0}>
                                        空调
                                    </Radio.Button>
                                    <Radio.Button value={1}>
                                        冰箱
                                    </Radio.Button>
                                    <Radio.Button value={2}>
                                        电视
                                    </Radio.Button>
                                    <Radio.Button value={3}>
                                        热水器
                                    </Radio.Button>
                                    <Radio.Button value={4}>
                                        扫地机器人
                                    </Radio.Button>
                                    <Radio.Button value={5}>
                                        其他
                                    </Radio.Button>
                                </Radio.Group>
                            </div>
                        }>
                        <Row gutter={68}>
                            <Col
                                sm={24}
                                xs={24}
                                style={{
                                    marginBottom: 24,
                                }}>
                                <div>
                                    <Bar height={400} title="数据量" data={salesData} />
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        )
    }
}
