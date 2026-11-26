const FOOD_DATA = {
    'cat-entradas': [
        'Tábua de Frios', 'Salgadinhos Assados', 'Bruschettas de Tomate', 'Canapés de Presunto', 'Patês com Torradas',
        'Coxinha', 'Bolinha de Queijo', 'Risoles', 'Enroladinho de Salsicha', 'Empada',
        'Pastel de Forno', 'Quibe Assado', 'Arancini', 'Bruschetta de Presunto e Queijo', 'Crostini de Abacate',
        'Tábua de Queijos', 'Palitos de Queijo', 'Mini Quiche', 'Torradas com Alho', 'Mini Pizza',
        'Pão de Queijo', 'Empadinha', 'Bolinho de Bacalhau', 'Croquete', 'Enchilada Mini',
        'Tábua de Embutidos', 'Bruschetta de Abacate', 'Patê de Atum', 'Torrada com Cream Cheese', 'Rolinho Primavera'
    ],
    'cat-principais': [
        'Peru Assado', 'Chester', 'Bacalhau com Natas', 'Pernil Suíno', 'Lombo Assado',
        'Frango Assado', 'Carne Assada', 'Costela Assada', 'Leitão Assado', 'Cabrito Assado',
        'Peixe Assado', 'Salmão Grelhado', 'Filé Mignon', 'Picanha', 'Costelinha de Porco',
        'Lagosta', 'Camarão ao Alho e Óleo', 'Polvo à Lagareiro', 'Bacalhau Assado', 'Peru Recheado',
        'Tender', 'Pernil Temperado', 'Frango à Passarinho', 'Carne de Sol', 'Frango Xadrez',
        'Strogonoff', 'Lasanha', 'Macarronada', 'Nhoque', 'Ravioli',
        'Escondidinho', 'Bobó de Camarão', 'Moqueca de Peixe', 'Feijoada', 'Arroz de Pato'
    ],
    'cat-acompanhamentos': [
        'Arroz com Passas', 'Farofa Especial', 'Salpicão', 'Salada de Folhas', 'Batatas Gratinadas',
        'Arroz Branco', 'Feijão Tropeiro', 'Purê de Batata', 'Batata Assada', 'Batata Doce Assada',
        'Mandioca Cozida', 'Farinha de Mandioca', 'Couve Refogada', 'Espinafre Refogado', 'Brócolis ao Vapor',
        'Cenoura Cozida', 'Ervilha', 'Milho Verde', 'Vinagrete', 'Salada de Tomate',
        'Salada de Pepino', 'Salada de Rúcula', 'Salada de Alface', 'Salada Mista', 'Salada Caesar',
        'Farofa de Bacon', 'Farofa de Banana', 'Farofa de Ovo', 'Farofa de Calabresa', 'Farofa de Uva Passa',
        'Arroz à Grega', 'Arroz Integral', 'Arroz de Forno', 'Purê de Mandioquinha', 'Purê de Abóbora',
        'Batata Rústica', 'Batata Rosti', 'Batata Chips', 'Ceviche de Aipim', 'Polenta Frita',
        'Polenta Mole', 'Polenta Grelhada', 'Farofa de Amendoim', 'Salada de Grão de Bico', 'Salada de Lentilha'
    ],
    'cat-sobremesas': [
        'Pavê', 'Pudim', 'Rabanada', 'Panetone', 'Chocotone', 'Torta de Limão', 'Refrigerantes', 'Vinhos',
        'Sucos Naturais', 'Champagne', 'Cerveja', 'Água com Gás', 'Água Sem Gás', 'Chá Gelado', 'Limonada',
        'Coca-Cola', 'Guaraná', 'Sprite', 'Fanta', 'Suco de Uva',
        'Suco de Laranja', 'Suco de Abacaxi', 'Suco de Morango', 'Suco de Maracujá', 'Suco de Melancia',
        'Milkshake', 'Sorvete', 'Sorvete de Creme', 'Sorvete de Chocolate', 'Sorvete de Morango',
        'Sorvete de Flocos', 'Sorvete de Napolitano', 'Sorvete de Coco', 'Sorvete de Limão', 'Sorvete de Pistache',
        'Pudim de Leite', 'Pudim de Coco', 'Pudim de Chocolate', 'Torta de Maçã', 'Torta de Chocolate',
        'Torta de Morango', 'Torta de Maracujá', 'Torta de Coco', 'Torta de Limão Siciliano', 'Cheesecake',
        'Brigadeiro', 'Beijinho', 'Cajuzinho', 'Olho de Sogra', 'Bem-Casado',
        'Doce de Leite', 'Quindim', 'Sonho', 'Sonho de Creme', 'Sonho de Chocolate',
        'Sonho de Morango', 'Pavê de Chocolate', 'Pavê de Morango', 'Pavê de Prestígio', 'Pavê de Limão',
        'Trufa de Chocolate', 'Trufa de Morango', 'Trufa de Café', 'Trufa de Coco', 'Trufa de Maracujá'
    ]
};

