import React, { Component } from 'react'
import { Text, View } from 'react-native'
import firebase from 'firebase'
import { FlatList } from 'react-native-gesture-handler'
import { Video } from 'expo-av'
let arr = []

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
        console.log(this.props.video)
        
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
                <Video onPlaybackStatusUpdate={(playbackStatus) => this._onPlaybackStatusUpdate(playbackStatus)} source={{uri: this.props.video[this.state.index].video}} resizeMode="cover" style={{ width: 100, height: 100 }} shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping/>

            </View>
        )
    }
}
