Feature: Exchanges
  In order to exchange transfer
  As a logged-in user
  I want to be able to create a new exchange

  Background:
    Given I navigate to the login page
    When I login with valid credentials
    And I enter the MFA code

Scenario: Create a new exchange
    And I click on Exchange to create a new exchange
    Then I should see the exchange form
    And I enter exchange amount "10"
    And I open the wallets dropdown in exchange
     And I select wallet "IFX_USD" from context in exchange
    And I open the destination wallets dropdown in exchange
    And I select destination wallet "IFX_EUR" from context in exchange
    And I submit the exchange form
    And I enter the MFA code
    Then I should see a success message "Conversion has been executed successfully!"
    And I should be on the home page after exchange
    And I should see the latest exchange transaction "Currency exchange 10.00 USD to EUR" at current time