const RECIPE_API_URL = '/api/gerar-receita';

// Supabase - cliente carregado globalmente pelo CDN

async function fetchChoices() {
    const { data, error } = await supabase
        .from('escolhas')
        .select('comida, nome');

    if (error) throw new Error('Erro ao buscar escolhas: ' + error.message);
    return data || [];
}

document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector('.food-categories').addEventListener('change', event => {
        if (event.target.id === 'otherChoiceEnabled') {
            const otherInput = document.getElementById('otherChoice');
            otherInput.disabled = !event.target.checked;
            if (event.target.checked) otherInput.focus();
        }
        updateSelectionCount();
    });

    document.getElementById('otherChoice').addEventListener('input', updateSelectionCount);
    document.getElementById('searchFood').addEventListener('input', filterOptions);

    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', () => {
            const category = header.closest('.category');
            category.classList.toggle('expanded');
        });
    });

    await initOptions();
    await renderConfirmedList();

    document.getElementById('btnConfirmar').addEventListener('click', handleConfirmation);
    document.getElementById('btnGerarReceita').addEventListener('click', generateRecipe);
});

function filterOptions() {
    const search = document.getElementById('searchFood').value.toLowerCase().trim();
    document.querySelectorAll('.food-option').forEach(option => {
        const text = option.textContent.toLowerCase();
        if (!search || text.includes(search)) {
            option.style.display = 'flex';
            const category = option.closest('.category');
            if (category) category.classList.add('expanded');
        } else {
            option.style.display = 'none';
        }
    });
}

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
                input.type = 'checkbox';
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
        updateSelectionCount();
    } catch (error) {
        console.error('Erro ao carregar opções:', error);
        alert('Erro ao conectar com o banco de dados. Tente novamente em instantes.');
    }
}

function updateSelectionCount() {
    const fixedCount = [...document.querySelectorAll('input[name="food-choice"]:checked')]
        .filter(option => option.id !== 'otherChoiceEnabled').length;
    const otherEnabled = document.getElementById('otherChoiceEnabled').checked;
    const otherText = document.getElementById('otherChoice').value.trim();
    const count = fixedCount + (otherEnabled && otherText ? 1 : 0);
    const label = count === 1 ? 'prato selecionado' : 'pratos selecionados';
    document.getElementById('selectionCount').textContent = `${count} ${label}`;
}

function getSelectedFoods() {
    const fixedFoods = [...document.querySelectorAll('input[name="food-choice"]:checked')]
        .map(option => option.value)
        .filter(value => value !== '__outros__');

    const otherEnabled = document.getElementById('otherChoiceEnabled')?.checked;
    const otherText = document.getElementById('otherChoice')?.value.trim();
    if (otherEnabled && otherText) fixedFoods.push(otherText);

    return fixedFoods;
}

