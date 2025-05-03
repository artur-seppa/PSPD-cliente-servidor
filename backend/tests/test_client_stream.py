import grpc
from b import service_pb2, service_pb2_grpc

def test_client_stream_sum():
    channel = grpc.insecure_channel("localhost:50052")
    stub    = service_pb2_grpc.DemoServiceStub(channel)
    nums    = [service_pb2.NumRequest(count=i) for i in (7,8,9)]
    resp    = stub.ClientStreamSum(iter(nums))
    assert resp.sum == 24
