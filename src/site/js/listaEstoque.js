formulario.onsubmit = async (e) => {
  e.preventDefault();

  const idLivro = document.getElementById("modal").dataset.idLivro;
  const dadosLivro = {
    titulo: document.getElementById("titulo").value,
    autor: document.getElementById("autor").value,
    genero: document.getElementById("genero").value,
    ano: document.getElementById("ano").value,
    status: document.querySelector('input[name="status"]:checked').value,
  };

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
      .filter((livro) => livro.status === "estoque");

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

function imprimirPagina() {
  window.print(); // Isso vai abrir a janela de impressão
}

lerDados();
