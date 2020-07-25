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
    Text,

  } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons'
import * as theme from '../../styles/theme'
let arr = []
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Octicons from 'react-native-vector-icons/Octicons'
import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const { width, height } = Dimensions.get('screen')
import firebase from 'firebase'
import * as Progress from 'react-native-progress'
import { Overlay, Input, Button, Avatar, Divider } from 'react-native-elements';
let t;
let progress = 0
export default class FullScreenSignleStory extends Component{

constructor(props){
  super(props)

  this.state = {
    progress: 0,
    indeterminate: true,
    displayName: "",
    profilePicture: "",
    reply: false,
    replyText: "",
    profile: false,
    discriminator: "",
    careScore: 0
  }
}

getDisplayName = async() => {
  console.log('dorian')
  let initialQuery = await firebase.firestore().collection('users').doc(this.props.uid).get()
  let profilePicture = await initialQuery.data().profilePicture
  let displayName = await initialQuery.data().displayName
  let careScore = await initialQuery.data().careScore
  let discriminator = await initialQuery.data().discriminator
  console.log(displayName, 'daflaflakfa')
  this.setState({
    profilePicture: profilePicture,
    displayName: displayName,
    careScore: careScore,
    discriminator: discriminator
  })
}

// moveToNextStory = () => {
//   setInterval(() => {
//     this.setState
//   }, 1000)
// } 

  componentDidMount = async() => {
   if(this.props.startProgress){
    setInterval(() => {
      this.setState(prev => ({ progress: prev.progress + 0.5 }))
    }, 800)
  }

  
    // if(this.props.yes === this.props.indx){
      // console.log('s - a deschis juma story')
    // }
    // console.log(this.props.key)
    arr = []
    // setInterval(() => {
      // this.setState(prev => ({ progress: prev.progress + 0.1}))
    // }, 1000)
    await this.getDisplayName()
  
  }

  // componentWillReceiveProps = () => {
    // console.log('primeste props')
  //  }

  //  componentDidUpdate = () => {
  //   if(this.props.startProgress){
  //     this.setState({
  //       progress: 0
  //     })
  //     setInterval(() =>{
  //      this.setState(prev => ({ progress: prev.progress + 0.5}))
  //     }, 1000)
  //   }
  // }

  
  componentWillUnmount = () => {
    
    // console.log('a iesit')
  }

  openOverlay = () => {
    this.setState({
      reply: true
    })
  }

  closeOverlay = () => {
    this.setState({
      reply: false
    })
  }

  sendReply = async() => {
    arr.push(firebase.auth().currentUser.uid)
    arr.push(this.props.uid)
    arr.sort()
    let roomId = ""
    arr.forEach(element => {
      roomId += element
    })

    let foo = {
      msg: this.state.replyText,
      image: this.props.image,
      reply: firebase.auth().currentUser.uid
    }

    let query = await firebase.firestore().collection('messages').doc(roomId).update({
      messages: firebase.firestore.FieldValue.arrayUnion(foo)
    })
    // console.log(data)
  
  }

  openProfileDetails = () => {
    this.setState({
      profile: true
    })
  }

