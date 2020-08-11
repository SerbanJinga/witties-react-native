import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, FlatList, Animated, SafeAreaView, Text, ActivityIndicator, ScrollView, RefreshControl } from 'react-native'
import firebase from 'firebase'
import Status from '../../components/Status'
import * as theme from '../../styles/theme'
import { withNavigation } from 'react-navigation'
import ChatRoomsList from '../chatRoom/ChatRoomsList'
import * as Font from 'expo-font'
import Modal from 'react-native-modal'
let arr = []
let allStoriesFromAllUsers = []
import FullScreenStory from './FullScreenStory'
import { Overlay, Button, SearchBar, Input, ThemeConsumer } from 'react-native-elements'
import FriendList from '../friendSystem/FriendList'
import StreakVideo from '../chatRoom/StreakVideo'
let stories = []
import * as VideoThumbnails from 'expo-video-thumbnails'
import { Video } from 'expo-av'

let reallyFinal = []
let prinAstaFiltrez = []

let timer;


let finalArray = []
const { height, width } = Dimensions.get('window')
class StoriesPublic extends Component {
  scrollX = new Animated.Value(0)
  constructor(props) {
    super(props)
    this.state = {
      documentData: [],
      whoSee: [],
      myFriends: [],
      allStories: [],
      fontsLoaded: false,
      loading: false,
      refreshing: false,
      storiesModal: false,
      allStoriesFromAllUsers: [],
      chat: false,
      searchChats: "",
      lastVisible: {},
      allStoriesFromId: [],
      reallyFinal: [],
      prinAstaFiltrez: []

    }
  }




  componentDidMount = async () => {
    prinAstaFiltrez = []
    reallyFinal = []
    arr = []
    await this.retrieveDataFromFriends()
    await Font.loadAsync({
      font1: require('../../../assets/SourceSansPro-Black.ttf')
    })
    this.setState({
      fontsLoaded: true
    })
  }

  retrieveDataFromFriends = async () => {
    arr = []
    const currentId = firebase.auth().currentUser.uid
    let friendsQuery = await firebase.firestore().collection('users').doc(currentId).get()
    let friendsData = await friendsQuery.data().friends
    friendsData.forEach(async friend => await this.getStoriesFromFriend(friend))
  }

  getStoriesFromFriend = async (friend) => {
    let initialQuery = await firebase.firestore().collection('status-public').doc(friend).collection('statuses').get()
    if (initialQuery.empty) { return }
    let friendStories = initialQuery.docs.map(doc => doc.data())
    friendStories.forEach(friendStory => reallyFinal.push(friendStory))
    if (typeof friendStories[0].video === 'undefined')
      arr.push(friendStories[0])
    else{
      await VideoThumbnails.getThumbnailAsync(friendStories[0].video, {time: 400}).then(result => friendStories[0].image = result.uri)
      arr.push(friendStories[0])
    }
    console.log('tudor', arr)
    this.setState({
      documentData: arr
    })




    console.log('AICI TATA', reallyFinal)
    this.setState({
      reallyFinal: reallyFinal
    })
  }

  getAllStoriesFromId = async (uid) => {
    prinAstaFiltrez = []
    // console.log(this.state.reallyFinal)
    let idQuery = await firebase.firestore().collection('status-public').doc(uid).collection('statuses').get()
    // let idDatas = await idQuery.data().statuses
    let idDatas = idQuery.docs.map(doc => doc.data())
    console.log('dadadada', idDatas)
    idDatas.forEach(data => prinAstaFiltrez.push(data))

    for (let i = 0; i < this.state.reallyFinal.length; i++)
      if (this.state.reallyFinal[i].creatorId !== uid) {
        prinAstaFiltrez.push(this.state.reallyFinal[i])
      }
    // console.log('filtrare')
    // console.log(prinAstaFiltrez)
    this.setState({
      prinAstaFiltrez: prinAstaFiltrez
    })
    // console.log(story.timestamp)
  }

  retrieveAllStories = async () => {
    let initialQuery = await firebase.firestore().collection('status-public').get()
    let initalData = await initialQuery.docs.map(doc => doc.data().statuses)
    console.log(initalData)
  }











