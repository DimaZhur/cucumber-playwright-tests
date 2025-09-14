Feature: Payment to beneficiary
  In order to transfer money
  As a logged-in user
  I want to be able to create a new payment

  Background:
    Given I navigate to the login page
    When I login with valid credentials
    And I enter the MFA code "111111"

  Scenario: Create a new payment
    And I click on Send to create a new payment
    And I select the automation beneficiary
    Then I should see the payment form
    And I enter payment amount "10"
    And I select the first purpose code
    # And I open the wallet drop down list to select a wallet
    # And I select wallet "AT 3326 GuruPay C2S"
    And I enter reference "trest"
    And I should the "Sign the payment" flag should be enabled by default
    And I click Create and sign
    And I enter the MFA code "111111"
    Then I should see a success message "Payment was created successfully"
    And I should be on the home page
   Then I should see the latest payment at current time


