package com.inse.scheduler;

import java.util.*;
import com.inse.model.*;

public class GeneticAlgorithm {

	// Enable multipass (Slower), if enabled does the genetic algorithm many times, as indicated and keeps the best solution,
	private final static int MULTIPASS_FACTOR=200;

	// Start bundle per nurse, decide which bundle we consider part of the domain per each nurse
	private final static int NURSE_START_BUNDLE = 0;

	// Penalty coefficient for allowing duplicates
	private final static double PENALTY_FACTOR = 1000.00;

	// Size of Population
	private final static int POPULATION_SIZE = 50 ;

	// Max number of iterations
	private final static int MAXIMUM_NUMBER_ITERATIONS = 1000;

	// Mutation probability rate
	private final static double MUTATION_RATE = 0.2;

	// Mutation less than 1
	private final static double MUTATION_DECIMAL= 0.5;

	// Mutation Step
	private final static int MUTATION_STEP = 1;

	// Crossover probability rate
	private final static double CROSSOVER_RATE = 0.2;

	// Elitism sample
	private final static double ELITISM = 0.2;

	// Represents domain of population, meaning where we take the samples for the population, used for indexing
	// The first dimension represents nurse index, the second dimension has 2 elements,
	// first representing start bundle and last bundle of each nurse.
	// e.g. domain[2][0] -> gives us the index of the first bundle for the third nurse
	// e.g. domain[2][1] -> gives us the index of the last bundle for the third nurse
	private int[][] domain;

	// Represent nurses' bundles data structure, where each position in the list represent a nurse, e.g. position 0 represent nurse 1
	private Map<Integer, ArrayList<Bundle>> nurseBundles = new HashMap<Integer, ArrayList<Bundle>>();

	// Represent regular price list
	private Map<Integer,Double> visitsPriceList = new HashMap<Integer,Double>();

