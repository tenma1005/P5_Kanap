/*=============================================================================================
SCRIPT DE LA PAGE D'ACCUEIL -> LE BUT EST DE FAIRE AFFICHER TOUS LES ARTICLES EN BASE DE DONNÉES
===============================================================================================*/

/*--------------------------------------------------------------------------
// PARTIE 1 : Appel de l'API de façon asynchrone
----------------------------------------------------------------------------*/

/* Pour commencer, on fait une fonction async qu'on appelle dataBase() pour récupérer l'URL de la base de 
   donnée et pour faire une promise (.then + .catch) en utilisant la méthode fetch */

/* Après ça, dans la fonction dataBase() On demande la réponse de l'API en format JSON en faisant un return */
async function dataBase() {
  return fetch("http://localhost:3000/api/products")
    .then(function (apiResponse) {
      return apiResponse.json();
    })
    .then(function (articlesList) {
      console.log("Liste des articles :");
      console.table(articlesList);

      return articlesList;
    })
    .catch(function (error) {
      document.querySelector(".titles").innerHTML = "<h1>Error</h1>";
      console.log(
        "Error, ça ne marche pas... À voir au niveau du script ou de l'API"
      );
      console.log(error);
      /* si ça ne fonctionne pas, on affiche un message dans la console et on change le titre h1... */
    });
}

/*--------------------------------------------------------------------------
// PARTIE 2 : Injection des resultats dans le html
----------------------------------------------------------------------------*/

/* Ensuite, on fait ensuite une fonction async que l'on nomme cardsKanap(), 
     on récupère après la réponse de la fonction dataBase() que l'on stocke dans une const qu'on nomme cards 
     (const pour éviter les modifs maladroites). Attention ne surtout pas oublier de mettre "await" pour dire
     que la fonction dataBase() est une "promise". C'est pour ça que la fonction cardsKanap() est async (obligatoire si on veut
      mettre "await" dedans...)
     Après avoir répupéré la fonction dataBase() puis stoké dans une constante, on lance une boucle pour afficher
     les articles dans la page d'accueil en rejoutant par la suite document.querySelector("#items").innerHTML  */

async function cardsKanap() {
  const articles = await dataBase();
  for (let article of articles) {
    document.querySelector(
      "#items"
    ).innerHTML += `<a href="product.html?id=${article._id}">
                    <article>
                      <img src="${article.imageUrl}" alt="${article.altTxt}">
                      <h3 class="cardName">${article.name}</h3>
                      <p class="cardDescription">${article.description}</p>
                    </article>
                  </a>`;
  }
}

/* Et pour finir, on appelle la fonction cardsKanap pour tout faire afficher en html 
     cela appellera automatiquement la fonction dataBase()*/
cardsKanap();
