import React, { Component } from 'react'
import {
    View, Dimensions,
    Text, TouchableOpacity, Image
} from 'react-native'
import { withNavigation } from 'react-navigation'
import * as Font from 'expo-font'
import SafeAreaView from 'react-native-safe-area-view'



const { width, height } = Dimensions.get('screen')

class TutorialSlider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fontsLoaded: false,
            picture: ['https://i.ibb.co/HY7W6WW/Whats-App-Image-2020-08-11-at-1-27-23-PM.jpg',
                'https://i.ibb.co/F3wkC5G/Whats-App-Image-2020-08-11-at-1-27-23-PM-2.jpg',
                'https://i.ibb.co/w7ks8kQ/Whats-App-Image-2020-08-11-at-1-27-23-PM-1.jpg'],
            textArr: ['Introducing future location! Instantly see where all your friends will be! Hold anywhere on the map to start!'],
            indOfP: 0,
        }

    }

    componentDidMount = async () => {

        await Font.loadAsync({
            //font1 or 2 can be any name. This'll be used in font-family

            font1: require('../../../assets/SourceSansPro-Black.ttf'),
        });
        this.setState({ fontsLoaded: true })
    }
    /*https://ibb.co/sQj0n00
https://ibb.co/Jt7WgvX
https://ibb.co/r3jsqjp*/
    changeindex = () => {
        if (this.state.indOfP === 2)
            this.props.navigation.navigate('Home')
        if (this.state.indOfP < 3)
            this.setState({ indOfP: this.state.indOfP + 1 })

    }

    rendertext() {
        if(this.state.indOfP === 0)
        return (
            <View style={{flex: 1}}>
                <Text style={{ fontFamily: 'font1', fontSize: 14, color: 'black' }}>🔵 Introducing future location!</Text>
                <Text style={{ fontFamily: 'font1', fontSize: 14, color: 'black' }}>🔵 Instantly see where all of your friends will be!</Text>
                <Text style={{ fontFamily: 'font1', fontSize: 14, color: 'black' }}>🔵 Start by holding anywhere on the map to begin!</Text>
                <TouchableOpacity onPress={this.changeindex}>
                        <Text style={{ fontFamily: 'font1', fontSize: 16, color: '#0984e3', alignSelf: 'center' }}>Continue</Text>
                    </TouchableOpacity>
            </View>
        )

        if(this.state.indOfP === 1)
        return (
            <View>
                <Text style={{ fontFamily: 'font1', fontSize: 14, color: 'black' }}>🔵 Easily search through your memories!</Text>
                <Text style={{ fontFamily: 'font1', fontSize: 14, color: 'black' }}>🔵 You can filter by album, mood</Text>
                
                <Text style={{ fontFamily: 'font1', fontSize: 14, color: 'black' }}> activity and tagged Friends</Text>
                <TouchableOpacity onPress={this.changeindex}>
                        <Text style={{ fontFamily: 'font1', fontSize: 16, color: '#0984e3', alignSelf: 'center' }}>Continue</Text>
                    </TouchableOpacity>
            </View>
        )

        if(this.state.indOfP === 2)
        return (
            <View>
                <Text style={{ fontFamily: 'font1', fontSize: 14, color: 'black' }}>🔵 Introducing a new timeline!</Text>
                <Text style={{ fontFamily: 'font1', fontSize: 14, color: 'black' }}>🔵 Easily create new memories with a press of a button!</Text>
                
                <TouchableOpacity onPress={this.changeindex}>
                        <Text style={{ fontFamily: 'font1', fontSize: 16, color: '#0984e3', alignSelf: 'center' }}>Continue</Text>
                    </TouchableOpacity>
            </View>
        )
    }
    render() {
        if (this.state.fontsLoaded) {

            return (

                <SafeAreaView style={{ flex: 1, alignItems: 'center', flexDirection: 'column'}}>
                    <Image style={{ width: width, height: height * 0.8}} resizeMode="stretch" source={{ uri: this.state.picture[this.state.indOfP] }} />
                    <View style={{ marginHorizontal: 25, marginVertical:10 }}>
                        {this.rendertext()}
                    {/* <TouchableOpacity onPress={this.changeindex}>
                        <Text style={{ fontFamily: 'font1', fontSize: 16, color: '#0984e3' }}>Continue</Text>
                    </TouchableOpacity> */}
                    </View>

                </SafeAreaView>





            )
        } else {
            return null
        }
    }
}

export default withNavigation(TutorialSlider)