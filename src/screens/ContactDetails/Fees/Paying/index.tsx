import React from 'react'
import {
  View,
  ScrollView,
  BackHandler
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux'
import { getInvoices, getInvoiceByID, voidInvoice } from '../../../../utils/store/controllers/invoice'
import { Header, Text } from '../../../../components'
import { Styles, Colors, Ic_Back, Ic_Plus, Ic_Dot3_Vertical } from '../../../../res'
import { showAlert } from '../../../../utils/store/controllers/alert'
import { showPopup } from '../../../../utils/store/controllers/popup'

const SCHOOL_ID = '79AF1B80-1983-4CFB-B16A-3EAB3B1DE845'

interface State {
  currentPage: string
  pages: string[]
  selectedInvoice: any
}

const pages = {
  fees: 'Fees',
  feeDetails: 'FeeDetails',
  paymentDetails: 'PaymentDetails',
  payment: 'Payment',
  transaction: 'Transaction',
  invoiceDetails: 'InvoiceDetails'
}

import Fees from './Fees'
import FeeDetails from './FeeDetails'
import PaymentDetails from './PaymentDetails'
import Payment from './Payment'
import Transaction from './Transaction'
import InvoiceDetails from './InvoiceDetails'
import { t } from '../../../../utils'

class Paying extends React.Component<any, State> {

  scrollViewRef: any
  currentPageIndex: number
  constructor(props) {
    super(props)

    this.currentPageIndex = 0

    this.state = {
      currentPage: pages.fees,
      pages: [],
      selectedInvoice: null
    }
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress)
    this._getInvoices()
    this.props.navigation.addListener('focus', () => {
      this._getInvoices()
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress)
  }
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  _getInvoices = () => {
    const userInfo = this.props.route.params?.userInfo
    const type = this.props.route.params?.type
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
  }

  onHardwareBackPress = (): any => {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex -= 1
      this.scrollViewRef?.scrollTo({ x: this.currentPageIndex * Styles.WIDTH, y: 0, animated: true })
      setTimeout(() => {
        this.currentPageIndex === 0 ?
          this.setState({
            pages: [],
            currentPage: pages.fees
          })
          :
          this.setState({
            currentPage: this.state.pages[this.currentPageIndex - 1]
          })
      }, 150)
      return true
    }

    return false
  }

  _onBack = () => {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex -= 1
      this.scrollViewRef?.scrollTo({ x: this.currentPageIndex * Styles.WIDTH, y: 0, animated: true })
      setTimeout(() => {
        this.currentPageIndex === 0 ?
          this.setState({
            pages: [],
            currentPage: pages.fees
          })
          :
          this.setState({
            currentPage: this.state.pages[this.currentPageIndex - 1]
          })
      }, 150)
    } else {
      this.props.navigation.goBack()
    }
  }

  getPage = (page: string) => {
    if (page === pages.feeDetails) {
      return (
        <FeeDetails />
      )
    } else if (page === pages.paymentDetails) {
      return (
        <PaymentDetails />
      )
    } else if (page === pages.payment) {
      return (
        <Payment />
      )
    } else if (page === pages.transaction) {
      return (
        <Transaction />
      )
    } else if (page === pages.invoiceDetails) {
      return (
        <InvoiceDetails singleInvoice={this.props.singleInvoice} />
      )
    }

    return null
  }

  getHeaderText = () => {
    let { currentPage } = this.state
    const type = this.props.route.params?.type
    if (currentPage === pages.fees) {
      return type === "onVoid" ? "Void" : 'Outstanding'
    } else if (currentPage === pages.feeDetails || currentPage === pages.paymentDetails) {
      return 'Details'
    } else if (currentPage === pages.payment || currentPage === pages.transaction) {
      return 'Payment'
    } else if (currentPage === pages.invoiceDetails) {
      return 'Invoice Details'
    }

    return ''
  }

  getPostfix = () => {
    let { currentPage } = this.state

    if (currentPage === pages.fees) {
      return (<Ic_Plus color={Colors.primary} />)
    } else if (currentPage === pages.feeDetails || currentPage === pages.payment) {
      return (
        <Text
          text={'Pay Now'}
          size={16}
          font={'medium'}
          color={Colors.primary}
        />
      )
    } else if (currentPage === pages.paymentDetails) {
      return (
        <Text
          text={'Next'}
          size={16}
          font={'medium'}
          color={Colors.primary}
        />
      )
    } else if (currentPage === pages.transaction) {
      return (
        <Text
          text={'Close'}
          size={16}
          font={'medium'}
          color={Colors.primary}
        />
      )
    } else if (currentPage === pages.invoiceDetails) {
      return (<Ic_Dot3_Vertical color={Colors.primary} />)
    }

    return null
  }

  _onPostfix = () => {
    let { currentPage } = this.state
    const type = this.props.route.params?.type
    if (currentPage === pages.fees) {
      const userInfo = this.props.route.params?.userInfo
      const roleName = this.props.route.params?.roleName
      const userClasses = this.props.userClasses
      if (userClasses?.length === 0) {
        this.props.navigation.navigate('CreateInvoice', { userInfo: userInfo, roleName: roleName, ClassID: '' })
      } else if (userClasses?.length === 1) {
        this.props.navigation.navigate('CreateInvoice', { userInfo: userInfo, roleName: roleName, ClassID: userClasses[0].ClassID })
      } else if (userClasses?.length > 1) {
        this.props.navigation.navigate('ChooseGroup', { userInfo: userInfo, roleName: roleName, userClasses: userClasses })
      }

    } else if (currentPage === pages.feeDetails) {
      this.currentPageIndex += 1;
      this.setState({
        currentPage: pages.paymentDetails
      }, () => {
        this.scrollViewRef?.scrollTo({ x: this.currentPageIndex * Styles.WIDTH, y: 0, animated: true })
      })
    } else if (currentPage === pages.paymentDetails) {
      this.currentPageIndex += 1;
      this.setState({
        currentPage: pages.payment
      }, () => {
        this.scrollViewRef?.scrollTo({ x: this.currentPageIndex * Styles.WIDTH, y: 0, animated: true })
      })
    } else if (currentPage === pages.payment) {
      this.currentPageIndex += 1;
      this.setState({
        currentPage: pages.transaction
      }, () => {
        this.scrollViewRef?.scrollTo({ x: this.currentPageIndex * Styles.WIDTH, y: 0, animated: true })
      })
    } else if (currentPage === pages.invoiceDetails) {
      if (type === "onVoid") {
        this._onVoidOptions()
      } else {
        this._onOptions()
      }
    }
  }

  _onOptions = () => {
    this.props.showPopup(
      {
        show: true,
        position: { x: Styles.WIDTH - 20, y: 36 },
        options: [
          {
            text: 'Pay',
            onClick: () => { this._onPay() }
          },
          {
            text: 'Share',
            onClick: () => { }
          },
          {
            text: 'History',
            onClick: () => { }
          },
          {
            text: 'Void',
            onClick: () => { this._onVoid() }
          },
          {
            text: 'Copy',
            onClick: () => { }
          },
        ]
      }
    )
  }

  _onVoidOptions = () => {
    this.props.showPopup(
      {
        show: true,
        position: { x: Styles.WIDTH - 20, y: 36 },
        options: [
          {
            text: 'Share',
            onClick: () => { }
          },
          {
            text: 'Copy',
            onClick: () => { }
          },
        ]
      }
    )
  }

  _onPay = () => {
    this.currentPageIndex += 1
    if (this.currentPageIndex === 1) {
      this.setState({
        pages: [pages.feeDetails, pages.paymentDetails, pages.payment, pages.transaction],
        currentPage: pages.feeDetails
      }, () => {
        this.scrollViewRef?.scrollTo({ x: this.currentPageIndex * Styles.WIDTH, y: 0, animated: true })
      })
    } else {
      this.setState({
        currentPage: pages.feeDetails
      }, () => {
        this.scrollViewRef?.scrollTo({ x: this.currentPageIndex * Styles.WIDTH, y: 0, animated: true })
      })
    }
  }

  _onVoid = async (onVoid?: any) => {
    const singleInvoice: any = onVoid ? onVoid : this.props.singleInvoice?.Invoice
    const userInfo = this.props.route.params?.userInfo
    const roleName = this.props.route.params?.roleName
    const payable: any = (Number(singleInvoice?.SubTotal) + Number(singleInvoice?.TotalTax) + Number(singleInvoice?.TotalDiscount))
    const res = await this.props.voidInvoice({
      VoidAmount: payable,
      InvoiceID: singleInvoice?.InvoiceID,
      PaymentNotice: singleInvoice?.PaymentNotice
    })

    if (res.payload) {
      let payload = res.payload

      if (payload.success) {
        this.props.showAlert({
          show: true,
          title: t('success'),
          message: "Invoice has bee void!"
        })
        this.props.navigation.navigate("Fees", { userInfo, roleName })
        // this.setState({
        //   textfromserver: "response from category API: " + this.categoryResponse + "|| response from goods: " + payload.text
        // })
      } else {
        this.props.showAlert({
          show: true,
          title: t('warning'),
          message: payload.text
        })
      }
    } else {
      console.log(res);
    }
  }

  _onDetails = (item) => {
    this.currentPageIndex += 1;
    this.props.getInvoiceByID({ ID: item?.InvoiceID, IDType: "InvoiceID" })
    this.setState({
      pages: [pages.invoiceDetails, pages.feeDetails, pages.paymentDetails, pages.payment, pages.transaction],
      currentPage: pages.invoiceDetails,
      selectedInvoice: item
    }, () => {
      this.scrollViewRef?.scrollTo({ x: this.currentPageIndex * Styles.WIDTH, y: 0, animated: true })
    })
  }

  render() {
    let { pages, currentPage } = this.state
    console.warn('Invoices', this.props.allInvoices?.Invoices);

    return (
      <View style={styles.container}>
        <Header
          text={this.getHeaderText()}
          onPrefix={this._onBack}
          prefix={<Ic_Back color={Colors.primary} />}
          postfix={this.getPostfix()}
          onPostfix={this._onPostfix}
        />
        <ScrollView
          ref={(ref) => { this.scrollViewRef = ref }}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled={false}>

          <Fees onVoid={this._onVoid} invoices={this.props.allInvoices?.Invoices} onDetails={this._onDetails} onPay={this._onPay} />
          {
            pages.length > 0 && (
              pages.map((page, i) => {
                return (
                  <View
                    key={'page-' + i}
                    style={styles.pageContainer}>
                    {this.getPage(page)}
                  </View>
                )
              })
            )
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
  pageContainer: {
    width: Styles.WIDTH
  }
})

const mapStateToProps = state => {
  return {
    categoryItems: state.feesController.categoryItems,
    allInvoices: state.invoiceController.allInvoices,
    singleInvoice: state.invoiceController.singleInvoice,
    userClasses: state.invoiceController.userClasses,
  }
}

const mapDispatchToProps = {
  showPopup,
  getInvoices,
  getInvoiceByID,
  voidInvoice,
  showAlert
}

export default connect(mapStateToProps, mapDispatchToProps)(Paying)