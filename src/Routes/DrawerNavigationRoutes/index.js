import React from 'react';
import { Platform, Dimensions, Easing, Animated } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer'

import Home from '../../view/pages/home';
import UserInfo from '../../view/pages/Register/userInfo';
import Adresses from '../../view/pages/Address/adresses';

// import MenuDrawer from '../components/MenuDrawer';

const WIDTH = Dimensions.get('window').width;

// const DrawerConfig = {
// 	drawerWidth: WIDTH*0.8,
// 	contentComponent: ({ navigation }) => {
// 		return(<MenuDrawer navigation={navigation} />)
// 	}
// }

const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index
    const width = layout.initWidth
    
    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    })
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1],
    })
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0],
    })

    const scaleWithOpacity = { opacity }
    const screenName = "Search"

    if (screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] }
  }
})

const DrawerNavigator =  createDrawerNavigator(
	{
		Home: {
			screen: Home
		},
		UserInfo: {
			screen: UserInfo
		},
		Settings: {
			screen: Adresses
		}
	},
	transitionConfig,
);

export default createAppContainer(DrawerNavigator);