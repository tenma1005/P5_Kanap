/*=============================================================================================
SCRIPT DE LA PAGE PANIER -> LE BUT EST DE FAIRE AFFICHER TOUS LES ARTICLES DANS LE LOCAL STORAGE
                            POUR POUVOIR ENVOYER LA COMMANDE VIA UN FORMULAIRE
===============================================================================================*/
async function theCart() {
  let fetchPrice;

  // Pour commencer, pour que l'on puisse afficher le(s) prix dans le panier, on utilise la méthode fetch pour récupérer l'API
  await fetch("http://localhost:3000/api/products")
    .then(function (res) {
      return res.json();
    })
    .then(function (articleList) {
      return (fetchPrice = articleList);
    })
    .catch(function (error) {
      return console.log("Voir au niveau de l'API ce qu'il ne va pas" + error);
    });

  /*--------------------------------------------------------------------------
// PARTIE 1 : AFFICHAGE DU PANIER CLIENT
----------------------------------------------------------------------------*/

  // On crée une nouvelle variable basketCustomer récupère les données stockées du local storage en format JSON (tout comme le script product.js)
  let basketCustomer = JSON.parse(localStorage.getItem("product"));

  // Pour éviter les erreurs dans la console lorsque basketCustomer est null...
  if (basketCustomer == null) {
    basketCustomer = [];
  }

  //--------------------------------------------------------------
  // A/ Fonction qui va déterminer les conditions d'affichage des articles du panier dans le html
  //--------------------------------------------------------------

  function displayBasket() {
    // Pour afficher après un tableau dans la console pour voir les détails des articles sélectionnés
    const tableBasket = basketCustomer;
    // Déclaration des variables pour le prix total du panier, de la quantité total des articles sélectionnés et du code html des articles sélectionné.
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

    //--------------------------------------------------------------
    // Boucle d'affichage du panier à partir du local storage
    //--------------------------------------------------------------

    for (i = 0; i < basketCustomer.length; i++) {
      // Calcul de la quantité d'articles total dans le panier :
      totalArticleNumber += parseInt(basketCustomer[i].quantityArticle, 10);

      // Calcul du prix total dans le panier :
      totalCost += basketCustomer[i].quantityArticle * fetchPrice[i].price;

      // On crée l'affichage des articles du panier via un innerHTML dans le code html :
      viewBasket = document.getElementById("cart__items").innerHTML += `
  <article class="cart__item" data-id=${basketCustomer[i].idArticle} data-color="${basketCustomer[i].colorArticle}">
              <div class="cart__item__img">
                <img src="${basketCustomer[i].imageArticle}" alt="${basketCustomer[i].textAlt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${basketCustomer[i].nameArticle}</h2>
                  <p>${basketCustomer[i].colorArticle}</p>
                  <p>${fetchPrice[i].price} €</p>
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

    // Affichage dans la console pour bien indiquer :
    console.log("Prix total : " + totalCost);
    console.log("Nombre total d'article : " + totalArticleNumber);
    console.log(viewBasket);
    console.log("Détails des articles du panier dans le tableau ci-dessous :");
    console.table(tableBasket);
  }

  displayBasket();

  //--------------------------------------------------------------
  //  B/ Fonction de suppression d'un article du panier (dynamiquement) et donc de l'affichage
  //--------------------------------------------------------------

  function deleteArticle() {
    // On crée une boucle dans le local storage avec un addEventListener pour supprimer les articles dynamiquement :
    for (let i = 0; i < basketCustomer.length; i++) {
      document
        .querySelectorAll(
          ".cart__item__content__settings__delete > .deleteItem"
        )
        [i].addEventListener("click", function (e) {
          e.preventDefault();

          // Va filtrer les objets n'ayant pas la même ID ou la même couleur que l'élément cliqué pour éviter de supprimer des articles qu'on ne veut pas supprimer
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

          // On rafraichit l'affichage la page avec reload() qui va afficher le panier modifier
          location.reload();
        });
    }
  }
  // Pour finir cette sous-partie, on appelle de la fonction deleteArticle
  deleteArticle();

  //--------------------------------------------------------------
  //  C/ Fonction qui va modifier un article du panier dynamiquement
  //--------------------------------------------------------------

  function modifyQuantity() {
    // On déclare une variable "quantitySelected" pour stocker l'input .itemQuantity avec un querySelectorAll ET ensuite faire une boucle
    const quantitySelected = document.querySelectorAll(".itemQuantity");
    // Cette boucle va servir à repérer les changements dans l'input que le client aura modifié avec un addEventListener. Une fonction se lance dès que le client voudra modifier la quantité
    for (let i = 0; i < quantitySelected.length; i++) {
      quantitySelected[i].addEventListener("input", function () {
        // On met la nouvelle valeur de l'input quantitySelected[i].value dans le le local storage
        basketCustomer[i].quantityArticle = quantitySelected[i].value;

        // Si la quantitée modifiée manuellement au clavier est supérieure à 100, on ramène la valeur automatiquement à 100 qui est la valeur maximale autorisée.

        if (basketCustomer[i].quantityArticle > 100) {
          basketCustomer[i].quantityArticle = 100;
          // Et un message au client pour aller avec ceci
          alert(
            "Vous ne pouvez pas dépasser les 100 articles dans le panier... La quantité total a été ramené à 100"
          );
        }

        // Si la quantité modifiée manuellement au clavier est inférieure à 1 (qui peut-être 0 ou un négatif), on ramène la valeur automatiquement à 1 qui est la valeur minimale autorisée. S'il n'en veut plus, il cliquera sur le bouton supprimer...
        if (basketCustomer[i].quantityArticle < 1) {
          basketCustomer[i].quantityArticle = 1;
          // Et un message au client pour aller avec ceci
          alert(
            "Vous ne pouvez pas aller en dessous de 1 article dans le panier... La quantité total a été ramené à 1... Sinon supprimez-le"
          );
        }

        // Applique immédiatement les changements dans le local storage :
        localStorage.product = JSON.stringify(basketCustomer);

        // On rafraichit l'affichage la page avec reload() qui va afficher le panier modifié
        location.reload();
      });
    }
  }

  modifyQuantity();

  /*--------------------------------------------------------------------------
// PARTIE 2 : LA VALIDATION DU FORMULAIRE
----------------------------------------------------------------------------*/

  //--------------------------------------------------------------
  //  A/ On stocke les Regex dans des variables :
  //--------------------------------------------------------------

  // /^ début du regex qui valide les caratères a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ aussi les espaces blancs et tiret \s- comprit entre 1 et 31 caratères {1,31} et on termine la regex $/i en indiquant que les éléments selectionnés ne sont pas sensible à la casse
  const regexName = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;

  // /^ début du regex qui valide les caratères chiffre lettre et caratères spéciaux a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ aussi les espaces blancs et tiret \s- comprit entre 1 et 60 caratères {1,60} et on termine la regex $/i en indiquant que les éléments selectionnés ne sont pas sensible à la casse
  const regexAddress = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,90}$/i;

  const regexCity = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;

  const regexMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/;

  //--------------------------------------------------------------
  //  B/ Fonction qui va envoyer le formulaire si toutes les conditions sont ok
  //--------------------------------------------------------------

  function form(e) {
    // e.preventDefault() indique que si l'event n'est pas bien géré, l'action par défaut ne devrait pas être exécutée comme elle l'est normalement.
    e.preventDefault();

    // Déclaration de la variable isValided. On met comme valeur un boolean "true", ce qui va permettre de vérifier si les conditions sont toutes remplies
    // Pour remplir ces conditions, le client doit bien rempli le formulaire sinon isValided deviens false et affiche un message d'erreur s'il y a au moins une condition non respectée...
    // Pour cela, la fonction conditionForm() va permettre de vérifier toutes les regex avec les conditions.

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

    // La fonction requestBody() va récupérer les valeurs écrites dans les inputs.

    function requestBody() {
      // Va effectuer une boucle à l'intérieur et on placera les id de(s) (l')article(s) dans la variable idProducts.
      // On crée aussi un objet contact dans lequel on entre les données des inputs saisis par le client.

      let idProducts = [];
      for (let i = 0; i < basketCustomer.length; i++) {
        idProducts.push(basketCustomer[i].idArticle);
      }

      // On prépare les données pour l'envoi en POST.
      const theOrder = {
        contact: {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
        },
        // Et enfin on place un products avec l'id des articles récupérés dans la boucle.
        products: idProducts,
      };
      return theOrder;
    }

    // Fonction postMethod qui va permet de vérifier que toutes les conditions sont ok pour l'envoi du formulaire
    function postMethod() {
      // Si isValided === true on envoit le formulaire.
      if (isValided === true) {
        // Mais si les conditions sont ok et que le panier est vide, on bloque l'envoi du formulaire avec un return. Hors de question de traiter une commande vide...
        if (basketCustomer.length === 0) {
          alert("Panier vide. Veuillez choisir un article.");
          return;
        }

        fetch("http://localhost:3000/api/products/order", {
          // On utilise la méthode POST pour envoyer les données saisies au serveur
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // On récupère le tableau contact qu'on a déclaré juste avant en activant la fonction requestBody().
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
          // S'il y a une erreur et que le client ne peut pas valider la commande, on l'invite à contacter l'entreprise pour qu'elle puisse valider la commande manuellement
          .catch(function (error) {
            alert(
              "Erreur d'envoi du formulaire. Merci de nous contacter au 01 23 45 67 89 pour qu'on vous confirme votre commande."
            );
            console.log(error);
          });
      }
    }

    postMethod();
  }

  //--------------------------------------------------------------
  //  C/ Pour finir on appelle la fonction avec un addEventListener
  //--------------------------------------------------------------
  //
  document.querySelector("#order").addEventListener("click", function (e) {
    return form(e);
  });
}
theCart();
