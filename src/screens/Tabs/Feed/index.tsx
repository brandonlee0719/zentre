import { AUTH, LocalStorage, t } from '../../../utils';
import {
  BackHandler,
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Ic_Plus } from '../../../res';
import {
  CreateFeed,
  FeedAddLike,
  GetFeedList,
  fetchAppData
} from '../../../utils/store/controllers/appData'
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import React, { useLayoutEffect, useState } from 'react';

import CheckBox from '@react-native-community/checkbox';
import { Header } from '../../../components';
import { ScaledSheet } from 'react-native-size-matters';
import ViewModal from './components/ViewModal';
import axios from 'axios';
import base64 from 'base-64'
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import Pdf from 'react-native-pdf';

const { Popover, SlideInMenu, ContextMenu, NotAnimatedContextMenu } = renderers;

// export default (Feed);


function Feed(props) {
  const [state, setstate] = useState(false);
  const [opened, setOpened] = useState(false);
  const [checked, setChecked] = useState(false);
  const [viewModal, openViewModal] = useState(false);

  const [data, setData] = useState([]);

  const [filterData, setFilterData] = useState(false);

  const [type, setType] = useState(false);

  const [checkedlist, setchecked] = useState([]);

  const [storage, setStorage] = useState();
  const [userID, setUserID] = useState('');
  const [bigImage, setBigImage] = useState('');
  const [bigImageModal, setBigImageModal] = useState(false);
  const [pdf, setPdf] = useState(false);

  useLayoutEffect(() => {
    const unsubscribe = props?.navigation.addListener("focus", () => {
      callApis();
    });
    props.fetchAppData(['genders', 'countries', 'nationalities', 'recipientsList', 'feedType']).then(() => {

    })
    return unsubscribe;
  }, [filterData]);

  const callApis = () => {
    LocalStorage.getInstance().load(AUTH).then((value) => {
      setStorage(value);
      let idToken = value.idToken;
      const id = idToken.split('.')[1];
      const userId = JSON.parse(base64.decode(id)).sub;
      setUserID(userId)
      getFeedListApi(userId, value);
      axios
        .get(
          'https://contacts.ichild.com.sg/api/v1.0/SchoolManagement/GetFeedType',
          {
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${value.accessToken}`,
            },
          },
        )
        .then(d => {
          setType(JSON.parse(d.data.Remark));
        });
    });
  };

  const getFeedListApi = async (userId, value) => {
    axios
      .get(
        `https://contacts.ichild.com.sg/api/v1.0/SchoolManagement/GetFeedList/${userId}/10/1`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${value.accessToken}`
          },
        }
      )
      .then(d => {
        d = JSON.parse(d.data.Remark);
        d.FeedList.forEach(async element => {
          if (element.LikeNum > 0) {
            await axios
              .get(
                `https://contacts.ichild.com.sg/api/v1.0/SchoolManagement/GetFeedLikeList/${element.BaseID}`,
                {
                  headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${value.accessToken}`,
                  },
                }
              )
              .then(d => {
                element.likesArray = JSON.parse(d.data.Remark)
                return
              })
              .catch(err => {
                console.log('this is err', err)
              });
          }
          else { element.likesArray = []; }
        });
        setTimeout(() => {
          setData(d.FeedList);
        }, 1000);
      })
      .catch(err => {
        console.log('this is err', err)
      });
  }

  const feedLike = async (baseID) => {

    let value = storage;

    let idToken = value.idToken;

    const id = idToken.split('.')[1];

    const userId = JSON.parse(base64.decode(id)).sub;

    let data = {}
    data.CreateID = userId;
    data.BaseID = baseID
    let res = await axios.post(
      `https://contacts.ichild.com.sg/api/v1.0/SchoolManagement/FeedAddLike`, data,
      {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${value.accessToken}`,
        },
      },
    );
    return res.data;
  };

  const deleteFeed = async item => {
    let value = storage;
    let idToken = value.idToken;
    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;
    let data = {};
    data.CreateID = userId;
    data.BaseID = item.BaseID;
    let res = await axios
      .delete(
        `https://contacts.ichild.com.sg/api/v1.0/SchoolManagement/DeleteFeed`,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${value.accessToken}`,
          },
          data: data,
        },
      )
      .then(data => {
        if (data.data.Status === 'Success') {
          callApis();
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const renderMenu = ({ id, name }) => {

    id = parseInt(id)
    return (
      <MenuOption disableTouchable>
        <View style={styles.row}>
          <CheckBox
            disabled={false}
            style={{
              marginRight: 10,
              transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
            }}
            boxType="square"
            onCheckColor="white"
            value={checkedlist.indexOf(name) > -1 ? true : false}
            onChange={() => {
              let arr: [number] = [];
              if (checkedlist.indexOf(name) < 0) {
                arr = [name]
                arr = arr.concat(checkedlist)
                setchecked(arr)
              } else if (checkedlist.indexOf(name) > -1) {
                checkedlist.splice(checkedlist.indexOf(name), 1)
                arr = checkedlist
                setchecked(checkedlist)
              }
            }}

            tintColor="#818181"
            onTintColor="#599F41"
            onFillColor="#599F41"
          />
          <Text style={[styles.normal, , { marginTop: -5 }]}>{name}</Text>
        </View>
      </MenuOption>
    );
  };

  const renderFile = item => {
    return (
      <View>
        {item[0]?.UploadFilePath.includes('pdf') ? (
          <TouchableOpacity style={styles.pdf} onPress={() => {
            setBigImage(`https://contacts.ichild.com.sg${item[0]?.UploadFilePath}`)
            setBigImageModal(true)
            setPdf(true)
          }}>
            <Image
              source={require('./pdf.png')}
              style={{ height: 45, width: 45 }}
            />
            <Text>{item?.pdf}</Text>
          </TouchableOpacity>
        ) : item[0]?.UploadFilePath ? (
          <TouchableOpacity style={styles.pdf} onPress={() => {
            setBigImage(`https://contacts.ichild.com.sg${item[0]?.UploadFilePath}`)
            setBigImageModal(true)
            setPdf(false)
          }}>
            <Image
              resizeMode="cover"
              source={{
                uri: `https://contacts.ichild.com.sg${item[0]?.UploadFilePath}`,
              }}
              style={styles.bigImage}
            />
          </TouchableOpacity>
        ) : (
          <View style={[styles.pdf, { borderWidth: 0, marginVertical: 8 }]} />
        )}
      </View>
    );
  };

  const renderCategories = item => {
    return (
      <View style={styles.row}>
        {item.map((item, index) => {
          return (
            <View style={styles.cat}>
              <Text style={styles.light}>{item}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderSeen = item => {
    return (
      <View style={[styles.row, {}]}>
        <Image
          style={{
            tintColor: item.isLiked ? '#599F41' : '#BEBEBE',
            height: 20,
            marginTop:2,
            width: 20,
            marginRight: 10
          }}
          source={require('./eye.png')}
          resizeMode="contain"
        />
        <View style={styles.row}>
          {item.seenBy.map((item, index) => {
            if (index < 2) return <Text style={styles.light}>{item},  </Text>;
          })}
          <Text
            style={[styles.light, { color: '#599F41' }]}
            onPress={() => openViewModal(true)}>
            {t('and')} {item?.seenBy?.length - 2} more
          </Text>
        </View>
      </View>
    );
  };

  const renderComments = item => {
    return (
      <View style={[styles.row, styles.sb, { marginVertical: 5 }]}>
        <TouchableOpacity
          style={[styles.row, styles.as, { width: '50%' }]}
          onPress={async () => {
            if (!item.isLiked) {
              item.isLiked = true;
              item.LikeNum += 1;
              setstate(!state);
              let res = await feedLike(item.BaseID);
            }
          }}>
          <Image
            style={{
              tintColor: item?.likesArray?.findIndex(x => x.UserID === userID) > -1 ? '#599F41' : '#BEBEBE',
              height: 20,
              width: 20,
            }}
            source={require('./like.png')}
          />
          <Text
            style={
              item?.likesArray?.findIndex(x => x.UserID === userID) > -1 ? styles.greenText : [styles.light, { marginLeft: 5 }]
            }>
            {item.LikeNum} likes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, styles.as, { width: '50%' }]} onPress={() => props.navigation.navigate('SingleFeed', item)}>
          <Image
            style={{
              tintColor: item.isComment ? '#599F41' : '#BEBEBE',
              height: 20,
              width: 20,
            }}
            source={require('./comment.png')}
          />
          <Text
            style={
              item.isComment ? styles.greenText : [styles.light, { marginLeft: 5 }]
            }>
            {item.CommentNum} comments
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = item => {

    return (
      <TouchableOpacity activeOpacity={0.9} style={[styles.itemMain, styles.shadow]} onPress={() => props.navigation.navigate('SingleFeed', item)}>
        <View style={[styles.row, styles.sb]}>
          <View style={[styles.row]}>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('ProfileContact', {
                user: item
              })
            }}>
              <Image
                source={{
                  uri: item?.HeadSculpture ? item.HeadSculpture : 'https://image.shutterstock.com/image-vector/user-icon-trendy-flat-style-600w-418179865.jpg',
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <View style={styles.row}>
                <Text style={styles.bold}>{item?.CreatorName ? item?.CreatorName : "No Name"}</Text>

                <Text style={styles.light}> ({item?.occupation})</Text>

              </View>
              <Text style={styles.xlight}>{item?.InsertDate}</Text>
            </View>
          </View>
          <View style={[styles.row]}>
            {/* <TouchableOpacity onPress={() => deleteFeed(item)}>
              <Image source={require('./cross.png')} style={[styles.image, { marginRight: 10 }]} />
            </TouchableOpacity> */}
            <Image
              source={require('./menu.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={[styles.bold, styles.title]}>{item?.Title}</Text>

        <Text style={[styles.normal]}>{item?.Description}</Text>
        {(item.UploadPhotoList.length > -1) ? renderFile(item?.UploadPhotoList) : null}
        {renderCategories([item.FeedType])}

        {renderSeen({ seenBy: ['User', 'User2', 'User3', 'User4'] })}
        <View style={styles.divider} />
        {renderComments(item)}
      </TouchableOpacity >
    );
  };
  const onBackdropPress = () => {
    setOpened(false);
  };

  return (
    <View style={[styles.container]}>
      <Header
        text={t('feed')}
        postfix={
          <View style={styles.header}>
            <Menu
              onSelect={event => { }}
              opened={opened}
              onBackdropPress={() => {

                let tem_data = []

                if (checkedlist.length > 0) {

                  for (let index = 0; index < data.length; index++) {

                    const element = data[index]; if (checkedlist.indexOf((element.FeedType)) > -1) {

                      tem_data.push(element)

                    }

                    setFilterData(tem_data)

                  }

                } else {

                  setFilterData(data)

                }

                setOpened(false)
              }

              }>
              <MenuTrigger>
                <TouchableOpacity
                  onPress={() => {
                    setOpened(true);
                  }}>
                  <Image
                    source={require('./filter.png')}
                    style={styles.image}
                  />
                </TouchableOpacity>
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={{ padding: 10 }}>
                <Text style={[styles.xlight, { marginTop: 10 }]}>Filters</Text>

                <View style={[styles.divider, { marginBottom: 10 }]} />
                {type &&
                  type.map(i => {
                    return renderMenu(i);
                  })}
                <Text
                  style={[styles.normal, { color: 'red' }]}
                  onPress={() => {
                    setchecked([]);
                    callApis();
                    setOpened(false);
                  }}>
                  Reset Filters
                </Text>
              </MenuOptions>
            </Menu>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('CreateFeed')}>
              <Image source={require('./plus.png')} style={styles.image} />
            </TouchableOpacity>
          </View>
        }
      // onPostfix={this._onPostfix}
      />
      {(filterData) ?

        <FlatList

          data={filterData}
          style={{ paddingTop: 20 }}
          renderItem={({ item, index }) => {
            return renderItem(item);
          }}
        /> :
        <FlatList
          style={{ paddingTop: 20 }}

          data={data}

          renderItem={({ item, index }) => {

            return renderItem(item);

          }}

        />}
      <ViewModal
        isVisible={viewModal}
        close={() => openViewModal(false)}
        data={type}
      />
      <Modal style={{ height: '100%', width: '100%', margin: 0, padding: 0 }}
        isVisible={bigImageModal}
        onBackButtonPress={() => setBigImageModal(false)}
        swipeDirection='down'
        onSwipeThreshold={200}
        onSwipeComplete={() => setBigImageModal(false)}
      >
        <View style={{ height: '100%', width: '100%' }}
        >
          {pdf ?
            <Pdf
              source={{ uri: bigImage }}
              style={{ height: '100%', width: '100%' }}
            />
            :
            <Image
              source={{ uri: bigImage }}
              style={{ height: '100%', width: '100%' }}
              resizeMode="cover"
            />
          }
        </View>
      </Modal>
    </View>
  );
}
function mapStateToProps(state) {
  return {
    // FeedList: state.appDataController.FeedList,
  };

}

const mapDispatchToProps = {

  GetFeedList,
  FeedAddLike,
  fetchAppData
};
export default connect(mapStateToProps, mapDispatchToProps)(Feed);


const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 32,
    color: 'black',
    fontFamily: Platform.OS === 'android' ? 'RobotoRegular' : 'Roboto-Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60@s', // = scale(100)
  },
  image: {
    height: '20@s',
    width: '20@s', // = scale(100)
  },
  itemMain: {
    margin: '7@s',
    padding: '5@s',
    paddingHorizontal: '7@s',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#BEBEBE',
    marginTop: '10@vs',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bold: {
    fontWeight: '600',
    color: 'black',
    fontSize: 18,
    fontFamily: Platform.OS === 'android' ? 'RobotoMedium' : 'Roboto-Medium',
  },
  normal: {
    fontWeight: '400',
    fontSize: 16,
    fontFamily: Platform.OS === 'android' ? 'RobotoRegular' : 'Roboto-Regular',
  },
  greenText: {
    fontWeight: '400',
    fontSize: 14,
    color: '#599F41',
    marginLeft: '5@s',
    fontFamily: Platform.OS === 'android' ? 'RobotoRegular' : 'Roboto-Regular',
  },
  light: {
    fontWeight: '400',
    color: '#818181',
    fontSize: 14,
    fontFamily: Platform.OS === 'android' ? 'RobotoLight' : 'Roboto-Light',
  },
  xlight: {
    fontWeight: '400',
    color: '#818181',
    fontSize: 12,
    fontFamily: Platform.OS === 'android' ? 'RobotoThin' : 'Roboto-Thin',
  },
  avatar: {
    height: '35@s',
    width: '35@s',
    borderRadius: 20,
    marginRight: '10@s',
  },
  sb: {
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    marginVertical: '20@ms',
    fontFamily: Platform.OS === 'android' ? 'RobotoBold' : 'Roboto-Bold',
  },
  pdf: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#BEBEBE',
    padding: '3@s',
    alignItems: 'center',
    marginVertical: '10@vs',
  },
  bigImage: {
    height: '150@vs',
    width: '100%',
  },
  cat: {
    borderWidth: 1,
    borderColor: '#599F41',
    padding: '3@s',
    paddingHorizontal: '7@s',
    marginRight: '5@s',
    marginBottom: '10@s',
    marginTop: '5@s',
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#BEBEBE',
    marginVertical: '10@vs',
  },
  sa: {
    justifyContent: 'space-around',
  },
  as: {
    alignSelf: 'flex-start',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // backgroundColor: 'white',
    elevation: 5,
  },
});
