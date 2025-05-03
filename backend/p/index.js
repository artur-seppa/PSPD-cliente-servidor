const { makeGrpcServer } = require('./src/server-grpc');
const { makeApiServer } = require('./src/server-api');

async function main() {
  try {
    const grpcServer = makeGrpcServer();
    await grpcServer.start('50053');

    const apiServer = makeApiServer();
    await apiServer.start('3000');
    
    console.log('Todos os servidores iniciados com sucesso');
  } catch (error) {
    console.error('Falha ao iniciar servidores:', error);
    process.exit(1);
  }
}

main();