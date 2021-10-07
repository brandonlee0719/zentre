import React, {
  useRef,
  useState,
  useEffect
} from 'react'
import {
  View,
  ScrollView
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'

import { Styles, Colors } from '../../res'
import { SearchBar, Text } from '../../components'
import { t } from '../../utils'

interface Props {
  editing: boolean
  members: UserInfo[]
  staff: UserInfo[]

  selectedMembers: UserInfo[],
  selectedStaffs: UserInfo[],

  onRef: (ref) => void
  onEdit: () => void
}

import OrderOptions from './OrderOptions'
import Member from './Member'

const AddMember: React.FC<Props> = ({
  editing,
  members,
  staff,
  selectedMembers,
  selectedStaffs,
  onRef,
  onEdit
}) => {

  const sStudents = useRef<UserInfo[]>(JSON.parse(JSON.stringify(selectedMembers)))
  const sStaffs = useRef<UserInfo[]>(JSON.parse(JSON.stringify(selectedStaffs)))
  const isSearching = useRef(false)

  const [showStudents, setShowStudents] = useState(true)
  const [showStaffs, setShowStaffs] = useState(true)

  const [editMode, setEditMode] = useState(editing)

  const [dStudents, setDStudents] = useState(members)
  const [dStaffs, setDStaffs] = useState(staff)

  useEffect(() => {
    onRef && onRef({ onPostfixClick: _onPostfixClick })

    return () => {
      onRef && onRef({ onPostfixClick: null })
    }
  }, [])

  const _onPostfixClick = (forEdit: boolean) => {
    if (forEdit) {
      setEditMode(true)
      onEdit()
      return null
    } else {
      return {
        students: sStudents.current,
        staffs: sStaffs.current
      }
    }
  }

  const _renderItem = (item, index, type: 'Students' | 'Staffs') => {
    return (
      <View
        key={'member-' + index}
        style={styles.itemBaseContainer}>
        <Member
          editMode={editMode}
          item={item}
          typeOfMember={type}
          isSelected={checkIfSelected(item, type)}
          onSelected={_onSelected}
        />
      </View>
    )
  }

  const checkIfSelected = (item: UserInfo, type: 'Students' | 'Staffs') => {
    if (type === 'Students') {
      return sStudents.current.some(s => s.UserID === item.UserID)
    } else {
      return sStaffs.current.some(s => s.UserID === item.UserID)
    }
  }

  const _onSelected = (type: 'Students' | 'Staffs', user: UserInfo, isSelected: boolean) => {
    if (isSelected) {
      if (type === 'Students') {
        sStudents.current.push(user)
      } else {
        sStaffs.current.push(user)
      }
    } else {
      if (type === 'Students') {
        sStudents.current = sStudents.current.filter(
          function (m) {
            return m.UserID !== user.UserID
          }
        )
      } else {
        sStaffs.current = sStaffs.current.filter(
          function (m) {
            return m.UserID !== user.UserID
          }
        )
      }
    }
  }

  const _onSearch = (text) => {
    if (isSearching.current) {
      return
    }
    isSearching.current = true

    if (text.length === 0) {
      setDStudents(members)
      setDStaffs(staff)

      isSearching.current = false
      return
    }

    let filteredStudents = members.filter(
      student =>
        student.FirstName.includes(text) ||
        student.LastName.includes(text)
    )
    setDStudents(filteredStudents)

    let filteredStaffs = staff.filter(
      staff =>
        staff.FirstName.includes(text) ||
        staff.LastName.includes(text)
    )
    setDStaffs(filteredStaffs)

    isSearching.current = false
  }

  const _onCheckBox = (type, value) => {
    if (type === 'students') {
      setShowStudents(value)
    } else {
      setShowStaffs(value)
    }
  }

  return (
    <View style={styles.container}>
      <SearchBar
        containerStyle={{ marginTop: 36 }}
        onSearch={_onSearch}
      />
      <OrderOptions onCheckBox={_onCheckBox} />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 36
        }}
        removeClippedSubviews={true}
        horizontal={false}
        showsVerticalScrollIndicator={false}>

        {
          showStudents && dStudents.length > 0 && (
            <Text
              text={t('students')}
              size={18}
              color={Colors.black}
              font={'medium'}
              contentContainer={{
                marginStart: moderateScale(10),
              }}
            />
          )
        }
        {
          showStudents && (
            dStudents.map((student, i) => {
              return _renderItem(student, i, 'Students')
            })
          )
        }

        {
          showStaffs && dStaffs.length > 0 && (
            <Text
              text={t('staffs')}
              size={18}
              color={Colors.black}
              font={'medium'}
              contentContainer={{
                marginStart: moderateScale(10),
                marginTop: showStudents ? moderateScale(36) : 0
              }}
            />
          )
        }
        {
          showStaffs && (
            dStaffs.map((staff, i) => {
              return _renderItem(staff, i, 'Staffs')
            })
          )
        }

      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH,
    flex: 1,
  },
  itemBaseContainer: {
    paddingHorizontal: '10@ms'
  },
})

export default React.memo(AddMember)