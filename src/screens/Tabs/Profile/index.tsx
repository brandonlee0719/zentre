import React from 'react';
import {View, Text} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import axios from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {createCategory} from '../../../utils/store/controllers/fees';
import {connect} from 'react-redux';
import { logout } from '../../../utils/store/controllers/auth'

class Profile extends React.Component {

  componentDidMount = () => {
    console.log('check it',this.props.createCategory())
    this.props.createCategory().then((res)=>{
      console.log('this is res',res)
    }).catch((err)=>{
      console.log('this is err',err)
    })
  };
  

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Profile</Text>
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 32,
    color: 'black',
  },
});
const mapStateToProps = state => {
  return {

  }
}
const mapDispatchToProps = {
  createCategory,
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
