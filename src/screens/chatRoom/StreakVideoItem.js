import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Video } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Feather } from '@expo/vector-icons'
import { Avatar } from 'react-native-elements'
const { height, width } = Dimensions.get('screen');
import firebase from 'firebase'
const cellHeight = height * 0.6;
const cellWidth = width;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

class StreakVideoItem extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      profilePicture: '',
      displayName: '',
      timestamp: this.props.timestamp
    }
  }
  componentDidMount = async () => {
    console.log('intra aici a a a a')
    await this.retrieveProfilePicture()
  }

  componentWillUnmount() {
    if (this.video) {
      this.video.unloadAsync()
    }
  }

  _renderTimestamps = (timestamp) => {
    let date = new Date(timestamp * 1000)
    let hours = date.getHours()
    let minutes = "0" + date.getMinutes()
    let seconds = "0" + date.getSeconds()

    let formattedTime = hours + ":" + minutes.substr(-2) + ':' + seconds.substr(-2)
    return formattedTime
  }

  retrieveProfilePicture = async () => {
    console.log('intra si aici aparent')
    const { creatorId } = this.props
    let query = await firebase.firestore().collection('users').doc(creatorId).get()
    let data = await query.data().profilePicture
    let name = await query.data().displayName
    this.setState({
      profilePicture: data,
      displayName: name,
    })
  }

  toMinutes = (timestamp) => {
    let minutes = Math.round(timestamp / 60000)
    if (minutes < -60)
      return + Math.floor(Math.abs(minutes) / 60) + " h " + Math.abs(minutes) % 60 + ' m ago'
    if (minutes >= -60)
      return Math.abs(minutes) + ' m ago'
  }

  async play() {
    const status = await this.video.getStatusAsync()
    if (status.isPlaying) {
      return
    }
    return this.video.playAsync()
  }

  pause() {
    if (this.video) {
      this.video.stopAsync()
    }
  }
  render() {
    const { id, poster, video, shouldFlip } = this.props;

    return (
      <SafeAreaView style={styles.cell}>
        <Video
          ref={(ref) => {
            this.video = ref;
          }}
          source={{ uri: video }}
          shouldPlay={false}
          isMuted={false}
          resizeMode="cover"
          style={[styles.full, { transform: [{ scaleX: shouldFlip ? -1 : 1 }, { scaleY: 1 }] }]}
        />
        {/* <View style={{padding: 10, flex: 0, flexDirection: 'row', justifyContent: 'flex-start', bottom: 50, top: 5, zIndex: 2 }}>
        <TouchableOpacity
            >
          </TouchableOpacity>
          <View style={{flexDirection: 'column', alignSelf: 'flex-start'}}>
          <Text style={{fontSize: 15, color: '#fff'}}>{this.state.displayName}</Text>
          <Text style={{fontSize: 15, color: '#fff'}}>{this.state.timestamp}</Text>
          </View>
          
          <TouchableOpacity
          style={{justifyContent: 'flex-end', alignSelf: 'flex-end'}}
            onPress={() => this.props.close()}>
            <AntDesign
              name="close"
              style={{ color: "#fff", fontSize: 30 }}
            />
          </TouchableOpacity>
          
          </View> */}


        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 10, paddingRight: 10, paddingBottom: 10, }}>
          <Avatar size={40} rounded source={{ uri: this.state.profilePicture }} />


          <Text style={{ fontSize: 16, color: '#fff', fontFamily: "font1", paddingTop: 5, marginRight: 'auto', marginLeft: 10 }}>{this.state.displayName + " " + this.toMinutes(this.state.timestamp - Date.now())}</Text>

          <TouchableOpacity
            onPress={() => this.props.close()}
            style={{
              backgroundColor: 'transparent',
              margin: 4,
              marginRight: 20,
            }}>
            <AntDesign
              name="close"
              style={{ fontSize: 26, fontWeight: "bold", color: '#fff' }}
            />
          </TouchableOpacity>






        </View>

      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cell: {
    width: width,
    height: height,
    backgroundColor: '#eee',
    // borderRadius: 20,
    flex: 1,
    overflow: 'hidden',
    // margin: 10,

  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 40,
  },
  full: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  poster: {
    resizeMode: 'cover',
  },
  overlayText: {
    color: '#fff',
  },
});

export default StreakVideoItem