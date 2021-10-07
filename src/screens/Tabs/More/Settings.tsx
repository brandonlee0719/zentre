import React from 'react'
import {
  View,
  ScrollView, Keyboard
} from 'react-native'
import { t } from '../../../utils'
import { ScaledSheet } from 'react-native-size-matters'
import { Header, Text } from '../../../components'
import {
  Ic_Setting,
  Colors,
  Ic_Back
} from '../../../res'
import Options from './Options'

class Settings extends React.Component<any, any> {
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
    if (option === t('fees')) {
      this.props.navigation.navigate("FeesSetting")
    }
    if (option === t('feed')) {
      this.props.navigation.navigate("FeedSetting")
    }
  }
  render() {

    return (
      <View style={styles.container}>
        <Header
          text={t('settings')}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
        />


        <ScrollView
          style={styles.scrollcontainer}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          pagingEnabled
        >
          <Options
            onClick={this._onClickOption}
          />
        </ScrollView>
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollcontainer: {
    width: '100%',   
  },
  text: {
    fontSize: 32,
    color: 'black'
  }
})


export default Settings;
