import React, { Component } from 'react'
import { View } from 'react-native'
import firebase from 'firebase'
import Swiper from 'react-native-swiper'
import SearchUsers from '../screens/friendSystem/SearchUsers'
import * as Permissions from 'expo-permissions'
// import * as Notifications from 'expo-notifications'
import CameraScreen from '../screens/camera/Camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation'
import Timeline from './Timeline/Timeline'
import { Constants } from 'expo-camera'

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
    await this._getToken()
    await this._getProfilePicture()
    setTimeout(() => {
      this.componentDidMount()
    }, 4000)
  }






  _getProfilePicture = async () => {
    let initialQuery = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    let documents = await initialQuery.get()
    let documentData = documents.data().profilePicture
    this.setState({
      profilePicture: documentData
    })

  }

  _getToken = async () => {
    console.log('intri ba?')
    // const { status: existingStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    // if(existingStatus !== 'granted') {
    //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //   console.log(status)
    // }

    // Notifications.getDevicePushTokenAsync().then(data =>firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
    //   tokens: data,
    //   estibine: "aia zic"
    // }) )
    
    
    // const token = await Notifications.getDevicePushTokenAsync()
    
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

