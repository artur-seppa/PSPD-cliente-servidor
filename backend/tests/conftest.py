# backend/tests/conftest.py
import sys, os

# diretório do tests/
HERE = os.path.dirname(__file__)
# um nível acima fica o backend/
BACKEND = os.path.abspath(os.path.join(HERE, os.pardir))
# insere backend/ no path (para 'import a' e 'import b')
sys.path.insert(0, BACKEND)
# insere a/ e b/ no path para que o stub encontre service_pb2
sys.path.insert(0, os.path.join(BACKEND, 'a'))
sys.path.insert(0, os.path.join(BACKEND, 'b'))
