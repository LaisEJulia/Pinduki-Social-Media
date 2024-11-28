<?php
// Verificar se os dados foram enviados via GET
if (isset($_GET['usuario']) && isset($_GET['senha'])) {
    $usuario = $_GET['usuario'];
    $senha = $_GET['senha'];

    // Função para verificar login
    login($usuario, $senha);
}

function login($usuario, $senha) {
    // Conectar ao banco de dados
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "pinduki";

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar se a conexão foi bem-sucedida
    if ($conn->connect_error) {
        die("Conexão falhou: " . $conn->connect_error);
    }

    // Preparar a consulta SQL
    $sql = "SELECT * FROM cadastro WHERE usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $usuario); // "s" significa string
    $stmt->execute();
    $result = $stmt->get_result();

    // Verificar se o usuário foi encontrado
    if ($result->num_rows > 0) {
        // Buscar os dados do usuário
        $row = $result->fetch_assoc();
        $senha_armazenada = $row['senha'];

        // Verificar se a senha fornecida corresponde à senha armazenada (comparando com hash)
        if ($senha == $senha_armazenada) {
            // Redireciona para a página principal após login bem-sucedido
            header("Location: mainpage.html");
            exit();  // Garante que o código pare de ser executado aqui
        } else {
            echo "Senha incorreta.";
        }
    } else {
        echo "Usuário não encontrado.";
    }

    // Fechar a conexão
    $stmt->close();
    $conn->close();
}
?>
