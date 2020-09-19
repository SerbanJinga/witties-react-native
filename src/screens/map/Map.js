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
import Geocoder from 'react-native-geocoding'
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-easy-toast'
let circle = {}

import MapView from 'react-native-maps';
import { Marker, Circle } from 'react-native-maps';
import { Avatar } from 'react-native-elements'
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
            pickTime: false,
            valueOfPicker: Date.now(),
            users: [],//list of users from which i retrieve info, if null it takes all of the friends of the user
            //for the current user
            location: null,
            currentUserProfilePic: '',
            currentUserName: '',
            futureLocation: false,
            futureLocationCoords: {},
            //misc
            mode: 'pic', //"pic"/"future"
            futureStatuses: [],
            myUsername: "",
            street: "",
            receive_map_notifications: true

        }
        // this.closeSwipablePanel = this.closeSwipablePanel.bind(this)    
    }

    getLocationFromCoords = async (lat, long) => {
        // const location = await Location.getCurrentPositionAsync({})
        const result = await Location.reverseGeocodeAsync({
            latitude: lat,
            longitude: long
        })
        let street
        result.find(mata => {
            street = mata.street
        })

        this.setState({
            street: street
        })

        console.log(street)
    }

    getUserSettings = async () => {
        let query = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
        let cv = await query.data().userSettings
        this.setState({ receive_map_notifications: cv.receive_map_notifications })
    }

    async componentDidMount() {
        arr = []
        this.findCurrentLocationAsync()
        if (typeof this.props.users === 'undefined') {
            console.log("iau toate postarile de la public")
            await this.getAllImages()
            console.log('ce caut eu este egal cu', this.state.users)

        } else {
            console.log('iau doar astea transmise din props')
            this.props.users.forEach(element => this.retrieveImageFromOneUser(element))
            this.setState({ users: arr })
            console.log('ce caut eu este egal cu', this.state.users)

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
        documentData.push(firebase.auth().currentUser.uid)
        documentData.forEach(async element => await this.retrieveImageFromOneUser(element))
        // this.setState({ users: arr })
        // this.setState({ peopleData: sos, clearFilter: true,openFilter:false })


    }

    async retrieveImageFromOneUser(element) {
        let initialQuery = await firebase.firestore().collection('status-public').doc(element).get()
        let documentData = await initialQuery.data().futureLocation
        if (documentData) {
            arr.push(documentData)
        }
        // arr.push(documentData)
        this.setState({
            users: arr
        })

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


        circle = { lat: loc.latitude, long: loc.longitude, name: this.state.currentUserName, pic: this.state.currentUserProfilePic }
        this.setState({ futureLocation: true, futureLocationCoords: circle, futureLocationSpamTimer: Date.now() })
        setTimeout(() => {
            this.setState({
                pickTime: true
            })
        }, 200)

        // console.log('esti prost')
    }

    sendNotifications = async (timp) => {
        let query = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
        let data = await query.data().friends
        data.forEach(user => this.sendNotificationToUser(user, timp))
    }

    sendNotificationToUser = async (user, timp) => {
        if (this.state.receive_map_notifications) {
            this.getLocationFromCoords(this.state.futureLocationCoords.lat, this.state.futureLocationCoords.long)
            let query = await firebase.firestore().collection('users').doc(user).get()
            let token = await query.data().tokens
            const message = {
                to: token,
                sound: 'default',
                title: this.state.currentUserName + ' changed their location',
                body: this.toHours(timp - Date.now()) + ' near ' + this.state.street,
                data: { data: 'goes here' },
                _displayInForeground: true
            }
            const response = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
        }
    }

    pickTimeFunction = () => {
        this.setState({
            pickTime: true
        })
    }

    closePickTimeFunction = () => {
        this.setState({
            pickTime: false
        })
    }

    onChangeTimePicker = (event, selectedDate) => {
        console.log(event)
        const currentDate = selectedDate || this.state.valueOfPicker
        this.setState({
            valueOfPicker: currentDate.valueOf()
        })


        // console.log(currentDate.valueOf())
        // console.log(currentDate)
    }

    onPressButton = () => {
        this.setState({
            pickTime: false
        })


    }

    // _renderTimestamps = (timestamp) => {
    //     let date = new Date(timestamp)
    //     let day = date.getDay()
    //     let month = date.getMonth() + 1
    //     let year = date.getUTCFullYear()
    //     return day + ":" + month + ":" + year


    // }


    confirmFutureLocation = (date) => {
        console.log(date.valueOf())
        if (date.valueOf() < Date.now() - 14400000) { //daca pun data cu pana 4 ore in trecut se pune azi, daca nu se pune maine
            //serban pune toasta si da dismiis la time selectorul
            circle.time = date.valueOf() + 86400000
        }
        else
            circle.time = date.valueOf()
        firebase.firestore().collection("status-public").doc(firebase.auth().currentUser.uid).set({
            futureLocation: circle,
            creatorId: firebase.auth().currentUser.uid,


        })


        this.setState({
            pickTime: false,
            valueOfPicker: circle.time - Date.now()
        })

        this.sendNotifications(circle.time)
        this.componentDidMount()

    }

    toHours = (timestamp) => {
        if (timestamp < 0 && timestamp > -600000)
            return 'now'
        let minutes = ((Math.round(timestamp * 1.67 / (100000))))
        let hours = Math.floor(minutes / 60)
        let minutesRemaining = minutes % 60
        if (hours === 0) {
            if (timestamp < 0)
                return -minutesRemaining + " minutes ago"

            return "in " + minutesRemaining + " minutes"
        }
        if (timestamp < 0) {
            return -hours + ' h ' + -minutesRemaining + " min ago"
        }
        return 'in ' + hours + ' h ' + minutesRemaining + " min"
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
            <Toast
                ref="error"
                style={{ backgroundColor: '#282828' }}
                textStyle={{ color: '#fff' }}
                position='bottom'
                opacity={0.8}
                fadeInDuration={750}
            />
            <Button title="" type='clear' icon={<MaterialIcons name={'my-location'} size={28} />} containerStyle={{
                position: 'absolute',
                right: 10,

                bottom: 100,
                zIndex: 1,
                borderRadius: 30,

                backgroundColor: '#f5f6fa',
                height: 45,
            }} onPress={() => {
                this.setState({ animating: true })
                this.map.animateToRegion({
                    latitude: this.state.location.coords.latitude,
                    longitude: this.state.location.coords.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.0421,
                }, 1000)
                console.log(this.state.location, "te")
            }} />
            <SafeAreaView style={{ position: 'absolute', top: 40, left: 10, zIndex: 4 }}>
                <Button onPress={() => this.props.navigation.navigate('Home')} title="" type='clear' icon={<AntDesign name={'close'} size={18} />} containerStyle={{
                    borderRadius: 30,
                    backgroundColor: '#f5f6fa',
                }} />
            </SafeAreaView>
            <View style={{ flex: 1, flexDirection: "row-reverse", justifyContent: 'space-between', position: "absolute", bottom: 15, right: 15, left: 15, zIndex: 1, height: 60 }}>

                <FlatList
                    extraData={false}
                    pagingEnabled
                    horizontal
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    data={this.state.users.length > 1 ? this.state.users.slice(0, -1) : this.state.users}
                    snapToAlignment='center'
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, overflow: 'visible' }}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => {
                            this.map.animateToRegion({
                                latitude: item.lat,
                                longitude: item.long,
                                latitudeDelta: 0.03,
                                longitudeDelta: 0.0421,
                            }, 1000)
                        }} key={index} style={{ width: width / 4, height: 26, alignItems: 'center' }}>
                            <Avatar rounded size={35} source={{ uri: item.pic }} />
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => String(index)}

                />
            </View>

            <DateTimePickerModal date={new Date()} minuteInterval={15} isVisible={this.state.pickTime} mode="time" onConfirm={this.confirmFutureLocation}
                onCancel={() => this.setState({ pickTime: false, futureLocation: false })} />


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
                customMapStyle={mapStyle}

