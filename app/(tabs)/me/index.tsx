import { StyleSheet, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MeScreen() {
  return (
    <SafeAreaView style={{ backgroundColor: '#212121', height: '100%' }}>
      <View style={styles.header}>
        <View style={styles.avatorArea}>
          <Image
            style={styles.avator}
            source={require('@/assets/images/icon.png')}
          />
        </View>
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.userInfo_text}>Jay Hu</Text>
            <Text style={styles.userInfo_bio_text}>
              Love life, love coding...
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={{ textAlign: 'center' }}>Coming Soon...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    height: 96,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  avatorArea: {
    width: 64,
  },
  avator: {
    height: 64,
    width: 64,
    borderRadius: 32,
  },
  userInfo: {
    flex: 1,
    paddingLeft: 8,
    paddingTop: 8,
  },
  userInfo_text: {
    color: '#000000',
    fontSize: 20,
  },
  userInfo_bio_text: {
    color: 'gray',
    fontSize: 14,
  },
});
