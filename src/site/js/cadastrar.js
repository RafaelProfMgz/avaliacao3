const form = document.querySelector("#formulario");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const titulo = form.titulo.value.trim();
  const autor = form.autor.value.trim();
  const ano = form.ano.value.trim();
  const genero = form.genero.value.trim();
  const status = "estoque";


  const livro = {
    titulo,
    autor,
    ano,
    genero,
    status,
  };

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
