// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var service_pb = require('./service_pb.js');

function serialize_demo_ChatMessage(arg) {
  if (!(arg instanceof service_pb.ChatMessage)) {
    throw new Error('Expected argument of type demo.ChatMessage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_demo_ChatMessage(buffer_arg) {
  return service_pb.ChatMessage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_demo_EchoReply(arg) {
  if (!(arg instanceof service_pb.EchoReply)) {
    throw new Error('Expected argument of type demo.EchoReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_demo_EchoReply(buffer_arg) {
  return service_pb.EchoReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_demo_EchoRequest(arg) {
  if (!(arg instanceof service_pb.EchoRequest)) {
    throw new Error('Expected argument of type demo.EchoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_demo_EchoRequest(buffer_arg) {
  return service_pb.EchoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_demo_NumReply(arg) {
  if (!(arg instanceof service_pb.NumReply)) {
    throw new Error('Expected argument of type demo.NumReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_demo_NumReply(buffer_arg) {
  return service_pb.NumReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_demo_NumRequest(arg) {
  if (!(arg instanceof service_pb.NumRequest)) {
    throw new Error('Expected argument of type demo.NumRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_demo_NumRequest(buffer_arg) {
  return service_pb.NumRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_demo_SumReply(arg) {
  if (!(arg instanceof service_pb.SumReply)) {
    throw new Error('Expected argument of type demo.SumReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_demo_SumReply(buffer_arg) {
  return service_pb.SumReply.deserializeBinary(new Uint8Array(buffer_arg));
}


// Definição do serviço com os 4 tipos de RPC
var DemoServiceService = exports.DemoServiceService = {
  // 1. Unary RPC
unaryEcho: {
    path: '/demo.DemoService/UnaryEcho',
    requestStream: false,
    responseStream: false,
    requestType: service_pb.EchoRequest,
    responseType: service_pb.EchoReply,
    requestSerialize: serialize_demo_EchoRequest,
    requestDeserialize: deserialize_demo_EchoRequest,
    responseSerialize: serialize_demo_EchoReply,
    responseDeserialize: deserialize_demo_EchoReply,
  },
  // 2. Server-streaming RPC
serverStreamNums: {
    path: '/demo.DemoService/ServerStreamNums',
    requestStream: false,
    responseStream: true,
    requestType: service_pb.NumRequest,
    responseType: service_pb.NumReply,
    requestSerialize: serialize_demo_NumRequest,
    requestDeserialize: deserialize_demo_NumRequest,
    responseSerialize: serialize_demo_NumReply,
    responseDeserialize: deserialize_demo_NumReply,
  },
  // 3. Client-streaming RPC
clientStreamSum: {
    path: '/demo.DemoService/ClientStreamSum',
    requestStream: true,
    responseStream: false,
    requestType: service_pb.NumRequest,
    responseType: service_pb.SumReply,
    requestSerialize: serialize_demo_NumRequest,
    requestDeserialize: deserialize_demo_NumRequest,
    responseSerialize: serialize_demo_SumReply,
    responseDeserialize: deserialize_demo_SumReply,
  },
  // 4. Bidirectional-streaming RPC
bidiChat: {
    path: '/demo.DemoService/BidiChat',
    requestStream: true,
    responseStream: true,
    requestType: service_pb.ChatMessage,
    responseType: service_pb.ChatMessage,
    requestSerialize: serialize_demo_ChatMessage,
    requestDeserialize: deserialize_demo_ChatMessage,
    responseSerialize: serialize_demo_ChatMessage,
    responseDeserialize: deserialize_demo_ChatMessage,
  },
};

exports.DemoServiceClient = grpc.makeGenericClientConstructor(DemoServiceService, 'DemoService');
