import React, { Component, useEffect, useState, useRef, useCallback } from "react";
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
  PermissionsAndroid,
  StyleSheet,
} from "react-native";
import { shadow, spacing, typography } from "@/theme";
import { jobStyles } from "./JobDetailStyle";
import { useDispatch, useSelector } from "react-redux";
import { backIcon, backgroundImage } from "@/assets";
import { addIcon, camera, gallery } from "@/assets";
import axios from "axios";
import { ShowToastMessage } from "@/helpers";
import ImagePicker from "react-native-image-crop-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "react-native-optiongroup/src/styles";
import { GetJobAttachmentFile, deleteAttachmentFile, uploadAttachmentFile } from "@/actions/ItemsActions";
import { useNavigation } from "@react-navigation/native";
import { font } from "@/theme/font";
import moment from "moment";
import { ModalLoader } from "@/components/ModalLoader";
export function Files() {
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const jobDetailsData = useSelector(
    (state) => state?.user?.jobDetailsDataReducer
  );
  const getJobAttachementList = useSelector((state) => state?.item?.getJobAttachementList);
  //console.log(getJobAttachementList?.jobfiles, "getJobAttachementList")
  const [selectedImage, setSelectedImage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const transparent = "rgba(0,0,0,0.5)";
  useEffect(() => {
    const data = {
      job_id: jobDetailsData?.job_id
    }
    dispatch(GetJobAttachmentFile(data))
  }, [dispatch, jobDetailsData?.job_id])
  function imageupLoad(index) {
    if (index == "2") {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        cropperCircleOverlay: false,
        mediaType: "photo",
      }).then((image) => {
        setSelectedImage(image.path);
        capturePhoto(image);
        //ShowToastMessage("Image upload successfully.");
        setOpenModal(false);
      });
    } else {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        cropperCircleOverlay: false,
        mediaType: "photo",
      }).then((image) => {
        setSelectedImage(image.path);
        capturePhoto(image);
        //ShowToastMessage("Image upload successfully.");
        setOpenModal(false);
      });
    }
  }
  //console.log(getJobAttachementList?.jobfiles, "getJobAttachementList?.jobfiles")
  const renderAttachmentItem = ({ item }) => {
    const dateString = item?.created;
    const date = new Date(dateString);
    // const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    // const hyphenatedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    // const formattedDate = hyphenatedDate.replace(/\//g, '-');
    const formattedDate = moment(date).format("MMM DD YYYY");
    return (
      <View style={[stylesCustome.card, { backgroundColor: "#F9F9F9" }]}>
        <View style={stylesCustome.cardcontainer}>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity
              style={{
                // padding: 20,
                // justifyContent: "flex-end",
                alignItems: "flex-end",
                // backgroundColor:"red"
                // paddingHorizontal:15
              }}
              onPress={() => deleteAttachedInvoices(item?.id)}
            >
              <Text
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
              </Text>
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity
            style={{ padding: 20 }}
            onPress={() => deleteAttachedInvoices(item?.id)}
          >
            <Text style={[styles.txtheader, { backgroundColor: "#E27E7E" }]}>
              Delete
            </Text>
          </TouchableOpacity> */}

          <View style={[stylesCustome.jobDetails, { marginTop: 12 }]}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={stylesCustome.imgView}>
                <Image
                  source={{ uri: item?.image_url }}
                  style={{
                    height: "100%",
                    width: "100%",
                    alignSelf: "center",
                    borderRadius: 100,
                  }}
                />
              </View>
              <Text style={stylesCustome.fullname}>{item?.upload_by}</Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={[stylesCustome.jobDescription]}>{formattedDate}</Text>
            </View>
          </View>
          <View style={{ marginBottom: spacing.s }}></View>
        </View>
      </View>
    );
  };
  const modalOpenView = () => {
    requestCameraPermission()
    setOpenModal(true);
    setSelectedImage("");
  };
  const capturePhoto = async (image) => {
    const imageResponse = await fetch(`file://${image.path}`);
    const blobData = await imageResponse.blob();
    const base64Data = await blobToBase64(blobData);
    const data = {
      job_id: jobDetailsData?.job_id,
      atch_by: `${jobDetailsData?.client_first_name} ${jobDetailsData?.client_last_name}`,
      image_upload: base64Data.replace("data:image/jpeg;base64,", ""),
    }
    dispatch(uploadAttachmentFile(data, (response) => {
      if (response) {
        dispatch(GetJobAttachmentFile({ job_id: jobDetailsData?.job_id }));
      }
    }))
  }
  const deleteAttachedInvoices = (id) => {
    setIsFocus(true);
    let data = {
      id: id,
      job_id: jobDetailsData?.job_id
    };
    dispatch(
      deleteAttachmentFile(data, setIsFocus, (response) => {
        if (response) {
          dispatch(GetJobAttachmentFile({ job_id: jobDetailsData?.job_id }));
        }
      })
    );
  };
  const blobToBase64 = useCallback((blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    } catch (err) {
      Logger.log(`Error in converting blob to base64 - ${err}`);
      throw err;
    }
  }, []);
  // console.log( "3333333333333",GetPaymentlistcashandcheque)
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  function renderModal() {
    return (
      <Modal
        visible={openModal}
        onBackdropPress={() => setOpenModal(false)}
        onRequestClose={() => setOpenModal(false)}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: transparent,
            justifyContent: "center",
          }}
        >
          <View style={[jobStyles.modalView, { height: "40%" }]}>
            <Ionicons
              name="close"
              size={25}
              color={"#041B3E"}
              style={{ marginLeft: 5 }}
              onPress={() => setOpenModal(false)}
            />
            <View style={{ alignItems: "center", marginVertical: 10 }}>
              <Text style={jobStyles.modalheading}>Add Attachment</Text>
            </View>
            <TouchableOpacity
              onPress={() => imageupLoad("1")}
              style={[
                shadow.primaryView,
                { flexDirection: "row", padding: 15, marginTop: 10 },
              ]}
            >
              <Image source={camera} />
              <Text style={[jobStyles.headingTxt, { marginLeft: 25 }]}>
                Take Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => imageupLoad("2")}
              style={[
                shadow.primaryView,
                { flexDirection: "row", padding: 15, marginTop: 10 },
              ]}
            >
              <Image source={gallery} />
              <Text style={[jobStyles.headingTxt, { marginLeft: 25 }]}>
                Choose From Library / Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <View style={{ width: "100%" }}>
          <ImageBackground
            resizeMode="cover"
            style={[shadow.primary, { height: 80 }]}
            source={backgroundImage}
          >
            <View style={{ flexDirection: "row", padding: spacing.s, justifyContent: "space-between" }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={backIcon} />
              </TouchableOpacity>
              <Text style={jobStyles.jobId}>
                Job #{jobDetailsData?.job_serial_id}
              </Text>
              {jobDetailsData?.parent_job_serial_no ? <Text style={styles.invoiceId}>
                <Text style={jobStyles.jobId}>
                  Parent Job #{jobDetailsData?.parent_job_serial_no}
                </Text>
              </Text> : null}
            </View>
          </ImageBackground>
        </View>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginHorizontal: 20,
            marginVertical: 20,
            borderRadius: 10,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,

            elevation: 7,
          }}
          onPress={modalOpenView}
        >
          <Text>Upload file</Text>
        </TouchableOpacity>
        {getJobAttachementList?.jobfiles?.length !== 0 ?
          <FlatList
            style={{ width: "100%", paddingVertical: 10, paddingHorizontal: 20 }}
            renderItem={renderAttachmentItem}
            data={getJobAttachementList?.jobfiles}
            // horizontal
            showsHorizontalScrollIndicator={false}
          /> : null}
      </View>
      {renderModal()}
      <ModalLoader modalView={isFocus} />
    </SafeAreaView>
  );
}
const stylesCustome = StyleSheet.create(
  {
    card: {
      // backgroundColor: '#EAECFA',
      marginTop: spacing.x,
      marginHorizontal: spacing.s,
      borderWidth: 2,
      borderColor: "#E4EFF2",
      borderRadius: 20,
    },
    cardcontainer: {
      padding: 15,
      paddingTop: 30,
      borderRadius: 10,
    },
    txtheader: {
      color: "white",
      fontWeight: "bold",
      borderRadius: 10,
      // alignSelf: "flex-end",
      // marginTop: -40,
      // paddingTop: 2,
      // paddingBottom: 2,
      // paddingLeft: 10,
      // paddingHorizontal: 15,
      // marginLeft: "80%"
    },
    jobDetails: {
      flexDirection: "row",
      paddingLeft: 10,
      paddingRight: 10,
    },
    title: {
      color: "#041B3E",
      fontSize: 18,
      fontWeight: "600",
      alignSelf: "center",
      fontFamily: font.bold,
    },
    fullname: {
      textAlignVertical: "center",
      // marginLeft: spacing.x,
      fontSize: 14,
      fontFamily: font.regular,
      color: "#041B3E",
    },
    jobDescription: {
      marginLeft: 10,
      paddingRight: 0,
      paddingTop: 5,
      paddingBottom: 5,
      // borderRadius: 140,
      // backgroundColor: 'white',
      alignSelf: "flex-end",
      color: "#041B3E",
      fontWeight: "600",
      fontSize: 12,
    },
    imgView: {
      // borderRadius: 50,
      height: 50,

      // borderColor: '#E4EFF2',
      // borderWidth: 2,
      padding: 4,
      width: 50,
    },
  })
