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
            padding: 6
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
          <View>
            <TouchableOpacity style={{padding: this.state.padding}} onPress={() => this.props.press()}>
                        <View style={{flex: 1, padding: 10}}>
                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar onPress={() => this._changeChatPicture()} size={40} rounded source={{uri: this.props.profilePicture}}/>
                    <View style={{flex: 1, flexDirection: 'column',}}>
                    <Text style={{marginLeft: 4, fontFamily: 'font1'}}>{this.props.chatRoomName}</Text>
                    {/* <Text style={{fontFamily: 'font2', marginLeft: 4}}>{this.props.lastMessage}</Text> */}
                    </View>
                    {/* <Badge  status="primary" containerStyle={{marginLeft: "auto"}} badgeStyle={{width: 20, height: 20, borderRadius:20}} value={2}/> */}
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