import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Text, Image, ActivityIndicator } from 'react-native'
import * as theme from '../../styles/theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Octicons from 'react-native-vector-icons/Octicons'
import firebase from 'firebase'
import * as Font from 'expo-font'
import { withNavigation } from 'react-navigation'
import { SharedElement } from 'react-native-shared-element'
const { height, width } = Dimensions.get('window')
 class ChatRoomPost extends Component {

    constructor(props) {
        super(props)
        this.state = {
            displayName: "",
            profilePicture: "",
            fontsLoaded: false,
            marginLeft: 0,
            marginRight: 0,
        }
    }

    _renderTimestamps = (timestamp) => {
        let date = new Date(timestamp * 1000)
        let hours = date.getHours()
        let minutes = "0" + date.getMinutes()
        let seconds = "0" + date.getSeconds()

        let formattedTime = hours + ":" + minutes.substr(-2) + ':' + seconds.substr(-2)
        return formattedTime
    }

    getData = async (uid) => {
        await firebase.firestore().collection('users').doc(uid).get().then(res => {
            let displayName = res.data().displayName
            let profilePicture = res.data().profilePicture
            this.setState({ displayName: displayName, profilePicture: profilePicture })
        })

    }
    componentDidMount = async () => {
        console.log(this.props.creatorId,"ar trebui sa fie egal cu ",firebase.auth().currentUser.uid)
        console.log("-----------------------------------------")
        console.log(this.state.date)
        console.log("-----------------------------------------")
        await this.getData(this.props.creatorId)

        this.setState({ fontsLoaded: true })
        // if (this.props.creatorId == firebase.auth().currentUser.uid)
        //     this.setState({
        //         marginLeft: 50,
        //         marginRight: 0
        //     })
        // else
        //     this.setState({
        //         marginLeft: 0,
        //         marginRight: 50
        //     })
    }

    render() {
        const { navigation } = this.props

        return (
            <TouchableOpacity
                activeOpacity={0.8} 
                style={{ alignItems:(this.props.creatorId == firebase.auth().currentUser.uid)?'flex-end':"flex-start", marginVertical: 10 }}
                onPress={() => navigation.push('ChatRoomPostDetail', { image: this.props.image, timestamp: this.props.timestamp })}>
                 <ImageBackground
                    style={[styles.flex, styles.destination, styles.shadow]}
                    imageStyle={{ borderRadius: theme.sizes.radius }}
                    source={{ uri: this.props.image }}
                >
                    <View style={[styles.column, { justifyContent: 'center' }]}>
                    <SharedElement id={this.props.image}>

                        <Image source={{ uri: this.state.profilePicture }} style={styles.avatar} />
                    </SharedElement>

                        <Text style={{ color: theme.colors.white, fontWeight: 'bold', marginLeft: theme.sizes.padding - 4 }}>{this.state.displayName}</Text>
                        <Text style={{ color: theme.colors.white, marginLeft: theme.sizes.padding - 4 }}>
                            <Octicons
                                name="smiley"
                                size={theme.sizes.font * 0.8}
                                color={theme.colors.white}
                            />
                            <Text> {this.props.text}</Text>
                        </Text>


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
        width: width - (theme.sizes.padding * 7),
        height: width * 0.5,
        marginHorizontal: theme.sizes.margin / 4,
        paddingHorizontal: theme.sizes.padding / 4,
        paddingVertical: theme.sizes.padding * 0.66,
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
export default withNavigation(ChatRoomPost)