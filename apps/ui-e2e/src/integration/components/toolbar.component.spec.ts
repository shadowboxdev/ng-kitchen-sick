describe('ui', () => {
  beforeEach(() => cy.visit('/iframe.html?id=toolbarcomponent--primary'));
  it('should render the component', () => {
    cy.get('sdw-toolbar').should('exist');
  });
});
