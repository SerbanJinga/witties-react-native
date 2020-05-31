import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { ListItem, Button, Text, Avatar } from 'react-native-elements'
import { Overlay } from 'react-native-elements'
import * as Font from 'expo-font'
import { AntDesign } from '@expo/vector-icons'
const { width, height } = Dimensions.get('window')

export default class AddFriend extends Component {
    constructor(props){
        super(props)
        this.state = {
            fontsLoaded: false,
            overlayOpened: false
        }
    }

    componentDidMount = async () =>{
        await Font.loadAsync({
            font1: require('../../../assets/SourceSansPro-Black.ttf'),
            font2 : require('../../../assets/SourceSansPro-Regular.ttf')
        })
        this.setState({
            fontsLoaded: true
        })
    }


    _pressTouchableOpacity = () => {
        this.setState({
            overlayOpened: true
        })
    }
    _closeFriendOverlay = () => {
        this.setState({
            overlayOpened: false
        })
    }

    _openFriendOverlay = (uid) => {
        
    }
    render(){
        return(
            <TouchableOpacity onPress={() => this._pressTouchableOpacity()}>
            <ListItem titleStyle={{fontFamily: 'font1'}} title={this.props.displayName} leftAvatar={{source:{ uri: this.props.profilePicture }, title: this.props.displayName.charAt(0)}} subtitle={
                <View style={{flex: 1, flexDirection: 'column'}}>
                <Text style={{fontFamily: "font1"}}>#{this.props.discriminator}</Text>
                    <Button
                        titleStyle={{fontFamily: "font1"}}
                        onPress={() => this.props.press()}
                        type="clear"
                        style={{width: 110}}
                        title="Add Friend"
                    />
                </View>
            }/>
            <Overlay animationType='fade' onBackdropPress={() => this._closeFriendOverlay()} isVisible={this.state.overlayOpened} overlayStyle={{width: width / 2, height: height / 4}}>
                <View style={{flex: 1}}>
                    <View style={{flex: 0, flexDirection: 'row'}}>
                        <Avatar source={{uri: this.props.profilePicture}} rounded/>
                        <View style={{flex: 0, flexDirection: 'column'}}>
                            <Text style={{fontFamily: "font1", marginLeft: 8}}>{this.props.displayName}#{this.props.discriminator}</Text>
                            <TouchableOpacity
                                onPress = {() => this._onCloseSearch()}
                                style={{
                                backgroundColor: 'transparent',
                                marginRight: 10
                                }}>
            <Button titleStyle={{color: '#CBD3D8', fontFamily: 'font2', justifyContent: 'center'}} title="Da" type="clear" />

              <AntDesign
                name="right"
                size={20}
              />
            </TouchableOpacity>  
                        </View>
                    </View>
                </View>
        </Overlay>
            </TouchableOpacity>                
        )
    }
}



