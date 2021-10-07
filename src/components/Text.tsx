import React from 'react';
import {Text as RNText, TextStyle, Platform} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

interface Props {
  text: string | number;
  size?: number;
  color?: string;
  font?: 'black' | 'bold' | 'italic' | 'light' | 'medium' | 'regular' | 'thin';
  align?: 'left' | 'right' | 'center';
  maxLine?: number;
  letterSpacing?: number;
  decorationLine?: 'underline';
  contentContainer?: TextStyle;
}

const Text: React.FC<Props> = ({
  size,
  color,
  font,
  align,
  text,
  contentContainer,
  maxLine,
  decorationLine,
  letterSpacing,
}) => {
  const _font = (): string => {
    if (font === 'black')
      return Platform.OS === 'android' ? 'RobotoBlack' : 'RobotoBlack';
    else if (font === 'bold')
      return Platform.OS === 'android' ? 'RobotoBold' : 'Roboto-Bold';
    else if (font === 'italic')
      return Platform.OS === 'android' ? 'RobotoItalic' : 'Roboto-Italic';
    else if (font === 'light')
      return Platform.OS === 'android' ? 'RobotoLight' : 'Roboto-Light';
    else if (font === 'medium')
      return Platform.OS === 'android' ? 'RobotoMedium' : 'Roboto-Medium';
    else if (font === 'regular')
      return Platform.OS === 'android' ? 'RobotoRegular' : 'Roboto-Regular';
    //Thin
    return Platform.OS === 'android' ? 'RobotoThin' : 'Roboto-Thin';
  };

  const _styles = (): TextStyle => {
    return {
      fontSize: size ? moderateScale(size) : moderateScale(14),
      fontFamily: _font(),
      color: color || 'white',
      textAlign: align || 'left',
      letterSpacing: letterSpacing || 0,
      textDecorationLine: decorationLine || undefined,
      ...contentContainer,
    };
  };

  return (
    <RNText
      numberOfLines={maxLine || undefined}
      ellipsizeMode={'tail'}
      style={_styles()}>
      {text}
    </RNText>
  );
};

export default React.memo(Text);
