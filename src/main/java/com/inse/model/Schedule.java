package com.inse.model;

import java.util.List;

public class Schedule {
    public List<Integer> getVisits() {
        return visits;
    }

    public void setVisits(List<Integer> visits) {
        this.visits = visits;
    }

    public double getCostOfVisit() {
        return costOfVisit;
    }

    public void setCostOfVisit(double costOfVisit) {
        this.costOfVisit = costOfVisit;
    }

    List<Integer> visits;
    double costOfVisit;
}
