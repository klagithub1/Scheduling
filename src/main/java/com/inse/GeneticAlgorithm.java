package main.java.com.inse;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

public class GeneticAlgorithm {

	// Maintain a list of covered visits 
	List<String> listWithDuplicates = new ArrayList<String>();

	int numberOfNurse = 6;
	int[][] domain = new int[numberOfNurse][2];
	private static Map<Integer,ArrayList<Bundle>> bundlesForNurse = new HashMap<Integer, ArrayList<Bundle>>();
	Bundle[][] bundleArray = new Bundle[numberOfNurse][];	
	int[] solution = new int[numberOfNurse];
	
	public void assignMapToArray(Map<Integer, ArrayList<Bundle>> bundleNurseMap){
		for(int nurseNo : bundleNurseMap.keySet()){
			ArrayList<Bundle> bundleList = bundleNurseMap.get(nurseNo);
			for(int i = 0 ; i < bundleList.size(); i++){
				bundleArray[nurseNo-1][i] = bundleList.get(i);	
			}			
		}
	}

	// Calculate the cost of a bundle
	public double costf(int[] solution){
		double cost = 0;
		String visits = "";
		for(int i=0; i < solution.length; i++){
			int bundleIndex = solution[i];
			cost +=bundlesForNurse.get(i+1).get(bundleIndex).getCostOfVisit();
			visits += bundlesForNurse.get(i+1).get(bundleIndex).getVisits();
		}
		
		String[] listWithDup = visits.split(",");
		Set<String> listWithOutDup = new HashSet<String>(Arrays.asList(listWithDup));
		int numOfDup = listWithDup.length - listWithOutDup.size();
		if(numOfDup > 0){
			cost += 1000 * numOfDup;
		}
		System.out.println("Cost of a solution :"+cost);
		return Math.round(cost);
		
    }
	
	
	
	public int[] doCrossOver(int[] solution1, int[] solution2){
		int domainLen = domain.length -2;
		int randomNr = generateRandomNumber(1, domainLen);
		int[] crossOverSol = new int[numberOfNurse];
		for(int j =0; j < randomNr; j++){
			crossOverSol[j] = solution1[j];
		}
		for(int j = randomNr; j < numberOfNurse ; j++){
			crossOverSol[j] = solution2[j];
		}
		
		return crossOverSol;
	}
	
	
	
	public int generateRandomNumber(int min, int max){
		Random random = new Random();
		int randomNumber = random.nextInt(max - min + 1) + min;
		return randomNumber;
	}
	
	public void setDomain(){		
		for(int nurse : bundlesForNurse.keySet()){
			int rowIndex = nurse-1;
			List<Bundle> bundleList = bundlesForNurse.get(nurse);
			int minBundleSize = 0;
			int maxBundleSize = bundleList.size();
			domain[rowIndex][0] = minBundleSize;
			domain[rowIndex][1] = maxBundleSize;
		}
		
	}
	
	public void printDomain(){
		for(int i = 0 ; i < numberOfNurse; i++){
			for(int j = 0; j<2; j++){
				System.out.println(domain[i][j]);
			}
		}
	}
    public void geneticOptimze(int maxIteration , int populationSize, double elite){
    	int[] population = new int[numberOfNurse];
    	
    	//initializePopulation();
    	get50RandomSolutions(50);
    	int topElite = (int) (elite*populationSize);
    	
    	for(int i=0; i<maxIteration; i++){
    		//remove empty items from population
    		//costf()
    	}
    }

    public void get50RandomSolutions(int popSize){
    	
    	int[][] population = new int[numberOfNurse][];
    	for(int i =0; i<popSize; i++){
    		int[] vector = new int[numberOfNurse];
    		for(int j=0; j<numberOfNurse; j++){
    			vector[j] = generateRandomNumber(domain[j][0], domain[j][1]);
    		}
    		population[i][0] = vector[i];    		
    	}
    }

    public void mutate(){

    }
    // Domain : 0 to noOfSchedules-1 for each nurse
    public void initializeDomain(int n){
         //   Map<String, List<Schedule>> nurseScheduleList = new HashMap<String, List<Schedule>>();
        int[][] domain = new int[n][2];

    }

    public void printSolution(Map<String, Schedule> solution){
        for(String nurse : solution.keySet()){
            System.out.println("Nurse :"+nurse);
            System.out.println("Slot :"+solution.get(nurse).getVisits());
            System.out.println("Cost :"+solution.get(nurse).getCostOfVisit());
        }
        double totalCost = 0;
        for(String nurse : solution.keySet()){
            totalCost += solution.get(nurse).getCostOfVisit();
        }
        System.out.println("Total cost :"+totalCost);
    }
    
    public  Map<Integer, ArrayList<Bundle>> getBundlesForNurse() {
		return bundlesForNurse;
	}

	public  void setBundlesForNurse(Map<Integer, ArrayList<Bundle>> bundlesForNurse) {
		GeneticAlgorithm.bundlesForNurse = bundlesForNurse;
	}
}
