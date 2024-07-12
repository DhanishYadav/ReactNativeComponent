import React from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Image, SafeAreaView, ImageBackground } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { styles } from './NotificationStyles';
import { backgroundImage } from '@/assets';
import moment from 'moment';
import { Pusher } from "@pusher/pusher-websocket-react-native";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearNotificationData, notificationPusher } from '@/actions/JobActions';

const Notification = ({ navigation }) => {
  // const pusher = Pusher.getInstance();
  // console.log("pushsermorning123--",pusher)
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(clearNotificationData())
    // const data={"message":"has added a new note on Job #1012","name":"Claudia Love","jobId":"506","jobNotes":"jiod","showDate":"Tue Jul 11 2023","showTime":"07:41:AM","type":"job"}
    //  getNotification(); 
    // const keys = Object.keys(data);
    // console.log("arrayData123-->",keys)
    // dispatch(notificationPusher(data))
  },[])
  const data = {

    data: [
      {
        "id": 1,
        "business_type": "JOB",
        "firstName": "John",
        "lastName": "Doe",
        "jobType": "Cashier",
        "startTime": "9:00 AM",
        "endTime": "5:00 PM",
        "status": "Active",
        "address": "123 Main Street",
        "businessId": "1001",
        "imageUrl": "http://example.com/image.jpg",
        "startDate": "2023-06-01"
      },
      {
        "id": 2,
        "business_type": "LEAD",
        "firstName": "Jane",
        "lastName": "Smith",
        "jobType": "Server",
        "startTime": "10:00 AM",
        "endTime": "6:00 PM",
        "status": "Active",
        "address": "456 Elm Street",
        "businessId": "1002",
        "imageUrl": "http://example.com/image2.jpg",
        "startDate": "2023-06-02"
      },
      {
        "id": 3,
        "business_type": "LEAD",
        "firstName": "Michael",
        "lastName": "Johnson",
        "jobType": "Software Developer",
        "startTime": "9:00 AM",
        "endTime": "6:00 PM",
        "status": "Active",
        "address": "789 Oak Street",
        "businessId": "1003",
        "imageUrl": "http://example.com/image3.jpg",
        "startDate": "2023-06-03"
      },
      {
        "id": 4,
        "business_type": "JOB",
        "firstName": "Sarah",
        "lastName": "Wilson",
        "jobType": "Manager",
        "startTime": "8:00 AM",
        "endTime": "4:00 PM",
        "status": "Active",
        "address": "567 Pine Street",
        "businessId": "1004",
        "imageUrl": "http://example.com/image4.jpg",
        "startDate": "2023-06-01"
      },
      {
        "id": 5,
        "business_type": "LEAD",
        "firstName": "Robert",
        "lastName": "Brown",
        "jobType": "Accountant",
        "startTime": "9:30 AM",
        "endTime": "5:30 PM",
        "status": "Active",
        "address": "890 Cedar Street",
        "businessId": "1005",
        "imageUrl": "http://example.com/image5.jpg",
        "startDate": "2023-06-01"
      }
    ]
  };


  // const getNotification = async () => {
  //   console.log("infunction->")
  //   await pusher.init({
  //     // app_id:"1181116",
  //     // apiKey:"6c5755a17b720717b989",
  //     // secret:"68dd2b81ed9ae19451f2",
  //     // cluster:"ap2",
  //     app_id:'1617014',
  //     apiKey:'1404e9d0acda1cfa9b81',
  //     secret:'a0c1cfbf381dd4442d36',
  //     cluster:'ap2',
  //     useTLS:true,
  //   },console.log("pusherinit-->",pusher));

  //   await pusher.connect();
  //   await pusher.subscribe({
  //     channelName:'business3@yopmail.com',
  //     onEvent:(PusherEvent) => {
  //       console.log("PusherEvent1234 ------------------->",PusherEvent?.data)
  //       // const data={"message":"has added a new note on Job #1012","name":"Claudia Love","jobId":"506","jobNotes":"helloprashad","showDate":"Tue Jul 11 2023","showTime":"07:41:AM","type":"job"}
  //       dispatch(notificationPusher(PusherEvent?.data))
  //     },
  //   });
  //   // await pusher.disconnect();
  // }

  // useEffect(() => {
  //   console.log("pusher--->", pusher)
  //   if (pusher) {
  //     console.log("pusherifcondition-->",pusher)
  //     getNotification();
  //   }
  // },[pusher]);


  const renderItem = ({ item }) => {
    if (item.business_type === 'LEAD') {
      return (
        <View
          style={{
            backgroundColor: '#E2F3FF',
            padding: 16,
            marginVertical: 16,
            borderRadius: 30,
          }}
        >
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navToJobDetails(item.jobId)}
          >
            <View style={styles.takeAction}>
              <View style={styles.checkicon}>
                <Image
                  source={require('@/assets/images/check-icon-white.png')}
                />

              </View>
              <Text style={styles.actionText}>Take Action</Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.businessheading]}>{item.business_type}</Text>
              <View style={styles.itemHeader}>
                <Text style={{ ...styles.itemName, fontWeight: '800', color: 'black', marginLeft: 12, }}>
                  {item.business_type}#{item.businessId}
                </Text>
              </View>
              <View style={styles.textcontainer}>

                <View >
                  <Image
                    source={require('@/assets/images/clock.png')}
                    style={styles.image}
                  />
                </View>

                <Text style={[styles.time]}>
                  {item.startTime}-{item.endTime}
                </Text>
              </View>
              <View style={styles.textcontainer}>

                <Image
                  source={require('@/assets/images/location-icon.png')}
                  style={styles.icon1}
                />

                <Text style={[styles.text, { fontSize: 15, marginLeft: 13 }]}>
                  {item.address}
                </Text>

              </View>
              <View style={styles.textcontainer}>

                <Image
                  source={require('@/assets/images/jobs.png')}
                  style={styles.icon}
                />
                <Image
                  source={{ uri: item.url }}

                />
                <Text style={[styles.text]}>
                  {item.firstName} {item.lastName}
                </Text>

              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: '#F2F4F6',
            padding: 16,
            marginVertical: 16,
            borderRadius: 30,
          }}
        >
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navToJobDetails(item.jobId)}
          >
            <View style={styles.takeAction}>
              <View style={styles.checkicon}>
                <Image
                  source={require('@/assets/images/check-icon-white.png')}
                />

              </View>
              <Text style={styles.actionText}>Take Action</Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.businessheading, { backgroundColor: '#7DC05D' }]}>{item.business_type}</Text>
              <View style={styles.itemHeader}>
                <Text style={{ ...styles.itemName, fontWeight: '800', color: 'black', marginLeft: 12, }}>
                  {item.business_type}#{item.businessId}
                </Text>
                <Text style={styles.jobtime}>
                  {moment(item?.startDate).format('MMM DD')}  {item.startTime}
                </Text>
              </View>
              <View style={styles.textcontainer}>

                <Image
                  source={require('@/assets/images/jobs.png')}
                  style={styles.icon}
                />

                <Text style={[styles.text]}>
                  {item.jobType}
                </Text>
                <Text style={[styles.itemInfo, styles.status]}>
                  {item.status}
                </Text>
              </View>
              <View style={styles.textcontainer}>

                <Image
                  source={require('@/assets/images/location-icon.png')}
                  style={styles.icon1}
                />

                <Text style={[styles.text, { fontSize: 15, marginLeft: 10 }]}>
                  {item.address}
                </Text>

              </View>
              <View style={styles.textcontainer}>

                <Image
                  source={require('@/assets/images/jobs.png')}
                  style={styles.icon}
                />
                {/* <Image
                source={{uri: item.url}}
                style={styles.icon}
                 /> */}
                <Text style={[styles.text]}>
                  {item.firstName} {item.lastName}
                </Text>

              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };
  const renderListItem = ({ item }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>
      );
    } else {
      return renderItem({ item });
    }
  };

  // Grouping the data by startDate
  const groupedData = data.data.reduce((acc, item) => {
    const groupKey = item.startDate;
    if (!acc[groupKey]) {
      acc[groupKey] = { type: 'date', date: groupKey };
    }
    acc[groupKey].data = acc[groupKey].data || [];
    acc[groupKey].data.push(item);
    return acc;
  }, {});

  const groupedDataArray = Object.values(groupedData);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ImageBackground source={backgroundImage} >
        <View style={[styles.viewheader, { flexDirection: 'row' }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Image source={require('../../assets/imageslog/Vector.png')} style={styles.iconrightChevron}/>
          </TouchableOpacity>
          <Text style={styles.headertext}>Notifications</Text>
        </View>
      </ImageBackground>
      <View style={styles.container}>
        <FlatList
          data={groupedDataArray.flatMap((group) => [group, ...(group.data || [])])}
          renderItem={renderListItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.flatlist}
        />
      </View>
    </SafeAreaView>
  );
};



export default Notification;
