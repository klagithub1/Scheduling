package com.inse.model;

public class Bundle {
	private String visitSequence;
	private double costOfVisit;
	
	public Bundle(String nurseVisit, double nurseCost){
		this.visitSequence = nurseVisit;
		this.costOfVisit = nurseCost;
	}
	public String getVisitSequence() {
		return visitSequence;
	}
	public void setVisitSequence(String visitSequence) {
		this.visitSequence = visitSequence;
	}
	public double getCostOfVisit() {
		return costOfVisit;
	}
	public void setCostOfVisit(double costOfVisit) {
		this.costOfVisit = costOfVisit;
	}
}
