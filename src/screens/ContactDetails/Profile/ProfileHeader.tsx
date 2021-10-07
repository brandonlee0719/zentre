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
  Callback,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker'

import { Styles, Colors, Ic_Upload } from '../../../res'
import { Text } from '../../../components'

interface Props {
  HeadSculpture: string
  FirstName: string
  LastName: string
  RoleName: string
  Email: string,
  editing?: boolean
  onPick?: (uri: string) => void
}

const ProfileHeader: React.FC<Props> = ({
  HeadSculpture,
  FirstName,
  LastName,
  RoleName,
  Email,
  editing = false,
  onPick
}) => {

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
    <View style={styles.userHeaderContainer}>
      <TouchableOpacity
        onPress={pickImage}
        activeOpacity={editing ? .7 : 1}
        style={styles.iconContainer}>
        {
          avatarUri !== '' && editing ?
            (
              <Image
                source={{ uri: avatarUri }}
                style={styles.iconContainer} />
            )
            :
            (
              <>
                {
                  HeadSculpture ?
                    (
                      <Image
                        source={{ uri: 'https://contacts.ichild.com.sg' + HeadSculpture }}
                        style={styles.iconContainer} />
                    )
                    :
                    (
                      <Image
                        source={require('../../../../assets/images/placeHolder.png')}
                        style={styles.iconContainer} />
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
        <View style={styles.nameContainer}>
          <Text
            text={FirstName + ' ' + LastName + ' (' + (RoleName === "Member" ? "Student" : RoleName) + ')'}
            size={18}
            maxLine={2}
            color={Colors.black}
            font={'medium'}
          />
        </View>
        <Text
          text={Email}
          size={14}
          color={Colors.grey2}
          font={'regular'}
          maxLine={1}
          contentContainer={{
            marginTop: 6,
          }}
        />
      </View>
    </View>
  )
}

const styles = ScaledSheet.create({
  userHeaderContainer: {
    width: '100%',
    marginTop: '34@ms',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '10@ms',
    marginBottom: '40@ms'
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginStart: '12@ms',
    width: Styles.WIDTH - moderateScale(20 + 80 + 12),
  },
  editContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  }
})

export default React.memo(ProfileHeader)