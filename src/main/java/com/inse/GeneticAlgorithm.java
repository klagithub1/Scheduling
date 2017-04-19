package main.java.com.inse;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

public class GeneticAlgorithm {

	// Penalty coefficient for allowing duplicates
	private final static double PENALTY_FACTOR = 10000.00;

	// Size of Population
	private final static int POPULATION_SIZE = 50 ;

	// Max number of iterations
	private final static int MAXIMUM_NUMBER_ITERATIONS = 100;

	// Mutation probability rate
	private final static double MUTATION_RATE = 0.2;

	// Mutation Step
	private final static int MUTATION_STEP = 1;

	// Crossover probability rate
	private final static double CROSSOVER_RATE = 0.2;

	// Elitism sample
	private final static double ELITISM = 0.2;

	// Steps
	private final static int STEP = 1;

	// Represents domain of population, meaning where we take the samples for the population, used for indexing
	private int[][] domain;

	// Represent nurses' bundles data structure, where each position in the list represent a nurse, e.g. position 0 represent nurse 1
	private Map<Integer, ArrayList<Bundle>> nurseBundles = new HashMap<Integer, ArrayList<Bundle>>();

	// Represents solution suggested, in form of an array index to the nurseBundles data structure.
	// e.g. [1 ,9 , 0] represents the first nurse's second feasible bundle,
	// the second nurse's tenth feasible bundle and the third nurse's first feasible bundle.
	// In the end is set to represent the most optimal (fittest candidate) sample.
	private int[] solution;

	// List with duplicates, ot maintain covered visits in order to prevent their reuse.
	private Set<String> listWithDuplicates = new TreeSet<String>();

	// Number of nurses
	private int numberOfNurses;

	// REFACTOR ----------------------------
	//int numberOfNurse = 6;
	//int[][] domain = new int[numberOfNurse][2];
	//private static Map<Integer,ArrayList<Bundle>> bundlesForNurse = new HashMap<Integer, ArrayList<Bundle>>();
	//Bundle[][] bundleArray = new Bundle[numberOfNurse][];
	//int[] solution = new int[numberOfNurse];
	// -------------------------------------


	public GeneticAlgorithm(int numberOfNurses, Map<Integer, ArrayList<Bundle>> nurseBundles){
		this.numberOfNurses = numberOfNurses;
		this.nurseBundles = nurseBundles;
	}

	/*public void assignMapToArray(Map<Integer, ArrayList<Bundle>> bundleNurseMap){
		for(int nurseNo : bundleNurseMap.keySet()){
			ArrayList<Bundle> bundleList = bundleNurseMap.get(nurseNo);
			for(int i = 0 ; i < bundleList.size(); i++){
				bundleArray[nurseNo-1][i] = bundleList.get(i);	
			}			
		}
	}*/

	// Calculate the cost of a propsed solution
	public double costf(int[] solution) {
		double cost = 0;

		for(int i=0; i < solution.length; i++){

			// Calculate cost of a solution
			cost += nurseBundles.get(Integer.valueOf(i)).get(solution[i]).getCostOfVisitBundle();

			// Split the visits by ,
			String[] visit = nurseBundles.get(Integer.valueOf(i)).get(solution[i]).getVisitSequence().split(",");

			// Add the visits to a list to avoid duplications
			for(int j=0; j < visit.length; j++){

				// If the visit is already in the collection of covered visits, penalize the bundle cost, else add it.
				if(listWithDuplicates.contains(visit[j].trim())){
					cost += GeneticAlgorithm.PENALTY_FACTOR;
				}
				else {
					listWithDuplicates.add(visit[j].trim());
				}
			}
		}

		// Print trace
		System.out.println("Info: Cost of the solution is: "+cost);

		// Round to 2 decimal places if needed
		return cost;
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

	private int generateRandomNumber(int min, int max){
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
    	ArrayList<ArrayList<Integer>> populationList = get50RandomSolutions(50);
    	int topElite = (int) (elite*populationSize);
    	
    	for(int i=0; i<maxIteration; i++){
    		//remove empty items from population
    		//costf()
    		Map<Double, ArrayList<Integer>> scores = new HashMap<Double,ArrayList<Integer>>();
    		for(ArrayList<Integer> v : populationList){
    			double costOfSolution = costf(v);
    			scores.put(costOfSolution, v);
    		}
    		
    		List<Double> costList = new ArrayList<Double>(scores.keySet());
    		Collections.sort(costList);
    		ArrayList<ArrayList<Integer>> rankedSolutions = new ArrayList<ArrayList<Integer>>();
    		for(Double cost: costList){
    			ArrayList<Integer> solution = scores.get(cost);
    			rankedSolutions.add(solution);
    		}
    		
    		rankedSolutions.subList(0, topElite);
    	}
    }

    public ArrayList<ArrayList<Integer>> get50RandomSolutions(int popSize){
    	ArrayList<ArrayList<Integer>> populationList = new ArrayList<ArrayList<Integer>>();
    	int[][] population = new int[numberOfNurse][];
    	for(int i =0; i<popSize; i++){
    		
    		ArrayList<Integer> vectorList = new ArrayList<Integer>();
    		for(int j=0; j<numberOfNurse; j++){
    			int vectorElement = generateRandomNumber(domain[j][0], domain[j][1]);
    			vectorList.add(j,vectorElement); 
    		}
    		
    		populationList.add(vectorList);		
    	}
    	System.out.println("50 random population :"+populationList);
    	return populationList;
    }

    private int[] mutate(int[] vector) {

    	// Generate a random integer, not including the upper bound
    	int randomNr = ThreadLocalRandom.current().nextInt(0, this.domain.length);

    	// Generate a random decimal, and perform the mutation



    	int[] mutatedVector = new int[numberOfNurse];
    	int step = 1;
    	if(randomNr < 0.5 && vector[randomNr] > domain[randomNr][0]){
    		for(int i=0; i< randomNr; i++){
    			if(i != randomNr){
    				mutatedVector[i] = vector[i];	
    			}else{
    				mutatedVector[randomNr] = vector[randomNr] - step;	
    			}
    			
    		}
    	}else if(vector[randomNr] < domain[randomNr][1]){
    		for(int i=0; i< randomNr; i++){
    			if(i != randomNr){
    				mutatedVector[i] = vector[i];	
    			}else{
    				mutatedVector[randomNr] = vector[randomNr] + step;	
    			}
    			
    		}
    	}
    	
    	return mutatedVector;
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

	public int[][] getDomain() {
		return this.domain;
	}

	public void setDomain(int[][] domain) {
    	this.domain = domain;
	}

	public int[] getSolution() {
    	return this.solution;
	}

	public void setSolution(int[] solution) {
		this.solution = solution;
	}

	public Map<Integer, ArrayList<Bundle>> getNurseBundles() {
		return nurseBundles;
	}

	public void setNurseBundles(HashMap<Integer, ArrayList<Bundle>> bundles){
    	this.nurseBundles = bundles;
	}
}
