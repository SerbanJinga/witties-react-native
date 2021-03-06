import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { ListItem, Button, Text, Avatar, Divider } from 'react-native-elements'
import { Overlay } from 'react-native-elements'
import FullProfile from './FullProfile'
import * as Font from 'expo-font'
import { AntDesign, Entypo } from '@expo/vector-icons'
const { width, height } = Dimensions.get('window')

export default class AddedMe extends Component {
    constructor(props){
        super(props)
        this.state = {
            fontsLoaded: false,
            overlayOpened: false,
            showFullProfile: false,
            buttonTitle: "Accept"
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
        
            <View style={{flex: 1, padding: 10}}>
                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar size={40} rounded source={{uri: this.props.profilePicture}}/>
                    <View style={{flex: 1, flexDirection: 'column',}}>
                    <Text style={{marginLeft: 4, fontFamily: 'font1'}}>{this.props.displayName}</Text>
                    <Text style={{fontFamily: 'font1', marginLeft: 4}}>#{this.props.discriminator}</Text>
                    </View>
                <Button title={this.state.buttonTitle} type="clear" titleStyle={{fontFamily: 'font1'}} onPress={() => {this.props.press()
                this.setState({
                    buttonTitle: "Friends"
                })}}/>
                </View>
                <Divider style={{marginTop: 20}}/>

            </View>
            <Overlay animationType='fade' onBackdropPress={() => this._closeFriendOverlay()} isVisible={this.state.overlayOpened} overlayStyle={{width: width, borderRadius: 10, position: 'absolute', bottom: 0}}>
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

                    <TouchableOpacity style={{padding: 10, paddingBottom: 20}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18}}>Copy Username</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>
                    <TouchableOpacity style={{padding: 10}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18, color: 'red'}}>Block User</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>
                    
                    <TouchableOpacity style={{padding: 10}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18, color: '#b2b8c2', alignSelf: 'center'}}>Done</Text>
                    </TouchableOpacity>
                    
                   
                </View>
        </Overlay>

        <Overlay fullScreen animationType="slide" isVisible={this.state.showFullProfile}>
        <FullProfile addFriend={()=> this.props.press()} displayName={this.props.displayName} discriminator={this.props.discriminator} careScore={this.props.careScore} profilePicture={this.props.profilePicture} close={() => this._closeProfileDetails()} uid={this.props.uid}/>
        </Overlay>
            </TouchableOpacity>                
        )
    }
}


