import React from 'react'
import {
  View,
  ScrollView
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles } from '../../../res'
import { t } from '../../../utils'

import RelationField from './RelationField'
import { Text } from '../../../components'

interface Props {
  onAddRelationShip: (relation: 'parent' | 'guardian' | 'sibling') => void
  parents: Relation[]
  guardians: Relation[]
  siblings: Relation[]
  onOptions: (relation: Relation, pos: { x: number, y: number },
    relationship: 'parent' | 'guardian' | 'sibling') => void
}

const Relationships: React.FC<Props> = ({
  onAddRelationShip,
  parents,
  guardians,
  siblings,
  onOptions
}) => {

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={false}
        contentContainerStyle={{ paddingBottom: moderateScale(16) }}
        showsVerticalScrollIndicator={false}>
        <View>
          <RelationField
            onOptions={(relation, pos) => {
              onOptions && onOptions(relation, pos, 'parent')
            }}
            onAdd={() => onAddRelationShip('parent')}
            title={t('parents')}
            relations={parents}
          />
          <RelationField
            onOptions={(relation, pos) => {
              onOptions && onOptions(relation, pos, 'guardian')
            }}
            onAdd={() => onAddRelationShip('guardian')}
            title={t('guardians')}
            relations={guardians}
          />
          <RelationField
            onOptions={(relation, pos) => {
              onOptions && onOptions(relation, pos, 'sibling')
            }}
            onAdd={() => onAddRelationShip('sibling')}
            title={t('siblings')}
            relations={siblings}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH,
  }
})

export default React.memo(Relationships)