// Regex para validação
const regexCPF = /^(?:\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

formulario.onsubmit = async (e) => {
  e.preventDefault();

  const idLivro = document.getElementById("modal").dataset.idLivro;
  const dadosLivro = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    cpf: document.getElementById("cpf").value,
    titulo: document.getElementById("titulo").value,
    autor: document.getElementById("autor").value,
    genero: document.getElementById("genero").value,
    ano: document.getElementById("ano").value,
    status: document.querySelector('input[name="status"]:checked').value,
  };

  // Validação de Email
  if (!regexEmail.test(dadosLivro.email)) {
    mostrarErro(
      document.getElementById("email"),
      "Por favor, insira um email válido."
    );
    return;
  } else {
    limparErro(document.getElementById("email"));
  }

  // Validação de CPF
  if (!regexCPF.test(dadosLivro.cpf)) {
    mostrarErro(
      document.getElementById("cpf"),
      "Por favor, insira um CPF válido."
    );
    return;
  } else {
    limparErro(document.getElementById("cpf"));
  }

  let resultado;

  if (idLivro) {
    resultado = await fetch(
      `https://readfish-bce18-default-rtdb.firebaseio.com/livros/${idLivro}.json`,
      {
        method: "PUT",
        body: JSON.stringify(dadosLivro),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else {
    resultado = await fetch(
      "https://readfish-bce18-default-rtdb.firebaseio.com/livros.json",
      {
        method: "POST",
        body: JSON.stringify(dadosLivro),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (resultado.ok) {
    alert(
      idLivro
        ? "Livro atualizado com sucesso!"
        : "Livro adicionado com sucesso!"
    );
    fecharModal();
    lerDados();
  } else {
    alert("Erro ao salvar o livro.");
  }
};

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

function limparErro(input) {
  const erro = input.nextElementSibling;
  if (erro && erro.classList.contains("erro")) {
    erro.textContent = "";
  }
}

const fecharModal = () => {
  modal.style.display = "none";
};

const editar = async (id) => {
  const resultado = await fetch(
    `https://readfish-bce18-default-rtdb.firebaseio.com/livros/${id}.json`,
    { method: "GET" }
  );

  if (resultado.ok) {
    const livro = await resultado.json();

    document.getElementById("nome").value = livro.nome;
    document.getElementById("email").value = livro.email;
    document.getElementById("cpf").value = livro.cpf;
    document.getElementById("titulo").value = livro.titulo;
    document.getElementById("autor").value = livro.autor;
    document.getElementById("genero").value = livro.genero;
    document.getElementById("ano").value = livro.ano;

    document.querySelector(
      `input[name="status"][value="${livro.status}"]`
    ).checked = true;

    document.getElementById("modal").dataset.idLivro = id;

    modal.style.display = "block";
  }
};

const Tabela = document.querySelector("#tabela");
const lerDados = async () => {
  const resultado = await fetch(
    "https://readfish-bce18-default-rtdb.firebaseio.com/livros.json",
    {
      method: "GET",
    }
  );

  if (resultado.ok) {
    Tabela.innerHTML = "";
    const dados = await resultado.json();

    const livrosCompletos = Object.keys(dados)
      .map((id) => ({
        id,
        ...dados[id],
      }))
      .filter((livro) => livro.status === "lista");


    if (livrosCompletos.length === 0) {
      const mensagem = document.createElement("div");
      mensagem.classList.add("nenhum-livro");
      mensagem.innerHTML = "Nenhum livro encontrado.";
      Tabela.appendChild(mensagem); 
    } else {
      // Exibe os livros na tabela
      livrosCompletos.forEach((livro) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${livro.nome}</td>
          <td>${livro.cpf}</td>
          <td>${livro.email}</td>
          <td>${livro.titulo}</td>
          <td>${livro.autor}</td>
          <td>${livro.genero}</td>
          <td>${livro.ano}</td>
          <td>${livro.status}</td>
          <td class="button-td">
            <button onclick="editar('${livro.id}')">Editar</button>
            <button onclick="remover('${livro.id}', '${livro.titulo}')">Excluir</button>
          </td>
        `;
        Tabela.appendChild(tr);
      });
    }
  }
};

const remover = async (id, nomeLivro) => {
  const confirmacao = confirm(
    `Tem certeza que deseja excluir o livro "${nomeLivro}"?`
  );

  if (confirmacao) {
    const resultado = await fetch(
      `https://readfish-bce18-default-rtdb.firebaseio.com/livros/${id}.json`,
      {
        method: "DELETE",
      }
    );

    if (resultado.ok) {
      window.alert("Livro deletado");
      lerDados(); 
    }
  }
};

function imprimirPagina() {
  window.print();
}

lerDados();
