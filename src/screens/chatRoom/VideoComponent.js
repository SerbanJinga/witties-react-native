import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Text, Image, ActivityIndicator } from 'react-native'
import * as theme from '../../styles/theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Octicons from 'react-native-vector-icons/Octicons'
import firebase from 'firebase'
import * as Font from 'expo-font'
import { Video } from 'expo-av'
import { Overlay } from 'react-native-elements'
const { height, width } = Dimensions.get('window')

export default class VideoComponent extends Component {

    constructor(props){
        super(props)
        this.state = {
            video: props.video,
            overlay: false,
            marginLeft: 0,
            marginRight: 0
        }
    }


    componentDidMount = () => {
            if(this.props.creatorId === firebase.auth().currentUser.uid){
                this.setState({
                    marginLeft: 50,
                    marginRight: 0
                })
            }else{
                this.setState({
                    marginLeft: 0,
                    marginRight: 50
                })
            }
    }


    openOnLongPress = () => {
        this.setState({
            overlay: true
        })
    }


    closeOnLongPress = () => {
        this.setState({
            overlay: false
        })
    }

    render(){
        return(


 <TouchableOpacity
                activeOpacity={0.8}
                style={{ alignItems:(this.props.creatorId == firebase.auth().currentUser.uid)?'flex-end':"flex-start", marginVertical: 10, marginLeft: this.state.marginLeft, marginRight: this.state.marginRight }}
                onPress={() => console.log('m-ai apasat')}
                onLongPress={() => this.openOnLongPress()}>
                <View
                    style={[styles.flex, styles.shadow]}
                    imageStyle={{ borderRadius: theme.sizes.radius }}
                >
                    <Video source={{uri: this.state.video}} resizeMode="cover" style={styles.destination} shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping/>
                </View>
            <Overlay onBackdropPress={() => this.closeOnLongPress()} isVisible={this.state.overlay} overlayStyle={{position: 'absolute', bottom: 0, width: width}}>
                <Text>like video </Text>
            </Overlay>
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
