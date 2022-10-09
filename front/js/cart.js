/*=============================================================================================
SCRIPT DE LA PAGE PANIER -> LE BUT EST DE FAIRE AFFICHER TOUS LES PRODUITS DANS LE LOCAL STORAGE
                            POUR POUVOIR ENVOYER LA COMMANDE VIA UN FORMULAIRE
===============================================================================================*/

/*--------------------------------------------------------------------------
// PARTIE 1 : AFFICHAGE DU PANIER CLIENT
----------------------------------------------------------------------------*/

// On crée une nouvelle variable basketCustomer récupère les données stocké du local storage en format JSON (tout comme le script product.js)
let basketCustomer = JSON.parse(localStorage.getItem("product"));

// Pour éviter les erreurs dans la console lorsque basketCustomer est null...
if (basketCustomer == null) {
  basketCustomer = [];
}

//--------------------------------------------------------------
// A/ Fonction qui va déterminer les conditions d'affichage des produits du panier dans le html
//--------------------------------------------------------------

function displayBasket() {
  // Pour afficher après un tableau dans la console pour voir les détails des articles sélectionnés
  const tableBasket = basketCustomer;
  // Déclaration des variables pour le prix total du panier, de la quantité total des articles sélectionné et du code html des articles sélectionné.
  let totalArticleNumber = 0;
  let totalCost = 0;
  let viewBasket = [];

  // Condition d'affichage dans le html si le panier est vide
  if (basketCustomer.length == 0) {
    console.log("le panier est vide");
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
      "Vous n'avez pas d'article dans votre panier";
  }
  /*




  */

  //--------------------------------------------------------------
  // Boucle d'affichage du panier à partir du local storage
  //--------------------------------------------------------------

  for (i = 0; i < basketCustomer.length; i++) {
    // Calcul de la quantité d'article total dans le panier :
    totalArticleNumber += parseInt(basketCustomer[i].quantityArticle, 10);

    // Calcul du prix total dans le panier :
    totalCost +=
      basketCustomer[i].quantityArticle * basketCustomer[i].priceArticle;

    // On crée les affichages des produits du panier via un innerHTML dans le code html :
    viewBasket = document.getElementById("cart__items").innerHTML =
      viewBasket +
      `
  <article class="cart__item" data-id=${basketCustomer[i].idArticle} data-color="${basketCustomer[i].colorArticle}">
              <div class="cart__item__img">
                <img src="${basketCustomer[i].imageArticle}" alt="${basketCustomer[i].textAlt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${basketCustomer[i].nameArticle}</h2>
                  <p>${basketCustomer[i].colorArticle}</p>
                  <p>${basketCustomer[i].priceArticle} € / pièce</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Quantité</p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basketCustomer[i].quantityArticle}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>
            `;
  }
  // On injecte le résultat du prix et de la quantité dans le HTML :
  document.getElementById("totalPrice").innerHTML = totalCost;
  document.getElementById("totalQuantity").innerHTML = totalArticleNumber;

  // Affichage dans la console bien indiquer :
  console.log("Prix total : " + totalCost);
  console.log("Nombre total d'article : " + totalArticleNumber);
  console.log(viewBasket);
  console.log("Détails des articles du panier dans le tableau ci-dessous :");
  console.table(tableBasket);
}

displayBasket();
/*






















*/
//--------------------------------------------------------------
//  B/ Fonction de supression d'un article du panier (dynamiquement) et donc de l'affichage
//--------------------------------------------------------------

