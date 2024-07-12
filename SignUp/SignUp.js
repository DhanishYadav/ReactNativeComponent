import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from "react-native";
import { style } from "./SignUp.styles";
import images from "../../assets/index";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { spacing } from "@/theme";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "@/constants";

import { Formik } from "formik";
import * as Yup from "yup";
import { googleSign, appleLogin } from "../SocialLogIn/googleLogin";
import { fblogin } from "../SocialLogIn/facebookLogin";
import { useDispatch } from "react-redux";
import { hitgoogleSignUp, register } from "@/actions/UserActions";
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { ModalLoader } from "@/components/ModalLoader";

import storage from "@/storage/index";
const SignUp = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isFocus, setIsFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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
  }, [isFocus]);

  const hitGoogleSignUPfun = async () => {
    // setIsFocus(true);
    try {
      setIsFocus(true);
      await GoogleSignin.hasPlayServices();
      GoogleSignin.configure();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      //alert("SignUp"+JSON.stringify(userInfo?.user))
      console.log("hitgoogleSignUphitgoogleSignUp==>", userInfo?.user)
      let data = {
        email: userInfo?.user?.email,
        familyName: userInfo?.user?.givenName,
        givenName: userInfo?.user?.familyName,
        id: userInfo?.user?.id,
        name: userInfo?.user?.name,
        photo: userInfo?.user?.photo,
      };
      console.log("data==>>>", data);
      dispatch(hitgoogleSignUp(data, navigation, setIsFocus));
      // alert(JSON.stringify(userInfo?.user))
    } catch (error) {
      // alert(JSON.stringify(error))
      setIsFocus(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("error==>", error);
        console.log("Cancel");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Signin in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("PLAY_SERVICES_NOT_AVAILABLE");
      } else {
        console.log("errorl==>", error);
      }
    }
  };

  const SignUpSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Enter Email Address."),
    // password: Yup.string().required('Enter Password.')
    firstname: Yup.string().required("Enter First Name."),
    lastname: Yup.string().required("Enter Last Name."),
    phonenumber: Yup.string().required("Enter Phone number."),
    bussinessname: Yup.string()
      .required("Enter Business name.")
      .min(5, "Business name must be at least 5 characters long")
      .matches(
        /^.*\S.*\S.*\S.*\S.*\S.*$/,
        "Business name must contain at least 5 non-whitespace characters"
      ),
    // password: Yup.string().required('Enter Confirm Password.')
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const SignUpApi = (values) => {
    setIsFocus(true);
    //
    let data = {
      businessname: values.bussinessname,
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      phone: values.phonenumber,
      password: values.password,
      password_confirm: values.confirmPassword,
    };

    dispatch(register(data, navigation, setIsFocus));
    //  navigation.navigate(NAVIGATION.BusinessSelection)
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibilityConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        confirmPassword: "",
        firstname: "",
        lastname: "",
        phonenumber: "",
        bussinessname: "",
      }}
      // onSubmit={(values) =>
      onSubmit={(values, { resetForm }) => {
        SignUpApi(values);
        setTimeout(() => {
          resetForm();
        }, 1000);
      }}
      validationSchema={SignUpSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <SafeAreaView style={style.container}>
          <ImageBackground
            style={style.container}
            source={require("../../assets/imageslog/backgroundImg.png")}
          >
            <ScrollView style={style.container}>
              <View style={style.firstView}>
                {/* <Image source={images.vector}/> */}
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image
                    source={require("../../assets/imageslog/Vector.png")}
                    style={style.iconrightChevron}
                  />
                </TouchableOpacity>
                <View style={style.wlcTextView}>
                  <Text style={style.wlcText}>Welcome</Text>
                  <Text style={style.wlcsubtitleText}>
                    Create Your Free Account Now
                  </Text>
                </View>
              </View>
              <View style={style.secView}>
                {/* <Text>Helloo</Text> */}
                <View style={{ marginHorizontal: 20 }}>
                  <Text style={style.txtFieldTitle}>Business Name</Text>
                  <View style={style.txtFieldView}>
                    <View style={{ flexDirection: "row" }}>
                      <Feather name={"mail"} size={20} style={style.custIcon} />
                      <TextInput
                        placeholder="Enter Business Name"
                        onChangeText={handleChange("bussinessname")}
                        style={style.textboxfield}
                        onBlur={handleBlur("bussinessname")}
                        value={values.bussinessname}
                      // maxLength={50}
                      // keyboardType="email-address"
                      // autoCapitalize="none"
                      />
                    </View>
                  </View>
                  {errors.bussinessname && touched.bussinessname && (
                    <Text style={style.error}>{errors.bussinessname}</Text>
                  )}
                  <Text style={[style.txtFieldTitle, { marginTop: spacing.s }]}>
                    First Name
                  </Text>
                  <View style={style.txtFieldView}>
                    <View style={{ flexDirection: "row" }}>
                      <MaterialIcons
                        name={"person-outline"}
                        size={20}
                        style={style.custIcon}
                      />
                      <TextInput
                        placeholder="Enter First Name"
                        onChangeText={handleChange("firstname")}
                        style={style.textboxfield}
                        onBlur={handleBlur("firstname")}
                        value={values.firstname}
                      // maxLength={50}
                      // keyboardType="email-address"
                      // autoCapitalize="none"
                      />
                    </View>
                  </View>
                  {errors.firstname && touched.firstname && (
                    <Text style={style.error}>{errors.firstname}</Text>
                  )}
                  <Text style={[style.txtFieldTitle, { marginTop: spacing.s }]}>
                    Last Name
                  </Text>
                  <View style={style.txtFieldView}>
                    <View style={{ flexDirection: "row" }}>
                      <MaterialIcons
                        name={"person-outline"}
                        size={20}
                        style={style.custIcon}
                      />
                      <TextInput
                        placeholder="Enter Last Name"
                        onChangeText={handleChange("lastname")}
                        style={style.textboxfield}
                        onBlur={handleBlur("lastname")}
                        value={values.lastname}
                      // maxLength={50}
                      // keyboardType="email-address"
                      // autoCapitalize="none"
                      />
                    </View>
                  </View>
                  {errors.lastname && touched.lastname && (
                    <Text style={style.error}>{errors.lastname}</Text>
                  )}
                  <Text style={[style.txtFieldTitle, { marginTop: spacing.s }]}>
                    Email Address
                  </Text>
                  <View style={style.txtFieldView}>
                    <View style={{ flexDirection: "row" }}>
                      <Feather name={"mail"} size={20} style={style.custIcon} />
                      <TextInput
                        placeholder="Enter Email Address"
                        onChangeText={handleChange("email")}
                        style={style.textboxfield}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      // maxLength={50}
                      />
                    </View>
                  </View>
                  {errors.email && touched.email && (
                    <Text style={style.error}>{errors.email}</Text>
                  )}

                  <Text style={[style.txtFieldTitle, { marginTop: spacing.s }]}>
                    Phone Number
                  </Text>
                  <View style={style.txtFieldView}>
                    <View style={{ flexDirection: "row" }}>
                      <Feather
                        name={"phone"}
                        size={20}
                        style={style.custIcon}
                      />
                      <TextInput
                        placeholder="Enter Phone Number"
                        onChangeText={handleChange("phonenumber")}
                        style={style.textboxfield}
                        onBlur={handleBlur("phonenumber")}
                        value={values.phonenumber}
                        keyboardType="number-pad"
                        maxLength={10}
                      // keyboardType="email-address"
                      // autoCapitalize="none"
                      />
                    </View>
                  </View>
                  {errors.phonenumber && touched.phonenumber && (
                    <Text style={style.error}>{errors.phonenumber}</Text>
                  )}

                  <Text style={[style.txtFieldTitle, { marginTop: spacing.s }]}>
                    Password
                  </Text>
                  <View style={style.txtFieldView}>
                    <View style={{ flexDirection: "row", }}>
                      <MaterialCommunityIcons
                        name={"lock-outline"}
                        size={20}
                        style={style.custIcon}
                      />
                      <TextInput
                        placeholder="Password"
                        onChangeText={handleChange("password")}
                        style={style.textboxfield}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        secureTextEntry={!showPassword}

                        maxLength={50}
                      />
                      <TouchableOpacity onPress={togglePasswordVisibility} style={{ marginVertical: 15, alignItems: "center", marginRight: 105 }}>
                        <Text>{showPassword ? <Feather name={"eye"} size={20} style={style.custIcon} /> :
                          <Feather name={"eye-off"} size={20} style={style.custIcon} />} </Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                  {errors.password && touched.password && (
                    <Text style={style.error}>{errors.password}</Text>
                  )}

                  <Text style={[style.txtFieldTitle, { marginTop: spacing.s }]}>
                    Confirm Password
                  </Text>
                  <View style={style.txtFieldView}>
                    <View style={{ flexDirection: "row" }}>
                      <MaterialCommunityIcons
                        name={"lock-outline"}
                        size={20}
                        style={style.custIcon}
                      />
                      <TextInput
                        placeholder="Password"
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        style={style.textboxfield}
                        value={values.confirmPassword}
                        secureTextEntry={!showPasswordConfirm}
                      />
                      <TouchableOpacity onPress={togglePasswordVisibilityConfirm} style={{ marginVertical: 15, alignItems: "center", marginRight: 105 }}>
                        <Text>{showPasswordConfirm ? <Feather name={"eye"} size={20} style={style.custIcon} /> :
                          <Feather name={"eye-off"} size={20} style={style.custIcon} />} </Text>
                      </TouchableOpacity>
                      {/* <Entypo name={'lock'} size={20} style={style.rightIcon} /> */}
                    </View>
                  </View>
                  {errors.password && touched.password && (
                    <Text style={style.error}>{errors.confirmPassword}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={style.logInbutton}
                  onPress={handleSubmit}
                // onPress={()=>navigation.navigate(NAVIGATION.BusinessSelection)}
                >
                  <View style={style.logInbuttonView}>
                    <Feather
                      name="arrow-right"
                      size={20}
                      style={style.logInbuttonIcon}
                    />
                  </View>
                  <Text style={[style.txtFieldTitle, { fontSize: 16 }]}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={style.thirdView}>
                <View style={style.viewforhorizontalLine}>
                  <View style={style.horizontalLine}></View>
                  <Text style={style.horizontalText}>Or</Text>
                  <View
                    style={[style.horizontalLine, { marginLeft: 10 }]}
                  ></View>
                </View>

                <TouchableOpacity
                  style={style.socialmainView}
                  onPress={hitGoogleSignUPfun}
                >
                  <View style={style.socialView}>
                    <Image
                      source={require("../../assets/ic_socialogin/google.png")}
                      style={style.socialIcon}
                    />
                    <Text style={style.socialText}>SignUp with Google</Text>
                  </View>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={style.socialmainView}
                  onPress={fblogin}
                 >
                  <View
                    style={[style.socialView, { backgroundColor: "#1877F2" }]}
                  >
                    <Image
                      source={require("../../assets/imageslog/facebook.png")}
                      style={[style.socialIcon]}
                    />
                    <Text style={[style.socialText, { color: "#FFFFFF" }]}>
                      SignUp with Facebook
                    </Text>
                  </View>
                </TouchableOpacity> */}
                {Platform.OS == "ios" ? (
                  <TouchableOpacity
                    style={style.socialmainView}
                    onPress={appleLogin}
                  >
                    <View
                      style={[style.socialView, { backgroundColor: "#000000" }]}
                    >
                      <Image
                        source={require("../../assets/imageslog/apple.png")}
                        style={[style.socialIcon, { height: 35 }]}
                      />
                      <Text style={[style.socialText, { color: "#FFFFFF" }]}>
                        Sign in with Apple
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                <View style={{ marginBottom: spacing.xl }}></View>
              </View>
            </ScrollView>
          </ImageBackground>
          <ModalLoader modalView={isFocus} />
        </SafeAreaView>
      )}
    </Formik>
  );
};
export default SignUp;
