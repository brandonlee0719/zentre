import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

import {
  ContactDetails,
  Family,
  ProfileContact,
  Address,
  Status,
  Fees,
  Groups,
  Paying,
  CreateInvoice,
  ChooseGroup
} from '../screens'

function ContactsStackNav({ route }) {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        initialParams={{
          contact: route.params.contact,
          roleName: route.params?.roleName,
          navigatedFrom: route.params?.navigatedFrom
        }}
        name="ContactDetails"
        component={ContactDetails} />
      <Stack.Screen name="Status" component={Status} />
      <Stack.Screen name="ProfileContact" component={ProfileContact} />
      <Stack.Screen name="Address" component={Address} />
      <Stack.Screen name="Family" component={Family} />
      <Stack.Screen name="Fees" component={Fees} />
      <Stack.Screen name="Groups" component={Groups} />
      <Stack.Screen name="Paying" component={Paying} />
      <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
      <Stack.Screen name="ChooseGroup" component={ChooseGroup} />
    </Stack.Navigator>
  )
}

export default ContactsStackNav