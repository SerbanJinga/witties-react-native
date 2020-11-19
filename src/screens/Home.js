import React, { Component } from 'react'
import { View, Button } from 'react-native'
import firebase from 'firebase'
import Swiper from 'react-native-swiper'
import SearchUsers from '../screens/friendSystem/SearchUsers'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo'
import CameraScreen from '../screens/camera/Camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation'
import Timeline from './Timeline/Timeline'
import Constants from 'expo-constants'


class Home extends Component {



  constructor(props) {
    super(props)
    this.state = {
      displayName: '',
      discriminator: '',
      expoPushToken: '',
      notification: {},
      profilePicture: "",
      index: 1,
      scrollEnabled: true,
    }

    this.changeIndexTimeline = this.changeIndexTimeline.bind(this)
    this.changeIndexToCamera = this.changeIndexToCamera.bind(this)
    this.changeIndexToMain = this.changeIndexToMain.bind(this)
    this.stopIndexChanging = this.stopIndexChanging.bind(this)
    this.resumeIndexChanging = this.resumeIndexChanging.bind(this)

  }

  makeRequest = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    if(status === 'granted'){
      // if (Constants.isDevice && Constants.appOwnership ==='expo'){

      this.sendNotification()
      console.log('esti bun rau')}
    // }
  }

  changeIndexTimeline = () => {

    this.swiper.scrollTo(2)
  }
  changeIndexToCamera = () => {
    console.log('binesss rauuuu !')
    this.swiper.scrollTo(0)
  }

  changeIndexToMain = () => {

    this.swiper.scrollTo(1)

    this.swiper.context
  }

  sendNotification = async() => {
    console.log('intra')
    const token = (await Notifications.getDevicePushTokenAsync()).data
  

  await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'key=AAAAw1Wblt8:APA91bHwqbDtmfWeDxXrcnUyhKN7s5uTJ-ItXVCRJet4aRb8NZVg0a0E24CQqmRRoDQiqJdV9N6q6docwnG92FoxCjji0gIFcGCMlGkxl-7fCWxUqjcs8axcvHKkBKpl8zHfPJkkE__K',
    },
    body: JSON.stringify({
      to: token,
      priority: 'normal',
      data: {
        experienceId: '@jinga_serban/Witties',
        title: "\uD83D\uDCE7 You've got mail",
        message: 'Hello world! \uD83C\uDF10',
      },
    }),
  });
}

  stopIndexChanging = () => {
    console.log(' s a oprit nu se mai misca!')
    this.setState({ scrollEnabled: false })
  }

  resumeIndexChanging = () => {
    console.log(' se misca din nou!')
    this.setState({ scrollEnabled: true })
  }



  componentDidMount = async () => {
    arr = []
    finalArr = []
    await this._getProfilePicture()
    // setTimeout(() => {
    //   this.componentDidMount()
    // }, 4000)
  }






  _getProfilePicture = async () => {
    let initialQuery = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    let documents = await initialQuery.get()
    let documentData = documents.data().profilePicture
    this.setState({
      profilePicture: documentData
    })

  }

  






  render() {
    return (

      <View style={{ flex: 1 }}>
        <Swiper
          scrollEnabled={this.state.scrollEnabled}
          ref={(swiper) => { this.swiper = swiper; }}
          onIndexChanged={(index) => { this.setState({ index: index }) }}
          loop={false}
          showsPagination={false}
          // onScrollBeginDrag={(e) =>{console.log(' se misca')}}

          index={this.state.index}>
          <View style={{ flex: 1 }}>
            {this.state.index === 0 ?
              <CameraScreen val={this.state.index} salut={this.changeIndexToMain} stopScroll={this.stopIndexChanging} resumeScroll={this.resumeIndexChanging}
                onStartShouldSetResponderCapture={(evt) => true}
                onMoveShouldSetResponderCapture={(evt) => true} />
              : null}
          </View>


          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <Button onPress={()=> this.makeRequest()} titleStyle={{fontFamily: 'font1', fontSize: 15, margin: 0}} type="clear" title="Add to story"/>
            <SearchUsers aia={() => this.componentDidMount()} changeIndex={() => this.changeIndexTimeline()} />
          </SafeAreaView>

          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <Timeline salut={this.changeIndexToCamera} />
          </SafeAreaView>
        </Swiper>
      </View>
    )

  }
}

export default withNavigation(Home)

