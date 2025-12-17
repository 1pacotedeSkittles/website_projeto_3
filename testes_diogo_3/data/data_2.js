//USA OS DADOS PARA CRIAR IMAGENS
function onDataReady(data) {
  //console.log('Dados recebidos:', data);
  
  const randomIndex = Math.floor(Math.random() * data.pirilau.length);
  const randomUrl = data.pirilau[randomIndex];

  //VAI BUSCAR O ARRAY DATA:PIRILAU E CORRE CADA UM INDIVIDUALMENTE
  data.pirilau.forEach(url => {
    const image = document.createElement('img');//CRIAÇÂO DO ELEMENTO IMG
    image.src = randomUrl;//SRC DEFINE QUAL IMAGEM VAI APARECER
    
    image.onload = () => console.log('✅ Imagem carregada:', url);
    image.onerror = () => console.error('❌ Erro ao carregar:', url);
    
    document.body.append(image);//PÁGINA HTML ADICIONA/COLA A IMAGEM NO FINAL DA PÁGINA
  });
}

//CONVERSÂO DA RESPOSTA EM JSON
function onResponse(response) {
  return response.json();  
}

fetch('data/data.json')  //IR BUSCAR O FCIHEIRO DATA.JSON
  .then(onResponse)
  .then(onDataReady)
  .catch(error => console.error('Erro:', error));
