import React, { useEffect, useState } from "react";
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
import { style } from "./SignIn.styles";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { spacing } from "@/theme";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { NAVIGATION } from "@/constants";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { hitgoogleLogin, login } from "@/actions/UserActions";
import { googleSign, appleLogin } from "../SocialLogIn/googleLogin";
import { onFacebookButtonPress, fblogin } from "../SocialLogIn/facebookLogin";
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { ModalLoader } from "@/components/ModalLoader";

const SignIn = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isFocus, setIsFocus] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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

  const LoginApi = (values) => {
    setIsFocus(true);
    let data = {
      email: values.email,
      password: values.password,
    };
    dispatch(login(data, navigation, setIsFocus));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const callGooglefun = async () => {
    setIsFocus(true);
    // googleSign();
    // dispatch(hitgoogleLogin())
    // const googleSign = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      GoogleSignin.configure();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();

      let data = {
        email: userInfo?.user?.email,
        // email:"animeshm@observancegroup.com",
        familyName: userInfo?.user?.familyName,
        givenName: userInfo?.user?.givenName,
        id: userInfo?.user?.id,
        name: userInfo?.user?.name,
        photo: userInfo?.user?.photo,
      };

      dispatch(hitgoogleLogin(data, navigation, setIsFocus));
      // alert(JSON.stringify(userInfo?.user))
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
    }
    // }
  };

  const SigninSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Enter registered Email Address."),
    // password: Yup.string().required('Enter Password.')
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      // onSubmit={(values) =>
      onSubmit={(values, { }) => {
        LoginApi(values);
        setTimeout(() => {
          // resetForm();
        }, 1000);
      }}
      validationSchema={SigninSchema}
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
                  <Text style={style.wlcText}>Welcome Back</Text>
                  <Text style={style.wlcsubtitleText}>Sign in to Continue</Text>
                </View>
              </View>
              <View style={style.secView}>
                {/* <Text>Helloo</Text> */}
                <View style={{ marginHorizontal: 20 }}>
                  <Text style={style.txtFieldTitle}>Email Address</Text>
                  <View style={style.txtFieldView}>
                    <View style={{ flexDirection: "row" }}>
                      <Feather name={"mail"} size={20} style={style.custIcon} />
                      <TextInput
                        placeholder="Registered Email Address"
                        style={style.textboxfield}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        maxLength={50}
                      />
                    </View>
                  </View>
                  {errors.email && touched.email && (
                    <Text style={style.error}>{errors.email}</Text>
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
                      <TouchableOpacity onPress={togglePasswordVisibility} style={{ marginVertical: 15, alignItems: "center", marginHorizontal: 15 }}>
                        <Text>{showPassword ? <Feather name={"eye"} size={20} style={style.custIcon} /> :
                          <Feather name={"eye-off"} size={20} style={style.custIcon} />} </Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                  {errors.password && touched.password && (
                    <Text style={style.error}>{errors.password}</Text>
                  )}

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(NAVIGATION.forgotpassword)
                    }
                  >
                    <Text style={style.forgotPass}>Forgot Password ?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={style.logbtn}
                    // onPress={() => navigation.navigate(NAVIGATION.signup)}
                    onPress={handleSubmit}
                  >
                    <AntDesign size={20} name="login" color="white" />
                  </TouchableOpacity>
                  <Text style={style.loginButton}>Log In</Text>
                </View>
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
                  onPress={callGooglefun}
                >
                  <View style={style.socialView}>
                    <Image
                      source={require("../../assets/ic_socialogin/google.png")}
                      style={style.socialIcon}
                    />
                    <Text style={style.socialText}>Log in with Google</Text>
                  </View>
                </TouchableOpacity>
                {/* <TouchableOpacity style={style.socialmainView} onPress={fblogin}>
                                    <View style={[style.socialView, { backgroundColor: '#1877F2' }]}>
                                        <Image source={require('../../assets/imageslog/facebook.png')} style={[style.socialIcon,]} />
                                        <Text style={[style.socialText, { color: '#FFFFFF' }]}>Log in with Facebook</Text>
                                    </View>
                                </TouchableOpacity> */}
                {/* 
                                {Platform.OS == 'ios' ? <TouchableOpacity style={style.socialmainView} onPress={appleLogin}>
                                    <View style={[style.socialView, { backgroundColor: '#000000' }]}>
                                        <Image source={require('../../assets/imageslog/apple.png')} style={[style.socialIcon, { height: 35 }]} />
                                        <Text style={[style.socialText, { color: '#FFFFFF' }]}>Sign in with Apple</Text>
                                    </View>
                                </TouchableOpacity> : null} */}
                <View style={{ marginBottom: spacing.xl }}></View>
              </View>
            </ScrollView>
            <ModalLoader modalView={isFocus} />
          </ImageBackground>
        </SafeAreaView>
      )}
    </Formik>
  );
};
export default SignIn;
