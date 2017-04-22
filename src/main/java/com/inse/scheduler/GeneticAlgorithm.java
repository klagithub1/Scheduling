package com.inse.scheduler;

import java.util.*;
import com.inse.model.*;

public class GeneticAlgorithm {

	// Start bundle per nurse, decide which bundle we consider part of the domain per each nurse
	private final static int NURSE_START_BUNDLE = 0;

	// Penalty coefficient for allowing duplicates
	private final static double PENALTY_FACTOR = 10000.00;

	// Size of Population
	private final static int POPULATION_SIZE = 50 ;

	// Max number of iterations
	private final static int MAXIMUM_NUMBER_ITERATIONS = 100;

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

	// List with duplicates, ot maintain covered visits in order to prevent their reuse.
	private Set<String> listWithDuplicates = new TreeSet<String>();

	public GeneticAlgorithm(Map<Integer, ArrayList<Bundle>> nurseBundles){
		this.nurseBundles = nurseBundles;
		this.initDomain();

	}

	// Calculate the cost of a proposed solution
	private double costf(int[] solution) {
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

    public void geneticOptimize(){

		/* Build the initial population */

		// Build an initial population
		List<int[]> population = new ArrayList<int[]>();

		// Determine elite winners
		int topelite = (int)(ELITISM * POPULATION_SIZE);

		// Main genetic evolution loop
		for(int i=0; i < GeneticAlgorithm.POPULATION_SIZE; i ++){

			int[] entry = new int[domain.length];

			// Pick up random bundles from random nurses
			for(int j=0; j < domain.length; j++) {
				entry[j] = (int)(Math.random() * domain[j][1] + domain[j][0]) ;
			}

			population.add(entry);
		}

		System.out.println(printPopulation((ArrayList<int[]>) population));


		// Main loop
		for(int k=0; k < GeneticAlgorithm.MAXIMUM_NUMBER_ITERATIONS; k++){

			// Exit the loop if there is no population
			if(population.isEmpty()) {
				break;
			}

			// Filter the empty population vectors
			// TODO

			// Sorted by Price population
			TreeMap<Double, int[]> rankedPopulation = new TreeMap<Double, int[]>();

			for (int c=0; c < population.size(); c++){
				rankedPopulation.put(Double.valueOf(this.costf(population.get(c))), population.get(c));
			}

			// Start a new population where we take only the elite winners, e.g. top 10
			List<int[]> newPopulation = new ArrayList<int[]>();

			for(int l=0; l < topelite; l++){
				//TODO fix this
				newPopulation.add(rankedPopulation.get(l));
			}

			//Starting with these top elite, mutate and crossover between them, until we fill the new population
			while(newPopulation.size() < POPULATION_SIZE){

				// Mutate a random vector from population
				if(Math.random() < MUTATION_RATE) {

					//Pick a random integer between 0 and top elite and add the mutated vector
					newPopulation.add(mutate(rankedPopulation.get(((int) (Math.random() * topelite)))));
				} else {
					//TODO refactoring, the crossover can be an if statement of its own, it doesnt have to happen all the time

					newPopulation.add(crossover(rankedPopulation.get(((int) (Math.random() * topelite))), rankedPopulation.get(((int) (Math.random() * topelite)))));
				}

			}

			population.clear();
			population = newPopulation;

		}
    }

    private int[] mutate(int[] vector) {

    	// Generate a random integer, starting from 0 and not including the upper bound
    	int i = (int)(Math.random() * domain.length);

    	// Generate a random decimal, and perform the mutation
		if((Math.random() < GeneticAlgorithm.MUTATION_DECIMAL) && (vector[i] > domain[i][0])) {

			vector[i] -= GeneticAlgorithm.MUTATION_STEP;
			return vector;

		} else if(vector[i] < domain[i][1]) {

			vector[i] += GeneticAlgorithm.MUTATION_STEP;
			return vector;

		} else {
			// By default, there is no mutation
			return vector;
		}
    }

    private int[] crossover(int[] vector1, int[] vector2) {

		int[] crossOver = new int[domain.length];

		int rand = (int)(Math.random() * domain.length + 1);

		for(int i =0; i < crossOver.length; i ++) {
			if( i <= rand ) {
				crossOver[i] = vector1[i];
			}
			else{
				crossOver[i] = vector2[i];
			}
		}
		return crossOver;
	}

	// Randomly generate an individual from the domain.
	private int[] generateRandomVector(){
    	int[] randomVector = new int[domain.length];


    	return randomVector;
	}

	private void initDomain(){

		if(this.nurseBundles.keySet().size() > 0) {
			this.domain = new int[this.nurseBundles.keySet().size()][2];

			// Iterate through the nurses and count the bundles
			for(int i=0; i < this.nurseBundles.keySet().size(); i++ ){
				System.out.println("***** "+ i + " "+(this.nurseBundles.get(i).size() - 1));
				domain[i][0] = NURSE_START_BUNDLE;
				domain[i][1] = (this.nurseBundles.get(i).size() - 1);
			}
		} else {
			//TODO this should throw some sort of exception as we have no problem to solve if we're here
			return;
		}

		System.out.println(printDomain());
	}

	public void setNurseBundles(Map<Integer, ArrayList<Bundle>> nurseBundles) {
		this.nurseBundles = nurseBundles;
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
			printedPopulation += "INFO: random vector "+i+" --> [";
			for(int j=0; j < population.get(i).length; j++){
				printedPopulation += population.get(i)[j]+",";
			}
			printedPopulation = printedPopulation.substring(0, printedPopulation.length() - 1);
			printedPopulation += "]"+"\n";
		}
		return printedPopulation;
	}
}
