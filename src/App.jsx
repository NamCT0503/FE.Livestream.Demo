import { useState } from 'react'
import './App.css'
import NanostreamClound from './env.dev'
import LiveStream from './components/livestream/Livestream';
// import Livestream from './nano.stream/webcaster.config'

function App() {
  const streamid = NanostreamClound.StreamId;
  const stream_token = NanostreamClound.BintuToken;

  return (
    <>
      <div className="App">
        <h1>Livestream Video</h1>
        <LiveStream streamId={streamid} streamToken={stream_token} />
      </div>

      {/* <iframe 
        frameborder="0" 
        allowfullscreen 
        width="1280" 
        height="720" 
        src="https://demo.nanocosmos.de/nanoplayer/embed/1.3.3/nanoplayer.html?group.id=452d1ddc-4d4b-41ea-bd72-cf4eed6801d1&options.adaption.rule=deviationOfMean2&startIndex=0&playback.latencyControlMode=balancedadaptive">
      </iframe> */}
    </>
  )
}

export default App
