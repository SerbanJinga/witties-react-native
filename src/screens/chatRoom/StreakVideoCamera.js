
import React, { Component } from 'react'
import { Overlay } from 'react-native-elements'
import { View, Text, TouchableOpacity, SafeAreaView, ImageBackground, Dimensions, ActivityIndicator, ScrollView, Animated, StyleSheet, Alert } from 'react-native'
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions'
import { MaterialIcons, MaterialCommunityIcons, Ionicons, Feather, AntDesign } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'
import * as Font from 'expo-font'
import * as ImagePicker from 'expo-image-picker'
import { Avatar, SearchBar, Button } from 'react-native-elements'
import ActivityPopup from '../ActivityPop/ActivityPopup'
import { Video } from 'expo-av'
// import SendToList from './SendToList'
import { Send } from 'react-native-gifted-chat'
import DoubleTap from '../camera/DoubleTap'
import VideoPlayer from 'expo-video-player'
import { withNavigation } from 'react-navigation'
import { result } from 'lodash'
const screenHeight = Dimensions.get('screen').height
import ListActivities from '../ActivityPop/ListActivities'
import TaggedList from '../camera/TaggedList'
import PlacesInput from 'react-native-places-input';
import AlbumPopup from '../ActivityPop/AlbumPopup'
import SendToList from '../camera/SendToList'
const { width, height } = Dimensions.get('window')
class StreakVideoCamera extends Component{
    constructor(props){
        super(props)
        this.state = {
            settings: false,
            type : Camera.Constants.Type.back,
            flashIcon: 'flash-off',
            withFlash: Camera.Constants.FlashMode.off,
            showPhoto: false,
            pictureTaken: result.uri,
            videoIcon: 'record-circle-outline',
            video: '',
            roomId: props.navigation.state.params.roomId,
            imageUri: '',
            moodIcon: "emoticon-kiss",
            publicIcon: 'earth',
            moodOverlay: false,
            mood: '',
            activityOverlay: false,
            sendToOverlay: false,
            tagFriendsOverlay: false,
            locationOverlay: false,
            AlbumOverlay: false,
            timePostedOverlay: false
          }
    }

    openAlbumOverlay = () => {
      console.log("sa deschis cevabasdjdaskdk")
      this.setState({
        AlbumOverlay: true
      })
    }
  
    closeAlbumOverlay = () => {
      this.setState({
        AlbumOverlay: false
      })
    }

    openTimeOverlay = () => {
      this.setState({
        timePostedOverlay: true
      })
    }
  
  
    closeTimeOverlay = () => {
      this.setState({
        timePostedOverlay: false
      })
    }

    
  openTagFriends = () => {
    this.setState({
      tagFriendsOverlay: true
    })
  }

  closeTagFriends = () => {
    this.setState({
      tagFriendsOverlay: false
    })
  }

    openMoodOverlay = () => {
      this.setState({
        moodOverlay: true
      })
    }

    closeMoodOverlay = () => {
      this.setState({
        moodOverlay: false
      })
    }


    openActivityOverlay = () => {
      this.setState({
        activityOverlay: true
      })
    }

    openLocationOverlay = () => {
      this.setState({
        locationOverlay: true
      })
    }
  
  
    closeLocationOverlay = () => {
      this.setState({
        locationOverlay: false
      })
    }
  
  
  
    closeActivityOverlay = () => {
      this.setState({
        activityOverlay: false
      })
    }
    changeFlashIcon = () => {
        let arr = ['flash', 'flash-auto', 'flash-off']
        let newFlash;
        let stateFlash = ''
        if(this.state.flashIcon === 'flash'){
          this.setState({
            withFlash: Camera.Constants.FlashMode.auto 
          })
          newFlash = 'flash-auto'
        }else if(this.state.flashIcon === 'flash-auto'){
          this.setState({
            withFlash: Camera.Constants.FlashMode.off
          })
          newFlash = 'flash-off'
        }else if(this.state.flashIcon === 'flash-off'){
          this.setState({
            withFlash: Camera.Constants.FlashMode.on
          })
          newFlash = 'flash'
        }
        this.setState({
          flashIcon: newFlash,
        })
      
      }

      pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3]
        })
        if(!result.cancelled){
          this.setState({
            pictureTaken: result.uri,
            showPhoto: true
          })
        }
      
       
      
      }

      startVideo = async() => {
        this.setState({
          videoIcon: 'record-player'
        })
        console.log('s a pornit filmarea')
        let video = await this.camera.recordAsync()
        this.setState({
          video: video.uri
        })
        console.log(this.state.video)
      }

      stopVideo = () => {
        this.setState({
          videoIcon: 'record-circle-outline'
        })
        console.log('s a oprit filmarea')
        this.camera.stopRecording()
      }

    renderCamera = () => {
        return(
          <View style={{flex: 1}}>
          <DoubleTap onDoubleTap={() => this.handleCameraType()}>
              <Camera ratio={'16: 9'} style={{ flex: 1 }} type={this.state.type} ref={(ref) => { this.camera = ref}} flashMode={this.state.withFlash}>
      
          <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', margin: 20}}>   
          <TouchableOpacity
            onPress={() => this.openSettings()}
            activeOpacity={0.8}
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',                  
            }}>
            <Feather
                name="settings"
                style={{ color: "#fff", fontSize: 30}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',                  
            }}>
             <MaterialCommunityIcons
                onPress={() => this.changeFlashIcon()}
                name={this.state.flashIcon}
                style={{ color: "#fff", fontSize: 30}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack(null)}
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',                  
            }}>
             <MaterialCommunityIcons
                name="close"
                style={{ color: "#fff", fontSize: 30}}
            />
          </TouchableOpacity>
          </View>
          <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:20}}>
          <TouchableOpacity
            onPress={() => this.pickImage()}
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',                  
            }}>
            <Ionicons
                name="ios-photos"
                style={{ color: "#fff", fontSize: 30}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={this.startVideo}
            // onLongPress={() => console.log('apas lung')}
            onPressOut={this.stopVideo}
            // onPress={this.takePicture}
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}>
            <MaterialCommunityIcons
                name={this.state.videoIcon}
                style={{ color: "#fff", fontSize: 36}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}
            onPress={()=>this.handleCameraType()}
      
            >
            <MaterialCommunityIcons
                name="camera-switch"
                style={{ color: "#fff", fontSize: 30}}
            />
          </TouchableOpacity>
        </View>
        <Overlay isVisible={this.state.settings} animationType="slide" fullScreen>
        <ScrollView style={{flex: 1, flexDirection: 'column'}}>
      
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>  
                  <TouchableOpacity onPress={() => this.closeSettings()}>
                  <AntDesign name="close" size={20}/>
              </TouchableOpacity>
          
      
             </View>
             </View>
             </ScrollView>
        </Overlay>
        </Camera>
        </DoubleTap>
        </View>)
      }


      closeVideo = () => {
        Alert.alert(
          `Discard video?`,
          "You can not turn back.",
          [
            {
              text: "Cancel",
              onPress: () => console.log('nimic '),
              style: 'cancel'
            },
            {
              text: "Discard",
              onPress: () => this.props.navigation.goBack(null),
              style: 'destructive'
            }
          ],
          { cancelable: false }
        )
      }
      
    handleCameraType=()=>{
        const { type } = this.state
    
        this.setState({type:
          type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
        })
      }

      pressVideo = async() => {
        const timestamp = firebase.auth().currentUser.uid + "/" + Date.now()
        const path = `videos/${timestamp}`
        const response = await fetch(this.state.video)
        const file = await response.blob()

        let upload = firebase.storage().ref(path).put(file)
        upload.on("state_changed", snapshot => {}, err => {

        }, 
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL()
          this.setState({imageUri: url})
          this.sendVideo()
        })

        console.log(this.state.roomId)
      }

      sendVideo = () => {
        // this.pressVideo()
        let foo = {
          video: this.state.imageUri,
          sender: firebase.auth().currentUser.uid
        }
        firebase.firestore().collection('messages').doc(this.state.roomId).update({
            streakVideo: firebase.firestore.FieldValue.arrayUnion(foo)
        })
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
          sentStreakVideo: true
        })
      }

      closeTagFriendsProps = (taggedUsers) => {
        console.log('mama mia', taggedUsers)
        this.setState({
          taggedUsers: taggedUsers,
          tagFriendsOverlay: false
        })
      }

      sendStreak = async () => {
        let foo = {
          video: this.state.imageUri,
          sender: firebase.auth().currentUser.uid,
          timestamp: Date.now()
        }
      await firebase.firestore().collection('messages').doc(this.state.roomId).update({
        streakVideo: firebase.firestore.FieldValue.arrayUnion(foo)
      }).then(() => this.props.navigation.navigate('Home'))

      }

renderVideo = () => {
  return(
    <View>
    <Overlay isVisible={this.state.video !== ''}>
 
 <Video source={{uri: this.state.video}} resizeMode="cover" style={{width: width, height: screenHeight}} shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping/>
      
 <TouchableOpacity
                onPress={() => this.closeVideo()}
              style={{backgroundColor: 'transparent',position:'absolute',top:50,left:20}}>
              <AntDesign
                  name="close"
                  style={{ color: "#fff", fontSize: 30}}
              />
            </TouchableOpacity> 
              
            <TouchableOpacity style={{backgroundColor: 'transparent',position:'absolute',top:400,right:20}} onPress={() => this.pressVideo()}>
            <Ionicons name="ios-send" style={{color: '#fff', fontSize: 30}} />

            </TouchableOpacity>


    </Overlay>
    </View>
  )
}

    render(){
       if(this.state.video === '')
        return this.renderCamera()
      else
        return this.renderVideo()
      }
}


const styles = StyleSheet.create({
  container: {
  //  position: 'relative',
   width: width,
   height: height,
  //  flex: 1
  },
  video: {
   position: 'absolute',
  //  top: 0,
  //  right: 0,
  //  left: 0,
  //  bottom: 0,
   zIndex: 1,
   height: height,
   width: width + 20,
    left: -10,
    // right: 0
  },
  button: {
    position: 'absolute',
    zIndex: 2,
  },
  moodView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10
  },
  bigButton: {
    marginHorizontal: 15,
    backgroundColor: '#f5f6fa',
    borderRadius: 30,
    width: width * 0.3,
    // height: height * 0.6

  },
});
export default withNavigation(StreakVideoCamera)