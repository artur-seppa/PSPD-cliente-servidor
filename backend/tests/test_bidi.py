import grpc
from b import service_pb2, service_pb2_grpc

def test_bidi_chat_roundtrip():
    channel = grpc.insecure_channel("localhost:50052")
    stub    = service_pb2_grpc.DemoServiceStub(channel)
    # envie três mensagens e capture as respostas
    msgs = [service_pb2.ChatMessage(sender="T", text=s) for s in ("one","two","three")]
    resps = list(stub.BidiChat(iter(msgs)))
    # Verifica número de respostas e prefixo esperado
    assert len(resps) == 3
    for sent, got in zip(msgs, resps):
        expected = f"[{sent.sender} -> Server]: {sent.text[::-1]}"
        assert got.text == expected
        assert got.sender == "Server"
