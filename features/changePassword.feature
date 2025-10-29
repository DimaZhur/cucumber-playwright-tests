Feature: Change password  
  In order to keep my account secure  
  As a user  
  I want to be able to change my password  

Background:  
    Given I navigate to the login page
    When I login with valid credentials
    And I enter the MFA code

Scenario: Successfully change password  
  When I click on the profile avatar on the home page
  And I select Settings in the profile menu
  And I click on the password tab
  When I click the "Change password" on the change password page
  And I change password from "PASSWORD1" to "PASSWORD2"
  And I enter the MFA code
  Then I should see a success message "Password was successfully changed!"
  And I click the "Logout" button for logout
  # When I am on login page
  # When I login again
When I login again
And I enter the MFA code
  When I click on the profile avatar on the home page
  And I select Settings in the profile menu
  And I click on the password tab
  When I click the "Change password" on the change password page
  And I change password from "PASSWORD2" to "PASSWORD1"
  And I enter the MFA code
  Then I should see a success message "Password was successfully changed!"
  





