import React from 'react'
import {
  View,
  ScrollView, Keyboard, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native'
import { t } from '../../../utils'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import { Header, Text, StorageList } from '../../../components'
import { getFeedCapacityByUser, clearFeedCapacityByUser } from '../../../utils/store/controllers/feed'
import { connect } from 'react-redux'
import {
  Colors,
  Ic_Back,
  Ic_Arrow_Down
} from '../../../res'

class Storage extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      yearList: [],
      FeedTotalUsedSpace: 0,
      TotalSpace: 0
    }
  }

  componentDidMount() {
    this.getAllFeedCapacity()
  }

  getAllFeedCapacity = async () => {
    const res = await this.props.getFeedCapacityByUser()
    if (res) {
      this.setState({
        yearList: res.payload.YearList,
        FeedTotalUsedSpace: res.payload.FeedTotalUsedSpace,
        TotalSpace: res.payload.TotalSpace,
      })
    }
  }

  clearFeedMonth = async (YearMonth: any) => {
    const res = await this.props.clearFeedCapacityByUser({ YearMonth })
    console.log('clearFeedMonth', res.payload)
    if (res.payload.Status) {
      this.getAllFeedCapacity()
    }
  }

  _onPostfix = () => {
    Keyboard.dismiss()
  }

  _onBack = () => {
    this.props.navigation.goBack()
  }

  _onClickOption = () => {
    console.log('');
  }

  formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  render() {

    const { yearList, TotalSpace, FeedTotalUsedSpace } = this.state;
    console.warn('yearList', yearList[0]?.MonthList);

    return (
      <View style={styles.container}>
        <Header
          text={t('storage')}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
        />


        <ScrollView
          style={styles.scrollcontainer}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          pagingEnabled
        >
          <View
            style={styles.totalContainer}>
            <Text
              text={t('totalFeed')}
              font={'regular'}
              size={16}
              color={Colors.grey2}
            />
            <Text
              text={this.formatBytes(FeedTotalUsedSpace) + " / " + this.formatBytes(TotalSpace)}
              font={'regular'}
              size={16}
              color={Colors.grey2}
            />
          </View>
          <View style={{ width: '100%', alignItems: 'center' }}>
            {
              yearList?.map((option, i) => (
                <StorageList
                  key={i}
                  clearFeedMonth={this.clearFeedMonth}
                  containerStyle={{ marginTop: moderateScale(20) }}
                  year={option.YearName}
                  capacity={this.formatBytes(option.FeedTotalUsedSpace)}
                  isRequired={true}
                  items={option.MonthList}
                />
              ))
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  scrollcontainer: {
    width: '100%',
    paddingHorizontal: '10@ms',
  },
  text: {
    fontSize: 32,
    color: 'black'
  },
  optionContainer: {
    width: '100%',
    height: '56@ms',
    borderWidth: 1,
    borderColor: Colors.grey2,
    borderRadius: '4@ms',
    paddingHorizontal: '10@ms',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '12@ms'
  },
  totalContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '12@ms'
  },
  endContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

const mapDispatchToProps = {
  getFeedCapacityByUser,
  clearFeedCapacityByUser
}

export default connect(
  null,
  mapDispatchToProps
)(Storage)