import React from 'react'
import { View, Platform, Text, StatusBar } from 'react-native'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import { purple, white } from './utils/colors'
import { NavigationContainer} from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import AddEntry from './components/AddEntry'
import History from './components/History'
import Live from './components/Live'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
// import { Constants } from 'expo-constants'
import { Constants } from 'react-native-unimodules'

function MyStatusBar ({ backgroundColor, ...props }) {
  return (
    <View style={{backgroundColor, height: Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

const Tab = Platform.OS === 'ios'
  ? createBottomTabNavigator()
  : createMaterialTopTabNavigator()

const tabBarOptions = {
  activeTintColor: Platform.OS === 'ios' ? purple : white,
  style: {
    height: 56,
    backgroundColor: Platform.OS === 'ios' ? white : purple,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 1,
  },
  inactiveTintColor: 'gray',
}

export default function App() {
  return (
    <Provider store={createStore(reducer)}>
      <View style={{flex: 1}}>
        <MyStatusBar backgroundColor={purple} barStyle='light'/>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color }) => {
                switch (route.name) {
                  case 'History':
                    return <Ionicons name='ios-bookmarks' size={30} color={color} />
                  case 'Add Entry':
                    return <FontAwesome name='plus-square' size={30} color={color} />
                  case 'Live':
                    return <Ionicons name='ios-move' size={30} color={color} />
                  default:
                    // do nothing
                }
              },
            })}
            tabBarOptions={tabBarOptions}
          >
            <Tab.Screen name='History' component={History} />
            <Tab.Screen name='Add Entry' component={AddEntry} />
            <Tab.Screen name='Live' component={Live} />
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </Provider>
  )
}