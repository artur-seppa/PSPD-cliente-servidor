# backend/a/server_a.py

import time
from concurrent import futures
import grpc
import service_pb2, service_pb2_grpc

class DemoServicerA(service_pb2_grpc.DemoServiceServicer):
    def UnaryEcho(self, request, context):
        print(f"[LOG] UnaryEcho chamado com: {request.message}")   # opcional, para ver cada chamada
        return service_pb2.EchoReply(message="Echo: " + request.message)

    def ServerStreamNums(self, request, context):
        print(f"[LOG] ServerStreamNums chamado com count={request.count}")
        for i in range(1, request.count + 1):
            yield service_pb2.NumReply(number=i)
            time.sleep(0.1)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=2))
    service_pb2_grpc.add_DemoServiceServicer_to_server(DemoServicerA(), server)
    server.add_insecure_port('[::]:50051')
    print("📢 Servidor A rodando na porta 50051…")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
