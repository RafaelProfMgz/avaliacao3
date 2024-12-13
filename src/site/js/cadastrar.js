const form = document.querySelector("#formulario");

// Função para exibir mensagem de erro abaixo de um campo
function mostrarErro(input, mensagem) {
  let erro = input.nextElementSibling;
  if (!erro || !erro.classList.contains("erro")) {
    erro = document.createElement("span");
    erro.classList.add("erro");
    erro.style.color = "red";
    erro.style.fontSize = "0.9rem";
    input.insertAdjacentElement("afterend", erro);
  }
  erro.textContent = mensagem;
}

// Função para limpar mensagens de erro
function limparErro(input) {
  const erro = input.nextElementSibling;
  if (erro && erro.classList.contains("erro")) {
    erro.textContent = "";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const cpf = form.cpf.value.trim();
  const titulo = form.titulo.value.trim();
  const autor = form.autor.value.trim();
  const ano = form.ano.value.trim();
  const genero = form.genero.value.trim();
  const status = form.status.value.trim();

  let isValid = true;

  // Validar email
  if (!emailRegex.test(email)) {
    mostrarErro(form.email, "Por favor, insira um email válido.");
    isValid = false;
  } else {
    limparErro(form.email);
  }

  // Validar CPF
  if (!cpfRegex.test(cpf)) {
    mostrarErro(
      form.cpf,
      "Por favor, insira um CPF no formato 000.000.000-00."
    );
    isValid = false;
  } else {
    limparErro(form.cpf);
  }

  if (!isValid) {
    return;
  }

  const livro = { nome, email, cpf, titulo, autor, ano, genero, status };

  try {
    const resultado = await fetch(
      "https://readfish-bce18-default-rtdb.firebaseio.com/livros.json",
      {
        method: "POST",
        body: JSON.stringify(livro),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (resultado.ok) {
      alert("Livro cadastrado com sucesso!");
      form.reset();
      document.querySelectorAll(".erro").forEach((el) => (el.textContent = ""));
    } else {
      alert("Ocorreu um erro ao cadastrar o livro.");
    }
  } catch (error) {
    alert(
      "Erro ao conectar ao servidor. Por favor, tente novamente mais tarde."
    );
    console.error(error);
  }
});
