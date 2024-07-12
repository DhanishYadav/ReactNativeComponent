import { spacing } from '@/theme';
import { font } from '@/theme/font';
import { StyleSheet } from 'react-native';


export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  firstView: {
    flex: 1,
    // backgroundColor: 'green'
  },
  custIcon: {
    padding: 15,
    color: "#195090",
  },
  headerTitle: {
    color: "#041B3E",
    fontWeight: "500",
    paddingHorizontal: 10,
    // paddingTop:20,
    fontSize: 16,
  },
  headerTitleJob: {
    color: "#fff",
    fontWeight: "500",
    paddingHorizontal: 10,
    // paddingTop:20,
    fontSize: 16,
  },
  headerTitle2: {
    color: "gray",
    paddingHorizontal: 10,
    fontSize: 15,
  },
  secView: {
    marginHorizontal: 15
  },
  secView2: {
    marginHorizontal: 15
  },
  nameview: {
    marginVertical: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,

    backgroundColor: 'white',
    // zIndex: 99,
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    marginHorizontal: 15,
    borderRadius: 9,
    justifyContent:"space-evenly"
  },
  flatlist: {
    width: '100%',


  },



});
