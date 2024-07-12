import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { jobStyles } from "./JobDetailStyle";
import { addIcon, camera, gallery } from "@/assets";
import { shadow } from "@/theme";
import ImagePicker from "react-native-image-crop-picker";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import RNFS from "react-native-fs";
import { store } from "@/store";
import { addAttachments, deleteAttachNotes } from "@/actions/JobActions";
import { useNavigation } from "@react-navigation/native";
import { ShowToastMessage } from "@/helpers";
import { NoRecords } from "@/components/NoRecords";

export function JobDetailAttachment(props) {
  const getjobId = useSelector((state) => state?.user?.jobDetailsDataReducer?.job_id);
  const accessToken = store.getState().user?.token?.access_token;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selectedImage, setSelectedImage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const jobDetailsData = useSelector(
    (state) => state?.user?.jobDetailsDataReducer
  );

  //console.log("jobDetailsData", jobDetailsData);

  const transparent = "rgba(0,0,0,0.5)";

  const LoginAllData = useSelector(
    (state) => state?.user?.loginAllData?.permissions
  );

  let JobPermissionEdit = LoginAllData?.[3]?.action;
  const PermissionLavel = useSelector(
    (state) => state?.user?.loginAllData?.data?.permission_level
  );

  const uploadImage = async (image) => {
    console.log("image 1=", image.path + "=" + jobDetailsData?.job_id);
    //let filename = image.path.substring(image.path.lastIndexOf('/') + 1, image.path.length)
    let base64Convert = await RNFS.readFile(image.path, "base64");
    let req = { job_id: jobDetailsData?.job_id, job_attachment: base64Convert };
    //console.log("formdata", req);
    dispatch(addAttachments(req, navigation, setOpenModal, props?.refresh));
    setSelectedImage("");
  };

  function imageupLoad(index) {
    if (index == "2") {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        cropperCircleOverlay: false,
        mediaType: "photo",
        compressImageQuality: 0.1,
      }).then((image) => {
        setSelectedImage(image.path);
        uploadImage(image);
        // ShowToastMessage("Image upload successfully.");
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
        uploadImage(image);
        //        ShowToastMessage("Image upload successfully.");
        setOpenModal(false);
      });
    }
  }

  function deleteId(id) {
    console.log("imagedeleteId---->", id);
    const data = {
      key: "job_attachment",
      job_attachment_id: id,
      job_id: getjobId,
    };
    dispatch(deleteAttachNotes(data, navigation, setOpenModal, props?.refresh));
  }

  const renderAttachmentItem = ({ item }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ marginRight: 10 }}>
          <View
            style={[
              shadow.shadowPhoto,
              {
                borderColor: "#E4EFF2",
                borderRadius: 10,
                borderWidth: 1,
                // padding: 10,
              },
            ]}
          >
            <Image
              source={{ uri: item?.image_url }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 3,
            }}
          >
            <Text style={{ color: "#757588", fontSize: 10 }}>
              {item?.created}
            </Text>
            <Text style={{ color: "#757588", fontSize: 10 }}>{item?.id}</Text>
          </View>
        </View>

        <View
          style={{
            borderRadius: 10,
            position: "absolute",
            width: 25,
            height: 25,
            right: 0,
            marginRight: 12,
            backgroundColor: "white",
            opacity: 0.7,
          }}
        >
          <Ionicons
            name="close"
            size={25}
            color={"black"}
            style={{ marginLeft: 0 }}
            onPress={() => deleteId(item?.id)}
          />
        </View>
      </View>
    );
  };

  const modalOpenView = () => {
    if (
      PermissionLavel == "1" ||
      JobPermissionEdit?.edit ||
      LoginAllData == undefined
    ) {
      setOpenModal(true);
      setSelectedImage("");
    } else {
      ShowToastMessage("You dont have permission to edit job");
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

  // useEffect(()=>{
  // console.log("wwe="+jobDetailsData?.attachment)
  // },[])

  return (
    <View style={{ marginTop: 30 }}>
      <View style={jobStyles.viewTags}>
        <Text style={jobStyles.headingTxt}>Attachments</Text>
        <TouchableOpacity onPress={modalOpenView}>
          <Image source={addIcon} />
        </TouchableOpacity>
      </View>


        <FlatList
          style={{width:"100%",}}
          renderItem={renderAttachmentItem}
          data={jobDetailsData?.attachment}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{justifyContent:"center",marginHorizontal:100}}>
                <NoRecords/>

            </View>
          
        }
        />

        {/* {getAttchments?.length != 0 ? <FlatList
          style={{ width: '100%' }}
          renderItem={renderAttachmentItem}
          data={getAttchments}
          horizontal
          showsHorizontalScrollIndicator={false}
        /> : <NoRecords />} */}

      {renderModal()}
      {/* <ActionSheet
        ref={actionSheet}
        title={'Which one do you like ?'}
        options={['Gallery', 'Camera', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => {
          imageuploadData(index);
        }}
      /> */}
    </View>
  );
}
