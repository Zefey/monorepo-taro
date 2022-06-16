import Taro,{getCurrentInstance,Current} from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  $instance:Current = getCurrentInstance()
  
  componentWillMount () { }

  componentDidMount () {
    console.log('params',this.$instance?.router?.params)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClick = () => {
    console.log('handleClick')
    Taro.navigateTo({
      url: '/pages/test/index'
    })
  }

  render () {
    return (
      <View className='index'>
        <Text>test page11!!!!</Text>
        <Button onClick={this.handleClick}>点击跳转</Button>
      </View>
    )
  }
}
