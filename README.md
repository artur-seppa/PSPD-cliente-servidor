## Configuração de ambiente

### Passo a Passo para Módulos A e B
1. Instale o pacote para criar ambientes virtuais:

```
sudo apt install python3.12-venv  # Substitua 3.12 pela sua versão do Python (ex: 3.10)
```

2. Crie e ative um ambiente virtual no diretório do módulo A:

```
cd projeto-distribuido/backend/a

# Crie o ambiente virtual
python3 -m venv venv

# Ative o ambiente
source venv/bin/activate
```

3. Instale as dependências dentro do ambiente virtual:

```
pip install -r requirements.txt 
```

4. Gere o código gRPC:

```
python -m grpc_tools.protoc -I../p/proto --python_out=. --grpc_python_out=. ../p/proto/service.proto
```

5. Repita os passos para o módulo B:

```
cd ../b
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Passo a Passo para Módulo P

1. Configuração:

```
cd projeto-distribuido/backend/p

npm install
```


## Execução

Inicie o Serviço A (ConsultarUsuario):

```
cd a
source venv/bin/activate
python server_a.py
```

Inicie o Serviço B (CalcularEstatisticas):

```
cd ../b
source venv/bin/activate
python server_b.py
```

Inicie o Módulo P (Web):
```
cd ../p
node src/server.js
```

Acesse o <b>index.html</b> no navegador para usar a aplicação.