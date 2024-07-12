import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Modal,
  PermissionsAndroid,
  Image,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useDispatch, useSelector } from "react-redux";
import { getPermissionName, GetTodaysRoutes } from "@/actions/UserActions";
import Geolocation from "@react-native-community/geolocation";
import moment from "moment";
import { backgroundImage } from "@/assets";
import { font } from "@/theme/font";
import { NoRecords } from "@/components/NoRecords";
import { ShowToastMessage } from "@/helpers";
import DatePicker from "react-native-date-picker";
import { styles } from "../Home/Home.styles";
import { shadow } from "@/theme";
import { getDistance } from 'geolib';
import { RefreshControl } from "react-native";
import { ModalLoader } from "@/components/ModalLoader";
const TodaysRoutes = ({ navigation }) => {
  const dispatch = useDispatch();
  const [OpenMap, setOpenMap] = useState(false);
  const [allOpenMap, setAllOpenMap] = useState(false);
  const [lat, setLat] = useState(0);
  const [Lng, setLng] = useState(0);
  const [colorCode, setColorCode] = useState(null);
  const [finalDistance, setFinalDistance] = useState(null);
  const [Address, setAddress] = useState(null);
  const [techFullName, setTechFullName] = useState(null);
  const mapRef = useRef();
  const [waypoints, setWaypoints] = useState([]);
  const [finalData, setFinaldata] = useState([]);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [state, setState] = useState({
    initialPont: {

      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.2,
      longitudeDelta: 0.02,
    },
    destinationPoint: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.2,
      longitudeDelta: 0.02,
    },

  });

  const { initialPont, destinationPoint } = state;

  useEffect(() => {
    try {
      requestLocationPermission(); // Request location permission on component mount
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  }, [lat, Lng]);


  useEffect(() => {
    if (initialPont && destinationPoint.latitude !== 0 && destinationPoint.longitude !== 0) {

      const distance = getDistance(
        { latitude: initialPont.latitude, longitude: initialPont.longitude },
        { latitude: destinationPoint.latitude, longitude: destinationPoint.longitude }
      );

      setFinalDistance(distance)
    }
  }, [destinationPoint, initialPont]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      getLocation();
      // requestLocationPermission();
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    navigation.addListener(
      "focus",
      () => {
        setIsFocus(true);
        setTimeout(function () {
          setIsFocus(false);
        }, 2000);
      },
      []
    );
    finalRoutes()
  }, [isFocus, startDate]);

  const finalRoutes = () => {
    const finalDate = moment(startDate);
    const fromDate = finalDate.format("YYYY-MM-DD");
    const data = { start_date: fromDate };
    try {
      if (data) {
        // console.log(data, "Get Date");
        dispatch(GetTodaysRoutes(data, setIsFocus));
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }
  const TotaysData = useSelector((state) => state?.user?.GetTodayRoutes?.mapData);
  useEffect(() => {
    if (TotaysData?.length > 0) {
      setColorCode(TotaysData[0]?.user[0]?.color)
    }
    // Extract latitude and longitude from mapData and update waypoints
    const newWaypoints = TotaysData?.map((item) => ({
      latitude: parseFloat((item.client.lat) || 0), // Assuming latitude is stored in client.lat
      longitude: parseFloat((item.client.lng) || 0),
      address: item.client.address1,
      startDate: item?.start_date,
      startEnd: item?.end_date,
      startTime: item?.start_time,
      startEndTime: item?.end_time,
      serial_id: item?.job_serial_id,
      job_status: item?.job_status,
    }));
    setWaypoints(newWaypoints);
  }, [TotaysData]);


  useEffect(() => {
    if (waypoints?.length > 0) {
      const lastWaypoint = waypoints[waypoints?.length - 1];
      setFinaldata(lastWaypoint)
      setAddress(lastWaypoint?.address)
      console.log(lastWaypoint, "lastWaypointlastWaypointlastWaypointlastWaypoint", waypoints)
      if (TotaysData?.length > 0) {
        setState((prevState) => ({
          ...prevState,
          destinationPoint: {
            latitude: lastWaypoint?.latitude,
            longitude: lastWaypoint?.longitude,
            latitudeDelta: 0.6,
            longitudeDelta: 0.04,
          },
        }));
      }
    }
    else {
      setState((prevState) => ({
        ...prevState,
        destinationPoint: {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.6,
          longitudeDelta: 0.04,
        },
      }));
    }
  }, [waypoints]);

  useEffect(() => {
    try {
      requestLocationPermission(); // Request location permission on component mount
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  }, []);


  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ShowToastMessage("Location permission granted");
      } else {
        ShowToastMessage("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
      });
      const { latitude, longitude } = position.coords;
      setLat(latitude);
      setLng(longitude);
      setState((prevState) => ({
        ...prevState,
        initialPont: {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.02,
        },
      }));
    }
    catch {
      console.log("error")
    }
  };
  const renderJobCard = ({ item }) => {

    const date = moment(item?.start_date).format("DD MMM");
    const dateEnd = moment(item?.end_date).format("DD MMM");
    const time = moment(item?.start_time, "HH:mm:ss").format("hh:mm A");
    const timeEnd = moment(item?.end_time, "HH:mm:ss").format("hh:mm A");
    setTechFullName(item.user[0].firstname + " " + item.user[0].lastname)
    return (
      <View style={style.card}>
        <Text style={style.cardTitle}>Job ID: {item.job_serial_id}</Text>
        <Text style={style.cardText}>Client Name: {item.client.first_name} {item.client.last_name}</Text>
        <Text style={style.cardText}>Technician: {item.user[0].firstname} {item.user[0].lastname}</Text>
        <Text style={style.cardText}>Start Date: {date} {time}</Text>
        <Text style={style.cardText}>End Date: {dateEnd} {timeEnd}</Text>
        <Text style={style.cardText}>Service Location: {item.client.address1}</Text>
        <Text style={style.cardText}>Job Type: {item.job_type}</Text>
        <Text style={style.cardText}>Job Status: {item.job_status}</Text>
      </View>
    );
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      dispatch(getPermissionName())
      finalRoutes()
    }, 2000);
  }, []);
  return (
    <SafeAreaView style={style.container}>

      <View style={style.firstView}>
        <ImageBackground
          source={backgroundImage}
          style={{
            height: 70,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,
            elevation: 24,
            backgroundColor: "white",
            borderRadius: 10
          }}
        >
          <View
            style={{
              flexDirection: "row",
              padding: 0,
              alignItems: "center",
              paddingTop: 15,
              justifyContent: "space-between",
            }}
          >
            <Entypo
              name="cross"
              size={30}
              style={style.custIcon}
              onPress={() => navigation.goBack()}
            />
            <Text style={[style.headerTitle, { color: "black", fontSize: 16 }]}>View Routes</Text>
            <TouchableOpacity
              style={[style.headerTitle, { marginLeft: "5%" }]}
              onPress={() => setAllOpenMap(true)}
            >
              <Entypo name="map" size={30} style={style.custIcon} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
            colors={['#041B3E']} // Android
            tintColor="#041B3E" // iOS
          />
        }
      >
        <View
          style={[shadow.primaryView, { flexDirection: "row", marginHorizontal: 10, justifyContent: "space-between" }]}
        >
          <Text style={[styles.invoiceText, { color: "gray", fontSize: 16 }]}>
            Select Date
          </Text>
          <Text style={[{ color: "gray", fontSize: 16, fontWeight: "bold" }]}>
            {moment(startDate).format("DD MMM YYYY")}
          </Text>
          <DatePicker
            modal
            open={openStartDate}
            date={startDate}
            mode="date"
            onConfirm={(selectedDate) => {

              setStartDate(selectedDate);
              setOpenStartDate(false);
            }}
            onCancel={() => {
              setOpenStartDate(false);
            }}
            theme={"auto"}
          />
          <TouchableWithoutFeedback
            onPress={() => setOpenStartDate(true)}
            style={{}}
          >
            <View style={{ marginTop: 0, marginRight: -10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.invoiceText}>
                </Text>
                <Feather
                  name="calendar"
                  size={20}
                  style={[styles.custIcon, { marginRight: 10 }]}
                // color={"red"}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>

        </View>
        {TotaysData?.length > 0 ? (<FlatList
          data={TotaysData}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.id.toString()}
        />) : <NoRecords />}
      </ScrollView>

      <Modal transparent={true} visible={allOpenMap}>
        <Pressable
          style={{
            backgroundColor: "#fff",
            flex: 1,
            borderRadius: 20,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ padding: 5 }}>Final Distance    {finalDistance ? (finalDistance / 1000 + "Km") : "00.00" + "Km"}
            </Text>
            <Entypo
              name="cross"
              size={30}
              color={"red"}
              onPress={() => setAllOpenMap(false)}
            />
          </View>

          <MapView
            style={{ width: "100%", height: "100%", flex: 1 }}
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            initialRegion={{
              ...initialPont,
            }}
          >
            <Marker
              coordinate={initialPont}
              title={techFullName}
            // description={"description "}
            >
              <Image
                source={require("../../assets/images/marker.png")}
                style={{ width: 41, height: 45 }}
              />
            </Marker>
            <MapViewDirections
              origin={initialPont}
              waypoints={waypoints}
              destination={destinationPoint}
              apikey={"AIzaSyDO0Kj39Lgb6RrShplaaPyxhnKBI4tNIlY"}
              strokeWidth={3}
              //strokeColor="hotpink"
              strokeColor={colorCode || "blue"}
              optimizeWaypoints={true}

              onError={(errorMessage) => console.error("Error with MapViewDirections:", errorMessage)}
              onReady={(result) => {

                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: { right: 30, bottom: 300, left: 30, top: 100 },
                });
              }}
            />
            <Marker
              coordinate={destinationPoint}

            >
            </Marker>
            {waypoints?.map((waypoint, index) => {
              const date = moment(waypoint?.startDate).format("DD MMM YYYY");
              const dateEnd = moment(waypoint?.startEnd).format("DD MMM YYYY");
              const time = moment(waypoint?.startTime, "HH:mm:ss").format("hh:mm A");
              const timeEnd = moment(waypoint?.startEndTime, "HH:mm:ss").format("hh:mm A");
              return (
                <Marker
                  key={index}
                  coordinate={waypoint}
                >
                  <Callout>
                    <View>
                      <Text style={{ fontSize: 16, fontFamily: font.regular }}>{waypoint?.address}</Text>
                      <Text style={{ fontSize: 16, fontFamily: font.regular }}>Job Status: {waypoint?.job_status}</Text>
                      <Text style={{ fontSize: 16, fontFamily: font.regular }}>Job Id: {waypoint?.serial_id}</Text>
                      <Text style={{ fontSize: 16, fontFamily: font.regular }}>Start Date : {date}</Text>
                      <Text style={{ fontSize: 16, fontFamily: font.regular }}>Start Time : {time}</Text>
                      <Text style={{ fontSize: 16, fontFamily: font.regular }}>End Date : {dateEnd}</Text>
                      <Text style={{ fontSize: 16, fontFamily: font.regular }}>End Time : {timeEnd}</Text>
                    </View>
                  </Callout>
                </Marker>

              )
            })}
            {/* <Marker
                  key={index}
                  coordinate={waypoint}
                  title={`${waypoint?.address}\nJob Status: ${waypoint?.job_status}\nJob Id: ${waypoint?.serial_id}`}
                  description={`${date}\n${time}\n${dateEnd}\n${timeEnd}`}
                /> */}
          </MapView>
        </Pressable>
      </Modal>
      <ModalLoader modalView={isFocus} />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  firstView: {
    margin: 10,
    marginTop: 0,
    borderRadius: 10,
    justifyContent: "center",
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { height: 0, width: 0 },
  },
  card: {
    backgroundColor: "white",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { height: 0, width: 0 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: font.regular
  },
  custIcon: {
    marginRight: "10%",
    color: "black",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default TodaysRoutes;