async function generateRecipe() {
    const result = document.getElementById('recipeResult');
    const button = document.getElementById('btnGerarReceita');
    const selectedFoods = getSelectedFoods();

    if (selectedFoods.length === 0) {
        result.innerHTML = '<p class="recipe-error">Selecione pelo menos um prato antes de gerar a receita.</p>';
        return;
    }

    button.disabled = true;
    button.textContent = 'Gerando...';
    result.innerHTML = '<p class="recipe-loading">A IA está montando sua receita...</p>';

    try {
        const response = await fetch(RECIPE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pratos: selectedFoods })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(payload.error || 'Não foi possível gerar a receita agora.');
        }

        const recipe = String(payload.receita || '').trim();
        if (!recipe) throw new Error('A IA não retornou uma receita. Tente novamente.');

        result.innerHTML = '';
        const content = document.createElement('div');
        content.className = 'recipe-content';
        content.textContent = recipe;
        result.appendChild(content);
    } catch (error) {
        result.innerHTML = '';
        const message = document.createElement('p');
        message.className = 'recipe-error';
        message.textContent = `Erro: ${error.message}`;
        result.appendChild(message);
    } finally {
        button.disabled = false;
        button.textContent = 'Gerar receita';
    }
}

async function handleConfirmation() {
    const nameInput = document.getElementById('userName');
    const selectedFoods = [...document.querySelectorAll('input[name="food-choice"]:checked')]
        .map(option => option.value)
        .filter(value => value !== '__outros__');

    const otherEnabled = document.getElementById('otherChoiceEnabled').checked;
    const otherText = document.getElementById('otherChoice').value.trim();

    if (otherEnabled) {
        if (!otherText) {
            alert('Por favor, escreva o prato ou bebida em "Outros"!');
            document.getElementById('otherChoice').focus();
            return;
        }
        selectedFoods.push(otherText);
    }

    const confirmButton = document.getElementById('btnConfirmar');

    if (!nameInput.value.trim()) {
        alert('Por favor, digite seu nome!');
        return;
    }

    if (selectedFoods.length === 0) {
        alert('Por favor, escolha pelo menos um prato!');
        return;
    }

    const nome = nameInput.value.trim();
    let savedCount = 0;
    confirmButton.disabled = true;
    confirmButton.textContent = 'Salvando...';

    try {
        const choices = await fetchChoices();
        const conflicts = selectedFoods.filter(food => {
            const existing = choices.find(choice =>
                choice.comida.toLowerCase() === food.toLowerCase()
            );
            return existing && existing.nome.toLowerCase() !== nome.toLowerCase();
        });

        if (conflicts.length > 0) {
            throw new Error(`Já escolhida por outra pessoa: ${conflicts.join(', ')}.`);
        }

        for (const comida of selectedFoods) {
            const alreadySaved = choices.some(choice =>
                choice.comida.toLowerCase() === comida.toLowerCase()
            );
            if (alreadySaved) continue;

            const { error } = await supabase
                .from('escolhas')
                .insert({ nome, comida, data_escolha: new Date().toISOString() });

            if (error) {
                throw new Error(`Não foi possível salvar "${comida}". Esse prato pode ter sido escolhido agora por outra pessoa.`);
            }
            savedCount += 1;
        }

        alert('Escolha confirmada! Boas festas! 🎄');
        nameInput.value = '';
        document.getElementById('otherChoiceEnabled').checked = false;
        document.getElementById('otherChoice').value = '';
        document.getElementById('otherChoice').disabled = true;

        await initOptions();
        await renderConfirmedList();
    } catch (error) {
        const partialSaveMessage = savedCount > 0
            ? ` ${savedCount} ${savedCount === 1 ? 'prato foi salvo' : 'pratos foram salvos'} antes do erro. Confira a lista e tente novamente.`
            : '';
        alert(`Erro: ${error.message}${partialSaveMessage}`);
        await initOptions();
        await renderConfirmedList();
    } finally {
        confirmButton.disabled = false;
        confirmButton.textContent = 'Confirmar Minhas Escolhas';
        updateSelectionCount();
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
