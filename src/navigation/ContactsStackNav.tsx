import React from 'react'
import {

} from 'react-native'

import { createStackNavigator } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
const Stack = createStackNavigator()

import { Contacts } from '../screens/Tabs'

import {
  AllContact,
  EditGroup,
  CreateGroup,
  CreateNewContact,
  AllGroups,
  //UpdateGroupAttendance,
  GroupProfile,
  AddMembers,
  AllGroupMembers
} from '../screens'

import ContactDetailsNav from './ContactDetailsNav'

function ContactsStackNav({ route, navigation }) {

  const focusedRoute = getFocusedRouteNameFromRoute(route)
  if (
    focusedRoute === 'Contacts' ||
    focusedRoute === undefined
  ) {
    navigation.setOptions({ tabBarVisible: true })
  } else {
    navigation.setOptions({ tabBarVisible: false })
  }

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Contacts" component={Contacts} />
      <Stack.Screen name="AllGroups" component={AllGroups} />
      <Stack.Screen name="EditGroup" component={EditGroup} />
      <Stack.Screen name="GroupProfile" component={GroupProfile} />
      <Stack.Screen name="ContactDetailsNav" component={ContactDetailsNav} />
      <Stack.Screen name="CreateNewContact" component={CreateNewContact} />
      <Stack.Screen name="CreateGroup" component={CreateGroup} />
      <Stack.Screen name="AllContact" component={AllContact} />
      <Stack.Screen name="AddMembers" component={AddMembers} />
      <Stack.Screen name="AllGroupMembers" component={AllGroupMembers} />
      {/*
      <Stack.Screen name="UpdateGroupAttendance" component={UpdateGroupAttendance} />
  */}
    </Stack.Navigator>
  )
}

export default ContactsStackNav