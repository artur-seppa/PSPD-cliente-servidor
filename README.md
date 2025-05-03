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

Inicie o Módulo P com api Web e grpc buffer integrados:
```
cd ../p
node index.js
```

Acesse o <b>index.html</b> no navegador para usar a aplicação.

## Testes

Para exercer a execução dos testes de performace dos dois tipos de chamadas, basta executas no CLI:

```
cd backend/p
npx jest all-performance.test.js --verbose
```

## Resultados Obtidos

Os testes de desempenho realizados para os serviços **Service A** e **Service B** em diferentes cenários (50, 100 e 200 interações) revelaram importantes insights sobre o comportamento dos caminhos **gRPC puro** e **REST -> gRPC**. Abaixo, apresentamos uma análise detalhada dos resultados.

### **Service A**
O **Service A** apresentou os seguintes tempos médios e totais para os dois caminhos testados:

| Interações | Tipo                     | Tempo Médio (ms) | Tempo Total (ms) | Requisições |
|------------|--------------------------|------------------|------------------|-------------|
| 50         | gRPC Puro -> Service A   | 1.66             | 83.00            | 50          |
| 50         | REST gRPC -> Service A   | 2.42             | 121.00           | 50          |
| 100        | gRPC Puro -> Service A   | 1.03             | 103.00           | 100         |
| 100        | REST gRPC -> Service A   | 2.22             | 222.00           | 100         |
| 200        | gRPC Puro -> Service A   | 0.79             | 157.00           | 200         |
| 200        | REST gRPC -> Service A   | 1.81             | 363.00           | 200         |

#### **Análise**
1. O caminho **gRPC puro** foi consistentemente mais rápido que o caminho **REST -> gRPC**, com tempos médios variando de **1.66ms** (50 interações) a **0.79ms** (200 interações).
2. O caminho **REST -> gRPC** apresentou uma sobrecarga adicional, com tempos médios variando de **2.42ms** (50 interações) a **1.81ms** (200 interações). Essa diferença é esperada devido à latência introduzida pela camada REST (serialização/deserialização JSON e roteamento HTTP).
3. À medida que o número de interações aumentou, os tempos médios diminuíram, indicando que o sistema pode estar se beneficiando de otimizações internas, como cache ou conexões persistentes.

---

### **Service B**
O **Service B** apresentou os seguintes tempos médios e totais para os dois caminhos testados:

| Interações | Tipo                     | Tempo Médio (ms) | Tempo Total (ms) | Requisições |
|------------|--------------------------|------------------|------------------|-------------|
| 50         | gRPC Puro -> Service B   | 0.74             | 37.00            | 50          |
| 50         | REST gRPC -> Service B   | 4.58             | 229.00           | 50          |
| 100        | gRPC Puro -> Service B   | 0.73             | 73.00            | 100         |
| 100        | REST gRPC -> Service B   | 3.57             | 357.00           | 100         |
| 200        | gRPC Puro -> Service B   | 0.69             | 137.00           | 200         |
| 200        | REST gRPC -> Service B   | 2.40             | 479.00           | 200         |

#### **Análise**
1. O caminho **gRPC puro** foi significativamente mais rápido que o caminho **REST -> gRPC**, com tempos médios variando de **0.74ms** (50 interações) a **0.69ms** (200 interações).
2. O caminho **REST -> gRPC** apresentou uma sobrecarga muito maior, com tempos médios variando de **4.58ms** (50 interações) a **2.40ms** (200 interações). Essa diferença é mais acentuada no **Service B** do que no **Service A**, possivelmente devido à maior complexidade do método `CalcularEstatisticas` e ao tamanho dos dados processados.
3. Assim como no **Service A**, os tempos médios diminuíram com o aumento do número de interações, sugerindo que o sistema está se beneficiando de otimizações internas.

---

### **Comparação Geral**
1. **gRPC puro**:
   - Consistentemente mais rápido em ambos os serviços, com tempos médios abaixo de **2ms** em todos os cenários.
   - O **Service B** foi ligeiramente mais rápido que o **Service A**, possivelmente devido à menor complexidade do método gRPC puro.

2. **REST -> gRPC**:
   - Apresentou uma sobrecarga adicional em ambos os serviços, mas foi mais pronunciada no **Service B**.
   - A diferença entre os tempos médios de **gRPC puro** e **REST -> gRPC** foi maior no **Service B**, indicando que a camada REST tem um impacto mais significativo nesse serviço.

---

### **Conclusões**
1. **Eficiência do gRPC**:
   - O gRPC puro demonstrou ser altamente eficiente, com tempos médios muito baixos, especialmente em cenários com maior número de interações.

2. **Impacto da camada REST**:
   - A camada REST introduz uma sobrecarga adicional, mas o impacto varia entre os serviços. No **Service A**, a diferença foi menor, enquanto no **Service B**, a sobrecarga foi mais significativa.

3. **Otimizações internas**:
   - A redução dos tempos médios com o aumento do número de interações sugere que o sistema está se beneficiando de otimizações, como conexões persistentes ou cache.

4. **Recomendações**:
   - Para cenários onde o desempenho é crítico, o uso direto do gRPC é recomendado.
   - Caso o caminho **REST -> gRPC** seja necessário, é importante otimizar a camada REST para minimizar a sobrecarga, especialmente em serviços mais complexos como o **Service B**.