function deleteArticle() {
  // On crée une boucle dans le local storage avec un addEventListener pour supprimer les produits dynamiquement :
  for (let i = 0; i < basketCustomer.length; i++) {
    document
      .querySelectorAll(".cart__item__content__settings__delete > .deleteItem")
      [i].addEventListener("click", function (e) {
        e.preventDefault();

        // Va filtrer les objets n'ayant pas la même ID ou la même couleur que l'élément cliqué pour évité de supprimer des articles qu'on ne veux pas supprimer
        // Cela va permettre de supprimer un article qui correspond à son id et à sa couleur
        basketCustomer = basketCustomer.filter(function (el) {
          return (
            el.idArticle !== basketCustomer[i].idArticle ||
            el.colorArticle !== basketCustomer[i].colorArticle
          );
        });

        // On fait ensuite la modif dans le local storage en transformant le tout en chaine de caractère grâce à stringify.
        localStorage.product = JSON.stringify(basketCustomer);

        // On met un message dans la console pour confirmer la suppression :
        console.log("Article supprimer");

        // on raffraichit l'affichage la page avec reload() qui va afficher le panier modifier
        location.reload();
      });
  }
}
// Pour finir cette sous-partie, on appel de la fonction deleteArticle
deleteArticle();
/*


































*/
//--------------------------------------------------------------
//  C/ Fonction qui va modifier un article du panier dynamiquement
//--------------------------------------------------------------

function modifyQuantity() {
  // On déclare une variable "quantitySelected" pour stoké l'input .itemQuantity avec un querySelectorAll ET ensuite faire une boucle
  const quantitySelected = document.querySelectorAll(".itemQuantity");
  // Cette boucle va servir à repérer les changements dans l'input que le client aura modifié avec un addEventListener. Une fonction se lance dès que le client voudra mofifier la quantité
  for (let i = 0; i < quantitySelected.length; i++) {
    quantitySelected[i].addEventListener("input", function () {
      // On met la nouvelle valeur de l'input quantitySelected[i].value dans le le localStorage
      basketCustomer[i].quantityArticle = quantitySelected[i].value;

      // Applique immédiatement les changements dans le local storage :
      localStorage.product = JSON.stringify(basketCustomer);

      // On raffraichit l'affichage la page avec reload() qui va afficher le panier modifier
      location.reload();
    });
  }
}

modifyQuantity();
/*



























































*/
/*--------------------------------------------------------------------------
// PARTIE 2 : LA VALIDATION DU FORMULAIRE
----------------------------------------------------------------------------*/

//--------------------------------------------------------------
//  A/ On stoke les Regex dans des variables :
//--------------------------------------------------------------

// /^ début du regex qui valide les caratères a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ aussi les espaces blancs et tiret \s- comprit entre 1 et 31 caratères {1,31} et on termine la regex $/i en indiquant que les éléments selectionnés ne sont pas sensible à la casse
const regexName = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;

// /^ début du regex qui valide les caratères chiffre lettre et caratères spéciaux a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ aussi les espaces blancs et tiret \s- comprit entre 1 et 60 caratères {1,60} et on termine la regex $/i en indiquant que les éléments selectionnés ne sont pas sensible à la casse
const regexAddress = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,90}$/i;

const regexCity = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;

const regexMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/;

/*
















*/
//--------------------------------------------------------------
//  B/ Fonction qui va envoyer le formulaire si toutes les conditions sont ok
//--------------------------------------------------------------

