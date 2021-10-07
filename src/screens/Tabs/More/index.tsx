import React from 'react'
import {
  View,
  ScrollView, Keyboard
} from 'react-native'
import { t } from '../../../utils'
import { ScaledSheet } from 'react-native-size-matters'
import { Alert, Header, Text } from '../../../components'
import {
  Ic_Setting,
  Colors,
  Ic_Back
} from '../../../res'
import Options from './Options'

class More extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }
  getPostfix = () => {
    //let { currentPage } = this.state


    return (
      <Text
        text={t('done')}
        size={18}
        font={'medium'}
        color={Colors.primary}

      />
    )


  }
  _onPostfix = () => {
    Keyboard.dismiss()
    this.props.navigation.navigate('Settings')
  }

  _onClickOption = () => {
    console.log('');
  }
  render() {

    return (
      <View style={styles.container}>
        <Header
          text={t('manage')}
          // prefix={<Ic_Back color={Colors.primary} />}
          //  onPrefix={this._onBack}
          postfix={<Ic_Setting color={Colors.primary} />}
          onPostfix={this._onPostfix}
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
    backgroundColor: 'white'
  },
  scrollcontainer: {
    width: '100%',
  },
  text: {
    fontSize: 32,
    color: 'black'
  }
})


export default More;
