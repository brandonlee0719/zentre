import React from 'react'
import {
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux';

import { Text, Header, SearchBar } from '../../components'
import { t } from '../../utils'
import { Colors, Ic_Back, Styles, Ic_Plus } from '../../res'
import { showPopup } from '../../utils/store/controllers/popup'

import CheckBoxes from './CheckBoxes'

interface State {
  contacts: Contact[]
}

class AllContact extends React.Component<any, State> {

  contacts: Contact[]
  orderedContacts: Contact[]

  checkedStudent: boolean
  checkedStaff: boolean

  titleIndexOfStudent: number
  titleIndexOfStaff: number

  isSearching: boolean
  constructor(props) {
    super(props)

    this.contacts = this.props.route.params.contacts
    this.orderedContacts = this.getOrderedContacts(this.contacts)

    this.checkedStaff = true
    this.checkedStudent = true

    this.isSearching = false

    this.titleIndexOfStudent = this.getFirstIndexOfType(this.orderedContacts, 'Member')
    this.titleIndexOfStaff = this.getFirstIndexOfType(this.orderedContacts, 'Staff')
    //console.debug(this.contacts)

    this.state = {
      contacts: this.orderedContacts
    }
  }

  _onCheckBox = (type: 'staff' | 'student', value: boolean) => {
    //console.debug(type + ' -- ' + value)

    let tempContact: Contact[] = []

    if (type === 'staff') {
      this.checkedStaff = value
    } else {
      this.checkedStudent = value
    }

    if (this.checkedStudent) {
      let students = this.getStudents(this.contacts)
      //tempContact = [...students]
      Array.prototype.push.apply(tempContact, students)
    }

    if (this.checkedStaff) {
      let staffs = this.getStaffs(this.contacts)
      //tempContact = [...staffs]
      Array.prototype.push.apply(tempContact, staffs)
    }

    this.titleIndexOfStudent = this.getFirstIndexOfType(tempContact, 'Member')
    this.titleIndexOfStaff = this.getFirstIndexOfType(tempContact, 'Staff')

    this.setState({
      contacts: tempContact
    })
  }

  getOrderedContacts = (c: Contact[]) => {
    let students = this.getStudents(c)
    let staffs = this.getStaffs(c)

    //console.debug(students.length)
    //console.debug(staffs.length)
    //Array.prototype.push.apply(ordered, this.getStaffs(c))

    return [...students, ...staffs]
  }

  getStudents = (c: Contact[]): Contact[] => {
    let students: Contact[] = []

    if (!c || c.length === 0)
      return students

    for (let i = 0; i < c.length; ++i) {
      if (c[i].RoleName === 'Member') {
        students.push(c[i])
      }
    }

    return students
  }

  getStaffs = (c: Contact[]): Contact[] => {
    let staffs: Contact[] = []

    if (!c || c.length === 0)
      return staffs

    for (let i = 0; i < c.length; ++i) {
      if (c[i].RoleName === 'Staff') {
        staffs.push(c[i])
      }
    }

    return staffs
  }

  getFirstIndexOfType = (c: Contact[], type: string) => {
    let index = -1
    for (let i = 0; i < c.length; ++i) {
      if (c[i].RoleName === type) {
        index = i
        break
      }
    }

    return index
  }

  getStudentSize = () => {
    let size = 0

    if (!this.state.contacts || this.state.contacts.length === 0)
      return size

    for (let i = 0; i < this.state.contacts.length; ++i) {
      if (this.state.contacts[i].RoleName === 'Member') {
        size += 1
      }
    }

    return size
  }

  getStaffSize = () => {
    let size = 0

    if (!this.state.contacts || this.state.contacts.length === 0)
      return size

    for (let i = 0; i < this.state.contacts.length; ++i) {
      if (this.state.contacts[i].RoleName === 'Staff') {
        size += 1
      }
    }

    return size
  }

  _onContact = (contact: Contact) => {
    this.props.navigation.navigate('ContactDetailsNav', {
      contact: contact
    })
  }

  renderItem = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => this._onContact(item)}
          activeOpacity={.7}
          style={styles.itemContainer}>
          {
            this.titleIndexOfStudent === index && (
              <Text
                text={t('students') + " (" + this.getStudentSize() + ")"}
                color={Colors.black}
                size={18}
                font={'medium'}
              />
            )
          }
          {
            this.titleIndexOfStaff === index && (
              <Text
                text={t('staffs') + " (" + this.getStaffSize() + ")"}
                color={Colors.black}
                size={18}
                font={'medium'}
                contentContainer={{
                  marginTop: moderateScale(36)
                }}
              />
            )
          }
          <View style={styles.contactContainer}>
            {
              item.HeadSculpture ?
                (
                  <Image source={{ uri: 'https://contacts.ichild.com.sg' + item.HeadSculpture }} style={styles.avatar} />
                )
                :
                (
                  <Image source={require('../../../assets/images/placeHolder.png')}
                    style={styles.avatar} />
                )
            }
            <Text
              text={item.FirstName + ' ' + item.LastName}
              color={Colors.black}
              size={16}
              font={'regular'}
              contentContainer={{
                marginStart: moderateScale(10)
              }}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
      </>
    )
  }

  _onSearch = (text) => {
    if (this.isSearching)
      return

    if (text.length === 0) {
      this.titleIndexOfStudent = this.getFirstIndexOfType(this.orderedContacts, 'Member')
      this.titleIndexOfStaff = this.getFirstIndexOfType(this.orderedContacts, 'Staff')

      this.setState({ contacts: this.orderedContacts })
      this.isSearching = false
      return
    }

    this.isSearching = true

    let filteredContact = this.orderedContacts.filter(
      contact => (contact.FirstName.includes(text) || contact.LastName.includes(text))
    )

    this.titleIndexOfStudent = this.getFirstIndexOfType(filteredContact, 'Member')
    this.titleIndexOfStaff = this.getFirstIndexOfType(filteredContact, 'Staff')

    this.setState({ contacts: filteredContact })

    this.isSearching = false
  }

  getHeader = () => {
    return (
      <View>
        <SearchBar
          containerStyle={{
            marginTop: moderateScale(36)
          }}
          onSearch={this._onSearch}
        />

        <CheckBoxes onCheckBox={this._onCheckBox} />
        {
          (!this.checkedStaff && !this.checkedStudent) &&
          <Text
            text={"No Category Selected"}
            color={Colors.black}
            size={16}
            font={'regular'}
            contentContainer={{
              textAlign: 'center'
            }}
          />
        }
      </View>
    )
  };

  _onPostfix = (x, y) => {
    this.props.showPopup({
      show: true,
      position: { x: Styles.WIDTH - 20, y: 36 },
      options: [
        {
          text: t('createStudent'),
          onClick: () => {
            this.props.navigation.navigate('CreateNewContact', {
              type: 'student'
            })
          }
        },
        {
          text: t('createStaff'),
          onClick: () => {
            this.props.navigation.navigate('CreateNewContact', {
              type: 'staff'
            })
          }
        }
      ]
    })
  }

  render() {
    console.warn(this.state.contacts);

    return (
      <View style={styles.container}>
        <Header
          text={t('allContacts')}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={() => this.props.navigation.goBack()}
          postfix={<Ic_Plus color={Colors.primary} />}
          onPostfix={this._onPostfix}
        />


        <FlatList
          data={this.state.contacts}
          renderItem={this.renderItem}
          ListHeaderComponent={this.getHeader}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, i) => 'item-' + i}
        />
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemContainer: {
    width: Styles.WIDTH,
    paddingHorizontal: '10@ms'
  },
  contactContainer: {
    width: '100%',
    //backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '12@ms'
  },
  avatar: {
    width: '32@ms',
    height: '32@ms',
    borderRadius: '16@ms',
    //borderWidth: 1,
    //borderColor: Colors.gr,
  },
  separator: {
    width: Styles.WIDTH - moderateScale(20),
    marginStart: '10@ms',
    height: 1,
    backgroundColor: Colors.grey1,
  }
})

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = {
  showPopup,
}

export default connect(mapStateToProps, mapDispatchToProps)(AllContact)