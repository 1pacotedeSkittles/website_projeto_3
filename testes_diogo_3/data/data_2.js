//USA OS DADOS PARA CRIAR IMAGENS
function onDataReady(data) {
  //console.log('Dados recebidos:', data);
  
  const randomIndex = Math.floor(Math.random() * data.pirilau.length);
  const randomItem = data.pirilau[randomIndex];
  
  //Criamos os elementos apenas UMA vez (sem forEach)
  const container = document.createElement('div');
  const image = document.createElement('img');
  const text = document.createElement('p');

  image.src = randomItem.url; // Usa a propriedade url do JSON
  text.textContent = randomItem.text; // Usa a propriedade frase do JSON
     
  image.onload = () => console.log('✅ Imagem carregada:', randomItem.url);
  image.onerror = () => console.error('❌ Erro ao carregar:', randomItem.url);
  
  container.append(image);
  container.append(text);
  document.body.append(container);//PÁGINA HTML ADICIONA/COLA A IMAGEM NO FINAL DA PÁGINA
}

//CONVERSÂO DA RESPOSTA EM JSON
function onResponse(response) {
  return response.json();  
}

fetch('data/data.json')  //IR BUSCAR O FCIHEIRO DATA.JSON
  .then(onResponse)
  .then(onDataReady)
  .catch(error => console.error('Erro:', error));
