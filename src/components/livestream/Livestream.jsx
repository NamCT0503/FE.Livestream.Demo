import React, { useEffect, useRef, useState } from 'react';
import NanostreamClound, { API_NanoStream_Cloud, API_ServerLiveStream, BASE_API_URL } from "../../env.dev";
import LivestreamConfig from '../../nano.stream/webcaster.config';
import { sendReq } from '../../auth/Login';

const LiveStream = () => {
  let client;
  const { Webcaster, HelperUtils, DeviceUtils } = window.WebcasterApiV6;
  const config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };

  const [stream, setStream] = useState();
  const [streamName, setStreamName] = useState('');
  const [streamid, setStreamid] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isCamereOn, setCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const videoRef = useRef(null);
  const peerConnection = new RTCPeerConnection(config);

  useEffect(() => {
    console.log('webcaster: ', Webcaster)
    client = window.client = new Webcaster(LivestreamConfig());
    client.setup().then(() => {
        console.log('Webcaster.setup done');
    }).catch(() => console.log('Webcaster.setup error!'));
    // client.setMuted({
    //   audio: true,
    //   video: false
    // });
  }, []);

  useEffect(() => {
    const startVideoStream = async () => {
      try {
        const getVideoLocal = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        // stream = getVideoLocal
        
        if (videoRef.current) {
          videoRef.current.srcObject = getVideoLocal;
        }
        setStream(getVideoLocal);
      } catch (error) {
        console.error("Lỗi khi truy cập camera hoặc mic: ", error);
      }
    };

    startVideoStream()
  }, []);  

  async function initLivestream() {
    // const getVideoLocal = await navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true
    // });

    try {
      const res = await fetch(API_NanoStream_Cloud.CREATE_STREAM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-BINTU-APIKEY': NanostreamClound.API_Key
        }
      });
  
      if(res.ok){
        const data = await res.json();
        alert('Khởi tạo livestream thành công!');
        const streamname = data?.ingest?.rtmp?.streamname;
        const idstream = data?.id;
        setStreamid(idstream);
        return setStreamName(streamname);
      }
      return alert('Khởi tạo livestream thất bại!');
    } catch (error) {
      console.log('Init Livestream Error: ', error);
    }
  }

  async function startLiveStream() {
    try {
      if(!streamName || streamName==='') return alert('Stream chưa được khởi tạo!');
      const sdpOffer = await createSDPOffer();
      const res = await fetch(API_NanoStream_Cloud.STARTSTREAM.replaceAll(':streamName', streamName), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: `${sdpOffer}`
      });
    
      if(res.ok){
        const data = await res.text();
    
        await peerConnection.setRemoteDescription(new RTCSessionDescription({
          type: 'answer',
          sdp: data
        }));

        const url_saveStreamkey = `${BASE_API_URL}${API_ServerLiveStream.CREATE_STREAM}`;
        const saveStreamKey = await sendReq(url_saveStreamkey, {
          method: 'POST',
          body: JSON.stringify({
            stream_url: `${API_NanoStream_Cloud.TYPE_STREAMNAME}${streamName}`,
            title: 'Wellcome to my stream'
          })
        })
        if(saveStreamKey.ok) return alert('Livestream đã bắt đầu!');
      }
      return alert('Lỗi trong quá trình bắt đầu livestream! Thử lại sau!');
    } catch (error) {
      console.log('Start Livestream Error: ', error);
    }
  }

  async function createSDPOffer() {
    if(!stream) return alert('Stream chưa được khởi tạo!')
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });

    // Tạo SDP offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
  
    // Lấy SDP offer dưới dạng chuỗi
    return offer.sdp;
  }

  const handleClickBtn = () => {
    startLiveStream();
  }

  const handleClickInitStream = () => {
    initLivestream();
  }

  // Bật/tắt camera/mic
  const toggleCamera = (isCamera) => {
    console.log('is cam: ', isCamera)
    if(isCamera===true){
      if (stream) {
        const videoTracks = stream.getVideoTracks();
        console.log('videoTracks: ', videoTracks)
        videoTracks.forEach(track => {
          track.enabled = !track.enabled;
        });
        
        setCameraOn(cam => cam===true? false: true);
      } else console.log('no stream: ', stream)
    }

    if(isCamera===false){
      if (stream) {
        const audioTracks = stream.getAudioTracks();
        console.log('auiotracks: ', audioTracks)
        audioTracks.forEach(track => {
          track.enabled = !track.enabled;
        });
        
        setIsMicOn(mic => mic===true? false: true);
      } else console.log('no stream: ', stream)
    }
  };

  async function stopLivestream(idstream) {
    try {
      if(!streamid || streamid==='') return alert('Livestream chưa được khởi tạo!');
      const url = API_NanoStream_Cloud.STOP_STREAM.replace(':id', streamid);
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-BINTU-APIKEY': NanostreamClound.API_Key
        }
      })
      
      if(res.ok) {
        setStreamName('');
        setStreamid('');
        return alert('Đã dừng livestream!');
      }
      return alert('Lỗi trong quá trình dừng livestream!');
    } catch (error) {
      console.log('Stop Livestream Error: ', error);
    }
  }

  return(
    <>
    <h1>Phát livestream</h1>
    {/* <iframe src='https://demo.nanocosmos.de/nanoplayer/embed/1.3.3/nanoplayer.html?group.id=452d1ddc-4d4b-41ea-bd72-cf4eed6801d1' autoPlay muted />; */}
    <video ref={videoRef} width={1200} height={500} autoPlay playsInline />
    {/* https://demo.nanocosmos.de/nanoplayer/embed/1.3.3/nanoplayer.html?entry.rtmp.streamname=DSW0M-ujmKj */}

    <button onClick={handleClickInitStream}>Khởi tạo livestream</button>
    <button onClick={handleClickBtn}>Bắt đầu livestream</button>
    <button onClick={() => stopLivestream()}>Dừng livestream</button>
    <button onClick={() => toggleCamera(false)}>{isMicOn? 'Tắt': 'Bật'} Mic</button>
    <button onClick={() => toggleCamera(true)}>{isCamereOn? 'Tắt': 'Bật'} Camera</button> <br /> <br />
    {/* <iframe src={`https://demo.nanocosmos.de/nanoplayer/embed/1.3.3/nanoplayer.html?entry.rtmp.streamname=${streamName}`} autoPlay muted />; */}
    </>
  )
}

export default LiveStream;