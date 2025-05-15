// Login
function login(event) {
    event.preventDefault();  // Impede o envio do formulário e o recarregamento da página (não deixar sem isso, se não dá B.O)

    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-password').value;

    // Verificação se os campos estão preenchidos
    if (!email || !senha) {
        alert('Por favor, preencha ambos os campos!');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, senha)
        .then(() => {
            alert('Login bem-sucedido!');
            window.location.href = 'profile.html';  // Redirecionamento para a página perfil após login :)
        })
        .catch(error => alert('Erro ao fazer login: ' + error.message));
}

// Registro
function register(event) {
    event.preventDefault();  // Impede o envio do formulário e o recarregamento da página (repetindo igual fiz lá em cima)

    const email = document.getElementById('register-email').value;
    const senha = document.getElementById('register-password').value;

    // Verificação se os campos estão preenchidos
    if (!email || !senha) {
        alert('Por favor, preencha ambos os campos!');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, senha)
        .then(() => {
            alert('Usuário criado com sucesso! Agora, faça login.');
            firebase.auth().signOut();
            window.location.href = 'index.html';  // DIRECIONAMENTO PARA A PÁGINA DE LOGIN APÓS REGISTRO
        })
        .catch(error => alert('Erro ao registrar: ' + error.message));
}

// Atualização do perfil do usuário (nome e email)
function updateProfile() {
    const user = firebase.auth().currentUser;
    const nome = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value; // Obtém o novo e-mail

    const updatePromises = [];

    // Atualiza o nome do usuário no Firebasezin
    if (nome) {
        updatePromises.push(user.updateProfile({ displayName: nome }));
    }

    // Atualiza o e-mail do usuário no Firebase
    if (email) {
        const senha = prompt('Digite sua senha para confirmar a mudança de e-mail:');  // Solicita senha para confirmação

        if (senha) {
            const credential = firebase.auth.EmailAuthProvider.credential(
                user.email,  // O e-mail atual
                senha  // Senha fornecida
            );

            user.reauthenticateWithCredential(credential)
                .then(() => {
                    // Agora, podemos atualizar o e-mail
                    updatePromises.push(user.updateEmail(email));
                    return Promise.all(updatePromises);
                })
                .then(() => {
                    alert('Perfil atualizado com sucesso!');
                })
                .catch(error => alert('Erro ao atualizar perfil: ' + error.message));
        } else {
            alert('Por favor, insira sua senha para confirmar.');
        }
    } else {
        alert('Por favor, insira um e-mail válido!');
    }
}

// Logout
function logout() {
    firebase.auth().signOut().then(() => {
        alert('Você foi desconectado com sucesso!');
        window.location.href = 'index.html'; // Redireciona para a página de login
    }).catch(error => {
        alert('Erro ao sair: ' + error.message); // Caso ocorra algum erro
    });
}

// Deletar conta
function deleteAccount() {
    const user = firebase.auth().currentUser;

    if (user) {
        // Cria o modal de confirmação de senha
        const modal = document.createElement('div');
        modal.id = 'senha-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        // Cria o conteúdo do modal
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        modalContent.style.textAlign = 'center';

        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Confirme sua senha para excluir sua conta';
        modalContent.appendChild(modalTitle);

        const senhaInput = document.createElement('input');
        senhaInput.type = 'password';  // Define o tipo como 'password' para mascarar a senha
        senhaInput.placeholder = 'Digite sua senha';
        senhaInput.style.marginBottom = '10px';
        senhaInput.style.padding = '8px';
        senhaInput.style.width = '100%';
        senhaInput.style.fontSize = '16px';
        senhaInput.style.border = '1px solid #ccc';
        senhaInput.style.borderRadius = '4px';
        modalContent.appendChild(senhaInput);

        // Cria o botão de confirmação
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmar';
        confirmButton.style.marginTop = '10px';
        confirmButton.style.padding = '10px 20px';
        confirmButton.style.backgroundColor = '#28a745';
        confirmButton.style.color = '#fff';
        confirmButton.style.border = 'none';
        confirmButton.style.borderRadius = '4px';
        confirmButton.style.cursor = 'pointer';
        
        confirmButton.onclick = function() {
            const senha = senhaInput.value;
            
            if (senha) {
                const credential = firebase.auth.EmailAuthProvider.credential(user.email, senha);

                // Reautenticar o usuário com a senha fornecida
                user.reauthenticateWithCredential(credential)
                    .then(() => {
                        // Após a reautenticação, pode proceder com a exclusão da conta
                        user.delete().then(() => {
                            alert('Conta deletada com sucesso!');
                            window.location.href = 'index.html';  // Redireciona para a página de login após excluir a conta
                        }).catch(error => alert('Erro ao deletar conta: ' + error.message));
                    })
                    .catch(error => {
                        alert('Erro na reautenticação: ' + error.message);  // Caso a senha esteja incorreta
                    });
            } else {
                alert('Por favor, insira sua senha para continuar.');
            }
        };

        modalContent.appendChild(confirmButton);
        modal.appendChild(modalContent);

        // Adiciona o modal à página
        document.body.appendChild(modal);
    }
}

// Controle de estado de autenticação do usuário
firebase.auth().onAuthStateChanged(user => {
    const currentPage = window.location.pathname;

    if (user) {
        // Se o usuário está logado
        if (currentPage === '/index.html' || currentPage === '/register.html') {
            window.location.href = 'profile.html';
        }

        // Preenche os dados do perfil
        document.getElementById('user-name').value = user.displayName || "";
        document.getElementById('user-email').value = user.email || ""; // Preenche o e-mail no campo
    } else {
        // Se o usuário não estiver logado
        if (currentPage !== '/index.html' && currentPage !== '/register.html') {
            window.location.href = 'index.html';
        }
    }
});
