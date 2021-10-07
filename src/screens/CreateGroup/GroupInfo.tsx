import React, {
  useRef,
  useEffect
} from 'react'
import {
  View
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'

import { Styles } from '../../res'
import { Text, Input } from '../../components'
import { t, useAppDispatch } from '../../utils'
import { showAlert } from '../../utils/store/controllers/alert'
import { createGroup } from '../../utils/store/controllers/group'

interface Props {
  level: Level
  onRef: (ref) => void
}

const GroupInfo: React.FC<Props> = ({
  onRef,
  level
}) => {

  const dispatch = useAppDispatch()
  const groupName = useRef<string>('')

  useEffect(() => {

    onRef && onRef({
      onCreate: _onCreate
    })

    return () => {
      onRef && onRef({
        onCreate: null
      })
    }
  }, [])

  const _onCreate = async () => {
    if (groupName.current === '') {
      dispatch(
        showAlert({
          show: true,
          title: t('warning'),
          message: t('fillParts')
        })
      )
      return
    }

    if (groupName.current.length > 30) {
      dispatch(
        showAlert({
          show: true,
          title: t('warning'),
          message: t('maxCharGroup')
        })
      )
      return
    }

    let res = await dispatch(
      createGroup({
        ClassName: groupName.current,
        SchLevID: level.SchLevID,
      })
    )

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        return res.payload
      }
    }

    return false
  }

  //console.debug(level)
  return (
    <View style={styles.container}>
      <Input
        title={t('groupName')}
        onTextChanged={(text) => { groupName.current = text }}
        containerStyle={{ marginTop: moderateScale(36) }}
        isRequired
      />
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: Styles.WIDTH,
  }
})

export default React.memo(GroupInfo)
