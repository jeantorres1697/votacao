let seuVotopara = document.querySelector('.d-1-1 span');
let cargo = document.querySelector('.d-1-2 span');
let descricao = document.querySelector('.d-1-4');
let aviso = document.querySelector('.d-2');
let lateral = document.querySelector('.d-1-right');
let numeros = document.querySelector('.d-1-3');

let etapaAtual = 0;
let numero = '';
let votoBranco = false;
let votos = []; // Armazena os votos da sessão atual
let votosTotais = []; // Armazena os votos acumulados

function comecarEtapa() {
    let etapa = etapas[etapaAtual];

    let numeroHtml = '';
    numero = '';
    votoBranco = false;

    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0) {
            numeroHtml += '<div class="numero pisca"></div>';
        } else {
            numeroHtml += '<div class="numero"></div>';
        }
    }

    seuVotopara.style.display = 'block';
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = '';
    aviso.style.display = 'block';
    lateral.innerHTML = '';
    numeros.innerHTML = numeroHtml;
}

function atualizaInterface() {
    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter((item) => item.numero === numero);

    if (candidato.length > 0) {
        candidato = candidato[0];
        seuVotopara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = `Nome: ${candidato.name} <br> Partido: ${candidato.partido} <br> Vice: ${candidato.vice}`; // Exibe o nome e o partido do candidato
        if (candidato.vice) {
            descricao.innerHTML += `<br> Vice: ${candidato.vice}`; // Exibe o nome do vice-candidato, se houver
        }
        

        let fotosHtml = '';
        for (let i in candidato.fotos) {
            fotosHtml += `<div class="d-1-right"> <div class="d-1-image"> <img src="../images/${candidato.fotos[i].url}" alt=""/> ${candidato.fotos[i].legenda} </div>`; 
        }

        lateral.innerHTML = fotosHtml; // Adiciona as fotos do candidato
    } else {
        seuVotopara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>'; // Exibe a mensagem "VOTO NULO"
    }
}

function clicou(n) {
    let elnumero = document.querySelector('.numero.pisca');
    if (elnumero !== null) {
        elnumero.innerHTML = n;
        numero = `${numero}${n}`; 

        elnumero.classList.remove('pisca');
        if (elnumero.nextElementSibling !== null) {
            elnumero.nextElementSibling.classList.add('pisca'); 
        } else {
            atualizaInterface(); // Atualiza a interface com os dados do candidato
        }
    }
}

function branco() {
    numero = '';
    votoBranco = true;
    seuVotopara.style.display = 'block';
    aviso.style.display = 'block';
    numeros.innerHTML = '';
    descricao.innerHTML = '<div class="aviso--grande pisca">VOTO EM BRANCO</div>'; // Exibe a mensagem "VOTO EM BRANCO"
    lateral.innerHTML = ''; 
}

function corrige() {
    comecarEtapa(); // Reinicia a etapa atual
}

function confirma() {
    let etapa = etapas[etapaAtual];
    let votoConfirmado = false;

    if (votoBranco === true) {
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'branco'
        }); // Adiciona o voto em branco à lista de votos

    } else if (numero.length === etapa.numeros) {
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero
        }); // Adiciona o voto à lista de votos
    }

    if (votoConfirmado) {
        etapaAtual++;
        if (etapas[etapaAtual] !== undefined) {
            comecarEtapa();
        } else {
            exibirContagemDeVotos(); // Exibe a contagem de votos
        }
    }
}

function exibirContagemDeVotos() {
    let resultadoHtml = '<h2>Resultado da Votação</h2>'; // Exibe o título "Resultado da Votação"
    
    // Atualiza os votos acumulados
    votosTotais = votosTotais.concat(votos);

    etapas.forEach(etapa => {
        resultadoHtml += `<h3>${etapa.titulo}</h3>`;
        etapa.candidatos.forEach(candidato => {
            const votosCandidato = votosTotais.filter(v => v.etapa === etapa.titulo && v.voto === candidato.numero).length;
            resultadoHtml += `<p>${candidato.name} (${candidato.partido}): ${votosCandidato} votos</p>`;// Adiciona a contagem de votos do candidato
        });
        const votosBrancos = votosTotais.filter(v => v.etapa === etapa.titulo && v.voto === 'branco').length; 
        resultadoHtml += `<p>Votos em Branco: ${votosBrancos}</p>`; // Adiciona a contagem de votos em branco
        const votosNulos = votosTotais.filter(v => v.etapa === etapa.titulo && !etapa.candidatos.some(c => c.numero === v.voto) && v.voto !== 'branco').length;
        resultadoHtml += `<p>Votos Nulos: ${votosNulos}</p>`; // Adiciona a contagem de votos nulos
    });

    
    document.querySelector('.tela').innerHTML ='<div class="aviso--fim pisca">FIM</div>'; // Exibe a mensagem "FIM" na tela

    // Exibe o resultado no novo bloco
    document.getElementById('resultado').innerHTML = resultadoHtml;

    // Aguarda 10 segundos e reinicia a votação
    setTimeout(() => {
        etapaAtual = 0; 
        votos = []; // Limpa os votos da sessão atual
        document.getElementById('resultado').innerHTML = ''; // Limpa o resultado
        document.querySelector('.tela').innerHTML = ''; // Limpa a mensagem "FIM"
        location.reload(); // Reinicia a votação
        window.location.href = '../index.html';
    }, 5000); // 5 segundos
     // Redireciona para a seção de resultados
}

// Inicializa a primeira etapa
comecarEtapa();
