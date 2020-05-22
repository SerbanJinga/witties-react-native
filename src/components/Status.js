import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Text, Image } from 'react-native'
import * as theme from '../styles/theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Octicons from 'react-native-vector-icons/Octicons'
const { height, width } = Dimensions.get('window')
export default class Status extends Component {
  

  _renderTimestamps = (timestamp) =>{
    let date = new Date(timestamp * 1000)
    let hours = date.getHours()
    let minutes = "0" + date.getMinutes()
    let seconds = "0" + date.getSeconds()

    let formattedTime = hours + ":" + minutes.substr(-2) + ':' + seconds.substr(-2)
    return formattedTime
  } 
    render(){
        return(
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.press()}>
            <ImageBackground
              style={[styles.flex, styles.destination, styles.shadow]}
              imageStyle={{ borderRadius: theme.sizes.radius }}
              source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/witties.appspot.com/o/profiles_picture%2FQCLKoR1skhUEExopmeZLqQ7a9Ir1?alt=media&token=4058b5af-d554-426a-82d2-c28da6b3ef18' }}
            >
              <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <View style={{ flex: 0 }}>
                  <Image source={{ uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80' }} style={styles.avatar} />
                </View>
                <View style={[styles.column, { flex: 2, paddingHorizontal: theme.sizes.padding / 2 }]}>
                  <Text style={{ color: theme.colors.white, fontWeight: 'bold' }}>{this.props.activity}</Text>
                  <Text style={{ color: theme.colors.white }}>
                    <Octicons
                      name="smiley"
                      size={theme.sizes.font * 0.8}
                      color={theme.colors.white}
                    />
                    <Text> {this.props.mood}</Text>
                  </Text>
                </View>
                <View style={{ flex: 0, justifyContent: 'center', alignItems: 'flex-end', }}>
              <Text style={styles.rating}>{this._renderTimestamps(this.props.timestamp)}</Text>
            </View>
              </View>
            </ImageBackground>
              <View style={[styles.column, styles.destinationInfo, styles.shadow]}>
                <Text style={{ fontSize: theme.sizes.font * 1.25, fontWeight: '500', paddingBottom: 8, }}>
                  {this.props.activity}
                </Text>
                <View style={[ styles.row, { justifyContent: 'space-between', alignItems: 'flex-end', }]}>
                  <Text style={{ color: theme.colors.caption }}>
                    {this.props.text}
                  </Text>
                  <FontAwesome
                    name="chevron-right"
                    size={theme.sizes.font * 0.75}
                    color={theme.colors.caption}
                  />
                </View>
              </View>
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
  }
});

//     <Text>Activitate: {this.props.activity}</Text>
//<Text>Mood: {this.props.mood}</Text>
//<Text>Text: {this.props.text}</Text>
//<Text>Cine a pus story: {this.props.creatorId}</Text>
