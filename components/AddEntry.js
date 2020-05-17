import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Platform, StyleSheet, ScrollView } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import SimpleSlider from '../components/SimpleSlider'
import SimpleSteppers from '../components/SimpleSteppers'
import DateHeader from '../components/DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { white, purple } from '../utils/colors'
import { connect } from 'react-redux'
import { addEntry } from '../actions'

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity 
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
      onPress={onPress}>
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 0,
    eat: 0,
    sleep: 0,
    bike: 0,
    swim: 0,
  }

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }

  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  slide = (metric, value) => {
    this.setState((state) => ({
      [metric]: value
    }))
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state

    // update redux
    this.props.dispatch(addEntry({
      [key]: entry
    }))

    // update local state
    this.setState(() => ({
      run: 0,
      eat: 0,
      sleep: 0,
      bike: 0,
      swim: 0,
    }))

    // navigate to home

    // save to database
    submitEntry({ key, entry })

    // clean local notification

  }

  reset = () => {
    const key = timeToString()

    // update redux
    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }))

    // route to home

    // update database
    removeEntry(key)

  }

  render() {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons 
            name={Platform.OS === 'ios' ? 'ios-happy' : 'md-happy'}
            size={100}
          />
          <Text>You already logged your information for today</Text>

          <TextButton style={{padding: 10}} onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <ScrollView style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()}/>
        {/* <Text>{JSON.stringify(this.state)}</Text> */}

        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key]
          const value = this.state[key]

          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              { type === 'slider'
                ? <SimpleSlider 
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <SimpleSteppers 
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />
              }
            </View>
          )
        })}

        <SubmitBtn onPress={this.submit}/>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center' 
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
})

function mapStateToProps (state) {
  const key = timeToString()
  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry)