import grpc
from a import service_pb2, service_pb2_grpc

def test_server_stream_nums():
    channel = grpc.insecure_channel("localhost:50051")
    stub    = service_pb2_grpc.DemoServiceStub(channel)
    req     = service_pb2.NumRequest(count=4)
    nums    = [m.number for m in stub.ServerStreamNums(req)]
    assert nums == [1, 2, 3, 4]
