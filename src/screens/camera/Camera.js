
import React, { Component } from 'react'
import { Overlay, Icon } from 'react-native-elements'
import { View, Text, TouchableOpacity, Image, ImageBackground, Dimensions, ActivityIndicator } from 'react-native'
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions'
import { FontAwesome, MaterialCommunityIcons, Ionicons, Feather, AntDesign } from '@expo/vector-icons'
import Gallery from './Gallery'
import firebase from 'firebase'
import * as Font from 'expo-font'
import * as ImagePicker from 'expo-image-picker'
import { Avatar, Button } from 'react-native-elements'
import ActivityPopup from '../ActivityPop/ActivityPopup'
const { width, height } = Dimensions.get('window')
export default class CameraScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            type : Camera.Constants.Type.back,
            hasPermission: null,
            pictureTaken: '',
            showPhoto: false,
            flashIcon: 'flash-off',
            withFlash: Camera.Constants.FlashMode.off,
            profilePicture: '',
            fontsLoaded: false,
            showAct: false
        }
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
    newFlash = 'flash-auto'
  }else if(this.state.flashIcon === 'flash-auto'){
    newFlash = 'flash-off'
  }else if(this.state.flashIcon === 'flash-off'){
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
    // this.setState({
    //   pictureTaken: result.uri
    // })
    console.log(result.uri)
  }

}
renderCamera = () => {
  return(
    <View style={{flex: 1}}>
        <Camera ratio={'16: 9'} style={{ flex: 1 }} type={this.state.type} ref={(ref) => { this.camera = ref}} flashMode={this.state.withFlash}>

    <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', margin: 20}}>   
    <TouchableOpacity
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
          style={{ color: "#fff", fontSize: 40}}
      />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={this.takePicture}
      style={{
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}>
      <FontAwesome
          name="camera"
          style={{ color: "#fff", fontSize: 40}}
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
          style={{ color: "#fff", fontSize: 40}}
      />
    </TouchableOpacity>
  </View>
  </Camera>
  </View>)
}

_pressOverlay = () => {
  this.setState({ showPhoto: false, pictureTaken: '' })
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
              <MaterialCommunityIcons
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
             <View style={{flex: 0, flexDirection: 'row', margin: 20, marginTop: height / 1.4, alignContent: 'center'}}>
             <View style={{flex: 0, flexDirection: 'column', alignItems: 'center', margin: 10}}>              
              <Avatar containerStyle={{borderWidth: 2, borderColor: 'white',  borderStyle: 'solid'}} rounded source={{uri: this.state.profilePicture}}/>
              <Text style={{color: '#fff', marginTop: 15, fontFamily: 'font1'}}>Your Story</Text>
             </View>
             <View style={{flex: 0, flexDirection: 'column', alignItems: 'center', margin: 10}}>              
             <Avatar onPress={() => this.openSwipeablePanel()} containerStyle={{borderWidth: 2, borderColor: 'white', borderStyle: 'solid'}} rounded source={{uri: 'https://image.flaticon.com/icons/png/512/32/32441.png'}}/>
              <Text style={{color: '#fff', marginTop: 15, fontFamily: 'font1'}}>Edit</Text>
             </View>
             <TouchableOpacity>
             <View style={{flex: 0, justifyContent: 'center',alignContent: 'center', alignItems: 'center',marginTop: 20, marginLeft: 80, flexDirection: 'row'}}>

             <Text style={{color: '#fff', marginRight:15, fontFamily: 'font1', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>Send to</Text>
              <MaterialCommunityIcons
                name="send"
                style={{fontSize: 20}}
                color="#fff"
              />
                           </View>

              </TouchableOpacity>
             </View>

                </ImageBackground>
          
            </View>
            <Overlay overlayStyle={{width: width, height: height - 200, position: 'absolute', bottom: 0}} onBackdropPress={() => this.closeSwipablePanel()} animationType='fade' isVisible={this.state.showAct}>
              <ActivityPopup/>
            </Overlay>
      </Overlay>
    )
}

    render(){
      if(this.state.fontsLoaded){
      if(this.state.pictureTaken === ''){
        return this.renderCamera()
      }else{
        return this.renderGallery()
      }
        
    }else{
      return(
        <ActivityIndicator size="large"/>
      )
    }
  }
}