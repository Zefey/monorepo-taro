import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'
// eslint-disable-next-line import/first
import mod1 from 'mod1'

export default class Test extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClick = () => {
    mod1()
  }

  render () {
    return (
      <View className='index'>
        <Text onClick={this.handleClick}>Test!</Text>
      </View>
    )
  }
}
