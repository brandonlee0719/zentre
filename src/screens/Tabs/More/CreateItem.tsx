import React from 'react'
import {
  View,
  ScrollView, Keyboard
} from 'react-native'
import { connect } from 'react-redux'
import { t } from '../../../utils'
import { ScaledSheet } from 'react-native-size-matters'
import { Header, Text, SearchBar, Alert } from '../../../components'
import { showAlert } from '../../../utils/store/controllers/alert'
import { createCategory, createGoods, updateGoodsSales } from '../../../utils/store/controllers/fees'
import {
  Ic_Plus,
  Colors,
  Styles,
  Ic_Back
} from '../../../res'
import {
  Input,
  DropDownList,
  DatePicker,
} from '../../../components'
import Info from './Info'

class CreateItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0,
      mode: 0,
      Name: '', Amount: '', Tax: '', Description: '',
      Tate_Type: 0,
      CheckBoxValue: false
    }
  }

  componentDidMount() {
    const item = this.props.route?.params.item
    if (item) {
      this.setState({
        mode: 1,
        Name: item?.Goods_Titile,
        Tax: item?.Tate,
        CheckBoxValue: item?.IsTaxIncluded,
        Amount: item?.UnitPrice.toString(),
        Description: item?.Goods_Description,
        Tate_Type: item?.Tate_Type,
      })
    }
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
    this._next()

  }
  _next = async () => {
    const { mode, Name, Amount, Tax, Tate_Type, Description, CheckBoxValue } = this.state
    if (Name === '' ||
      Amount === '' ||
      Description === '') {
      console.log('in if');

      this.props.showAlert({
        show: true,
        title: t('warning'),
        message: t('fillParts')
      })
      return
    }


    const option = this.props.route?.params?.option
    console.warn('option', option);

    // create goods
    let resGoods;
    if (mode === 1) {
      const item = this.props.route?.params.item
      item.Goods_Titile = Name
      item.Tate = Tax
      item.IsTaxIncluded = CheckBoxValue
      item.Tate_Type = Tate_Type
      item.UnitPrice = Amount
      item.Goods_Description = Description
      const Sales = [item]
      resGoods = await this.props.updateGoodsSales({
        Sales: Sales,
      })
    } else {
      resGoods = await this.props.createGoods({
        Name: Name,
        Description: Description,
        CategoryBindingID: option?.CategoryBindingID,
        Root_ID: option?.CategoryBindingID,
        IsTaxIncluded: CheckBoxValue,
        Tate_Type: Tate_Type,
        Tate: Tax,
        UnitPrice: Amount
      })
    }
    console.log('in goods', resGoods);
    if (resGoods.payload) {
      let payload = resGoods.payload
      if (payload.success) {
        console.log('goods payload:', JSON.parse(payload.text));

        this.props.showAlert({
          show: true,
          title: t('success'),
          message: "Goods ID: " + JSON.parse(payload.text).ID
        })
        this.props.navigation.navigate("CategoryDetails", { option })
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
      return
    } else {
      console.log(resGoods);
    }
  }

  _onBack = () => {
    this.props.navigation.goBack()
  }

  handleChange = (type: any, value: any, tate_value?: any) => {
    if (type === 'Tate_Type') {
      this.setState({ [type]: tate_value })
    } else {
      this.setState({ [type]: value })
    }
  }

  render() {
    const option = this.props.route?.params?.option
    console.warn('option', option);
    return (
      <View style={styles.container}>
        <Header
          text={this.state.mode === 1 ? t('editItem') : t('createItem')}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
          postfix={this.getPostfix()}
          onPostfix={this._onPostfix}
        />
        <ScrollView
          // ref={(ref) => this.scrollViewRef = ref}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          pagingEnabled
        >

          <Info
            onPhoto={(text) => this.handleChange('Photo', text)}
            onName={(text) => this.handleChange('Name', text)}
            onTax={(text) => this.handleChange('Tax', text)}
            onDescription={(text) => this.handleChange('Description', text)}
            onAmount={(text) => this.handleChange('Amount', text)}
            onCheckBox={(text) => this.handleChange('CheckBoxValue', text)}
            Name={this.state.Name}
            Tax={this.state.Tax}
            categoryType={option?.CategoryType}
            Description={this.state.Description}
            Amount={this.state.Amount}
            CheckBoxValue={this.state.CheckBoxValue}
            Tate_Type={this.state.Tate_Type}
            onTate_Type={(text, value) => this.handleChange('Tate_Type', text, value)}
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
  text: {
    fontSize: 32,
    color: 'black'
  }
})

const mapStateToProps = state => {
  return {
    genders: state.appDataController.genders,
  }
}
const mapDispatchToProps = {

  showAlert, createCategory,
  createGoods,
  updateGoodsSales
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateItem)
