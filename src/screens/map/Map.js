import React from "react"
import { Text, Button, Input, SearchBar, Divider, Overlay } from 'react-native-elements'
import { Constants, } from 'expo'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
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
    Image

} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as theme from '../../styles/theme'
import SwipeablePanel from 'rn-swipeable-panel';
import Status from "../../components/Status"
import { AntDesign } from '@expo/vector-icons'
const { width, height } = Dimensions.get('window')
let arr = []
import firebase from 'firebase';
const screenHeight = Dimensions.get('screen').height;

import { indexOf } from "lodash";

import MapView from 'react-native-maps';
import { Marker, Circle } from 'react-native-maps';

export default class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //Map related
            markers: [{ title: 'SalamFlorin', lat: 30, long: 30, image: "https://firebasestorage.googleapis.com/v0/b/witties.appspot.com/o/photos%2F3cC1InAfNfOvZMmjOpkS2pHS1ym2%2F1590143320795.jpg?alt=media&token=4873788e-f590-4962-b51c-b16f73bcd8e3" },
            { title: 'ZaArabia', lat: 45, long: 45, image: 'https://firebasestorage.googleapis.com/v0/b/witties.appspot.com/o/photos%2F3cC1InAfNfOvZMmjOpkS2pHS1ym2%2F1590143320795.jpg?alt=media&token=4873788e-f590-4962-b51c-b16f73bcd8e3' }],

            errorMessage: '',
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            hasLoadedMap: false,

            users: [],//list of users from which i retrieve info, if null it takes all of the friends of the user
            //for the current user
            location: null,
            currentUserProfilePic: '',
            currentUserName: '',
            futureLocation: false,
            futureLocationCoords: {},
            //misc
            mode: 'pic', //"pic"/"future"
            futureStatuses:[],

        }
        // this.closeSwipablePanel = this.closeSwipablePanel.bind(this)    
    }
    async componentDidMount() {
        arr = []

        this.findCurrentLocationAsync()
        if (typeof this.props.users === 'undefined') {
            console.log("iau toate postarile de la public")
            await this.getAllImages().then(this.setState({
                users: arr
            }))
        } else {
            console.log('iau doar astea transmise din props')
            this.props.users.forEach(element => this.retrieveImageFromOneUser(element))
            this.setState({ users: arr })
        }
        this.getProfilePicture()

    }
    async getProfilePicture() {
        let initialQuery = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data()
        let profilePic = documentData.profilePicture
        let name = documentData.displayName

        this.setState({ currentUserProfilePic: profilePic, currentUserName: name })
    }
    async getAllImages() {
        arr = []
        let initialQuery = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data().friends
        documentData.forEach(element => this.retrieveImageFromOneUser(element))
        // this.setState({ users: arr })
        console.log('ce caut eu este egal cu', this.state.users)
        // this.setState({ peopleData: sos, clearFilter: true,openFilter:false })


    }

    async retrieveImageFromOneUser(element) {
        let initialQuery = await firebase.firestore().collection('status-public').doc(element).get()
        // let documentData = await documentSnapshots.docs.map(doc => doc.data())
        let documentData = await initialQuery.data().futureLocation
        arr.push(documentData)
    }
    findCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {


            const latitude = JSON.stringify(position.coords.latitude)
            const longitude = JSON.stringify(position.coords.longitude)
            this.setState({ latitude, longitude })

        }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })
    }

    findCurrentLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION)

        if (status !== 'granted') {
            this.setState({ errorMessage: "Permission to acess location was denied" })
        }
        let location = await Location.getCurrentPositionAsync({})
        let cv = this.state.region
        cv.latitude = location.coords.latitude
        cv.longitude = location.coords.longitude
        this.setState({ location, region: cv, hasLoadedMap: true })
    }
    addFutureLocationCircle(loc) {
        console.log('fac ceva bun', loc)


        let circle = { lat: loc.latitude, long: loc.longitude, name:this.state.currentUserName, pic:this.state.currentUserProfilePic }
        firebase.firestore().collection("status-public").doc(firebase.auth().currentUser.uid).set({
            futureLocation: circle,
            creatorId: firebase.auth().currentUser.uid,
            

        })
        this.setState({ futureLocation: true, futureLocationCoords: circle, futureLocationSpamTimer: Date.now() })
    }


    onRegionChangeComplete(region) {

        this.setState({ region: region });

        console.log("haz")
    }
    render() {
        let text = ''
        if (this.state.errorMessage)
            text = this.state.errorMessage
        else if (this.state.location)
            text = JSON.stringify(this.state.location)

        return (<View style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: "row-reverse", position: "absolute", bottom: 15, right: 15, left: 15, zIndex: 1, }}>
                <Button title="" type='clear' icon={<MaterialCommunityIcons name={'timetable'} size={28} />} containerStyle={{
                    borderRadius: 30, marginHorizontal: 5, backgroundColor: '#f5f6fa',
                }}
                onPress={()=>{this.state.mode === 'pic' ? this.setState({mode:'future'}):this.setState({mode:'pic'})}}
                />
                <Button title="" type='clear' icon={<MaterialIcons name={'my-location'} size={28} />} containerStyle={{
                    borderRadius: 30,
                    marginHorizontal: 5,
                    backgroundColor: '#f5f6fa',
                }} onPress={() => {
                    this.setState({ animating: true })
                    this.map.animateToRegion({
                        latitude: this.state.location.coords.latitude,
                        longitude: this.state.location.coords.longitude,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.0421,
                    }, 1000)
                    console.log(this.state.location, "te")
                }} /></View>


            {this.state.hasLoadedMap ? <MapView
                style={{ marginTop: 30, height: screenHeight, width: width }}
                showsUserLocation={true}
                showsMyLocationButton={false}
                onLongPress={e => {
                    console.log(e.nativeEvent.coordinate)
                    if (this.state.futureLocation)
                        this.setState({ futureLocation: false })
                    else
                        this.addFutureLocationCircle(e.nativeEvent.coordinate)
                }}
                initialRegion={this.state.region}
                ref={(map) => { this.map = map; }}
                onRegionChangeComplete={region => { this.onRegionChangeComplete(region) }}


            >

                {this.state.mode === "pic" ?
                    this.state.markers.map(marker => (
                        <Marker
                            coordinate={{ latitude: marker.lat, longitude: marker.long }}
                            title={marker.title}
                            description={marker.description}
                            style={{ alignItems: 'center', alignContent: 'center' }}
                        ><Image source={{ uri: marker.image }} style={{ height: 60, width: 60 }} /></Marker>
                    )) : this.state.futureStatuses.map( ceva =>(
                        <Marker
                            
                            coordinate={{ latitude: ceva.lat, longitude: ceva.long }}
                            style={{ alignItems: 'center', alignContent: 'center', alignItems: 'center' }}
                            title={ceva.name}
                        ><Image source={{ uri: ceva.pic }} style={{ height: 40, width: 40, borderRadius: 60, borderWidth: 1, borderColor: 'black' }} /></Marker>
                    
                    ))}
                {this.state.futureLocation ?
                    <View>
                        {/* <Circle
                            key={(this.state.futureLocationCoords.lat+this.state.futureLocationCoords.lat)*2}
                            center={{ latitude: this.state.futureLocationCoords.lat, longitude: this.state.futureLocationCoords.long }}
                            radius={250}
                            fillColor={'rgba(216,216,216,0.5)'}
                        /> */}

                        <Marker
                            // key={this.state.futureLocationCoords.lat+this.state.futureLocationCoords.lat}
                            coordinate={{ latitude: this.state.futureLocationCoords.lat, longitude: this.state.futureLocationCoords.long }}
                            style={{ alignItems: 'center', alignContent: 'center', alignItems: 'center' }}
                            title={this.state.currentUserName}
                        ><Image source={{ uri: this.state.currentUserProfilePic }} style={{ height: 40, width: 40, borderRadius: 60, borderWidth: 1, borderColor: 'black' }} /></Marker>
                    </View>



                    : null}

            </MapView> : null}

            {/* <Text>{text}</Text> */}

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
        marginHorizontal: 5,
        backgroundColor: '#f5f6fa',
        borderRadius: 30,
        width: 50,

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
    }
})