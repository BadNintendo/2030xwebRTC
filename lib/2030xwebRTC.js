#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');
const { EventEmitter } = require('events');

/**
 * Main function to execute node-pre-gyp install command
 * @param {boolean} exit - Determines whether to exit the process on failure
 */
const main = (exit) => {
  const args = ['install'];
  if (process.env.DEBUG) args.push('--debug');
  if (process.env.TARGET_ARCH) args.push(`--target_arch=${process.env.TARGET_ARCH}`);
  
  const { status } = spawnSync('node-pre-gyp', args, { shell: true, stdio: 'inherit' });
  if (status) {
    if (!exit) throw new Error(status);
    process.exit(1);
  }
};

if (require.main === module) {
  main(true);
}

/**
 * Module for handling native bindings
 * @returns {Object} Native bindings for WebRTC functionalities
 */
const nativeBinding = (() => {
  try {
    return require('../build/Debug/2030xwebRTC.node');
  } catch {
    return require('../build/Release/2030xwebRTC.node');
  }
})();

/**
 * Utility function for validating and sanitizing input
 * @param {string} input - The input to validate and sanitize
 * @returns {string} - The sanitized input
 * @throws {Error} - Throws error if input is not a string
 */
const validateAndSanitize = (input) => {
  if (typeof input !== 'string') {
    throw new Error('Invalid input type');
  }
  return input;
};

/**
 * Event Target class for handling custom events
 * @extends EventEmitter
 */
class RTCEventTarget extends EventEmitter {}

/**
 * RTCDataChannel class
 * @extends RTCEventTarget
 */
class RTCDataChannel extends RTCEventTarget {}

/**
 * RTCPeerConnection class
 * @extends RTCEventTarget
 */
class RTCPeerConnection extends RTCEventTarget {
  /**
   * @param {Object} config - The configuration for the peer connection
   */
  constructor(config) {
    super();
    this._pc = new nativeBinding.RTCPeerConnection(config);

    this._pc.ontrack = this._createEventHandler('track');
    this._pc.onicecandidate = this._createEventHandler('icecandidate');
    this._pc.onicecandidateerror = this._createIceCandidateErrorHandler();
    this._pc.onconnectionstatechange = this._createEventHandler('connectionstatechange');
    this._pc.onsignalingstatechange = this._createEventHandler('signalingstatechange');
    this._pc.oniceconnectionstatechange = this._createEventHandler('iceconnectionstatechange');
    this._pc.onicegatheringstatechange = this._createEventHandler('icegatheringstatechange');
    this._pc.onnegotiationneeded = this._createEventHandler('negotiationneeded');
    this._pc.ondatachannel = this._createEventHandler('datachannel');
  }

  /**
   * Creates an event handler for a specific event type
   * @param {string} eventType - The type of the event
   * @returns {Function} - The event handler function
   */
  _createEventHandler(eventType) {
    return (...args) => this.emit(eventType, ...args);
  }

  /**
   * Creates an event handler for ICE candidate errors
   * @returns {Function} - The ICE candidate error handler function
   */
  _createIceCandidateErrorHandler() {
    return (eventInitDict) => {
      const [address, port] = eventInitDict.hostCandidate.split(':');
      this.emit('icecandidateerror', { ...eventInitDict, address, port });
    };
  }

  /**
   * Creates an SDP offer for initiating a connection
   * @param {Object} options - Options for creating the offer
   * @returns {Promise<RTCSessionDescriptionInit>} - A promise that resolves with the created offer
   */
  createOffer = (options) => this._pc.createOffer(options);

  /**
   * Sets the local description for the peer connection
   * @param {RTCSessionDescriptionInit} description - The description to set
   * @returns {Promise<void>} - A promise that resolves when the description is set
   */
  setLocalDescription = (description) => this._pc.setLocalDescription(description);
}

/**
 * Event class for RTCDataChannel messages
 */
class RTCDataChannelMessageEvent {
  /**
   * @param {string} message - The message data
   */
  constructor(message) {
    this.data = message;
  }
}

/**
 * Error class for RTC-related errors
 * @extends Error
 */
class RTCError extends Error {
  /**
   * @param {number} code - The error code
   * @param {string} message - The error message
   */
  constructor(code, message) {
    super(message || RTCError.reasonName[code]);
    this.name = RTCError.reasonName[code];
  }

  static reasonName = [
    'NO_ERROR',
    'INVALID_CONSTRAINTS_TYPE',
    'INVALID_CANDIDATE_TYPE',
    'INVALID_STATE',
    'INVALID_SESSION_DESCRIPTION',
    'INCOMPATIBLE_SESSION_DESCRIPTION',
    'INCOMPATIBLE_CONSTRAINTS',
    'INTERNAL_ERROR'
  ];
}

/**
 * Error class for ICE candidate errors
 * @extends Error
 */
class RTCPeerConnectionIceErrorEvent extends Error {
  /**
   * @param {string} type - The type of the event
   * @param {Object} eventInitDict - The event initialization dictionary
   */
  constructor(type, eventInitDict) {
    super(eventInitDict.errorText);
    Object.assign(this, eventInitDict, { type });
  }
}

/**
 * Media Devices interface
 */
const mediaDevices = {
  /**
   * Gets display media with the specified constraints
   * @param {Object} constraints - Constraints for getting display media
   * @returns {Promise<MediaStream>} - A promise that resolves with the media stream
   */
  getDisplayMedia: (constraints) => {
    validateAndSanitize(constraints);
    return nativeBinding.getDisplayMedia(constraints);
  },
  /**
   * Gets user media with the specified constraints
   * @param {Object} constraints - Constraints for getting user media
   * @returns {Promise<MediaStream>} - A promise that resolves with the media stream
   */
  getUserMedia: (constraints) => {
    validateAndSanitize(constraints);
    return nativeBinding.getUserMedia(constraints);
  },
  /**
   * Enumerates available media devices
   * @throws {Error} - Not yet implemented
   */
  enumerateDevices: () => {
    throw new Error('Not yet implemented; file a feature request against node-webrtc');
  },
  /**
   * Gets supported constraints for media devices
   * @throws {Error} - Not yet implemented
   */
  getSupportedConstraints: () => {
    throw new Error('Not yet implemented; file a feature request against node-webrtc');
  }
};

/**
 * Nonstandard interfaces for WebRTC functionalities
 */
const nonstandard = {
  i420ToRgba: nativeBinding.i420ToRgba,
  RTCAudioSink: nativeBinding.RTCAudioSink,
  RTCAudioSource: nativeBinding.RTCAudioSource,
  RTCVideoSink: nativeBinding.RTCVideoSink,
  RTCVideoSource: nativeBinding.RTCVideoSource,
  rgbaToI420: nativeBinding.rgbaToI420
};

// Exported Module
module.exports = {
  RTCDataChannel,
  RTCDataChannelEvent: RTCEventTarget,
  RTCIceCandidate: nativeBinding.RTCIceCandidate,
  RTCPeerConnection,
  RTCPeerConnectionIceEvent: RTCEventTarget,
  RTCRtpReceiver: RTCEventTarget,
  RTCRtpSender: RTCEventTarget,
  RTCRtpTransceiver: RTCEventTarget,
  RTCSctpTransport: RTCEventTarget,
  RTCSessionDescription: RTCEventTarget,
  getUserMedia: mediaDevices.getUserMedia,
  mediaDevices,
  nonstandard,
  RTCDataChannelMessageEvent,
  RTCError,
  RTCPeerConnectionIceErrorEvent
};

// Example Usage
const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = require('./2030xwebRTC');

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
