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

  // Função para medir o tempo de uma chamada gRPC
  async function medirTempoGrpc(tipo) {
    if (tipo === 'ServiceB') {
      const start = Date.now();
      await new Promise((resolve) => {
        grpcServer.clients.clientB.CalcularEstatisticas({ valores: [1.5, 2.3] }, () => resolve());
      });
      return Date.now() - start;
    } else if (tipo === 'ServiceA') {
      const start = Date.now();
      await new Promise((resolve) => {
        grpcServer.clients.clientA.ConsultarUsuario({ id: '123' }, () => resolve());
      });
      return Date.now() - start;
    }
  }

  // Função para medir o tempo de uma chamada REST -> gRPC
  async function medirTempoRest(tipo) {
    if (tipo === 'ServiceB') {
      const start = Date.now();
      await axios.post('http://localhost:3000/estatisticas', { valores: [1.5, 2.3] });
      return Date.now() - start;
    } else if (tipo === 'ServiceA') {
      const start = Date.now();
      await axios.get('http://localhost:3000/usuario/123');
      return Date.now() - start;
    }
  }

  describe('Tests Service A', () => {
    test('Comparação gRPC vs REST', async () => {
      const resultados = {
        gRPC_ServiceA: [],
        REST_ServiceA: []
      };
  
      for (let i = 0; i < 200; i++) {
        resultados.gRPC_ServiceA.push(await medirTempoGrpc('ServiceA'));
        resultados.REST_ServiceA.push(await medirTempoRest('ServiceA'));
      }
  
      const somaGrpc_ServiceA = resultados.gRPC_ServiceA.reduce((a, b) => a + b, 0);
      const somaRest_ServiceA = resultados.REST_ServiceA.reduce((a, b) => a + b, 0);
  
      const mediaGrpc_ServiceA = somaGrpc_ServiceA / resultados.gRPC_ServiceA.length;
      const mediaRest_ServiceA = somaRest_ServiceA / resultados.REST_ServiceA.length;
  
      console.table([
        {
          'Tipo': 'gRPC Puro -> Service A',
          'Tempo Médio (ms)': mediaGrpc_ServiceA.toFixed(2),
          'Tempo Total (ms)': somaGrpc_ServiceA.toFixed(2),
          'Requisições': resultados.gRPC_ServiceA.length
        },
        {
          'Tipo': 'REST gRPC -> Service A',
          'Tempo Médio (ms)': mediaRest_ServiceA.toFixed(2),
          'Tempo Total (ms)': somaRest_ServiceA.toFixed(2),
          'Requisições': resultados.REST_ServiceA.length
        }
      ]);
    }, 30000);
  });

  describe('Tests Service B', () => {
    test('Comparação gRPC vs REST', async () => {
      const resultados = {
        gRPC_ServiceB: [],
        REST_ServiceB: []
      };
  
      for (let i = 0; i < 200; i++) {
        resultados.gRPC_ServiceB.push(await medirTempoGrpc('ServiceB'));
        resultados.REST_ServiceB.push(await medirTempoRest('ServiceB'));
      }
  
      const somaGrpc_ServiceB = resultados.gRPC_ServiceB.reduce((a, b) => a + b, 0);
      const somaRest_ServiceB = resultados.REST_ServiceB.reduce((a, b) => a + b, 0);
  
      const mediaGrpc_ServiceB = somaGrpc_ServiceB / resultados.gRPC_ServiceB.length;
      const mediaRest_ServiceB = somaRest_ServiceB / resultados.REST_ServiceB.length;
  
      console.table([
        {
          'Tipo': 'gRPC Puro -> Service B',
          'Tempo Médio (ms)': mediaGrpc_ServiceB.toFixed(2),
          'Tempo Total (ms)': somaGrpc_ServiceB.toFixed(2),
          'Requisições': resultados.gRPC_ServiceB.length
        },
        {
          'Tipo': 'REST gRPC -> Service B',
          'Tempo Médio (ms)': mediaRest_ServiceB.toFixed(2),
          'Tempo Total (ms)': somaRest_ServiceB.toFixed(2),
          'Requisições': resultados.REST_ServiceB.length
        }
      ]);
    }, 30000);
  });

});



