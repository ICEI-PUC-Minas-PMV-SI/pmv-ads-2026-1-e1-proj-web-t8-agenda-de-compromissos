let selectedType = "";
let integrantes = [];

document.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedType = card.dataset.type;
    });
});

function addIntegrante() {
    const input = document.getElementById('intInput');
    const nome = input.value.trim();
    if (nome) {
        integrantes.push(nome);
        atualizarChips();
        input.value = "";
    }
}

function atualizarChips() {
    const container = document.getElementById('chipContainer');
    container.innerHTML = integrantes.map(n => `<span class="chip" style="background: white; padding: 5px 10px; border-radius: 10px; margin-right: 5px; font-size: 0.8rem;">${n}</span>`).join('');
}

function salvarTarefa() {
    const titulo = document.getElementById('titulo').value;
    const hora = document.getElementById('hora').value;
    const minuto = document.getElementById('minuto').value;

    if (!titulo || !selectedType) {
        alert("Preencha o título e selecione uma categoria!");
        return;
    }

    // Formatação de Horário (00:00)
    const h = hora.padStart(2, '0');
    const m = minuto.padStart(2, '0');
    const horarioFull = (hora && minuto) ? `${h}:${m}` : "Horário indefinido";

    const tarefa = {
        id: Date.now(),
        tipo: selectedType,
        titulo: titulo,
        local: document.getElementById('local').value,
        prazo: document.getElementById('prazo').value,
        horario: horarioFull,
        descricao: document.getElementById('descricao').value,
        integrantes: integrantes
    };

    let banco = JSON.parse(localStorage.getItem('tarefasApp')) || [];
    banco.push(tarefa);
    localStorage.setItem('tarefasApp', JSON.stringify(banco));

    alert("Tarefa Salva!");
    window.location.href = '../html/home.html'; // Redireciona para a lista
}