const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const makeGrpcServer = () => {
  // Configuração do gRPC
  const PROTO_PATH = path.join(__dirname, '../proto/service.proto');
  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const proto = grpc.loadPackageDefinition(packageDefinition);

  // Cria os clients
  const clientA = new proto.ServicoA('localhost:50051', grpc.credentials.createInsecure());
  const clientB = new proto.ServicoB('localhost:50052', grpc.credentials.createInsecure());

  // Cria o servidor
  const server = new grpc.Server();

  // Adiciona serviços
  server.addService(proto.ServicoA.service, {
    ConsultarUsuario: (call, callback) => {
      clientA.ConsultarUsuario(call.request, (err, resposta) => {
        callback(err, resposta);
      });
    }
  });

  server.addService(proto.ServicoB.service, {
    CalcularEstatisticas: (call, callback) => {
      clientB.CalcularEstatisticas(call.request, (err, resposta) => {
        callback(err, resposta);
      });
    }
  });

  return {
    server,
    start: async (port = '50053') => {
      return new Promise((resolve, reject) => {
        server.bindAsync(
          `0.0.0.0:${port}`,
          grpc.ServerCredentials.createInsecure(),
          (err, port) => {
            if (err) return reject(err);
            server.start();
            console.log(`Servidor gRPC rodando na porta ${port}`);
            resolve(server);
          }
        );
      });
    },
    clients: { clientA, clientB },
    proto
  };
};

module.exports = { makeGrpcServer };