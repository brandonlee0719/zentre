import React from 'react'
import {
  View,
  Keyboard
} from 'react-native'
import { t } from '../../../utils'
import { ScaledSheet } from 'react-native-size-matters'
import { Alert, Header } from '../../../components'
import {
  Colors,
  Ic_Back,
  Ic_Plus,
} from '../../../res'
import { connect } from 'react-redux'
import { showPopup } from '../../../utils/store/controllers/popup'
import CategoryList from './CategoryList'
import { createCategory, getCreateCategory, updateCategory } from '../../../utils/store/controllers/fees'
import { showAlert } from '../../../utils/store/controllers/alert'

class AllCategory extends React.Component<any, any> {
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
  }

  _getCategories = () => {
    const params = this.props.route?.params.option
    this.props.getCreateCategory({ CategoryType: params?.value })
  }
  _onPostfix = () => {
    Keyboard.dismiss()
    this.setState({ addNew: true })
  }

  _onBack = () => {
    this.props.navigation.goBack()
  }

  _onClickOption = (option) => {
    this.props.navigation.navigate("CategoryDetails", { option })
  }

  _onPrefix = (item, pagePosition) => {
    console.warn('item', item);
    this.props.showPopup({
      show: true,
      position: { x: pagePosition.x, y: pagePosition.y },
      options: [
        {
          text: t('editCategory'),
          onClick: () => {
            this.setState({ mode: 1, categoryText: item?.Title, CategoryBindingID: item?.CategoryBindingID, categoryId: item?.CategoryID, addNew: true })
          }
        },
        {
          text: t('deleteCategory'),
          textColor: Colors.red,
          onClick: () => {
            this._delete()
          }
        }
      ]
    })
  }

  _delete = async () => {
    const { categoryText, categoryId, CategoryBindingID } = this.state
    if (categoryText === '') {
      this.props.showAlert({
        show: true,
        title: t('warning'),
        message: t('fillParts')
      })
      return
    }
    let res = await this.props.updateCategory({
      Name: categoryText,
      categoryId: categoryId,
      CategoryBindingID: CategoryBindingID,
      OperType: '-1',
    })

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        let payload = res.payload
        if (payload.success) {
          this._getCategories()
          this.props.showAlert({
            show: true,
            title: t('success'),
            message: "Category has been Deleted!"
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

  changeText = (value) => {
    this.setState({ categoryText: value });
  }

  _next = async () => {
    const { mode, categoryText, categoryId, CategoryBindingID } = this.state
    const params = this.props.route?.params.option
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
        Name: categoryText,
        CategoryType: params.value
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

  onNegative = () => {
    this.setState({ categoryText: '', mode: 0, addNew: false })
  }


  render() {
    console.warn('this.props.categories', this.props.categories);

    const params = this.props.route?.params.option
    return (
      <View style={styles.container}>
        <Header
          text={params?.text}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
          postfix={<Ic_Plus color={Colors.primary} />}
          onPostfix={this._onPostfix}
        />

        <CategoryList
          categoryList={this.props.categories}
          onClickCategory={this._onClickOption}
          onClickOption={this._onPrefix}
        />
        <Alert show={this.state.addNew}
          categoryInput={true}
          categoryText={this.state.categoryText}
          rowButton={true}
          onCategoryText={this.changeText}
          onPositive={this._next}
          message={"Add New Category"}
          positiveText={"Done"}
          onNegative={this.onNegative}
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
  }
}

const mapDispatchToProps = {
  showPopup,
  createCategory,
  showAlert,
  getCreateCategory,
  updateCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(AllCategory);
