import { Dimensions, StyleSheet, View } from 'react-native'
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import config from '../../config/config';
import { LineChart } from 'react-native-chart-kit';
import moment from 'jalali-moment';



const chartConfig = {
    backgroundGradientFrom: "#000",
    // backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#000",
    // backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};

const { width, height } = Dimensions.get('window');
const Index = () => {
    const { type } = useLocalSearchParams();
    const [data, setData] = useState(null);

    const chartDataTemp = {
        // labels: ["January", "February", "March", "April", "May", "June"],
        labels: [""],

        datasets: [
            {
                // data: [20, 45, 28, 80, 99, 43],
                data: [0],

                color: (opacity = 1) => `rgba(255, 110, 50, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: [type] // optional
    };
    const [chartData, setChartData] = useState(chartDataTemp)

    const getMetrics = async () => {
        try {
            console.log('get metrics for: ', type);
            const req = await fetch(`${config.baseUrl}/metrics`);
            const res = await req?.json();
            if (res) {
                const resData = res.slice(-20)// choose last 20 record
                const labels = resData?.map((item) => moment(item.createdAt).locale('fa').format('YYYY/M/D HH:mm'));
                if (type == 'Tempratures') {
                    const data = resData?.map((item) => item.temprature);
                    setChartData({...chartData, labels: labels, datasets: [
                            {
                                data: data,
                                color: (opacity = 1) => `rgba(255, 110, 50, ${opacity})`, // optional
                                strokeWidth: 2, // optional
                                legendFontSize: 1
                            }
                        ],
                    })
                }
                else if(type == 'Humidity'){
                    const data = resData?.map((item) => item.humidity);
                    setChartData({...chartData, labels: labels, datasets: [
                            {
                                data: data,
                                color: (opacity = 1) => `rgba(255, 110, 50, ${opacity})`, // optional
                                strokeWidth: 2, // optional
                                legendFontSize: 1
                            }
                        ],
                    })
                }
                else if(type == 'Moisture'){
                    const data = resData?.map((item) => item.moisture);
                    setChartData({...chartData, labels: labels, datasets: [
                            {
                                data: data,
                                color: (opacity = 1) => `rgba(255, 110, 50, ${opacity})`, // optional
                                strokeWidth: 2, // optional
                                legendFontSize: 1
                            }
                        ],
                    })
                }
                setData(resData);
            }

        } catch (err) {
            console.log('err', err);
        }
    }

    useEffect(() => {
        getMetrics();
    }, [])

    return (
        <View style={styles.container}>
            {/* <BarChart samples={[5,6,7,8,9,0,11,23,44,55]} /> */}
            <LineChart
                data={chartData}
                width={width}
                height={500}
                verticalLabelRotation={90}
                xLabelsOffset={-15}

                chartConfig={chartConfig}
                bezier
            />
        </View>
    );
}

export default Index

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "black",
    },
});