  closeProfileDetails = () => {
    this.setState({
      profile: false
    })
  }
render(){
    return(
//         <TouchableOpacity style={{width: width, height: height, flex: 1}} onLongPress={() => this.openOverlay()}>
//           <SafeAreaView style={{flex: 1}}>
//           <ImageBackground
//   style={[styles.flex, styles.destination]}
//   source={{uri: this.props.image}}
// >

//     <Progress.Bar style={{marginLeft: 10, marginRight: 10}} progress={this.state.progress} indeterminate={false} width={width} height={2}/>

// <TouchableOpacity onPress={() => this.openProfileDetails()}>
//   <View style={[styles.row, { justifyContent: 'space-between' }]}>
//     <View style={{ flex: 0 }}>
//       <Image source={{ uri: this.state.profilePicture }} style={styles.avatar} />
//     </View>

//     <View style={[styles.column, { flex: 2, paddingHorizontal: theme.sizes.padding / 2, marginTop: 10 }]}>
//       <Text style={{ color: theme.colors.white, fontWeight: 'bold' }}>{this.state.displayName}</Text>
//       <Text style={{ color: theme.colors.white }}>
//         <Octicons
//           name="smiley"
//           size={theme.sizes.font * 0.8}
//           color={theme.colors.white}
//         />
//         <Text> {this.props.mood}</Text>
//         <TouchableOpacity onPress={() => this.props.close()}>
//             <AntDesign name="arrowleft" size={20} color="white"/>
//           </TouchableOpacity>
//       </Text>
//     </View>

//   </View>
//       <Overlay animationType="slide" fullScreen onBackdropPress={() => this.closeProfileDetails()} isVisible={this.state.profile} overlayStyle={{width: width, position: 'absolute', bottom: 0}}>
//       <View style={{flex: 1}}>
//                 <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
//                     <TouchableOpacity onPress={() => this.closeProfileDetails()}>
//                     <AntDesign
//                         size={26}
//                         name="down"
//                         color="#b2b8c2"
//                     />
//                     </TouchableOpacity>
//                     <Text style={{fontFamily: 'font1', fontSize: 20}}>{this.state.displayName}</Text>
//                     <AntDesign
//                         size={26}
//                         name="bars"
//                         color="#b2b8c2"
//                     />
//                 </View>
//                 <View style={{flex: 0, alignItems: 'center', marginTop: 40}}>
//                     <Avatar size={100} source={{uri: this.state.profilePicture}} rounded/>
//                     <View style={{flex: 0, flexDirection: 'row', marginTop: 20}}>
//                 <Text style={{fontFamily: "font1", fontSize: 15}}>{this.state.displayName}#{this.state.discriminator}</Text>
//                 <Entypo name="dot-single" style={{marginTop: 4, marginHorizontal: 4}}/>
//                 <Text style={{fontFamily: "font1", fontSize: 15}}>{this.state.careScore}</Text>
//                 </View>
//                 <Button style={{marginTop: 40}} titleStyle={{fontFamily: 'font1'}} title="See Friendship" type="clear"/>

//                 </View>
//                 <Text style={{fontSize: 20, fontFamily: 'font1', marginTop: 20}}>Suggested Friends</Text>
//             </View>      
//       </Overlay>
//   </TouchableOpacity>

// </ImageBackground>   

// <Overlay isVisible={this.state.reply} overlayStyle={{position: 'absolute', bottom: 0, width: width, height: 200}} onBackdropPress={() => this.closeOverlay()}>
            

//                 <KeyboardAvoidingView
//       behavior={Platform.OS == "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View style={styles.inner}>
//           <Text style={styles.header}>Header</Text>
//           <Input 
//                     label="Reply"
//                     returnKeyType="next"
//                     textContentType="name"
//                     value={this.state.replyText}
//                     onChangeText={replyText => this.setState({ replyText })}
//                 />
//           <View style={styles.btnContainer}>
//             <Button title="Send" onPress={() => this.sendReply()}/>
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//                 </Overlay> 
//                 </SafeAreaView>
// </TouchableOpacity>
<View style={{flex: 1, width: width, height: height}}>
<Progress.Bar progress={this.props.startProgress === true ? this.state.progress: 0} indeterminate={false}/>
<Image
                  source={{uri: this.props.image}}
                  style={{height: '100%', width: width}}
                />
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
    },
    container: {
      flex: 1
    },
    inner: {
      padding: 24,
      flex: 1,
      justifyContent: "space-around"
    },
    header: {
      fontSize: 36,
      marginBottom: 48
    },
    textInput: {
      height: 40,
      borderColor: "#000000",
      borderBottomWidth: 1,
      marginBottom: 36
    },
    btnContainer: {
      backgroundColor: "white",
      marginTop: 12
    }
  });

 
  