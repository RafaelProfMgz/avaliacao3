const form = document.querySelector("#formulario");
// CREATE
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const livro = {
    titulo: form.titulo.value,
    autor: form.autor.value,
    ano: form.ano.value,
    genero: form.genero.value,
    status: form.status.value,
  };

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
    window.alert("Livro cadastrado");
    form.reset();
  }
});




