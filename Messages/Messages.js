import { DeleteMessageMember, GetMessageMember, getPermissionName, makeFevorite } from "@/actions/UserActions";
import { backgroundImage, search, avater, noAvailableImg, User } from "@/assets";
import { HomeHeader } from "@/components/CustomHeaders/HomeHeader";
import { MessageHeader } from "@/components/CustomHeaders/MessageHeader";
import { ModalLoader } from "@/components/ModalLoader";
import { shadow, spacing } from "@/theme";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ImageBackground,
  Image,
  RefreshControl,
  ScrollView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

import { useDispatch, useSelector } from "react-redux";

const messages = [
  {
    id: 1,
    sender: "James Anderson",
    text: "Lorem Ipsum is simply dummy ...",
    messageCount: "3",
  },
  { id: 2, sender: "Criag", text: "Lorem Ipsum is simply dummy ..." },
  {
    id: 3,
    sender: "Grace Vazquez",
    text: "Lorem Ipsum is simply dummy ...",
    messageCount: "1",
  },
  {
    id: 4,
    sender: "Misty Ortega",
    text: "Lorem Ipsum is simply dummy ...",
    messageCount: "2",
  },
  { id: 5, sender: "Christi Reis", text: "Lorem Ipsum is simply dummy ..." },
  {
    id: 6,
    sender: "EFG Home Service",
    text: "Lorem Ipsum is simply dummy ...",
    messageCount: "6",
  },
  // Add more messages as needed
];

