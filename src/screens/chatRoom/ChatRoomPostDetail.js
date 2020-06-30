import React, { Component } from 'react'
import { StyleSheet, Image } from 'react-native'
import { withNavigation } from 'react-navigation'
import { SharedElement } from 'react-native-shared-element'
class ChatRoomPostDetail extends Component {
   
    constructor(props){
        super(props)
        this.state = {
            image: props.navigation.state.params.image,
            timestamp: props.navigation.state.params.timestamp

        }
    }

    componentDidMount(){
        console.log(this.state.image)
    }

    render(){
        return(
            // <View style={{flex: 1, alignItems: 'center', width: '100%', height: '100%'}}>
            <SharedElement id={this.state.timestamp} style={StyleSheet.absoluteFill}>
                <Image source={{uri: this.state.image}} style={{width: '100%', height: '100%'}}/>
            </SharedElement>
            // </View>
            )
    }
}


ChatRoomPostDetail.sharedElements = (navigation, otherNavigation, showing) => {
    const item = navigation.getParam('timestamp');
    return [item];
  };


export default withNavigation(ChatRoomPostDetail)