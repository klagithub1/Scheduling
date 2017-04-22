package com.inse.model;

import java.util.ArrayList;
import java.util.List;

public class Schedule {

    double scheduleCost;
    int[] solutionVector;

    public Schedule(double scheduleCost, int[] solutionVector){

        this.scheduleCost = scheduleCost;
        this.solutionVector = solutionVector;
    }

    public double getScheduleCost() {
        return scheduleCost;
    }

    public void setScheduleCost(double schedCost) {
        this.scheduleCost = schedCost;
    }

    public int[] getSolutionVector(){
        return this.solutionVector;
    }

    public void setSolutionVector(int[] solution){
        this.solutionVector = solution;
    }

    public String toString(){

        // Print Vector
        String printedVector="";
        printedVector += "[";
        for(int j=0; j < this.solutionVector.length; j++){
            printedVector += this.solutionVector[j]+",";
        }
        printedVector = printedVector.substring(0, printedVector.length() - 1);
        printedVector += "]";

        return "{ [ Schedule Cost: "+this.scheduleCost+" ] [ Solution Vector: "+printedVector+" ] }";
    }
}
