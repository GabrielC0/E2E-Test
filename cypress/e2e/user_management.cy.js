describe("Gestion des utilisateurs", () => {
  const testUser = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
  };

  const updatedUser = {
    name: "Jean-Pierre Dupont",
    email: "jeanpierre.dupont@example.com",
  };

  beforeEach(() => {
    cy.visit("http://localhost/gestion-produit/src/gestion_produit/");
    // S'assurer que l'application est chargée
    cy.get("body").should("not.be.empty");
    cy.wait(2000);
  });

  it("Devrait ajouter, vérifier, modifier et supprimer un utilisateur", () => {
    // Cliquer sur le bouton d'ajout
    cy.contains("button", "Ajouter").click();

    // Attendre l'affichage du formulaire
    cy.get("form, .modal, dialog").should("be.visible");

    // Remplir le formulaire en excluant explicitement les champs cachés
    cy.get(
      "input[type='text']:visible, input:not([type='hidden']):not([type='submit']):not([type='button']):visible"
    )
      .first()
      .type(testUser.name);

    cy.get(
      "input[type='email']:visible, input[placeholder*='email']:visible"
    ).type(testUser.email);

    // Soumettre le formulaire directement
    cy.get("form").then(($form) => {
      cy.wrap($form).submit();
    });

    // Attendre la soumission
    cy.wait(1000);

    // Vérifier l'ajout
    cy.contains(testUser.name).should("exist");
    cy.contains(testUser.email).should("exist");

    // Modification: cibler l'élément LI contenant l'email
    cy.contains("li", testUser.email)
      .find("button, a, .btn, .edit")
      .first()
      .click();

    // Attendre l'affichage du formulaire de modification
    cy.get("form, .modal, dialog").should("be.visible");

    // Modifier les champs
    cy.get(
      "input[type='text']:visible, input:not([type='hidden']):not([type='submit']):not([type='button']):visible"
    )
      .first()
      .clear()
      .type(updatedUser.name);

    cy.get("input[type='email']:visible, input[placeholder*='email']:visible")
      .clear()
      .type(updatedUser.email);

    // Soumettre le formulaire
    cy.get("form").then(($form) => {
      cy.wrap($form).submit();
    });

    cy.wait(1000);

    // Vérifier les modifications
    cy.contains(updatedUser.name).should("exist");
    cy.contains(updatedUser.email).should("exist");

    // Supprimer l'utilisateur (cibler le LI)
    cy.contains("li", updatedUser.email)
      .find("button, a, .btn, .delete")
      .last()
      .click();

    // Gestion de la confirmation de suppression
    cy.get("body").then(($body) => {
      if ($body.find("button:contains('Confirmer')").length > 0) {
        cy.contains("button", "Confirmer").click({ force: true });
      }
    });

    // Vérifier la suppression
    cy.contains(updatedUser.email).should("not.exist");
  });
});
