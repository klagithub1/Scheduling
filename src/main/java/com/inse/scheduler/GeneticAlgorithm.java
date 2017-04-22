package com.inse.scheduler;

import java.util.*;
import com.inse.model.*;

public class GeneticAlgorithm {

	// Start bundle per nurse, decide which bundle we consider part of the domain per each nurse
	private final static int NURSE_START_BUNDLE = 0;

	// Penalty coefficient for allowing duplicates
	private final static double PENALTY_FACTOR = 100.00;

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

	// Represents solution suggested, in form of an array index to the nurseBundles data structure.
	// e.g. [1 ,9 , 0] represents the first nurse's second feasible bundle,
	// the second nurse's tenth feasible bundle and the third nurse's first feasible bundle.
	// In the end is set to represent the most optimal (fittest candidate) sample.
	private int[] solution;

	// Constructor
	public GeneticAlgorithm(Map<Integer, ArrayList<Bundle>> nurseBundles){
		this.nurseBundles = nurseBundles;
		this.initDomain();
	}

	// Calculate the cost of a proposed solution
	private double costf(int[] solution) {
		//System.out.println("-----------------------");
		//System.out.println(printVector(solution));
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
		//System.out.println("Info: Cost of the solution is: "+cost);

		return cost;
    }

    public void geneticOptimize(){

		// Build an initial population of solutions
		List<int[]> population = new ArrayList<int[]>();

		// Determine elite winners population sample size
		// e.g. if Elite is 0.2 (20%) and population size is 10, then the best 2 individuals are the elite
		int topelite = (int)(ELITISM * POPULATION_SIZE);

		// Initialize a random population
		for(int i=0; i < GeneticAlgorithm.POPULATION_SIZE; i ++){

			int[] entry = new int[domain.length];

			// Pick up random bundles from random nurses
			for(int j=0; j < domain.length; j++) {
				entry[j] = (int)(Math.random() * domain[j][1] + domain[j][0]) ;
			}
			population.add(entry);
		}

		//System.out.println(printPopulation((ArrayList<int[]>) population));

		// Main loop, evolution of populations over number of iterations, each loop end produces a new generation of population
		for(int k=0; k < GeneticAlgorithm.MAXIMUM_NUMBER_ITERATIONS; k++){

			// Exit the loop if there is no population
			if(population.isEmpty()) {
				break;
			}

			// Sort population by price ASC, cheapest price first
			TreeMap<Double, int[]> rankedPopulationMap = new TreeMap<Double, int[]>();

			// Go through the population and add them to the sorted tree, duplications will not be considered
			for (int c=0; c < population.size(); c++){
				rankedPopulationMap.put(Double.valueOf(this.costf(population.get(c))), population.get(c));
			}

			// Declare the new generation (new population) which will be the result of this iteration
			List<int[]> newPopulation = new ArrayList<int[]>();

			// Map the Tree to a temporary list
			List<int[]> rankedPopulationList = new ArrayList<int[]>();

			// Iterate through the tree map and add the first solutions to the new population, as being part of the elite

			// Elite counter, stop at counter < elite
			int elite_counter = 0;

			for(Map.Entry<Double,int[]> entry : rankedPopulationMap.entrySet()) {

				// Take the first best solutions as per the elite of population
				if(elite_counter < topelite) {
					newPopulation.add(entry.getValue());
					elite_counter++;
				}

				//System.out.println(entry.getKey() + " => " + printVector(entry.getValue()));
				rankedPopulationList.add(entry.getValue());
			}

			//System.out.println(printPopulation((ArrayList<int[]>) rankedPopulationList));

			//Starting with these top elite, mutate and crossover between them, until we fill the new population
			while(newPopulation.size() < POPULATION_SIZE){

				// Mutate a random vector from population
				if(Math.random() < MUTATION_RATE) {

					//Pick a random integer between 0 and top elite and add the mutated vector
					newPopulation.add(mutate(rankedPopulationList.get(((int) (Math.random() * topelite)))));
				} else {
					//TODO refactoring, the crossover can be an if statement of its own, it doesnt have to happen all the time
					newPopulation.add(crossover(rankedPopulationList.get(((int) (Math.random() * topelite))), rankedPopulationList.get(((int) (Math.random() * topelite)))));
				}
			}

			population.clear();
			population = newPopulation;
			//System.out.println(printPopulation((ArrayList<int[]>) population));
		}

		System.out.println(prettyPrintSolution(population.get(0), costf(population.get(0)) ));

    }

