import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { ListItem, Button, Text, Avatar, Divider } from 'react-native-elements'
import { Overlay } from 'react-native-elements'
import * as Font from 'expo-font'
import { AntDesign, Entypo } from '@expo/vector-icons'
const { width, height } = Dimensions.get('window')

export default class AddFriend extends Component {
    constructor(props){
        super(props)
        this.state = {
            fontsLoaded: false,
            overlayOpened: false,
            showFullProfile: false
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

    _openProfileDetails = () => {
        this.setState({
            showFullProfile: true,
            overlayOpened: false
        })
    }
    _closeProfileDetails = () => {
        this.setState({
            showFullProfile: false
        })
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
            <Overlay animationType='fade' onBackdropPress={() => this._closeFriendOverlay()} isVisible={this.state.overlayOpened} overlayStyle={{width: width - 40, height: height / 3, borderRadius: '10'}}>
                <View style={{flex: 1}}>
                    <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                        <Avatar size={40} source={{uri: this.props.profilePicture}} rounded/>
                            <TouchableOpacity onPress={() => this._openProfileDetails()}>

                                    <View style={{flex: 0, alignItems: 'center'}}>
                                        <Text style={{fontFamily: 'font1', marginLeft: 6, fontSize: 18}}>{this.props.displayName}#{this.props.discriminator}</Text>
                                        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>
                                            <Text style={{color: '#b2b8c2', fontFamily: 'font2', fontSize: 16}}>View Profile</Text>
                                            <AntDesign
                                                style={{marginTop: 2, marginLeft: 4}}
                                                size={15}
                                                name="right"
                                                color="#b2b8c2"
                                            />
                                        </View>
                                    </View>

                            </TouchableOpacity>
                    </View>
                    <Divider style={{marginTop: 10}}/>
                    <TouchableOpacity style={{padding: 10}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18}}>Add Friend</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>

                    <TouchableOpacity style={{padding: 10}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18}}>More</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>

                    <TouchableOpacity style={{padding: 10, paddingBottom: 20}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18}}>Copy Username</Text>
                    </TouchableOpacity>
                </View>
        </Overlay>

        <Overlay overlayStyle={{width: width, height: height}} animationType="slide" isVisible={this.state.showFullProfile}>
            <View style={{flex: 1}}>
                <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => this._closeProfileDetails()}>
                    <AntDesign
                        size={26}
                        name="down"
                        color="#b2b8c2"
                    />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'font1', fontSize: 20}}>{this.props.displayName}</Text>
                    <AntDesign
                        size={26}
                        name="bars"
                        color="#b2b8c2"
                    />
                </View>
                <View style={{flex: 0, alignItems: 'center', marginTop: 40}}>
                    <Avatar size={100} source={{uri: this.props.profilePicture}} rounded/>
                    <View style={{flex: 0, flexDirection: 'row', marginTop: 20}}>
                <Text style={{fontFamily: "font1", fontSize: 15}}>{this.props.displayName}#{this.props.discriminator}</Text>
                <Entypo name="dot-single" style={{marginTop: 4, marginHorizontal: 4}}/>
                <Text style={{fontFamily: "font1", fontSize: 15}}>{this.props.careScore}</Text>
                </View>
                <Button style={{marginTop: 40}} titleStyle={{fontFamily: 'font1'}} title="Add Friend" type="clear"/>

                </View>
                <Text style={{fontSize: 20, fontFamily: 'font1', marginTop: 20}}>Suggested Friends</Text>
            </View>
        </Overlay>
            </TouchableOpacity>                
        )
    }
}



