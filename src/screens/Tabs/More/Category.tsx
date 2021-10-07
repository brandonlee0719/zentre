import React from 'react'
import {
  View,
  ScrollView, Keyboard, TouchableOpacity
} from 'react-native'
import { t } from '../../../utils'
import { ScaledSheet } from 'react-native-size-matters'
import { Header, Text } from '../../../components'
import {
  Ic_Setting,
  Colors,
  Ic_Back,
  Ic_Arrow_Right
} from '../../../res'

class Category extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }
  _onPostfix = () => {
    Keyboard.dismiss()
  }

  _onBack = () => {
    this.props.navigation.goBack()
  }

  _onClickOption = (option) => {
    this.props.navigation.navigate(option.route, { option: option.option ? option.option : option })
  }
  render() {
    const optionArray = [
      {
        text: t('basic'), route: "AllCategory", value: 11000000
      },
      {
        text: t('discount'), route: "CategoryDetails", option: { CategoryBindingID: '9293E011-3C2C-42EA-924A-E6C9EE48F706', Title: t('discount'), CategoryType: 12000000 }, value: 12000000
      },
      {
        text: t('deposit'), route: "CategoryDetails", option: { CategoryBindingID: '86018157-4BC5-4AE6-B3D4-92E3FC3342EA', Title: t('deposit') , CategoryType: 13000000}, value: 13000000
      },
      {
        text: t('subsidy'), route: "CategoryDetails", option: { CategoryBindingID: 'ACB84827-ACED-4696-8512-65AF9ED0AA02', Title: t('subsidy'), CategoryType: 14000000 }, value: 14000000
      },
      {
        text: t('wholeDiscount'), route: "CategoryDetails", option: { CategoryBindingID: '9293E011-3C2C-42EA-924A-E6C9EE48F706', Title: t('wholeDiscount') , CategoryType: 12000000}, value: 12000000
      },
      {
        text: t('Tax'), route: "CategoryDetails", option: { CategoryBindingID: '7297A617-F663-4E0E-899F-D9DD56454A90', Title: t('Tax'), CategoryType: 15000000 }, value: 15000000
      },
    ]
    return (
      <View style={styles.container}>
        <Header
          text={t('category')}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
        />


        <ScrollView
          style={styles.scrollcontainer}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          pagingEnabled
        >
          {
            optionArray.map((option, i) => (
              <TouchableOpacity
                onPress={() => {
                  this._onClickOption(option)
                }}
                activeOpacity={.7}
                key={'key - ' + i}
                style={styles.optionContainer}>
                <Text
                  text={option.text}
                  font={'regular'}
                  size={16}
                  color={Colors.primary}
                />
                <View style={styles.endContainer}>
                  <Ic_Arrow_Right color={Colors.primary} />
                </View>
              </TouchableOpacity>
            ))
          }

        </ScrollView>
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  scrollcontainer: {
    width: '100%',
    paddingHorizontal: '10@ms',
  },
  text: {
    fontSize: 32,
    color: 'black'
  },
  optionContainer: {
    width: '100%',
    height: '56@ms',
    borderWidth: 1,
    borderColor: Colors.grey3,
    borderRadius: '4@ms',
    paddingHorizontal: '10@ms',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '12@ms'
  },
  endContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})


export default Category;
