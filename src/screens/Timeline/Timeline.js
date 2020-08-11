import React from "react"
import { Text, Button, Input, SearchBar, Divider, Overlay } from 'react-native-elements'
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
} from 'react-native';

import ActivityPopup from '../ActivityPop/ActivityPopup'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as theme from '../../styles/theme'
import SwipeablePanel from 'rn-swipeable-panel';
import Status from "../../components/Status"
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
const { width, height } = Dimensions.get('window')
import ActivitySelect from '../ActivityPop/ActivitySelect'
import firebase from 'firebase';
import { divide } from "react-native-reanimated";
const screenHeight = Dimensions.get('screen').height;
import TimelinePost from './TimelinePost'
import TimelineOverlay from "./TimelineOverlay";
import { indexOf } from "lodash";
import { withNavigation } from "react-navigation";
let arr = []


class Timeline extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            documentDataFriends: [],
            plusSize: 30,
            showAct: false,
            documentData: [],
            lastVisible: null,
            loading: false,
            refreshing: false,
            filteredData: [],
            showOverlay: false,
            id: '',
            limit: 20,
            openFilter: false,
            //Filtering
            albumOverlay: false,
            albumData: [],
            activityOverlay: false,
            activityData: [],
            moodOverlay: false,
            moodData: [],
            peopleOverlay: false,
            peopleData: [],
            clearFilter: false,
            userName: "",
            albumOptions: false,
            newAlbumText: '',
            activitiesOptions: false,
            newActivityText: '',
            mood: ''
        }
        this.closeSwipablePanel = this.closeSwipablePanel.bind(this)
        this.renderOverlay = this.renderOverlay.bind(this)
        this.albumSelection = this.albumSelection.bind(this)
        this.peopleSelection = this.peopleSelection.bind(this)
        this.filterActivity = this.filterActivity.bind(this)
    }

    addActivities = () => {
        this.setState({
            activitiesOptions: true
        })
    }

    closeAddActivities = () => {
        this.setState({
            activitiesOptions: false
        })
    }
    componentDidMount() {
        console.log("De aici vine", this.state.displayName)
        arr = []
        this.retrieveData()
        console.log('=a-ra=r-apkfakfaf')
        console.log(screenHeight, "   vs  ", height)
        console.log(this.state.documentDataFriends)
        //Dau reverse la array
        // let reverted = this.state.documentData.reverse()
        // this.setState({ documentData: reverted })
    }
    renderHeader() {
        return (<View>
            <Text>TIMELINE</Text>
            <Divider />
        </View>)
    }

    filterByMood = async() => {
        let initialQuery = await firebase.firestore().collection('private').doc(firebase.auth().currentUser.uid).collection('statuses').where('mood', '==', this.state.mood).get()
        let data = initialQuery.docs.map(doc => doc.data())
        this.setState({ documentData: data, clearFilter: true, openFilter: false })

    }
    //-------------------------------------------------Filtering------------------------------------------------------
    search = async(searchText) => {
        this.setState({ searchText: searchText })
        let query = await firebase.firestore().collection('private').doc(firebase.auth().currentUser.uid).collection('statuses').where('text', '>=', searchText).get()
        let documentData = query.docs.map(doc => doc.data())
        console.log(documentData)
        this.setState({ filteredData: documentData })
    }


    // filterDate = async() => {
    //     this.setState({
    //         openFilter: false
    //     })
    //     let initialQuery = await firebase.firestore().collection('private').doc(firebase.auth().currentUser.uid)
    //     let documentSnapshots = await initialQuery.get()
    //     let documentData = await documentSnapshots.data().statuses
    //     documentData.sort(function(a,b){
    //         return a.timestamp - b.timestamp
    //     })

    //     this.setState({
    //         documentData: documentData,
    //     })
    // }
    async filterAlbum() {
        // let initialQuery = await firebase.firestore().collection("users").where("uid", "==", firebase.auth().currentUser.uid)
        // let documentSnapshots = await initialQuery.get()
        // let documentData = documentSnapshots.docs.map(doc => doc.data())
        // let bagPl = documentData[0].albums
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).onSnapshot((doc) => {
            let documentData = doc.data().albums
            this.setState({
                albumData: documentData,
                
            })
        })
        this.setState({ albumOverlay: true })
    }

    async peopleSelection(ceva) {
        console.log("people selection", ceva)
        let initialQuery = await firebase.firestore().collection("private").doc(firebase.auth().currentUser.uid).collection("statuses").where("taggedUsers", "array-contains", ceva)//orderBy("timestamp", "desc")
        let documentSnapshots = await initialQuery.get()
        let sos = documentSnapshots.docs.map(document => document.data())
        let idMap = documentSnapshots.docs.map(document => document.id)
        for (let i = 0; i < idMap.length; i++) {
            sos[i].id = idMap[i]
        }
        console.log("array ul de albume trb sa fie egal cu", sos)
        this.setState({ documentData: sos, clearFilter: true, openFilter: false })

    }

    async albumSelection(ceva) {
        console.log("album selection", ceva)
        let initialQuery
        initialQuery = await firebase.firestore().collection("private").doc(firebase.auth().currentUser.uid).collection("statuses").where("albums", "array-contains", ceva)//orderBy("timestamp", "desc")
        let documentSnapshots = await initialQuery.get()
        let sos = documentSnapshots.docs.map(document => document.data())
        let idMap = documentSnapshots.docs.map(document => document.id)
        for (let i = 0; i < idMap.length; i++) {
            sos[i].id = idMap[i]
        }
        console.log("array ul de albume trb sa fie egal cu", sos)
        this.setState({ documentData: sos, clearFilter: true, openFilter: false })

    }
    async filterPeople() {
        arr = []
        let initialQuery = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data().friends
        documentData.forEach(element => this.retrievePeople(element))
        // this.setState({ peopleData: sos, clearFilter: true,openFilter:false })
    }

    retrievePeople = async (uid) => {

        let initialQuery = await firebase.firestore().collection("users").doc(uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = documentSnapshots.data()
        arr.push(documentData)
        // arr.sort((a, b) => {
        //     return a.displayName > b.displayName
        // })
        this.setState({
            peopleData: arr, peopleOverlay: true,
            // clearFilter:true,openFilter:false,
        })
    }
    retrieveActivities = async () => {

        let initialQuery = await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = documentSnapshots.data().customActivities
        // arr.push(documentData)
        // arr.sort((a, b) => {
        //     return a.displayName > b.displayName
        // })

        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).onSnapshot((doc) => {
            let documentData = doc.data().customActivities
            this.setState({
                activityData: documentData,
                
            })
        })     
        this.setState({
            activityOverlay: true,
            // clearFilter:true,openFilter:false,
        })
    }



    filterMood = async () => {
        this.setState({
            moodOverlay: true
        })
    }

    filterLocation = async () => {
        this.setState({
            openFilter: false
        })
        let initialQuery = await firebase.firestore().collection('private').doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data().statuses
        documentData.sort(function (a, b) {
            return a.location < b.location
        })

        this.setState({
            documentData: documentData,
        })
    }

    filterActivity = async (ceva) => {
        this.setState({
            openFilter: false
        })
        let initialQuery = await firebase.firestore().collection("private").doc(firebase.auth().currentUser.uid).collection("statuses").where("activity", "==", ceva)//orderBy("timestamp", "desc")
        let documentSnapshots = await initialQuery.get()
        let sos = documentSnapshots.docs.map(document => document.data())
        let idMap = documentSnapshots.docs.map(document => document.id)
        for (let i = 0; i < idMap.length; i++) {
            sos[i].id = idMap[i]
        }
        console.log("array ul de albume trb sa fie egal cu", sos)
        this.setState({ documentData: sos, clearFilter: true, openFilter: false })


    }



    //-------------------------------------------------------Overlays--------------------------
    renderOverlay(id) {
        console.log('------------------------------------------------')
        console.log(id)
        console.log('------------------------------------------------')
        this.setState({ id: id, showOverlay: true })
    }

    closeSwipablePanel = (foo) => {
        this.setState({ showAct: false })
        let fasdas = this.state.documentData
        if (typeof foo === 'undefined')
            return;

        fasdas.unshift(foo)
        this.setState({ documentData: fasdas })

    }

    openFilter = () => {
        this.setState({
            openFilter: true,
            peopleOverlay: false,
            activityOverlay: false,
            albumOverlay: false,
            moodOverlay: false,
        })
    }

    closeFilter = () => {
        this.setState({
            openFilter: false
        })
    }

    openAlbumOptionsOverlay = () => {
        this.setState({
            albumOptions: true
        })
    }

    closeAlbumOptionsOverlay = () => {
        this.setState({
            albumOptions: false
        })
    }

    createNewAlbum = async() => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            albums: firebase.firestore.FieldValue.arrayUnion(this.state.newAlbumText)
        })
    }

    createNewActivity = async() => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            customActivities: firebase.firestore.FieldValue.arrayUnion(this.state.newActivityText)
        })
    }

    //---------------------------------------------------Data retrival------------------------------------
    async retrieveData() {
        let initialQuery = await firebase.firestore().collection("private").doc(firebase.auth().currentUser.uid).collection('statuses').orderBy("timestamp", "desc")
        let documentSnapshots = await initialQuery.get()
        let documentData = documentSnapshots.docs.map(document => document.data())
        let idMap = documentSnapshots.docs.map(document => document.id)
        for (let i = 0; i < idMap.length; i++) {
            documentData[i].id = idMap[i]
        }

        let query = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
        let data = await query.data().displayName
        this.setState({
            userName: data
        })
        this.setState({ documentData: documentData })
    }


    render() {
        return (<SafeAreaView style={{ height: screenHeight, flex: 1, width: width, backgroundColor: '#fff' }}>
            <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                <SearchBar round placeholder="Search" style={{ fontFamily: 'font1', padding: 20 }} lightTheme inputStyle={{ fontFamily: 'font1' }} placeholderTextColor="#ecedef" containerStyle={{
                    backgroundColor: "#fff",
                    borderBottomColor: '#ecedef',
                    borderTopColor: '#ecedef',
                    borderLeftColor: '#ecedef',
                    borderRightColor: '#ecedef',
                    borderWidth: 1,
                    borderRadius: 10,
                    margin: 10,
                    width: width / 1.2
                }} inputContainerStyle={{ backgroundColor: '#fff', height: 30 }} value={this.state.searchText} onChangeText={this.search} />
                <TouchableOpacity onPress={() => this.openFilter()}>
                    <AntDesign name="filter" size={20} />
                </TouchableOpacity>


            </View>
            {(this.state.clearFilter) ? <Button title='Clear Filters' onPress={() => {
                this.retrieveData()
                this.setState({ clearFilter: false })
            }} /> : null}
            <Overlay fullScreen isVisible={this.state.showAct}


                onBackdropPress={() => { this.setState({ showAct: false }) }}
                // showCloseButton
                // overlayStyle={{ position: "absolute", bottom: 0, width: width, top: 40 }}
                animationType='slide'
                transparent

            >

                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                        <TouchableOpacity onPress={() => this.setState({ showAct: false })}>
                            <AntDesign
                                size={26}
                                name="down"
                                color="#b2b8c2"
                            />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Add Post</Text>
                        <AntDesign
                            size={26}
                            name="bars"
                            color="#b2b8c2"
                        />
                    </View>

                    <ActivityPopup name={this.state.userName} papa={this.closeSwipablePanel} />
                </SafeAreaView>
            </Overlay>

            <Overlay isVisible={this.state.showOverlay}


                onBackdropPress={() => { this.setState({ showOverlay: false }) }}

                overlayStyle={{ position: "absolute", left: 15, right: 15, borderRadius: 30, }}
                animationType='fade'
                transparent

            >

                <TimelineOverlay id={this.state.id} />
            </Overlay>
            {/* //(this.state.documentData[index].date === item.date) */}
            {/* <Text h4 style={{paddingTop:30}}>spatiu sus bro</Text> */}

            <View style={{ alignItems: 'center' }}>
                <FlatList
                    // decelerationRate={0}


                    data = {this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.state.documentData}
                    renderItem={({ item, index }) => (

                        <TimelinePost
                            postedFor={item.hoursPosted}
                            activity={item.activity}
                            mood={item.mood}
                            text={item.text}
                            creatorId={item.creatorId}
                            timestamp={item.timestamp}
                            image={item.image}
                            showOverlay={this.renderOverlay}
                            id={item.id}

                            press={() => this.props.navigation.navigate('TimelinePostDetail', { imageUri: item.image })}

                        />

                    )}
                    keyExtractor={(item, index) => String(index)}
                    ListHeaderComponent={<View style={{ height: 150 }}></View>}
                    // ListFooterComponent={}
                    // ItemSeparatorComponent={(item) => (<Text>{item.date}</Text>)}
                    onEndReached={this.retrieveMore}
                    onEndReachedThreshold={1}
                    columnWrapperStyle={{ flexDirection: "row-reverse" }}
                    refreshing={this.state.refreshing}
                    inverted
                    numColumns={3}



                />


            </View>
            <TouchableOpacity style={{
                // flex: 1,
                position: 'absolute',
                alignItems: "center",
                justifyContent: 'center',
                right: 30,
                bottom: 30,
                borderRadius: 60
            }} onPress={() => { this.setState({ showAct: true }) }}>
                <MaterialIcons name="add-circle" size={60} color={theme.colors.blue} />
            </TouchableOpacity>
            <Overlay isVisible={this.state.openFilter} fullScreen animationType="slide">
                {/* zr */}
                <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.closeFilter()}
                            style={{
                                alignSelf: 'flex-end',
                                alignItems: 'center',
                                backgroundColor: 'transparent',
                            }}>
                            <AntDesign
                                name="close"
                                style={{ color: "#000", fontSize: 30 }}

                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontFamily: 'font1', marginLeft: 4 }}>Filter Search</Text>
                    </View>
                    <TouchableOpacity onPress={async () => await this.filterAlbum()} style={{ marginBottom: 10, marginTop: 20 }}>
                        <Text style={{ fontFamily: 'font1', fontSize: 14 }}>Album</Text>
                    </TouchableOpacity>

                    <Overlay animationType="slide" isVisible={this.state.albumOverlay} fullScreen>
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                                <TouchableOpacity onPress={() => this.setState({ albumOverlay: false })}>
                                    <AntDesign
                                        size={26}
                                        name="down"
                                        color="#b2b8c2"
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Albums</Text>
                                <TouchableOpacity onPress={() => this.openAlbumOptionsOverlay()}>
                                    <AntDesign
                                        size={26}
                                        name="plus"
                                        color="#b2b8c2"
                                    />
                                </TouchableOpacity>

                            </View>

                            <Overlay fullScreen animationType="slide" onBackdropPress={() => this.closeAlbumOptionsOverlay()} isVisible={this.state.albumOptions}>
                                <SafeAreaView style={{ flex: 1 }}>
                                    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                                        <TouchableOpacity onPress={() => this.closeAlbumOptionsOverlay()}>
                                            <AntDesign
                                                size={26}
                                                name="down"
                                                color="#b2b8c2"
                                            />
                                        </TouchableOpacity>
                                        <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Add Albums</Text>
                                        <TouchableOpacity onPress={() => this.openAlbumOptionsOverlay()}>
                                            <AntDesign
                                                size={26}
                                                name="plus"
                                                color="#b2b8c2"
                                            />
                                        </TouchableOpacity>

                                    </View>

                                    <Input
                                        placeholder="Add Album..."
                                        placeholderTextColor="#B1B1B1"
                                        returnKeyType="done"
                                        containerStyle={{ marginBottom: 0, paddingBottom: 0 }}
                                        value={this.state.newAlbumText}
                                        onChangeText={newAlbumText => this.setState({ newAlbumText })}
                                    />

                                    <TouchableOpacity style={{alignSelf: 'center'}} onPress={() => this.createNewAlbum()}>
                                        <Text style={{fontFamily: 'font1', color: theme.colors.blue, fontSize: 16}}>Add Album</Text>
                                    </TouchableOpacity>
                                </SafeAreaView>

                            </Overlay>
                            <FlatList
                                data={this.state.albumData}
                                renderItem={({ item }) => (


                                    <ActivitySelect mama={this.albumSelection} name={item} />
                                )}
                                keyExtractor={(item, index) => String(index)}

                                onEndReached={this.retrieveMore}
                                onEndReachedThreshold={0}
                                refreshing={this.state.refreshing}
                            />

                        </SafeAreaView>
                    </Overlay>

                    <Divider />
                    <TouchableOpacity onPress={() => this.setState({ moodOverlay: true })} style={{ marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'font1', fontSize: 14 }}>Mood</Text>
                    </TouchableOpacity>
                    <Overlay fullScreen animationType="slide" isVisible={this.state.moodOverlay}>
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                                <TouchableOpacity onPress={() => this.setState({ moodOverlay: false })}>
                                    <AntDesign
                                        size={26}
                                        name="down"
                                        color="#b2b8c2"
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Mood</Text>
                                <AntDesign
                                    size={26}
                                    name="bars"
                                    color="#b2b8c2"
                                />
                            </View>

                            <View style={styles.moodView}>
                                <Button
                                    title=" Happy"
                                    type="clear"
                                    icon={<Icon name={'emoticon'} size={28} />}
                                    containerStyle={styles.bigButton}
                                    onPress={() => { this.setState({ mood: 'happy', rightIconEmoticon: 'emoticon', rightIconSize: 28, gap2: 0 })
                                    this.filterByMood() }}

                                />
                                <Button
                                    title=" Angry"
                                    type="clear"
                                    icon={<Icon name={'emoticon-angry'} size={28} />}
                                    containerStyle={styles.bigButton}
                                    onPress={() => { this.setState({ mood: 'angry', rightIconEmoticon: 'emoticon-angry', rightIconSize: 28, gap2: 0 })
                                    this.filterByMood() }}

                                />
                            </View>

                            <View style={styles.moodView}>
                                <Button
                                    title=" Cool"
                                    type="clear"
                                    icon={<Icon name={'emoticon-cool'} size={28} />}
                                    containerStyle={styles.bigButton}
                                    onPress={() => { this.setState({ mood: 'cool', rightIconEmoticon: 'emoticon-cool', rightIconSize: 28, gap2: 0 })
                                    this.filterByMood() }}

                                />
                                <Button
                                    title=" Sad"
                                    type="clear"
                                    icon={<Icon name={'emoticon-cry'} size={28} />}
                                    containerStyle={styles.bigButton}
                                    onPress={() => { this.setState({ mood: 'sad', rightIconEmoticon: 'emoticon-cry', rightIconSize: 28, gap2: 0 })
                                    this.filterByMood() }}

                                />
                            </View>

                            <View style={styles.moodView}>
                                <Button
                                    title=" Dead"
                                    type="clear"
                                    icon={<Icon name={'emoticon-dead'} size={28} />}
                                    containerStyle={styles.bigButton}
                                    onPress={() => { this.setState({ mood: 'dead', rightIconEmoticon: 'emoticon-dead', rightIconSize: 28, gap2: 0 }) 
                                    this.filterByMood()}}

                                />
                                <Button
                                    title=" Excited"
                                    type="clear"
                                    icon={<Icon name={'emoticon-excited'} size={28} />}
                                    containerStyle={styles.bigButton}
                                    onPress={() => { this.setState({ mood: 'excited', rightIconEmoticon: 'emoticon-excited', rightIconSize: 28, gap2: 0 })
                                    this.filterByMood() }}

                                />
                            </View>

                            <View style={styles.moodView}>
                                <Button
                                    title=" Flirty"
                                    type="clear"
                                    icon={<Icon name={'emoticon-kiss'} size={28} />}
                                    containerStyle={styles.bigButton}
                                    onPress={() => { this.setState({ mood: 'flirty', rightIconEmoticon: 'emoticon-kiss', rightIconSize: 28, gap2: 0 })
                                    this.filterByMood() }}

                                />
                                <Button
                                    title=" Ok"
                                    type="clear"
                                    icon={<Icon name={'emoticon-neutral'} size={28} />}
                                    containerStyle={styles.bigButton}
                                    onPress={() => { this.setState({ mood: 'ok', rightIconEmoticon: 'emoticon-neutral', rightIconSize: 28, gap2: 0 })
                                    this.filterByMood() }}

                                />
                            </View>
                        </SafeAreaView>
                    </Overlay>
                    <Divider />

                    <TouchableOpacity onPress={() => this.retrieveActivities()} style={{ marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'font1', fontSize: 14 }}>Activity</Text>
                    </TouchableOpacity>
                    <Overlay fullScreen animationType="slide" isVisible={this.state.activityOverlay}>
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                                <TouchableOpacity onPress={() => this.setState({ activityOverlay: false })}>
                                    <AntDesign
                                        size={26}
                                        name="down"
                                        color="#b2b8c2"
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Activities</Text>
                                <TouchableOpacity onPress={() => this.addActivities()}>
                                <AntDesign
                                    size={26}
                                    name="plus"
                                    color="#b2b8c2"
                                />
                                </TouchableOpacity>
                            </View>

                            <Overlay isVisible={this.state.activitiesOptions} fullScreen animationType='slide'>
                            <SafeAreaView style={{flex: 1}}>
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                                <TouchableOpacity onPress={() => this.closeAddActivities()}>
                                    <AntDesign
                                        size={26}
                                        name="down"
                                        color="#b2b8c2"
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Add Activity</Text>
                                <TouchableOpacity onPress={() => this.addActivities()}>
                                <AntDesign
                                    size={26}
                                    name="plus"
                                    color="#b2b8c2"
                                />
                                </TouchableOpacity>
                            </View>

                            <Input
                                        placeholder="Add Activity..."
                                        placeholderTextColor="#B1B1B1"
                                        returnKeyType="done"
                                        containerStyle={{ marginBottom: 0, paddingBottom: 0 }}
                                        value={this.state.newActivityText}
                                        onChangeText={newActivityText => this.setState({ newActivityText })}
                                    />
                                     <TouchableOpacity style={{alignSelf: 'center'}} onPress={() => this.createNewActivity()}>
                                        <Text style={{fontFamily: 'font1', color: theme.colors.blue, fontSize: 16}}>Add Activity</Text>
                                    </TouchableOpacity>
                            </SafeAreaView>
                            </Overlay>

                            <ScrollView>
                                <FlatList
                                    data={this.state.activityData}
                                    renderItem={({ item }) => (


                                        <ActivitySelect mama={this.filterActivity} name={item} />
                                    )}
                                    keyExtractor={(item, index) => String(index)}

                                    onEndReached={this.retrieveMore}
                                    onEndReachedThreshold={0}
                                    refreshing={this.state.refreshing}
                                />

                            </ScrollView>
                        </SafeAreaView>
                    </Overlay>
                    <Divider />

                    {/* <TouchableOpacity onPress={() => this.filterLocation()} style={{ marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'font1', fontSize: 14 }}>Location</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={{ marginVertical: 10 }} onPress={() => { this.filterPeople() }}>
                        <Text style={{ fontFamily: 'font1', fontSize: 14 }}>People</Text>
                    </TouchableOpacity>
                    <Overlay fullScreen animationType="slide" isVisible={this.state.peopleOverlay}>
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                                <TouchableOpacity onPress={() => this.setState({ peopleOverlay: false })}>
                                    <AntDesign
                                        size={26}
                                        name="down"
                                        color="#b2b8c2"
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'font1', fontSize: 20 }}>People</Text>
                                <AntDesign
                                    size={26}
                                    name="bars"
                                    color="#b2b8c2"
                                />
                            </View>
                            <ScrollView>
                                <FlatList
                                    data={this.state.peopleData}
                                    renderItem={({ item }) => (


                                        <ActivitySelect mama={this.peopleSelection} name={item.displayName} otherData={item.uid} />
                                    )}
                                    keyExtractor={(item, index) => String(index)}

                                    onEndReached={this.retrieveMore}
                                    onEndReachedThreshold={0}
                                    refreshing={this.state.refreshing}
                                />

                            </ScrollView>
                        </SafeAreaView>
                    </Overlay>
                </SafeAreaView>
            </Overlay>
        </SafeAreaView>)
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
    },
    overlay: {
        flex: 1,
        position: 'absolute',
        left: width,

        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'blue',


    }, shadow: {
        shadowColor: theme.colors.black,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    bigButton: {
        marginHorizontal: 15,
        backgroundColor: '#f5f6fa',
        borderRadius: 30,
        width: width * 0.3,

    },
    moodView: {
        flexDirection: "row",
        justifyContent: 'center',
        marginBottom: 10,
    },
})

export default withNavigation(Timeline)