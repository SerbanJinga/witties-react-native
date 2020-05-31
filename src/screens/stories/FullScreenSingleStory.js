import React, { Component } from 'react'
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
    Animated,
    Text

} from 'react-native';
import * as theme from '../../styles/theme'


import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Octicons from 'react-native-vector-icons/Octicons'
import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const { width, height } = Dimensions.get('screen')
import * as Progress from 'react-native-progress'
export default class FullScreenSignleStory extends Component{

constructor(props){
  super(props)
  this.state = {
    progress: 0,
    indeterminate: true
  }
}

  animate = () => {
    let progress = 0;
    this.setState({progress})
    setTimeout(()=>{
      this.setState({indeterminate: false})
      setInterval(() => {
        progress += 0.1
        if(progress > 1){
          progress = 1
        }
        this.setState({progress})
      }, 500)
    }, 1500)
  }

  componentDidMount = () => {
    this.animate()
  }
render(){
    return(
        <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.apasa()}>
<ImageBackground
  style={[styles.flex, styles.destination]}
  source={{uri: this.props.image}}
>

    <Progress.Bar style={{marginLeft: 10, marginRight: 10}} progress={this.state.progress} indeterminate={this.state.indeterminate} width={width} height={2}/>
    

  <View style={[styles.row, { justifyContent: 'space-between' }]}>
    <View style={{ flex: 0 }}>
      <Image source={{ uri: this.props.profilePicture }} style={styles.avatar} />
    </View>

    <View style={[styles.column, { flex: 2, paddingHorizontal: theme.sizes.padding / 2, marginTop: 10 }]}>
      <Text style={{ color: theme.colors.white, fontWeight: 'bold' }}>{this.props.displayName}</Text>
      <Text style={{ color: theme.colors.white }}>
        <Octicons
          name="smiley"
          size={theme.sizes.font * 0.8}
          color={theme.colors.white}
        />
        <Text> {this.props.mood}</Text>
      </Text>
    </View>

  </View>

</ImageBackground>   
</TouchableOpacity>

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