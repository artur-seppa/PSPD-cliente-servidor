const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const makeApiServer = () => {
  // Carregar o arquivo .proto
  const PROTO_PATH = path.join(__dirname, '../proto/service.proto');
  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const proto = grpc.loadPackageDefinition(packageDefinition);

  // Configurar clientes gRPC
  const clients = {
    clientA: new proto.ServicoA('localhost:50051', grpc.credentials.createInsecure()),
    clientB: new proto.ServicoB('localhost:50052', grpc.credentials.createInsecure())
  };

  // Configurar Express
  const app = express();
  app.use(express.json());

  // Middleware CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  // Rotas
  app.get('/usuario/:id', (req, res) => {
    clients.clientA.ConsultarUsuario({ id: req.params.id }, (err, resposta) => {
      if (err) return res.status(500).json({ erro: err.details });
      res.json(resposta);
    });
  });

  app.post('/estatisticas', (req, res) => {
    clients.clientB.CalcularEstatisticas({ valores: req.body.valores }, (err, resposta) => {
      if (err) return res.status(500).json({ erro: err.details });
      res.json(resposta);
    });
  });

  let server;

  return {
    app,
    clients,
    start: (port = 3000) => {
      return new Promise((resolve) => {
        server = app.listen(port, () => {
          console.log(`Servidor REST rodando em http://localhost:${port}`);
          resolve(server);
        });
      });
    },
    close: () => {
      return new Promise((resolve, reject) => {
        if (server) {
          server.close((err) => {
            if (err) return reject(err);
            resolve();
          });
        } else {
          resolve();
        }
      });
    }
  };
};

module.exports = { makeApiServer };