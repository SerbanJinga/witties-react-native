import React, { Component } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Text, Input, Badge, Avatar, Divider } from 'react-native-elements'
import * as Font from 'expo-font'

export default class ChatParticipant extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }

    componentDidMount = async() => {
        await Font.loadAsync({
            font1: require('../../../assets/SourceSansPro-Black.ttf'),
            font2: require('../../../assets/SourceSansPro-Regular.ttf')
        })
    }
    render(){
        return(
            <View style={{flex: 1, padding: 10}}>
                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar size={40} rounded source={{uri: this.props.profilePicture}}/>
                    <View style={{flex: 1, flexDirection: 'column',}}>
                    <Text style={{marginLeft: 4, fontFamily: 'font1'}}>{this.props.displayName}#{this.props.discriminator}</Text>
                    <Text style={{fontFamily: 'font2', marginLeft: 4}}>{this.props.mood}</Text>
                    </View>

                </View>
                <Divider style={{marginTop: 20}}/>

            </View>
        )
    }
}