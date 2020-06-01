import React, { Component } from 'react'
import { Button, Text, CheckBox } from 'react-native-elements'
import { View, Dimensions, StyleSheet } from 'react-native'
import firebase from 'firebase'
import { render } from 'react-dom'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation';
import ActivityPopupChatroomSelect from '../ActivityPop/ActivityPopupChatroomSelect'

const { width, height } = Dimensions.get('window')
let groupsIn = []
let arr = []
let grupuri = []
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

class ChatRoomsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            documentData: [],
            groupsIn: [],
            refreshing: false,
            type: props.type,
            gruperino: [],
            story: false,
        }
        this.mama = this.mama.bind(this)
        this.tata = this.tata.bind(this)
    }

    componentDidMount = () => {
        groupsIn = []
        arr = []
        grupuri = []
        this._retrieveData()
        // this.waitAndMakeRequest(2000)
        this._getDataFromId()
        console.log('-----------------------------------------------------------')
        console.log(this.state.type)
        console.log(this.state.type)
        console.log(this.state.type)
        console.log(this.state.type)
        console.log('-----------------------------------------------------------')
    }

    // async waitAndMakeRequest(update_rate) {
    //    this._retrieveData()
    //    await delay(update_rate).then(() => {
    //        this.waitAndMakeRequest(update_rate)
    //    })
    // }


    mama = (uid) => {
        grupuri.push(uid)
        this.setState({ gruperino: grupuri })
        console.log(this.state.gruperino)
    }

    tata = (uid) => {
        let grp = this.state.gruperino
        for (let i = 0; i < grp.length; i++) {
            if (grp[i] === uid)
                grp.splice(i, 1)
        }
        this.setState({ gruperino: grp })
        console.log(this.state.gruperino)
    }

    _retrieveData = async () => {

        const currentId = firebase.auth().currentUser.uid
        let inititalQuery = await firebase.firestore().collection("messages")
        let documentSnapshots = await inititalQuery.get()
        let documentData = (await documentSnapshots).docs.map(doc => {
            if (doc.data().usersParticipating) {
                for (let i = 0; i < doc.data().usersParticipating.length; i++) {
                    if (currentId === doc.data().usersParticipating[i])
                        groupsIn.push(doc.data().roomId)
                }
            }
        })

        this.setState({ groupsIn: groupsIn })

        this.state.groupsIn.forEach(group => this._getDataFromId(group))
    }


    _getDataFromId = async (group) => {
        let inititalQuery = await firebase.firestore().collection("messages").where('roomId', '==', group)
        let documentSnapshots = await inititalQuery.get()
        let documentData = documentSnapshots.docs.map(doc => doc.data())
        documentData.forEach(doc => arr.push(doc))
        this.setState({
            documentData: arr
        })
    }


    render() {

        if (this.state.type !== 0) {
            return (
                <SafeAreaView>
                    <FlatList
                        data={this.state.documentData}
                        renderItem={({ item }) => (

                            <View style={styles.itemContainer}>
                                <Text>{item.chatRoomName}</Text>
                                <Text>roomId: {item.roomId}</Text>
                                <Button title="Go to room" onPress={() => { this.props.navigation.navigate("ChatRoom", { iqdif: item.chatRoomName, roomId: item.roomId }) }} />

                            </View>
                        )}
                        keyExtractor={(item, index) => String(index)}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                        onEndReached={this.retrieveMore}
                        onEndReachedThreshold={0}
                        refreshing={this.state.refreshing}
                    />
                </SafeAreaView>
            )
        } else {
            return (<View>
                <FlatList
                    data={this.state.documentData}
                    renderItem={({ item }) => (
                        <ActivityPopupChatroomSelect name={item.roomId} nem={item.chatRoomName} mama={this.mama} tata={this.tata} />

                    )}
                    keyExtractor={(item, index) => String(index)}
                    ListHeaderComponent={<CheckBox title='Your Story' checked={this.state.story} onPress={() => { (this.state.story) ? this.setState({ story: false }) : this.setState({ story: true }) }} />}
                    
                    onEndReached={this.retrieveMore}
                    onEndReachedThreshold={0}
                    refreshing={this.state.refreshing}
                />
                <View style={styles.moodView}>
                    <Button title='Done' type='clear' containerStyle={{
                        marginHorizontal: 15,
                        backgroundColor: '#f5f6fa',
                        borderRadius: 30,
                        width: width * 0.3,
                    }} onPress={() => { this.props.sloboz(this.state.gruperino,this.state.story) }} />
                    </View>
            </View>)
        }
    }
}

export default withNavigation(ChatRoomsList)
const styles = StyleSheet.create({
    itemContainer: {
        width: width,
        borderWidth: 4,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    }, bigButton: {
        marginHorizontal: 15,
        backgroundColor: '#f5f6fa',
        borderRadius: 30,
        width: width * 0.3,

    }, moodView: {
        flexDirection: "row",
        justifyContent: 'center',
        marginBottom: 10,
    }
})
