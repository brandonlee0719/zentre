import React from 'react'
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import { t } from '../../../utils'

import {
  Text,
} from '../../../components'
import {
  Styles,
  Colors,
  Ic_Dot3_Vertical,
} from '../../../res'

interface Props {
  title: string
  relations: Relation[]
  onAdd: (title: string) => void
  onOptions: (relation: Relation, pos: { x: number, y: number }) => void
}

const RelationField: React.FC<Props> = ({
  title,
  relations,
  onAdd,
  onOptions
}) => {
  const renderRelation = (relation: Relation, index: number, isLast: boolean) => {
    return (
      <>
        <View
          key={'relation-' + index}
          style={styles.relationContainer}>
          {
            relation.HeadSculpture ?
              (
                <Image source={{ uri:'https://contacts.ichild.com.sg' + relation.HeadSculpture }}
                  style={styles.avatar} />
              )
              :
              (
                <Image source={require('../../../../assets/images/placeHolder.png')}
                  style={styles.avatar} />
              )
          }

          <Text
            text={relation.FirstName + ' ' + relation.LastName}
            maxLine={1}
            size={16}
            font={'regular'}
            color={Colors.black}
            contentContainer={{
              width: Styles.WIDTH - moderateScale(20 + 34 + 24 + 24),
              marginHorizontal: moderateScale(12)
            }}
          />

          <TouchableOpacity
            activeOpacity={.7}
            onPress={({ nativeEvent }) => {
              onOptions && onOptions(relation, {
                x: nativeEvent.pageX,
                y: nativeEvent.pageY
              })
            }}
            style={styles.iconContainer}>
            <Ic_Dot3_Vertical color={Colors.primary} />
          </TouchableOpacity>
        </View>
        {
          !isLast && (
            <View style={styles.line} />
          )
        }
      </>
    )
  }

  const getAddString = () => {
    if (title === t('parents')) {
      return t('addParent')
    } else if (title == t('guardians')) {
      return t('addGuardian')
    } else if (title === t('siblings')) {
      return t('addSibling')
    }

    return ''
  }

  return (
    <View style={[styles.container, {
      marginTop: title === t('parents') ? 0 : moderateScale(16)
    }]}>
      <Text
        text={title + ' ' + '(' + relations.length + ')'}
        size={14}
        font={'medium'}
        color={Colors.black}
      />
      <View style={styles.field}>
        {
          relations.map((relation, index) => {
            return renderRelation(relation, index, relations.length - 1 === index)
          })
        }
        <>
          <TouchableOpacity
            onPress={() => {
              onAdd && onAdd(title)
            }}
            activeOpacity={.7}
            style={styles.addContainer}>
            <Text
              text={getAddString()}
              size={16}
              font={'medium'}
              color={Colors.primary}
            />
          </TouchableOpacity>

          <View style={styles.separator} />
        </>
      </View>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    paddingHorizontal: '10@ms',
  },
  field: {
    width: '100%',
    marginTop: '16@ms',
  },
  relationContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: '34@ms',
    height: '34@ms',
    borderRadius: '17@ms',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainer: {
    height: '28@ms',
    width: '24@ms',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6@ms'
  },
  addContainer: {
    marginTop: '20@ms'
  },
  separator: {
    height: 1,
    backgroundColor: Colors.black,
    width: '100%',
    marginTop: "46@ms"
  },
  line: {
    height: 1,
    backgroundColor: Colors.grey1,
    width: '100%',
    marginVertical: '12@ms'
  }
})

export default React.memo(RelationField)