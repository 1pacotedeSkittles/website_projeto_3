//USA OS DADOS PARA CRIAR IMAGENS
function onDataReady(data) {
  //console.log('Dados recebidos:', data);
  
// Usamos o método sort com um valor aleatório entre -0.5 e 0.5
  const listaBaralhada = data.pirilau.sort(() => Math.random() - 0.5);

  // 2. Usamos o forEach para percorrer os 43 itens agora baralhados
  listaBaralhada.forEach(item => {
    const container = document.createElement('div');
    const image = document.createElement('img');

    image.src = item.url;
    
    //ajuste átoa das imagens
    image.style.width = '200px'; 
    image.style.margin = '10px';

    image.onload = () => console.log('✅ Carregada:', item.url);
    image.onerror = () => console.error('❌ Erro:', item.url);

    container.append(image);
    document.body.append(container);
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
