// Exemplo de servidor gRPC puro que chama dois serviços diferentes
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../proto/service.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition);

const clientA = new proto.ServicoA('localhost:50051', grpc.credentials.createInsecure());
const clientB = new proto.ServicoB('localhost:50052', grpc.credentials.createInsecure());

const servidor = new grpc.Server();

servidor.addService(proto.ServicoA.service, {
    ConsultarUsuario: (call, callback) => {
        clientA.ConsultarUsuario(call.request, callback);
    }
});

servidor.addService(proto.ServicoB.service, {
    CalcularEstatisticas: (call, callback) => {
        clientB.CalcularEstatisticas(call.request, callback);
    }
});

servidor.bindAsync(
    '127.0.0.1:50053',
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('Erro ao iniciar o servidor:', err);
            return;
        }
        console.log('Servidor gRPC orquestrador rodando em 127.0.0.1:50053');
    }
);

