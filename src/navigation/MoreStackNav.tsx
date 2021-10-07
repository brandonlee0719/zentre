import React from 'react'
import {

} from 'react-native'

import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()
import {
  More,
  Settings,
  FeesSetting,
  Category,
  AllCategory,
  CategoryDetails,
  CreateItem,
  FeedSetting,
  Storage
} from '../screens/Tabs'


function MoreStackNav() {

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="More" component={More} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="FeesSetting" component={FeesSetting} />
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="AllCategory" component={AllCategory} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
      <Stack.Screen name="CreateItem" component={CreateItem} />
      <Stack.Screen name="FeedSetting" component={FeedSetting} />
      <Stack.Screen name="Storage" component={Storage} />
    </Stack.Navigator>
  )
}

export default MoreStackNav