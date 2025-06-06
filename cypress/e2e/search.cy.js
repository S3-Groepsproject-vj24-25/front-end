describe('Search Functionality', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('filters menu items when searching', () => {
    cy.get('[data-testid="menu-item"]').should('have.length.greaterThan', 0)
    
    cy.get('[data-testid="menu-item"]').then($items => {
      const initialCount = $items.length
      
      // Find first item on the menu
      cy.get('[data-testid="menu-item"]').first().find('h3').invoke('text').then(itemName => {
        const searchTerm = itemName.split(' ')[0] // First item
        
        cy.get('input[placeholder="Search..."]').type(searchTerm)
        
        // Verify the search works
        cy.get('[data-testid="menu-item"]').should('have.length.lessThan', initialCount)
        cy.get('[data-testid="menu-item"]').should('contain.text', searchTerm)
        
        // Clear and verify if all items have returned  
        cy.get('input[placeholder="Search..."]').clear()
        cy.get('[data-testid="menu-item"]').should('have.length', initialCount)
      })
    })
  })

  it('shows "no items found" message when search has no results', () => {
    cy.get('input[placeholder="Search..."]').type('Blank')
    cy.contains('No menu items found').should('be.visible')
  })
})