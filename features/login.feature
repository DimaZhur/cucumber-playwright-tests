Feature: Login
  In order to access my account
  As a registered user
  I want to be able to log in successfully

Scenario: Successful login
  Given I navigate to the login page
  When I login with valid credentials
  And I enter the MFA code "111111"
  Then I should see the dashboard
