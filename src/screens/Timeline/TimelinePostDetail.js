import React, { Component } from 'react'
import { View, Image, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Video } from 'expo-av'
import { AntDesign } from '@expo/vector-icons'
const { width, height } = Dimensions.get('window')

class TimelinePostDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUri: props.navigation.state.params.imageUri,
            videoUri: props.navigation.state.params.videoUri,
            shouldFlip:  props.navigation.state.params.shouldFlip,
        }
    }

    componentDidMount = () => {
        console.log(this.state.imageUri)
        console.log(this.state.videoUri)
    }

    render() {
        if(typeof this.state.imageUri !== 'undefined'){
        return (
            
            <SafeAreaView style={{ flex: 1, backgroundColor: '#000', marginTop: 30 }}>
            <SafeAreaView style={{flexDirection: 'row', flex: 0, justifyContent: 'space-between', padding: 10, alignItems: 'center', backgroundColor: '#000'}}>
            <TouchableOpacity
                            onPress={() => this.props.navigation.goBack(null)}
                            style={{
                                backgroundColor: 'transparent',
                                // margin: 4,
                                // marginRight: 10,
                            }}>
                            <AntDesign
                                color="#fff"
                                name="arrowleft"
                                style={{ fontSize: 24, fontWeight: "bold" }}
                            />
                        </TouchableOpacity>
            </SafeAreaView>

                <Image source={{ uri: this.state.imageUri }} style={{ aspectRatio: 9/16}} />
            </SafeAreaView>
        )}else { return(<SafeAreaView style={{flex: 1, backgroundColor: '#000', marginTop: 30}}>
        <SafeAreaView style={{flexDirection: 'row', flex: 0, justifyContent: 'space-between', padding: 10, alignItems: 'center', backgroundColor: '#000'}}>
            <TouchableOpacity
                            onPress={() => this.props.navigation.goBack(null)}
                            style={{
                                backgroundColor: 'transparent',
                                // margin: 4,
                                // marginRight: 10,
                            }}>
                            <AntDesign
                                color="#fff"
                                name="arrowleft"
                                style={{ fontSize: 24, fontWeight: "bold" }}
                            />
                        </TouchableOpacity>
            </SafeAreaView>
                <Video source={{uri: this.state.videoUri}} resizeMode="cover" style={{ transform: [{ scaleX: this.state.shouldFlip ? -1 : 1 }, { scaleY: 1 }], aspectRatio: 9/16 }}  shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping/>
            </SafeAreaView>)
        }
    }
}

export default withNavigation(TimelinePostDetail)