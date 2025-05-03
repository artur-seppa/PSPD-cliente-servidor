# backend/b/server_b.py
from concurrent import futures
import grpc
import service_pb2, service_pb2_grpc

class DemoServicerB(service_pb2_grpc.DemoServiceServicer):
    def ClientStreamSum(self, request_iterator, context):
        total = sum(req.count for req in request_iterator)
        return service_pb2.SumReply(sum=total)

    def BidiChat(self, request_iterator, context):
        for msg in request_iterator:
            print(f"[BidiChat] recebi de {msg.sender!r}: {msg.text!r}")
            reply = f"[{msg.sender} -> Server]: {msg.text[::-1]}"
            print(f"[BidiChat] vou enviar: {reply!r}")
            out = service_pb2.ChatMessage()
            out.sender = "Server"
            out.text = reply
            yield out

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=2))
    service_pb2_grpc.add_DemoServiceServicer_to_server(DemoServicerB(), server)
    server.add_insecure_port('[::]:50052')
    print("Servidor B rodando na porta 50052…")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
