Feature: Add user with full access
  In order to manage system access  
  As an admin user  
  I want to be able to create a new user with full access

Background:
  Given I navigate to the login page
  When I login with valid credentials
  And I enter the MFA code "111111"

    
Scenario: Create a new user with full access  
    When I navigate to the Users page
    When I click on "Add user" to create a user
    When I fill a user info in the form with name "A test user"
    When I click Add user
    And I enter the MFA code "111111"
    Then I should see a success message "User created"
    When I should see the new user at the top of the list

  