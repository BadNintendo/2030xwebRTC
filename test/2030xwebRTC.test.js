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
