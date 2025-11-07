Feature: Top up from wallet
    In order to increase my account balance
    As a logged-in user
    I want to be able to top up my wallet

Background:
    Given I navigate to the login page
    When I login with valid credentials
    And I enter the MFA code

Scenario: Create a new top up from wallet
    When I click the "Wallets" menu item
    And I open wallet "IFX_EUR" from context
    And I click the "Top up" button
    Then I should see the "How would you like to pay?" modal
    And I select "Top up from wallet" payment method
    And I enter top up amount "10"
    And I click the Wallet dropdown
    And I select destination wallet "WALLESTER_EUR" from context
    And I click the "Confirm" button
    Then I should be on the same wallet page from context "IFX_EUR"

