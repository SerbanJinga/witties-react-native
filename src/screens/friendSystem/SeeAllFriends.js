import React, { Component } from 'react'
import { View, FlatList, Dimensions, TouchableOpacity, Text } from 'react-native'
const { width, height } = Dimensions.get('window')
import firebase from 'firebase'
import { SafeAreaView } from 'react-native-safe-area-context'
import ChatParticipant from '../chatRoom/ChatParticipant'
import { AntDesign } from '@expo/vector-icons'
import { withNavigation } from 'react-navigation'

let arr = []
class SeeAllFriends extends Component {
    constructor(props) {
        super(props)
        this.state = {
            documentData: []
        }
    }

    componentDidMount = async () => {
        arr = []
        await this.retrieveData()
    }

    retrieveData = async () => {
        let query = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
        let data = query.data().friends
        data.forEach(async friend => await this.getFriendDetail(friend))
    }

    getFriendDetail = async (friend) => {
        let friendQuery = await firebase.firestore().collection('users').doc(friend).get()
        let friendData = friendQuery.data()
        arr.push(friendData)
        this.setState({
            documentData: arr
        })
    }



    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>

                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={{
                            backgroundColor: 'transparent',

                        }}>
                        <AntDesign
                            name="arrowleft"
                            style={{ fontSize: 24, fontWeight: "bold" }}
                        />
                    </TouchableOpacity>
                </View>
                {this.state.documentData.length !== 0 ?
           <Text style={{fontFamily: 'font1', fontSize: 24, margin: 10}}>Your Friends</Text>
           : <Text style={{fontFamily: 'font1', fontSize: 24, margin: 10}}>Your Currently have no friends.</Text>}
                <FlatList
                    data={this.state.documentData}
                    renderItem={({item}) => (
                        <ChatParticipant profilePicture={item.profilePicture} displayName={item.displayName} discriminator={item.discriminator}/>
                    )}
                    keyExtractor={(item, index) => String(index)}

                />
            </SafeAreaView>
        )
    }
}

export default withNavigation(SeeAllFriends)