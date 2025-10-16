Feature: Add company beneficiary
  In order to manage system access  
  As an admin user  
  I want to be able to create a new company beneficiary

Background:
  Given I navigate to the login page
  When I login with valid credentials
  And I enter the MFA code "111111"

    
Scenario: Create a new company beneficiary
    When I go to the Beneficiaries page
    When I click on "Add beneficiary" on the page
    When I click on "Company" tab on the modal Add beneficiary
    When I select currency "EUR" on the modal
   When I fill a company beneficiary info in the form with name "A test company ben"
    When I fill IBAN field with random Austrian IBAN on the modal
    When I click Add beneficiary on the modal
    Then I should see a success message "Beneficiary has been created"
    When I should see the new beneficiary on the dashboard
     
