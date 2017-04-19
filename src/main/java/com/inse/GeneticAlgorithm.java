package main.java.com.inse;

import java.util.*;

public class GeneticAlgorithm {

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

		// Build an initial population
		List<int[]> population = new ArrayList<int[]>();

		for(int i=0; i < GeneticAlgorithm.POPULATION_SIZE; i ++){

			int[] entry = new int[domain.length];

			// Pick up random bundles from random nurses
			for(int j=0; j < domain.length; j++) {
				entry[j] = (int)(Math.random() * domain[j][1] + domain[j][0]) ;
			}

			population.add(entry);
		}

		// Winners from each generation
		int elite = (int)(GeneticAlgorithm.ELITISM * GeneticAlgorithm.POPULATION_SIZE);

		// Main loop
		for(int k=0; k < GeneticAlgorithm.MAXIMUM_NUMBER_ITERATIONS; k++){

			if(population.isEmpty()) {
				return;
			}

			

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
