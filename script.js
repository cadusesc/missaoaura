
const formulario = document.getElementById("formulario");
const campoNome = document.getElementById("nome");
const campoNascimento = document.getElementById("nascimento");
const mensagem = document.getElementById("mensagem");

const painelTeste = document.getElementById("painelTeste");
const resultado = document.getElementById("resultado");
const conteudoResultado = document.getElementById("conteudoResultado");
const botaoRefazer = document.getElementById("refazer");

// Cada perfil possui um identificador usado na pontuação.
const perfis = [
    {
        id: 1,
        nome: "Explorador Terrestre",
        categoria: "Exploração",
        descricao:
            "Gosta de descobrir coisas novas e adora adrenalina. " +
            "É o mais experiente do grupo e querido pela tripulação " +
            "por seu ótimo humor. Trata todos bem, com respeito, " +
            "animação e correção. Costuma explorar o local inicialmente " +
            "sozinho para depois conduzir o grupo, além de coletar " +
            "materiais para pesquisas.",
        recomendacao:
            "Fica responsável pelo reconhecimento inicial do terreno, " +
            "pela identificação de recursos e pela coleta de amostras. " +
            "Sua curiosidade deve ajudar a equipe a conhecer o planeta " +
            "antes de estabelecer uma base.",
        imagem: "imagens/explorador.jpg"
    },
    {
        id: 2,
        nome: "Cientista Astrofísico",
        categoria: "Preparação e Execução",
        descricao:
            "Usa a matemática e as ciências exatas para calcular " +
            "as possibilidades da missão. Define preparativos como " +
            "velocidade, altura, local de pouso e horário de decolagem. " +
            "É extremamente inteligente, introspectivo e reservado, " +
            "preferindo trabalhar sozinho e em silêncio.",
        recomendacao:
            "Analise os dados orbitais, estime os riscos ambientais " +
            "e calcule as trajetórias mais seguras. Suas previsões " +
            "serão essenciais para o planejamento da expedição.",
        imagem: "imagens/astrofisico.jpg"
    },
    {
        id: 3,
        nome: "Engenheiro e Construtor Espacial",
        categoria: "Preparação",
        descricao:
            "Projeta e constrói a nave espacial a partir dos cálculos " +
            "do Astrofísico. É dedicado, ocupado e o mais melancólico " +
            "da tripulação. Sente falta de sua casa, dos amigos da Terra " +
            "e, principalmente, de sua esposa.",
        recomendacao:
            "Verifique a estrutura da nave, prepare os sistemas " +
            "de suporte à vida e desenvolva equipamentos que permitam " +
            "à tripulação sobreviver às condições extremas do planeta.",
        imagem: "imagens/engenheiro.jpg"
    },
    {
        id: 4,
        nome: "Comandante Estratégico",
        categoria: "Liderança e Planejamento",
        descricao:
            "Coordena a tripulação, organiza as tarefas e toma " +
            "decisões importantes durante a expedição. É responsável, " +
            "observador e disciplinado. Sabe ouvir os companheiros, " +
            "reconhecer suas capacidades e manter a calma sob pressão.",
        recomendacao:
            "Organize as operações, distribua responsabilidades " +
            "e acompanhe os riscos de cada etapa. Sua prioridade " +
            "é manter a equipe coordenada e garantir que todos " +
            "possam retornar em segurança.",
        imagem: "imagens/comandante.jpg"
    }
];

// Impede a seleção de uma data futura no calendário.
function formatarDataLocal(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function atualizarDataMaxima() {
    campoNascimento.max = formatarDataLocal(new Date());
}

atualizarDataMaxima();

// Interpreta a data como data local e verifica se ela existe.
function validarNascimento(valor) {
    if (!valor || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        return null;
    }

    const [ano, mes, dia] = valor.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);

    const dataExiste =
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia;

    if (!dataExiste || valor > formatarDataLocal(new Date())) {
        return null;
    }

    return data;
}

// Calcula a idade verificando se o aniversário já ocorreu.
function calcularIdade(nascimento) {
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const aniversarioAindaNaoOcorreu =
        hoje.getMonth() < nascimento.getMonth() ||
        (
            hoje.getMonth() === nascimento.getMonth() &&
            hoje.getDate() < nascimento.getDate()
        );

    if (aniversarioAindaNaoOcorreu) {
        idade--;
    }

    return idade;
}

// Cria elementos de texto sem interpretar o conteúdo como HTML.
function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;
}

