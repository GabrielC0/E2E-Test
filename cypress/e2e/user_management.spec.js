describe("Gestion des utilisateurs", () => {
  const testUser = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    role: "Admin",
  };

  const updatedUser = {
    name: "Jean Dupont Modifié",
    email: "jean.modifie@example.com",
    role: "User",
  };

  beforeEach(() => {
    cy.visit("/");
  });

  it("devrait ajouter, modifier et supprimer un utilisateur", () => {
    cy.get('[data-testid="add-user-button"]').click();
    cy.get('[data-testid="user-name-input"]').type(testUser.name);
    cy.get('[data-testid="user-email-input"]').type(testUser.email);
    cy.get('[data-testid="user-role-select"]').select(testUser.role);
    cy.get('[data-testid="submit-user-button"]').click();
    cy.contains(testUser.name).should("be.visible");
    cy.contains(testUser.email).should("be.visible");
    cy.contains(testUser.name)
      .parents("tr")
      .find('[data-testid="edit-user-button"]')
      .click();
    cy.get('[data-testid="user-name-input"]').clear().type(updatedUser.name);
    cy.get('[data-testid="user-email-input"]').clear().type(updatedUser.email);
    cy.get('[data-testid="user-role-select"]').select(updatedUser.role);
    cy.get('[data-testid="submit-user-button"]').click();
    cy.contains(updatedUser.name).should("be.visible");
    cy.contains(updatedUser.email).should("be.visible");
    cy.contains(updatedUser.name)
      .parents("tr")
      .find('[data-testid="delete-user-button"]')
      .click();
    cy.get('[data-testid="confirm-delete-button"]').click();
    cy.contains(updatedUser.name).should("not.exist");
    cy.contains(updatedUser.email).should("not.exist");
  });
});
