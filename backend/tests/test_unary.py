import grpc
from a import service_pb2, service_pb2_grpc

def test_unary_echo():
    channel = grpc.insecure_channel("localhost:50051")
    stub    = service_pb2_grpc.DemoServiceStub(channel)
    resp    = stub.UnaryEcho(service_pb2.EchoRequest(message="pytest"))
    assert resp.message == "Echo: pytest"
