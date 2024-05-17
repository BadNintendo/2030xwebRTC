# 2030xwebRTC

![npm](https://img.shields.io/npm/v/2030xwebRTC)
![license](https://img.shields.io/github/license/BadNintendo/2030xwebRTC)

2030xwebRTC is a powerful and versatile npm package designed to handle WebRTC (Web Real-Time Communication) functionalities for front-end to back-end communication. This package provides an extensive set of features to enable peer-to-peer connections, data channels, media streaming, and more. Developed by BadNintendo, 2030xwebRTC aims to simplify the integration and usage of WebRTC in your projects.

## Installation

To install the 2030xwebRTC package, use the following command:

```bash
npm install 2030xwebRTC
```

## Usage

### Basic Example

Here is a basic example demonstrating how to create a peer connection, generate an SDP offer, and handle ICE candidates:

```javascript
const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = require('2030xwebRTC');

const pc = new RTCPeerConnection();

pc.on('icecandidate', ({ candidate }) => {
  if (candidate) {
    console.log('New ICE candidate: ', candidate);
  } else {
    console.log('All ICE candidates have been sent');
  }
});

const offerOptions = { offerToReceiveAudio: true, offerToReceiveVideo: true };

pc.createOffer(offerOptions)
  .then((offer) => pc.setLocalDescription(offer))
  .then(() => console.log('Local description set:', pc.localDescription))
  .catch((error) => console.error('Failed to create offer:', error));
```

### Advanced Features

2030xwebRTC provides advanced functionalities, including handling media devices, nonstandard WebRTC interfaces, and custom error handling. Below are some examples:

#### Handling Media Devices

```javascript
const { mediaDevices } = require('2030xwebRTC');

// Get user media with specified constraints
const constraints = { video: true, audio: true };

mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    console.log('Got media stream:', stream);
  })
  .catch((error) => {
    console.error('Failed to get user media:', error);
  });
```

#### Using Nonstandard Interfaces

```javascript
const { nonstandard } = require('2030xwebRTC');

const videoSource = new nonstandard.RTCVideoSource();
const videoSink = new nonstandard.RTCVideoSink(videoSource);

// Example: Convert I420 to RGBA
const i420Frame = getI420Frame(); // Assuming this function provides an I420 frame
const rgbaFrame = nonstandard.i420ToRgba(i420Frame);

console.log('Converted RGBA frame:', rgbaFrame);
```

### Error Handling

2030xwebRTC includes custom error classes for handling RTC-related errors:

```javascript
const { RTCError } = require('2030xwebRTC');

try {
  // Some operation that may throw an error
  throw new RTCError(1, 'Invalid constraints type');
} catch (error) {
  console.error('RTC Error:', error);
}
```

## API Documentation

### Exports

- **RTCDataChannel**
  - Corresponds to the original RTCDataChannel.
  - Handles data channels for peer-to-peer communication.

- **RTCDataChannelEvent**
  - Corresponds to the original RTCDataChannelEvent.
  - Handles events related to data channels.

- **RTCIceCandidate**
  - Corresponds to the original RTCIceCandidate.
  - Represents ICE candidates used in the connection process.

- **RTCPeerConnection**
  - Corresponds to the original RTCPeerConnection.
  - Manages the connection between peers.

- **RTCPeerConnectionIceEvent**
  - Corresponds to the original RTCPeerConnectionIceEvent.
  - Handles ICE events during the connection process.

- **RTCRtpReceiver**
  - Corresponds to the original RTCRtpReceiver.
  - Manages the receipt of RTP media.

- **RTCRtpSender**
  - Corresponds to the original RTCRtpSender.
  - Manages the sending of RTP media.

- **RTCRtpTransceiver**
  - Corresponds to the original RTCRtpTransceiver.
  - Manages both sending and receiving of RTP media.

- **RTCSctpTransport**
  - Corresponds to the original RTCSctpTransport.
  - Manages SCTP transport for data channels.

- **RTCSessionDescription**
  - Corresponds to the original RTCSessionDescription.
  - Represents the configuration of a connection.

- **getUserMedia**
  - Corresponds to the original getUserMedia.
  - Allows access to media devices such as cameras and microphones.

- **mediaDevices**
  - Corresponds to the original mediaDevices.
  - Provides access to media device functionalities.

- **nonstandard**
  - Corresponds to the original nonstandard.
  - Includes nonstandard WebRTC functionalities like `i420ToRgba`, `RTCAudioSink`, `RTCAudioSource`, `RTCVideoSink`, `RTCVideoSource`, and `rgbaToI420`.

- **RTCDataChannelMessageEvent**
  - New class for handling RTCDataChannel messages.
  - Represents a message event in an RTCDataChannel.

- **RTCError**
  - New class for handling RTC-related errors.
  - Custom error class for RTC-related operations.

- **RTCPeerConnectionIceErrorEvent**
  - New class for handling ICE candidate errors.
  - Represents an ICE candidate error event.

## Testing

To test the functionality of 2030xwebRTC, you can use the provided example in the usage section. Here's a simple script to verify the installation and basic operations:

```bash
node test/2030xwebRTC.test.js
```

### Example Test Script: test/2030xwebRTC.test.js

```javascript
const { RTCPeerConnection } = require('2030xwebRTC');

const pc = new RTCPeerConnection();

pc.on('icecandidate', ({ candidate }) => {
  if (candidate) {
    console.log('New ICE candidate: ', candidate);
  } else {
    console.log('All ICE candidates have been sent');
  }
});

const offerOptions = { offerToReceiveAudio: true, offerToReceiveVideo: true };

pc.createOffer(offerOptions)
  .then((offer) => pc.setLocalDescription(offer))
  .then(() => console.log('Local description set:', pc.localDescription))
  .catch((error) => console.error('Failed to create offer:', error));
```

## Conclusion

2030xwebRTC is a comprehensive WebRTC package designed to handle a wide range of WebRTC functionalities, from peer connections to media handling. With its robust API and extensive features, 2030xwebRTC simplifies the process of integrating WebRTC into your projects.

For more information, visit the [2030xwebRTC GitHub repository](https://github.com/BadNintendo).
