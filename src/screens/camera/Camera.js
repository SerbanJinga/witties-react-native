
import React, { Component } from 'react'
import { Overlay } from 'react-native-elements'
import { View, Text, TouchableOpacity, Image, ImageBackground, Dimensions, ActivityIndicator, ScrollView, Animated, StyleSheet, Alert, Platform } from 'react-native'
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions'
import { FontAwesome, MaterialCommunityIcons, Ionicons, Feather, AntDesign, MaterialIcons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import firebase from 'firebase'
import * as Font from 'expo-font'
import * as ImagePicker from 'expo-image-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Toolbar from './Toolbar'
import { Avatar, SearchBar, Button, } from 'react-native-elements'
import ActivityPopup from '../ActivityPop/ActivityPopup'
import { Video } from 'expo-av'
import SendToList from './SendToList'
import { Send } from 'react-native-gifted-chat'
import DoubleTap from './DoubleTap'
import { withNavigationFocus } from 'react-navigation'
import PlacesInput from 'react-native-places-input';
import { SafeAreaView } from 'react-native-safe-area-context'
import SendTo from './SendTo'
import TaggedList from './TaggedList'
import ListActivities from '../ActivityPop/ListActivities'
import AlbumPopup from '../ActivityPop/AlbumPopup'
import { first } from 'lodash'
const { width, height } = Dimensions.get('window')
const screenRatio = height / width
const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height

import * as ImageManipulator from 'expo-image-manipulator'

let lastTap = null
//Tudor
let firstPress = Number;
let finalPress = Number;
let AmEuVid = undefined;
class CameraScreen extends Component {
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
      cameraRatio: '2:1',
      imagePadding: 0
    }
    this.selectAlbum = this.selectAlbum.bind(this)
    this.handleCaptureIn = this.handleCaptureIn.bind(this)
    this.handleCaptureOut = this.handleCaptureOut.bind(this)
    this.handleShortCapture = this.handleShortCapture.bind(this)
    this.handleLongCapture = this.handleLongCapture.bind(this)
  }

  prepareRatio = async () => {
    console.log('prepara baiatu')
    let desiredRatio = '4:3'
    if (Platform.OS === 'android') {

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(':');
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio;
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }

      desiredRatio = minDistance

      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      // set the preview padding and preview ratio
      // setImagePadding(remainder / 2);
      this.setState({
        cameraRatio: desiredRatio,
        imagePadding: remainder / 2
      })
    }
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



    console.log(this.props.isFocused)
    await Permissions.askAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING)
    await Font.loadAsync({
      font1: require('../../../assets/SourceSansPro-Black.ttf')
    })
    this.setState({
      fontsLoaded: true,

    })


    const { status } = await Camera.requestPermissionsAsync()
    this.setState({ hasPermission: status })
    if (this.state.hasPermission === null) {
      console.log('esti prost')
    } else if (this.state.hasPermission === false) {
      console.log('n a mers')
    }


    console.log('coaie coaie coaie coaie')


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
        this.setState({ flipVideo: false, capturing: false, captures: [videores, ...this.state.captures] });
      }
    }



  }

  //Tudor
  handleCaptureIn = () => {

    this.props.stopScroll()
    this.setState({ capturing: true })
    firstPress = Date.now()

  };

  handleCaptureOut = () => {
    if (this.state.capturing)
      this.camera.stopRecording();
    finalPress = Date.now()
    this.props.resumeScroll()
  };

  handleShortCapture = async () => {
    this.props.stopScroll()
    console.log("picture")
    const photoData = await this.camera.takePictureAsync({ quality: 0.4 });
    if (this.state.type === Camera.Constants.Type.front) {
      const result = await ImageManipulator.manipulateAsync(
        photoData.uri, [{ rotate: 0 }, { flip: ImageManipulator.FlipType.Horizontal }],
        { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG }
      )
      this.setState({ pictureTaken: result.uri, capturing: false, captures: [result, ...this.state.captures], showPhoto: true })

    } else {
      // const result = await ImageManipulator.manipulateAsync(
      //   photoData.uri, [{ rotate: 0 }],
      //   { compress: 0.1, format: ImageManipulator.SaveFormat.PNG })
      this.setState({ pictureTaken: photoData.uri, capturing: false, captures: [photoData, ...this.state.captures], showPhoto: true })

    }
    this.props.resumeScroll()
  };

  handleLongCapture = async () => {
    //tudor
    if (this.state.type === Camera.Constants.Type.front) {
      this.setState({ flipVideo: true })
      console.log(' FLIP', this.state.flipVideo)
    } else {
      this.setState({ flipVideo: false })
      console.log(' FLIP', this.state.flipVideo)
    }
    const videoData = await this.camera.recordAsync({ quality: Camera.Constants.VideoQuality['480p'] });
    videoData.shouldFlip = this.state.flipVideo
    console.log(videoData, ' asta chiar ma intereseazaaaaa')
    this.setState({ capturing: false, captures: [videoData, ...this.state.captures] });
    console.log("video, duration is", (finalPress - firstPress), 's')
    this.setState({
      duration: finalPress - firstPress
    })
    this.props.resumeScroll()
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

  getRatio = async () => {
    console.log('tudor tudor')
    const ratio = await this.camera.getSupportedRatiosAsync()
    console.log(ratio[ratio.length - 1])
    if (Platform.OS === 'android') {
      if (ratio === '20:9') {
        this.setState({
          cameraRatio: '20:9'
        })
      }
      this.setState({
        cameraRatio: ratio[ratio.length - 1]
      })
    }
  }

  renderCamera = () => {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center' }}>
        <Camera  mirror={false} ratio="18:9" style={{ width: width, aspectRatio: Platform.OS === 'android' ? 9/18: 9/16 }} type={this.state.type} ref={(ref) => { this.camera = ref }} flashMode={this.state.withFlash}>

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
              onPress={() => this.props.salut()}
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
              onPress={() => this.pickImage()}
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}>
              <Ionicons
                name="ios-photos"
                style={{ color: "#fff", fontSize: 30 }}
              />
            </TouchableOpacity>
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' }}>
              <Toolbar
                capturing={this.state.capturing}
                // flashMode={flashMode}
                // cameraType={cameraType}
                onCaptureIn={this.handleCaptureIn}
                onCaptureOut={this.handleCaptureOut}
                onLongCapture={this.handleLongCapture}
                onShortCapture={this.handleShortCapture}
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

  sendImage = () => {
    let foo = {


    }
    this.setState({
      sendToOverlay: true
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
  renderGallery = () => {
    return (
      <Overlay isVisible={this.state.showPhoto}>
        <ImageBackground source={{ uri: this.state.captures[0].uri }} style={{ width: width + 5, height: screenHeight, backgroundColor: 'transparent' }}>
          <SafeAreaView style={{ flex: 1, flexDirection: 'row', margin: 10 }}>
            <View style={{ flex: 0, margin: 0, alignItems: 'flex-start' }}>
              <TouchableOpacity
                onPress={() => this._closeOverlay()}
                style={{
                  backgroundColor: 'transparent'
                }}>
                <AntDesign
                  name="close"
                  style={{ color: "#fff", fontSize: 30 }}
                />

              </TouchableOpacity>



            </View>


            <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 30, left: 0, right: 0, alignContent: 'center', alignItems: 'center' }}>
              {/* <TouchableOpacity style={{ marginBottom: 20 }}>
                <MaterialCommunityIcons
                  name="format-text"
                  style={{ color: "#fff", fontSize: 30 }}
                />
              </TouchableOpacity> */}

              <TouchableOpacity style={{ marginRight: width / 4.6 }} onPress={() => this.openMoodOverlay()}>
                <MaterialCommunityIcons
                  name={this.state.moodIcon}
                  style={{ color: '#fff', fontSize: 30 }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginRight: width / 4.6 }} onPress={() => this.openActivityOverlay()}>
                <MaterialCommunityIcons name="basketball" style={{ color: '#fff', fontSize: 30 }} />
              </TouchableOpacity>
              {/* <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => this.openTagFriends()}>
                <Ionicons
                  name="md-pricetags"
                  style={{ color: '#fff', fontSize: 30 }}
                />
              </TouchableOpacity> */}
              {/* <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => this.openLocationOverlay()}>
                <MaterialIcons name="location-on" style={{ color: '#fff', fontSize: 30 }} />

              </TouchableOpacity> */}

              {/* <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => this._pressPublic()}>
                <MaterialCommunityIcons name={this.state.publicIcon} style={{ color: '#fff', fontSize: 30 }} />

              </TouchableOpacity> */}


              {/* <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => this.openTimeOverlay()}>
                <Ionicons name="ios-time" style={{ color: '#fff', fontSize: 30 }} />

              </TouchableOpacity> */}



              <TouchableOpacity style={{ marginRight: width / 4.6 }} onPress={() => this.openAlbumOverlay()}>
                <Ionicons name="ios-albums" style={{ color: '#fff', fontSize: 30 }} />

              </TouchableOpacity>

              <TouchableOpacity style={{ marginRight: width / 4.6 }} onPress={() => this.sendImage()}>
                <Ionicons name="ios-send" style={{ color: '#fff', fontSize: 30 }} />

              </TouchableOpacity>

            </View>
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
                    titleStyle={{ fontFamily: 'font1' }}
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
                    titleStyle={{ fontFamily: 'font1' }}
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
                    titleStyle={{ fontFamily: 'font1' }}
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
                    titleStyle={{ fontFamily: 'font1' }}
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
                    titleStyle={{ fontFamily: 'font1' }}
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
                    titleStyle={{ fontFamily: 'font1' }}
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
                    titleStyle={{ fontFamily: 'font1' }}
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
                    titleStyle={{ fontFamily: 'font1' }}
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
                <SendToList close={() => this.closeSendTo()} closeEvery={() => this._pressOverlay()} shouldFlip={this.state.captures[0].shouldFlip} albums={this.state.album} mood={this.state.mood} text={""} taggedUsers={this.state.taggedUsers} activity={this.state.selectedActivity} image={this.state.pictureTaken} hoursPosted={this.state.selectedValueHours} location={this.state.location} creatorId={firebase.auth().currentUser.uid} />
              </SafeAreaView>
            </Overlay>

            <Overlay isVisible={this.state.timePostedOverlay} fullScreen animationType="slide">
              <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                  <TouchableOpacity onPress={() => this.closeTimeOverlay()}>
                    <AntDesign
                      size={26}
                      name="down"
                      color="#b2b8c2"
                    />
                  </TouchableOpacity>
                  <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Hours Posted</Text>
                  <AntDesign
                    size={26}
                    name="bars"
                    color="#b2b8c2"
                  />
                </View>

                <View style={styles.moodView}>
                  <Button
                    title=" 30 min"
                    type="clear"
                    // icon={<Icon name={'emoticon'} size={28} />}
                    containerStyle={styles.bigButton}
                    onPress={() => { this.setState({ selectedValueHours: '30 min', timePostedOverlay: false }) }}

                  />
                  <Button
                    title=" 1 hour"
                    type="clear"
                    // icon={<Icon name={'emoticon-angry'} size={28} />}
                    containerStyle={styles.bigButton}
                    onPress={() => { this.setState({ selectedValueHours: '1 hour', timePostedOverlay: false }) }}

                  />
                </View>
                <View style={styles.moodView}>
                  <Button
                    title=" 2 hours"
                    type="clear"
                    // icon={<Icon name={'emoticon'} size={28} />}
                    containerStyle={styles.bigButton}
                    onPress={() => { this.setState({ selectedValueHours: '2 hours', timePostedOverlay: false }) }}

                  />
                  <Button
                    title=" 4 hours"
                    type="clear"
                    // icon={<Icon name={'emoticon-angry'} size={28} />}
                    containerStyle={styles.bigButton}
                    onPress={() => { this.setState({ selectedValueHours: '4 hours', timePostedOverlay: false }) }}
                  />
                </View>
                <View style={styles.moodView}>
                  <Button
                    title=" 8 hours"
                    type="clear"
                    // icon={<Icon name={'emoticon'} size={28} />}
                    containerStyle={styles.bigButton}
                    onPress={() => { this.setState({ selectedValueHours: '8 hours', timePostedOverlay: false }) }}

                  />
                  <Button
                    title=" 16 hours"
                    type="clear"
                    // icon={<Icon name={'emoticon-angry'} size={28} />}
                    containerStyle={styles.bigButton}
                    onPress={() => { this.setState({ selectedValueHours: '16hours', timePostedOverlay: false }) }}

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

            <Overlay isVisible={this.state.locationOverlay} fullScreen animationType="slide">
              <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                  <TouchableOpacity onPress={() => this.closeLocationOverlay()}>
                    <AntDesign
                      size={26}
                      name="down"
                      color="#b2b8c2"
                    />
                  </TouchableOpacity>
                  <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Location</Text>
                  <AntDesign
                    size={26}
                    name="bars"
                    color="#b2b8c2"
                  />
                </View>
                <PlacesInput
                  stylesContainer={{
                    position: 'relative',
                    alignSelf: 'stretch',
                    margin: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    shadowOpacity: 0,
                    borderColor: '#dedede',
                    borderWidth: 1,
                    marginBottom: 10,
                    // borderRadius: 8
                  }}
                  googleApiKey="AIzaSyBV_c_ySGNav7CWXBhIWPvWpJIaKIWBP88"
                  placeHolder={"Search for location"}
                  language={"en-US"}
                  onSelect={place => {
                    this.setState({ location: place.result.name })
                    //   console.log(place.result.name)
                  }}

                />
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
          </SafeAreaView>


        </ImageBackground>

        <Overlay overlayStyle={{ width: width, height: height - 200, position: 'absolute', bottom: 0 }} onBackdropPress={() => this.closeSwipablePanel()} animationType='fade' isVisible={this.state.showAct}>
          <ActivityPopup imageFromCamera={this.state.pictureTaken} />
        </Overlay>

        <Overlay fullScreen animationType="slide" isVisible={this.state.openSend}>
          <SendToList close={() => this.closeSendTo()} closeEvery={() => this._pressOverlay()} shouldFlip={this.state.captures[0].shouldFlip} />
        </Overlay>
      </Overlay>
    )
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
    return (<View>
      <Overlay isVisible={true}>
        <Video source={{ uri: this.state.captures[0].uri }} resizeMode="cover" style={{ transform: [{ scaleX: this.state.flipVideo ? -1 : 1 }, { scaleY: 1 }], width: width, height: screenHeight }} shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping />




        <TouchableOpacity
          onPress={() => this._closeVideoOverlay()}
          style={{ backgroundColor: 'transparent', position: 'absolute', top: 50, left: 20 }}>
          <AntDesign
            name="close"
            style={{ color: "#fff", fontSize: 30 }}
          />
        </TouchableOpacity>

        <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 50, left: 20, right: 0, alignContent: 'center', alignItems: 'center', zIndex: 2 }}>

          {/* <TouchableOpacity style={{ backgroundColor: 'transparent', position: 'absolute', top: 50, right: 20 }}>
          <MaterialCommunityIcons
            name="format-text"
            style={{ color: "#fff", fontSize: 30 }}
          />
        </TouchableOpacity> */}

          <TouchableOpacity style={{ marginRight: width / 4.6 }}
            onPress={() => this.openMoodOverlay()}>
            <MaterialCommunityIcons
              name={this.state.moodIcon}
              style={{ color: '#fff', fontSize: 30 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginRight: width / 4.6 }} onPress={() => this.openActivityOverlay()}>
            <MaterialCommunityIcons name="basketball" style={{ color: '#fff', fontSize: 30 }} />
          </TouchableOpacity>

          {/* <TouchableOpacity style={{ backgroundColor: 'transparent', position: 'absolute', top: 200, right: 20 }} onPress={() => this.openTagFriends()}>
          <Ionicons
            name="md-pricetags"
            style={{ color: '#fff', fontSize: 30 }}
          />
        </TouchableOpacity> */}

          {/* <TouchableOpacity style={{ backgroundColor: 'transparent', position: 'absolute', top: 250, right: 20 }} onPress={() => this.openLocationOverlay()}>
          <MaterialIcons name="location-on" style={{ color: '#fff', fontSize: 30 }} />

        </TouchableOpacity> */}

          {/* <TouchableOpacity style={{ backgroundColor: 'transparent', position: 'absolute', top: 300, right: 20 }} onPress={() => this._pressPublic()}>
          <MaterialCommunityIcons name={this.state.publicIcon} style={{ color: '#fff', fontSize: 30 }} />

        </TouchableOpacity> */}

          {/* <TouchableOpacity style={{ backgroundColor: 'transparent', position: 'absolute', top: 350, right: 20 }} onPress={() => this.openTimeOverlay()}>
          <Ionicons name="ios-time" style={{ color: '#fff', fontSize: 30 }} />

        </TouchableOpacity> */}

          <TouchableOpacity style={{ marginRight: width / 4.6 }} onPress={() => this.openAlbumOverlay()}>
            <Ionicons name="ios-albums" style={{ color: '#fff', fontSize: 30 }} />

          </TouchableOpacity>

          <TouchableOpacity style={{ marginRight: width / 4.6 }} onPress={() => this.sendImage()}>
            <Ionicons name="ios-send" style={{ color: '#fff', fontSize: 30 }} />

          </TouchableOpacity>

        </View>


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


        <Overlay isVisible={this.state.locationOverlay} fullScreen animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
              <TouchableOpacity onPress={() => this.closeLocationOverlay()}>
                <AntDesign
                  size={26}
                  name="down"
                  color="#b2b8c2"
                />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Location</Text>
              <AntDesign
                size={26}
                name="bars"
                color="#b2b8c2"
              />
            </View>
            <PlacesInput
              stylesContainer={{
                position: 'relative',
                alignSelf: 'stretch',
                margin: 0,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                shadowOpacity: 0,
                borderColor: '#dedede',
                borderWidth: 1,
                marginBottom: 10,
                // borderRadius: 8
              }}
              googleApiKey="AIzaSyBV_c_ySGNav7CWXBhIWPvWpJIaKIWBP88"
              placeHolder={"Search for location"}
              language={"en-US"}
              onSelect={place => {
                this.setState({ location: place.result.name })
                //   console.log(place.result.name)
              }}

            />
          </SafeAreaView>
        </Overlay>


        <Overlay isVisible={this.state.timePostedOverlay} fullScreen animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
              <TouchableOpacity onPress={() => this.closeTimeOverlay()}>
                <AntDesign
                  size={26}
                  name="down"
                  color="#b2b8c2"
                />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Hours Posted</Text>
              <AntDesign
                size={26}
                name="bars"
                color="#b2b8c2"
              />
            </View>

            <View style={styles.moodView}>
              <Button
                title=" 30 min"
                type="clear"
                // icon={<Icon name={'emoticon'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => { this.setState({ selectedValueHours: '30 min', timePostedOverlay: false }) }}

              />
              <Button
                title=" 1 hour"
                type="clear"
                // icon={<Icon name={'emoticon-angry'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => { this.setState({ selectedValueHours: '1 hour', timePostedOverlay: false }) }}

              />
            </View>
            <View style={styles.moodView}>
              <Button
                title=" 2 hours"
                type="clear"
                // icon={<Icon name={'emoticon'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => { this.setState({ selectedValueHours: '2 hours', timePostedOverlay: false }) }}

              />
              <Button
                title=" 4 hours"
                type="clear"
                // icon={<Icon name={'emoticon-angry'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => { this.setState({ selectedValueHours: '4 hours', timePostedOverlay: false }) }}
              />
            </View>
            <View style={styles.moodView}>
              <Button
                title=" 8 hours"
                type="clear"
                // icon={<Icon name={'emoticon'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => { this.setState({ selectedValueHours: '8 hours', timePostedOverlay: false }) }}

              />
              <Button
                title=" 16 hours"
                type="clear"
                // icon={<Icon name={'emoticon-angry'} size={28} />}
                containerStyle={styles.bigButton}
                onPress={() => { this.setState({ selectedValueHours: '16hours', timePostedOverlay: false }) }}

              />
            </View>
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
            <SendToList duration={this.state.duration} image={''} close={() => this.closeSendTo()} closeEvery={() => this._pressOverlay()} albums={this.state.album} mood={this.state.mood} text={""} taggedUsers={this.state.taggedUsers} activity={this.state.selectedActivity} videoFile={this.state.captures[0].uri} hoursPosted={this.state.selectedValueHours} location={this.state.location} creatorId={firebase.auth().currentUser.uid} shouldFlip={this.state.captures[0].shouldFlip} />
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
    </View>)

  }

  render() {

    let { isFocused } = this.props
    if (this.state.fontsLoaded) {
      if (this.state.captures.length === 0) {
        console.log('n am poza nici video')
        if (isFocused) {
          return this.renderCamera()
        }
        else {
          return (<View>
            <Text style={{ fontSize: 50 }}>salut frate nu e camera</Text>
          </View>)
        }
      } else if (typeof this.state.captures[0].height !== 'undefined') {
        console.log('am poza')

        return this.renderGallery()
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

export default withNavigationFocus(CameraScreen)