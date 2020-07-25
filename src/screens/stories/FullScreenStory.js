import React from "react"
import { Text, Button, Input, SearchBar, Divider } from 'react-native-elements'
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  Dimensions,
  FlatList,
  ScrollView,
  Image,
  Animated

} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Octicons from 'react-native-vector-icons/Octicons'
import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Progress from 'react-native-progress'

import * as theme from '../../styles/theme'

const { width, height } = Dimensions.get('screen')

import firebase from 'firebase';
import { divide } from "react-native-reanimated";
import { withNavigation } from "react-navigation";
import ViewPager from '@react-native-community/viewpager'
import FullScreenSignleStory from "./FullScreenSingleStory";
import FullScreenSignleStoryVideo from './FullScreenSingleStoryVideo'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures'
// import Swiper from 'react-native-p';
let t



class FullScreenStorty extends React.Component {
  animation = new Animated.Value(0)
  scrollRef = React.createRef()
  constructor(props) {
    super(props)
    this.state = {
      paused: false,
      item: props.navigation.state.params.status,
      displayName: "",
      profilePicture: "",
      progress: 0,
      indeterminate: true,
      allStories: props.navigation.state.params.allStories,
      currentStory: 0,
      currentIndex: 0,
      dynamicIndex: 0,
      index: 0,
      selectedIndex: 0,
      progressStory: 0


    }



  }







  componentDidMount = () => {
    console.log('mamammamamamama', this.state.allStories)
    t = setInterval(() => {
      if (this.state.selectedIndex === this.state.allStories.length - 1) {
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
    }, 2000)
  }


  componentWillUnmount = () => {
    clearInterval(t)
  }

  renderStory = (item, index) => {
    return (
      <FullScreenSignleStory image={item.image} />
    )
  }





  onViewableItemsChanged = ({ viewableItems, changed }) => {
    console.log("Visible items are", viewableItems);
    console.log("Changed in this iteration", changed);
  }


  setSelectedIndex = event => {
    const viewSize = event.nativeEvent.layoutMeasurement.width
    const contentOffset = event.nativeEvent.contentOffset.x

    const selectedIndex = Math.floor(contentOffset / viewSize)
    this.setState({ selectedIndex })
  }

  render() {
    // const { selectedIndex } = this.state

    return (
      // <View style={{height: "100%", width: "100%"}}>
      <ScrollView ref={this.scrollRef} horizontal pagingEnabled onMomentumScrollEnd={this.setSelectedIndex} style={{ height: height, width: width, flex: 1 }}>
        {this.state.allStories.map((element, index) => (
          <FullScreenSignleStory key={element.timestamp} startProgress={index === this.state.selectedIndex ? true : false} image={element.image} />

        ))}
      </ScrollView>

      // </View>
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
    width: width * 1.2,
    height: height,
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
    margin: 10
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
  },
  progress: {
    marginLeft: 10,
    marginRight: 10
  }
});


export default withNavigation(FullScreenStorty)