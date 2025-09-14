Feature: Bulk payment
    In order to send multiple payments at once  
    As a logged-in user  
    I want to be able to create a new bulk payment

Background:
    Given I navigate to the login page
    When I login with valid credentials
    And I enter the MFA code "111111"

Scenario: Create a new Bulk
    When I click on "Bulk payments" to create a new bulk payment
    Then I should see the "Bulk payments"
    When I select "SEPA Transfer"
    When I upload the file "SEPA bulk payment valid.csv"
    When I open the wallet dropdown
    And I click on wallet "AT 3326 GuruPay C2S"
    And I click "Next" to proceed to the next step
    And I click "Confirm" to finish
    And I should see bulk payment "- 6,99 EUR" at current time
    And I should be on I should be on the page of the wallet "3326" that was used

