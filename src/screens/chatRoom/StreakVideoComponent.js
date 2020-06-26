import React, { Component } from 'react'
import { Text, View, Dimensions } from 'react-native'
import firebase from 'firebase'
import { FlatList } from 'react-native-gesture-handler'
import { Video } from 'expo-av'
import { ThemeConsumer } from 'react-native-elements'
let arr = []
const { width, height } = Dimensions.get('window')

export default class StreakVideoComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
            allStreaks: [],
            index: 0
        }
        // this.updateIndex = this.updateIndex.bind(this)
    }

    componentDidMount(){
        console.log(this.props.video, 'EU SUNT')
        
    }

  
    _onPlaybackStatusUpdate = playbackStatus => {
        if (playbackStatus.didJustFinish)
            if(this.state.index < this.props.video.length - 1){
                this.setState(prevState => ({ index: prevState.index + 1 }));

            console.log(this.state.index)
        }else{
           return
        }
    }

    render(){
        return(
                <View style={{flex: 1}}>
   <Video source={{uri: this.props.video}} resizeMode="cover" style={{ width: width - 20, height: 200, borderRadius: 20 }} shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping/>
                                </View>          
            )
    }
}
