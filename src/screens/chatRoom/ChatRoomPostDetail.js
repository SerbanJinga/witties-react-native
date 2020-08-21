import React, { Component } from 'react'
import { View, Image, Dimensions } from 'react-native'
import { withNavigation } from 'react-navigation'
import { SharedElement } from 'react-native-shared-element'
const { width, height } = Dimensions.get('screen')
import {Video} from 'expo-av'
class ChatRoomPostDetail extends Component {
   
    constructor(props){
        super(props)
        this.state = {
            image: props.navigation.state.params.image,
            timestamp: props.navigation.state.params.timestamp,
            video: props.navigation.state.params.video

        }
    }

    componentDidMount(){
        console.log(this.state.image)
    }

    render(){
        if(typeof this.state.video === 'undefined'){
            return (
                
                <View style={{ flex: 1 }}>
                    <Image source={{ uri: this.state.image }} style={{width: width, height: height}} />
                </View>
            )}else { return(<View style={{flex: 1}}>
                    <Video source={{uri: this.state.video}} resizeMode="cover" style={{width: width, height: height}} shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping/>
                </View>)
            }
        }
}





export default withNavigation(ChatRoomPostDetail)