import React from 'react'
import {
  View,
  ScrollView,
  BackHandler,
  Keyboard
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux'

import {
  Colors,
  Ic_Back,
  Styles
} from '../../res'
import {
  Header,
  Text
} from '../../components'
import { t, isEmailValid, checkIfHasInvalidChar } from '../../utils'
import {
  fetchAppData
} from '../../utils/store/controllers/appData'
import { showAlert } from '../../utils/store/controllers/alert'
import { createContact, uploadFile } from '../../utils/store/controllers/contacts'

import Info from './Info'
import Avatar from './Avatar'

interface State {
  currentPage: number
  valueEmpty: string
  gender: string
  nationality: string
  country: string
}

class CreateNewContact extends React.Component<any, State> {

  scrollViewRef: any
  type: string

  firstName: string
  lastName: string
  gender: Gender | null
  nationality: Nationality | null
  country: Country | null
  birthDate: string
  mobileNo: string
  password: string
  avatar: string
  email: string

  constructor(props) {
    super(props)

    this.type = this.props.route.params.type
    this.scrollViewRef = React.createRef<ScrollView>()

    this.firstName = ''
    this.lastName = ''
    this.gender = null
    this.nationality = null
    this.country = null
    this.birthDate = ''
    this.mobileNo = ''
    this.password = ''
    this.avatar = ''
    this.email = ''

    this.state = {
      currentPage: 0,
      valueEmpty: '',
      gender: '',
      country: '',
      nationality: ''
    }
  }

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress)
    await this.props.fetchAppData(['genders', 'countries', 'nationalities'])
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress)
  }

  onHardwareBackPress = (): any => {
    let { currentPage } = this.state

    if (currentPage == 1) {
      this.setState({
        currentPage: 0
      }, () => {
        this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })
      })
      return true
    }

    return false
  }

  _onBack = () => {
    let { currentPage } = this.state

    if (currentPage == 1) {
      this.setState({
        currentPage: 0
      }, () => {
        this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })
      })
    } else {
      this.props.navigation.goBack()
    }
  }

  _next = async () => {
    if (this.firstName === '' || this.lastName === '' ||
      this.gender === null || this.gender.name === 'Select' ||
      this.mobileNo === '' || this.email === '' ||
      this.country === null || this.country.name === 'Select' ||
      this.nationality === null || this.nationality.name === 'Select') {

      this.props.showAlert({
        show: true,
        title: t('warning'),
        message: t('fillParts')
      })
      return
    }

    if (!isEmailValid(this.email)) {
      this.props.showAlert({
        show: true,
        title: t('warning'),
        message: t('emailAddressFormat')
      })
      return
    }

    if (checkIfHasInvalidChar(this.password)) {
      this.props.showAlert({
        show: true,
        title: t('warning'),
        message: t('canNotInclude')
      })
      return
    }

    if (this.scrollViewRef !== null) {
      this.setState({
        currentPage: 1
      }, () => {
        this.scrollViewRef.scrollTo({
          x: Styles.WIDTH,
          y: 0, animated: true
        })
      })
    }
  }

  _onFinish = async () => {
    if (this.firstName === '' || this.lastName === '' ||
      this.gender === null || this.gender.name === 'Select' ||
      this.mobileNo === '' || this.email === '' ||
      this.country === null || this.country.name === 'Select' ||
      this.nationality === null || this.nationality.name === 'Select') {
      this.props.showAlert({
        show: true,
        title: t('warning'),
        message: t('fillParts')
      })
      return
    }
    const { genders, countries, nationalities } = this.props

    let avatarPath = ''
    if (this.avatar !== '') {
      let resAvatar = await this.props.uploadFile({ file: this.avatar })
      if (resAvatar.meta.requestStatus !== 'rejected') {
        if (resAvatar.payload) {
          let payload = resAvatar.payload
          if (payload.success) {
            //console.debug(payload.text)
            avatarPath = 'https://contacts.ichild.com.sg' + payload.text
          } else {
            this.props.showAlert({
              show: true,
              title: t('warning'),
              message: payload.text
            })
            return
          }
        } else return
      }
    }

    //CreateType => 1=Staff 2=Student/Member

    //For Student => Status =>  1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw 10 = Trial
    //For Staff => Status =>  1 = Active 2 = Suspended 4 =Resigned
    const selectedCountry = countries?.filter(e => e.name === this.country)
    const selectedgender = genders?.filter(e => e.name === this.gender)
    const selectednationality = nationalities?.filter(e => e.name === this.nationality)

    const body = {
      CreateType: this.type === 'student' ? '2' : '1',
      INBC: this.password,
      Birthday: this.birthDate,
      FirstName: this.firstName,
      LastName: this.lastName,
      Status: "1",
      Phone: this.mobileNo,
      Sex: selectedgender[0].id,
      CountryBorn: selectedCountry[0].id,
      Country: selectednationality[0].id,
      HeadPic: avatarPath,
      Email: this.email
    }
    console.warn('body', body);

    let res = await this.props.createContact(body)

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        let payload = res.payload
        if (payload.success) {
          this.props.navigation.goBack()
        } else {
          this.props.showAlert({
            show: true,
            title: t('warning'),
            message: payload.text
          })
        }
        return
      }
    }

    // this.props.showAlert({
    //   show: true,
    //   title: t('error'),
    //   message: t('somethingWrong')
    // })
  }

  getPostfix = () => {
    let { currentPage } = this.state

    if (currentPage === 0) {
      return (
        <Text
          text={t('next')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    } else if (currentPage === 1) {
      return (
        <Text
          text={t('finish')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    }

    return null
  }

  _onPostfix = () => {
    let { currentPage } = this.state

    if (currentPage === 0) {
      Keyboard.dismiss()
      this._next()
    } else if (currentPage === 1) {
      this._onFinish()

    }
  }

  checkEmail = () => {
    if (!isEmailValid(this.email)) {
      this.setState({ valueEmpty: t('emailLoginId') })
      this.props.showAlert({
        show: true,
        title: t('error'),
        message: t('emailAddressFormat')
      })
    }
  }

  checkFirstName = () => {
    const regex = /^[a-zA-Z]+$/;
    if (regex.test(this.firstName)) {
      console.log('pass');
    } else {
      this.setState({ valueEmpty: t('firstName') })
      this.props.showAlert({
        show: true,
        title: t('error'),
        message: t('alphabetFormat')
      })
    }
  }

  checkLastName = () => {
    const regex = /^[a-zA-Z]+$/;
    if (regex.test(this.lastName)) {
      console.log('pass');
    } else {
      this.setState({ valueEmpty: t('lastName') })
      this.props.showAlert({
        show: true,
        title: t('error'),
        message: t('alphabetFormat')
      })
    }
  }

  render() {
    const { genders, countries, nationalities } = this.props
    return (
      <View style={styles.container}>
        <Header
          text={this.type === 'student' ? t('newStudent') : t('newStaff')}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
          postfix={this.getPostfix()}
          onPostfix={this._onPostfix} />
        {
          genders && countries && nationalities && (
            <ScrollView
              ref={(ref) => this.scrollViewRef = ref}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              pagingEnabled>

              <Info
                genders={genders}
                nationalities={nationalities}
                countries={countries}
                gender={this.state.gender}
                nationality={this.state.nationality}
                country={this.state.country}
                checkEmail={this.checkEmail}
                checkFirstName={this.checkFirstName}
                checkLastName={this.checkLastName}
                valueEmpty={this.state.valueEmpty}
                onFirstName={(text) => { this.firstName = text }}
                onLastName={(text) => { this.lastName = text }}
                onGender={(gender) => {
                  this.setState({ gender: gender })
                  this.gender = gender
                }}
                onCountry={(country) => {
                  this.setState({ country: country })
                  this.country = country
                }}
                onBirthDate={(date) => { this.birthDate = date }}
                onMobileNo={(mobileNo) => { this.mobileNo = mobileNo }}
                onResidency={(nationality) => {
                  this.setState({ nationality: nationality })
                  this.nationality = nationality
                }}
                onPassword={(pass) => { this.password = pass }}
                onEmail={(email) => { this.email = email }}
                type={this.type}
              />
              <Avatar
                onAvatar={(avatar) => { this.avatar = avatar }}
                onFinish={this._onFinish}
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
    backgroundColor: Colors.white
  },
})

const mapStateToProps = state => {
  return {
    genders: state.appDataController.genders,
    countries: state.appDataController.countries,
    nationalities: state.appDataController.nationalities,
  }
}
const mapDispatchToProps = {
  fetchAppData,
  showAlert,
  createContact,
  uploadFile
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewContact)