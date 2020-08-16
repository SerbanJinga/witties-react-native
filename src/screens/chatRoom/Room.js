import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import { Text, Badge, Avatar, Divider, Overlay} from 'react-native-elements'
import * as Font from 'expo-font'
import { AntDesign, Feather, MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons'
import firebase from 'firebase'
import { Camera } from 'expo-camera'
import CameraScreen from '../camera/Camera'
import DoubleTap from '../camera/DoubleTap'
import { withNavigation } from 'react-navigation'
const { width, height } = Dimensions.get('screen')
class Room extends Component {
    constructor(props){
        super(props)
        this.state = {
            fontsLoaded: false,
            openChangeImage: false,
            cameraOverlay: false,
            lastMessage: "",
            hasStreakVideo: true,
            sentStreakVideo: false
        }
    }

    hasStreakVideoFunction = async() => {
      let query = await firebase.firestore().collection('messages').doc(this.props.roomId).get()
      let data = await query.data().streakVideo
      if(typeof data === 'undefined'){
        this.setState({
          hasStreakVideo: false
        })
      }
    }



    componentDidMount = async() =>{
        await Font.loadAsync({
            font1: require('../../../assets/SourceSansPro-Black.ttf'),
            font2 : require('../../../assets/SourceSansPro-Light.ttf')
        })
        this.setState({
            fontsLoaded: true
        })

        await this.sentStreakVideo()
        await this.hasStreakVideoFunction()

        firebase.firestore().collection('messages').doc(this.props.roomId).collection('chats').orderBy('timestamp', 'desc').onSnapshot((doc) => {
          if(doc.empty){
            return
          }
          let lastMessage = doc.docs.map(doc => doc.data().msg)
          
          this.setState({
            lastMessage: lastMessage[0].length <= 20 ? lastMessage[0] : lastMessage[0].slice(0, 60) + "..."
          })
        })
    }

    _changeChatPicture = () => {
        this.setState({
            openChangeImage: true
        })
    }

    openCamera = (id) => {
      this.props.navigation.navigate('StreakVideoCamera', { roomId: id })
    //     this.setState({
    //         cameraOverlay: true
        
    //     })
    }


    closeCamera = () => {
        this.setState({
            cameraOverlay: false
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
        <Overlay isVisible={false} animationType="slide" fullScreen>
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
    render(){
        if(this.state.fontsLoaded){

        return(
          <View style={{flex: 1, justifyContent: 'space-between'}}>
            <TouchableOpacity style={{padding: 0}} onPress={() => this.props.press()}>
                        <View style={{flex: 1, padding: 6}}>
                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar containerStyle={{borderWidth: 3, borderColor: this.state.hasStreakVideo === true ?  '#f6b93b' : '#fff'}} onPress={() => this.props.navigation.navigate('StreakVideoAvatar', { roomId: this.props.roomId})} size={48} rounded source={{uri: this.props.profilePicture}}/>
                    <View style={{flex: 1, flexDirection: 'column', marginLeft: 10}}>
                    
                    <Text style={{ fontFamily: 'font1', fontSize: 18}}>{this.props.chatRoomName}</Text>
                    <Text>{this.state.lastMessage}</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.openCamera(this.props.roomId)}>
                    <AntDesign
                        color="#D4AF37"
                        name="camera"
                        size={24}
                    />
                    </TouchableOpacity>
                </View>
                <Divider style={{marginTop: 20}}/>

            </View>
           
            </TouchableOpacity>
            <Overlay isVisible={this.state.cameraOverlay} overlayStyle={{width: width, height: height}} animationType="slide">
                
            </Overlay>
            </View>
        )}else{
            return ( <ActivityIndicator size="large"/>)
        }
            
    }
}

export default withNavigation(Room)