const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Carregar o arquivo .proto
const PROTO_PATH = path.join(__dirname, '../proto/service.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition);

// Configurar clientes gRPC
const clientA = new proto.ServicoA('localhost:50051', grpc.credentials.createInsecure());
const clientB = new proto.ServicoB('localhost:50052', grpc.credentials.createInsecure());

// Configurar Express
const app = express();
app.use(express.json());

// Endpoint REST
app.get('/usuario/:id', (req, res) => {
  clientA.ConsultarUsuario({ id: req.params.id }, (err, resposta) => {
    if (err) return res.status(500).json({ erro: err.details });
    res.json(resposta);
  });
});

app.post('/estatisticas', (req, res) => {
  clientB.CalcularEstatisticas({ valores: req.body.valores }, (err, resposta) => {
    if (err) return res.status(500).json({ erro: err.details });
    res.json(resposta);
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor P (Node.js) rodando em http://localhost:3000');
});