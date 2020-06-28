
import React, { Component } from 'react'
import { Overlay, Icon } from 'react-native-elements'
import { View, Text, TouchableOpacity, Image, ImageBackground, Dimensions, ActivityIndicator, ScrollView, Animated, StyleSheet } from 'react-native'
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions'
import { FontAwesome, MaterialCommunityIcons, Ionicons, Feather, AntDesign, MaterialIcons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import Gallery from './Gallery'
import firebase from 'firebase'
import * as Font from 'expo-font'
import * as ImagePicker from 'expo-image-picker'
import { Avatar, SearchBar, Button } from 'react-native-elements'
import ActivityPopup from '../ActivityPop/ActivityPopup'
import { Video } from 'expo-av'
import SendToList from './SendToList'
import { Send } from 'react-native-gifted-chat'
import DoubleTap from './DoubleTap'
import VideoPlayer from 'expo-video-player'
import { withNavigation } from 'react-navigation'

const { width, height } = Dimensions.get('window')

let lastTap = null
 class CameraScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            type : Camera.Constants.Type.back,
            hasPermission: null,
            pictureTaken: '',
            showPhoto: false,
            flashIcon: 'flash-off',
            locationIcon: 'location-off',
            withFlash: Camera.Constants.FlashMode.off,
            profilePicture: '',
            fontsLoaded: false,
            showAct: false,
            onPressCamera: false,
            currentDate: Date.now(),
            cameraDoes: "photo",
            video: "",
            showVideo: false,
            openSend: false,
            settings: false,
            showListVideo: false
          }
    }

    async changeLocationIcon() {
      let { status } = await Permissions.askAsync(Permissions.LOCATION)
      
      if (status !== 'granted') {
        console.log("nu ai permisiune bai coi")
        return;
      }
      let location = await Location.getCurrentPositionAsync({})
      let lat,long
      lat = location.coords.latitude
      long = location.coords.longitude
      console.log(lat,long)
      if (this.state.locationIcon === 'location-off')
        this.setState({ locationIcon: "location-on" })
        else
        this.setState({ locationIcon: "location-off" })
    }

    
    closeSwipablePanel = (foo) =>{
      this.setState({showAct:false})
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


    _getProfilePicture = async() => {
      let initialQuery = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
      let documentSnapshots = await initialQuery.get()
      let documentData = documentSnapshots.data().profilePicture
      console.log(documentData)
      this.setState({
        profilePicture: documentData
      })
    }

    componentDidMount  = async() =>  {
      await Font.loadAsync({
        font1: require('../../../assets/SourceSansPro-Black.ttf')
      })
      this.setState({
        fontsLoaded: true
      })
        await this._getProfilePicture()
        const { status } = await Camera.requestPermissionsAsync()
        this.setState({hasPermission: status})
        if (this.state.hasPermission === null){
            console.log('esti prost')
        }else if (this.state.hasPermission === false){
            console.log('n a mers')
        }
    }


    handleCameraType=()=>{
        const { type } = this.state
    
        this.setState({type:
          type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
        })
      }


takePicture = () => {
  if(this.camera){
    this.camera.takePictureAsync({onPictureSaved: this.onPictureSaved})
  }
}

takeVideo =() => {
  this.camera.stopRecording()
  this.setState({
    showVideo: true
  })
  console.log('s-a oprit')
  console.log(this.state.showVideo)
}

stopRecording = () => {

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
startTimer = () => {
  this.setState({
    onPressCamera: true
  })
  setTimeout(this.checkTimer, 400)
}

checkTimer = async() => {
  if(this.state.onPressCamera === true){
    this.setState({
      cameraDoes: "video"
    })
    let video = await this.camera.recordAsync()
    console.log(video)
    this.setState({
      video: video.uri
    })
    console.log(this.state.video != '')

  }else{
    this.setState({
      cameraDoes: "photo"
    })
  }
}

stopTimer = () => {
  this.setState({
    onPressCamera: false
  })

  if(this.state.cameraDoes === 'photo'){
    this.takePicture()
  }else{
    this.takeVideo()

  }
}

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
              </TouchableOpacity>
              
    <TouchableOpacity
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
      onPressIn={this.startTimer}
      // onLongPress={() => console.log('apas lung')}
      onPressOut={this.stopTimer}
      // onPress={this.takePicture}
      style={{
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}>
      <FontAwesome
          name="camera"
          style={{ color: "#fff", fontSize: 30}}
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

_pressOverlay = () => {
  this.setState({ showPhoto: false, pictureTaken: '' })
}

sendPost = () => {

}

renderGallery = () => {
  
  return(
      <Overlay isVisible={this.state.showPhoto} overlayStyle={{flex: 1}}>
         <View style={{flex: 1}}>
                <ImageBackground source={{uri: this.state.pictureTaken}} style={{width: width, height: height}}>
                <View style={{flex: 0, flexDirection: 'row', margin: 20}}>
                <TouchableOpacity
                onPress={() => this._pressOverlay()}
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}>
              <AntDesign
                  name="close"
                  style={{ color: "#fff", fontSize: 30}}
              />
            </TouchableOpacity>   
            <TouchableOpacity
                onPress={() => this._pressOverlay()}
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
                marginLeft: width / 1.8
              }}>
              <MaterialCommunityIcons
                  name="download"
                  style={{ color: "#fff", fontSize: 30}}
              />
            </TouchableOpacity>    
            <TouchableOpacity
                onPress={() => this._pressOverlay()}
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
                marginLeft: 20
              }}>
              <MaterialCommunityIcons
                  name="menu"
                  style={{ color: "#fff", fontSize: 30}}
              />
            </TouchableOpacity>  
                
             </View>
             <View style={{flex: 0, flexDirection: 'row', margin: 20, position: 'absolute', bottom: 20, alignContent: 'center', justifyContent: 'space-between'}}>
             <View style={{flex: 0, flexDirection: 'column', alignItems: 'center', margin: 10}}>              
              <Avatar onPress={() => this._postOnStory()} containerStyle={{borderWidth: 2, borderColor: 'white',  borderStyle: 'solid'}} rounded source={{uri: this.state.profilePicture}}/>
              <Text style={{color: '#fff', marginTop: 15, fontFamily: 'font1'}}>Your Story</Text>
             </View>
             <View style={{flex: 0, flexDirection: 'column', alignItems: 'center', margin: 10}}>              
             <Avatar onPress={() => this.openSwipeablePanel()} containerStyle={{borderWidth: 2, borderColor: 'white', borderStyle: 'solid'}} rounded source={{uri: 'https://image.flaticon.com/icons/png/512/32/32441.png'}}/>
              <Text style={{color: '#fff', marginTop: 15, fontFamily: 'font1'}}>Edit</Text>
             </View>
             <TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: '#0984e3', borderRadius: '40'}} onPress={()=> this.openSendTo()}>
            <View style={{flex: 0, justifyContent: 'center',alignContent: 'center', alignItems: 'center',marginTop: 20, marginLeft: 80, flexDirection: 'row'}}>

             <Text style={{color: '#fff', marginRight:15, fontFamily: 'font1', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>Send to</Text>
              <MaterialCommunityIcons
                name="send"
                style={{fontSize: 20}}
                color="#fff"
              />
              </View>

              </TouchableOpacity>

              </TouchableOpacity>
             </View>

                </ImageBackground>
          
            </View>
            <Overlay overlayStyle={{width: width, height: height - 200, position: 'absolute', bottom: 0}} onBackdropPress={() => this.closeSwipablePanel()} animationType='fade' isVisible={this.state.showAct}>
              <ActivityPopup imageFromCamera={this.state.pictureTaken}/>
            </Overlay>

            <Overlay fullScreen animationType="slide" isVisible={this.state.openSend}>
              <SendToList close={() => this.closeSendTo()} closeEvery={() => this._pressOverlay()}/>
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

renderVideo = () => {
  // const opacity = React.useMemo(() => new Animated.Value(0), []);
  // console.log('se randeaza')
  return(
  <Overlay isVisible={this.state.showVideo} overlayStyle={{flex: 1, width: width, height: height}}>
<View style={styles.container}>
 
      <Video source={{uri: this.state.video}} resizeMode="cover" style={styles.video} shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping/>
      <TouchableOpacity style={styles.button} onPress={() => this.pressVideo()}>
        <Text style={{fontSize: 40}}>Send to</Text>
      </TouchableOpacity>
</View>  

<Overlay isVisible={this.state.showListVideo}>
  <SendToList video={this.state.video}/>
</Overlay>
</Overlay>

  )
}

    render(){
      if(this.state.fontsLoaded){
      if(this.state.pictureTaken === '' && this.state.video === ''){
        console.log('n am poza nici video')
        return this.renderCamera()
      }else if(this.state.pictureTaken !== ''){
        console.log('am poza')
        return this.renderGallery()
      }else if(this.state.video !== ''){
        console.log('am video', this.state.video)
        return this.renderVideo()
      }
        
    }else{
      return(
        <ActivityIndicator size="large"/>
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
  }
});

export default withNavigation(CameraScreen)