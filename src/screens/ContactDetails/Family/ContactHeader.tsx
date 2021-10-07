import React, {
  useState
} from 'react'
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker'

import { Colors, Styles, Ic_Upload } from '../../../res'
import { Text } from '../../../components'

interface Props {
  name: string,
  email: string,
  avatar: string,
  editing?: boolean,
  onPick?: (uri: string) => void
}

function ContactHeader({
  name,
  email,
  avatar,
  editing = false,
  onPick
}: Props) {

  const [avatarUri, setAvatarUri] = useState('')

  const pickImage = () => {
    if (!editing)
      return

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
        onPick && onPick(response.assets[0].uri)
        setAvatarUri(response.assets[0].uri)
      }
    })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={pickImage}
        activeOpacity={editing ? .7 : 1}
        style={styles.iconContainer}>
        {
          avatarUri !== '' && editing ?
            (
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatar} />
            )
            :
            (
              <>
                {
                  avatar ?
                    (
                      <Image
                        source={{ uri: avatar }}
                        style={styles.avatar} />
                    )
                    :
                    (
                      <Image
                        source={require('../../../../assets/images/placeHolder.png')}
                        style={styles.avatar} />
                    )
                }
              </>
            )
        }
        {
          editing && (
            <View style={styles.editContainer}>
              <Ic_Upload color={Colors.grey1} />
            </View>
          )
        }
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text
          text={name}
          size={18}
          font={'medium'}
          color={Colors.black}
          maxLine={1}
        />

        <Text
          text={email}
          size={14}
          font={'regular'}
          color={Colors.grey2}
          maxLine={1}
          contentContainer={{
            marginTop: moderateScale(6),
          }}
        />
      </View>


    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: '100%',
    marginTop: '32@ms',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '42@ms',
    paddingHorizontal: '10@ms',
  },
  iconContainer: {
    height: '80@ms',
    width: '80@ms',
    borderColor: Colors.grey2,
    borderWidth: 1,
    borderRadius: '40@ms',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    marginStart: '16@ms',
    width: Styles.WIDTH - moderateScale(48 + 80)
  },
  avatar: {
    width: '80@ms',
    height: '80@ms',
    borderRadius: '40@ms'
  },
  editContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  }
})

export default React.memo(ContactHeader)