import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Avatar } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import * as Font from 'expo-font'
import firebase from 'firebase'

const { width, height } = Dimensions.get('window')

class ChooseProfilePicture extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fontsLoaded: false,
            imageUri: 'http://www.gstatic.com/images/icons/material/system/2x/photo_camera_grey600_24dp.png',
            buttonVisible: true
        }
    }

    componentDidMount = async () => {
        await Font.loadAsync({
            //font1 or 2 can be any name. This'll be used in font-family

            font1: require('../../../assets/SourceSansPro-Black.ttf'),
        });
        this.setState({ fontsLoaded: true })
    }

    chooseImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        })

        if (!result.cancelled) {
            this.setState({
                imageUri: result.uri
            })
            this.setState({
                buttonVisible: false
            })
            this._uploadToStorage()
        }
    }

    _uploadToStorage = async () => {
        const path = `profiles_picture/${firebase.auth().currentUser.uid}`
        const response = await fetch(this.state.imageUri)
        const file = await response.blob()

        let upload = firebase.storage().ref(path).put(file)
        upload.on("state_changed", snapshot => { }, err => {
            console.log(err)
        },
            async () => {
                const url = await upload.snapshot.ref.getDownloadURL()
                console.log(url)
                this.setState({ imageUri: url })
                this._uploadToFirestore(url)
            })

    }

    _uploadToFirestore = (url) => {
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
            profilePicture: url
        })
    }

    render() {
        if (this.state.fontsLoaded) {

            return (

                <View style={{ flex: 1, alignItems: 'center', width: width, height: height }}>
                    <Avatar onPress={() => this.chooseImage()} size={150} source={{ uri: this.state.imageUri }} rounded containerStyle={{ marginTop: 60 }} />
                    <TouchableOpacity onPress={() => this.chooseImage()} style={{ marginTop: 20 }}>
                        <Text style={{ fontFamily: 'font1', fontSize: 20 }}>Choose Profile Picture</Text>
                    </TouchableOpacity>

                    <View style={{ flex: 1, marginBottom: 20, justifyContent: 'flex-end' }}>
                        {this.state.buttonVisible === true ? <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                            <Text style={{ fontFamily: 'font1', fontSize: 16, color: '#0984e3' }}>Skip for now</Text>
                        </TouchableOpacity>:<TouchableOpacity onPress={() => this.props.navigation.navigate('TutorialSlider')}>
                            <Text style={{ fontFamily: 'font1', fontSize: 16, color: '#0984e3' }}>Continue</Text>
                        </TouchableOpacity>}

                        </View>

                </View>


            )
        } else {
            return null
        }
    }
}

export default withNavigation(ChooseProfilePicture)