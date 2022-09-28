/*=============================================================================================
SCRIPT DE LA PAGE D'ACCUEIL -> LE BUT EST DE FAIRE AFFICHER TOUS LES PRODUITS EN BASE DE DONNÉE
===============================================================================================*/

/* Pour commencer, on fait une fonction async qu'on appelle dataBase() pour récupérer l'URL de la base de 
   donnée et pour faire une promise (.then + .catch) en utilisant la méthode fetch */

/* Après ça, dans la fonction dataBase() On demande la réponse de l'API en format JSON en fesant un return */
async function dataBase() {
  return fetch("http://localhost:3000/api/products")
    .then((apiResponse) => /*c'est un return */ apiResponse.json())
    .then((dataTable) => /*console.table (on fait un return...)*/ dataTable)
    .catch((error) => {
      document.querySelector(".titles").innerHTML = "<h1>error</h1>";
      console.log(
        "Error, ça ne marche pas... À voir au niveau du fichier script.js"
      );
      /* si ça ne fonctionne pas, on affiche un message dans la console et on change le titre h1 et on retire le titre h2... */
    });
}

/* Ensuite, on fait ensuite une fonction async que l'on nomme cardsKanap(), 
     on récupère après la réponse de la fonction dataBase() que l'on stocke dans une const qu'on nomme cards 
     (const pour éviter les modifs maladroites). Attention ne surtout pas oublier de mettre "await" pour dire
     que la fonction dataBase() est une "promise". C'est pour ça que la fonction cardsKanap() est async (obligatoire si on veut
      mettre "await" dedans...)
     Après avoir répupérer la fonction dataBase() puis stoké dans un constante, on lance une boucle pour afficher
     les produits dans la page d'acceuil en rejoutant par la suite document.querySelector("#items").innerHTML  */

async function cardsKanap() {
  const cards = await dataBase();
  for (let card of cards) {
    let i = 0;
    i < card.length;
    i++;
    document.querySelector("#items").innerHTML += `<a href="#">
                    <article>
                      <img src="${card.imageUrl}" alt="${card.altTxt}">
                      <h3 class="cardName">${card.name}</h3>
                      <p class="cardDescription">${card.description}</p>
                    </article>
                  </a>`;
  }
}

/* Et pour finir, on appelle la fonction cardsKanap pour tout faire afficher en html 
     cela appellera automatiquement la fonction dataBase()*/
cardsKanap();
