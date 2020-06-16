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
const { width, height } = Dimensions.get('window')

import firebase from 'firebase';
import { divide } from "react-native-reanimated";
const screenHeight = Dimensions.get('screen').height;




export default class TimelineOverlay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }

    }
    componentDidMount() {
        console.log(this.props.ts)
    }

    deletePost(par){
        firebase.firestore().collection("private").doc(firebase.auth().currentUser.uid).collection('statuses').doc(par).delete()
    }
    addToAlbum(id){
        firebase.firestore().collection("private").doc(firebase.auth().currentUser.uid).collection('statuses').doc(id).update({
            albums: firebase.firestore.FieldValue.arrayUnion("Albumul sos")
        })
    }
    


    render() {
        return (<View>
            <TouchableOpacity onPress={()=>{this.addToAlbum(this.props.id)}}>
                <Text h2>  Add To Album</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={() => { this.deletePost(this.props.id) }}>
                <Text h2>  Delete Post</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity>
                <Text h2>  Send Memorty to friends </Text>
            </TouchableOpacity>


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
})