public with sharing class RentCar {
    @AuraEnabled
    public static void rentThisCar(String carId, Date startDate, Date endDate){
        //create car_Reservation__c with Car__c set to carId
        Date startD = Date.valueOf(startDate);
        Date endD = Date.valueOf(endDate);
        Car_Reservation__c res;
        if (Schema.sObjectType.Car_Reservation__c.isCreateable()) {
            res= new Car_Reservation__c(
                Reservation_Start__c = startD,
                Reservation_End__c = endD,
                Car__c = carId);
         } 
        try{
            insert res;
        }catch(DMLException err){
            System.debug(err);
        }
    }

    @AuraEnabled
    public static List<Date> getDatesAvailable(String carId){
        List<Date> datesAvailable = new List<Date>();
        //return dates this car is not reserved
        if (String.isEmpty(carId)){
            datesAvailable.add(Date.today().addDays(1));
            return datesAvailable;
        }else{
            datesAvailable = nextThirtyDays();
            for(Car_Reservation__c cr:[
                                SELECT Id, Reservation_Start__c, Reservation_End__c
                                FROM Car_Reservation__c
                                WHERE Car__c =:carId]){
                removeDateRange(datesAvailable,cr.Reservation_Start__c,cr.Reservation_End__c);
                //remove dates from datesComing that lie between reservation start and end dates
            }
        }
        if(datesAvailable.size() == 0){
            datesAvailable.add(Date.today());
        }
        return datesAvailable;
    }
    static void removeDateRange(List<Date> available, Date startRes, Date endRes ){
        for( Integer i = 0 ; i < startRes.daysBetween(endRes) ; i++){
            Date unavailableDate = startRes.addDays(i);
            Integer indexOf = available.indexOf(unavailableDate);
            if(indexOf != -1){
                available.remove(indexOf);
            }
        }
    }
    
    static List<Date> nextThirtyDays(){
        List<Date> datesComing = new List<Date>();
        Date today = Date.today();

        for(Integer i = 0 ; i < 30 ; i++){
            datesComing.add(today.addDays(i));
        }
        return datesComing;
    }
    

}