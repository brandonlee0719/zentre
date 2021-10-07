
import { AUTH, LocalStorage, t } from '../../utils';

import { Alert, Header, Text } from '../../components';

import { Alert as Alert1, BackHandler, StyleSheet, View } from 'react-native';
import { Colors, Ic_Back } from '../../res';
import { CreateFeed, fetchAppData } from '../../utils/store/controllers/appData';

import {
  createContact,
  uploadFile,
} from '../../utils/store/controllers/contacts';

import Info from './Info';

import React from 'react';

import { ScaledSheet } from 'react-native-size-matters';

import axios from 'axios'

import base64 from 'base-64'

import { connect } from 'react-redux';

import { showAlert } from '../../utils/store/controllers/alert';
interface State {
  currentPage: number;
}
class index extends React.Component<any, State> {
  scrollViewRef: any;

  title: string;
  desc: string;
  recepient: string;
  tags: Tags | null;
  nationality: Nationality | null;
  country: Country | null;
  birthDate: string;
  mobileNo: string;
  password: string;
  avatar: string;
  email: string;
  files: object;
  image: object;

  adSetting: [];

  constructor(props) {
    super(props);

    this.scrollViewRef = React.createRef<ScrollView>();

    this.title = '';
    this.recepient = '';
    this.tags = null;
    this.nationality = null;
    this.country = null;
    this.birthDate = '';
    this.mobileNo = '';
    this.password = '';
    this.avatar = '';
    this.email = '';
    this.files = {};
    this.desc = '';
    this.adSetting = [];
    this.image = {};


    this.state = {
      currentPage: 0,
    };
    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)

    this.props.fetchAppData(['genders', 'countries', 'nationalities', 'recipientsList', 'feedType']).then(() => {

    })

  }


  onHardwareBackPress = (): any => {

    let { currentPage } = this.state


    if (currentPage == 1) {

      this.setState({

        currentPage: 0

      }, () => {

        this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })

      })

      return true

    }


    return false

  }

  async componentDidMount() {

  }
  _onBack = () => {
    this.props.navigation.goBack();
  };

  _onPostfix = async () => {
    console.log('thiss', this.image)
    let data = {
      Title: this.title,
      ToUserList: this.recepient,
      FromPuserType: 'School',
      FeedType: this.tags,
      EmailAlert: (this.adSetting.indexOf('Email alerts') > -1) ? '1' : '0',
      ParentEmailAlert: '1',
      AllowComments: (this.adSetting.indexOf('Allow Downloads') > -1) ? '1' : '0',
      AllowDownload: (this.adSetting.indexOf('Allow Comments') > -1) ? '1' : '0',
      IsFaceBook: (this.adSetting.indexOf('Share to Facebook') > -1) ? '1' : '0',
      UploadVideoList: [],
      UploadPhotoList: this.image.length > 0 ? this.image : [],
      Content: this.desc,
    };
    console.log('data', data)
    this.props.CreateFeed(data).then((d: any) => {
      if (d.payload.Status == 'Success') {
        this.props.navigation.goBack();
      } else {
        Alert1.alert('Required fields Missing!', 'Required fields Missing!');
      }
    });
  };


  uploadImage = async () => {

    //Check if any file is selected or not

    if (singleFile != null) {

      //If file selected then create FormData



    } else {

      //if no file selected the show alert

      alert('Please Select File first');

    }

  };

  onFiles = async (file) => {
    console.log('file', file)
    LocalStorage.getInstance().load(AUTH).then((value) => {
      let idToken = value.idToken;
      const id = idToken.split('.')[1];
      const userId = JSON.parse(base64.decode(id)).sub;
      let formData = new FormData();
      if (file?.video) {
        formData.append('uploadType', 'video');
        formData.append('CreateID', userId);
        formData.append('Leangth', 100);
        formData.append('file', {
          uri: file.video?.path,
          name: 'video',
          type: 'multipart/form-data'
        })
        try {
          axios.post(
            'https://contacts.ichild.com.sg/api/v1.0/SchoolManagement/UploadVideo',
            formData,
            {
              headers: {
                'content-type': 'multipart/form-data',
                'Content-type': 'multipart/form-data',
                'Authorization': `Bearer ${value.accessToken}`
              },
            }
          ).then((res) => {
            console.log('res', res)
            let d = JSON.parse(res.data.Remark)
            console.log('res', d)
            this.image = (d)
          }).catch((err) => {
            console.log('err', err)
          })

        } catch (error) {
          //Handle Error
          console.debug('Error-uploadFile: ', error)
          console.debug('Error-uploadFile: ', error)
        }
      } else {
        formData.append('uploadType', file.image?.path ? 'photo' : 'file');
        formData.append('CreateID', userId);
        formData.append('file', {
          uri: file.image?.path ? 'file://' + file.image.path : file.document?.fileCopyUri,
          name: 'name.jpg',
          fileName: 'name.jpg',
          type: 'multipart/form-data'
        })
        try {
          axios.post(
            'https://contacts.ichild.com.sg/api/v2.0/SchoolManagement/UploadFile',
            formData,
            {
              headers: {
                'content-type': 'multipart/form-data',
                'Content-type': 'multipart/form-data',
                'Authorization': `Bearer ${value.accessToken}`
              },
            }
          ).then((res) => {
            console.log('res', res)
            let d = JSON.parse(res.data.Remark)
            console.log('res', d)
            this.image = (d)
          }).catch((err) => {
            console.log('err', err)
          })

        } catch (error) {
          //Handle Error
          console.debug('Error-uploadFile: ', error)
          console.debug('Error-uploadFile: ', error)
        }
      }
    })
  }


  render() {

    const { genders, countries, nationalities, recipientsList, feedType } = this.props;
    return (
      <View style={styles.container} >
        <Header
          text={t('createFeed')}
          postfix={
            <Text
              text={'Post'}
              color={Colors.primary}
              size={18}
              font={'medium'}
            />
          }
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
          onPostfix={this._onPostfix}
        />{(genders && nationalities && countries && recipientsList && feedType) ?
          (<Info
            genders={genders}
            nationalities={nationalities}
            recipientsList={recipientsList}
            feedType={feedType}
            countries={countries}
            onDesc={text => {
              this.desc = text
            }}
            onTitle={text => {
              this.title = text;
            }}
            onAddSetting={text => {
              console.log('text', text)
              this.adSetting = text;
            }}
            onRecepient={text => {
              console.log('text', text)
              this.recepient = text;
            }}
            onTags={tags => {
              this.tags = tags;
            }}
            onFiles={this.onFiles}

          />) : null

        }
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
const mapStateToProps = state => {
  return {
    genders: state.appDataController.genders,
    countries: state.appDataController.countries,
    nationalities: state.appDataController.nationalities,
    recipientsList: state.appDataController.recipientsList,

    feedType: state.appDataController.feedType,

  };
};
const mapDispatchToProps = {
  fetchAppData,
  showAlert,
  createContact,
  uploadFile,
  CreateFeed
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
