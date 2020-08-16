import React, { Component } from 'react'
import { View } from 'react-native'
import firebase from 'firebase'
import Swiper from 'react-native-swiper'
import SearchUsers from '../screens/friendSystem/SearchUsers'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo'
import CameraScreen from '../screens/camera/Camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation'
import Timeline from './Timeline/Timeline'

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
    }

    this.changeIndexTimeline = this.changeIndexTimeline.bind(this)
    this.changeIndexToCamera = this.changeIndexToCamera.bind(this)
    this.changeIndexToMain = this.changeIndexToMain.bind(this)

  }

  changeIndexTimeline = () => {

    this.swiper.scrollTo(2)
  }
  changeIndexToCamera = () => {

    this.swiper.scrollTo(0)
  }

  changeIndexToMain = () => {

    this.swiper.scrollTo(1)
  }




  componentDidMount = async () => {
    arr = []
    finalArr = []
    await this._getToken()
    await this._getProfilePicture()
    console.log('basioapfafap')

    console.log(this.state.stories)
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
    let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    if (status !== 'granted') {
      console.log('n a mers')
    }

    let token = await Notifications.getExpoPushTokenAsync()


    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
      tokens: token
    })
  }







  render() {
    return (

      <View style={{ flex: 1 }}>
        <Swiper
          ref={(swiper) => { this.swiper = swiper; }}
          onIndexChanged={(index) => { console.log(index) }}
          loop={false}
          showsPagination={false}
          index={this.state.index}>
          <View style={{ flex: 1 }}>
            <CameraScreen salut={this.changeIndexToMain} />
          </View>


          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <SearchUsers changeIndex={() => this.changeIndexTimeline()} />
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

