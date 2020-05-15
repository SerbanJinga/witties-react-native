import React from "react"
import { Text, Button, Input } from 'react-native-elements'
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
    LayoutAnimation,
    Image,


} from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import * as Location from 'expo-location'
import firebase from 'firebase'
import { max } from "react-native-reanimated";
const { width, height } = Dimensions.get('window')
const Valori = {
    "image": "https://firebasestorage.googleapis.com/v0/b/witties.appspot.com/o/photos%2F5owDnkBxJIVrwT3Se45vWIVvrHF3%2F1588608892966.jpg?alt=media&token=8593317b-d2eb-4f54-96b9-0f866861d2df",
    "location": {
        "lat": 45,
        "lng": 60,
    },
    "text": "salut baieti merge bine",
    "userId": "3tHCTgdV7cP8pklBEVytjshNo1A2",
}
export default class MapComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            displayName: props.laba,
            nameOfUser: props.name,
            password: '',
            gap: 0,
            sizeImage: 100,
            region: {
                latitude: 37.78825,
                longitude: 40.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            taggedUsers: [],
            oneUserTag: '',
            location: [],
            currentuser: firebase.auth().currentUser.uid,
            markerData: [{
                "image": "https://firebasestorage.googleapis.com/v0/b/witties.appspot.com/o/photos%2F5owDnkBxJIVrwT3Se45vWIVvrHF3%2F1588608892966.jpg?alt=media&token=8593317b-d2eb-4f54-96b9-0f866861d2df",
                "location": {
                    "lat": 45,
                    "lng": 60,
                },
                "text": "salut baieti bine",
                "userId": "3tHCTgdV7cP8pklBEVytjshNo1A2",
            }]
            // {
            //     "image": "https://s.evz.ro/imgserv/1200x0/smart/filters:contrast(5):quality(80):format(jpeg)/evz.ro/wp-content/uploads/2019/09/florinsalam.jpg",
            //     "location": {
            //         "lat": 20,
            //         "lng": 30,
            //     },
            //     "text": "merge bine",
            //     "userId": "3tHCTgdV7cP8pklBEVytjshNo1A2",
            // }
        }
    }
    componentDidMount() {
        console.log('dadadad')
        console.log(firebase.auth().currentUser.uid)
        this.retrieveLocation()
        this.retrieveData()
        console.log("De aici vine", this.state.displayName)
        console.log(this.state.location)
    }

    retrieveLocation = async () => {
        let { status } = await Location.requestPermissionsAsync()
        if (status !== 'granted') {
            alert('n-ai dat accept')
        }

        let location = await (await Location.getCurrentPositionAsync()).coords
        this.setState({
            location: location
        })
    }


    async retrieveData() {
        let initialQuery = await firebase.firestore().collection("media").where("uid", "==", this.state.currentuser)
        let documentSnapshots = await initialQuery.get()
        let documentData = documentSnapshots.docs.map(doc => doc.data())
        console.log('hai tati')
        console.log(documentData)
        this.setState({ markerData: documentData })
        console.log('-------------------------------------------------')
        console.log(this.state.markerData)
        console.log('-------------------------------------------------')
        console.log(this.state.markerData[0].location)

    }

    changeMarkerSize() {
        let zoom = Math.max(this.state.region.latitudeDelta, this.state.region.longitudeDelta)
        console.log(zoom)
        if (zoom >= 10) {
            this.setState({ sizeImage: 25 })

            // console.log('>1')
            console.log(this.state.sizeImage)

        } else if (zoom < 10 && zoom >= 5) {
            this.setState({ sizeImage: 50 })
            // console.log('0.5-1')
            console.log(this.state.sizeImage)

        } else if (zoom < 5 && zoom >= 2.5) {
            //  console.log('0.25-0.5')
            this.setState({ sizeImage: 75 })
            console.log(this.state.sizeImage)

        } else if (zoom < 2.5) {
            this.setState({ sizeImage: 100 })
            // console.log('<0.25')
            console.log(this.state.sizeImage)
        }
    }


    render() {
        let text = ''
        text = JSON.stringify(this.state.location)
        return (<View style={styles.container}>
            {/* <Button style={{ marginTop: 40 }} onPress={() => { console.log(this.state.region) }} title='salll' />
            <Button style={{ marginTop: 40 }} onPress={() => { console.log(this.state.region) }} title='salll2' />
            <Button style={{ marginTop: 40 }} onPress={() => { this.changeMarkerSize() }} title='salll3' />
            <Text style={{ marginTop: 50 }}>{text}</Text> */}
            <MapView style={styles.mapStyle} mapType='hybrid'
                region={this.state.region}
                // initialRegion={{
                //     latitude: 45,
                //     longitude: 60,
                //     latitudeDelta: 50,
                //     longitudeDelta: 0.0,
                // }}
                onRegionChangeComplete={(region) => {
                    this.setState({ region: region })
                  //  this.changeMarkerSize()
                }}
            >

                {this.state.markerData.map(marker => (
                    <View style={{}}>
                        <Marker
                            coordinate={{ latitude: marker.location.lat, longitude: marker.location.lng }}
                            title={marker.text}>
                        {/* <View style={{height:this.state.sizeImage *2,width:this.state.sizeImage *2,  }}> */}
                            <Image
                                source={{ uri: marker.image }}
                                
                                style={{
                                    width: 50,
                                    height: 50,
                                    resizeMode:'cover'
                                }}

                            />
                        {/* </View> */}
                        </Marker>
                    </View>
                ))}

            </MapView>
        </View>)
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    box: {
        height: 100,
        width: 100,
        borderRadius: 5,
        marginVertical: 40,
        backgroundColor: "#61dafb",
        alignItems: "center",
        justifyContent: "center"
    },
})