	// Constructor
	public GeneticAlgorithm(Map<Integer, ArrayList<Bundle>> nurseBundles, Map<Integer,Double> visitsPriceList ){
		this.nurseBundles = nurseBundles;
		this.visitsPriceList = visitsPriceList;

		// Initialize domain
		try {
			this.initDomain();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	// Calculate the cost of a proposed solution
	private double costf(int[] solution) {
		double cost = 0;

		Set<String> listWithDuplicates = new TreeSet<String>();

		for(int i=0; i < solution.length; i++){

			// Calculate cost of a solution
			cost += nurseBundles.get(Integer.valueOf(i)).get(solution[i]).getCostOfVisitBundle();

			// Split the visits by ,
			String[] visit = nurseBundles.get(Integer.valueOf(i)).get(solution[i]).getVisitSequence().split(",");

			//System.out.println(nurseBundles.get(Integer.valueOf(i)).get(solution[i]).getVisitSequence());

			// Add the visits to a list to avoid duplications
			for(int j=0; j < visit.length; j++){

				// If the visit is already in the collection of covered visits, penalize the bundle cost, else add it.
				if(listWithDuplicates.contains(visit[j].trim())){
					cost += GeneticAlgorithm.PENALTY_FACTOR;
					//System.out.println("!Penalized! The cost now is: "+cost);
				}
				else {
					listWithDuplicates.add(visit[j].trim());
				}
			}
			//System.out.println(listWithDuplicates);
		}

		// Print trace
		// System.out.println("Info: Cost of the solution is: "+cost);

		return cost;
    }

    public Schedule calculateOptimalSchedule() {

		// Step 1 - Genetic Optimization, return best schedule with least conflicts
		int[] solution;

		if(MULTIPASS_FACTOR > 0) {
			ArrayList<int[]> sortedSolutions = new ArrayList<int[]>();
			Map<Double, int[]> rankedSolutions = new TreeMap<Double, int[]>();

			int multipasscounter = 0;

			while (multipasscounter < MULTIPASS_FACTOR){
				System.out.println("executing"+multipasscounter);
				int[] aSolution = this.geneticOptimize();
				rankedSolutions.put(Double.valueOf(costf(aSolution)), aSolution);
				multipasscounter++;
			}

			for(Map.Entry<Double,int[]> entry : rankedSolutions.entrySet()) {

				sortedSolutions.add(entry.getValue());
			}

			solution = sortedSolutions.get(0);
		}
		else
		{
			solution = this.geneticOptimize();
		}

		// Step 2 - Assign solution to a solution bundle to build a schedule

		Map<Integer, Bundle> solutionBundle = new HashMap<Integer, Bundle> ();

		for(int i=0; i < solution.length; i++){
			solutionBundle.put(Integer.valueOf(i), this.nurseBundles.get(Integer.valueOf(i)).get(solution[i]));
		}

		// Step 3 - Check Covered and Uncovered Visits

		Set<String> coveredVisits = new HashSet<String>();
		Set<String> unCoveredVisits = new HashSet<String>();
		Set<String> duplicateVisits = new HashSet<String>();


		// Iterate through the visit price list to build initial list

		Iterator<Integer> it = visitsPriceList.keySet().iterator();

		while(it.hasNext()){
			unCoveredVisits.add(it.next().toString());
		}

		// Add the visits that are covered

		for(int i=0; i < solution.length; i++){
			String[] visits = solutionBundle.get(Integer.valueOf(i)).getVisitSequence().trim().split(",");

			for(int j=0; j < visits.length; j++ ){

				// Add Duplicates
				if(coveredVisits.contains(visits[j].trim())){
					duplicateVisits.add(visits[j].trim());
				}
				// Add to covered visits
				coveredVisits.add(visits[j].trim());
			}
		}

		// Calculate Uncovered Visits

		unCoveredVisits.removeAll(coveredVisits);

		System.out.println(unCoveredVisits);
		System.out.println(coveredVisits);
		System.out.println(duplicateVisits);

		// Decide which nurse to eliminate, with the least impact

		// Dramatization !!

		return new Schedule(solutionBundle);
	}

//	private Map<Integer, Bundle> lastResortDramaticEleminationOfDuplicates(Map<Integer, Bundle> solutionBundle, Set<String> duplicateVisits ){
//		Map<Integer, ArrayList<Bundle>> dramaticSolution = new HashMap<Integer, ArrayList<Bundle>> ();
//
//		Map<Double, Map<Integer, Bundle>>
//
//		for(int i=0; i < solutionBundle.size(); i++){
//			String[] visits = solutionBundle.get(Integer.valueOf(i)).getVisitSequence().trim().split(",");
//
//		}
//
//
//
//		return dramaticSolution;
//	}
//
//
//	private double caluclateVisitAveragePrice(){
//
//		double cost = 0;
//		for(int i=0; i < visitsPriceList.size(); i++){
//			cost += visitsPriceList.get(Integer.valueOf(i)).doubleValue();
//		}
//
//		return (cost / (double) visitsPriceList.size());
//	}

    private int[] geneticOptimize(){

		// Determine elite winners population sample size
		// e.g. if Elite is 0.2 (20%) and population size is 10, then the best 2 individuals are the elite
		int topelite = (int)(ELITISM * POPULATION_SIZE);

		// Initialize a random population
		ArrayList<int[]> population = initializeRandomPopulation();

		// Main loop, evolution of populations over number of iterations, each loop end produces a new generation of population
		for(int k=0; k < GeneticAlgorithm.MAXIMUM_NUMBER_ITERATIONS; k++){

			// Declare the new generation (new population) which will be the result of this iteration
			ArrayList<int[]> newPopulation = new ArrayList<int[]>();

			// Exit the loop if there is no population
			if(population.isEmpty()) {
				break;
			}

			// Sort population by price ASC, cheapest price first
			ArrayList<int[]> sortedByPricePopulation = sortPopulationByPrice((ArrayList<int[]>) population);

			// Add the first solutions matching the number of elite population to the new population
			// e.g. if elite is 10, the first 10 vectors should move on to the next generation
			for(int i=0; i < topelite; i++){
				if(sortedByPricePopulation.size() < 1) {
					break;
				} else if(sortedByPricePopulation.size() < topelite) {
					topelite = sortedByPricePopulation.size();
					newPopulation.add(sortedByPricePopulation.get(i));
				} else {
					newPopulation.add(sortedByPricePopulation.get(i));
				}
			}

			//Starting with these top elite, mutate and crossover between them, until we fill the new population
			while(newPopulation.size() < POPULATION_SIZE){

				// Mutate a random vector from population
				if(Math.random() < MUTATION_RATE) {

					//Pick a random integer between 0 and top elite and add the mutated vector
					newPopulation.add(mutate(sortedByPricePopulation.get(((int) (Math.random() * topelite)))));
				} else {
					//TODO refactoring, the crossover can be an if statement of its own, it doesnt have to happen all the time
					newPopulation.add(crossover(sortedByPricePopulation.get(((int) (Math.random() * topelite))), sortedByPricePopulation.get(((int) (Math.random() * topelite)))));
				}
			}

			population.clear();
			population = newPopulation;
			//System.out.println(printPopulation((ArrayList<int[]>) population));
		}

		return population.get(0);

		//System.out.println(prettyPrintSolution(population.get(0), costf(population.get(0)) ));
    }

    private int[] mutate(int[] vector) {

//    	System.out.println("Mutation: ");
//    	System.out.println(printVector(vector));

    	// Generate a random integer, starting from 0 and not including the upper bound
    	int i = (int)(Math.random() * domain.length);

    	// Generate a random decimal, and perform the mutation
		if((Math.random() < GeneticAlgorithm.MUTATION_DECIMAL) && (vector[i] > domain[i][0])) {

			vector[i] -= GeneticAlgorithm.MUTATION_STEP;

//			System.out.println("Mutated: ");
//			System.out.println(printVector(vector));
			return vector;

		} else if(vector[i] < domain[i][1]) {

			vector[i] += GeneticAlgorithm.MUTATION_STEP;
//			System.out.println("* Mutated: ");
//			System.out.println(printVector(vector));
			return vector;

		} else {
			// By default, there is no mutation
//			System.out.println("Not Mutated: ");
//			System.out.println(printVector(vector));
			return vector;
		}
    }

    private int[] crossover(int[] vector1, int[] vector2) {

		int[] crossOver = new int[domain.length];

		int rand = (int)(Math.random() * domain.length);

		for(int i =0; i < crossOver.length-1; i ++) {
			if( i <= rand ) {
				crossOver[i] = vector1[i];
			}
			else{
				crossOver[i] = vector2[i];
			}
		}
		return crossOver;
	}

//	private TreeMap<Double, int[]> rankPopulationByPrice(ArrayList<int[]> population){
//
//    	TreeMap<Double, int[]> rankedPopulation = new TreeMap<Double, int[]>();
//
//		// Go through the population and add them to the tree, duplicates will be removed
//		for (int c=0; c < population.size(); c++){
//			rankedPopulation.put(Double.valueOf(this.costf(population.get(c))), population.get(c));
//		}
//
//    	return rankedPopulation;
//	}

	private ArrayList<int[]> initializeRandomPopulation(){

		ArrayList<int[]> randomPopulation = new ArrayList<int[]>();

		for(int i=0; i < GeneticAlgorithm.POPULATION_SIZE; i ++){

			int[] entry = new int[domain.length];

			// Pick up random bundles from random nurses
			for(int j=0; j < domain.length; j++) {
				entry[j] = (int)(Math.random() * domain[j][1] + domain[j][0]) ;
			}
			randomPopulation.add(entry);
		}
		return randomPopulation;
	}

	private ArrayList<int[]> sortPopulationByPrice(ArrayList<int[]> population){

		ArrayList<int[]> sortedPopulation = new ArrayList<int[]>();

		// Go through the population and add them to the sorted tree, duplications will not be considered
		TreeMap<Double, int[]> rankedPopulationMap = new TreeMap<Double, int[]>();
		
		for (int c=0; c < population.size(); c++){
			rankedPopulationMap.put(Double.valueOf(this.costf(population.get(c))), population.get(c));
		}

		for(Map.Entry<Double,int[]> entry : rankedPopulationMap.entrySet()) {
			
			sortedPopulation.add(entry.getValue());
		}
		return sortedPopulation;
	}

	private void initDomain() throws Exception{

		if(this.nurseBundles.keySet().size() > 0) {
			this.domain = new int[this.nurseBundles.keySet().size()][2];

			// Iterate through the nurses and count the bundles
			for(int i=0; i < this.nurseBundles.keySet().size(); i++ ){
				domain[i][0] = NURSE_START_BUNDLE;
				domain[i][1] = (this.nurseBundles.get(i).size() - 1);
			}
		} else {
			//TODO this should throw some sort of exception as we have no problem to solve if we're here

			throw new Exception();
		}

		System.out.println(printDomain());
	}

	public String printDomain(){

		String printedDomain = "{ ";
		for(int i=0; i < domain.length; i++){
			printedDomain += "( ";
			for(int j=0; j < domain[i].length; j++){
				printedDomain += domain[i][j]+" ";
			}
			printedDomain += ")";
		}
		printedDomain += " }";

		return printedDomain;
	}

	public String printPopulation(ArrayList<int[]> population){

		String printedPopulation = "";
		for(int i=0; i < population.size(); i++){
			printedPopulation += "INFO: vector "+i+" --> [";
			for(int j=0; j < population.get(i).length; j++){
				printedPopulation += population.get(i)[j]+",";
			}
			printedPopulation = printedPopulation.substring(0, printedPopulation.length() - 1);
			printedPopulation += "]"+"\n";
		}
		return printedPopulation;
	}

	public String printVector(int[] vector) {

		String printedVector="";
		printedVector += "[";
		for(int j=0; j < vector.length; j++){
			printedVector += vector[j]+",";
		}
		printedVector = printedVector.substring(0, printedVector.length() - 1);
		printedVector += "]";
		return printedVector;
	}

	public String prettyPrintSolution(int[] vector, double cost){

		String printedSolution = "***********************************"+"\n";

		for(int i=0; i < vector.length; i++){
			Bundle bundle = this.nurseBundles.get(Integer.valueOf(i)).get(vector[i]);
			printedSolution += "*** Nurse: "+ (i+1)+"\n";
			printedSolution += "*** Visit Bundle Sequence: "+bundle.getVisitSequence()+"\n";
			printedSolution += "*** Cost of Visit Bundle Sequence: "+bundle.getCostOfVisitBundle()+"\n";
			printedSolution += "\n";
		}

		printedSolution += "------------------------------------"+"\n";
		printedSolution += "*** TOTAL COST of Schedule: "+cost+" ***"+"\n";

		printedSolution += "***********************************";

		return printedSolution;
	}
}
