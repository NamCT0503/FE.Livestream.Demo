import { useState } from 'react'
import './App.css'
import NanostreamClound from './env.dev'
import LiveStream from './components/livestream/Livestream';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './auth/Login';
import ViewerComponent from './viewer/Viewer';
// import Livestream from './nano.stream/webcaster.config'

function App() {
  const streamid = NanostreamClound.StreamId;
  const stream_token = NanostreamClound.BintuToken;

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path='/creator' element={<LiveStream></LiveStream>}></Route>
        <Route path='/viewer' element={<ViewerComponent></ViewerComponent>}></Route>
      </Routes>
    </BrowserRouter>

    // <>
    //   <div className="App">
    //     <h1>Livestream Video</h1>
    //     <LiveStream />
    //   </div>
    // </>
  )
}

export default App
