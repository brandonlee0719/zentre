import React from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';

import { Text as TextA } from '../../../components';

import { Colors } from '../../../res';
import { t } from '../../../utils';
import { ScaledSheet } from 'react-native-size-matters';
import ImagePicker from "react-native-image-crop-picker";

import DocumentPicker from 'react-native-document-picker'

import { useState } from 'react';

export default function fileSelector(props) {

  let [document, setDocument] = useState(null)

  let [video, setVideo] = useState(null)

  let [image, setImage] = useState(null)

  return (
    <View >
      <View style={styles.main}>
        <TouchableOpacity onPress={async () => {
          try {
            const res = await DocumentPicker.pick({
              type: [
                DocumentPicker.types.doc,
                DocumentPicker.types.docx,
                DocumentPicker.types.pdf,
                DocumentPicker.types.csv,
                DocumentPicker.types.ppt,
                DocumentPicker.types.pptx,
                DocumentPicker.types.plainText,
                DocumentPicker.types.xls,
                DocumentPicker.types.xlsx,
              ],
            })
            setDocument(res[0])
            props.onFiles({ document: res[0] })
            console.log(res[0])
          } catch (err) {

            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            } else {
              throw err
            }
          }
        }}

          style={styles.attachment}>

          <Image
            source={require('../../../res/icons/Thumbnail.png')}
            style={[styles.image, { marginRight: 10 }]}
            resizeMode="contain"
          />

          <TextA
            text={t('attachment')}
            color={Colors.primary}
            size={16}
            font={'regular'}
          />

        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          ImagePicker.openPicker({
            mediaType: "image",
          })
            .then(img => {
              setImage(img)
              props.onFiles({ image: img })
              console.log(img);
            })
            .catch((err) => {
              console.log("err", err);
            });
        }}
          style={styles.attachment1}>
          <Image
            source={require('../../../res/icons/Camera.png')}
            style={styles.image}
            resizeMode="contain"
          />

        </TouchableOpacity>

        <TouchableOpacity onPress={() => {

          ImagePicker.openPicker({

            mediaType: "video",

            compressVideoPreset: "Passthrough",

          })

            .then((vid) => {

              props.onFiles({ video: vid })


              setVideo(vid)

              console.log(vid);

            })

            .catch((err) => {

              console.log("err", err);

            });

        }} style={styles.attachment2}>

          <Image

            source={require('../../../res/icons/Video.png')}

            style={styles.image}

            resizeMode="contain"

          />

        </TouchableOpacity>

      </View>

      {(document) ?

        (

          <View style={styles.pdf}>

            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>

              <Image

                source={require('./pdf.png')}

                style={{ height: 45, width: 45, }}

              />

              <Text style={{ width:'75%' }} numberOfLines={1}>{document.name.substring(0, 30)}</Text>

            </View>

            <TouchableOpacity

              onPress={() => {

                setDocument(null)


              }}

            ><Image source={require('./cross.png')}

              style={{ height: 25, width: 25 }}

            ></Image></TouchableOpacity>

          </View>) : null}

      {(image) ?

        (

          <View style={styles.pdf}>

            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>

              <Image

                source={require('./picture.png')}

                style={{ height: 45, width: 45, }}

              />

              <Text style={{ marginLeft: 8,width:'75%' }} numberOfLines={1}>{image.path.split('/')[image.path.split('/').length - 1].substring(0, 30)}</Text>

            </View>

            <TouchableOpacity

              onPress={() => {

                setImage(null)

              }}

            ><Image source={require('./cross.png')}

              style={{ height: 25, width: 25 }}

            ></Image></TouchableOpacity>

          </View>) : null}



      {(video) ?

        (

          <View style={styles.pdf}>

            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>

              <Image

                source={require('./video.png')}

                style={{ height: 45, width: 45, }}

              />

              <Text style={{ marginLeft: 8,width:'75%' }} numberOfLines={1}>{video.path.split('/')[video.path.split('/').length - 1].substring(0, 30) }</Text>

            </View>

            <TouchableOpacity

              onPress={() => {

                setVideo(null)

              }}

            ><Image source={require('./cross.png')}

              style={{ height: 25, width: 25 }}

            ></Image></TouchableOpacity>

          </View>) : null}


    </View>
  );
}

const styles = ScaledSheet.create({
  main: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: '15@s',
    marginHorizontal: '10@s',
    flex: 1,
  },
  pdf: {

    flexDirection: 'row',

    borderWidth: 1,

    justifyContent: 'space-between',

    marginHorizontal: 15,

    borderColor: '#BEBEBE',

    padding: '3@s',

    alignItems: 'center',

    marginVertical: '10@vs',

  },
  attachment: {
    borderColor: Colors.grey1,
    borderWidth: 1,
    paddingVertical: '10@vs',
    paddingHorizontal: '10@s',
    flexDirection: 'row',
    flex: 0.7,
  },
  attachment1: {
    borderColor: Colors.grey1,
    borderWidth: 1,
    paddingVertical: '10@vs',
    justifyContent: 'center',
    paddingHorizontal: '10@s',
    flexDirection: 'row',
    flex: 0.1,
  },
  attachment2: {
    borderColor: Colors.grey1,
    borderWidth: 1,
    paddingVertical: '10@vs',
    justifyContent: 'center',
    paddingHorizontal: '10@s',
    flexDirection: 'row',
    flex: 0.1,
  },
  image: {
    height: '20@s',
    width: '20@s',
  },
});
