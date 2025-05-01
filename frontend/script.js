const API_URL = 'http://localhost:3000';

async function consultarUsuario() {
    const id = document.getElementById('usuarioId').value;
    if (!id) return alert('Digite um ID válido');

    try {
        const response = await fetch(`${API_URL}/usuario/${id}`);
        const data = await response.json();
        
        const resultadoDiv = document.getElementById('resultadoUsuario');
        resultadoDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
        alert('Erro ao consultar usuário: ' + error.message);
    }
}

async function calcularEstatisticas() {
    const input = document.getElementById('numeros').value;
    const numeros = input.split(',').map(num => parseFloat(num.trim()));

    try {
        const response = await fetch(`${API_URL}/estatisticas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valores: numeros })
        });
        
        const data = await response.json();
        const resultadoDiv = document.getElementById('resultadoEstatisticas');
        resultadoDiv.innerHTML = `
            <p><strong>Média:</strong> ${data.media}</p>
            <p><strong>Soma:</strong> ${data.soma}</p>
        `;
    } catch (error) {
        alert('Erro ao calcular estatísticas: ' + error.message);
    }
}