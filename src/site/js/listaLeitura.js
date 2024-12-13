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

const fecharModal = () => {
  modal.style.display = "none";
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

    livrosCompletos.forEach((livro) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${livro.titulo}</td>
        <td>${livro.autor}</td>
        <td>${livro.genero}</td>
        <td>${livro.ano}</td>
        <td>${livro.status}</td>
        <td>
          <button onclick="editar('${livro.id}')">Editar</button>
          <button onclick="remover('${livro.id}', '${livro.titulo}')">Excluir</button>
        </td>
      `;
      Tabela.appendChild(tr);
    });
  }
};
const remover = async (id, nomeLivro) => {
  // Exibe o modal de confirmação com o nome do livro
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
      lerDados(); // Atualiza os dados na tabela
    }
  }
};

// Função para gerar PDF
const gerarPDF = () => {
  const tabelaImpressao = document.createElement("div");
  tabelaImpressao.innerHTML = `
      <h2>Lista de Livros Lidos</h2>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Gênero</th>
            <th>Ano</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${Array.from(Tabela.rows)
            .map(
              (row) => `
            <tr>
              <td>${row.cells[0].innerText}</td>
              <td>${row.cells[1].innerText}</td>
              <td>${row.cells[2].innerText}</td>
              <td>${row.cells[3].innerText}</td>
              <td>${row.cells[4].innerText}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

  // Abre uma nova janela de impressão
  const janelaImpressao = window.open("", "", "width=800,height=600");
  janelaImpressao.document.write(
    "<html><head><title>Imprimir Tabela</title></head><body>"
  );
  janelaImpressao.document.write(tabelaImpressao.innerHTML);
  janelaImpressao.document.write("</body></html>");
  janelaImpressao.document.close();
  janelaImpressao.print();
};

lerDados();
