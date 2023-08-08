import React, { useEffect, useState } from 'react';

import '../../../style/video.css'
import { useDispatch, useSelector } from 'react-redux';
import { audioMute, leaveSession, setMainStreamManager, videoMute } from '../../../store/video/video';
import { setShareScreenPublisher } from '../../../store/video/screenShare';
import axios from 'axios';
import { closeSession, shareScreen } from '../../../store/video/video-thunk';
import { BsMicFill, BsMicMute, BsCameraVideoFill, BsCameraVideoOff, BsWindowFullscreen, BsVolumeMuteFill } from "react-icons/bs"
import { RxExit } from "react-icons/rx"

function CookyerVideoSideBar() {
  const dispatch = useDispatch()

  const session = useSelector((state) => state.video.session)
  const publisher = useSelector((state) => state.video.publisher)
  const isAudioPublished = useSelector((state) => state.video.isAudioPublished)
  const isVideoPublished = useSelector((state) => state.video.isVideoPublished)
  
  /** 화면 공유 기능 */
  const shareScreenPublisher = useSelector((state) => state.screenShare.shareScreenPublisher)
  const [ isShared, setIsShared ] = useState(false)
  const nickname = localStorage.getItem('nickname');
  
  /** 세션 나가기 */
  const sessionId = useSelector((state) => state.video.sessionId)
  const videoLessonId = useSelector((state) => state.video.videoLessonId)
  const access_token = localStorage.getItem('access_token')

  /** 과외방 닫기 */
  const handleCloseSession = () => {
    if (sessionId !== undefined) {
    // if (session.sessionId) {
      console.log("레슨번호", videoLessonId)
      console.log(access_token, "삭제시도")
      axios.delete(
        // `http://localhost:4443/openvidu/api/sessions/${session.sessionId}`,
        `https://i9c111.p.ssafy.io:8447/openvidu/api/sessions/${session.sessionId}`,
        {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:MMT_SECRET'),
          }
        })
        .then((res) => {
          session.disconnect()
          const data = {
            access_token, lessonId: videoLessonId
          }
          dispatch(closeSession(data))
          console.log('세션 종료 성공', res)
        })
        .catch((err) => {
          console.log('세션 종료 실패', err)
        })
    } else {
      console.log("비정상적인 접근. 어떻게 여기에..?")
    }
  }

  /** 화면 공유 */
  const handleScreenShare = () => {
    console.log("handleScreenShare", shareScreenPublisher)
    if (shareScreenPublisher === null) {
      if (isShared) {
        setIsShared(false)
      } else {
        setIsShared(true)
        console.log("화면공유하기")
      }
    } else {
      publisher.stream.session.signal({
        type: 'shareEnd'
      })
      session.unpublish(shareScreenPublisher)
      setIsShared(false)
      dispatch(setShareScreenPublisher(null))
      dispatch(setMainStreamManager(publisher))
      console.log("화면공유 취소")
    }
  }

  useEffect(() => {
    if (isShared) {
      console.log("화면공유 시작")
      const data = {
        sessionId, nickname
      }
      dispatch(shareScreen(data))
    }
  }, [isShared])
  
  const setVideoMute = () => {
    dispatch(videoMute())
  }

  const setAudioMute = () => {
    dispatch(audioMute())
  }

  useEffect(() => {
    // componentDidMount
    window.addEventListener('beforeunload', onbeforeunload);

    // componentWillUnmount
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
    };
  }, []);

  const onbeforeunload = (e) => {
    dispatch(leaveSession())  // 수정필요
  }

  /** 쿠키 전체 음소거 */
  const handleCookieeAudio = () => {
    publisher.stream.session.signal({
      type: 'forceAudioMute'
    })
  }

  return (
    <div className='video-sidebar'>
      {/* 수업 끝내기 */}
      <div className='video-side-icon-wrap' onClick={handleCloseSession}>
        <RxExit className='video-side-icon video-exit-icon'/>
      </div>
      {/* 화면뮤트 */}
      <div className='video-side-icon-wrap' onClick={setVideoMute}>
        {isVideoPublished ? (
          <BsCameraVideoFill className='video-side-icon'/>
        ) : (
          <BsCameraVideoOff className='video-side-icon'/>
        )}
      </div>
      {/* 소리뮤트 */}
      <div className='video-side-icon-wrap' onClick={setAudioMute}>
        {isAudioPublished ? (
          <BsMicFill className='video-side-icon'/>
        ) : (
          <BsMicMute className='video-side-icon'/>
        )}
      </div>
      {/* 화면공유 */}
      <div className='video-side-icon-wrap' onClick={handleScreenShare}>
        <BsWindowFullscreen className='video-side-icon'/>
      </div>
      {/* 쿠키 전체 음소거 */}
      <div className='video-side-icon-wrap' onClick={() => handleCookieeAudio(publisher)}>
        <BsVolumeMuteFill className='video-side-icon'/>
      </div>
    </div>
  );
}

export default CookyerVideoSideBar;