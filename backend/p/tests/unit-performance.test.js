const axios = require('axios');
const { makeGrpcServer } = require('../src/server-grpc');
const { makeApiServer } = require('../src/server-api');

describe('Servidor gRPC', () => {
  let grpcServer;
  let apiServer;

  beforeAll(async () => {
    grpcServer = makeGrpcServer();
    await grpcServer.start('50053');

    apiServer = makeApiServer();
    await apiServer.start(3000);
  });

  afterAll(async () => {
    await apiServer.close();
    grpcServer.server.forceShutdown();
  });

  describe('Tests Service A', () => {
    test('Tempo médio gRPC Buffer', (done) => {
      const start = Date.now();
      grpcServer.clients.clientA.ConsultarUsuario({ id: '123' }, (err) => {
        const tempo = Date.now() - start;
        console.log(`gRPC Buffer: ${tempo.toFixed(2)}ms`);
        expect(err).toBeNull();
        expect(tempo).toBeLessThan(500);
        done();
      });
    });

    test('Tempo médio REST + gRPC', async () => {
      const start = Date.now();
      await axios.get('http://localhost:3000/usuario/123');
      const tempo = Date.now() - start;
      console.log(`gRPC API: ${tempo.toFixed(2)}ms`);
      expect(tempo).toBeLessThan(500);
    });
  })

  describe('Tests Service B', () => {
    const valoresTeste = [1.5, 2.3, 4.7, 3.2];

    test('Tempo médio gRPC Buffer', (done) => {
      const start = Date.now();
      grpcServer.clients.clientB.CalcularEstatisticas({ valores: valoresTeste }, (err, resposta) => {
        const tempo = Date.now() - start;
        console.log(`gRPC Buffer: ${tempo.toFixed(2)}ms`);
        expect(err).toBeNull();
        expect(tempo).toBeLessThan(500);
        expect(resposta).toHaveProperty('media');
        expect(resposta).toHaveProperty('soma');
        done();
      });
    });

    test('Tempo médio REST + gRPC', async () => {
      const start = Date.now();
      const response = await axios.post(
        'http://localhost:3000/estatisticas',
        { valores: valoresTeste },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const tempo = Date.now() - start;
      console.log(`gRPC API: ${tempo.toFixed(2)}ms`);
      expect(tempo).toBeLessThan(500);
      expect(response.data).toHaveProperty('media');
      expect(response.data).toHaveProperty('soma');
    });
  })

});


