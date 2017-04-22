package com.inse.model;

public class Bundle {
	private String visitSequence;
	private double costOfVisitBundle;
	
	public Bundle(String nurseVisit, double nurseCost){
		this.visitSequence = nurseVisit;
		this.costOfVisitBundle = nurseCost;
	}

	public String getVisitSequence() {
		return visitSequence;
	}

	public void setVisitSequence(String visitSequence) {
		this.visitSequence = visitSequence;
	}

	public double getCostOfVisitBundle() {
		return this.costOfVisitBundle;
	}

	public void setCostOfVisitBundle(double costOfVisit) {
		this.costOfVisitBundle = costOfVisit;
	}

	public String toString(){
		return " {\""+visitSequence+"\" , "+costOfVisitBundle+" }";
	}
}
