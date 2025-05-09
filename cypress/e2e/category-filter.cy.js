describe('Category Filtering', () => {
    beforeEach(() => {
      cy.visit('/')
    })
  
    it('shows all items when "All" category is selected', () => {
      cy.get('[data-category="All"]').click()
      cy.get('main').contains('Pasta Puttanesca').should('be.visible')
      cy.get('main').contains('Chutney Burger').should('be.visible')
      cy.get('main').contains('Spaghetti all\'Assassina').should('be.visible')
    })
  
    it('filters items when "Pasta" category is selected', () => {
      cy.get('[data-category="Pasta"]').click()
      cy.get('main').contains('Pasta Puttanesca').should('be.visible')
      cy.get('main').contains('Spaghetti all\'Assassina').should('be.visible')
      cy.get('main').contains('Chutney Burger').should('not.exist')
    })
  
    it('filters items when "Main" category is selected', () => {
      cy.get('[data-category="Main"]').click()
      cy.get('main').contains('Chutney Burger').should('be.visible')
      cy.get('main').contains('Steak & Avocado Bowl').should('be.visible')
      cy.get('main').contains('Pasta Puttanesca').should('not.exist')
    })
  })