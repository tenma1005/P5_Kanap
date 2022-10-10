/*=============================================================================================
SCRIPT DE LA PAGE DE CONFIRMATION DE LA COMMANDE -> PERMET DE CONFIRMER LA COMMANDE ET DE
                                                    GÉNÉRER UN NUMÉRO DE COMMANDE SI TOUT LES 
                                                    CONDITIONS DU SCRIPT DE LA PAGE PANIER
                                                    (cart.js) SONT RESPECTÉS                                              
===============================================================================================*/

/*--------------------------------------------------------------------------
// PARTIE 1 : Fonction pour afficher la confirmation de la commande et son numéro en récupèrant dans l'url l'orderId
----------------------------------------------------------------------------*/

function orderNumber() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("orderId");
  // Affiche l'id de l'article dans la console
  console.log("numéro de la commande : " + orderId);

  document.querySelector("#orderId").innerHTML = `<br><br> ${orderId} <br><br>`;
  console.log("Merci pour votre achat !");
}

orderNumber();

/*--------------------------------------------------------------------------
  // PARTIE 2 : Et pour EN finir, la fonction purge() va permettre de supprimer les produits dans le local storage.
  ----------------------------------------------------------------------------*/

function purge() {
  //window.localStorage.clear();
  localStorage.removeItem("product");
}

purge();
