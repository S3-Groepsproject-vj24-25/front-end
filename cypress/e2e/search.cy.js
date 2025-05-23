describe('Search Functionality', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/')
    })
  
    it('filters menu items when searching', () => {
      // Check for all menu items
      cy.get('main').contains('Pasta Puttanesca').should('be.visible')
      cy.get('main').contains('Steak & Avocado Bowl').should('be.visible')
      cy.get('main').contains('Chutney Burger').should('be.visible')
      
      // Enter search term
      cy.get('input[placeholder="Search..."]').type('Pasta')
      
      // Verify only pasta is shown
      cy.get('main').contains('Pasta Puttanesca').should('be.visible')
      cy.get('main').contains('Chutney Burger').should('not.exist')
      
      // Clear search and make sure everything is back
      cy.get('input[placeholder="Search..."]').clear()
      cy.get('main').contains('Chutney Burger').should('be.visible')
    })
  
    it('shows "no items found" message when search has no results', () => {
      cy.get('input[placeholder="Search..."]').type('Blank')
      cy.contains('No menu items found').should('be.visible')
    })
  })