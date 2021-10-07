import React from 'react'
import {
  View,
  ScrollView,
  BackHandler,
  TouchableOpacity
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux'

import { getUserInfo, editContact } from '../../../utils/store/controllers/contacts'
import { showAlert } from '../../../utils/store/controllers/alert'
import { Header, Text } from '../../../components'
import { t } from '../../../utils'
import { Ic_Back, Colors, Styles } from '../../../res'
import { fetchAppData } from '../../../utils/store/controllers/appData'

import ProfileHeader from './ProfileHeader'
import Details from './Details'
import ProfileEdit from './Edit'
//import Other from './Other'
//import Account from './Account'

interface State {
  headerText: string
}

class Profile extends React.Component<any, State> {

  user: Contact
  scrollViewRef: any
  editRef: any
  currentPage: number

  firstName: string
  lastName: string
  gender: Gender | null
  birthDay: string
  inbc: string
  country: Country | null
  nationality: Nationality | null

  constructor(props) {
    super(props)

    this.user = this.props.route.params.user
    this.currentPage = 0

    this.firstName = ''
    this.lastName = ''
    this.gender = null
    this.birthDay = ''
    this.inbc = ''
    this.country = null
    this.nationality = null

    this.state = {
      headerText: t('profile')
    }
  }

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress)
    await this.props.fetchAppData(['genders', 'countries', 'nationalities'])
    this.fetchUserInfo()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress)
  }

  onHardwareBackPress = (): any => {
    if (this.currentPage === 1) {
      this.currentPage = 0
      this._scrollTo(this.currentPage)
      return true
    } else if (this.currentPage === 2) {
      this.currentPage = 1
      this._scrollTo(this.currentPage)
      return true
    } else if (this.currentPage === 3) {
      this.currentPage = 2
      this._scrollTo(this.currentPage)
      return true
    }

    return false
  }

  fetchUserInfo = async () => {
    if (!this.props.userInfo)
      await this.props.getUserInfo(this.user.UserID)
  }

  _onBack = () => {
    if (this.currentPage === 0) {
      this.props.navigation.goBack()
    } else if (this.currentPage === 1) {
      this.currentPage = 0
      this._scrollTo(this.currentPage)
      this.setState({
        headerText: t('profile')
      })
    } /*else if (this.currentPage === 2) {
      this.currentPage = 1
      this._scrollTo(this.currentPage)
    } else if (this.currentPage === 3) {
      this.currentPage = 2
      this._scrollTo(this.currentPage)
    }*/
  }

  _onEdit = () => {
    this.currentPage = 1
    this._scrollTo(this.currentPage)
    this.setState({
      headerText: t('editProfile')
    })
  }

  _scrollTo = (index: number) => {
    this.scrollViewRef?.scrollTo({ x: Styles.WIDTH * index, y: 0, animated: true })
  }

  getPostfix = () => {
    if (this.currentPage === 0) {
      return (
        <Text
          text={t('edit')}
          font={'medium'}
          size={18}
          color={Colors.primary}
        />
      )
    } else if (this.currentPage === 1) {
      return (
        <Text
          text={t('save')}
          font={'medium'}
          size={18}
          color={Colors.primary}
        />
      )
    }

    return null
  }

  _onPostfix = () => {
    if (this.currentPage === 0) {
      this._onEdit()
    } else if (this.currentPage === 1) {
      this.editRef.onSave()
    } else {

    }
  }

  _moreInfo = () => {

  }

  render() {
    let userInfo: UserInfo = this.props.userInfo
    let { headerText } = this.state

    const { genders, countries, nationalities } = this.props
    console.warn('userInfo', userInfo);

    return (
      <View style={styles.container}>
        <Header
          text={headerText}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
          postfix={this.getPostfix()}
          onPostfix={this._onPostfix}
        />
        {
          userInfo && genders && countries && nationalities && (
            <ScrollView
              ref={(ref) => this.scrollViewRef = ref}
              showsHorizontalScrollIndicator={false}
            >
              {
                this.currentPage === 0 &&
                <View style={{ width: Styles.WIDTH }}>
                  <ProfileHeader
                    HeadSculpture={userInfo.HeadSculpture}
                    FirstName={userInfo.FirstName}
                    LastName={userInfo.LastName}
                    Email={userInfo.Email}
                    RoleName={this.user.RoleName}
                  />
                  <Details
                    Sex={userInfo.Sex}
                    nationalities={nationalities}
                    genders={genders}
                    countries={countries}
                    Email={userInfo.Email}
                    Birthday={userInfo.Birthday}
                    CountryID={userInfo.CountryID}
                    CountryBornID={userInfo.CountryBornID}
                    INBC={userInfo.INBC}
                    Tel={userInfo.Phone}
                  />
                  {/* <TouchableOpacity
                    onPress={this._moreInfo}
                    activeOpacity={.7}>
                    <Text
                      text={t('moreInfo')}
                      size={18}
                      font={'medium'}
                      color={Colors.primary}
                      align={'right'}
                      contentContainer={{
                        marginVertical: moderateScale(20),
                        marginEnd: moderateScale(10)
                      }}
                    />
                  </TouchableOpacity> */}
                </View>
              }
              {
                this.currentPage === 1 &&

                <View style={{ width: Styles.WIDTH }}>
                  <ProfileEdit
                    nationalities={nationalities}
                    genders={genders}
                    userInfo={userInfo}
                    roleName={this.user.RoleName}
                    onRef={(ref) => this.editRef = ref}
                    onBack={() => {
                      this._onBack()
                    }}
                  />
                </View>
              }
              <View style={{ width: Styles.WIDTH }}>
                {/*
                  <Other
                    countries={countries}
                    country={userInfo.CountryBornID}
                    onCountry={c => this.country = c}
                    nationalities={nationalities}
                    onNationality={n => this.nationality = n}
                    nationality={userInfo.CountryID}
                  />
                */}
              </View>
              <View style={{ width: Styles.WIDTH }}>
                {/*
                  <Account
                    InsertDate={userInfo.InsertDate}
                    Email={userInfo.Email}
                  />
                */}
              </View>
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
    userInfo: state.contactsCController.userInfo,
    genders: state.appDataController.genders,
    countries: state.appDataController.countries,
    nationalities: state.appDataController.nationalities,
  }
}
const mapDispatchToProps = {
  getUserInfo,
  fetchAppData,
  editContact,
  showAlert
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)