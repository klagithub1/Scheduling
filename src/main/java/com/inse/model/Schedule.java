package com.inse.model;

import java.text.DecimalFormat;
import java.util.*;

public class Schedule {

    // Solution Bundle
    private Map<Integer, Bundle> solutionBundle = new HashMap<Integer, Bundle>();

    // Uncovered Visits Sequence
    private String uncoveredVisitsSequence = "";

    // Uncovered Visits Price
    private double uncoveredVisitsPrice = 0;

    public Schedule(Map<Integer, Bundle> solutionBundle, String uncovered, double uncoveredPrice){
        this.solutionBundle = solutionBundle;
        this.uncoveredVisitsSequence = uncovered;
        this.uncoveredVisitsPrice = uncoveredPrice;
    }

    public List<String> printFormattedScheduleForTheWeb(){

        DecimalFormat df = new DecimalFormat("#.00");

        List<String> formattedSchedule = new ArrayList<String>();
        double totalCost = 0.00;

        // Iterate through the bundles of the solution and add the visits
        Iterator<Integer> soluIterator = solutionBundle.keySet().iterator();

        while(soluIterator.hasNext()){
            Integer nurseId = soluIterator.next();
            formattedSchedule.add("Nurse Nr."+(nurseId+1)+" --"+solutionBundle.get(nurseId).getVisitSequence()+" --"+solutionBundle.get(nurseId).getCostOfVisitBundle());
            totalCost += solutionBundle.get(nurseId).getCostOfVisitBundle();
        }

        formattedSchedule.add("  --   --  ");
        formattedSchedule.add("  [A] -- Regular Nurses Cost:  --"+df.format(totalCost));
        formattedSchedule.add("  [B] -- Backup Nurses Cost:  --  "+df.format(this.uncoveredVisitsPrice));
        formattedSchedule.add("  --  Visits Covered by Backup Nurses:  --  "+this.uncoveredVisitsSequence);
        formattedSchedule.add("  --  TOTAL Schedule Price (A+B):  --  "+df.format(this.uncoveredVisitsPrice+totalCost));


        return formattedSchedule;
    }
}
