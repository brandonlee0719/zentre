import React, {
  useState
} from 'react'
import {
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors, Ic_Tick } from '../../res'
import { Text } from '../../components'
import { t } from '../../utils'

interface Props {
  levels: Level[]
  onCreateLvl: () => void
  onLevel: (level: Level) => void
}

const Levels: React.FC<Props> = ({
  levels,
  onCreateLvl,
  onLevel
}) => {

  const [selected, setSelected] = useState(0)

  const renderLevel = (level: Level, index: number) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onLevel && onLevel(level)
          setSelected(index)
        }}
        activeOpacity={.7}
        style={[styles.level, {
          marginTop: index === 0 ? 0 : 12
        }]}>
        <Text
          text={level.SchoolLevelName}
          size={16}
          font={'medium'}
          color={selected === index ? Colors.primary : Colors.black}
        />
        {
          selected === index && (
            <Ic_Tick color={Colors.primary} />
          )
        }
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        horizontal={false}>
        <Text
          text={t('selectLevel')}
          size={18}
          font={'bold'}
          color={Colors.black}
          contentContainer={{
            marginVertical: moderateScale(36),
            marginStart: moderateScale(10)
          }}
        />
        {
          levels && levels?.length > 0 && (
            levels.map((level, i) => {
              return (
                <View
                  key={'level-' + i}
                  style={styles.levelContainer}>
                  {renderLevel(level, i)}
                </View>
              )
            })
          )
        }

        <TouchableOpacity
          onPress={() => {
            onCreateLvl && onCreateLvl()
          }}
          activeOpacity={.7}>
          <Text
            text={t('createLevel')}
            size={18}
            font={'bold'}
            color={Colors.primary}
            contentContainer={{
              marginVertical: moderateScale(36),
              marginStart: moderateScale(10)
            }}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: Styles.WIDTH,
  },
  levelContainer: {
    width: '100%',
    paddingHorizontal: '10@ms'
  },
  level: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.grey1,
    borderRadius: '4@ms',
    paddingHorizontal: '10@ms',
    height: '56@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

export default React.memo(Levels)