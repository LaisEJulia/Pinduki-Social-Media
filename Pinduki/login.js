const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configurar o parser de corpo da requisição
app.use(bodyParser.urlencoded({ extended: true }));

// Criar ou abrir banco de dados SQLite
const db = new sqlite3.Database('./users.db');

// Criar tabela se não existir
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
});

// Rota para renderizar a página de login
app.get('/', (req, res) => {
  res.send(`
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pinduki</title>
    </head>
    <body>
        <fieldset class="poplogin">
            <h2>Pinduki</h2>
            <form action="/login" method="POST">
                <input type="text" name="usuario" placeholder="Digite seu nome de usuário" required><br><br>
                <input type="password" name="senha" placeholder="Digite sua senha" required><br><br>
                <button type="submit">Entrar</button>
            </form>
        </fieldset>
    </body>
    </html>
  `);
});

// Rota de login - validação com bcrypt
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  // Consultar o banco de dados para verificar as credenciais
  db.get("SELECT * FROM users WHERE username = ?", [usuario], (err, row) => {
    if (err) {
      res.status(500).send("Erro no banco de dados");
    } else if (row) {
      // Verificar se a senha fornecida corresponde ao hash armazenado
      bcrypt.compare(senha, row.password, (err, isMatch) => {
        if (isMatch) {
          res.send("Login bem-sucedido!");
        } else {
          res.send("Senha incorreta.");
        }
      });
    } else {
      res.send("Usuário não encontrado.");
    }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
