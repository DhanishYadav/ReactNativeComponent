import { Platform, StyleSheet } from 'react-native';
import { spacing } from '@/theme';
import { OpenSans } from '@/assets/fontsFamily';
import { font } from '@/theme/font';



export const style = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F5F5F5'
    },
    firstView: {
        // flex: 1,
        // backgroundColor: 'pink'
    },
    iconrightChevron: { marginTop: spacing.l, marginLeft: spacing.m, tintColor: '#195090' },
    wlcTextView: {
        alignItems: 'center',
        marginTop: spacing.l
    },
    wlcText: {
        color: '#195190',
        fontSize: 30,
        fontWeight: '700',
        fontFamily:font.bold
        
    },
    wlcsubtitleText: {
        color: '#A2A2A1',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: font.bold
    },

    secView: {
        // flex: 1,
        // backgroundColor: 'red',
        marginTop: spacing.l,
        // marginLeft:spacing.xl,
    },
    txtFieldTitle: {
        color: '#041B3E',
        fontSize: 14,
        fontWeight: "600",
        fontFamily:font.bold
    },
    textboxfield:{
       // fontFamily:font.bold,
        fontWeight:'600',
        width:'67%',
       
    },
    forgotPass:{
        marginTop: spacing.s, textAlign: 'center',
        // fontWeight:'700',
        fontFamily:font.bold,
        color: '#041B3E',
        fontSize: 14,
    },
    loginButton:{ 
    // fontWeight: '700', 
    fontSize: 20, 
    color: '#041B3E', 
    textAlign: 'center',
    fontFamily:font.bold
},
    txtFieldView: {
        borderRadius: 8,
        borderColor: '#D5DBE4',
        borderWidth: 1
    },
    custIcon: {
        padding: 15,
        color: '#041B3E'
    },
    rightIcon: {
        padding: 15,
        color: '#26A059',
        justifyContent: 'flex-end'
    },
    logInbutton: { alignItems: 'center', marginTop: spacing.xl },
    logInbuttonView: { backgroundColor: '#195190', height: 55, width: 55, borderRadius: 55 },
    logInbuttonIcon: { color: '#FFFFFF', alignSelf: 'center', margin: 17 },
    logbtn: {
        backgroundColor: '#195190',
        alignSelf: 'center',
        height: 60,
        width: 60,
        borderRadius: 30,
        padding: 20,
        marginTop: 25,
    },
    thirdView: {
        flex: 1,
        // backgroundColor: 'yellow',
    },
    viewforhorizontalLine: {
        // marginHorizontal:20,
        flexDirection: 'row',
        marginTop: spacing.l,
        alignSelf: 'center',

    },
    horizontalText: {
        color: '#8D8D8D',
        fontSize: 16,
        marginLeft: 10,
        fontWeight:'700',
        fontFamily: font.bold

    },
    error: {
        color: 'red',
        fontFamily:font.bold
    },
    horizontalLine: { backgroundColor: '#8D8D8D69', height: 1, width: 100, marginTop: 10 },
    socialmainView: { marginHorizontal: 20, marginTop: spacing.s },
    socialView: { borderColor: '#DADADA', borderRadius: 10, borderWidth: 2, flexDirection: 'row', padding: 10 },
    socialIcon: {
        height: 33,
        width: 33
    },
    socialText: {
        color: '#041B3E',
        fontSize: 16,
        // fontWeight: '700',
        marginLeft: spacing.s,
        marginTop: 5,
        fontFamily:font.bold
    }
});
