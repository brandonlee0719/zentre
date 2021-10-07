import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import Text from '../../../../components/Text';
import {Colors} from '../../../../res';
import {t} from '../../../../utils';
import { moderateScale } from 'react-native-size-matters'

export default function ViewModal({isVisible, close, data}) {
  const renderItem = (item, index) => {
    return (
      <View style={styles.itemMain}>
        <Image source={require('../plus.png')} style={styles.image} />
        <Text
          text={item?.name}
          size={16}
          align={'center'}
          color={Colors.black}
          font={'regular'}
        />
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={close}
      onBackButtonPress={close}
      style={{justifyContent: 'flex-end', margin: 0}}>
      <View style={styles.mainView}>
        <View style={styles.header}>
          <Text
            text={`${t('peopleView')} (${data?.length})`}
            size={16}
            align={'center'}
            color={Colors.grey2}
            font={'regular'}
          />
        </View>
        <View style={styles.list}>
          <FlatList
            data={data}
            renderItem={({item, index}) => {
              return renderItem(item, index);
            }}
          />
        </View>
        <TouchableOpacity onPress={close}>
          <Text
            text={t('ok')}
            size={16}
            align={'center'}
            color={Colors.primary}
            font={'regular'}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainView: {
    height: '65%',
    backgroundColor: 'white',
    padding: 10,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: '10%',
  },
  itemMain: {
    flexDirection: 'row',
    marginBottom: '3%',
  },
  image: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: '4%',
  },
  list: {
    height: '75%',
  },
});
