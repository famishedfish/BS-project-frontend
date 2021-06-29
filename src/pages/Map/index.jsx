import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';;

import { LineLayer, MapboxScene, Marker } from '@antv/l7-react';

const Map = (props) => {

    const { dispatch, currentUser, records } = props;

    const [data, setData] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                'https://gw.alipayobjects.com/os/basement_prod/32e1f3ab-8588-46cb-8a47-75afb692117d.json',
            );
            const raw = await response.json();
            setData(raw);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (dispatch) {
            dispatch({
                type: 'record/fetch',
            });
            dispatch({
                type: 'login/update',
                payload: { password: currentUser.password, name: currentUser.name },
            });
        }
    }, []);

    function creatMarkers() {
        // 只显示用户订阅的设备
        const deviceList = currentUser.devices
        const data = records.filter((item) => {
            return deviceList.indexOf(item.clientId) !== -1
        });

        const markers = [];
        let count = 0;
        data.map((item) => {
            count += 1;
            let color = item.alert === 1 ? '#9a325e' : '#6790f2'
            if (count <= 100) {
                markers.push(<Marker option={{ color: color }} lnglat={[item.lng, item.lat]} />);
            }
        })
        return markers;
    }

    return (
        <PageContainer >
            <MapboxScene
                map={{
                    center: [120.14002669582967, 30.245842227935793],
                    pitch: 0,
                    style: 'normal',
                    zoom: 11,
                }}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '520px',
                }}
                option={{
                    logoVisible: false
                }}
            >
                {data && (
                    <LineLayer
                        key={'2'}
                        source={{
                            data,
                        }}
                        size={{
                            values: 1,
                        }}
                        color={{
                            values: '#fff',
                        }}
                        shape={{
                            values: 'line',
                        }}
                        style={{
                            opacity: 0.5,
                        }}
                    />
                )}
                {creatMarkers()}
            </MapboxScene>
        </PageContainer>
    );
};

export default connect(({ user, record }) => ({
    currentUser: user.currentUser,
    records: record.records,
}))(Map);