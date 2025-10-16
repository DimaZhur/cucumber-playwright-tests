Feature: Top up from card
    In order to increase my account balance
    As a logged-in user
    I want to be able to top up my wallet from card

Background:
    Given I navigate to the login page
    When I login with valid credentials
    And I enter the MFA code "111111"

    Scenario: Create a new top up from card
    When I click the "Top up" on the page
    And I click "Choose from list" on the modal
    And I select "7163_GuruPay_EUR" in the dropdown
    And I click the "Next" on the page
    Then I should see the "How would you like to pay?" on the modal window
    And I select "Top up from card" method
    And I enter top up amount "10" in field
    And I click "Confirm" on the modal window
    And I pay with test card
    And I should see success payment screen

    


