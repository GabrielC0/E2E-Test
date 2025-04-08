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
    cy.get("body").should("not.be.empty");
    cy.wait(2000);
  });

  it("Devrait ajouter, vérifier, modifier et supprimer un utilisateur", () => {
    cy.contains("button", "Ajouter").click();

    cy.get("form, .modal, dialog").should("be.visible");

    cy.get(
      "input[type='text']:visible, input:not([type='hidden']):not([type='submit']):not([type='button']):visible"
    )
      .first()
      .type(testUser.name);

    cy.get(
      "input[type='email']:visible, input[placeholder*='email']:visible"
    ).type(testUser.email);

    cy.get("form").then(($form) => {
      cy.wrap($form).submit();
    });

    cy.wait(1000);

    cy.contains(testUser.name).should("exist");
    cy.contains(testUser.email).should("exist");

    cy.contains("li", testUser.email)
      .find("button, a, .btn, .edit")
      .first()
      .click();

    cy.get("form, .modal, dialog").should("be.visible");

    cy.get(
      "input[type='text']:visible, input:not([type='hidden']):not([type='submit']):not([type='button']):visible"
    )
      .first()
      .clear()
      .type(updatedUser.name);

    cy.get("input[type='email']:visible, input[placeholder*='email']:visible")
      .clear()
      .type(updatedUser.email);

    cy.get("form").then(($form) => {
      cy.wrap($form).submit();
    });

    cy.wait(1000);

    cy.contains(updatedUser.name).should("exist");
    cy.contains(updatedUser.email).should("exist");

    cy.contains("li", updatedUser.email)
      .find("button, a, .btn, .delete")
      .last()
      .click();

    cy.get("body").then(($body) => {
      if ($body.find("button:contains('Confirmer')").length > 0) {
        cy.contains("button", "Confirmer").click({ force: true });
      }
    });

    cy.contains(updatedUser.email).should("not.exist");
  });
});