// Monta o cartão de cada personagem.
function montarFicha(perfil) {
    const ficha = criarElemento("article", "ficha-resultado");

    ficha.appendChild(
        criarElemento("p", "resultado-intro", "PERFIL IDENTIFICADO")
    );

    ficha.appendChild(
        criarElemento("h3", "resultado-nome", perfil.nome)
    );

    ficha.appendChild(
        criarElemento("span", "tag-categoria", perfil.categoria)
    );

    // Moldura com proporção fixa para evitar imagens deformadas.
    const moldura = criarElemento("div", "moldura-imagem");
    const imagem = document.createElement("img");

    imagem.className = "imagem-perfil";
    imagem.src = perfil.imagem;
    imagem.alt = "Ilustração de " + perfil.nome;
    imagem.loading = "lazy";

    imagem.addEventListener("error", function () {
        moldura.hidden = true;
    }, { once: true });

    moldura.appendChild(imagem);
    ficha.appendChild(moldura);

    ficha.appendChild(
        criarElemento("p", "descricao-perfil", perfil.descricao)
    );

    const bloco = criarElemento("div", "bloco-recomendacao");

    bloco.appendChild(
        criarElemento("h4", "", "DIRETRIZ OPERACIONAL")
    );

    bloco.appendChild(
        criarElemento("p", "recomendacao-perfil", perfil.recomendacao)
    );

    ficha.appendChild(bloco);

    return ficha;
}

// Recebe as respostas e calcula a pontuação.
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mensagem.textContent = "";

    const nome = campoNome.value.trim();

    if (!nome) {
        mensagem.textContent = "Identificação obrigatória: informa teu nome.";
        campoNome.focus();
        return;
    }

    const nascimento = validarNascimento(campoNascimento.value);

    if (!nascimento) {
        mensagem.textContent =
            "Data inválida. Informa uma data real que não seja futura.";
        campoNascimento.focus();
        return;
    }

    const idade = calcularIdade(nascimento);

    // Todos os perfis começam com zero pontos.
    const pontuacoes = {
        1: 0,
        2: 0,
        3: 0,
        4: 0
    };

    // Cada resposta favorece o perfil correspondente.
    for (let numero = 1; numero <= 4; numero++) {
        const resposta = formulario.querySelector(
            `input[name="q${numero}"]:checked`
        );

        if (!resposta) {
            mensagem.textContent =
                "Todas as quatro respostas são necessárias.";
            return;
        }

        pontuacoes[Number(resposta.value)]++;
    }

    // Descobre a maior pontuação alcançada.
    const maiorPontuacao = Math.max(
        ...Object.values(pontuacoes)
    );

    // Localiza o perfil vencedor ou todos os perfis empatados.
    const vencedores = perfis.filter(function (perfil) {
        return pontuacoes[perfil.id] === maiorPontuacao;
    });

    conteudoResultado.replaceChildren();

    conteudoResultado.appendChild(
        criarElemento(
            "p",
            "resultado-intro",
            `PARTICIPANTE: ${nome.toUpperCase()} • IDADE: ${idade} ANOS`
        )
    );

    if (vencedores.length === 1) {
        conteudoResultado.appendChild(
            criarElemento(
                "h3",
                "resultado-nome",
                "Designação confirmada."
            )
        );

        conteudoResultado.appendChild(
            criarElemento(
                "p",
                "descricao-perfil",
                `O perfil mais compatível contigo obteve ${maiorPontuacao} de 4 pontos.`
            )
        );
    } else {
        conteudoResultado.appendChild(
            criarElemento(
                "h3",
                "empate-titulo",
                "Mais de uma função compatível."
            )
        );

        conteudoResultado.appendChild(
            criarElemento(
                "p",
                "descricao-perfil",
                "Tu demonstrou características de mais de um perfil. " +
                "A missão pode se beneficiar de qualquer uma das funções abaixo."
            )
        );
    }

    vencedores.forEach(function (perfil) {
        conteudoResultado.appendChild(montarFicha(perfil));
    });

    painelTeste.hidden = true;
    resultado.hidden = false;

    resultado.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// Reinicia o teste sem recarregar a página.
botaoRefazer.addEventListener("click", function () {
    formulario.reset();

    mensagem.textContent = "";
    conteudoResultado.replaceChildren();

    atualizarDataMaxima();

    resultado.hidden = true;
    painelTeste.hidden = false;

    painelTeste.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    campoNome.focus();
});
