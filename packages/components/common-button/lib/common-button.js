import { useEffect } from 'react'
import { Button } from '@tarojs/components'

const CommonButton = (props) => {
    useEffect(()=>{
        console.log('CommonButton useEffect')
    },[])
    return (
        <Button {...props}/>
    )
}

export default CommonButton