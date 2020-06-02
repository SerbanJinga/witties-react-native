import React, { Component } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Text, Button, Avatar } from 'react-native-elements'

export default class Room extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        return(
            <View style={{flex: 1}}>
                                <Text>{this.props.chatRoomName}</Text>
                                <Text>roomId: {this.props.roomId}</Text>
                                <Button title="Go to room" onPress={() => { this.props.press()}} />

                        </View>
        )
    }
}