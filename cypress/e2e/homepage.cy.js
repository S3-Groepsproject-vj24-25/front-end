describe('Homepage', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/')
    })
  
    it('displays the header with restaurant name', () => {
      cy.get('header').should('be.visible')
      cy.get('header h1').should('have.text', 'Willem')
    })
  
    it('displays menu title', () => {
      cy.get('main h2').should('have.text', 'Menu')
    })
  
    it('displays search bar', () => {
      cy.get('input[placeholder="Search..."]').should('be.visible')
    })
  
    it('displays category filter', () => {
      cy.get('[data-category="All"]').should('be.visible')
      cy.get('[data-category="Main"]').should('be.visible')
      cy.get('[data-category="Pasta"]').should('be.visible')
    })
  
    it('displays menu items', () => {
      cy.get('main').contains('Pasta Puttanesca').should('be.visible')
      cy.get('main').contains('Chutney Burger').should('be.visible')
    })
  
    it('displays cart summary in footer', () => {
      cy.get('footer').contains('Order Details').should('be.visible')
    })
  })