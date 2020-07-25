import React, { Component } from 'react'
import { Text, ScrollView, Dimensions } from 'react-native'
import { withNavigation } from 'react-navigation'
import firebase from 'firebase'
import { Video } from 'expo-av'

const { width, height } = Dimensions.get('window')
class StreakVideoAvatar extends Component {
    scrollRef = React.createRef()
    constructor(props) {
        super(props)
        this.state = {
            roomId: props.navigation.state.params.roomId,
            documentData: [],
            selectedIndex: 0,
            xPosition: 1
        }
    }

    retrieveData = async () => {
        let query = await firebase.firestore().collection('messages').doc(this.state.roomId).get()
        let data = await query.data().streakVideo
        this.setState({
            documentData: data
        })
    }

    componentDidMount = async () => {
        await this.retrieveData()
        console.log(this.scrollRef.current.index)

    }

    setSelectedIndex = event => {
        const viewSize = event.nativeEvent.layoutMeasurement.width
        const contentOffset = event.nativeEvent.contentOffset.x

        this.setState({
            xPosition: contentOffset
        })
        const selectedIndex = Math.floor(contentOffset / viewSize)
        this.setState({ selectedIndex })
    }


    _onPlaybackStatusUpdate = playbackStatus => {
        if (playbackStatus.didJustFinish) {
           
                if (this.state.selectedIndex === this.state.documentData.length - 1) {
                    this.props.navigation.navigate('Home')
                }
                this.setState(prev => ({ selectedIndex: prev.selectedIndex + 1 }),
                    () => {
                        this.scrollRef.current.scrollTo({
                            animated: true,
                            y: 0,
                            x: width * this.state.selectedIndex
                        })
                    })
            }
        }
    

    handleScroll = event => {
        console.log(event.nativeEvent.contentOffset.x);

    }

    render() {
        return (
            <ScrollView scrollEventThrottle={16} onScroll={this.handleScroll} ref={this.scrollRef} horizontal pagingEnabled onMomentumScrollEnd={this.setSelectedIndex} style={{ flex: 1, width: width, height: height }}>
                {this.state.documentData.map((element, index) => (
                    <Video onPlaybackStatusUpdate=
                        {(playbackStatus) => this._onPlaybackStatusUpdate(playbackStatus)} key={index} resizeMode="cover" style={{ width: width, height: height }}
                        rate={1.0} volume={1.0} source={{ uri: element.video }} shouldPlay={index === this.state.selectedIndex ? true : false} />

                ))}
            </ScrollView>
        )
    }
}

export default withNavigation(StreakVideoAvatar)
