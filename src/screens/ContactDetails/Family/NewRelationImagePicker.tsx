import React, {
  useState
} from 'react'
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker'

import { Styles, Colors } from '../../../res'
import { Text } from '../../../components'
import { t } from '../../../utils'

interface Props {
  onPickAvatar: (avatarUri) => void
  onFinish: () => void
}

const NewRelationImagePicker: React.FC<Props> = ({
  onPickAvatar,
  onFinish
}) => {

  const [avatar, setAvatar] = useState<string>('')

  const pickImage = () => {
    const options: ImageLibraryOptions = {
      maxHeight: 720,
      maxWidth: 720,
      mediaType: 'photo',
    }

    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.debug('User cancelled image picker');
      } else if (response.errorCode) {
        console.debug('ImagePicker Error: ', response.errorCode);
      } else if (response.errorMessage) {
        console.debug('ImagePicker Error: ', response.errorMessage);
      } else {
        onPickAvatar && onPickAvatar(response.assets[0].uri)
        setAvatar(response.assets[0].uri)
      }
    })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={pickImage}
        activeOpacity={.7}
        style={styles.ImageContainer}>
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
          text={t('upload')}
          font={'regular'}
          size={18}
          color={Colors.primary}
          contentContainer={{
            marginTop: moderateScale(12)
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onFinish && onFinish()
        }}
        activeOpacity={.7}>
        <Text
          text={t('skipAndFinish')}
          font={'medium'}
          size={16}
          color={Colors.grey2}
          align={'right'}
          contentContainer={{
            marginEnd: moderateScale(16)
          }}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingBottom: '36@ms'
  },
  ImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: '190@ms',
    height: '190@ms',
    borderRadius: '95@ms'
  },
})

export default React.memo(NewRelationImagePicker)