
    function gerarLogin() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Recupera lista de eleitores do localStorage ou inicia vazia
    function getEleitores() {
        return JSON.parse(localStorage.getItem('eleitores')) || [];
    }

    function setEleitores(eleitores) {
        localStorage.setItem('eleitores', JSON.stringify(eleitores));
    }

    document.getElementById('cadastroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();

        let eleitores = getEleitores();

        // Verifica duplicidade
        const existe = eleitores.some(e => e.nome === nome && e.telefone === telefone);
        if (existe) {
            document.getElementById('loginGerado').innerHTML = 
                `<span style="color:red;">Eleitor já cadastrado!</span>`;
            return;
        }

        const login = gerarLogin();
        const eleitor = { nome, telefone, login };
        eleitores.push(eleitor);
        setEleitores(eleitores);

        document.getElementById('loginGerado').innerHTML = 
            `Cadastro realizado!<br>Seu login de acesso é: <strong>${login}</strong>`;

        document.getElementById('cadastroForm').reset();
    });

    document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const loginAcesso = document.getElementById('loginAcesso').value.trim();
    const eleitores = getEleitores();
    const eleitor = eleitores.find(e => e.login === loginAcesso);

    if (eleitor) {
        // Salva login autenticado para uso posterior, se necessário
        localStorage.setItem('eleitorLogado', JSON.stringify(eleitor));

        /*var eleitoresFinal = JSON.parse(localStorage.getItem('eleitores'));
        for (ele of eleitoresFinal){
            alert(ele.nome);
        }*/
        
        // Redireciona para a urna
        window.location.href = './votacao/votacao.html';
    } else {
        document.getElementById('loginMsg').innerHTML = 
            '<span style="color:red;">Login não encontrado!</span>';
    }
});

function consultarCadastro() {
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const eleitores = JSON.parse(localStorage.getItem('eleitores')) || [];
    const eleitor = eleitores.find(e => e.nome === nome && e.telefone === telefone);

    if (nome === "" || telefone === "") {
        document.getElementById('consultaCadastro').innerHTML = 
            '<span style="color:red;">Preencha nome e telefone para consultar.</span>';
        return;
    }

    if (eleitor) {
        document.getElementById('consultaCadastro').innerHTML = 
            `<span style="color:green;">Cadastro encontrado! Seu login é: <strong>${eleitor.login}</strong></span>`;
    } else {
        document.getElementById('consultaCadastro').innerHTML = 
            '<span style="color:red;">Cadastro não encontrado.</span>';
    }
}