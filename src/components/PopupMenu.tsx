import React, {
  useState
} from 'react'
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import { useAppDispatch } from '../utils'
import { showPopup } from '../utils/store/controllers/popup'
import { Colors, Styles } from '../res'
import Text from './Text'

interface Position {
  x: number
  y: number
}

interface Option {
  text: string
  icon?: JSX.Element
  textColor?: string
  onClick: () => void
}

interface Props {
  show: boolean
  position?: Position
  options?: Option[]
}

const PopupMenu: React.FC<Props> = ({
  show,
  position,
  options
}) => {
  if (!show)
    return null

  const dispatch = useAppDispatch()
  const [popUp, setPopup] = useState({
    top: 0,
    left: 0,
    opacity: 0
  })

  const _onLayout = ({ nativeEvent }) => {
    if (position) {
      let { height, width } = nativeEvent.layout

      let top = position.y
      if (top + height > Styles.HEIGHT) {
        top -= height
      }

      //console.debug(height)
      //console.debug(width)
      //let left = Styles.WIDTH - 36 - width
      let left = position.x
      if (left + width > Styles.WIDTH) {
        left -= width
      }

      setPopup({ top, left, opacity: 1 })
    } else {
      setPopup({ top: 0, left: 0, opacity: 1 })
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        dispatch(showPopup({ show: false }))
      }}>
      <View style={styles.container}>
        <View
          onLayout={_onLayout}
          style={[styles.popupContainer, {
            top: popUp.top,
            left: popUp.left,
            opacity: popUp.opacity
          }]}>
          {
            options && options.map((option, i) => {
              return (
                <TouchableOpacity
                  key={'key ' + i}
                  onPress={() => {
                    dispatch(showPopup({ show: false }))
                    option.onClick && option.onClick()
                  }}>
                  <View style={styles.optionContainer}>
                    {
                      option.icon && (
                        <View style={styles.iconContainer}>
                          {option.icon}
                        </View>
                      )
                    }
                    <Text
                      text={option.text}
                      size={16}
                      color={option.textColor || Colors.black}
                      font={'regular'}
                      contentContainer={{
                        marginStart: option.icon ? moderateScale(8) : 0,
                        marginTop: i === 0 ? 0 : moderateScale(16)
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = ScaledSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    elevation: 4
  },
  popupContainer: {
    position: 'absolute',
    padding: '20@ms',
    borderRadius: '4@ms',
    backgroundColor: 'white',
    minWidth: '144@ms',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    shadowColor: Colors.black,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: '36@ms',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red'
  }
})

export default React.memo(PopupMenu)