import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Text, Image, ActivityIndicator } from 'react-native'
import * as theme from '../../styles/theme'
import Octicons from 'react-native-vector-icons/Octicons'
import firebase from 'firebase'
import { Video } from 'expo-av'
const { height, width } = Dimensions.get('window')


class StreakVideoFullScreenVideo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            shouldPlay: true,
            displayName: "",
            profilePicture: "",
            imageUri: ""
        }
    }


    componentDidMount = async () => {
        console.log('loadingVideo')
        let i = await this.playbackObject.getStatusAsync()
        console.log('pisatul asta este :', i)
        if(!i.isLoaded){
        this.playbackObject.loadAsync({ uri: this.state.video }, {}, false)}else{
            console.log('nu se mai incarca inca odata')
        }
    }

    componentWillUnmount = async() => {
        await this.playbackObject.unloadAsync()
    }

    _onPlaybackStatusUpdate = playbackStatus => {

        if (playbackStatus.didJustFinish) {
            console.log('muie uefa')
            this.props.checkEnd()

        }


    };
    render() {

        return (
            <TouchableOpacity onLongPress={() => {
                console.log('long press')

                this.playbackObject.pauseAsync()
            }} onPressOut={() => {
                console.log('press out')
                this.playbackObject.playAsync()
            }}>
                <Video
                //  onPlaybackStatusUpdate=    {(playbackStatus) => this._onPlaybackStatusUpdate(playbackStatus)} resizeMode="cover" style={{ width: width, height: height }}
                    rate={1.0} volume={1.0} source={{ uri: this.props.uri }}
                    ref={(ref) => { this.playbackObject = ref }}
                    shouldPlay={this.props.shouldPlay} />
            </TouchableOpacity>)

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
export default StreakVideoFullScreenVideo