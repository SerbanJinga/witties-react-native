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
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
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
import { Marker } from 'react-native-maps';
// import { region } from "firebase-functions"
export default class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            usersRetrievingFrom: props.users,
            markers: [{ title: 'SalamFlorin', lat: 30, long: 30, image: "https://firebasestorage.googleapis.com/v0/b/witties.appspot.com/o/photos%2F3cC1InAfNfOvZMmjOpkS2pHS1ym2%2F1590143320795.jpg?alt=media&token=4873788e-f590-4962-b51c-b16f73bcd8e3" },
            { title: 'ZaArabia', lat: 45, long: 45, image: 'https://firebasestorage.googleapis.com/v0/b/witties.appspot.com/o/photos%2F3cC1InAfNfOvZMmjOpkS2pHS1ym2%2F1590143320795.jpg?alt=media&token=4873788e-f590-4962-b51c-b16f73bcd8e3' }],
            location: null,
            errorMessage: '',
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            hasLoadedMap: false,
            users: [],
        }
        // this.closeSwipablePanel = this.closeSwipablePanel.bind(this)    
    }
    async componentDidMount() {
        arr = []
        this.findCurrentLocationAsync()
        if (typeof this.props.users === 'undefined') {
            console.log("iau toate postarile de la public")
            this.getAllImages()
        } else {
            console.log('iau doar astea transmise din props')
            this.props.users.forEach(element => this.retrieveImageFromOneUser(element))
            this.setState({ users: arr })
        }

    }
    async getAllImages() {
        arr = []
        let initialQuery = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.data().friends
        documentData.forEach(element => this.retrieveImageFromOneUser(element))
        this.setState({ users: arr })
        console.log('ce caut eu este egal cu', this.state.users)
        // this.setState({ peopleData: sos, clearFilter: true,openFilter:false })


    }

    async retrieveImageFromOneUser(element) {
        let initialQuery = await firebase.firestore().collection('status-public').doc(element).collection('statuses')
        let documentSnapshots = await initialQuery.get()
        let documentData = await documentSnapshots.docs.map(doc => doc.data())
        documentData.forEach(doc => arr.push(doc))


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
        console.log('fac ceva bun',loc)
        let arr2 = this.state.markers
        
        let tempMarker = { title: 'SalamFlorin', lat: loc.latitude, long: loc.longitude, image: 'https://www.shorturl.at/img/shorturl-square.png' }
        console.log(tempMarker)
        arr2.push(tempMarker)
        this.setState({markers:arr2})
    }
    render() {
        let text = ''
        if (this.state.errorMessage)
            text = this.state.errorMessage
        else if (this.state.location)
            text = JSON.stringify(this.state.location)

        return (<View>
            {this.state.hasLoadedMap ? <MapView
                style={{ height: height - 200, width: width }}
                showsUserLocation={true}
                onPress={e => {
                    console.log(e.nativeEvent.coordinate)
                    this.addFutureLocationCircle(e.nativeEvent.coordinate)
                }}
                region={this.state.region}
                onRegionChange={this.onRegionChange}
                

            >

                {this.state.markers.map(marker => (
                    <Marker
                        coordinate={{ latitude: marker.lat, longitude: marker.long }}
                        title={marker.title}
                        description={marker.description}
                        style={{ alignItems: 'center', alignContent: 'center' }}
                    ><Image source={{ uri: marker.image }} style={{ height: 60, width: 60 }} /></Marker>
                ))}
            </MapView> : null}

            <Text>{text}</Text>
            <Button title='log' onPress={() => { console.log(this.state.users) }} />
        </View>)
    }
}