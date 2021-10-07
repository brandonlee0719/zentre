import { Divider, DropDownList, Input } from '../../components';

import { Keyboard, ScrollView, View } from 'react-native';

import React, { useEffect, useRef, useState } from 'react';

import FileSelector from './components/fileSelector';

import Items from '../ContactDetails/Fees/Create/Items';

import { Styles } from '../../res';
import { moderateScale } from 'react-native-size-matters';

import { t } from '../../utils';

interface Props {
  onTitle: (text) => void;
  onRecepient: (text) => void;
  onTags: (item) => void;
  onAddSetting: (item) => void;
  onFiles: (files) => void;

  onDesc: () => void;
  genders: Gender[];
  nationalities: Nationality[];
  countries: Country[];
  recipientsList: Contact[];

  feedType: FeedType[];

}
const additionalSetting = [

  {

    name: "Email alerts",

    id: 1

  },

  {

    name: "Allow Comments",

    id: 2

  },

  {

    name: "Allow Downloads",

    id: 3

  },

  {

    name: "Share to Facebook",

    id: 4

  },

]


const Info: React.FC<Props> = ({
  onTitle,
  onRecepient,
  onTags,
  onAddSetting,
  onFiles,
  genders,
  onDesc,
  nationalities,
  countries,
  recipientsList,

  feedType,

}) => {
  const [p, sP] = useState(0);
  const padding = useRef(0);
  const pageHeight = useRef(0);
  const touchPos = useRef(0);

  useEffect(() => {
    const kShown = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    const kHide = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    return () => {
      kShown.remove();
      kHide.remove();
    };
  }, []);

  const _keyboardDidShow = e => {
    //console.debug('_keyboardDidShow')
    //console.debug(e)
    let keyboardHeight = e.endCoordinates.height;
    let visibleArea = pageHeight.current - keyboardHeight;

    if (visibleArea > touchPos.current) {
      //console.debug('Top of the keyboard: ', touchPos.current)
      padding.current = keyboardHeight - moderateScale(18);
      sP(keyboardHeight - moderateScale(18));
    } else {
      //console.debug('Under the keyboard: ', touchPos.current)
      let p = pageHeight.current - touchPos.current;
      padding.current = p - moderateScale(28) < 0 ? p : p - moderateScale(28);
      sP(p - moderateScale(28) < 0 ? p : p - moderateScale(28));
    }
  };

  const _keyboardDidHide = () => {
    padding.current = 0;
    sP(0);
  };

  const _onLayout = ({ nativeEvent }) => {
    pageHeight.current = nativeEvent.layout.height;
  };

  const _onTouchStart = ({ nativeEvent }) => {
    touchPos.current = nativeEvent.pageY;
  };

  const filterContact = (data) => {
    let list: any = data.filter(e => e.FirstName !== "")
    return list
  }

  console.warn('recipientsList', recipientsList);

  return (
    // <View
    //   onLayout={_onLayout}
    //   style={{
    //     width: Styles.WIDTH,
    //   }}>
      <ScrollView
        horizontal={false}
        onTouchStart={_onTouchStart}
        contentContainerStyle={{ paddingBottom: padding.current }}
        showsVerticalScrollIndicator={false}>
        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('title')}
          isRequired={true}
          onTextChanged={onTitle}
        />
        <DropDownList
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('recepients')}
          isRequired={true}
          justifyContent={"flex-start"}
          multi={true}
          items={filterContact(recipientsList)}
          contacts={filterContact(recipientsList)}
          onSelected={onRecepient}
        />

        <DropDownList
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('tags')}
          justifyContent={"flex-start"}
          isRequired={true}
          // multi={true}

          items={feedType}
          onSelected={onTags}
        />
        <Divider />
        <Input title={t('desc')} onTextChanged={onDesc} multiline />
        <FileSelector onFiles={onFiles} />
        <Divider />
        <DropDownList
          containerStyle={{
            marginBottom: moderateScale(20),
          }}
          title={t('addSetting')}
          justifyContent={"flex-start"}
          isRequired={true}
          items={additionalSetting}

          multi={true}
          onSelected={onAddSetting}
        />
      </ScrollView>
    // </View>
  );
};

export default React.memo(Info);
