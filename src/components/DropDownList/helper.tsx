import {
  useRef,
  useEffect,
} from 'react'

import Animated, { EasingNode } from "react-native-reanimated"

const {
  proc,
  add,
  multiply,
  sub,
  Value,
  Clock,
  block,
  cond,
  not,
  set,
  startClock,
  stopClock,
  neq,
  timing,
} = Animated

export const mix = proc((value: any, x: any, y: any) => {
  return add(x, multiply(value, sub(y, x)))
})


const useConst = (initialValue) => {
  var ref: any = useRef()

  if (ref.current === undefined) {
    ref.current = {
      value: initialValue()
    }
  }

  return ref.current.value;
}

export const useTransition = function useTransition(state) {
  var value = useConst(() => {
    return new Value(0)
  })

  useEffect(() => {
    value.setValue(state ? 1 : 0)
  }, [value, state])

  var transition = useConst(() => {
    return withTransition(value)
  })

  return transition;
}


const withTransition = function withTransition(value) {
  var init = new Value(0)
  var clock = new Clock()
  var state = {
    finished: new Value(0),
    frameTime: new Value(0),
    position: new Value(0),
    time: new Value(0)
  }

  var config = {
    toValue: new Value(0),
    duration: 150,
    easing: EasingNode.linear
  }

  return block([
    cond(
      not(init),
      [
        set(init, 1), set(state.position, value)
      ]
    ),
    cond(
      neq(config.toValue, value),
      [
        set(state.frameTime, 0),
        set(state.time, 0), set(state.finished, 0), set(config.toValue, value),
        startClock(clock)
      ]
    ),
    timing(clock, state, config),
    cond(
      state.finished, stopClock(clock)
    ), state.position
  ])
}