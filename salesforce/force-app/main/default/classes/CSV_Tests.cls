@isTest
private class CSV_Tests {
  @TestSetup
  static void loadTestDataFromStaticResource(){
    List<sObject> accounts = Test.loadData(Account.SObjectType, 'accountData');
  }
  @isTest static void testLoadAccountsFromStaticResource() {
    List<Account> accts = [SELECT ID FROM Account];
    system.assert(accts.size() == 3, 'expected 3 accounts');
  }
}