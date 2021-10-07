import React from 'react'
import {
  View,
  ScrollView, Keyboard, TouchableOpacity
} from 'react-native'
import { t } from '../../../utils'
import { ScaledSheet } from 'react-native-size-matters'
import { Alert, Header, Text } from '../../../components'
import {
  Ic_Setting,
  Colors,
  Ic_Back,
  Ic_Arrow_Right,
  Ic_Plus,
  Ic_Dot3_Vertical,
  Styles
} from '../../../res'
import { connect } from 'react-redux'
import { showPopup } from '../../../utils/store/controllers/popup'
import CategoryItemList from './CategoryItemList'
import { createCategory, getCreateCategory, updateCategory, getGoodsSales } from '../../../utils/store/controllers/fees'
import { showAlert } from '../../../utils/store/controllers/alert'
const SCHOOL_ID = '79AF1B80-1983-4CFB-B16A-3EAB3B1DE845'

class CategoryDetails extends React.Component<any, any> {
  onEditing: boolean
  constructor(props) {
    super(props)
    this.onEditing = false
    this.state = {
      addNew: false,
      categoryText: '',
      categoryId: '',
      CategoryBindingID: '',
    }
  }

  componentDidMount() {
    this._getCategories()
    this.props.navigation.addListener('focus', () => {
      this._getCategories()
    });
  }

  _getCategories = () => {
    const params = this.props.route?.params.option
    const body = {
      "PageIndex": 1,
      "PageSize": 10,
      "Wheres": [
        {
          "ID": SCHOOL_ID,
          "KeyName": "AccountInfoID",
          "KeyValue": '79AF1B80-1983-4CFB-B16A-3EAB3B1DE845'
        },
        {
          "ID": SCHOOL_ID,
          "KeyName": "CategoryBindingID",
          "KeyValue": params?.CategoryBindingID
        }],
      "Orderby": "",
      "Groupby": ""
    }
    this.props.getGoodsSales({ body })
  }
  _onPostfix = () => {
    Keyboard.dismiss()
    const option = this.props.route?.params.option
    this.props.navigation.navigate("CreateItem", { option })
  }

  _onBack = () => {
    this.props.navigation.goBack()
  }

  _onClickOption = () => {
    console.log('');
  }

  _onPrefix = (item, pagePosition) => {
    this.props.showPopup({
      show: true,
      position: { x: pagePosition.x, y: pagePosition.y },
      options: [
        {
          text: t('editItem'),
          onClick: () => {
            const option = this.props.route?.params.option
            this.props.navigation.navigate("CreateItem", { option, item })
          }
        },
        {
          text: t('deleteItem'),
          textColor: Colors.red,
          onClick: () => {
            this._delete()
          }
        }
      ]
    })
  }

  _delete = () => {
    console.log('');
  }

  changeText = (value) => {
    this.setState({ categoryText: value });
  }

  _next = async () => {
    const { mode, categoryText, categoryId, CategoryBindingID } = this.state
    if (categoryText === '') {
      this.props.showAlert({
        show: true,
        title: t('warning'),
        message: t('fillParts')
      })
      return
    }
    let res;
    if (mode === 1) {
      res = await this.props.updateCategory({
        Name: categoryText,
        categoryId: categoryId,
        CategoryBindingID: CategoryBindingID,
        OperType: '1',
      })
    } else {
      res = await this.props.createCategory({
        Name: categoryText
      })
    }

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        let payload = res.payload
        if (payload.success) {
          this._getCategories()
          this.props.showAlert({
            show: true,
            title: t('success'),
            message: mode === 1 ? "Category has been updated!" : "Category has been Added!"
          })
          this.setState({ categoryText: '', mode: 0, addNew: false })
        } else {
          this.props.showAlert({
            show: true,
            title: t('warning'),
            message: payload.text
          })
        }

      } else {
        console.log('in else', res);
      }
    }

  }


  render() {
    console.warn(this.props?.categoryItems?.Sales);

    const params = this.props.route?.params.option
    return (
      <View style={styles.container}>
        <Header
          text={params?.Title}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
          postfix={<Ic_Plus color={Colors.primary} />}
          onPostfix={this._onPostfix}
        />
        <CategoryItemList
          category={params}
          categoryItemList={this.props?.categoryItems?.Sales}
          onClickCategory={this._onClickOption}
          onClickOption={this._onPrefix}
        />

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
    borderColor: Colors.grey2,
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

const mapStateToProps = state => {
  return {
    categories: state.feesController.categories,
    categoryItems: state.feesController.categoryItems,
  }
}

const mapDispatchToProps = {
  showPopup,
  createCategory,
  showAlert,
  getCreateCategory,
  updateCategory,
  getGoodsSales
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDetails);
