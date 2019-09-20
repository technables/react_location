/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import FetchLocation from './components/FetchLocation';
import Geolocation from '@react-native-community/geolocation';
import UsersMap from './components/UsersMap';

// export default class App extends React.Component {
//   getUserLocationHandler = ()=>{
//     Geolocation.getCurrentPosition(position=>{
//       console.log(position);
//     },err=>console.log(err));
//   }

export default class App extends React.Component {
  state = {
    userLocation: null,
    usersPlaces: [],
  };

  getUserLocationHandler = () => {
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0622,
            longitudeDelta: 0.0421,
          },
        });
        fetch('https://react-con.firebaseio.com/places.json', {
          method: 'POST',
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        })
          .then(res => console.log(res))
          .catch(err => console.log(err));
      },
      err => console.log(err),
    );
  };

  getUserPlacesHandler = () => {
    fetch('https://react-con.firebaseio.com/places.json')
      .then(res => res.json())
      .then(parsedJson => {
        const placesArray = [];
        for (const key in parsedJson) {
          placesArray.push({
            latitude: parsedJson[key].latitude,
            longitude: parsedJson[key].longitude,
            id: key,
          });
          
        }
        this.setState({
          usersPlaces: placesArray,
        });
      })
      .catch(err => console.log(err));
  };
  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            <View style={styles.sectionContainer}>
              <View style={{marginBottom: 20}}>
                <Button
                  title="Get User Places"
                  onPress={this.getUserPlacesHandler}
                />
              </View>
              <FetchLocation
                onGetLocation={this.getUserLocationHandler.bind(this)}
              />
              <UsersMap
                userLocation={this.state.userLocation}
                usersPlaces={this.state.usersPlaces}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

//export default App;
