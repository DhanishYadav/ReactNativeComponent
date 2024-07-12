import React, { Component, useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Button,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  Linking,
  Modal,
  Pressable
} from "react-native";

import { shadow, spacing, typography } from "@/theme";
import { jobStyles } from "../JobDetails/JobDetailStyle";
import { useDispatch, useSelector } from "react-redux";
import Entypo from "react-native-vector-icons/Entypo";
import { Iicon, backIcon, backgroundImage, cancel, edit, invoices, noAvailableImg } from "@/assets";
import { estimateSendPaymentMode, invoicepayment } from "@/actions/UserActions";
import { styles } from "../InvoicePayments/InvoicePaymentsStyles";
import { TextInput } from "react-native-gesture-handler";
import { NAVIGATION } from "@/constants";
import CheckBox from '@react-native-community/checkbox';;
import { ModalLoader } from "@/components/ModalLoader";

export function Payment({ route, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [amount, setAmount] = useState('');
  const [getAmmount, setGettingAmmount] = useState("");
  const dispatch = useDispatch()
  const Invoice = useSelector((state) => state?.job?.tabCount?.data);
  const paymentType = useSelector((state) => state?.user?.invoicepayment);
  const estimate_Id = useSelector((state) => state.user?.estimateDetails?.estimateDetails?.id);

  useEffect(() => {
    navigation.addListener('focus', () => {
        setIsFocus(true)
        setTimeout(function () {
          setIsFocus(false)
        }, 2000);
      }, [isFocus]);
    dispatch(invoicepayment())
  }, [])



  const handleAddAmount = () => {
    // console.log(amount);
    setGettingAmmount(amount)
    setModalVisible(false);
  };

  const onCheckedChange = (newvalue, index, item) => {
    if (newvalue) {
      setSelectedIndex(index);
      handleItemPress(item)
    } else {
      setSelectedIndex(null);
    }
  };

  const handleItemPress = (item) => {
    // console.log(item.name, 'cureeText--');
    setIsFocus(true)
    let data = {
      estimate_id: estimate_Id,
      amount: getAmmount,
      payment_type: item.name
    }
    console.log('-----00', data);
    if (getAmmount != '') {
      dispatch(estimateSendPaymentMode(data, navigation,setIsFocus))
      setGettingAmmount('');
      setSelectedIndex(null);
    }

  };

  const paymentMode = paymentType;
  const Item = ({ item, index }) => (
    <TouchableOpacity style={{
      backgroundColor: 'white', borderWidth: 1, borderColor: '#D3D3D3', marginHorizontal: 10, marginVertical: 5, borderRadius: 10, shadowOffset: { width: -2, height: 4 },
      shadowColor: '#171717',
      shadowOpacity: 0.2,
      shadowRadius: 3, elevation: 4
    }}
    // onPress={() => handleItemPress(item)}
    >
      <View style={{ padding: 15, flexDirection: 'row' }}>
        <Image source={invoices} />
        <Text style={{ color: '#041B3E', marginLeft: 20, fontSize: 18, fontWeight: '400' }}>{item?.name}</Text>
        <CheckBox value={index === selectedIndex} style={{ marginLeft: 'auto' }} onValueChange={(newvalue) => onCheckedChange(newvalue, index, item)} />
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <View style={{ width: "100%" }}>
          <ImageBackground
            resizeMode="cover"
            style={[shadow.primary, { height: 80 }]}
            source={backgroundImage}
          >
            <View style={{ flexDirection: "row", padding: spacing.s }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={cancel} />
              </TouchableOpacity>
              <Text style={jobStyles.jobId}>Collect Payment</Text>
            </View>
          </ImageBackground>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: "row",
              // paddingHorizontal: 20,
              alignItems: "center",
              paddingVertical: 10,
              backgroundColor: "#E5F1FF",
              marginHorizontal: 20,
              borderRadius: 10,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#A0BFE0",
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
                marginHorizontal: 10,
              }}
            >
              <Image source={Iicon} style={{width:25,height:25}} />
            </View>

            <Text style={{ paddingHorizontal: 10 }}>
              This Job doesn't have a balance yet
            </Text>
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <Text>Amount due</Text>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 10,
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 30, fontWeight: "bold" }}>
                  ${getAmmount}
                </Text>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginTop: 12 }}
                >
                  /$0.00{" "}
                </Text>
              </View>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => setModalVisible(true)}
              >
                <Image source={edit} style={{ width: 16, height: 16 }} />
                <Text
                  style={{
                    color: "#A0BFE0",
                    paddingHorizontal: 10,
                    fontWeight: "bold",
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ color: "orange", marginHorizontal: 20 }}>
            Amount is required to collect payment
          </Text>
          {/* <TouchableOpacity
          style={{
            backgroundColor: "#041B3E",
            marginHorizontal: 20,
            padding: 10,
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 100
          }}

        >
          <Text style={{ color: "#fff", fontWeight: "900" }}>Type card manually</Text>
        </TouchableOpacity> */}

          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 20,
              marginVertical: 50,
            }}
          >
            <View
              style={{ backgroundColor: "#D3D3D3", height: 1, width: "30%" }}
            ></View>
            <Text style={{ textAlign: "center", padding: 15, marginTop: -25 }}>
              OR PAY WITH
            </Text>
            <View
              style={{ backgroundColor: "#D3D3D3", height: 1, width: "35%" }}
            ></View>
          </View>

          <FlatList
            data={paymentMode}
            renderItem={Item}
            keyExtractor={(item) => item.id}
          />
          <View style={{ marginBottom: 30 }}></View>
        </ScrollView>
      </View>

      <Modal
        swipeDirection={["down"]}
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onSwipeComplete={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{ marginLeft: "auto", marginRight: 10, marginTop: 5 }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Entypo name="cross" size={15} />
            </TouchableOpacity>
            <Text style={styles.modalText}>Enter Ammount </Text>
            <View style={styles.inputView}>
              <TextInput
                placeholder="Enter ammount"
                style={styles.inputText}
                onChangeText={(text) => setAmount(text)}
                keyboardType="numeric"
              />
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleAddAmount}
            >
              <Text style={styles.textStyle}>Add Ammount</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ModalLoader modalView={isFocus} />
    </SafeAreaView>
  );
}
