import React, { Component } from 'react'
import { Statistic, Radio, Card, Col, Row } from 'antd';
import { Bar } from 'ant-design-pro/lib/Charts';

export default class RecordOverview extends Component {
    render() {
        const salesData = [];
        for (let i = 0; i < 30; i += 1) {
            salesData.push({
                x: `${i + 1}月`,
                y: Math.floor(Math.random() * 1000) + 200,
            });
        }

        const { salesType, handleChangeSalesType } = this.props

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
                        title="分类查看数据"
                        style={{
                            height: '100%',
                        }}
                        extra={
                            <div>   {/* 修改成遍历的形式 */}
                                <Radio.Group value={salesType} onChange={handleChangeSalesType}>
                                    <Radio.Button value="全部">
                                        全部
                                    </Radio.Button>
                                    <Radio.Button value="online">
                                        线上
                                    </Radio.Button>
                                    <Radio.Button value="other">
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
