/*=============================================================================================
// SCRIPT DE LA PAGE DE L'ARTICLE SÉLECTIONNÉ
===============================================================================================*/

/*--------------------------------------------------------------------------
// PARTIE 1 : fonction de récupération de l'id du produit via l'URL
----------------------------------------------------------------------------*/
function idRecup() {
  let url = new URL(document.location);
  let idProduct = url.searchParams.get("id");
  // Affiche l'id de l'article dans la console
  console.log("id de l'article affiché : " + idProduct);
  return idProduct;
}

/*--------------------------------------------------------------------------
  //  PARTIE 2 : fonction de récupération des produits de l'api et traitement des données (voir script.js)
  ----------------------------------------------------------------------------*/
async function dataBase(articleId) {
  return fetch(`http://localhost:3000/api/products/${articleId}`)
    .then(function (apiResponse) {
      return apiResponse.json();
    })
    .then(function (article) {
      console.table(article);
      return article;
    })
    .catch(function (error) {
      document.querySelector(".item").innerHTML =
        "<h1>Erreur de chargement</h1>";
      console.log("Erreur de chargement des produits... Voir la ressource API");
      console.log(error);
    });
}

/*--------------------------------------------------------------------------
  //  PARTIE 3 : fonction d'affichage du produit de l'api
  ----------------------------------------------------------------------------*/

function articleDetails(article) {
  // Déclaration des variables de pointage des éléments
  let imageAlt = document.querySelector("article div.item__img");
  let titre = document.querySelector("#title");
  let prix = document.querySelector("#price");
  let description = document.querySelector("#description");
  let colorSelection = document.querySelector("#colors");

  // Ajout des éléments de manière dynamique
  imageAlt.innerHTML = `<img src="${article.imageUrl}" alt="${article.altTxt}">`;
  titre.textContent = `${article.name}`;
  prix.textContent = `${article.price}`;
  description.textContent = `${article.description}`;

  // Boucle pour chercher les couleurs pour chaque produit en fonction de sa clef/valeur

  for (let color of article.colors) {
    // Ajout des balises d'option couleur avec leur valeur
    colorSelection.innerHTML += `<option value="${color}">${color}</option>`;
  }
  console.log("affichage réussi...");
}

/*--------------------------------------------------------------------------
  // PARTIE 4 : Fonction asynchrone qui permet d'ajouter un objet au panier dans le local storage.
  ----------------------------------------------------------------------------*/

async function addArticleInLocalStorage() {
  // On stock l'id de l'article dans une variable
  const articleId = idRecup();

  // On récupère après la réponse de la fonction dataBase() que l'on stocke dans une const que l'on nomme article
  const article = await dataBase(articleId);

  // On active la fonction articleDetails, qui affiche tout sur le html (celui qui correspond à son id)
  articleDetails(article);

  // Récupèration de l'input 'quantity' avec une déclaration de variable
  const quantitySelection = document.querySelector("#quantity");

  // On écoute ce qu'il se passe sur le bouton #addToCart pour faire l'action et on récupère les différentes données des articles :
  document
    .querySelector("#addToCart")
    .addEventListener("click", function (event) {
      event.preventDefault();

      /*--------------------------------------------------------------------------
        // A/ Création d'objet articleCustomer pour stoker les données dans l'objet js
        ----------------------------------------------------------------------------*/
      const articleCustomer = {
        textAlt: article.altTxt,
        idArticle: article._id,
        imageArticle: article.imageUrl,
        nameArticle: article.name,
        colorArticle: colors.value,
        descriptionArticle: article.description,
        //priceArticle: article.price /*ATTENTION*/,
        quantityArticle: quantitySelection.value,
      };

      /*--------------------------------------------------------------------------
        // B/ conditions de validation du clic via le bouton ajouter au panier
        ----------------------------------------------------------------------------*/
      // Tant qu'il n'y a pas d'action sur la couleur et/ou la quantité, c'est 2 valeurs sont undefined et au lieu de valider ça affichera une alert()

      if (
        articleCustomer.colorArticle === "" ||
        articleCustomer.colorArticle === undefined
      ) {
        alert("Veuillez sélectionner une couleur");
      } else if (articleCustomer.quantityArticle === undefined) {
        alert("Veuillez choisir un nombre d'articles souhaités");
      } else if (
        articleCustomer.quantityArticle < 1 ||
        articleCustomer.quantityArticle > 100
      ) {
        alert("La quantité choisie doit être entre 1 et 100");
      } else {
        // On crée la variable qui sera ce qu'on récupère du local storage appelé basketCustomer et qu'on convertit en JSON.
        // Cette variable va stocker les key et value du local storage pour simplifier les choses.
        let basketCustomer = JSON.parse(localStorage.getItem("product"));

        // On crée la Fonction sendInLocalStorage pour pouvoir envoyer les données contenu dans l'objet js articleCustomer dans le localStorage.
        function sendInLocalStorage() {
          // Comparateur d'égalité des articles actuellement choisis et ceux déja choisis (et stoké)
          let articleTaked = basketCustomer.find(function (p) {
            return (
              p.idArticle == articleCustomer.idArticle &&
              p.colorArticle == articleCustomer.colorArticle
            );
          });
          if (articleTaked != undefined) {
            // On modifie la quantité d'un produit existant dans le panier du localstorage
            // Définition de additionQuantité qui est la valeur de l'addition de l'ancienne quantité parsée et de la nouvelle parsée pour le même produit
            let addArticleQuantity =
              parseInt(articleCustomer.quantityArticle) +
              parseInt(articleTaked.quantityArticle);
            articleTaked.quantityArticle = addArticleQuantity;

            // Si le client se retrouve avec une quantité totale supérieure à 100 (ce qui est possible en deux fois), on ramène la valeur à la quantité maximale autorisée, c'est-à-dire 100
            if (articleTaked.quantityArticle > 100) {
              articleTaked.quantityArticle = 100;
              alert(
                "Vous ne pouvez pas dépasser les 100 articles dans le panier... La quantité total a été ramené à 100"
              );
            }
          } else {
            // Si l'article exist pas dans le local storage, On envoi les données dans articleCustomer, puis on les ajoute au localStorage.
            articleCustomer.quantityArticle = articleCustomer.quantityArticle;
            basketCustomer.push(articleCustomer);
          }
          // Et enfin, on enregistre le panier dans le localStorage

          return (localStorage.product = JSON.stringify(basketCustomer));
        }

        // Pour finir cette partie, on place une condition pour validé le tout :
        if (basketCustomer) {
          sendInLocalStorage();
          window.location.href = "cart.html";
        } else if (basketCustomer == null) {
          // Au cas si la valeur est NULL pour éviter les messages d'erreur dans la console...
          basketCustomer = [];
          sendInLocalStorage();
          window.location.href = "cart.html";
        } else {
          console.log("error...");
        }
      }
    });
}

addArticleInLocalStorage();
