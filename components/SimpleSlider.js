import React from 'react'
import { View, Text, Slider, StyleSheet } from 'react-native'
import { gray } from '../utils/colors'
import MetricCounter from './MetricCounter'

export default function SimpleSlider (props) {
  const { max, unit, step, value, onChange } = props

  return (
    <View style={styles.row}>
      <Slider 
        style={{flex: 1}}
        step={step}
        value={value}
        maximumValue={max}
        minimumValue={0}
        onValueChange={onChange}
      />
      
      <MetricCounter value={value} unit={unit}/>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
})