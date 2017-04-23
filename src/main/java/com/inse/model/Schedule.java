package com.inse.model;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Schedule {

    // Solution Bundle
    private Map<Integer, Bundle> solutionBundle = new HashMap<Integer, Bundle>();

    public Schedule(Map<Integer, Bundle> solutionBundle){
        this.solutionBundle = solutionBundle;
    }

    public List<String> printFormattedScheduleForTheWeb(){

        DecimalFormat df = new DecimalFormat("#.00");

        List<String> formattedSchedule = new ArrayList<String>();

        for(int i=0; i < solutionBundle.size(); i++){
            formattedSchedule.add("Nurse Nr."+(i+1)+" --"+solutionBundle.get(i).getVisitSequence()+" --"+solutionBundle.get(i).getCostOfVisitBundle());
        }

        double totalCost = 0.00;

        for(int i=0; i < solutionBundle.size(); i++){
            totalCost += solutionBundle.get(i).getCostOfVisitBundle();
        }
        formattedSchedule.add(" ******************* -- *******************  --  *******************");
        formattedSchedule.add(" -- Total Nurses Cost:  --"+df.format(totalCost));

        return formattedSchedule;
    }
}
