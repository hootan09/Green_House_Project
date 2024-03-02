import { StatusBar } from 'expo-status-bar';
import { ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import background from './assets/images/background.jpg';
import { useEffect, useState } from 'react';
import moment from 'jalali-moment';

export default function App() {
  
  const [latestRecord, setLatestRecord] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const getLastRecord = async()=> {
    try {
      setRefreshing(true);
      const req = await fetch('http://192.168.1.50:3000/metric/-1',{method: 'GET'});
      const res = await req.json();
      setRefreshing(false);
      if(res.length > 0){
        setLatestRecord(res[0])
      }
    } catch (error) {
      console.log(error);
      // setLatestRecord({});
    }

  }

  useEffect(() => {
    getLastRecord();
  }, [])

  const onRefresh = async()=> {
    await getLastRecord()
  }

  const dateFormatter = (date)=>{
    // console.log(moment(date).format('jYYYY/jM/jD HH:mm:ss'));
    return moment(date).format('jYYYY/jM/jD HH:mm:ss');
  }
  
  return (
    <>
      <ImageBackground source={background} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >

          <Text style={styles.date}>Record Time: {dateFormatter(latestRecord?.createdAt)}</Text>
          <View style={styles.mainWrapper}>


            <View style={[styles.box, {backgroundColor: '#FFF1D6'}]}>
              <View style={styles.textWrapper}>
                <Text style={styles.textTitle}>Temp</Text>
                <Text style={styles.textDescription}>{latestRecord?.temprature}°C</Text>
              </View>
            </View>
            <View style={[styles.box, {backgroundColor: '#FFFAC7'}]}>
              <View style={styles.textWrapper}>
                <Text style={styles.textTitle}>Humidity</Text>
                <Text style={styles.textDescription}>{latestRecord?.humidity}%</Text>
              </View>
            </View>
            <View style={[styles.box, {backgroundColor: '#E4D9D2'}]}>
              <View style={styles.textWrapper}>
                <Text style={styles.textTitle}>Moisture</Text>
                <Text style={styles.textDescription}>{latestRecord?.moisture}</Text>
              </View>
            </View>

          </View>

        </ScrollView>

      </ImageBackground>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  mainWrapper: {
    marginTop: 200,
    marginLeft: 25,
  },
  date: {
    top: 50,
    left: 20,
    fontSize: 22,
    lineHeight:18,
    paddingVertical: 25,
    fontWeight: '300',
    
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: 'red',
    marginBottom: 15,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderWidth: 0.7,
    borderColor: 'rgba(255,255,0,0.4)'
  },
  textWrapper: {
    marginTop: 25,
    marginLeft: 25,
  },
  textTitle: {
    color: '#4A4A4A',
    fontSize: 16,
    lineHeight:10,
    fontWeight: '500',
    paddingBottom:10,
    paddingTop: 5,

  },
  textDescription: {
    color: '#141416',
    fontSize: 32,
    lineHeight:10,
    fontWeight: '800',
    paddingBottom:20,
    paddingTop: 20,
  },
});
