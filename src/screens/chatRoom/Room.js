import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Text, Badge, Avatar, Divider, Overlay} from 'react-native-elements'
import * as Font from 'expo-font'
import firebase from 'firebase'
export default class Room extends Component {
    constructor(props){
        super(props)
        this.state = {
            fontsLoaded: false,
            openChangeImage: false
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

    render(){
        if(this.state.fontsLoaded){

        return(
            <TouchableOpacity style={{padding: 6}} onPress={() => this.props.press()}>
                        <View style={{flex: 1, padding: 10}}>
                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar onPress={() => this._changeChatPicture()} size={40} rounded source={{uri: this.props.profilePicture}}/>
                    <View style={{flex: 1, flexDirection: 'column',}}>
                    <Text style={{marginLeft: 4, fontFamily: 'font1'}}>{this.props.chatRoomName}</Text>
                    {/* <Text style={{fontFamily: 'font2', marginLeft: 4}}>{this.props.lastMessage}</Text> */}
                    </View>
                    <Badge  status="primary" containerStyle={{marginLeft: "auto"}} badgeStyle={{width: 20, height: 20, borderRadius:20}} value={2}/>

                </View>
                <Divider style={{marginTop: 20}}/>

            </View>


            </TouchableOpacity>
        )}else{
            return ( <ActivityIndicator size="large"/>)
        }
            
    }
}