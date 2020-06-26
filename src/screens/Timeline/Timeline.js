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
    ScrollView


} from 'react-native';
import ActivityPopup from '../ActivityPop/ActivityPopup'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as theme from '../../styles/theme'
import SwipeablePanel from 'rn-swipeable-panel';
import Status from "../../components/Status"
import { AntDesign } from '@expo/vector-icons'
const { width, height } = Dimensions.get('window')
import ActivitySelect from '../ActivityPop/ActivitySelect'
import firebase from 'firebase';
import { divide } from "react-native-reanimated";
const screenHeight = Dimensions.get('screen').height;
import TimelinePost from './TimelinePost'
import TimelineOverlay from "./TimelineOverlay";
import { indexOf } from "lodash";
let arr = []


export default class Timeline extends React.Component {
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
            activityOverlay:false,
            activityData:[],
            moodOverlay: false,
            moodData: [],
            peopleOverlay: false,
            peopleData: [],
            clearFilter: false,
        }
        this.closeSwipablePanel = this.closeSwipablePanel.bind(this)
        this.renderOverlay = this.renderOverlay.bind(this)
        this.albumSelection = this.albumSelection.bind(this)
        this.peopleSelection = this.peopleSelection.bind(this)
        this.filterActivity = this.filterActivity.bind(this)
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
    //-------------------------------------------------Filtering------------------------------------------------------
    search = (searchText) => {
        this.setState({ searchText: searchText })
        let filteredData = this.state.documentDataFriends.filter(function (item) {
            return item.displayName.toLowerCase().includes(searchText)
        })
        this.setState({ filteredData: filteredData })
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
        let initialQuery = await firebase.firestore().collection("users").where("uid", "==", firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = documentSnapshots.docs.map(doc => doc.data())
        let bagPl = documentData[0].albums
        this.setState({ albumData: bagPl, albumOverlay: true })
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
        arr=[]
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
        console.log(documentData)
        this.setState({
            activityData: documentData, activityOverlay: true,
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
            peopleOverlay:false,
            activityOverlay:false,
            albumOverlay:false,
            moodOverlay:false,
        })
    }

    closeFilter = () => {
        this.setState({
            openFilter: false
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
        this.setState({ documentData: documentData })
    }


    render() {
        return (<View style={{ height: screenHeight, flex: 1 }}>
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
            <Overlay isVisible={this.state.showAct}


                onBackdropPress={() => { this.setState({ showAct: false }) }}
                // showCloseButton
                overlayStyle={{ position: "absolute", bottom: 0, width: width, top: 40 }}
                animationType='fade'
                transparent

            >
                <ActivityPopup papa={this.closeSwipablePanel} />
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


                    data={this.state.documentData}
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

                        // press={() => this.onPress(item)}

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
                flex: 1,
                position: 'absolute',
                alignItems: "center",
                right: 30,
                bottom: 30,
                opacity: (this.state.showAct) ? 0 : 1,

            }} onPress={() => { this.setState({ showAct: true }) }}>
                <Ionicons size={60} name={"ios-add"} style={[{ color: theme.colors.white, backgroundColor: theme.colors.blue, paddingHorizontal: 15, borderRadius: 60 }]} />
            </TouchableOpacity>
            <Overlay isVisible={this.state.openFilter} fullScreen animationType="slide">
                {/* zr */}
                <View style={{ flex: 1, flexDirection: 'column' }}>
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
                    <TouchableOpacity onPress={() => this.filterAlbum()} style={{ marginBottom: 10, marginTop: 20 }}>
                        <Text style={{ fontFamily: 'font1', fontSize: 14 }}>Album</Text>
                    </TouchableOpacity>
                    {(this.state.albumOverlay) ? (<ScrollView>
                        <FlatList
                            data={this.state.albumData}
                            renderItem={({ item }) => (


                                <ActivitySelect mama={this.albumSelection} name={item}/>
                            )}
                            keyExtractor={(item, index) => String(index)}

                            onEndReached={this.retrieveMore}
                            onEndReachedThreshold={0}
                            refreshing={this.state.refreshing}
                        />

                    </ScrollView>) : null}
                    <Divider />
                    <TouchableOpacity onPress={() => this.setState({moodOverlay:true})} style={{ marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'font1', fontSize: 14 }}>Mood</Text>
                    </TouchableOpacity>
                    {(this.state.moodOverlay) ? (<View><View style={styles.moodView}>
                        <Button
                            title=" Happy"
                            type="clear"
                            icon={<Icon name={'emoticon'} size={28} />}
                            containerStyle={styles.bigButton}
                            onPress={() => { this.setState({ mood: 'happy', rightIconEmoticon: 'emoticon', rightIconSize: 28, gap2: 0 }) }}

                        />
                        <Button
                            title=" Angry"
                            type="clear"
                            icon={<Icon name={'emoticon-angry'} size={28} />}
                            containerStyle={styles.bigButton}
                            onPress={() => { this.setState({ mood: 'angry', rightIconEmoticon: 'emoticon-angry', rightIconSize: 28, gap2: 0 }) }}

                        />
                    </View>

                    <View style={styles.moodView}>
                        <Button
                            title=" Cool"
                            type="clear"
                            icon={<Icon name={'emoticon-cool'} size={28} />}
                            containerStyle={styles.bigButton}
                            onPress={() => { this.setState({ mood: 'cool', rightIconEmoticon: 'emoticon-cool', rightIconSize: 28, gap2: 0 }) }}

                        />
                        <Button
                            title=" Sad"
                            type="clear"
                            icon={<Icon name={'emoticon-cry'} size={28} />}
                            containerStyle={styles.bigButton}
                            onPress={() => { this.setState({ mood: 'sad', rightIconEmoticon: 'emoticon-cry', rightIconSize: 28, gap2: 0 }) }}

                        />
                    </View>

                    <View style={styles.moodView}>
                        <Button
                            title=" Dead"
                            type="clear"
                            icon={<Icon name={'emoticon-dead'} size={28} />}
                            containerStyle={styles.bigButton}
                            onPress={() => { this.setState({ mood: 'dead', rightIconEmoticon: 'emoticon-dead', rightIconSize: 28, gap2: 0 }) }}

                        />
                        <Button
                            title=" Excited"
                            type="clear"
                            icon={<Icon name={'emoticon-excited'} size={28} />}
                            containerStyle={styles.bigButton}
                            onPress={() => { this.setState({ mood: 'excited', rightIconEmoticon: 'emoticon-excited', rightIconSize: 28, gap2: 0 }) }}

                        />
                    </View>

                    <View style={styles.moodView}>
                        <Button
                            title=" Flirty"
                            type="clear"
                            icon={<Icon name={'emoticon-kiss'} size={28} />}
                            containerStyle={styles.bigButton}
                            onPress={() => { this.setState({ mood: 'flirty', rightIconEmoticon: 'emoticon-kiss', rightIconSize: 28, gap2: 0 }) }}

                        />
                        <Button
                            title=" Ok"
                            type="clear"
                            icon={<Icon name={'emoticon-neutral'} size={28} />}
                            containerStyle={styles.bigButton}
                            onPress={() => { this.setState({ mood: 'ok', rightIconEmoticon: 'emoticon-neutral', rightIconSize: 28, gap2: 0 }) }}

                        />
                    </View></View>) : null}
                    <Divider />

                    <TouchableOpacity onPress={() => this.retrieveActivities()} style={{ marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'font1', fontSize: 14 }}>Activity</Text>
                    </TouchableOpacity>
                    {(this.state.activityOverlay) ? (<ScrollView>
                        <FlatList
                            data={this.state.activityData}
                            renderItem={({ item }) => (


                                <ActivitySelect mama={this.filterActivity} name={item}/>
                            )}
                            keyExtractor={(item, index) => String(index)}

                            onEndReached={this.retrieveMore}
                            onEndReachedThreshold={0}
                            refreshing={this.state.refreshing}
                        />

                    </ScrollView>) : null}
                    <Divider />

                    {/* <TouchableOpacity onPress={() => this.filterLocation()} style={{ marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'font1', fontSize: 14 }}>Location</Text>
                    </TouchableOpacity> */}
                    <Divider />

                    <TouchableOpacity style={{ marginVertical: 10 }} onPress={() => { this.filterPeople() }}>
                        <Text style={{ fontFamily: 'font1', fontSize: 14 }}>People</Text>
                    </TouchableOpacity>
                    {(this.state.peopleOverlay) ? (<ScrollView>
                        <FlatList
                            data={this.state.peopleData}
                            renderItem={({ item }) => (


                                <ActivitySelect mama={this.peopleSelection} name={item.displayName} otherData={item.uid}/>
                            )}
                            keyExtractor={(item, index) => String(index)}

                            onEndReached={this.retrieveMore}
                            onEndReachedThreshold={0}
                            refreshing={this.state.refreshing}
                        />

                    </ScrollView>) : null}
                </View>
            </Overlay>
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