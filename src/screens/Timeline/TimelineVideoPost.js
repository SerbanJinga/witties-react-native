import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Text, Image, ActivityIndicator } from 'react-native'
import * as theme from '../../styles/theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Octicons from 'react-native-vector-icons/Octicons'
import firebase from 'firebase'
import * as Font from 'expo-font'
import TimelineOverlay from './TimelineOverlay'
const { height, width } = Dimensions.get('window')
const screenHeight = Dimensions.get('screen').height
const screenWidth = Dimensions.get('screen').width
import * as VideoThumbnails from 'expo-video-thumbnails'
export default class TimelineVideoPost extends Component {

    constructor(props) {
        super(props)
        this.state = {
            displayName: "",
            profilePicture: "",
            fontsLoaded: false,
            marginLeft: 0,
            marginRight: 0,
            showOptions: false,
            imageShown: ""
        }
    }

    generateThumbanil = async () => {
        const video = this.props.video
        const { uri } = await VideoThumbnails.getThumbnailAsync(video)
        this.setState({
            imageShown: uri
        })
    }



    _renderTimestamps = (timestamp) => {
        let date = new Date(timestamp)
        let day = date.getDate()
        let month = date.getMonth() + 1
        switch (month) {
            case 1: month = 'Jan'
                break;
            case 2: month = 'Feb'
                break;
            case 3: month = 'Mar'
                break;
            case 4: month = 'Apr'
                break;
            case 5: month = 'May'
                break;
            case 6: month = 'Jun'
                break;
            case 7: month = 'Jul'
                break;
            case 8: month = 'Aug'
                break;
            case 9: month = 'Sep'
                break;
            case 10: month = 'Oct'
                break;
            case 11: month = 'Nov'
                break;
            case 12: month = 'Dec'
                break;
        }

        //let year = date.getUTCFullYear()

        return (<View style={{
            position: 'absolute', top: 5, left: 5, width: 30, height: 30,
            backgroundColor: 'white', justifyContent: "center", alignItems: "center",
            borderRadius: 5,
        }}>
            <Text style={{ fontSize: 8 }}>{day}</Text>
            <Text style={{ fontSize: 8 }}>{month}</Text>
        </View>)


    }

    // getData = async (uid) => {
    //     await firebase.firestore().collection('users').doc(uid).get().then(res => {
    //         let displayName = res.data().displayName
    //         let profilePicture = res.data().profilePicture
    //         this.setState({ displayName: displayName, profilePicture: profilePicture })
    //     })
    //}
    componentDidMount = async() => {
        // console.log(this.props.creatorId,"ar trebui sa fie egal cu ",firebase.auth().currentUser.uid)
        // console.log("-----------------------------------------")
        // console.log(this.state.date)
        // console.log("-----------------------------------------")
        // await this.getData(this.props.creatorId)

        await this.generateThumbanil()
    }
/*  */
    render() {

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={{}}
                
                onPressIn={() => { console.log("Press In") }}
            onPress={() => this.props.press()}
            >
               
                <ImageBackground
                    style={[styles.flex, styles.destination]}
                    imageStyle={{ borderColor: 'black', borderWidth: 1, transform: [{scaleX: this.props.shouldFlip ? -1 : 1}, {scaleY: 1}] }}
                    source={{ uri: this.state.imageShown }}
                >
                    {this._renderTimestamps(this.props.timestamp)}
                    <View style={[styles.column, { justifyContent: 'center' }]}>
                        <Image source={{ uri: this.state.profilePicture }} style={[styles.avatar, {transform: [{scaleX: this.props.shouldFlip ? -1 : 1}, { scaleY: 1}]}]} />
{/* 
                        <Text style={{ color: theme.colors.white, fontWeight: 'bold', marginLeft: theme.sizes.padding - 4 }}>{this.state.displayName}</Text>
                        <Text style={{ color: theme.colors.white, marginLeft: theme.sizes.padding - 4 }}>
                            <Octicons
                                name="smiley"
                                size={theme.sizes.font * 0.8}
                                color={theme.colors.white}
                            />
                            <Text> {this.props.text}</Text>
                        </Text> */}


                    </View>
                </ImageBackground>

            </TouchableOpacity>


        )


    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 0,
    },
    column: {
        flexDirection: 'column'
    },
    row: {
        flexDirection: 'row'
    },
    header: {
        backgroundColor: theme.colors.white,
        paddingHorizontal: theme.sizes.padding,
        paddingTop: theme.sizes.padding * 1.33,
        paddingBottom: theme.sizes.padding * 0.66,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    articles: {
    },
    destinations: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 30,
    },
    destination: {
        width: width / 3,
        height: width * 0.5,
        // marginHorizontal: theme.sizes.margin / 4,
        // paddingHorizontal: theme.sizes.padding / 4,
        // paddingVertical: theme.sizes.padding * 0.66,
        borderRadius: theme.sizes.radius,
    },
    destinationInfo: {
        position: 'absolute',
        borderRadius: theme.sizes.radius,
        paddingHorizontal: theme.sizes.padding,
        paddingVertical: theme.sizes.padding / 2,
        bottom: 20,
        left: (width - (theme.sizes.padding * 4)) / (Platform.OS === 'ios' ? 3.2 : 3),
        backgroundColor: theme.colors.white,
        width: width - (theme.sizes.padding * 4),
    },
    recommended: {
    },
    recommendedHeader: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: theme.sizes.padding,
    },
    recommendedList: {
    },
    recommendation: {
        width: (width - (theme.sizes.padding * 2)) / 2,
        marginHorizontal: 8,
        backgroundColor: theme.colors.white,
        overflow: 'hidden',
        borderRadius: theme.sizes.radius,
        marginVertical: theme.sizes.margin * 0.5,
    },
    recommendationHeader: {
        overflow: 'hidden',
        borderTopRightRadius: theme.sizes.radius,
        borderTopLeftRadius: theme.sizes.radius,
    },
    recommendationOptions: {
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.sizes.padding / 2,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    recommendationTemp: {
        fontSize: theme.sizes.font * 1.25,
        color: theme.colors.white
    },
    recommendationImage: {
        width: (width - (theme.sizes.padding * 2)) / 2,
        height: (width - (theme.sizes.padding * 2)) / 2,
    },
    avatar: {
        width: theme.sizes.padding * 1.1,
        height: theme.sizes.padding,
        borderRadius: theme.sizes.padding / 2,
        marginTop: theme.sizes.padding * 2,
        marginBottom: 10,
        marginLeft: theme.sizes.padding
  
    },
    rating: {
        fontSize: theme.sizes.font,
        color: theme.colors.white,
        fontWeight: 'bold'
    },
    shadow: {
        shadowColor: theme.colors.black,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    dots: {
        width: 10,
        height: 10,
        borderWidth: 2.5,
        borderRadius: 5,
        marginHorizontal: 6,
        backgroundColor: theme.colors.gray,
        borderColor: 'transparent',
    },
    activeDot: {
        width: 12.5,
        height: 12.5,
        borderRadius: 6.25,
        borderColor: theme.colors.active,
    }
});

//     <Text>Activitate: {this.props.activity}</Text>
//<Text>Mood: {this.props.mood}</Text>
//<Text>Text: {this.props.text}</Text>
//<Text>Cine a pus story: {this.props.creatorId}</Text>
