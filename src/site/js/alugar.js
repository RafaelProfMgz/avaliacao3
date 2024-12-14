const form = document.querySelector("#formulario");
const livrosSelect = document.querySelector("#livrosSelect");

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

// Função para popular o select com os livros
const popularSelect = async () => {
  const selectElement = document.querySelector("#livrosSelect");

  try {
    const resultado = await fetch(
      "https://readfish-bce18-default-rtdb.firebaseio.com/livros.json",
      { method: "GET" }
    );

    if (!resultado.ok) {
      throw new Error("Erro ao buscar os dados do banco.");
    }

    const dados = await resultado.json();

    // Limpar opções existentes no select
    selectElement.innerHTML = '<option value="">Selecione um livro</option>';

    // Preencher o select apenas com os livros cujo status seja "estoque"
    Object.keys(dados).forEach((id) => {
      const livro = dados[id];
      if (livro.status === "estoque") {
        // Verifica se o status é "estoque"
        const titulo = livro.titulo || "Sem título";
        const option = document.createElement("option");
        option.value = id;
        option.textContent = titulo;
        selectElement.appendChild(option);
      }
    });
  } catch (error) {
    console.error("Erro ao popular o select:", error);
  }
};

// Função para carregar dados de um livro selecionado no formulário
livrosSelect.addEventListener("change", async () => {
  const id = livrosSelect.value;

  if (id) {
    try {
      const resultado = await fetch(
        `https://readfish-bce18-default-rtdb.firebaseio.com/livros/${id}.json`,
        { method: "GET" }
      );

      if (!resultado.ok) {
        throw new Error("Erro ao buscar os dados do livro.");
      }

      const dados = await resultado.json();

      // Preencher os campos do formulário
      form.titulo.value = dados.titulo || "";
      form.autor.value = dados.autor || "";
      form.ano.value = dados.ano || "";
      form.genero.value = dados.genero || "";
    } catch (error) {
      console.error("Erro ao carregar os dados do livro:", error);
    }
  } else {
    form.reset();
  }
});

// Evento de envio do formulário
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const telefoneRegex = /^\(\d{2}\) \d \d{4} \d{4}$/;

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const cpf = form.cpf.value.trim();
  const telefone = form.telefone.value.trim();
  const titulo = form.titulo.value.trim();
  const autor = form.autor.value.trim();
  const ano = form.ano.value.trim();
  const genero = form.genero.value.trim();
  const status = "alugado";

  let isValid = true;

  // Validação dos campos
  if (!emailRegex.test(email)) {
    mostrarErro(form.email, "Por favor, insira um email válido.");
    isValid = false;
  } else {
    limparErro(form.email);
  }

  if (!telefoneRegex.test(telefone)) {
    mostrarErro(
      form.telefone,
      "Por favor, insira um telefone no formato (00) 0 0000 0000."
    );
    isValid = false;
  } else {
    limparErro(form.telefone);
  }

  if (!cpfRegex.test(cpf)) {
    return false; // Formato inválido
  }

  // Remove pontos e traço do CPF
  const cleanedCPF = cpf.replace(/\D/g, "");

  // Verifica se todos os números são iguais (exemplo: "111.111.111-11")
  if (/^(\d)\1+$/.test(cleanedCPF)) {
    return false;
  }

  // Calcula os dígitos verificadores
  const calculateDigit = (cpfArray, factor) => {
    let total = 0;
    for (let i = 0; i < cpfArray.length; i++) {
      total += cpfArray[i] * factor--;
    }
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const cpfArray = cleanedCPF.split("").map(Number);

  // Calcula o primeiro dígito verificador
  const firstDigit = calculateDigit(cpfArray.slice(0, 9), 10);
  if (firstDigit !== cpfArray[9]) {
    mostrarErro(
      form.cpf,
      "O CPF é inválido. Verifique os números e tente novamente."
    );
    return false;
  } else {
    limparErro(form.cpf);
  }

  const secondDigit = calculateDigit(cpfArray.slice(0, 10), 11);
  if (secondDigit !== cpfArray[10]) {
    mostrarErro(
      form.cpf,
      "O CPF é inválido. Verifique os números e tente novamente."
    );
    return false;
  } else {
    limparErro(form.cpf);
  }
  if (!isValid) {
    return;
  }

  const livro = {
    nome,
    email,
    cpf,
    telefone,
    titulo,
    autor,
    ano,
    genero,
    status,
  };

  const id = livrosSelect.value;

  try {
    const resultado = await fetch(
      `https://readfish-bce18-default-rtdb.firebaseio.com/livros/${id}.json`,
      {
        method: "PUT",
        body: JSON.stringify(livro),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (resultado.ok) {
      alert("Livro atualizado com sucesso!");
      popularSelect();
      form.reset();
    } else {
      alert("Ocorreu um erro ao atualizar o livro.");
    }
  } catch (error) {
    alert(
      "Erro ao conectar ao servidor. Por favor, tente novamente mais tarde."
    );
    console.error(error);
  }
});

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", popularSelect);
