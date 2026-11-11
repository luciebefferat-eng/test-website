const basket = []; // en dehors de init pour que le panier survive entre les clics



async function loadData() {
  const response = await fetch('ghg-per-kg-poore.csv');   // const dit qu'elle ne sera pas reassigné
  const text = await response.text();
  //console.log(text);
  //console.log(text.trim())
  const text_nettoye = text.trim()
  const text2 = text_nettoye.split("\n")
  console.log(text2);
  
  // creer la table ou on y ajoute chaque objet
  const table = [];
  for(let i = 1; i < text2.length; i++){
    const ligne = text2[i].trim(); // enlever les /r en fin de ligne 
    const columns = ligne.split(';');
    const food = {
      name : columns[0],
      co2 : Number(columns[1]),
      type : columns[2]
    };
    table.push(food);
  }
  return table

}

async function init() {
  const table = await loadData();
  //console.log(table);

  // 1. Recuperer les éléments de la page
  const selection = document.getElementById('food-select');
  const quantityInput = document.getElementById('quantity');
  const addButton = document.getElementById('add-button');
  const basketList = document.getElementById('basket');
  const totalEl = document.getElementById('total');
  const messageEl = document.getElementById('message');
  
  
  
  // 2. Remplir le menu déroulant des élèments de notre table
  for(let i=0; i < table.length; i++){
    const aliment = document.createElement('option')
    const food = table[i]
    aliment.textContent = food.name
    aliment.value = i 
  
    selection.appendChild(aliment)
  }
  /* test
  selection.addEventListener('change', function () {
  console.log(selection.value);
  });*/

  // 3. Afficher le panier + le total
  function renderBasket(){
    basketList.innerHTML = '';  // vider la liste du panier avant de la refaire, eviter les doublons
    let total = 0;

    for (let i=0; i< basket.length; i++){   // ou existe basket
      const item = basket[i];
      total += item.impact;

      const li = document.createElement('li');
      li.textContent = `${item.name} – ${item.grams} g – ${item.impact.toFixed(2)} kg CO2 eq `;

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', function () { // seulement si le bouton remove est declenché
        basket.splice(i, 1);   // retire la ligne i du tableau
        renderBasket();        // et on réaffiche ,
      });

      li.appendChild(removeButton);
      basketList.appendChild(li);
    }

    totalEl.textContent = `Total: ${total.toFixed(2)} kg CO2 eq`;

  }

  // 4. Au clic sur "Add"
  addButton.addEventListener('click', function() {
    const food = table[Number(selection.value)];
    const grams = Number(quantityInput.value);

    // validation : vide, 0, negatif ou pas un nombre
    if (!grams || grams <= 0){
      messageEl.textContent = 'Please enter a quantity greater than 0.'
      return;
    }
    messageEl.textContent = '';

    basket.push({
      name: food.name,
      grams: grams,
      impact : (grams / 1000) * food.co2  // conversion en kg 
    });

    renderBasket();
    quantityInput.value = '';

  });
  
  renderBasket();

}

init();