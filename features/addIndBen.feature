Feature: Add individual beneficiary
  In order to manage system access  
  As an admin user  
  I want to be able to create a new individual beneficiary

Background:
  Given I navigate to the login page
  When I login with valid credentials
  And I enter the MFA code "111111"

    
Scenario: Create a new individual beneficiary
    When I navigate to the Beneficiaries page
    When I click on "Add beneficiary" to create a beneficiary
    When I select currency "EUR"
    When I fill a individual beneficiary info in the form with name "A test individual ben"
    When I fill IBAN field with random Austrian IBAN
    When I click Add beneficiary
    Then I should see a success message "Beneficiary has been created"
    When I should see the new beneficiary at the top of the list

