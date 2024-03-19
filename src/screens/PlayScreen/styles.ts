import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  playScreen: {
    // backgroundColor: 'linear-gradient(45deg, black, transparent)',
    backgroundColor: '#212121',
    height: '100%',
    color: '#eee',
  },
  headerArea: {
    height: 40,
  },
  graphArea: {
    height: '40%',
    // backgroundColor: 'red',
  },
  infoArea: {
    marginTop: 40,
    marginBottom: 40,
  },
  mainTitle: {
    color: '#eee',
    textAlign: 'center',
    fontSize: 16,
  },
  subTitle: {
    textAlign: 'center',
    color: '#A3A5B2',
    fontSize: 14,
  },
  controlArea: {
    // paddingLeft: 24,
    // paddingRight: 24,
  },
  progressBarArea: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 40,
    paddingLeft: 24,
    paddingRight: 24,
  },
  controlBtnArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor:'red',
    paddingLeft: 14,
    paddingRight: 14,
  },
});
