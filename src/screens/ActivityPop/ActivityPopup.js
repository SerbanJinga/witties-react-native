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
    ScrollView,
    Image,
    Picker

} from 'react-native';
import * as ImagePicker from 'expo-image-picker'

import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const { width, height } = Dimensions.get('window')
import FriendList from '../friendSystem/FriendList'
import firebase from 'firebase';
import ActivitySelect from '../ActivityPop/ActivitySelect'
import Friend from "../../components/Friend";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
const Frie = new FriendList;
const arr = [];
import SwipeablePanel from 'rn-swipeable-panel'
import PlacesInput from 'react-native-places-input';

export default class ActivityPopup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            displayName: props.laba,
            nameOfUser: props.name,

            selectedActivity: '',

            gap: 0,
            gap2: 0,
            gap3: 0,
            gap4: 0,
            gap5: 0,
            gap6: 0,
            taggedUsers: [],
            public: true,
            input2: '',
            //Aici se formeaza starea propriu zis
            postText: '',
            oneUserTag: '',
            mood: '',
            //RightIcon
            rightIconSize: 0,
            rightIconEmoticon: '',
            documentDataFriends: [],
            documentData: [],
            lastVisible: null,
            loading: false,
            refreshing: false,
            filteredData: [],
            currentUser: "",
            limit: 20,
            imageUri: '',
            imageURL: "",
            selectedValueHours: "",
            swipeablePanelActive: false,
            location: ""

        }
    }


    componentDidMount() {
        console.log(firebase.auth().currentUser.uid)
        console.log("De aici vine", this.state.displayName)
        this._retrieveFriendRequests()
        this.retrieveData()
        console.log('=a-ra=r-apkfakfaf')

        console.log(this.state.documentDataFriends)


    }


    pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3]
        })
  
        if(!result.cancelled){
          this.setState({imageUri: result.uri})
        }
  
      }

      uploadPhoto = async() => {
        const path = `photos/${firebase.auth().currentUser.uid}/${Date.now()}.jpg`
        const response = await fetch(this.state.imageUri)
        const file = await response.blob()
  
        let upload = firebase.storage().ref(path).put(file)
        upload.on("state_changed", snapshot => {}, err => {
          console.log(err)
        },
          async () => {
            const url = await upload.snapshot.ref.getDownloadURL()
            console.log(url)
            this.setState({imageURL: url})
            this.sendActivity(this.state.imageURL)
          })
      }

      

    search = (searchText) => {
        this.setState({ searchText: searchText })
        let filteredData = this.state.documentDataFriends.filter(function (item) {
            return item.displayName.toLowerCase().includes(searchText)
        })
        this.setState({ filteredData: filteredData })
    }

    _retrieveFriendRequests = async () => {
        let receivedQuery = await firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).collection("received")
        let documentSnapshotsReceived = await receivedQuery.get()
        documentSnapshotsReceived.docs.map(doc => { if (doc.data().accepted === true) { this.cinetiadatrequest(doc.data().sender) } })
        let sendQuery = await firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid).collection("sent")
        let documentSnapshotsSend = await sendQuery.get()
        documentSnapshotsSend.docs.map(doc => { if (doc.data().accepted === true) { this.cinetiadatrequest(doc.data().receiver) } })



    }

    async retrieveData() {
        let initialQuery = await firebase.firestore().collection("users").where("uid", "==", firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = documentSnapshots.docs.map(doc => doc.data())
        let bagPl = documentData[0].customActivities
        this.setState({ documentData: bagPl })
        console.log('-------------------------------------------------')
        console.log(this.state.documentData)
        console.log('-------------------------------------------------')
        if (this.state.documentData.length === 0)
            this.setState({ gap5: 200 })
        else
            this.setState({ gap4: 220 })
    }


    cinetiadatrequest = async (uid) => {
        let initialQuery = await firebase.firestore().collection("users").doc(uid)
        let documentSnapshots = await initialQuery.get()
        let documentDataFriends = documentSnapshots.data()
        arr.push(documentDataFriends)
        this.setState({
            documentDataFriends: arr
        })

    }

    sendActivity = (url) => {
        let foo = {
            mood: this.state.mood,
            text: this.state.postText,
            taggedUsers: this.state.taggedUsers,
            activity: this.state.selectedActivity,
            //AICI SCHIMB 
            image: url,
            timestamp: Date.now(),
            hoursPosted: this.state.selectedValueHours,
            location: this.state.location,
            creatorId: firebase.auth().currentUser.uid
        }
        console.log(foo)

        if (this.state.public)
            firebase.firestore().collection('status-public').doc(firebase.auth().currentUser.uid).update({
              statuses: firebase.firestore.FieldValue.arrayUnion(foo)
            })


        firebase.firestore().collection('private').doc(firebase.auth().currentUser.uid).update({
            statuses: firebase.firestore.FieldValue.arrayUnion(foo)


        })

        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
            status: foo,

        })
    }

    renderHeader = () => {
        try {
            return (
                <SearchBar
                    showCancel={true}
                    lightTheme={true}
                    autoCorrect={false}
                    onChangeText={this.search}
                    value={this.state.searchText}
                    placeholder="Search users..."
                />
            )
        } catch (error) {
            console.log(error)
        }
    }

    renderFooter = () => {
        try {
            if (this.state.loading || this.state.refreshing) {
                return (<ActivityIndicator />)
            } else {
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }
    //Tagged users!
    addUserTag = (uid) => {
        let tagListIdsFinal = this.state.taggedUsers
        tagListIdsFinal.push(uid)
        this.setState({ taggedUsers: tagListIdsFinal })
    }

    removeUserTag = (uid) => {
        let tagListIdsFinal = this.state.taggedUsers
        for (let i = 0; i < tagListIdsFinal.length; i++)
            if (tagListIdsFinal[i] == uid)
                tagListIdsFinal.splice(i, 1)
        this.setState({ taggedUsers: tagListIdsFinal })
    }
    //Activities!
    addUserTag2 = (uid) => {
        this.setState({ selectedActivity: uid, gap3: 0 })
        console.log(this.state.selectedActivity)
        console.log(this.state.selectedActivity)
    }

    removeUserTag2 = (uid) => {
        if (this.state.selectedActivity === uid)
            console.log("Luati as rasa de dobitoc")

        this.setState({ selectedActivity: "", alreadySelected: false })

        console.log(this.state.selectedActivity, '-----------', this.state.alreadySelected)
    }
    createNewActivityInDb() {
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
            customActivities: this.state.documentData,
        })

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
                    leftIcon={<Text style={{
                        color: '#2089DC',
                        backgroundColor: '#f5f6fa',
                        borderRadius: 15,
                        padding: (this.state.selectedActivity === '') ? 0 : 10,
                        fontWeight: 'bold',
                    }}>{this.state.selectedActivity[0]}{this.state.selectedActivity[1]}{this.state.selectedActivity[2]}</Text>}
                    containerStyle={{ marginBottom: 0, paddingBottom: 0 }}
                    value={this.state.postText}
                    onChangeText={postText => this.setState({ postText })}
                />
                {/* -------------------TagFriends--------------------------- */}
                <View style={{ height: this.state.gap, width: (this.state.gap === 0) ? 0 : width * 0.8, backgroundColor: 'white' }}>



                    <FlatList
                        data={this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.state.documentDataFriends}
                        renderItem={({ item }) => (
                            <Friend mama={this.addUserTag} tata={this.removeUserTag} name={item.displayName} uid={item.uid} />
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
                {/* -------------------------Activity---------zp----------- */}
                <View style={{ height: this.state.gap3, width: (this.state.gap3 === 0) ? 0 : width * 0.8, backgroundColor: 'white' }}>

                    <View style={{ height: this.state.gap5 }}>
                        <Button title="Create your first custom activity!"
                            type="clear"
                            containerStyle={{
                                marginHorizontal: 15,
                                backgroundColor: '#f5f6fa',
                                borderRadius: 30,

                            }}
                            onPress={() => { this.setState({ gap6: 200, gap4: 220 }) }}
                        />
                    </View>
                    <View style={{ height: this.state.gap4 }}>
                        <FlatList
                            data={this.state.documentData}
                            renderItem={({ item }) => (


                                <ActivitySelect mama={this.addUserTag2} name={item} tata={this.removeUserTag2} />
                            )}
                            keyExtractor={(item, index) => String(index)}

                            onEndReached={this.retrieveMore}
                            onEndReachedThreshold={0}
                            refreshing={this.state.refreshing}
                        />
                        <Button title="Add more activities!"
                            type="clear"
                            containerStyle={{
                                marginHorizontal: 15,
                                backgroundColor: '#f5f6fa',
                                borderRadius: 30,

                            }}
                            onPress={() => { this.setState({ gap6: 200 }) }} />

                    </View>



                </View>



                {/* -------------------------Activity-------------------- */}
                {/* ----------------------------Activity Creator---------------- */}

                <View style={{ height: this.state.gap6, width: (this.state.gap6 === 0) ? 0 : width * 0.8, backgroundColor: 'white' }}>
                    <Input
                        placeholder={"Add a new activity!"}
                        placeholderTextColor="#B1B1B1"
                        returnKeyType="done"
                        textContentType="newPassword"
                        rightIcon={<Icon3 name={"ios-add"} size={28} onPress={() => {
                            console.log(this.state.input2)
                            let f = this.state.documentData
                            f.push(this.state.input2)
                            this.setState({
                                documentData: f,
                                input2: ''
                            })
                        }} />}
                        containerStyle={{ marginBottom: 0, paddingBottom: 0 }}
                        value={this.state.input2}
                        onChangeText={input2 => this.setState({ input2 })}
                    />
                    <View style={styles.container}>
                        <Button
                            title=" Done"
                            type="clear"
                            containerStyle={styles.button}
                            onPress={() => {
                                this.setState({ gap6: 0, gap5: 0 })
                                this.createNewActivityInDb()
                            }}
                        />

                    </View>
                </View>









                {/* ----------------------------Activity Creator---------------- */}

                {/* --------Main comp------------------------ */}
                <View style={styles.moodView}>
                    <Button
                        title="Activity"
                        type="clear"
                        icon={<Icon name={'basketball'} size={28} />}
                        containerStyle={styles.button}
                        onPress={() => {
                            if (this.state.gap3 === 0)
                                this.setState({ gap3: height / 3, gap: 0, gap2: 0, gap6: 0 })
                            else
                                this.setState({ gap3: 0 })
                        }}
                    />
                    <Button
                        title=" Tag friends"
                        type="clear"
                        icon={<Icon3 name={'md-pricetags'} size={28} />}
                        onPress={() => {
                            if (this.state.gap === 0)
                                this.setState({ gap: height / 3, gap2: 0, gap3: 0, gap6: 0 })
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
                                this.setState({ gap2: height / 3, gap: 0, gap3: 0, gap6: 0 })
                            else
                                this.setState({ gap2: 0 })
                        }}
                    />
                    <Button
                        title=" Visit"
                        type="clear"
                        icon={<Icon2 name={'location-on'} size={28} />}
                        containerStyle={styles.button}
                        onPress={() => { console.log(this.state.documentData) }}
                    />
                </View>
                <View style={styles.moodView}>
                    <Button
                        title={(this.state.public) ? " Public" : "Private"}
                        type="clear"
                        icon={(this.state.public) ? < Icon name={'earth'} size={28} /> : < Icon name={'lock'} size={28} />}
                        containerStyle={styles.button}
                        onPress={() => {

                            if (this.state.public)
                                this.setState({ public: false })
                            else
                                this.setState({ public: true })

                            // if (this.state.gap3 === 0)
                            //     this.setState({ gap3: height / 3, gap: 0, gap2: 0, gap6: 0 })
                            // else
                            //     this.setState({ gap3: 0 })
                        }}
                    />
                </View>
                <View style={styles.moodView}>
                    
                <Button title="Pick Image" onPress={this.pickImage}/>
                    <Button
                        title=" Done"
                        type="clear"
                        containerStyle={styles.button}
                        onPress={() => { this.uploadPhoto() }}

                    />

                    

                </View>

                <View style={styles.moodView}>

                <PlacesInput
                    googleApiKey="AIzaSyBV_c_ySGNav7CWXBhIWPvWpJIaKIWBP88"
                    placeHolder={"Search for location"}
                    language={"en-US"}
                    onSelect={place => {
                        this.setState({location: place.result.name})
                    //   console.log(place.result.name)
                    }}
                    
                />
                <Picker
                        selectedValue={this.state.selectedValueHours}
                        style={{height: 50, width: 150 }}
                        onValueChange={(itemValue, itemIndex) => {this.setState({selectedValueHours: itemValue})}}
                    >
                        <Picker.Item label="30min" value="30min"/>
                        <Picker.Item label="1h" value="1h"/>
                        <Picker.Item label="2h" value="2h"/>
                        <Picker.Item label="4h" value="4h"/>
                        <Picker.Item label="6h" value="6h"/>
                        <Picker.Item label="8h" value="8h"/>

                    </Picker>
               
                </View>
<Image style={{width: 50, height: 50}} source={{uri: this.state.imageUri}}/>
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