import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import {
  View,
  ScrollView,
  Keyboard, TouchableOpacity, Image
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import CheckBox from '@react-native-community/checkbox'
import { Colors } from '../../../res'
import { Styles } from '../../../res'
import { t } from '../../../utils'

import {
  Input,
  DropDownList,
  DatePicker,
} from '../../../components'

import {
  Header,
  Text
} from '../../../components'
const Info = ({
  onPhoto,
  onName,
  onTax,
  onDescription,
  onAmount,
  onCheckBox,
  Name,
  Tax,
  Description,
  Amount,
  CheckBoxValue,
  categoryType,
  Tate_Type,
  onTate_Type
}) => {
  const [p, sP] = useState(0)
  const padding = useRef(0)
  const pageHeight = useRef(0)
  const touchPos = useRef(0)
  const [check, setCheck] = useState(CheckBoxValue);
  useEffect(() => {

    const kShown = Keyboard.addListener("keyboardDidShow", _keyboardDidShow)
    const kHide = Keyboard.addListener("keyboardDidHide", _keyboardDidHide)

    return () => {
      kShown.remove()
      kHide.remove()
    }
  }, [])

  const _keyboardDidShow = (e) => {
    //console.debug('_keyboardDidShow')
    //console.debug(e)
    let keyboardHeight = e.endCoordinates.height
    let visibleArea = pageHeight.current - keyboardHeight

    if (visibleArea > touchPos.current) {
      //console.debug('Top of the keyboard: ', touchPos.current)
      padding.current = keyboardHeight - moderateScale(18)
      sP(keyboardHeight - moderateScale(18))
    } else {
      //console.debug('Under the keyboard: ', touchPos.current)
      let p = pageHeight.current - touchPos.current
      padding.current = p - moderateScale(28) < 0 ? p : p - moderateScale(28)
      sP(p - moderateScale(28) < 0 ? p : p - moderateScale(28))
    }

  }

  const _keyboardDidHide = () => {
    padding.current = 0
    sP(0)
  }


  const _onLayout = ({ nativeEvent }) => {
    pageHeight.current = nativeEvent.layout.height
  }

  const _onTouchStart = ({ nativeEvent }) => {
    touchPos.current = nativeEvent.pageY
  }
  let avatar;

  return (
    <View
      onLayout={_onLayout}
      style={{
        width: Styles.WIDTH,
      }}>
      <ScrollView
        horizontal={false}
        onTouchStart={_onTouchStart}
        contentContainerStyle={{ paddingBottom: padding.current, paddingTop: 30 }}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          //   onPress={pickImage}
          activeOpacity={.7}
          style={styles.container}><View style={styles.InputContainer} >
            {
              avatar ?
                (
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                )
                :
                (
                  <Image source={require('../../../../assets/images/placeHolder.png')}
                    style={styles.avatar} />
                )
            }
            <Text
              text={t('uploadFile')}
              font={'regular'}
              size={16}
              color={Colors.primary}
              contentContainer={{
                //   marginTop: moderateScale(12)
              }}
            /></View>
        </TouchableOpacity>
        <Input
          defaultValue={Name}
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('itemName')}
          isRequired={true}
          onTextChanged={onName}
        />

        <Input
          defaultValue={Description}
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('description')}
          isRequired={true}
          onTextChanged={onDescription}
        />
        {
          (categoryType === 12000000 || categoryType === 15000000) &&
          <View style={{ flexDirection: 'row', padding: 5, borderWidth: 0, borderColor: 'red', }}>
            <View style={{ flexDirection: 'row', padding: 5, borderWidth: 0, borderColor: 'red', alignItems: 'center' }}>
              <CheckBox
                disabled={false}
                value={Tate_Type === 1}
                onValueChange={(newValue) => {
                  onTate_Type(newValue, 1);
                }}
                tintColors={{ true: Colors.primary, false: Colors.primary }}
              />
              <Text text={t('flatRate')}
                size={14}
                font={'medium'}
                color={Colors.grey1}></Text>
            </View>
            <View style={{ flexDirection: 'row', padding: 5, borderWidth: 0, borderColor: 'red', alignItems: 'center' }}>
              <CheckBox
                disabled={false}
                value={Tate_Type === 0}
                onValueChange={(newValue) => {
                  onTate_Type(newValue, 0);
                }}
                tintColors={{ true: Colors.primary, false: Colors.primary }}
              />
              <Text text={t('percentage')}
                size={14}
                font={'medium'}
                color={Colors.grey1}></Text>
            </View>
          </View>
        }
        <Input
          defaultValue={Amount}
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('amount')}
          isRequired={true}
          onTextChanged={onAmount}
        />
        {
          categoryType === 11000000 &&
          <View style={{ flexDirection: 'row', padding: 5, borderWidth: 0, borderColor: 'red', alignItems: 'center' }}>
            <CheckBox
              disabled={false}
              value={check || CheckBoxValue}
              onValueChange={(newValue) => {
                setCheck(newValue);
                onCheckBox(newValue);
                //   onCheckBox && onCheckBox('student', newValue)
              }}
              tintColors={{ true: Colors.primary, false: Colors.primary }}
            />
            <Text text={t('pricewithtax')}
              size={18}
              font={'medium'}
              color={Colors.grey1}></Text>
          </View>
        }
        {
          CheckBoxValue &&
          <Input
            containerStyle={{ marginTop: moderateScale(20) }}
            title={t('tax')}
            defaultValue={Tax}
            isRequired={true}
            onTextChanged={onTax}
          />
        }
      </ScrollView>
    </View>
  )
}
const styles = ScaledSheet.create({

  ImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: '40@ms',
    height: '40@ms',
    borderRadius: '5@ms'
  },
  container: {
    width: Styles.WIDTH,
    paddingHorizontal: '10@ms',
  },
  titleContainer: {
    position: 'absolute',
    left: '20@ms',
    top: -8,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: '6@ms'
  },
  InputContainer: {
    width: '100%',
    height: '56@ms',
    borderWidth: 1,
    borderColor: Colors.grey1,
    borderRadius: '4@ms',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: '10@ms',
  },
  input: {
    fontSize: '16@ms',
    color: Colors.black,
    fontFamily: 'RobotoRegular',
    width: Styles.WIDTH - moderateScale(40)
  }
})

export default Info