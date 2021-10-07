import React from 'react'
import {
  View,
  ScrollView
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux'

import { Colors, Ic_Back } from '../../../res'
import { t } from '../../../utils'
import { Header, Text } from '../../../components'

import { changeContactStatus } from '../../../utils/store/controllers/contacts'

import Change from './Change'

interface State {

}

class Status extends React.Component<any, State> {

  roleName: string
  status: string
  contact: Contact
  selectedStatus: any

  scrollViewRef: any
  constructor(props) {
    super(props)

    this.selectedStatus = null

    this.roleName = this.props.route.params.roleName
    this.status = this.props.route.params.status
    this.contact = this.props.route.params.contact
  }

  _onBack = () => {
    this.props.navigation.goBack()
  }

  _onPostfix = async () => {
    //console.debug(status)

    if (!this.selectedStatus)
      return

    let res = await this.props.changeContactStatus({
      UserID: this.contact.UserID,
      RoleBindingID: this.contact.RoleBindingID,
      Status: this.selectedStatus.id.toString()
    })

    if (res.meta.requestStatus !== 'rejected') {
      let payload: any = res.payload
      if (payload) {
        if (payload.success) {
          //Success

          this.props.route.params.onChangeStatus(this.selectedStatus.name)
          this.props.navigation.goBack()
        } else {
          //Error
        }
        return
      }
    }
    //Error
  }

  _onChangeStatus = (status) => {
    this.selectedStatus = status
  }

  render() {
    console.warn(this.props.route.params.status);
    
    return (
      <View style={styles.container}>
        <Header
          text={t('status')}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
          postfix={
            <Text
              text={'Update'}
              font={'medium'}
              size={18}
              color={Colors.primary}
            />
          }
          onPostfix={this._onPostfix}
        />
        <ScrollView
          ref={(ref) => this.scrollViewRef = ref}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled={false}>
          <Change
            roleName={this.roleName}
            userStatus={this.status}
            userId={this.contact.UserID}
            roleBindingId={this.contact.RoleBindingID}
            onChangeStatus={this._onChangeStatus}
          //onChangeStatus={this.props.route.params.onChangeStatus}
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
})

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = {
  changeContactStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(Status)