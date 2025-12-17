function onDataReady(data) {
  console.log('Dados recebidos:', data);
  
  // Percorre o array de imagens
  data.pirilau.forEach(url => {
    const image = document.createElement('img');
    image.src = url;
    
    image.onload = () => console.log('✅ Imagem carregada:', url);
    image.onerror = () => console.error('❌ Erro ao carregar:', url);
    
    document.body.append(image);
  });
}

function onResponse(response) {
  return response.json();  // ← Usa .json() em vez de .text()
}

fetch('data/data.json')  // ← Muda para data.json
  .then(onResponse)
  .then(onDataReady)
  .catch(error => console.error('Erro:', error));
