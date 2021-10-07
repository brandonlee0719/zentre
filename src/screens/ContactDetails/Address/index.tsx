import React from 'react'
import {
  View,
  ScrollView,
  BackHandler
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux'

import {
  getContactAddressList,
  deleteContactAddress
} from '../../../utils/store/controllers/contacts'
import { showAlert } from '../../../utils/store/controllers/alert'
import { fetchAppData } from '../../../utils/store/controllers/appData'
import { Header } from '../../../components'
import { t } from '../../../utils'
import { Ic_Back, Colors, Ic_Plus, Styles } from '../../../res'

import CreateAddress from './CreateAddress'
import AddressInfo from './AddressInfo'
import Edit from './Edit'

interface State {
  headerText: string
  currentPage: number
  creating: boolean
  selectedAddress: UserAddress | null
}

class Address extends React.Component<any, State> {

  userId: string
  scrollViewRef: any
  constructor(props) {
    super(props)

    this.userId = this.props.route.params.userId

    this.state = {
      headerText: t('address'),
      currentPage: 0,
      creating: false,
      selectedAddress: null
    }
  }

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress)
    await this.fetchAddressList()
    this.fetchData()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress)
  }

  onHardwareBackPress = (): any => {
    if (this.state.currentPage === 1) {
      this.setState({ currentPage: 0 }, () => {
        this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })
        setTimeout(() => {
          this.setState({ creating: false, selectedAddress: null })
        }, 150)
      })
      return true
    }
    return false
  }

  fetchAddressList = async () => {
    if (!this.props.address) {
      let res = await this.props.getContactAddressList(this.userId)
    }
  }

  fetchData = () => {
    this.props.fetchAppData(['addressTypes', 'countryOfAddress'])
  }

  _onBack = () => {
    if (this.state.currentPage == 0) {
      this.props.navigation.goBack()
    } else if (this.state.currentPage === 1) {
      this.setState({ currentPage: 0 }, () => {
        this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })
        setTimeout(() => {
          this.setState({ creating: false, selectedAddress: null })
        }, 150)
      })
    }
  }

  _onAddAddress = () => {
    this.setState({ currentPage: 1, creating: true }, () => {
      this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
    })
  }

  _getEndIcon = () => {
    if (this.state.currentPage == 0) {
      return <Ic_Plus color={Colors.primary} />
    } else if (this.state.currentPage === 1) {
      return null
    }
  }

  _getCountry = (id: string): CountryOfAddress => {
    let countryOfAddress: CountryOfAddress[] = this.props.countryOfAddress

    let c: CountryOfAddress = this.props.countryOfAddress[0]
    for (let i = 0; i < countryOfAddress.length; ++i) {
      if (id === countryOfAddress[i].id) {
        c = countryOfAddress[i]
        break
      }
    }

    return c
  }

  _onEdit = (address: UserAddress) => {
    this.setState({ currentPage: 1, selectedAddress: address }, () => {
      this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
    })
  }

  _onDelete = async (id: string) => {
    //console.debug(id)
    //console.debug(this.userId)

    let res = await this.props.deleteContactAddress({
      addressId: id,
      userId: this.userId
    })

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload && res.payload.success) {

      } else {
        //Error res.payload.text
      }
      return
    }
    //Error here
  }

  render() {
    let {
      addressTypes,
      countryOfAddress,
      address
    } = this.props

    let {
      headerText,
      creating,
      selectedAddress
    } = this.state

    //console.debug(addressTypes)
    //console.debug(address)
    //console.debug(countryOfAddress)

    return (
      <View style={styles.container}>
        <Header
          text={headerText}
          prefix={<Ic_Back color={Colors.black} />}
          onPrefix={this._onBack}
          postfix={this._getEndIcon()}
          onPostfix={this._onAddAddress}
        />
        {
          addressTypes && countryOfAddress && address && (
            <ScrollView
              ref={(ref) => this.scrollViewRef = ref}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              scrollEnabled={false}>
              <View style={{ width: Styles.WIDTH }}>
                <ScrollView
                  horizontal={false}
                  showsVerticalScrollIndicator={false}>
                  {
                    address.map((a, index) => {
                      return (
                        <AddressInfo
                          key={'key ' + index}
                          address={a}
                          onEdit={this._onEdit}
                          onDelete={this._onDelete}
                          country={this._getCountry(a.ConatctCountry)}
                        />
                      )
                    })
                  }
                </ScrollView>
              </View>
              <CreateAddress
                creating={creating}
                userId={this.userId}
                onCancel={this._onBack}
                addressTypes={addressTypes}
                countryOfAddress={countryOfAddress}
              />
              <Edit
                userId={this.userId}
                onCancel={this._onBack}
                selectedAddress={selectedAddress}
                addressTypes={addressTypes}
                countryOfAddress={countryOfAddress}
              />
            </ScrollView>
          )
        }
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
    addressTypes: state.appDataController.addressTypes,
    countryOfAddress: state.appDataController.countryOfAddress,
    address: state.contactsCController.address
  }
}
const mapDispatchToProps = {
  fetchAppData,
  showAlert,
  getContactAddressList,
  deleteContactAddress
}

export default connect(mapStateToProps, mapDispatchToProps)(Address)