import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { gray } from '../utils/colors'

export default function metricCounter ({ value, unit }) {
  return (
    <View style={styles.metricCounter}>
        <Text style={{fontSize: 24, textAlign: 'center'}}>{value}</Text>
        <Text style={{fontSize: 18, color: gray}}>{unit}</Text>
      </View>
  )
}

const styles = StyleSheet.create({
  metricCounter: {
    width: 85,
    alignItems: 'center',
    justifyContent: 'center',
  },
})