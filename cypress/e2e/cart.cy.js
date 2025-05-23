describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.window().then((win) => {
      win.localStorage.removeItem('cart')
    })
    cy.reload()
  })

  it('adds an item to the cart', () => {
    // Select first menu item
    cy.contains('Pasta Puttanesca').click()
    
    // Add item to cart
    cy.get('[data-testid="add-to-order-button"]').click()
    
    // Verify cart counter shows 1 item
    cy.get('[data-testid="cart-item-count"]').should('contain', '1')
  })

  it('increases quantity in menu item', () => {
    // Open same menu item
    cy.contains('Pasta Puttanesca').click()
    
    // Increase quantity to 3
    cy.get('[data-testid="increase-quantity"]').click().click()
    
    // Verify quantity is now 3
    cy.get('[data-testid="quantity-display"]').should('contain', '3')
    
    // Add to cart
    cy.get('[data-testid="add-to-order-button"]').click()
    
    // Verify cart counter shows 3 items
    cy.get('[data-testid="cart-item-count"]').should('contain', '3')
  })

  it('navigates to cart page and shows added items', () => {
    // Add an item to cart
    cy.contains('Pasta Puttanesca').click()
    cy.get('[data-testid="add-to-order-button"]').click()
    
    // Go to cart page using the cart summary button
    cy.get('[data-testid="cart-summary-button"]').click()
    
    // Verify cart page
    cy.url().should('include', '/cart')
    
    // Verify our menu items are here
    cy.contains('Pasta Puttanesca').should('be.visible')
    cy.contains('$15.49').should('be.visible')
  })

  it('allows adjusting quantity in cart', () => {
    // Add an item to cart
    cy.contains('Pasta Puttanesca').click()
    cy.get('[data-testid="add-to-order-button"]').click()
    
    // Go to cart page
    cy.get('[data-testid="cart-summary-button"]').click()
    
    // Increase quantity again
    cy.get('[data-testid="increase-quantity"]').click()
    
    // Verify quantity is now 2
    cy.get('[data-testid="quantity-display"]').should('contain', '2')
    
    // Verify price has updated
    cy.contains('$30.98').should('be.visible')
  })

  it('allows removing items from cart', () => {
    // Add an item to cart
    cy.contains('Pasta Puttanesca').click()
    cy.get('[data-testid="add-to-order-button"]').click()
    
    // Go to cart page
    cy.get('[data-testid="cart-summary-button"]').click()
    
    // Remove the item
    cy.get('button[aria-label="Remove item"]').click()
    
    // Verify cart is empty
    cy.contains('Your cart is empty').should('be.visible')
  })

  it('completes checkout process', () => {
    // Add an item to cart
    cy.contains('Pasta Puttanesca').click()
    cy.get('[data-testid="add-to-order-button"]').click()
    
    // Go to cart page
    cy.get('[data-testid="cart-summary-button"]').click()
    
    // Click checkout and intercept alert
    cy.window().then(win => {
      cy.stub(win, 'alert').as('alertStub')
    })
    
    cy.contains('Checkout').click()
    
    // Verify alert was shown
    cy.get('@alertStub').should('have.been.calledWith', 'Order placed successfully!')
    
    // Verify redirect to home page
    cy.url().should('not.include', '/cart')
    
    // Verify cart is empty
    cy.get('[data-testid="order-details-text"]').should('be.visible')
    cy.get('[data-testid="cart-total-price"]').should('contain', '$0.00')
  })
})