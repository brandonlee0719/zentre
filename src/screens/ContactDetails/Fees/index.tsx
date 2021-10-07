import React from 'react'
import {
  View,
  ScrollView
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import { getInvoices, getClassesByUserID } from '../../../utils/store/controllers/invoice'

import { Header, LineInfo } from '../../../components'
import { Ic_Back, Colors, Ic_Plus } from '../../../res'

import FeesHeader from './FeeHeader'
import { connect } from 'react-redux'

interface State {

}

class Fees extends React.Component<any, State> {
  scrollViewRef: any
  roleName: string
  userInfo: UserInfo
  constructor(props) {
    super(props)
    this.roleName = this.props.route.params.roleName
    this.userInfo = this.props.route.params.userInfo
  }

  componentDidMount() {
    this._getInvoices("onVoid")
    this._getInvoices("")
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  _getInvoices = (type: any) => {
    const userInfo = this.props.route.params?.userInfo
    const touserUserID = userInfo.UserID
    let ID = this.uuidv4()
    let ID1 = this.uuidv4()
    const body = {
      "Wheres": [{
        "ID": ID,
        "KeyName": "ToUserID", "KeyValue": touserUserID
      },
      {
        "ID": ID1,
        "KeyName": "InvoiceState", "KeyValue": type === "onVoid" ? -1 : 0
      }],
      "Orderby": "", "Groupby": ""
    }
    this.props.getInvoices({ body, Void: type === "onVoid" ? true : false })
    this.props.getClassesByUserID({ UserID: userInfo.UserID })
  }

  _onPostfix = () => {
    this.props.navigation.navigate('CreateInvoice', { userInfo: this.userInfo, roleName: this.roleName })
  }

  onOutstanding = () => {
    this.props.navigation.navigate('Paying', { userInfo: this.userInfo, roleName: this.roleName, type: 'onOutstanding' })
  }

  onVoid = () => {
    this.props.navigation.navigate('Paying', { userInfo: this.userInfo, roleName: this.roleName, type: 'onVoid' })
  }

  getTotal = (data: any) => {
    let total = 0
    for (let i = 0; i < data?.length; i++) {
      const element = data[i];
      total += element.Total
    }
    return total.toFixed(2)
  }

  render() {
    console.warn('this.userInfo', this.userInfo);
    console.warn('this.userClasses', this.props.userClasses);

    return (
      <View style={styles.container}>
        <Header
          text={'Invoices'}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={() => this.props.navigation.goBack()}
          // postfix={<Ic_Plus color={Colors.primary} />}
          onPostfix={this._onPostfix}
        />
        <FeesHeader
          name={this.userInfo?.FirstName + ' ' + this.userInfo?.LastName}
          avatar={this.userInfo?.HeadSculpture}
          email={this.userInfo?.Email}
          insertDate={this.userInfo?.EnrolmentDate}
        />

        {/* <ScrollView
          ref={(ref) => { this.scrollViewRef = ref }}
          showsVerticalScrollIndicator={false}
        >
          {
            this.props.allInvoices?.Invoices?.map((invoice, index) => (
              <LineInfo
                key={index}
                prefixText={invoice?.InvoiceName}
                postfixText={'$' + invoice?.Total}
                hasBorder
                containerStyle={{ marginBottom: 20 }}
                prefixTextStyles={{ color: Colors.black, size: 16, font: 'regular' }}
                postfixTextStyles={{ color: Colors.primary, size: 16, font: 'medium' }}
                onClick={() => { }}
              />
            ))
          }
        </ScrollView> */}
        <LineInfo
          prefixText={'Outstanding'}
          postfixText={'$' + this.getTotal(this.props.outstandingInvoices)}
          hasBorder
          containerStyle={{ marginTop: moderateScale(16) }}
          prefixTextStyles={{ color: Colors.black, size: 16, font: 'regular' }}
          postfixTextStyles={{ color: Colors.red, size: 16, font: 'medium' }}
          onClick={this.onOutstanding}
        />
        <LineInfo
          prefixText={'Void'}
          postfixText={'$' + this.getTotal(this.props.voidInvoices)}
          hasBorder
          containerStyle={{ marginTop: moderateScale(16) }}
          prefixTextStyles={{ color: Colors.black, size: 16, font: 'regular' }}
          postfixTextStyles={{ color: Colors.red, size: 16, font: 'medium' }}
          onClick={this.onVoid}
        />
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
})

const mapStateToProps = state => {
  return {
    voidInvoices: state.invoiceController.voidInvoices,
    outstandingInvoices: state.invoiceController.outstandingInvoices,
    userClasses: state.invoiceController.userClasses,
  }
}

const mapDispatchToProps = {
  getInvoices,
  getClassesByUserID
}

export default connect(mapStateToProps, mapDispatchToProps)(Fees)
