import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, SafeAreaView } from 'react-native'
import { withNavigation } from 'react-navigation'
import firebase from 'firebase'
import { Video } from 'expo-av'
const { width, height } = Dimensions.get('window')
import StreakVideoFullScreenVideo from './StreakVideoFullScreenVideo'
import StreakVideoItem from './StreakVideoItem'
import { FlatList } from 'react-native-gesture-handler'

const cellHeight = height * 0.6;
const cellWidth = width;
const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
};
class StreakVideoAvatar extends Component {
    scrollRef = React.createRef()
    constructor(props) {
        super(props)
        this.cellRefs = {}
        this.state = {
            roomId: props.navigation.state.params.roomId,
            documentData: props.navigation.state.params.data,
            selectedIndex: 0,
            xPosition: 1,
            onEndReached: false,
            uri: ''
        }

        this.goToNextStorty = this.goToNextStorty.bind(this)
    }

    // loadItems = () => {
    //     const start = this.state.documentData.length
    //     const newItems = this.state.documentData.map((item, i) => ({
    //         ...item,
    //         id: start + i
    //     }))
    //     const documentData = [...this.state.documentData, ...newItems]
    //     this.setState({ documentData })
    // }

    _renderItem = ({ item }) => {
        return (
            <StreakVideoItem
                ref={(ref) => {
                    this.cellRefs[item.id] = ref
                }}
                {...item}
                close={() => this.props.navigation.goBack(null)}
            />
        )
    }





    // retrieveData = async () => {
    //   this.setState({
    //   })
    // }

    componentDidMount = async () => {
        // await this.retrieveData()
        // console.log(this.state.documentData, 'da;da;dla;dla')

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

            this.playbackObject.loadAsync(this.state.documentData[this.state.selectedIndex].video)
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

    goToNextStorty = () => {
        console.log('a intrat in checkend')
        if (this.state.onEndReached)
            this.props.navigation.goBack(null)

        this.setState(prev => ({ selectedIndex: prev.selectedIndex + 1 }),
            () => {
                this.scrollRef.current.scrollTo({
                    animated: true,
                    y: 0,
                    x: width * this.state.selectedIndex
                })
            })
    }


    handleScroll = event => {
        console.log(event.nativeEvent.contentOffset.x);

    }

    _onViewableItemsChanged = (props) => {
        const changed = props.changed
        changed.forEach((item) => {
            const cell = this.cellRefs[item.key]
            if (cell) {
                if (item.isViewable) {
                    cell.play()
                } else {
                    cell.pause()
                }
            }
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    horizontal
                    style={{ flex: 1 }}
                    data={this.state.documentData}
                    renderItem={this._renderItem}
                    keyExtractor={(item) => item.id}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                    initialNumToRender={3}
                    maxToRenderPerBatch={3}
                    windowSize={5}
                    pagingEnabled
                    getItemLayout={(_data, index) => ({
                        length: cellWidth,
                        offset: cellWidth * index,
                        index,
                    })}
                    viewabilityConfig={viewabilityConfig}
                    removeClippedSubviews={true}

                />
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cell: {
        width: cellWidth,
        height: cellHeight ,
        backgroundColor: '#eee',
        borderRadius: 20,
        overflow: 'hidden',
        margin: 10,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 40,
    },
    full: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    poster: {
        resizeMode: 'cover',
    },
    overlayText: {
        color: '#fff',
    },
});


export default withNavigation(StreakVideoAvatar)
