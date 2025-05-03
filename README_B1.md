# B.1 – Testes e Documentação do gRPC

Este README descreve como gerar os stubs, executar os servidores de exemplo e rodar os testes automatizados para a seção B.1 do trabalho, cobrindo os quatro tipos de RPC do gRPC:

- **Unary RPC**
- **Server-Streaming RPC**
- **Client-Streaming RPC**
- **Bidirectional-Streaming RPC**

---

## 1. Pré-requisitos

- **Python 3.x** (recomendado 3.8 ou superior)
- **Node.js** (recomendado v14+)
- **pip**, **npm**
- **grpcio**, **grpcio-tools** e **pytest** (via pip)
- **grpc-tools** (via npm)

---

## 2. Estrutura de Diretórios

```
backend/
├─ proto/                # Definição do service.proto
│   └─ service.proto
├─ a/                    # Servidor A (Unary + Server-Streaming)
│   ├─ __init__.py
│   ├─ service_pb2.py
│   ├─ service_pb2_grpc.py
│   └─ server_a.py
├─ b/                    # Servidor B (Client-Streaming + Bidirectional)
│   ├─ __init__.py
│   ├─ service_pb2.py
│   ├─ service_pb2_grpc.py
│   └─ server_b.py
├─ p/                    # Cliente Node.js (stubs JavaScript)
│   ├─ service_pb.js
│   └─ service_grpc_pb.js
├─ tests/                # Testes automatizados pytest
│   ├─ test_unary.py
│   ├─ test_server_stream.py
│   ├─ test_client_stream.py
│   └─ test_bidi.py
└─ venv/                 # Virtualenv Python (não versionar)
```

---

## 3. Geração dos Stubs

### 3.1. Stubs Python (Servidores A e B)

1. Ative o virtualenv:
   ```bash
   cd backend
   source venv/bin/activate
   ```
2. Gere os stubs para `a/`:
   ```bash
   python -m grpc_tools.protoc      -I=./proto      --python_out=./a      --grpc_python_out=./a      ./proto/service.proto
   ```
3. Gere os stubs para `b/`:
   ```bash
   python -m grpc_tools.protoc      -I=./proto      --python_out=./b      --grpc_python_out=./b      ./proto/service.proto
   ```

### 3.2. Stubs JavaScript (Cliente P)

1. No mesmo diretório `backend`, instale o grpc-tools:
   ```bash
   npm install --save-dev grpc-tools
   ```
2. Gere os stubs em `p/`:
   ```bash
   npx grpc_tools_node_protoc      --proto_path=./proto      --js_out=import_style=commonjs:./p      --grpc_out=grpc_js:./p      ./proto/service.proto
   ```

---

## 4. Executando os Servidores

Abra **duas** abas/terminais diferentes:

### Terminal 1: Servidor A
```bash
cd backend/a
source ../venv/bin/activate
python server_a.py
# Saída esperada: "📢 Servidor A rodando na porta 50051…"
```

### Terminal 2: Servidor B
```bash
cd backend/b
source ../venv/bin/activate
python server_b.py
# Saída esperada: "Servidor B rodando na porta 50052…"
```

---

## 5. Rodando os Testes Automatizados

Com **ambos** os servidores em execução e o virtualenv ativado em um **novo** terminal:

```bash
cd backend
source venv/bin/activate
pytest tests/
```

Você deverá ver algo como:
```
collected 4 items

tests/test_unary.py .
tests/test_server_stream.py .
tests/test_client_stream.py .
tests/test_bidi.py .

4 passed in 0.XXs
```

---

## 6. Conclusão

Nesta seção B.1, você validou na prática os quatro padrões de comunicação do gRPC:

- **Unária**: chamada simples request–response
- **Server-streaming**: servidor envia múltiplas respostas
- **Client-streaming**: cliente envia múltiplas mensagens e recebe única resposta
- **Bidirecional**: troca de fluxo contínuo de mensagens

Use este README como referência rápida para reproduzir o setup e validar os exemplos em qualquer máquina.
