import grpc
from concurrent import futures
import service_pb2
import service_pb2_grpc

class ServicoB(service_pb2_grpc.ServicoBServicer):
    def CalcularEstatisticas(self, request, context):
        valores = request.valores
        if not valores:
            return service_pb2.RespostaEstatisticas(media=0, maximo=0)
        media = sum(valores) / len(valores)
        maximo = max(valores)
        return service_pb2.RespostaEstatisticas(media=media, maximo=maximo)

def servir():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    service_pb2_grpc.add_ServicoBServicer_to_server(ServicoB(), server)
    server.add_insecure_port('[::]:50052')
    server.start()
    print("Servidor B (Python) rodando na porta 50052")
    server.wait_for_termination()

if __name__ == '__main__':
    servir()