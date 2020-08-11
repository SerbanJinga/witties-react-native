import React, { Component } from 'react'
import { View, Image, Dimensions } from 'react-native'
import { withNavigation } from 'react-navigation'
const { width, height } = Dimensions.get('window')

class TimelinePostDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUri: props.navigation.state.params.imageUri,
        }
    }

    componentDidMount = () => {
        console.log(this.state.imageUri)
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Image source={{ uri: this.state.imageUri }} style={{width: width, height: height}} />
            </View>
        )
    }
}

export default withNavigation(TimelinePostDetail)