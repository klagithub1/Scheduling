package main.java.com.inse;

public class Bundle {
	private String visits;
	private double costOfVisit;
	
	public Bundle(String nurseVisit, double nurseCost) {
		
		this.visits = nurseVisit;
		this.costOfVisit = nurseCost;
	}
	public String getVisits() {
		return visits;
	}
	public void setVisits(String visits) {
		this.visits = visits;
	}
	public double getCostOfVisit() {
		return costOfVisit;
	}
	public void setCostOfVisit(double costOfVisit) {
		this.costOfVisit = costOfVisit;
	}

}
