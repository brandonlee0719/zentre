import React from 'react'
import {
  View,
  ScrollView,
  BackHandler
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { getGoodsSales, _setFeeItems, _setSubsidiesItems, getGoodsSalesSubsidies, createInvoice } from '../../../../utils/store/controllers/invoice'
import { showAlert } from '../../../../utils/store/controllers/alert'
import { t } from '../../../../utils'
import { Header, Text } from '../../../../components'
import { Ic_Back, Colors, Styles, Ic_Plus } from '../../../../res'

interface State {
  currentPage: string
  pages: string[]
  subsidiesItems: Array<any>
  invoiceTitle: string
  invoiceDate: any
  invoiceDueDate: any
  forDiscountItem: any
  allDiscount: any
}

import CreateInvoice from './CreateInvoice'
import Items from './Items'
import AddItem from './AddItem'
import Subsides from './Subsides'
import Discount from './Discount'
import { connect } from 'react-redux'
import moment from 'moment'

const pages = {
  createInvoice: "CreateInvoice",
  items: 'Items',
  addItem: 'AddItem',
  subsides: 'Subsides',
  discount: 'Discount'
}

class Create extends React.Component<any, State> {

  scrollViewRef: any
  constructor(props) {
    super(props)

    this.state = {
      currentPage: pages.createInvoice,
      pages: [],
      subsidiesItems: [],
      allDiscount: [],
      invoiceTitle: '',
      forDiscountItem: null,
      invoiceDate: new Date(),
      invoiceDueDate: new Date(),
    }
  }

  componentDidMount() {
    this.getItems()
    this.getSubsidiesItems('ACB84827-ACED-4696-8512-65AF9ED0AA02', false)
    this.getSubsidiesItems('9293E011-3C2C-42EA-924A-E6C9EE48F706', true)


    BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress)
  }

  componentWillReceiveProps(props) {
    if (props.discountItems) {
      this.setState({ allDiscount: props.discountItems })
    }
  }

  getItems = () => {
    // const body = {
    //   "PageIndex": 1,
    //   "PageSize": 10,
    //   "Wheres": [
    //     {
    //       "ID": SCHOOL_ID,
    //       "KeyName": "AccountInfoID",
    //       "KeyValue": SCHOOL_ID
    //     },
    //     {
    //       "ID": SCHOOL_ID,
    //       "KeyName": "CategoryType",
    //       "KeyValue": 11000000
    //     }],
    //   "Orderby": "",
    //   "Groupby": ""
    // }
    this.props.getGoodsSales({ CategoryType: 11000000 })
    // this.props.getGoodsSales({ CategoryType: 14000000, Subsidies: true })
  }
  getSubsidiesItems = (id, isDiscount) => {
    const ID = this.uuidv4()
    const body = {
      "Wheres": [
        {
          "ID": ID,
          "KeyName": "CategoryBindingID",
          "KeyValue": id
        }],
      "Orderby": "",
      "Groupby": ""
    }
    this.props.getGoodsSalesSubsidies({ body, isDiscount })
  }

  setFeeItems = (item, deleteItem) => {
    this.props._setFeeItems({ item, deleteItem })
  }

  setDiscountInFeeItems = async (item) => {
    await this.props._setFeeItems({ item, deleteItem: false, isDiscount: true })
    this._onItems()
    for (let k = 0; k < this.state.allDiscount.length; k++) {
      const element = this.state.allDiscount[k];
      element.selected = false
    }
    this.setState(pre => ({
      ...pre,
      allDiscount: this.props.discountItems,
      forDiscountItem: null
    }))
  }

  setSubsidiesItems = (items) => {
    this.setState({ subsidiesItems: items })
  }

  onHardwareBackPress = (): any => {
    let { currentPage } = this.state

    if (currentPage === pages.items || currentPage === pages.subsides) {
      this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })
      setTimeout(() => {
        this.setState({
          currentPage: pages.createInvoice,
          pages: []
        })
      }, 150)

      return true
    } else if (currentPage === pages.addItem || currentPage === pages.discount) {

      this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
      setTimeout(() => {
        this.setState({
          currentPage: pages.items
        })
      }, 150)

      return true
    }

    return false
  }

  onBack = () => {
    let { currentPage } = this.state

    if (currentPage === pages.items || currentPage === pages.subsides) {
      this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })
      setTimeout(() => {
        this.setState({
          currentPage: pages.createInvoice,
          pages: []
        })
      }, 150)
    } else if (currentPage === pages.addItem || currentPage === pages.discount) {

      this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
      setTimeout(() => {
        this.setState({
          currentPage: pages.items
        })
      }, 150)

    } else {
      this.props.navigation.goBack()
    }
  }

  getHeaderText = () => {
    let { currentPage } = this.state

    if (currentPage === pages.createInvoice) {
      return 'Create Invoice'
    } else if (currentPage === pages.items) {
      return 'Items'
    } else if (currentPage === pages.addItem) {
      return 'Add Item'
    } else if (currentPage === pages.subsides) {
      return 'Add Subsides'
    } else if (currentPage === pages.discount) {
      return 'Discount'
    }

    return ''
  }

  getPostfix = () => {
    let { currentPage } = this.state

    if (currentPage === pages.createInvoice) {
      return (
        <Text
          text={t('create')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    } else if (currentPage === pages.items) {
      return <Ic_Plus color={Colors.primary} />
    } else if (currentPage === pages.addItem) {
      return null
    } else if (currentPage === pages.subsides || currentPage === pages.discount) {
      return (
        <Text
          text={t('add') + (currentPage === pages.subsides ? " (" + this.selectedSubsidies(this.state.subsidiesItems).length + ")" : '')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    }

    return null
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  _createInvoice = async () => {
    const { invoiceDueDate, invoiceTitle, invoiceDate, subsidiesItems } = this.state;
    const { feeItems } = this.props;
    if (!invoiceDueDate || !invoiceTitle && !invoiceDate) {
      this.props.showAlert({
        show: true,
        title: t('warning'),
        message: t('fillParts')
      })
      return
    }
    else {
      var subTotal: number = 0
      var totalDiscount: number = 0
      var totalSubsidy: number = 0
      var totalTax: number = 0
      var subsidyPaid: number = 0
      var amountPaid: number = 0
      const subsidies = this.selectedSubsidies(subsidiesItems)

      const newList: Array<any> = []
      let PaymentNotice = this.uuidv4()
      const userInfo = this.props.route.params?.userInfo
      const ClassID = this.props.route.params?.ClassID
      const roleName = this.props.route.params?.roleName

      feeItems?.forEach(element => {
        const ItemID = this.uuidv4()
        if (element) {
          const feeItem = {
            ItemID: ItemID,
            ParentItemID: "",
            SaleID: element.ID,
            PaymentNotice: PaymentNotice,
            Item__Titile: element.Goods_Titile,
            Item__Description: element.Goods_Description,
            Item_CategoryBindingID: element.Sale_CategoryBindingID,
            UnitPrice: element.UnitPrice,
            IsHaveTax: element.IsHaveTax,
            IsTaxIncluded: element.IsTaxIncluded,
            Tate_Type: element.Tate_Type,
            Tate: element.Tate,
            IsSaleLimit: element.IsSaleLimit,
            Item_Quantity: element.quantity,
            Item_UnitOf: element.quantity,
            AccountCode: element.AccountCode,
            COGSAccountCode: element.COGSAccountCode,
            TaxType: element.TaxType,
            Item_SubTotal: element.UnitPrice,
            Item_TotalDiscount: element?.TotalDiscount ? (element.TotalDiscount * element.quantity) : 0,
            Item_TotalSubsidy: 0,
            Item_TotalTax: element.Tate,
            Item_Total: (Number(element.UnitPrice) * Number(element.quantity)),
            Item_Remark: '',
            // Current_Quantity: element.quantity,
            // CustomCodes: element.CustomCodes,
            // Attributes: element.Attributes,
          }
          newList.push(feeItem)

          subTotal += (Number(element?.UnitPrice) * Number(element.quantity))
          totalTax += Number(element?.Tate)
          totalDiscount += element?.TotalDiscount ? (element.TotalDiscount * element.quantity) : 0
        }
      });
      subsidies?.forEach(element1 => {
        const ItemID = this.uuidv4()
        if (element1) {
          const feeItem = {
            ItemID: ItemID,
            ParentItemID: "",
            SaleID: element1.ID,
            PaymentNotice: PaymentNotice,
            Item__Titile: element1.Goods_Titile,
            Item__Description: element1.Goods_Description,
            Item_CategoryBindingID: element1.Sale_CategoryBindingID,
            UnitPrice: element1.UnitPrice,
            IsHaveTax: element1.IsHaveTax,
            IsTaxIncluded: element1.IsTaxIncluded,
            Tate_Type: element1.Tate_Type,
            Tate: element1.Tate,
            IsSaleLimit: element1.IsSaleLimit,
            Item_Quantity: element1.quantity,
            Item_UnitOf: element1.quantity,
            AccountCode: element1.AccountCode,
            COGSAccountCode: element1.COGSAccountCode,
            TaxType: element1.TaxType,
            Item_SubTotal: element1.UnitPrice,
            Item_TotalDiscount: 0,
            Item_TotalSubsidy: 0,
            Item_TotalTax: element1.Tate,
            Item_Total: Number(element1.UnitPrice),
            Item_Remark: '',
            // Current_Quantity: element.quantity,
            // CustomCodes: element.CustomCodes,
            // Attributes: element.Attributes,
          }
          newList.push(feeItem)
          totalSubsidy += Number(element1?.UnitPrice)
          subsidyPaid += Number(element1?.UnitPrice)
        }

      });
      var total = (Number(subTotal) + Number(totalTax))
      console.warn('ClassID', ClassID);

      const res = await this.props.createInvoice({
        Name: invoiceTitle,
        Date: moment(invoiceDate).format('YYYY-MM-DD hh:mm:ss'),
        DueDate: moment(invoiceDueDate).format('YYYY-MM-DD hh:mm:ss'),
        SubTotal: Number(subTotal),
        TotalDiscount: Number(totalDiscount),
        TotalSubsidy: Number(totalSubsidy),
        TotalTax: Number(totalTax),
        Total: total,
        SubsidyPaid: subsidyPaid,
        AmountPaid: amountPaid,
        FeeItems: newList,
        PaymentNotice: PaymentNotice,
        ToUserID: userInfo.UserID,
        ClassID: ClassID,
      })

      if (res.payload) {
        let payload = res.payload

        if (payload.success) {
          this.props.showAlert({
            show: true,
            title: t('success'),
            message: "Invoice has bee created!"
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
  }

  _onPostfix = () => {
    let { currentPage } = this.state

    if (currentPage === pages.createInvoice) {
      this._createInvoice()
    } else if (currentPage === pages.items) {
      this.setState({
        currentPage: pages.addItem,
      }, () => {
        this.scrollViewRef?.scrollTo({ x: Styles.WIDTH * 2, y: 0, animated: true })
      })
    } else if (currentPage === pages.addItem) {

    } else if (currentPage === pages.subsides) {

    } else if (currentPage === pages.discount) {
      this.onAddDiscount()
    }
  }
  selectDiscount = (value, item) => {
    let list: Array<any> = []
    for (let i = 0; i < this.state.allDiscount.length; i++) {
      const element = this.state.allDiscount[i];
      if (element.GoodsID === item.GoodsID) {
        element.selected = value
      }
      list.push(element)
    }
    this.setState({ allDiscount: list })
  }

  getTotalAmount = () => {
    let total = 0
    for (let j = 0; j < this.state.allDiscount.length; j++) {
      const element1 = this.state.allDiscount[j];
      if (element1.selected) {
        if (element1.Tate_Type === "0") {
          total += (this.state.forDiscountItem.UnitPrice * (element1.UnitPrice / 100))
        } else {
          total += element1.UnitPrice
        }
      }
    }
    return total
  }

  onAddDiscount = () => {

    const selectedDiscountItems = this.state.allDiscount.filter(e => e.selected === true)
    const selectedItem = {
      ...this.state.forDiscountItem, TotalDiscount: this.getTotalAmount(),
      selectedDiscountItems: selectedDiscountItems
    }
    this.setDiscountInFeeItems(selectedItem)
  }

  getPage = (page) => {
    if (page === pages.items) {
      return (
        <Items
          setFeeItems={this.setFeeItems}
          feeItems={this.props.feeItems}
          onDiscountItem={this._onDiscountItem}
        />
      )
    } else if (page === pages.addItem) {
      return (
        <AddItem
          setFeeItems={this.setFeeItems}
          allItems={this.props.basicItems}
        />
      )
    } else if (page === pages.subsides) {
      return (
        <Subsides
          setSubsidiesItems={this.setSubsidiesItems}
          subsidiesItems={this.props.subsidiesItems}
        />
      )
    } else if (page === pages.discount) {
      return (
        <Discount
          discountItems={this.state.allDiscount}
          selectDiscount={this.selectDiscount}
          getTotalAmount={this.getTotalAmount}
        />
      )
    }
  }

  _onItems = () => {

    this.setState({
      currentPage: pages.items,
      pages: [pages.items, pages.addItem, pages.discount],
      forDiscountItem: null
    }, () => {
      this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
    })
  }

  _onSubsides = () => {
    this.setState({
      currentPage: pages.subsides,
      pages: [pages.subsides]
    }, () => {
      this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
    })
  }

  _onDiscountItem = (item: any) => {
    if (item?.selectedDiscountItems?.length > 0) {
      const list = []
      for (let a = 0; a < this.state.allDiscount?.length; a++) {
        const element2 = this.state.allDiscount[a];
        let newElement: any;
        for (let b = 0; b < item?.selectedDiscountItems?.length; b++) {
          const element3 = item?.selectedDiscountItems[b];
          if (element2.GoodsID === element3.GoodsID) {
            newElement = {
              ...element2,
              selected: true
            }
          }
        }
        if (newElement) {
          list.push(newElement)
        } else {
          newElement = {
            ...element2,
            selected: false
          }
          list.push(newElement)
        }

      }
      this.setState(pre => ({
        ...pre,
        allDiscount: list
      }))
    }
    this.setState({
      currentPage: pages.discount,
      forDiscountItem: item
    }, () => {
      this.scrollViewRef?.scrollTo({ x: Styles.WIDTH * 3, y: 0, animated: true })
    })
  }

  selectedSubsidies = (data: any) => {
    return data?.filter(e => e.selected)
  }

  handleChange = (type: any, value: any) => {
    this.setState(prevState => ({
      ...prevState,
      [type]: value,
    }));
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          text={this.getHeaderText()}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this.onBack}
          postfix={this.getPostfix()}
          onPostfix={this._onPostfix}
        />

        <ScrollView
          ref={(ref) => { this.scrollViewRef = ref }}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled={false}>

          <CreateInvoice
            invoiceTitle={this.state.invoiceTitle}
            invoiceDate={this.state.invoiceDate}
            invoiceDueDate={this.state.invoiceDueDate}
            handleChange={this.handleChange}
            subsidiesItems={this.selectedSubsidies(this.state.subsidiesItems)}
            feeItems={this.props.feeItems}
            onItems={this._onItems}
            onSubsides={this._onSubsides}
          />
          {
            this.state.subsidiesItems && this.state.pages.length > 0 && (
              this.state.pages.map((page, i) => {
                return (
                  <View
                    style={styles.page}
                    key={'page- ' + i}>
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
  page: {
    width: Styles.WIDTH
  }
})

const mapStateToProps = state => {
  return {
    basicItems: state.invoiceController.basicItems,
    subsidiesItems: state.invoiceController.subsidiesItems,
    discountItems: state.invoiceController.discountItems,
    feeItems: state.invoiceController.feeItems,
  }
}

const mapDispatchToProps = {
  getGoodsSales,
  _setFeeItems,
  _setSubsidiesItems,
  getGoodsSalesSubsidies,
  createInvoice,
  showAlert
}


export default connect(mapStateToProps, mapDispatchToProps)(Create)