const Messages = ({ navigation }) => {
  const dispatch = useDispatch();
  const GetMessageMembers = useSelector(
    (state) => state?.user?.GetMessageMember
  );
  const [isFocus, setIsFocus] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isClick, setIsClick] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const deleteMemberList = (item) => {
    setIsFocus(true);
    const data = {
      id: item?.id,
      role_name: item?.role,
      phone_number: item?.phone
    };
    // console.log(data, "final Data Deleted")
    dispatch(
      DeleteMessageMember(data, setIsFocus, (response) => {
        if (response) {
          dispatch(GetMessageMember());
        }
      })
    );
  };
  useEffect(() => {
    dispatch(getPermissionName())
  }, [])
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      dispatch(getPermissionName())
    }, 2000);
  }, []);
  const LoginAllData = useSelector(
    (state) => state?.user?.loginAllDataPermission
  );
  const getPermissionByNameDelete = (name) => {
    return LoginAllData?.find(item => item.name === name)?.action;
  };
  const PermissionByNameDelete = getPermissionByNameDelete('select_message');
  const renderMessage = ({ item, index }) => {
    // console.log("itemvalue---->", item?.[index]?.role)
    // const initials = item.sender.slice(0, 2).toUpperCase();
    if (searchText == "") {
      return (
        <TouchableOpacity
          style={styles.messageContainer}
          onPress={() => {
            // navigation.replace("Chatting", { message: item });
            navigation.navigate("Chatting", { message: item });
          }}
        >
          {/* <View style={styles.avatarContainer}> */}
          {/* <Text style={styles.avatar}>{initials}</Text> */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            {item?.user_image ? (
              <Image
                style={{
                  alignSelf: "center",
                  height: 60,
                  width: 60,
                  borderRadius: 100,
                }}
                // source={{
                //   uri: `https://observancedev.com/public/uploads/user/${item?.user_image}`,
                // }}
                source={User}
              />
            ) : (
              <Image
                style={{
                  alignSelf: "center",
                  height: 50,
                  width: 50,
                  borderRadius: 100,
                }}
                // source={noAvailableImg}
                source={User}
              />
            )}
            {/* </View> */}
            <View style={styles.messageContent}>
              <Text style={styles.sender}>
                {item?.first_name != "Unknown" ? item?.first_name + " " + item?.last_name : item?.phone}
              </Text>
              <Text style={styles.text}>
                {item?.role}
              </Text>
            </View>
            {item?.count_mesage > 0 ?
              <View
                style={{
                  backgroundColor: "#195090",
                  height: 25,
                  width: 25,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text style={[styles.sender, { color: "#fff", marginBottom: 0 }]}>
                  {item?.count_mesage}
                </Text>
              </View> : null
            }
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              {item?.role == "unknown" ? null :
                <TouchableOpacity onPress={() => {
                  setIsClick(!isClick)
                  const updatedRole = item?.role === 'Staff' ? 'users' : item?.role === 'Customer' ? 'clients' : item?.role;
                  const data =
                  {
                    id: item?.id,
                    role: updatedRole,
                    favorite: item?.favorite
                  }
                  // console.log(data, "makeFevorite", item)
                  dispatch(makeFevorite(data));
                }}>
                  <Ionicons name={item?.favorite == 1 ? 'star' : 'star-outline'} color={item?.favorite == 1 ? '#FFB000' : 'gray'} size={25} />
                </TouchableOpacity>}
              {PermissionByNameDelete?.view && (<TouchableOpacity
                style={{
                  paddingLeft: 20,
                  // justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginTop: 5
                  // backgroundColor:"red"
                  // paddingHorizontal:15
                }}
                onPress={() => deleteMemberList(item)}
              >
                <Entypo
                  name="box"
                  size={20}
                  // style={styless.icon}
                  color={"red"}
                // onPress={() => deleteMemberList(item?.id)}
                />
                {/* <Text
                  style={{
                    backgroundColor: "#E27E7E",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: 10,
                    paddingHorizontal: 15,
                    paddingVertical: 2,
                  }}
                >
                  Delete
                </Text> */}
              </TouchableOpacity>)}
            </View>


          </View>
        </TouchableOpacity>
      );
    }
    if (item?.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item?.last_name?.toLowerCase().includes(searchText.toLowerCase())) {
      return (
        <TouchableOpacity
          style={styles.messageContainer}
          onPress={() => {
            // navigation.replace("Chatting", { message: item });
            navigation.navigate("Chatting", { message: item });
          }}
        >
          {/* <View style={styles.avatarContainer}> */}
          {/* <Text style={styles.avatar}>{initials}</Text> */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            {item?.user_image ? (
              <Image
                style={{
                  alignSelf: "center",
                  height: 60,
                  width: 60,
                  borderRadius: 100,
                }}
                // source={{
                //   uri: `https://observancedev.com/public/uploads/user/${item?.user_image}`,
                // }}
                source={User}
              />
            ) : (
              <Image
                style={{
                  alignSelf: "center",
                  height: 50,
                  width: 50,
                  borderRadius: 100,
                }}
                // source={noAvailableImg}
                source={User}
              />
            )}
            {/* </View> */}
            <View style={styles.messageContent}>
              <Text style={styles.sender}>
                {item?.first_name ? item?.first_name + " " + item?.last_name : item?.role}
              </Text>
              <Text style={styles.text}>
                {item?.company_name}
              </Text>
            </View>
            {item?.count_mesage > 0 ?
              <View
                style={{
                  backgroundColor: "#195090",
                  height: 25,
                  width: 25,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text style={[styles.sender, { color: "#fff", marginBottom: 0 }]}>
                  {item?.count_mesage}
                </Text>
              </View> : null
            }

            {/* {GetMessageMembers?.role == "unknow"? null : */}

            <TouchableOpacity onPress={() => {
              console.log("favorite", item?.favorite)
              setIsClick(!isClick)
              const data =
              {
                "id": item?.id,
                "role": item?.role,
                "favorite": item?.favorite
              }
              console.log("fevorite lll", data)

              // dispatch(makeFevorite(data));


            }}>
              <Ionicons name={item?.favorite == 1 ? 'star' : 'star-outline'} color={item?.favorite == 1 ? '#FFB000' : 'gray'} size={25} />

            </TouchableOpacity>
            {/* } */}



          </View>
        </TouchableOpacity>
      );
    }

  };

  const filteredMessages = messages.filter((item) =>
    item.sender.toLowerCase().includes(searchText.toLowerCase())
  );
  useEffect(() => {
    navigation.addListener(
      "focus",
      () => {
        dispatch(GetMessageMember(navigation));
      },
      []
    );
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <MessageHeader title={"Messages"} />
      <View style={[shadow.shadowImage]}>
        <ImageBackground
          style={[{ flexDirection: "row", padding: 20 }]}
          source={backgroundImage}
        >
          <View style={styles.viewInput}>
            <TextInput
              placeholder={"Search Contacts"}
              style={{ flex: 1, paddingHorizontal: 10 }}
              placeholderTextColor="#9393AB"
              onChangeText={(text) => setSearchText(text)}
            />
            <Image style={{ alignSelf: "center" }} source={search} />
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
        <View style={{ marginHorizontal: 15, marginVertical: 20 }}>
          <Text style={styles.sender}>All Messages</Text>
        </View>
        <FlatList
          data={GetMessageMembers}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
        />
      </ScrollView>
      <ModalLoader modalView={isFocus} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  viewInput: {
    borderWidth: 1,
    borderColor: "#D5DBE4",
    flexDirection: "row",
    width: "100%",
    // paddingRight: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  messageContainer: {
    // flexDirection: 'row',
    // justifyContent:"space-between",
    marginBottom: 8,
    padding: 10,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: "#E4EFF2",
    marginHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#FFF",
    // shadowColor: '#D5DBE4',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 1.31,

    // elevation: 2,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  messageContent: {
    flex: 1,
    marginLeft: 16,
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
    color: "#041B3E",
  },
  text: {
    color: "#757588",
    fontSize: 14,
  },
});

export default Messages;
