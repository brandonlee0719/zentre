import React, {
  useState,
  useEffect,
  useRef
} from "react"
import {
  View
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors, Ic_Tick } from '../../res'
import { Text, Input } from '../../components'
import { t, useAppDispatch } from '../../utils'
import { showAlert } from '../../utils/store/controllers/alert'
import { createLevel } from '../../utils/store/controllers/group'

interface Props {
  onRef: (ref) => void
}

const CreateLevel: React.FC<Props> = ({
  onRef
}) => {
  const dispatch = useAppDispatch()
  const level = useRef<string>('')

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
    if (level.current === '') {
      dispatch(
        showAlert({
          show: true,
          title: t('warning'),
          message: t('fillParts')
        })
      )
      return
    }

    let res = await dispatch(
      createLevel(level.current)
    )

    if (res.meta.requestStatus !== 'rejected') {
      let payload: any = res.payload
      if (payload) {
        return true
      }
    }
    //Error
    return false
  }

  return (
    <View style={styles.container}>
      <Input
        title={t('levelName')}
        onTextChanged={(text) => { level.current = text }}
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

export default React.memo(CreateLevel)
