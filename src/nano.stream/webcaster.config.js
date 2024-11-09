// import * as nanostream from "../nanostream/webcaster-main/dist/nanostream.webcaster";
// import * as nanostream from "../nanostream/webcaster-main/dist/nanostream.webcaster.js";
import NanostreamClound from "../env.dev";

const LivestreamConfig = () => {
    const { Webcaster, HelperUtils, DeviceUtils } = window.WebcasterApiV6;

    // Config for the NanoWebcaster library
    let initConfig = {
        inputCfg: {
            // Either you create a MediaStream and pass a reference here (see in next section),
            // or let the client create one for you by omitting the property:
            // mediaStream: null,
            mediaStreamCfg: {
                maxFramerate: 30,
                resolution: [1280, 720],
                // audioVideoOnly: false,
                audioConstraints: {
                    autoGainControl: true,
                    channelCount: 2,
                    echoCancellation: true,
                    noiseSuppression: true
                },
            },
            broadcastCfg: {
                transcodeAudioBitrateBps: HelperUtils.kbps(128),
                maxAudioBitrateBps: HelperUtils.kbps(128),
                maxVideoBitrateBps: HelperUtils.kbps(2000),
                maxEncodingFramerate: 30,
            }
        },
        ingestUrl: 'rtmp://bintu-stream.nanocosmos.de:1935/live',
        streamName: NanostreamClound.RTMP_Streamname,
        serverUrl: 'https://bintu-webrtc.nanocosmos.de/p/webrtc',
        previewVideoElId: 'preview',
    };
    console.log('webapiv6: ', window.WebcasterApiV6);

    return initConfig;
}

export default LivestreamConfig;