    private int[] mutate(int[] vector) {

    	System.out.println("Mutation: ");
    	System.out.println(printVector(vector));

    	// Generate a random integer, starting from 0 and not including the upper bound
    	int i = (int)(Math.random() * domain.length);

    	// Generate a random decimal, and perform the mutation
		if((Math.random() < GeneticAlgorithm.MUTATION_DECIMAL) && (vector[i] > domain[i][0])) {

			vector[i] -= GeneticAlgorithm.MUTATION_STEP;

			System.out.println("Mutated: ");
			System.out.println(printVector(vector));
			return vector;

		} else if(vector[i] < domain[i][1]) {

			vector[i] += GeneticAlgorithm.MUTATION_STEP;
			System.out.println("* Mutated: ");
			System.out.println(printVector(vector));
			return vector;

		} else {
			// By default, there is no mutation
			System.out.println("Not Mutated: ");
			System.out.println(printVector(vector));
			return vector;
		}
    }

    private int[] crossover(int[] vector1, int[] vector2) {
		System.out.println("---------------------------");
		System.out.println("Crossover: ");
		System.out.println(printVector(vector1));
		System.out.println(printVector(vector2));

		int[] crossOver = new int[domain.length];

		int rand = (int)(Math.random() * domain.length);
		System.out.println(rand);

		for(int i =0; i < crossOver.length-1; i ++) {
			if( i <= rand ) {
				crossOver[i] = vector1[i];
			}
			else{
				crossOver[i] = vector2[i];
			}
		}
		System.out.println(printVector(crossOver));
		System.out.println("---------------------------");
		return crossOver;
	}

	private TreeMap<Double, int[]> rankPopulationByPrice(ArrayList<int[]> population){

    	TreeMap<Double, int[]> rankedPopulation = new TreeMap<Double, int[]>();

		// Go through the population and add them to the tree, duplicates will be removed
		for (int c=0; c < population.size(); c++){
			rankedPopulation.put(Double.valueOf(this.costf(population.get(c))), population.get(c));
		}

    	return rankedPopulation;
	}

	// Sorting the population, by schedule price
	/*private List<Schedule> sortPopulation(List<int[]> population){
		List<Schedule> unSortedPopulation = new ArrayList<Schedule>();
		List<Schedule> sortedPopulation = new ArrayList<Schedule>();

		double[] vectorCost = new double[population.size()];

		// Iterate through all vectors
		for (int i=0; i < population.size(); i++){

			unSortedPopulation.add(new Schedule(costf(population.get(i)), population.get(i)));
			vectorCost[i] = costf(population.get(i);
		}

		// Iterate through all the unsorted
		for(){

		}

		return sortedPopulation;
	}*/


	private void initDomain(){

		if(this.nurseBundles.keySet().size() > 0) {
			this.domain = new int[this.nurseBundles.keySet().size()][2];

			// Iterate through the nurses and count the bundles
			for(int i=0; i < this.nurseBundles.keySet().size(); i++ ){
				//System.out.println("***** "+ i + " "+(this.nurseBundles.get(i).size() - 1));
				domain[i][0] = NURSE_START_BUNDLE;
				domain[i][1] = (this.nurseBundles.get(i).size() - 1);
			}
		} else {
			//TODO this should throw some sort of exception as we have no problem to solve if we're here
			return;
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
