
import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions'
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
export default class CameraScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            type : Camera.Constants.Type.back,
            hasPermission: null
        }
    }


    componentDidMount  = async() =>  {
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
    
        this.setState({cameraType:
          type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
        })
      }

    render(){
        return(
            <View style={{flex: 1}}>
                <Camera style={{ flex: 1 }} type={this.state.cameraType}>

            <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:20}}>
              
            <TouchableOpacity
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
          </View>

        )
    }
}