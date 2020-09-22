import React, { Component } from 'react'
import { View, Image, Dimensions, Text } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Video } from 'expo-av'
const { width, height } = Dimensions.get('window')

class TimelinePostDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUri: props.navigation.state.params.imageUri,
            videoUri: props.navigation.state.params.videoUri,
            flipVideo:  props.navigation.state.params.flipVideo,
        }
    }

    componentDidMount = () => {
        console.log(this.state.imageUri)
        console.log(this.state.videoUri)
    }

    render() {
        if(typeof this.state.imageUri !== 'undefined'){
        return (
            
            <View style={{ flex: 1 }}>
                <Image source={{ uri: this.state.imageUri }} style={{width: width, height: height}} />
            </View>
        )}else { return(<View style={{flex: 1}}>
                <Video source={{uri: this.state.videoUri}} resizeMode="cover" style={{ transform: [{ scaleX: this.state.flipVideo ? -1 : 1 }, { scaleY: 1 }], width: width, height: height }}  shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping/>
            </View>)
        }
    }
}

export default withNavigation(TimelinePostDetail)