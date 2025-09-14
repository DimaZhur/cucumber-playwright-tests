Feature: JWT Tokens Generation  
  In order to access secure system resources  
  As a sub-user  
  I want to be able to generate a valid JWT token  

Background:  
  Given I navigate to the login page  
  When I login with sub-user credentials
  And I enter the MFA code "111111"  

Scenario: Generate a new JWT token
 When I click on the profile avatar
 And I click on Settings in the profile menu
 And I click on the Security tab
 And I click on the "Create token pair" button
 And I enter "172.31.2.106" into the IP address field
 And I enter a session name with current date and time
 And I push "Confirm"
 And I enter the MFA code "111111"
 Then I save the generated tokens to a file
 And I click on "Ok, I got it"
 Then I should see the new session in the list








