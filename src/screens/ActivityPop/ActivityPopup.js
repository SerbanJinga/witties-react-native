import React from "react"
import { Text, Button, Input, SearchBar } from 'react-native-elements'
import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    ImageBackground,
    Dimensions,
    FlatList,
    

} from 'react-native';
import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const { width, height } = Dimensions.get('window')
import FriendList from '../friendSystem/FriendList'
import firebase from 'firebase';
import Friend from "../../components/Friend";
const Frie = new FriendList;
const arr = [];

export default class ActivityPopup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            displayName: props.laba,
            nameOfUser: props.name,


            gap: 0,
            gap2: 0,
            taggedUsers: [],

            //Aici se formeaza starea propriu zis
            postText: '',
            oneUserTag: '',
            mood: '',

            //RightIcon
            rightIconSize: 0,
            rightIconEmoticon: '',
            documentData: [],
            lastVisible: null,
            loading: false,
            refreshing: false,
            filteredData: [],
            currentUser: "",
            limit: 20

        }
    }
    componentDidMount() {
        console.log("De aici vine", this.state.displayName)
        this._retrieveFriendRequests()

        console.log('=a-ra=r-apkfakfaf')
        
        console.log(this.state.documentData)


    }

    search = (searchText) => {
        this.setState({searchText: searchText})
        let filteredData = this.state.documentData.filter(function(item){
            return item.displayName.toLowerCase().includes(searchText)
        })
        this.setState({filteredData: filteredData})
    }

    _retrieveFriendRequests = async () => {
        let receivedQuery = await firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).collection("received")
        let documentSnapshotsReceived = await receivedQuery.get()
        documentSnapshotsReceived.docs.map(doc => { if (doc.data().accepted === true) { this.cinetiadatrequest(doc.data().sender) } })
        let sendQuery = await firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).collection("sent")
        let documentSnapshotsSend = await sendQuery.get()
        documentSnapshotsSend.docs.map(doc => { if (doc.data().accepted === true) { this.cinetiadatrequest(doc.data().receiver) } })



    }


    cinetiadatrequest = async (uid) => {
        let initialQuery = await firebase.firestore().collection("users").doc(uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = documentSnapshots.data()
        arr.push(documentData)
        this.setState({
            documentData: arr
        })

    }

    sendActivity(){
        let foo={
            mood:this.state.mood,
            text:this.state.postText,
            taggedUsers:this.state.taggedUsers
        }
        console.log(foo)
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
            status:foo,

        })
    }

    renderHeader = () => {
        try{
            return(
                <SearchBar
                    showCancel={true}
                    lightTheme={true}
                    autoCorrect={false}
                    onChangeText={this.search}
                    value={this.state.searchText}
                    placeholder="Search users..."
                />
            )
        }catch(error){
            console.log(error)
        }
    }

    renderFooter = () => {
        try{
            if(this.state.loading || this.state.refreshing){
                return(<ActivityIndicator/>)
            }else{
                return null
            }
        }catch(error){
            console.log(error)
        }
    }

    addUserTag = (uid) => {
        const tagListIdsFinal = this.state.taggedUsers
        tagListIdsFinal.push(uid)
        this.setState({taggedUsers: tagListIdsFinal})
    }

    removeUserTag = (uid) => {
        let tagListIdsFinal = this.state.taggedUsers
        for(let i = 0; i < tagListIdsFinal.length; i++)
            if(tagListIdsFinal[i] == uid)
                tagListIdsFinal.splice(i, 1)
        this.setState({taggedUsers: tagListIdsFinal})
    }


    render() {
        return (<View style={styles.container}>
            <View style={{ marginTop: 40, width: width * 0.8, height: height }}>{/*aici scriu tot*/}
                <Input
                    placeholder={"cum te simti azi " + this.state.nameOfUser + '?'}
                    placeholderTextColor="#B1B1B1"
                    returnKeyType="done"
                    textContentType="newPassword"
                    rightIcon={<Icon name={this.state.rightIconEmoticon} size={this.state.rightIconSize} />}
                    containerStyle={{ marginBottom: 0, paddingBottom: 0 }}
                    value={this.state.postText}
                    onChangeText={postText => this.setState({ postText })}
                />
                {/* POPUP---------------------------------------------------------- */}
                <View style={{ height: this.state.gap, width: (this.state.gap === 0) ? 0 : width * 0.8, backgroundColor: 'white' }}>
                    {/* <Input

                        placeholder={"selecteaza utilizatori" + this.state.nameOfUser + '?'}
                        placeholderTextColor="#B1B1B1"
                        returnKeyType="done"
                        textContentType="newPassword"
                        containerStyle={{ marginBottom: 0, paddingBottom: 0 }}
                        value={this.state.oneUserTag}
                        onChangeText={oneUserTag => this.setState({ oneUserTag })}
                    /> 
                    
                    TO CHANGE
                    */
                    
                    }
                    <FlatList
                 data = {this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.state.documentData}
                        renderItem={({item}) => (
                            <Friend mama={this.addUserTag} tata={this.removeUserTag} name={item.displayName} uid={item.uid}/>
                        )}
                        keyExtractor={(item, index) => String(index)}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                        onEndReached={this.retrieveMore}
                        onEndReachedThreshold={0}
                        refreshing={this.state.refreshing}
                    />
                    

                </View>


                {/* Mood---------------------------------------------------------- */}


                <View style={{ height: this.state.gap2, width: (this.state.gap2 === 0) ? 0 : width * 0.8, backgroundColor: 'white' }}>


                    <View style={styles.moodView}>
                        <Button
                            title=" Happy"
                            type="clear"
                            icon={<Icon name={'emoticon'} size={28} />}
                            containerStyle={styles.button}
                            onPress={() => { this.setState({ mood: 'happy', rightIconEmoticon: 'emoticon', rightIconSize: 28, gap2: 0 }) }}

                        />
                        <Button
                            title=" Angry"
                            type="clear"
                            icon={<Icon name={'emoticon-angry'} size={28} />}
                            containerStyle={styles.button}
                            onPress={() => { this.setState({ mood: 'angry', rightIconEmoticon: 'emoticon-angry', rightIconSize: 28, gap2: 0 }) }}

                        />
                    </View>

                    <View style={styles.moodView}>
                        <Button
                            title=" Cool"
                            type="clear"
                            icon={<Icon name={'emoticon-cool'} size={28} />}
                            containerStyle={styles.button}
                            onPress={() => { this.setState({ mood: 'cool', rightIconEmoticon: 'emoticon-cool', rightIconSize: 28, gap2: 0 }) }}

                        />
                        <Button
                            title=" Sad"
                            type="clear"
                            icon={<Icon name={'emoticon-cry'} size={28} />}
                            containerStyle={styles.button}
                            onPress={() => { this.setState({ mood: 'sad', rightIconEmoticon: 'emoticon-cry', rightIconSize: 28, gap2: 0 }) }}

                        />
                    </View>

                    <View style={styles.moodView}>
                        <Button
                            title=" Dead"
                            type="clear"
                            icon={<Icon name={'emoticon-dead'} size={28} />}
                            containerStyle={styles.button}
                            onPress={() => { this.setState({ mood: 'dead', rightIconEmoticon: 'emoticon-dead', rightIconSize: 28, gap2: 0 }) }}

                        />
                        <Button
                            title=" Excited"
                            type="clear"
                            icon={<Icon name={'emoticon-excited'} size={28} />}
                            containerStyle={styles.button}
                            onPress={() => { this.setState({ mood: 'excited', rightIconEmoticon: 'emoticon-excited', rightIconSize: 28, gap2: 0 }) }}

                        />
                    </View>

                    <View style={styles.moodView}>
                        <Button
                            title=" Flirty"
                            type="clear"
                            icon={<Icon name={'emoticon-kiss'} size={28} />}
                            containerStyle={styles.button}
                            onPress={() => { this.setState({ mood: 'flirty', rightIconEmoticon: 'emoticon-kiss', rightIconSize: 28, gap2: 0 }) }}

                        />
                        <Button
                            title=" Ok"
                            type="clear"
                            icon={<Icon name={'emoticon-neutral'} size={28} />}
                            containerStyle={styles.button}
                            onPress={() => { this.setState({ mood: 'ok', rightIconEmoticon: 'emoticon-neutral', rightIconSize: 28, gap2: 0 }) }}

                        />
                    </View>


                </View>
                {/* ---------------------Moood-------------- */}


                {/* --------Main comp------------------------ */}
                <View style={styles.moodView}>
                    <Button
                        title="Activity"
                        type="clear"
                        icon={<Icon name={'emoticon-happy-outline'} size={28} />}
                        containerStyle={styles.button}
                        onPress={() => { console.log(this.state.documentData) }}

                    />
                    <Button
                        title=" Tag friends"
                        type="clear"
                        icon={<Icon3 name={'md-pricetags'} size={28} />}
                        onPress={() => {
                            if (this.state.gap === 0)
                                this.setState({ gap: height / 3 })
                            else
                                this.setState({ gap: 0 })
                        }}
                        containerStyle={styles.button}
                    />
                </View>
                <View style={styles.moodView}>
                    <Button
                        title=" Stare"
                        type="clear"
                        // containerStyle={{margin:10}}
                        containerStyle={styles.button}
                        icon={<Icon3 name={'ios-happy'} size={28} />}
                        onPress={() => {
                            if (this.state.gap2 === 0)
                                this.setState({ gap2: height / 3 })
                            else
                                this.setState({ gap2: 0 })
                        }}
                    />
                    <Button
                        title=" Visit"
                        type="clear"
                        icon={<Icon2 name={'location-on'} size={28} />}
                        containerStyle={styles.button}
                    />
                </View>
                <View style={styles.moodView}>
                    <Button
                        title=" Done"
                        type="clear"
                        containerStyle={styles.button}
                        onPress={() => { this.sendActivity() }}

                    />

                </View>
            </View>
        </View>)
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    button: {
        marginHorizontal: 15,
        backgroundColor: '#f5f6fa',
        borderRadius: 30,
        width: width * 0.3,

    },
    moodView: {
        flexDirection: "row",
        justifyContent: 'center',
        marginBottom: 10,
    }
})