  onPress = async (item) => {
    console.log(item.creatorId)
    await this.getAllStoriesFromId(item.creatorId).then(
      // setTimeout(() => {console.log('filtrarea mea', prinAstaFiltrez)}, 2000)
      timer = setTimeout(() => {
        this.props.navigation.navigate('FullScreenStory', { status: item, allStories: prinAstaFiltrez })

      }, 2000))
  }

  componentWillMount = () => {
    clearTimeout(timer)
  }

  openNewChatOverlay = () => {
    this.setState({
      chat: true
    })
  }

  closeNewChatOverlay = () => {
    this.setState({
      chat: false
    })
  }
  renderFooter = () => {
    try {
      if (this.state.loading || this.state.refreshing) {
        return (
          <ActivityIndicator size="large" />
        )
      } else {
        return null
      }
    } catch (err) {
      console.log(err)
    }
  }



  onRefresh = async () => {
    this.setState({
      refreshing: true
    })
    // const chat = new ChatRoomsList()
    // chat._retrieveData()

    setTimeout(async () => {
      await this.retrieveDataFromFriends().then(this.setState({
        documentData: arr
      }))
      this.setState({
        refreshing: false
      })
    }, 2000)
  }

  getThumbail = async (videoUri) => {
    const { uri } = await VideoThumbnails.getThumbnailAsync(
      videoUri, { time: 400 }
    )
    return uri
  }


  render() {
    if (this.state.fontsLoaded) {
      return (
        <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl tintColor="red" onRefresh={() => this.onRefresh()} refreshing={this.state.refreshing} />}>
          {/* <Text style={{ fontFamily: 'font1', fontSize: 24, margin: 10 }}>News</Text>

          <SafeAreaView style={styles.container} >
            {1 !== 0 ?
              <FlatList
                horizontal
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                snapToAlignment='center'
                style={[styles.shadow, { overflow: 'visible' }]}
                data={this.state.documentData}
                renderItem={({ item, index }) => (
                  <View key={index}>
                    {(typeof (item.video) == 'undefined') ?
                      <Status activity={item.activity} mood={item.mood} text={item.text} creatorId={item.creatorId} timestamp={item.timestamp} image={item.image} press={() => this.onPress(item)} />
                      : <Text>da</Text>}
                  </View>
                )}
                keyExtractor={(item, index) => String(index)}
                ListHeaderComponent={this.renderHeader}
                onEndReached={this.retrieveMore}
                onEndReachedThreshold={0}
                refreshing={this.state.refreshing}
              /> : <Text style={{ fontFamily: 'font1', fontSize: 15, margin: 4, alignSelf: 'center' }}>You currently have no stories to see.</Text>
            }
          </SafeAreaView> */}

          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'font1', fontSize: 24, margin: 10 }}>Messages</Text>
            <Button onPress={() => this.openNewChatOverlay()} titleStyle={{ fontFamily: 'font1', fontSize: 15, margin: 10 }} type="clear" title="New" />
          </View>


          <ChatRoomsList/>
          {/* <Button onPress={() => this.props.navigation.navigate('TestAnimation', {transition: 'bottomTransition'})} title="Navigate"/> */}
          {/* <StreakVideo/> */}
          <Overlay isVisible={this.state.chat} onBackdropPress={() => this.closeNewChatOverlay()} fullScreen animationType="slide">
            <SafeAreaView style={{ flex: 1 }}>
              <FriendList close={() => this.closeNewChatOverlay()} addFriends={() => this.props.openFriends()}/>
            </SafeAreaView>
          </Overlay>
        </ScrollView>
      )
    } else {
      return (<ActivityIndicator size="large" />)
    }
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
    width: width - (theme.sizes.padding * 2),
    height: width * 0.6,
    marginHorizontal: theme.sizes.margin,
    paddingHorizontal: theme.sizes.padding,
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
    width: theme.sizes.padding,
    height: theme.sizes.padding,
    borderRadius: theme.sizes.padding / 2,
  },
  rating: {
    fontSize: theme.sizes.font * 2,
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

export default withNavigation(StoriesPublic)