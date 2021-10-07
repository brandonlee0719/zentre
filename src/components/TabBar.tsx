import React from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native';
import { moderateScale } from 'react-native-size-matters'

import { Ic_Contacts, Ic_Feed, Ic_More, Ic_Profile, Colors } from '../res'
import { Text } from '../components'

function TabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: Colors.white,
      height: moderateScale(69),
      borderTopStartRadius: moderateScale(20),
      borderTopEndRadius: moderateScale(20),
      shadowColor: Colors.black,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 12,
    }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            // canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const _getIcon = () => {
          switch (label) {
            case 'Feed':
              return <Ic_Feed color={isFocused ? Colors.primary : Colors.black} />
            case 'ContactsStack':
              return <Ic_Contacts color={isFocused ? Colors.primary : Colors.black} />
            case 'Manage':
              return <Ic_More color={isFocused ? Colors.primary : Colors.black} />
            case 'Profile':
              return <Ic_Profile color={isFocused ? Colors.primary : Colors.black} />

            default:
              return <Ic_Feed color={isFocused ? Colors.primary : Colors.black} />
          }
        }

        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            activeOpacity={0.75}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            {_getIcon()}
            <Text
              text={label === 'ContactsStack' ? 'Contacts' : label}
              color={isFocused ? Colors.primary : Colors.black}
              font={'medium'}
              size={12}
              contentContainer={{
                marginTop: label === 'Manage' ? 8 : 0,
                marginBottom:label === 'Manage' ? -6 : 0,
              }}
            />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default TabBar