import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Button, FlatList, Animated, SafeAreaView, Text } from 'react-native'
import firebase from 'firebase'
import Status from '../../components/Status'
import * as theme from '../../styles/theme'
import { withNavigation } from 'react-navigation'
import ChatRoomsList from '../chatRoom/ChatRoomsList'

let arr = []
const stories = []
const { height, width } = Dimensions.get('window')
 class StoriesPublic extends Component{
    scrollX = new Animated.Value(0)
    constructor(props){
        super(props)
        this.state = {
            documentData: [],
            whoSee: [],
            myFriends: [],
            allStories: []
        }
    }


    componentDidMount = async() => {
      arr = []
      await this.retrieveData()
      
    }



   
    renderDots = () => {
        const dotPosition = Animated.divide(this.scrollX, width);
        return(
            <View style={[styles.flex, styles.row, {justifyContent: 'center', alignItems: 'center', marginTop: 10, flex: 1}]}>
                {this.state.documentData.map((item, index) => {
                    const borderWidth = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [0, 2.5, 0],
                        extrapolate: 'clamp'
                    })
                    return(
                        <Animated.View
                            key={`step-${item.id}`}
                            style={[styles.dots, styles.activeDot, {borderWidth: borderWidth}]}
                        />
                    )
                })}
                
            </View>
        )
    }

    retrieveData = async() => {
        const currentId = firebase.auth().currentUser.uid
     
        let friendsQuery = firebase.firestore().collection('users').doc(currentId)
        let friendSnapshots = await friendsQuery.get()
        let friendsData = await friendSnapshots.data().friends
        this.setState({
          myFriends: friendsData
        })

        this.state.myFriends.forEach(async friend => {
          let initialQuery = firebase.firestore().collection('status-public').doc(friend)
          let querySnapshot = await initialQuery.get()
          let queryDocumentData = querySnapshot.data().statuses
          queryDocumentData.forEach(doc => arr.push(doc))
          this.setState({documentData: arr})
        
        })

    }


  
      getAllStoriesFromId = async(uid) => {
        let initialQuery = await firebase.firestore().collection("status-public").where('creatorId', '==', uid)
        let documentSnapshots = await initialQuery.get()
        let allStories = (await documentSnapshots).docs.map(doc => doc.data().statuses)
        allStories.forEach(story => this.setState({allStories: story}))
        console.log(this.state.allStories)
      }

    onPress = async (item) => {
      await this.getAllStoriesFromId(item.creatorId)
      this.props.navigation.navigate('FullScreenStory', { status: item, allStories: this.state.allStories})
    }

    render(){
        return(
            <View style={[ styles.column, styles.destinations ], { marginTop: 40}}>
                <SafeAreaView style={styles.container} >
                <FlatList
                // decelerationRate={0}
                horizontal
                // pagingEnabled
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                snapToAlignment='center'
                style={[styles.shadow, { overflow: 'visible' }]}
                 data = {this.state.documentData}
                 renderItem={({item}) => (
                     <Status postedFor={item.hoursPosted} activity={item.activity} mood={item.mood} text={item.text} creatorId={item.creatorId} timestamp={item.timestamp} image={item.image} press={() => this.onPress(item)}/>
                     
                 )}   
                keyExtractor={(item, index) => String(index)}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter}
                onEndReached={this.retrieveMore}
                onEndReachedThreshold={0}
                refreshing={this.state.refreshing}
                />
            </SafeAreaView>
            <Button title="Retrieve"
              color="#fff"
             onPress={() => this.retrieveData()}/>
              <View>
                <ChatRoomsList/>
              </View>
            </View>
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