import { AUTH, LocalStorage, t } from '../../utils';
import {
    FlatList,
    Image,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Ic_Back } from '../../res';
import {
    CreateFeed,
    FeedAddLike,
    GetFeedList,
    fetchAppData
} from '../../utils/store/controllers/appData';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import React, { useLayoutEffect, useState } from 'react';

import CheckBox from '@react-native-community/checkbox';
import { Header } from '../../components';
import { ScaledSheet } from 'react-native-size-matters';
import ViewModal from '../Tabs/Feed/components/ViewModal';
import axios from 'axios';
import base64 from 'base-64';
import { connect } from 'react-redux';
import { TextInput } from 'react-native-gesture-handler';
import ArrowRight from '../../../src/res/icons/ArrowRight';

// export default (Feed);


function Feed(props) {
    const [state, setstate] = useState(false);
    const [opened, setOpened] = useState(false);
    const [checked, setChecked] = useState(false);
    const [viewModal, openViewModal] = useState(false);
    const [data, setData] = useState(null);
    const [filterData, setFilterData] = useState(false);
    const [type, setType] = useState(false);
    const [checkedlist, setchecked] = useState([]);
    const [storage, setStorage] = useState();
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    const { BaseID } = props.route.params
    console.log('this is item', BaseID)
    useLayoutEffect(() => {
        callApis();
    }, [filterData]);

    const callApis = () => {
        LocalStorage.getInstance().load(AUTH).then((value) => {
            setStorage(value);
            let idToken = value.idToken;
            const id = idToken.split('.')[1];
            const userId = JSON.parse(base64.decode(id)).sub;
            // getFeedListApi(userId, value);
            axios
                .get(
                    `https://contacts.ichild.com.sg/api/v1.0/SchoolManagement/GetFeed/${BaseID}/${userId}`,
                    {
                        headers: {
                            'content-type': 'application/json',
                            Authorization: `Bearer ${value.accessToken}`,
                        },
                    },
                )
                .then(d => {
                    d = JSON.parse(d.data.Remark);
                    console.log('check d', d)
                    setData(d);
                    getCommentList(BaseID, value)
                });
        });
    };

    const getCommentList = (id, value) => {
        axios
            .get(
                `https://contacts.ichild.com.sg/api/v1.0/SchoolManagement/GetCommentList/${id}`,
                {
                    headers: {
                        'content-type': 'application/json',
                        Authorization: `Bearer ${value.accessToken}`,
                    },
                },
            )
            .then(d => {
                console.log('check ddd', d.data)
                d = JSON.parse(d.data.Remark);
                setComments(d);
            }).catch((err) => {
                console.log('err', err)
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

    const addComment = async item => {
        let value = storage;
        let idToken = value.idToken;
        const id = idToken.split('.')[1];
        const userId = JSON.parse(base64.decode(id)).sub;
        let data = {};
        data.CreateID = userId;
        data.BaseID = item.BaseID;
        data.Content = comment
        console.log('data', data)
        console.log('data', value)
        await axios
            .post(
                `https://contacts.ichild.com.sg/api/v1.0/SchoolManagement/CreateComment`, data,
                {
                    headers: {
                        'content-type': 'application/json',
                        Authorization: `Bearer ${value.accessToken}`,
                    },
                },
            )
            .then(data => {
                console.log('this is data', data.data);
                if (data.data.Status === 'Success') {
                    getCommentList(item.BaseID, value)
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
                    <View style={styles.pdf}>
                        <Image
                            source={require('../Tabs/Feed/pdf.png')}
                            style={{ height: 45, width: 45 }}
                        />
                        <Text>{item?.pdf}</Text>
                    </View>
                ) : item[0]?.UploadFilePath ? (
                    <View style={styles.pdf}>
                        <Image
                            resizeMode="cover"
                            source={{
                                uri: `https://contacts.ichild.com.sg${item[0]?.UploadFilePath}`,
                            }}
                            style={styles.bigImage}
                        />
                    </View>
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
            <View style={styles.row}>
                {item.seenBy.map((item, index) => {
                    if (index < 2) return <Text style={styles.light}>{item},  </Text>;
                })}
                <Text
                    style={[styles.light, { color: '#599F41' }]}
                    onPress={() => console.log(true)}>
                    {t('and')} {item?.seenBy?.length - 2} more
                </Text>
            </View>
        );
    };

    const renderLikes = item => {
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
                            tintColor: item.isLiked ? '#599F41' : '#BEBEBE',
                            height: 20,
                            width: 20,
                        }}
                        source={require('../Tabs/Feed/like.png')}
                    />
                    <Text
                        style={
                            item.isLiked ? styles.greenText : [styles.light, { marginLeft: 5 }]
                        }>
                        {item.LikeNum} likes
                    </Text>
                </TouchableOpacity>
                {renderSeen({ seenBy: ['User', 'User2', 'User3'] })}

            </View>
        );
    };

    const renderItem = item => {
        return (
            <View style={[styles.itemMain, styles.shadow, {}]}>
                <View style={[styles.row, styles.sb]}>
                    <View style={[styles.row]}>
                        <Image
                            source={{
                                uri: item?.HeadSculpture ? item.HeadSculpture : 'https://image.shutterstock.com/image-vector/user-icon-trendy-flat-style-600w-418179865.jpg',
                                // uri: item.UploadPhotoList[0],

                            }}
                            style={styles.avatar}
                        />
                        <View>
                            <View style={styles.row}>
                                <Text style={styles.bold}>{item?.CreatorName}</Text>

                                {/* <Text style={styles.light}> ({item?.occupation})</Text> */}

                            </View>
                            <Text style={styles.xlight}>{item?.InsertDate}</Text>
                        </View>
                    </View>
                </View>
                <Text style={[styles.bold, styles.title]}>{item?.Title}</Text>

                <Text style={[styles.normal]}>{item?.Description}</Text>
                {(item.UploadPhotoList.length > -1) ? renderFile(item?.UploadPhotoList) : null}
                {renderCategories([item.FeedType])}

                <View style={[styles.divider, { borderWidth: 0 }]} />
                {renderLikes(item)}
                <View style={styles.divider} />
                <Text style={[styles.bold, styles.title, { marginBottom: 15 }]}>Comments</Text>
                {renderComments(item)}

                <View style={styles.InputContainer}>
                    <TextInput
                        placeholder="Write a comment"
                        onChangeText={(text) => setComment(text)}
                    />
                    <TouchableOpacity onPress={() => addComment(item)}>
                        <ArrowRight color="green" style={{ width: 100, height: 100 }} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderComments = (item) => {
        return (
            <View style={{ height: item?.UploadPhotoList[0]?.UploadFilePath?.includes('pdf') ? '47%' : item?.UploadPhotoList.length > 0 ? '32%' : '53%', width: '100%', }}>
                <FlatList
                    data={comments}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.commentMain}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        source={{
                                            uri: item?.HeadSculpture ? item.HeadSculpture : 'https://image.shutterstock.com/image-vector/user-icon-trendy-flat-style-600w-418179865.jpg',
                                        }}
                                        style={styles.image}
                                    />
                                    <View style={{ marginLeft: 15, marginBottom: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.bold}>{item.FromUserName ? item.FromUserName : "UserName"} </Text>
                                            <Text style={styles.xlight}>{item.InsertDate}</Text>
                                        </View>
                                        <Text style={styles.normal}>{item.Cont}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
        )
    }

    const onBackdropPress = () => {
        setOpened(false);
    };

    return (
        data !== null ?
            <View style={[styles.container]}>
                <Header
                    text={t('feed')}
                    postfix={
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate('CreateFeed')}>
                                {/* <Image source={require('./plus.png')} style={styles.image} /> */}
                            </TouchableOpacity>
                        </View>
                    }
                    prefix={<Ic_Back color={Colors.primary} />}
                    onPrefix={() => props.navigation.goBack()}
                // onPostfix={this._onPostfix}
                />
                {renderItem(data)}
                <ViewModal
                    isVisible={viewModal}
                    close={() => openViewModal(false)}
                    data={type}
                />
            </View>
            : null
    );
}
function mapStateToProps(state) {
    return {
        // FeedList: state.appDataController.FeedList,
    };

}


function mapDispatchToProps() {
    return {
        GetFeedList,
        FeedAddLike,
    };
}
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
        height: '35@s',
        width: '35@s', // = scale(100)
        borderWidth: 1,
        borderRadius: 25
    },
    itemMain: {
        margin: '5@s',
        padding: '5@s',
        paddingHorizontal: '7@s',
        borderWidth: 1,
        borderColor: '#BEBEBE',
        marginTop: '20@vs',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bold: {
        fontWeight: '600',
        color: 'black',
        fontSize: 16,
        marginBottom: 5,
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
        marginVertical: '5@vs',
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
        height: '130@vs',
        width: '100%',
    },
    cat: {
        borderWidth: 1,
        borderColor: '#599F41',
        padding: '2@s',
        paddingHorizontal: '7@s',
        marginRight: '5@s',
        marginBottom: '10@s',
        marginTop: '5@s',
        borderRadius: 4,
    },
    divider: {
        borderWidth: 1,
        borderColor: '#BEBEBE',
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
        backgroundColor: 'white',
        elevation: 5,
    },
    InputContainer: {
        width: '100%',
        height: '56@ms',
        borderTopWidth: 1,
        borderColor: Colors.grey1,
        backgroundColor:'white',
        borderRadius: '4@ms',
        justifyContent: 'space-between',
        paddingHorizontal: '10@ms',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        zIndex: 100
    },
    commentMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    }
});
