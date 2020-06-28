import React, {Component, createRef} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import firebase from 'firebase'
import { Video } from 'expo-av';
let arr = []
let CurrentSlide = 0;
let IntervalTime = 400;
const { width, height } = Dimensions.get('window')

export default class Slider extends Component {
  flatList = createRef();

  constructor(props){
    super(props)
    this.state = {
      chatRoomName: this.props.chatRoomName,
      link: [
        'https://image.shutterstock.com/image-vector/online-exam-computer-web-app-260nw-1105800884.jpg',
        'https://image.shutterstock.com/image-vector/online-exam-computer-web-app-260nw-1105800884.jpg',
      //   'https://picsum.photos/200/300',
        'https://image.shutterstock.com/image-vector/online-exam-computer-web-app-260nw-1105800884.jpg',
        'https://image.shutterstock.com/image-vector/online-exam-computer-web-app-260nw-1105800884.jpg',
        'https://image.shutterstock.com/image-vector/online-exam-computer-web-app-260nw-1105800884.jpg',
        'https://image.shutterstock.com/image-vector/online-exam-computer-web-app-260nw-1105800884.jpg',
      
      ],
      allStreaks: [],
      index: 0
    }
  }

  
  getStreakFromChatRoomId = async() => {
    let initialQuery = await firebase.firestore().collection('messages').doc(this.state.chatRoomName)
    let documentSnapshots = await initialQuery.get()
    let documentData = await documentSnapshots.data().streakVideo
    // console.log(arr)
    for(let i = 0; i < documentData.length; i++){
      arr.push(documentData[i].video)
    }
    this.setState({
        allStreaks: arr
    })
    console.log('streakuri am', this.state.allStreaks)
}



  componentDidMount() {
    arr = []
    this.getStreakFromChatRoomId()
    // this._stopAutoPlay();
      // this._startAutoPlay();
    // clearInterval()
  }

  // componentWillUnmount() {
  //   this._stopAutoPlay();
  // }

  _onPlaybackStatusUpdate = playbackStatus => {
    if (playbackStatus.didJustFinish)
      this.scrollToIndex()
    };

  // 
 

  scrollToIndex = () => {
    // if(this.state.index)
    this.setState({
      index: this.state.index + 1
    })
    this.flatListRef.scrollToIndex({animated: true, index: index});
  }

  render() {
    return (
      <View style={{marginTop: 10, marginBottom: 10}}>
        <FlatList
          horizontal
        data={this.state.allStreaks}
          style={{ flex: 1 }}
          ref={(ref) => { this.flatListRef = ref; }}
          keyExtractor={item => item}
          getItemLayout={this.getItemLayout}
          initialNumToRender={2}
          renderItem={({ item, index}) => (
            <Video onPlaybackStatusUpdate=
    {(playbackStatus) => this._onPlaybackStatusUpdate(playbackStatus)} source={{uri: item}} resizeMode="cover" style={{ width: width - 20, height: 200, borderRadius: 20 }} shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping/>
 
            )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sliderItems: {
    marginLeft: 5,
    marginRight: 5,
    height: 200,
    width: Dimensions.get('window').width,
  },
});