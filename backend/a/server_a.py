import grpc
from concurrent import futures
import service_pb2
import service_pb2_grpc

class ServicoA(service_pb2_grpc.ServicoAServicer):
    def ConsultarUsuario(self, request, context):
        usuarios = {
            "1": {"nome": "Alice", "email": "alice@exemplo.com"},
            "2": {"nome": "Bob", "email": "bob@exemplo.com"}
        }
        usuario = usuarios.get(request.id, {"nome": "Desconhecido", "email": ""})
        return service_pb2.RespostaUsuario(nome=usuario["nome"], email=usuario["email"])

def servir():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    service_pb2_grpc.add_ServicoAServicer_to_server(ServicoA(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Servidor A (Python) rodando na porta 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    servir()