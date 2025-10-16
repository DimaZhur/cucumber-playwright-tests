Feature: Top up from wallet
    In order to increase my account balance
    As a logged-in user
    I want to be able to top up my wallet

Background:
    Given I navigate to the login page
    When I login with valid credentials
    And I enter the MFA code "111111"

    Scenario: Create a new top up from wallet
    When I click the "Top up" button
    And I click the "Choose from list" dropdown
    And I select payment wallet "7163_GuruPay_EUR"
    And I click the "Next" button
    Then I should see the "How would you like to pay?" modal
    And I select "Top up from wallet" payment method
    And I enter top up amount "10"
    And I click the Wallet dropdown
    And I select destination wallet "7169_Wallester_EUR"
    And I click the "Confirm" button
    Then I should see a success message "You have successfully topped up your wallet"
    And I should see transaction at current time
    And I should be on wallet page "7163"








