// Variáveis globais
let chaveOpenWeather = "cebcd482eda57fa9a6714c1c2ba91885"; // Sua chave de acesso do OpenWeatherMap
let chaveUnsplash = "UCtD2K53GX7zRRjmY8P8meANZ-YUIZOAzyg8mMAk_eE"; // Sua chave de acesso do Unsplash API

// Função para buscar a previsão do tempo
async function buscarCidade(cidade) {
  try {
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" + cidade + "&appid=" + chaveOpenWeather + "&lang=pt_br" +
      "&units=metric"
    );
    const dados = await response.json();

    if (response.ok) {
      colocarNaTela(dados);
      buscarImagemDaCidade(cidade);
    } else {
      console.error("Erro ao buscar dados da cidade.");
    }
  } catch (error) {
    console.error("Erro na requisição: ", error);
  }
}

// Função para buscar imagens do Unsplash e adicionar a legenda
async function buscarImagemDaCidade(cidade) {
  try {
    removerTodasAsLegendas(); // Remove todas as legendas existentes
    const randomizer = Math.floor(Math.random() * 1000); // Número aleatório para evitar repetições
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${cidade} city&client_id=${chaveUnsplash}&count=1&orientation=landscape&sig=${randomizer}`
    );
    const data = await response.json();

    if (data && data.length > 0 && data[0].urls && data[0].urls.regular) {
      document.body.style.backgroundImage = `url(${data[0].urls.regular})`;
      adicionarLegenda(cidade); // Chama a função para adicionar a legenda
    } else {
      // Caso não encontre uma imagem, você pode definir uma imagem de backup.
      document.body.style.backgroundImage =
        'url("https://source.unsplash.com/1600x900/?landscape")';
    }
  } catch (error) {
    console.error("Erro ao buscar imagem da cidade: ", error);
  }
}

// Função para adicionar a legenda da cidade
function adicionarLegenda(cidade) {
  const legenda = document.createElement("div");
  legenda.classList.add("legenda-cidade");
  legenda.textContent = cidade;
  document.body.appendChild(legenda);
}

// Função para remover todas as legendas da cidade (caso não haja imagem)
function removerTodasAsLegendas() {
  const legendasExistente = document.querySelectorAll(".legenda-cidade");
  legendasExistente.forEach((legenda) => {
    legenda.remove();
  });
}

// Função para atualizar informações na tela
function colocarNaTela(dados) {
  console.log(dados);
  document.querySelector(".cidade").innerHTML = "Tempo em " + dados.name;
  document.querySelector(".temp").innerHTML = Math.floor(dados.main.temp) + "°C";
  document.querySelector(".descricao").innerHTML = dados.weather[0].description;
  document.querySelector(".icone").src =
    "https://openweathermap.org/img/wn/" + dados.weather[0].icon + ".png";
}

// Função chamada ao clicar no botão
function cliqueiNoBotao() {
  const cidade = document.querySelector("#input-cidade").value;
  buscarCidade(cidade);
}

// Chama a função ao carregar a página (pode ser removido se não for necessário)
document.addEventListener("DOMContentLoaded", () => {
  const cidadePadrao = "Manaus"; // Cidade padrão
  buscarCidade(cidadePadrao);
});
