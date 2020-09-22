
import React, { Component } from 'react'
import { Overlay } from 'react-native-elements'
import { View, Text, TouchableOpacity, Image, ImageBackground, Dimensions, ActivityIndicator, ScrollView, Animated, StyleSheet, Alert } from 'react-native'
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions'
import { FontAwesome, MaterialCommunityIcons, Ionicons, Feather, AntDesign, MaterialIcons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import firebase from 'firebase'
import * as Font from 'expo-font'
import * as ImagePicker from 'expo-image-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Avatar, SearchBar, Button, } from 'react-native-elements'
import ActivityPopup from '../ActivityPop/ActivityPopup'
import { Video } from 'expo-av'
import SendToList from '../camera/SendToList'
import { Send } from 'react-native-gifted-chat'
import DoubleTap from '../camera/DoubleTap'
import { withNavigation } from 'react-navigation'
import PlacesInput from 'react-native-places-input';
import { SafeAreaView } from 'react-native-safe-area-context'
import SendTo from '../camera/SendTo'
import TaggedList from '../camera/TaggedList'
import ListActivities from '../ActivityPop/ListActivities'
import AlbumPopup from '../ActivityPop/AlbumPopup'
import Toolbar from '../camera/Toolbar'
import { first } from 'lodash'
let interval;
import Toast from 'react-native-toast-message'

const { width, height } = Dimensions.get('window')
const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height



//Tudor
let firstPress = Number;
let finalPress = Number;
let AmEuVid = undefined;
class StreakVideoCamera extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: Camera.Constants.Type.back,
      hasPermission: null,
      pictureTaken: '',
      showPhoto: false,
      flashIcon: 'flash-off',
      locationIcon: 'location-off',
      withFlash: Camera.Constants.FlashMode.off,
      profilePicture: '',
      fontsLoaded: false,
      showAct: false,
      // onPressCamera: false,
      currentDate: Date.now(),
      cameraDoes: "photo",
      video: {},
      showVideo: false,
      openSend: false,
      settings: false,
      showListVideo: false,
      publicIcon: 'earth',
      moodOverlay: false,
      activityOverlay: false,
      tagFriendsOverlay: false,
      locationOverlay: false,
      timePostedOverlay: false,
      sendToOverlay: false,
      AlbumOverlay: false,
      moodIcon: "emoticon-kiss",
      mood: "",
      album: '',
      location: "",
      selectedActivity: "",
      taggedUsers: [],
      selectedValueHours: "",
      cameraIcon: "camera",
      ////Tudor
      initialPressTime: 0,
      PressTime: 0,
      capturing: false,
      captures: [],
      duration: 0,
      flipVideo: false,
      streakVideoDuration: 6,
      timeElapsed: 0,
      roomId: props.navigation.state.params.roomId,
      groupProfilePicture: '',
      chatRoomName: ''
    }
    this.selectAlbum = this.selectAlbum.bind(this)
    this.handleCaptureOut = this.handleCaptureOut.bind(this)
    this.handleLongCapture = this.handleLongCapture.bind(this)
  }

  getGroupProfilePicture = async() => {
    let query = await firebase.firestore().collection('messages').doc(this.state.roomId).get()
    let data = await query.data().profilePicture
    let name = await query.data().chatRoomName
    this.setState({
      groupProfilePicture: data,
      chatRoomName: name
    })
  }

  openActivityOverlay = () => {
    this.setState({
      activityOverlay: true
    })
  }



  closeActivityOverlay = () => {
    this.setState({
      activityOverlay: false
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

  _pressPublic = () => {
    if (this.state.publicIcon === 'earth') {
      this.setState({
        publicIcon: 'lock'
      })
    } else {
      this.setState({
        publicIcon: 'earth'
      })
    }
  }

  async changeLocationIcon() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)

    if (status !== 'granted') {
      console.log("nu ai permisiune bai coi")
      return;
    }
    let location = await Location.getCurrentPositionAsync({})
    let lat, long
    lat = location.coords.latitude
    long = location.coords.longitude
    console.log(lat, long)
    if (this.state.locationIcon === 'location-off')
      this.setState({ locationIcon: "location-on" })
    else
      this.setState({ locationIcon: "location-off" })
  }


  closeSwipablePanel = (foo) => {
    this.setState({ showAct: false })
    // let fasdas = this.state.documentData
    // if(typeof foo === 'undefined')
    // return;

    // fasdas.push(foo)
    // this.setState({documentData:fasdas})
    // console.log(' aklgjhakgakgjakgja kg,ajkglkaklgkalgklagkl')
  }

  openSwipeablePanel = () => {
    this.setState({
      showAct: true
    })
  }


  _getProfilePicture = async () => {
    let initialQuery = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    let documentSnapshots = await initialQuery.get()
    let documentData = documentSnapshots.data().profilePicture
    console.log(documentData)
    this.setState({
      profilePicture: documentData
    })
  }

  askPermissionAgain = () => {
    Alert.alert(
      `You need to give permission.`,
      "",
      [
        {
          text: "Cancel",
          onPress: () => console.log('nimic '),
          style: 'cancel'
        },
        {
          text: "Give permission",
          onPress: () => this.givePermission(),
          style: 'destructive'
        }
      ],
      { cancelable: false }
    )
  }

  givePermission = async () => {
    await Permissions.askAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING).then(this.componentDidMount())

  }
  componentDidMount = async () => {
    await Permissions.askAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING)
    await Font.loadAsync({
      font1: require('../../../assets/SourceSansPro-Black.ttf')
    })
    this.setState({
      fontsLoaded: true,

    })

    await this.getGroupProfilePicture()


    const { status } = await Camera.requestPermissionsAsync()
    this.setState({ hasPermission: status })
    if (this.state.hasPermission === null) {
      console.log('esti prost')
    } else if (this.state.hasPermission === false) {
      console.log('n a mers')
    }
  }


  handleCameraType = () => {
    const { type } = this.state

    this.setState({
      type:
        type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    })
  }


  takePicture = async () => {
    if (this.camera) {
      this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved })
    }
  }



  onPictureSaved = photo => {
    this.setState({
      pictureTaken: photo.uri,
      showPhoto: true
    })
    console.log(photo)

  }

  changeFlashIcon = () => {
    let arr = ['flash', 'flash-auto', 'flash-off']
    let newFlash;
    let stateFlash = ''
    if (this.state.flashIcon === 'flash') {
      this.setState({
        withFlash: Camera.Constants.FlashMode.auto
      })
      newFlash = 'flash-auto'
    } else if (this.state.flashIcon === 'flash-auto') {
      this.setState({
        withFlash: Camera.Constants.FlashMode.off
      })
      newFlash = 'flash-off'
    } else if (this.state.flashIcon === 'flash-off') {
      this.setState({
        withFlash: Camera.Constants.FlashMode.on
      })
      newFlash = 'flash'
    }
    this.setState({
      flashIcon: newFlash,
    })

  }

  pickImage = async () => {
    console.log('A intrat in pick image')
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [9, 16]
    })
    if (!result.cancelled) {
      if (result.type === 'image') {
        console.log('A intrat in image overlay')
        this.setState({
          pictureTaken: result.uri,
          capturing: false,
          captures: [result, ...this.state.captures],
          showPhoto: true,
        })
      } else {
        console.log('A intrat in video overlay ipotetic', result)

        let videores = { uri: result.uri }
        this.setState({ capturing: false, captures: [videores, ...this.state.captures] });
      }
    }



  }

  //Tudor
  manageElapsedTime = async () => {

    interval = setInterval(() => this.manageElapsedTimeFunction(), 1000)

  }
  manageElapsedTimeFunction = () => {
    this.setState(prevState => ({ timeElapsed: prevState.timeElapsed + 1 }));
    console.log(this.state.timeElapsed)
    if (this.state.timeElapsed === this.state.streakVideoDuration) {
      clearInterval(interval)
    }
  }

  handleCaptureOut = () => {
    this.camera.stopRecording();
    finalPress = Date.now()
  };



  handleLongCapture = async () => {
    //tudor
    this.setState({ capturing: true, timeElapsed: 0 })

    if (this.state.type === Camera.Constants.Type.front) {
      this.setState({ flipVideo: true })
      console.log(' FLIP', this.state.flipVideo)
    } else {
      this.setState({ flipVideo: false })
      console.log(' FLIP', this.state.flipVideo)
    }
    const videoData = await this.camera.recordAsync({ maxDuration: this.state.streakVideoDuration }).then(this.manageElapsedTime());

    videoData.shouldFlip = this.state.flipVideo
    console.log(videoData, ' asta chiar ma intereseazaaaaa')
    this.setState({ capturing: false, captures: [videoData, ...this.state.captures] });

    this.setState({
      duration: this.state.streakVideoDuration
    })
  };


  openSettings = () => {
    this.setState({
      settings: true
    })
  }

  closeSettings = () => {
    this.setState({
      settings: false
    })
  }

  renderCamera = () => {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <DoubleTap onDoubleTap={() => this.handleCameraType()}>
          <Camera mirror={false} ratio="2:1" style={{ flex: 1 }} type={this.state.type} ref={(ref) => { this.camera = ref }} flashMode={this.state.withFlash}>

            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
              {/* <TouchableOpacity
                onPress={() => this.openSettings()}
                activeOpacity={0.8}
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <Feather
                  name="settings"
                  style={{ color: "#fff", fontSize: 30 }}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <MaterialCommunityIcons
                  onPress={() => this.changeFlashIcon()}
                  name={this.state.flashIcon}
                  style={{ color: "#fff", fontSize: 30 }}
                />
              </TouchableOpacity>
              {this.state.capturing ? <Text style={{ fontSize: 40 }}>{this.state.timeElapsed}</Text> : null}
              {/* <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <MaterialIcons
                  onPress={() => this.changeLocationIcon()}
                  name={this.state.locationIcon}
                  style={{ color: "#fff", fontSize: 30 }}
                />
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Home')}
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <MaterialCommunityIcons
                  name="close"
                  style={{ color: "#fff", fontSize: 30 }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 20 }}>
              <TouchableOpacity
                onPress={() => console.log('se deschid informatiile aici')}
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <Ionicons
                  name="md-information-circle-outline"
                  style={{ color: "#fff", fontSize: 30 }}
                />
              </TouchableOpacity>
              <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' }}>
                <Toolbar
                  capturing={this.state.capturing}
                  // flashMode={flashMode}
                  // cameraType={cameraType}
                  onCaptureIn={this.handleLongCapture}
                  onCaptureOut={console.log('capture out')}
                  onLongCapture={console.log('long capture')}
                  onShortCapture={console.log('short capture')}
                /></View>
              {this.state.capturing ? (<TouchableOpacity
                style={{ alignSelf: 'flex-end', alignItems: 'center', backgroundColor: 'transparent' }}

              >
                <MaterialCommunityIcons
                  name="camera-switch"
                  style={{ color: "#7f7f7f", fontSize: 30 }}
                />
              </TouchableOpacity>) :
                (<TouchableOpacity
                  style={{ alignSelf: 'flex-end', alignItems: 'center', backgroundColor: 'transparent' }}
                  onPress={() => this.handleCameraType()}
                >
                  <MaterialCommunityIcons
                    name="camera-switch"
                    style={{ color: "#fff", fontSize: 30 }}
                  />
                </TouchableOpacity>)}
            </View>
            <Overlay isVisible={this.state.settings} animationType="slide" fullScreen>
              <ScrollView style={{ flex: 1, flexDirection: 'column' }}>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.closeSettings()}>
                      <AntDesign name="close" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log(this.state.captures)}>
                      <Text>Print shit</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              </ScrollView>
            </Overlay>
          </Camera>
        </DoubleTap>
      </SafeAreaView>)
  }

  openSendTo = () => {
    this.setState({
      openSend: true
    })
  }

  closeSendTo = () => {
    this.setState({
      openSend: false
    })
  }

  _postOnStory = () => {
    firebase.firestore().collection()
  }

  _closeOverlay = () => {
    Alert.alert(
      `Discard picture?`,
      "You can not turn back.",
      [
        {
          text: "Cancel",
          onPress: () => console.log('nimic '),
          style: 'cancel'
        },
        {
          text: "Discard",
          onPress: () => this._pressOverlay(),
          style: 'destructive'
        }
      ],
      { cancelable: false }
    )
  }

  _pressOverlay = () => {
    this.setState({ showPhoto: false, captures: [] })
  }

  sendPost = () => {

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

  closeActivityOverlayFromList = (selectedActivity) => {
    // console.log('s a transmis', selectedActivity)
    this.setState({
      selectedActivity: selectedActivity,
      activityOverlay: false,
    })

    console.log(selectedActivity, 'a mers')
  }

  closeTagFriendsProps = (taggedUsers) => {
    console.log('mama mia', taggedUsers)
    this.setState({
      taggedUsers: taggedUsers,
      tagFriendsOverlay: false
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
  sendImage = async () => {
    Alert.alert('Your video is loading')

    const path = `photos/${this.state.roomId}/${firebase.auth().currentUser.uid}`
    const response = await fetch(this.state.captures[0].uri)
    const file = await response.blob()



    let upload = firebase.storage().ref(path).put(file)
    upload.on("state_changed", snapshot => { }, err => {
      console.log(err)
    },
      async () => {
        const url = await upload.snapshot.ref.getDownloadURL()
        this.sendImageFunction(url)
        this._pressOverlay()

      })
  }

  sendImageFunction = (url) => {
    firebase.firestore().collection('streak-video').doc(this.state.roomId).collection('videos').add({
      creatorId: firebase.auth().currentUser.uid,
      shouldFlip: this.state.captures[0].shouldFlip,
      video: url,
      timestamp: Date.now(),
      timeDue: Date.now() + 86400000
    })
    firebase.firestore().collection('messages').doc(this.state.roomId).update({
      groupScore: firebase.firestore.FieldValue.increment(1)
    })
  }

  closeSendTo = () => {
    this.setState({
      sendToOverlay: false
    })
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

  selectAlbum = (cv) => {
    console.log("bine bossusle chiar s a transmis smecheria asta smr franta,", cv, "salut")
    this.setState({ album: cv })
    this.closeAlbumOverlay()
  }

  pressVideo = () => {
    this.setState({
      showListVideo: true
    })
  }


  closeVideo = () => {
    this.setState({
      showListVideo: false
    })
  }

  _closeVideoOverlay = () => {
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
          onPress: () => this._pressVideoOverlay(),
          style: 'destructive'
        }
      ],
      { cancelable: false }
    )
  }

  _pressVideoOverlay = () => {
    this.setState({
      captures: []
    })
  }

  renderVideo = () => {
    console.log('---------------------------------')
    console.log('Video ul meu la momentul actual are asa:', this.state.captures[0])
    console.log('---------------------------------')
    return (<SafeAreaView style={{flex: 1, flexDirection: 'column', backgroundColor: '#000'}}>
      <Overlay isVisible={true} overlayStyle={{backgroundColor: '#000'}}>
      <View style={{flex: 1, backgroundColor: '#000'}}>
      <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center', backgroundColor: '#000'}}>
        <TouchableOpacity onPress={() => this._closeVideoOverlay()} style={{backgroundColor: 'transparent'}}>
        <AntDesign
            name="close"
            style={{ color: "#fff", fontSize: 30 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontFamily: "font1", paddingTop: 0, color: '#fff' }}>Sending To {this.state.chatRoomName}</Text>
        <Avatar onPress={() => console.log('da')} rounded source={{ uri: this.state.groupProfilePicture }} />
      </View>
        <Video source={{ uri: this.state.captures[0].uri }} resizeMode="cover" style={{ transform: [{ scaleX: this.state.flipVideo ? -1 : 1 }, { scaleY: 1 }], width: width, height: screenHeight }} shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping />


        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 0, alignItems: 'center', backgroundColor: 'transparent', position: 'absolute', bottom: 20, right: 20}}>
               
             
                    

                      <TouchableOpacity
                        style={{alignSelf: 'flex-end'}}
                    onPress={() => this.sendImage()}
                 >
                    <MaterialCommunityIcons name="send-circle" size={48} color="#0984e3"/>

                          </TouchableOpacity> 
                          
               </View>
               </View>
    

        {/* <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 50, left: 20, right: 0, alignContent: 'center', alignItems: 'center', zIndex: 2, justifyContent: 'space-between' }}>

       
        <TouchableOpacity style={{position: 'absolute', right: 20, bottom: 20}} onPress={() => this.sendImage()}>
        <Avatar rounded size={40} source={{uri: this.state.groupProfilePicture}}/>

        </TouchableOpacity> */}

          

        {/* </View> */}


        <Overlay isVisible={this.state.moodOverlay} fullScreen animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
              <TouchableOpacity onPress={() => this.closeMoodOverlay()}>
                <AntDesign
                  size={26}
                  name="down"
                  color="#b2b8c2"
                />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Mood</Text>
              <AntDesign
                size={26}
                name="bars"
                color="#b2b8c2"
              />
            </View>
            <View style={styles.moodView}>
              <Button
                title=" Happy"
                type="clear"
                icon={<Icon name={'emoticon'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => {
                  this.setState({ mood: 'happy', moodIcon: 'emoticon' })
                  this.closeMoodOverlay()
                }}

              />
              <Button
                title=" Angry"
                type="clear"
                icon={<Icon name={'emoticon-angry'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => {
                  this.setState({ mood: 'angry', moodIcon: 'emoticon-angry' })
                  this.closeMoodOverlay()
                }}

              />
            </View>

            <View style={styles.moodView}>
              <Button
                title=" Cool"
                type="clear"
                icon={<Icon name={'emoticon-cool'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => {
                  this.setState({ mood: 'cool', moodIcon: 'emoticon-cool' })
                  this.closeMoodOverlay()
                }}

              />
              <Button
                title=" Sad"
                type="clear"
                icon={<Icon name={'emoticon-cry'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => {
                  this.setState({ mood: 'sad', moodIcon: 'emoticon-cry' })
                  this.closeMoodOverlay()
                }}

              />
            </View>

            <View style={styles.moodView}>
              <Button
                title=" Dead"
                type="clear"
                icon={<Icon name={'emoticon-dead'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => {
                  this.setState({ mood: 'dead', moodIcon: 'emoticon-dead' })
                  this.closeMoodOverlay()
                }}

              />
              <Button
                title=" Excited"
                type="clear"
                icon={<Icon name={'emoticon-excited'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => {
                  this.setState({ mood: 'excited', moodIcon: 'emoticon-excited' })
                  this.closeMoodOverlay()
                }}

              />
            </View>

            <View style={styles.moodView}>
              <Button
                title=" Flirty"
                type="clear"
                icon={<Icon name={'emoticon-kiss'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => {
                  this.setState({ mood: 'flirty', moodIcon: 'emoticon-kiss' })
                  this.closeMoodOverlay()
                }}

              />
              <Button
                title=" Ok"
                type="clear"
                icon={<Icon name={'emoticon-neutral'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => {
                  this.setState({ mood: 'ok', moodIcon: 'emoticon-neutral' })
                  this.closeMoodOverlay()
                }}

              />
            </View>
          </SafeAreaView>
        </Overlay>

        <Overlay isVisible={this.state.activityOverlay} fullScreen animationType="slide">

          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
              <TouchableOpacity onPress={() => this.closeActivityOverlay()}>
                <AntDesign
                  size={26}
                  name="down"
                  color="#b2b8c2"
                />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Activity</Text>
              <AntDesign
                size={26}
                name="bars"
                color="#b2b8c2"
              />
            </View>

            <ListActivities close={this.closeActivityOverlayFromList} />

          </SafeAreaView>
        </Overlay>

        <Overlay isVisible={this.state.tagFriendsOverlay} fullScreen animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <TaggedList close={this.closeTagFriendsProps} />
          </SafeAreaView>
        </Overlay>


        <Overlay isVisible={this.state.sendToOverlay} fullScreen animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
              <TouchableOpacity onPress={() => this.closeSendTo()}>
                <AntDesign
                  size={26}
                  name="down"
                  color="#b2b8c2"
                />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Send To</Text>
              <AntDesign
                size={26}
                name="bars"
                color="#b2b8c2"
              />
            </View>
            <SendToList duration={this.state.duration} image={''} close={() => this.closeSendTo()} closeEvery={() => this._pressOverlay()} albums={this.state.album} mood={this.state.mood} text={"nu merge"} taggedUsers={this.state.taggedUsers} activity={this.state.selectedActivity} videoFile={this.state.captures[0].uri} hoursPosted={this.state.selectedValueHours} location={this.state.location} creatorId={firebase.auth().currentUser.uid} />
          </SafeAreaView>
        </Overlay>

        <Overlay isVisible={this.state.AlbumOverlay} fullScreen animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
              <TouchableOpacity onPress={() => this.closeAlbumOverlay()}>
                <AntDesign
                  size={26}
                  name="down"
                  color="#b2b8c2"
                />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Albums</Text>
              <AntDesign
                size={26}
                name="bars"
                color="#b2b8c2"
              />
            </View>
            <AlbumPopup open={this.selectAlbum} />
          </SafeAreaView>
        </Overlay>
      </Overlay>
    </SafeAreaView>)
  }

  render() {
    if (this.state.fontsLoaded) {
      if (this.state.captures.length === 0) {
        console.log('n am poza nici video')
        return this.renderCamera()
      } else if (typeof this.state.captures[0].height === 'undefined') {
        console.log('am video')

        return this.renderVideo()
      }

    } else {
      return (<View style={{ marginVertical: 300 }}>

        <TouchableOpacity onPress={() => { this.askPermissionAgain() }} >
          <Text style={{ fontFamily: 'font1', fontSize: 15, margin: 4, alignSelf: 'center', color: '#0984e3' }}>You need to give permissions to camera!</Text>
        </TouchableOpacity>

      </View>
      )
    }
  }
}
const styles = StyleSheet.create({
  container: {
    //  position: 'relative',
    width: width,
    height: height,
    //  flex: 1
    flex: 1
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
  button: {
    marginHorizontal: 5,
    backgroundColor: '#f5f6fa',
    borderRadius: 30,
    width: 50,

  },
  bigButton: {
    marginHorizontal: 15,
    backgroundColor: '#f5f6fa',
    borderRadius: 30,
    width: width * 0.3,
    // height: height * 0.6

  },
  moodView: {
    flexDirection: "row",
    justifyContent: 'center',
    marginBottom: 10,
  }
});
export default withNavigation(StreakVideoCamera)