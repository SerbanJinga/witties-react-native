import React from "react"
import { Text, Button, Input, Image } from 'react-native-elements'
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


} from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import * as Location from 'expo-location'
const { width, height } = Dimensions.get('window')

export default class MapComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            displayName: props.laba,
            nameOfUser: props.name,
            password: '',
            gap: 0,
            taggedUsers: [],
            oneUserTag: '',
            location: []

        }
    }

    componentDidMount() {
        this.retrieveLocation()
        console.log("De aici vine", this.state.displayName)
        console.log(this.state.location)
    }

    retrieveLocation = async() => {
        let { status } = await Location.requestPermissionsAsync()
        if(status !== 'granted'){
            alert('n-ai dat accept')
        }

        let location = await (await Location.getCurrentPositionAsync()).coords
        this.setState({
            location: location
        })
    }

    render() {
        let text = ''
        text = JSON.stringify(this.state.location.latitude)
        let text2 = JSON.stringify(this.state.location.longitude)
return (<View style={styles.container}>
            <Text style={{ marginTop: 50 }}>{text}</Text>
            <MapView style={styles.mapStyle} mapType='hybrid' initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            }}
            >

                <Marker
                    coordinate={{ latitude: text, longitude: text2}}

                    title={'Report Team'}
                    description={"aici se afla cel mai toxic kid"}
                />
               7]

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
})