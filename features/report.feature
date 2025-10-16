Feature: Create report
  In order to manage system access  
  As an admin user  
  I want to be able to create a report

Background:
  Given I navigate to the login page
  When I login with valid credentials
  And I enter the MFA code "111111"

    
Scenario: Create a new user with full access  
    When I navigate to the Reports page
    When I click the "Create report" to get a report
    When I fill the report name with "Atest report"
    When I submit the create a report
    Then I should see a success message "The report is ready! You can find it and download in Reports tab."
    Then I should see a new report at current time

    
