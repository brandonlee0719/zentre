import React, {
  useState,
  useRef,
  useEffect,
  useReducer
} from 'react'
import {
  View,
  ScrollView
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'

import { Styles, Colors } from '../../../res'
import { Text, SearchBar } from '../../../components'
import { t } from '../../../utils'

import AddMemberHeader from './AddMemberHeader'
import Member from './Member'

interface Props {
  staffs: UserInfo[]
  students: UserInfo[]
  type: 'Students' | 'Staffs'
  onRef: (ref) => void

  sStaffs: UserInfo[]
  sStudents: UserInfo[]
}

const Add: React.FC<Props> = ({
  type,
  staffs,
  students,
  onRef,
  sStaffs,
  sStudents
}) => {

  const [dStudents, setDStudents] = useState(students)
  const [dStaffs, setDStaffs] = useState(staffs)

  const [allSelectedStudents, setAllSelectedStudents] = useState(false)
  const [allSelectedStaffs, setAllSelectedStaffs] = useState(false)

  const [numberOfSelectedStudents, setNumberOfSelectedStudents] = useState({
    selected: sStudents.length, default: students.length
  })
  const [numberOfSelectedStaffs, setNumberOfSelectedStaffs] = useState({
    selected: sStaffs.length, default: staffs.length
  })

  const showStudents = useRef(type === 'Students')
  const showStaffs = useRef(type === 'Staffs')
  const isSearching = useRef(false)

  const selectedStudents = useRef<UserInfo[]>(JSON.parse(JSON.stringify(sStudents)))
  const selectedStaffs = useRef<UserInfo[]>(JSON.parse(JSON.stringify(sStaffs)))

  useEffect(() => {
    onRef && onRef({ onAdd: _onAdd })

    return () => {
      onRef && onRef({ onAdd: null })
    }
  }, [])

  const _onAdd = () => {
    return {
      students: selectedStudents.current,
      staffs: selectedStaffs.current
    }
  }

  const _onSearch = (text) => {
    if (isSearching.current) {
      return
    }
    isSearching.current = true

    if (text.length === 0) {
      setDStudents(students)
      setDStaffs(staffs)

      isSearching.current = false
      return
    }

    let filteredStudents = students.filter(
      student =>
        student.FirstName.includes(text) ||
        student.LastName.includes(text)
    )
    setDStudents(filteredStudents)

    let filteredStaffs = staffs.filter(
      staff =>
        staff.FirstName.includes(text) ||
        staff.LastName.includes(text)
    )
    setDStaffs(filteredStaffs)

    isSearching.current = false
  }

  const _renderItem = (item, index, type: 'Students' | 'Staffs', isAllSelected: boolean) => {
    return (
      <View
        key={'member-' + index}
        style={styles.itemBaseContainer}>
        <Member
          item={item}
          onSelectUser={_onSelectUser}
          typeOfMember={type}
          isSelected={isAllSelected ? isAllSelected : checkIfSelected(item, type)}
        />
      </View>
    )
  }

  const checkIfSelected = (item: UserInfo, type: 'Students' | 'Staffs') => {
    if (type === 'Students') {
      return selectedStudents.current.some(s => s.UserID === item.UserID)
    } else {
      return selectedStaffs.current.some(s => s.UserID === item.UserID)
    }
  }

  const _onShowMembers = (memberType: 'Students' | 'Staffs') => {
    if (memberType === 'Students') {
      if (showStudents.current) {
        showStudents.current = false

        setDStudents([])
      } else {
        showStudents.current = true
        setDStudents(students)
      }
    } else {
      if (showStaffs.current) {
        showStaffs.current = false
        setDStaffs([])
      } else {
        showStaffs.current = true
        setDStaffs(staffs)
      }
    }
  }

  const _onAllMembers = (memberType: 'Students' | 'Staffs', value: boolean) => {
    if (memberType === 'Students') {
      if (value) {
        selectedStudents.current = students
      } else {
        selectedStudents.current = []
      }
      console.debug('AllMembersSelected: ', value)
      setAllSelectedStudents(value)
    } else {
      if (value) {
        selectedStaffs.current = staffs
      } else {
        selectedStaffs.current = []
      }
      setAllSelectedStaffs(value)
    }
  }

  const _onSelectUser = (selected: boolean, member: UserInfo,
    typeOfMember: 'Students' | 'Staffs') => {

    if (typeOfMember === 'Students') {
      if (selected) {
        selectedStudents.current.push(member)
        setNumberOfSelectedStudents(prev => ({ selected: prev.selected + 1, default: prev.default }))
      } else {
        selectedStudents.current = selectedStudents.current.filter(
          function (m) {
            return m.UserID !== member.UserID
          }
        )
        setNumberOfSelectedStudents(prev => ({ selected: prev.selected - 1, default: prev.default }))
      }
    } else {
      if (selected) {
        selectedStaffs.current.push(member)
        setNumberOfSelectedStaffs(prev => ({ selected: prev.selected + 1, default: prev.default }))
      } else {
        selectedStaffs.current = selectedStaffs.current.filter(
          function (m) {
            return m.UserID !== member.UserID
          }
        )
        setNumberOfSelectedStaffs(prev => ({ selected: prev.selected - 1, default: prev.default }))
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text
        text={t('addContactsToGroup')}
        size={18}
        color={Colors.black}
        font={'medium'}
        contentContainer={{
          marginStart: moderateScale(10),
          marginVertical: moderateScale(36)
        }}
      />
      <SearchBar
        onSearch={_onSearch}
        containerStyle={{
          marginBottom: moderateScale(36)
        }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 36
        }}
        removeClippedSubviews={true}
        horizontal={false}
        showsVerticalScrollIndicator={false}>

        <AddMemberHeader
          memberType={'Students'}
          onShowMembers={_onShowMembers}
          onAllMembers={_onAllMembers}
          numberOfMembers={numberOfSelectedStudents}
        />

        {
          showStudents.current &&
          dStudents.map((student, i) => {
            return _renderItem(student, i, 'Students', allSelectedStudents)
          })
        }

        <AddMemberHeader
          memberType={'Staffs'}
          onShowMembers={_onShowMembers}
          onAllMembers={_onAllMembers}
          numberOfMembers={numberOfSelectedStaffs}
        />

        {
          showStaffs.current &&
          dStaffs.map((staff, i) => {
            return _renderItem(staff, i, 'Staffs', allSelectedStaffs)
          })
        }

      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH,
    flex: 1
  },
  itemBaseContainer: {
    paddingHorizontal: '10@ms'
  },
})

export default React.memo(Add)