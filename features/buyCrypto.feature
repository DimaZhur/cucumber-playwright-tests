Feature: Buy Crypto  
  In order to purchase cryptocurrency conveniently  
  As a logged-in user  
  I want to be able to create a new crypto purchase


Background:
    Given I navigate to the login page
    When I login with valid credentials
    And I enter the MFA code "111111"

Scenario: Create a new Buy Crypto
When I navigate to the Crypto page from the menu
When I click on the Buy Crypto action
When I select "TRC20" network in Buy Crypto form
When I enter "TKSXDA8HfE9E1y39RczVQ1ZascUEtaSToF" as crypto wallet address
When I enter "10" as amount in Buy Crypto form
And I click the Wallet list
When I select wallet "7163_GuruPay_EUR" in Buy Crypto form
When I submit the Buy Crypto form
And I enter the MFA code "111111"
Then I should see a success message "Payment has been executed successfully!"
Then I should be on the crypto page after buy crypto
Then I should see buy crypto transaction "- 10,00 EUR" at current time




