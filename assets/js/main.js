var arraySalvos = JSON.parse(localStorage.getItem("salvos")) || [];

var results = document.getElementById("results");
var resultsSalvos = document.getElementById("results_save");
var resultTitle = document.getElementById("results_title");
var searchInput = document.getElementById("search_input");
var searchButton = document.getElementById("btn_pesquisar");
var searchNumbers = document.getElementById("search_number");
var clearButton = document.getElementById("btn_limpar");
var salvar = document.getElementById("salvar");

var flag = true;

var response = undefined;

var tmdb = {
  // atributos

  // métodos
  pesquisar: function () {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      encodeURI(
        `https://api.themoviedb.org/3/search/movie?api_key=cb1577bb4988e064535e2a09713cc852&language=pt-br&include_adult=false&query=${searchInput.value}`
      )
    );
    xhr.send(null);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status == 200) {
          response = JSON.parse(xhr.responseText);
          // limpar os resultados anteriores se houverem.
          results.innerHTML = "";
          // apagar o conteúdo da caixa de consulta
          searchInput.value = "";

          // mostrar a quantidade de resultados obtidos
          resultTitle.style.display = "block";

          for (i = 0; i < response.results.length; i++) {
            // criar um elemento li
            var li = document.createElement("li");

            // criar um elemento img
            var img = document.createElement("img");
            img.setAttribute(
              "src",
              `https://image.tmdb.org/t/p/w500${response.results[i].poster_path}`
            );
            li.appendChild(img);

            // span
            var span = document.createElement("span");
            var spanText = document.createTextNode(response.results[i].title);
            span.appendChild(spanText);
            li.appendChild(span);

            // Paragrafo
            var description;
            if (response.results[i].overview == "") {
              description = "Sem descrição...";
            } else {
              description = response.results[i].overview;
            }

            var paragrafo = document.createElement("p");
            var paragrafoText = document.createTextNode(description);
            paragrafo.appendChild(paragrafoText);
            li.appendChild(paragrafo);

            // botão salvar
            var button = document.createElement("button");
            button.innerHTML = "Salvar";
            button.setAttribute(
              "onclick",
              `tmdb.salvar(${JSON.stringify(response.results[i])});`
            );
            li.appendChild(button);

            // não esquecer de appendar o li
            results.appendChild(li);
          } // fim do for

          // mostra valor dos resultados
          searchNumbers.innerText = `(${response.results.length})`;
        }
      }
    };
  }, // fim pesquisar

  salvar: function (data) {
    // limpar os resultados anteriores se houverem.
    resultsSalvos.innerHTML = "";
    // apagar o conteúdo da caixa de consulta
    searchInput.value = "";

    if(data !== undefined && arraySalvos.length !== 0){
      for(var i=0; i < arraySalvos.length; i++){
        if(data.id === arraySalvos[i].id){
          flag = false
        }
      }
    }
    if (data !== undefined && flag) {
      arraySalvos.push(data);
    }
    flag = true;

    for (i = 0; i < arraySalvos.length; i++) {
      // criar um elemento li
      var li = document.createElement("li");

      // criar um elemento img
      var img = document.createElement("img");
      img.setAttribute(
        "src",
        `https://image.tmdb.org/t/p/w500${arraySalvos[i].poster_path}`
      );
      li.appendChild(img);

      // span
      var span = document.createElement("span");
      var spanText = document.createTextNode(`${arraySalvos[i].title} (${arraySalvos[i].release_date.split("-",1)})`);
      span.appendChild(spanText);
      li.appendChild(span);

      // Paragrafo
      var description;
      if (arraySalvos[i].overview == "") {
        description = "Sem descrição...";
      } else {
        description = arraySalvos[i].overview;
      }

      var paragrafo = document.createElement("p");
      var paragrafoText = document.createTextNode(description);
      paragrafo.appendChild(paragrafoText);
      li.appendChild(paragrafo);

      // botão remover
      var button = document.createElement("button");
      button.innerHTML = "Remover";
      button.setAttribute(
        "onclick",
        `tmdb.limparSalvos(${JSON.stringify(arraySalvos[i])});`
      );

      li.appendChild(button);
      // não esquecer de appendar o li
      resultsSalvos.append(li);
    } // fim do for
    localStorage.setItem("salvos", JSON.stringify(arraySalvos));
  },

  limpar: function () {
    // limpar os resultados anteriores se houverem.
    results.innerHTML = "";
    // apagar o conteúdo da caixa de consulta
    searchInput.value = "";
    // apagar valor dos resultados
    searchNumbers.innerText = ``;
    // esconder a quantidade de resultados obtidos
    resultTitle.style.display = "none";
  },

  // a função limparSalvos recebe um parametro("salvo"), e filtra no array("arraySalvos") com outro parametro("filme").
  limparSalvos: function (salvo) {
    arraySalvos = arraySalvos.filter(function (filme) {
      return filme.id !== salvo.id;
    });
    // chama a função e envia a variavel com o array para o banco de dados.
    tmdb.salvar();
  },
};

// faz a tecla enter precionar o botão
searchInput.addEventListener("keypress", function (evento) {
  if (evento.key === "Enter") {
    evento.preventDefault();
    searchButton.click();
  }
});

tmdb.salvar();
