import React, {
  useEffect,
  useState
} from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native'

import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Colors, Styles } from '../../../res'
import { t, useAppDispatch, useAppSelector } from '../../../utils'
import { getContactList } from '../../../utils/store/controllers/contacts'

import { ContactPerson, Text } from '../../../components'

interface Props {
  onClickContact: (contact: Contact) => void
  viewAll: (contacts: Contact[]) => void
}

function Contacts({
  onClickContact,
  viewAll
}: Props) {

  const dispatch = useAppDispatch()
  const contactList = useAppSelector(state => state.contactsCController.contacts)

  useEffect(() => {
    if (!contactList)
      fetchContacts()
  }, [])

  const fetchContacts = async () => {
    await dispatch(
      getContactList()
    )
  }

  const _renderItem = (item, i) => {
    return (
      <ContactPerson
        key={'key - ' + i}
        contact={item}
        onClick={onClickContact} />
    )
  }

  const getStudents = (): Contact[] => {
    let students: Contact[] = []

    if (!contactList || contactList.length === 0)
      return students

    for (let i = contactList.length - 1; i >= 0; --i) {
      if (students.length === 5)
        break

      if (contactList[i].RoleName === 'Member') {
        students.push(contactList[i])
      }
    }
    return students
  }

  const getStudentSize = () => {
    let size = 0

    if (!contactList || contactList.length === 0)
      return size

    for (let i = 0; i < contactList.length; ++i) {
      if (contactList[i].RoleName === 'Member') {
        size += 1
      }
    }

    return size
  }

  const getStaffSize = () => {
    let size = 0

    if (!contactList || contactList.length === 0)
      return size

    for (let i = 0; i < contactList.length; ++i) {
      if (contactList[i].RoleName === 'Staff') {
        size += 1
      }
    }

    return size
  }

  const getStaffs = (): Contact[] => {
    let staffs: Contact[] = []

    if (!contactList || contactList.length === 0)
      return staffs

    for (let i = 0; i < contactList.length; ++i) {
      if (staffs.length === 5)
        break

      if (contactList[i].RoleName === 'Staff') {
        staffs.push(contactList[i])
      }
    }

    return staffs
  }

  return (
    <View style={styles.container}>
      {
        contactList && contactList.length > 0 && (
          <View
            style={{
              paddingBottom: moderateScale(20)
            }}
          >
            {
              getStudents().length > 0 && (
                <>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      text={t('students')}
                      color={Colors.black}
                      size={18}
                      font={'medium'}
                    />

                    <Text
                      text={' (' + getStudentSize() + ')'}
                      color={Colors.grey2}
                      size={18}
                      font={'medium'}
                    />
                  </View>
                  {
                    getStudents().map((student, i) => {
                      return _renderItem(student, i)
                    })
                  }

                  <TouchableOpacity
                    activeOpacity={.7}
                    onPress={() => {
                      viewAll && viewAll(contactList)
                    }}>
                    <Text
                      text={t('viewAll')}
                      color={Colors.primary}
                      size={16}
                      font={'medium'}
                      contentContainer={{
                        marginTop: moderateScale(12)
                      }}
                    />
                  </TouchableOpacity>
                </>
              )
            }

            {
              getStaffs().length > 0 && (
                <>
                  <View style={{
                    flexDirection: 'row',
                    marginTop: moderateScale(20)
                  }}>
                    <Text
                      text={t('staffs')}
                      color={Colors.black}
                      size={18}
                      font={'medium'}
                    />

                    <Text
                      text={' (' + getStaffSize() + ')'}
                      color={Colors.grey2}
                      size={18}
                      font={'medium'}
                    />
                  </View>

                  {
                    getStaffs().map((staff, i) => {
                      return _renderItem(staff, i)
                    })
                  }

                  <TouchableOpacity
                    activeOpacity={.7}
                    onPress={() => {
                      viewAll && viewAll(contactList)
                    }}>
                    <Text
                      text={t('viewAll')}
                      color={Colors.primary}
                      size={16}
                      font={'medium'}
                      contentContainer={{
                        marginTop: moderateScale(12)
                      }}
                    />
                  </TouchableOpacity>
                </>
              )
            }
          </View>
        )
      }
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    paddingHorizontal: '10@ms',
    width: Styles.WIDTH,
    flex: 1,
    marginTop: '24@ms'
  },
})

export default React.memo(Contacts)