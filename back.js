const FOOD_DATA = {
    'cat-entradas': ['Tábua de Frios', 'Salgadinhos', 'Bruschettas', 'Canapés', 'Patês com Torradas'],
    'cat-principais': ['Peru', 'Chester', 'Bacalhau', 'Pernil', 'Lombo Assado'],
    'cat-acompanhamentos': ['Arroz com Passas', 'Farofa Especial', 'Salpicão', 'Salada de Folhas', 'Batatas Gratinadas'],
    'cat-sobremesas': ['Pavê', 'Pudim', 'Rabanada', 'Panetone/Chocotone', 'Torta de Limão', 'Refrigerantes', 'Vinhos/Espumantes', 'Sucos']
};

// API do Codata (banco de dados). Rota same-origin: a chave da API fica no servidor,
// o proxy /api é criado automaticamente no go-live com hospedagem Codata.
const API_URL = '/api/ceiaNatals';

// Aceita tanto [ ... ] quanto { data: [ ... ] } / { items: [ ... ] }
function extractRows(payload) {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.items)) return payload.items;
    return [];
}

async function fetchChoices() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar escolhas');
    return extractRows(await response.json());
}

document.addEventListener('DOMContentLoaded', async () => {
    await initOptions();
    await renderConfirmedList();

    document.getElementById('btnConfirmar').addEventListener('click', handleConfirmation);
});

async function initOptions() {
    try {
        const choices = await fetchChoices();
        const takenFoods = choices.map(c => c.comida);

        for (const [catId, items] of Object.entries(FOOD_DATA)) {
            const container = document.getElementById(catId);
            container.innerHTML = ''; // Clear before filling

            items.forEach(item => {
                const isTaken = takenFoods.includes(item);
                const label = document.createElement('label');
                label.className = 'food-option';

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'food-choice';
                input.value = item;
                input.disabled = isTaken;

                const span = document.createElement('span');
                span.textContent = isTaken ? `${item} (Já escolhido!)` : item;
                if (isTaken) span.style.color = '#ccc';

                label.appendChild(input);
                label.appendChild(span);
                container.appendChild(label);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar opções:', error);
        alert('Erro ao conectar com o banco de dados. Tente novamente em instantes.');
    }
}

async function handleConfirmation() {
    const nameInput = document.getElementById('userName');
    const selectedOption = document.querySelector('input[name="food-choice"]:checked');

    if (!nameInput.value.trim()) {
        alert('Por favor, digite seu nome!');
        return;
    }

    if (!selectedOption) {
        alert('Por favor, escolha um prato!');
        return;
    }

    const nome = nameInput.value.trim();
    const comida = selectedOption.value;

    try {
        // Verifica se o prato já foi escolhido por outra pessoa
        const choices = await fetchChoices();
        const existing = choices.find(c => c.comida === comida);

        if (existing && existing.nome.toLowerCase() !== nome.toLowerCase()) {
            throw new Error('Essa comida já foi escolhida por outra pessoa!');
        }

        // Se for a mesma pessoa e o mesmo prato, não há nada a salvar
        if (!existing) {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, comida, dataEscolha: new Date().toISOString() })
            });

            if (!response.ok) {
                // Possível corrida: alguém pegou o mesmo prato agora (comida é UNIQUE no banco)
                throw new Error('Não foi possível salvar. Esse prato pode ter sido escolhido agora por outra pessoa.');
            }
        }

        alert('Escolha confirmada! Boas festas! 🎄');
        nameInput.value = '';

        await initOptions();
        await renderConfirmedList();
    } catch (error) {
        alert(`Erro: ${error.message}`);
        await initOptions();
        await renderConfirmedList();
    }
}

async function renderConfirmedList() {
    const container = document.getElementById('listContainer');

    try {
        const choices = await fetchChoices();

        if (choices.length === 0) {
            container.innerHTML = '<p class="empty-msg">Ninguém escolheu nada ainda. Seja o primeiro!</p>';
            return;
        }

        container.innerHTML = '';
        choices.forEach(choice => {
            const div = document.createElement('div');
            div.className = 'choice-item';

            const person = document.createElement('span');
            person.className = 'person';
            person.textContent = choice.nome; // textContent evita injeção de HTML

            const food = document.createElement('span');
            food.className = 'food';
            food.append('está levando ');
            const strong = document.createElement('strong');
            strong.textContent = choice.comida;
            food.appendChild(strong);

            div.appendChild(person);
            div.appendChild(food);
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Erro ao carregar lista:', error);
        container.innerHTML = '<p class="empty-msg">Erro ao carregar lista de convidados.</p>';
    }
}
