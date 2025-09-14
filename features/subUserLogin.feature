Feature: Sub-user login
  In order to use the platform as a sub-user  
  As a sub-user  
  I want to be able to log in with my credentials  

Scenario: Successful login as sub-user
  Given I navigate to the login page
  When I login with sub-user credentials
  And I enter the MFA code "111111"
  Then I should see the dashboard