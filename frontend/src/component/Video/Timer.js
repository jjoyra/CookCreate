import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

function Timer({ role }) {
  const publisher = useSelector((state) => state.video.publisher)

  const [ curHours, setCurHours ] = useState(0)
  const [ curMinutes, setCurMinutes ] = useState(0)
  const [ curSeconds, setCurSeconds ] = useState(0)
  const [ totalSeconds, setTotalSeconds ] = useState(0)

  console.log("나는야", role)

  // const role = localStorage.getItem('role')  // 지금은 직접 넣어줬는데 나중엔 이걸로 하기 or props로 해결

  useEffect(() => {
    const total = curHours*3600 + curMinutes*60 + curSeconds
    setTotalSeconds(total)
    // console.log("시간입력", totalSeconds)
  }, [ curHours, curMinutes, curSeconds ])

  const timer = () => {
    const checkMinutes = Math.floor(totalSeconds / 60)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = checkMinutes % 60
    const seconds = totalSeconds % 60

    setCurHours(hours)
    setCurMinutes(minutes)
    setCurSeconds(seconds)
  }

  const intervalRef = useRef(null)
  
  const start = useCallback(() => {
    if (intervalRef.current !== null) {
      return
    }
    intervalRef.current = setInterval(() => {
      setTotalSeconds((c) => {
        if (c > 0) {
          return c-1
        } else {
          stop()
          return 0
        }
      })
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return
    }
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  const reset = useCallback(() => {
    setTotalSeconds(0)
    stop()
  }, [])

  useEffect(timer, [totalSeconds])

  const sendTime = (streamManager) => {
    const data = {
      hours: curHours, minutes: curMinutes, seconds: curSeconds
    }
    streamManager.stream.session.signal({
      data: JSON.stringify(data),
      type: 'timer'
    })
    console.log("쿠커 타이머 설정", data)
  }

  useEffect(() => {
    if (role === 'COOKIEE' && publisher !== undefined) {
      console.log("쿠키 세션에 이벤트 추가", role, publisher)
      publisher.stream.session.on('signal:timer', (e) => {
        const data = JSON.parse(e.data)
        if (data !== undefined) {
          setCurHours(data.hours)
          setCurMinutes(data.minutes)
          setCurSeconds(data.seconds)
          console.log(data)
          console.log("쿠커가 보낸 시간", curHours, curMinutes, curSeconds)
        }
      })
    }
  }, [])

  return (
    <div>
      {role === 'COOKYER' ? (
        <div>
          {/* 60미만으로 적도록 뭐,, 제한 걸기 */}
          <input
            type='number'
            value={curHours}
            onChange={(e) => {
              setCurHours(e.target.value)
            }}
          ></input>
          <span> : </span>
          <input
            type='number'
            value={curMinutes}
            onChange={(e) => {
              setCurMinutes(e.target.value)
            }}
          ></input>
          <span> : </span>
          <input
            type='number'
            value={curSeconds}
            onChange={(e) => {
              setCurSeconds(e.target.value)
            }}
          ></input>
        </div>
      ) : (
        <h1>
          {curHours < 10 ? `0${curHours}` : curHours}
          : 
          {curMinutes < 10 ? `0${curMinutes}` : curMinutes}
          : 
          {curSeconds < 10 ? `0${curSeconds}` : curSeconds}
        </h1>
      )}
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
      {/* 학생들에게 선생님이 설정한 타이머 값을 보냄 */}
      {role === 'COOKYER' ? (
        <button onClick={() => sendTime(publisher)}>설정</button>
      ) : (
        null
      )}
    </div>
  )
}

export default Timer;