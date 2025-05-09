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
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,  // O e-mail atual
            prompt('Digite sua senha para confirmar a mudança de e-mail:')  // Solicita senha para confirmação
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
        user.delete().then(() => {
            alert('Conta deletada com sucesso!');
            window.location.href = 'index.html';  // Redireciona para a página de login após excluir a conta
        }).catch(error => alert('Erro ao deletar conta: ' + error.message));
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