function form(e) {
  // e.preventDefault() indique que si l'event n'est pas bien géré, l'action par défaut ne devrait pas être exécutée comme elle l'est normalement.
  e.preventDefault();

  // Déclaration de la variable isValided. On met comme valeur un boolean "true", ce qui va permettre de vérifier si les conditions sont toutes remplis
  // Pour remplir ces conditions, le client doit bien rempli le formulaire sinon isValided deviens false et affiche un message d'erreur s'il y a au moins une condition non respecté...
  // Pour cela, la fonction conditionForm() va permettre de verifier toutes les regex avec les conditions.

  let isValided = true;

  function conditionForm() {
    // .match() va permettre d'appliquer correctement les regex désignées

    // Condition du prénom :
    if (document.getElementById("firstName").value.trim().match(regexName)) {
      document.getElementById("firstNameErrorMsg").innerText = "";
    } else {
      isValided = false;
      document.getElementById("firstNameErrorMsg").innerText =
        "Veuillez entrer un prénom valide.";
    }

    // Condition du nom :
    if (document.getElementById("lastName").value.trim().match(regexName)) {
      document.getElementById("lastNameErrorMsg").innerText = "";
    } else {
      isValided = false;
      document.getElementById("lastNameErrorMsg").innerText =
        "Veuillez entrer un nom valide.";
    }

    // Condition de l'adresse :
    if (document.getElementById("address").value.trim().match(regexAddress)) {
      document.getElementById("addressErrorMsg").innerText = "";
    } else {
      isValided = false;
      document.getElementById("addressErrorMsg").innerText =
        "Veuillez entrer une adresse valide.";
    }

    // Condition de la ville :
    if (document.getElementById("city").value.trim().match(regexCity)) {
      document.getElementById("cityErrorMsg").innerText = "";
    } else {
      isValided = false;
      document.getElementById("cityErrorMsg").innerText =
        "Veuillez entrer un nom de ville correct.";
    }

    // Condition de l'email :
    if (document.getElementById("email").value.trim().match(regexMail)) {
      document.getElementById("emailErrorMsg").innerText = "";
    } else {
      isValided = false;
      document.getElementById("emailErrorMsg").innerText =
        "Veuillez entrer une  adresse mail valide.";
    }
  }

  conditionForm();
  /*
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  */
  // La fonction requestBody() va récupèrer les valeurs écrites dans les inputs.

  function requestBody() {
    // Va effectuer une boucle à l'interieur et on placera les id du/des article(s) dans la variable idProducts.
    // On crée aussi un objet contact dans lequel on entre les données des inputs saisie par le client.

    let idProducts = [];
    for (let i = 0; i < basketCustomer.length; i++) {
      idProducts.push(basketCustomer[i].idArticle);
    }

    // On prépare les données pour l'envoie en POST.
    const theOrder = {
      contact: {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
      },
      // Et enfin un products avec l'id des articles récupérer dans la boucle.
      products: idProducts,
    };
    return theOrder;
  }
  /*
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  */

  // Fonction postMethod qui va permet de vérifier toutes les conditions sont ok pour l'envoie du formulaire
  function postMethod() {
    // Si isValided === true on envoit le formulaire.
    if (isValided === true) {
      // Mais si les conditions sont ok et que le panier est vide, on bloque l'envoie du formulaire avec un return. Hors de question de traiter une commande vide...
      if (basketCustomer.length === 0) {
        alert("Panier vide. Veuillez choisir un article.");
        return;
      }

      fetch("http://localhost:3000/api/products/order", {
        // On utilise la méthode POST pour envoyer les données saisie au serveur
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // On récupère le tableau contact qu'on a déclarer juste avant en activant la fonction requestBody().
        body: JSON.stringify(requestBody()),
      })
        .then(function (apiResponse) {
          return apiResponse.json();
        })

        .then(function (data) {
          const orderId = data.orderId;
          // Nous affiche la page confirmation.html avec un message de confirmation + le numéro de commande si toutes les conditions du script sont ok.
          // Aussi, sur l'url de la page de confirmation on rajoute le numéro de commande directement dans l'url
          window.location.href =
            "/front/html/confirmation.html" + "?orderId=" + orderId;

          // Pour afficher le tableau de la commande dans la console de la page confirmation.html
          return console.table(data);
        })
        // S'il y a une erreur et que le client ne peut pas validé la commande, on l'invite à contacter l'entreprise pour qu'elle puisse validé la commande manuellement
        .catch(function (error) {
          alert(
            "Erreur d'envoi du formulaire. Merci de nous contacter au 01 23 45 67 89 pour qu'on vous confirme votre commande."
          ) + error;
        });
    }
  }

  postMethod();
}
/*














*/
//--------------------------------------------------------------
//  C/ Pour finir on appel la fonction avec un addEventListener
//--------------------------------------------------------------
//
document.querySelector("#order").addEventListener("click", function (e) {
  return form(e);
});
