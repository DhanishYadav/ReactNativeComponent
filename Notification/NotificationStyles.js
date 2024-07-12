import { StyleSheet } from 'react-native';
import { spacing } from '@/theme';
import { font } from '@/theme/font';
export const styles = StyleSheet.create({
  leadContainer: {
    backgroundColor: '#E2F3FF',
    padding: 16,
    marginVertical: 16,
    borderRadius: 30,
  },
  container: {
    paddingHorizontal: 15,
  },
  jobtime: {
    marginLeft: 'auto',
    marginRight: 10,
    fontStyle: font.regular,
  },
  status: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 30,
    marginLeft: 'auto',
    color: 'black',
    fontSize: 16,

    fontStyle: font.regular,
  },
  jobContainer: {
    backgroundColor: '#F2F4F6',
    padding: 16,
    marginVertical: 16,
    borderRadius: 30,
  },
  takeAction: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    color: 'white',
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
  },
  iconrightChevron: {
    marginTop: 6,
    marginBottom: 'auto',
    marginLeft: spacing.m,
    tintColor: '#195090',
  },
  actionText: {
    textAlignVertical: 'center',
    marginLeft: 8,
    fontSize: 15,
    fontFamily:font.regular,
  },
  viewheader: {
    marginTop: 15,
    paddingBottom: 10,
    height: 150,
  },
  headertext: {
    color: 'black',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 15,
    fontFamily: font.regular,
  },
  flatlist: {
    marginTop: -110,
    marginBottom: 180,
  },
  image: {
    marginTop: 'auto',
    marginLeft: 10,
    marginRight: 10,
  },
  time: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    textAlignVertical: 'center',
    borderRadius: 50,
    fontSize: 14,
    color: '#757588',

    fontFamily: font.regular,
  },
  checkicon: {
    backgroundColor: '#195090',
    padding: 5,
    borderRadius: 70,
  },
  dateText: {
    color: 'black',
    marginVertical: 15,
    marginLeft: 15,
    fontSize: 16,
    fontFamily: font.regular,
  },
  itemInfo: {
    fontSize: 14,
    padding: 10,
    marginTop: 'auto',
    color: '#041B3E',
    fontFamily: font.regular,
  },
  itemContainer: {
    padding: 8,
    marginBottom: 8,
  },
  itemContent: {
    flexDirection: 'column',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    fontStyle: font.regular,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    fontStyle: font.regular,
  },
  businessheading: {
    fontSize: 12,
    position: 'absolute',
    color: 'white',
    top: -35,
    left: 10,
    paddingHorizontal: 14,
    backgroundColor: '#195090',
    paddingVertical: 5,
    borderRadius: 50,
    fontStyle: font.regular,
  },
  textcontainer: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingVertical: 5,
  },
  text: {
    color: '#041B3E',
    textAlignVertical: 'center',
    marginLeft: 10,
    fontSize: 16,
    fontFamily: font.regular,
  },
  icon: {
    marginBottom: 'auto',
    marginTop: 'auto',
    height: 22,
    width: 22,
    marginLeft: 10,
  },
  icon1: {
    marginLeft: 10,
  },
  dotsicon: {
    position: 'absolute',
    right: 0,
    top: 10,
  },
});
