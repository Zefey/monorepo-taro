import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import './index.scss'
// eslint-disable-next-line import/first
import CommonButton from 'common-button'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClick = () => {
    Taro.navigateTo({
      url:'/pages/test/index',
    })
  }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <CommonButton onClick={this.handleClick}>点击跳转</CommonButton>
      </View>
    )
  }
}
