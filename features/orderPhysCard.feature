Feature: Order a physical card
    In order to get a new payment card
    As a logged-in user
    I want to be able to order a physical card

Background:
    Given I navigate to the login page
    When I login with valid credentials
    And I enter the MFA code "111111"

Scenario: Create a new physical card
    When I click on "Order a card" to order a new physical card
    Then I should see the "Order a card" modal window
    When I select "Physical card" option
    And I click "Next" to proceed to data entry
    When I fill in the recipient info form
    When I select the first country in the list
    When I fill in the recipient Delivery address form
    When I select the first delivery method
    And I click "Next" to go to the static password
    When I fill a static password
    And I click "Next" to go to the final modal
    And I click "Pay" to complete the order
    And I enter the MFA code "111111"
    Then I should see a success message "Card was successfully ordered."