>

                {this.state.users.map(marker => (
                        <Marker
                            coordinate={{ latitude: marker.lat, longitude: marker.long }}
                            title={marker.name + ' ' + this.toHours(marker.time - Date.now())}
                            description={marker.description}
                            style={{ alignItems: 'center', alignContent: 'center' }}
                        ><Image source={{ uri: marker.pic }} style={{ height: 40, width: 40, borderRadius: 60, borderWidth: 1, borderColor: 'black' }} /></Marker>
                    

                    ))}

                {this.state.futureLocation ?
                    <View>

                        <Marker
                            // key={this.state.futureLocationCoords.lat+this.state.futureLocationCoords.lat}
                            coordinate={{ latitude: this.state.futureLocationCoords.lat, longitude: this.state.futureLocationCoords.long }}
                            style={{ alignItems: 'center', alignContent: 'center', alignItems: 'center' }}
                            title={this.state.currentUserName + " " + this.toHours(this.state.valueOfPicker)}
                        ><Image source={{ uri: this.state.currentUserProfilePic }} style={{ height: 40, width: 40, borderRadius: 60, borderWidth: 1, borderColor: 'black' }} /></Marker>
                    </View>



                    : null}

            </MapView> : null}




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

const mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#523735"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#c9b2a6"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#dcd2be"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ae9e90"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#93817c"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#a5b076"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#447530"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fdfcf8"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f8c967"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#e9bc62"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e98d58"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#db8555"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#806b63"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8f7d77"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#b9d3c2"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#92998d"
            }
        ]
    }
]