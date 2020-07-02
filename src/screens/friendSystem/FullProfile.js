import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { ListItem, Button, Text, Avatar, Divider } from 'react-native-elements'
import { Overlay } from 'react-native-elements'
import * as Font from 'expo-font'
import firebase from 'firebase'
import { AntDesign, Entypo } from '@expo/vector-icons'
import { FlatList } from 'react-native-gesture-handler'
import RecommendedFriend from '../friendSystem/RecommendedFriend'
import { SafeAreaView } from 'react-native-safe-area-context'
const { width, height } = Dimensions.get('window')
let arr = []
export default class FullProfile extends Component {
    constructor(props){
        super(props)
        this.state = {
            suggestedFriends: [],
            suggestedFriendsData: [],
            buttonTitle: "Add Friend"
        }
    }

    componentDidMount = () => {
        if(this.props.added === 'Added'){
            this.setState({
                buttonTitle: "Added"
            })
        }
        arr = []
        console.log('executarea, baieti')
        this._retrieveSuggestedFriends()
    }

    _retrieveSuggestedFriends = async () => {
        const func = firebase.functions().httpsCallable('recommendedFriends')
        await func({uid: this.props.uid}).then(res => this.setState({
            suggestedFriends: res.data.documentData
        })).then(console.log(this.state.suggestedFriends))
        // console.log(this.state.suggestedFriends)
        this.state.suggestedFriends.forEach(suggestedFriend => this.getFriendById(suggestedFriend))
    }

    getFriendById = async (uid) => {
        console.log(uid)
        let query = await firebase.firestore().collection('users').doc(uid).get()
        let data = await query.data()
        arr.push(data)
        this.setState({
            suggestedFriendsData: arr
        })
    }


    addFriendProps = (name, uid) => {
        if(this.state.buttonTitle === 'Add Friend'){
            this.props.addFriend()
            this.setState({
                buttonTitle: 'Added'
            })
        }else{
            
            Alert.alert(
                `Remove ${name}?`,
                "You can not turn back.",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log('nimic '),
                        style: 'cancel'
                    },
                    {
                        text: "Remove",
                        onPress: () => this.removeFriendRequest(uid),
                        style: 'destructive'
                    }
                ],
                {cancelable: 'false'}
            )        }
    }

    removeFriendRequest = (uid) => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            sentRequests: firebase.firestore.FieldValue.arrayRemove(uid)
        })

        firebase.firestore().collection('users').doc(uid).update({
            receivedRequests: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
        })
        this.setState({
            buttonTitle: "Add Friend"
        })
    }
    render(){
        return(
            <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => this.props.close()}>
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
            <Button style={{marginTop: 40}} titleStyle={{fontFamily: 'font1'}} title={this.state.buttonTitle} type="clear" onPress={() => this.addFriendProps(this.props.displayName, this.props.uid)}/>

            </View>
            <Text style={{fontSize: 20, fontFamily: 'font1', marginTop: 20}}>Suggested Friends</Text>
            {this.state.suggestedFriendsData.length === 0 ? <Text style={{fontFamily: 'font1', fontSize: 15, marginTop: 40, alignItems: 'center', alignContent: 'center', alignSelf: 'center'}}>No Suggested Friends</Text> : 
            <FlatList
                        data={this.state.suggestedFriendsData}
                        renderItem={({item}) => (
                            <RecommendedFriend profilePicture={item.profilePicture} careScore={item.careScore} displayName={item.displayName} uid={item.uid} discriminator={item.discriminator} press={() => this.props.addFriend()}/>

                        // <AddedMe careScore={item.careScore} discriminator={item.discriminator} displayName={item.displayName} profilePicture={item.profilePicture} press={() => this._acceptFriend(item.uid)}/>
                    )}  
                    keyExtractor={(item, index) => String(index)}

                />
            }
        </SafeAreaView>
        )
    }
}