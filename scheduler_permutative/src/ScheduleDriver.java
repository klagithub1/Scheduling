import bl.FeasiblePackage;
import bl.Nurse;
import utils.CSVUtil;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

/**
 * Created by klajdi on 3/9/11.
 */
public class ScheduleDriver {

    public static  List<Nurse> nurseList = new ArrayList<Nurse>();
    public static TreeMap<Float, String> sortedOptimalSchedules = new TreeMap<Float, String>();
    public static TreeMap<String, Float> sortedPriceVisits = new TreeMap<String, Float>();
    public static void main(String[] args){

        //Build the price List
        String csvPriceFile = "/Users/klajdi/IdeaProjects/NurseScheduling/scheduler/src/sample_data/price_list_1.csv";
        Scanner priceScanner = null;

        try {
            priceScanner = new Scanner(new File(csvPriceFile));

            //Parser, analyze the csv line by line
            while (priceScanner.hasNext()) {
                List<String> line = CSVUtil.parseLine(priceScanner.nextLine());
                System.out.println("[visit= " + line.get(0) + ", price= " + line.get(1) + "]");
                sortedPriceVisits.put(line.get(0), Float.valueOf(line.get(1)));
            }
        }
        catch (FileNotFoundException e1) {
            e1.printStackTrace();
        }
        finally {
            priceScanner.close();
        }


        // Temporary database

        //List of ScheduleRecords

        Map<Integer, FeasiblePackage> records = new HashMap<Integer, FeasiblePackage >();

        Set<Nurse> nurses = new TreeSet<Nurse>();

        // Parse the csv
        String csvFile = "/Users/klajdi/IdeaProjects/NurseScheduling/scheduler/src/sample_data/data_sample_1.csv";
        Scanner scanner = null;

        try {
            scanner = new Scanner(new File(csvFile));

            //Parser, analyze the csv line by line
            while (scanner.hasNext()) {

                //Parse the line
                List<String> line = CSVUtil.parseLine(scanner.nextLine());

                //Test print the line
               // System.out.println("nurse [id= " + line.get(0) + ", bundle= " + line.get(1) + " , price=" + line.get(2) + "]");

                //Create a FeasiblePackage and insert a new ScheduleRecord

                String trimmedVisits = line.get(1).replaceAll("^\"|\"$", "");

                System.out.println("nurse [id= " + line.get(0) + ", bundle= " + line.get(1) + " , price=" + line.get(2) + "]");

                //Iterator it = nurses.iterator();
                Iterator it = nurseList.iterator();

                boolean existing = false;

                while(it.hasNext()){
                    Nurse n = (Nurse)it.next();

                    if(n.getId() == Integer.parseInt(line.get(0))){
                        n.getFeasiblePackage().schedule.put(Float.valueOf(line.get(2)), trimmedVisits);
                        existing = true;
                        break;
                    }
                }

                if(!existing) {
                    Nurse nurse = new Nurse(Integer.parseInt(line.get(0)));
                    nurse.getFeasiblePackage().schedule.put(Float.valueOf(line.get(2)), trimmedVisits);
                    //System.out.println("--newly entered "+ nurse.getId());
                    //nurses.add(nurse);
                    nurseList.add(nurse);
                }

            }
        }
        catch (FileNotFoundException e1) {
            e1.printStackTrace();
        }
        finally {
            scanner.close();
        }

        //Iterator it = nurses.iterator();
        Iterator it = nurseList.iterator();

        while(it.hasNext()){
            Nurse n = (Nurse)it.next();

            System.out.println("nurse "+ n.getId());

            Iterator in = n.getFeasiblePackage().schedule.keySet().iterator();
            while(in.hasNext()) {
                Float key = (Float)in.next();
                System.out.println(key+" - "+n.getFeasiblePackage().schedule.get(key));

            }

        }

        String arrangement = "";
        for(int i=0; i < nurseList.size(); i++){
            arrangement = arrangement + i;

        }



        long start_time = System.currentTimeMillis();

        ScheduleDriver.permutation(arrangement);

        long end_time = System.currentTimeMillis();

        System.out.println("total sorting execution time: "+(end_time-start_time)+ " ms");

        System.out.println(sortedOptimalSchedules.toString());

    }

    public static void permutation(String str) {
        permutation("", str);
    }

    private static void permutation(String prefix, String str) {
        int n = str.length();
        if (n == 0) {
            System.out.println("--------- Covering permutation: "+prefix+" -----------");
            calculateOptimalSchedule(prefix);
            System.out.println("---------------------------");
            System.out.println();
            System.out.println();

        }
        else {
            for (int i = 0; i < n; i++){
                permutation(prefix + str.charAt(i), str.substring(0, i) + str.substring(i+1, n));
            }
        }
    }

    public static void calculateOptimalSchedule(String order){

        //Keep a list of covered paths
        HashSet<String> coveredPaths = new HashSet<String>();

        //Keep a list of uncovered paths
        HashSet<String> uncoveredPaths = new HashSet<String>();

        //Calculate Price of Uncovered Visits
        float priceOfUncoveredVisits = 0;

        //Calucate Cost of Covered Visits
        float priceOfCoveredVisits = 0;

        //Calculate total Schedule Price
        float schedulePrice = 0f;

        List<String> nurseSelected = new ArrayList<String>();

        // Iterate through each nurse in the permutative order
        for (int i = 0; i < order.length(); i++) {

            // Derive the integer order of that nurse
            int index = Integer.valueOf(Character.toString(order.charAt(i)));

            //Calculate her cheapest schedule
            System.out.println();
            System.out.println("Calculating cheapest schedule for nurse "+ (index+1)+" :");

            //Iterate through each entry schedule fo the nurse
            for(Map.Entry<Float,String> entry : nurseList.get(index).getFeasiblePackage().schedule.entrySet()) {
                Float key = entry.getKey();
                String value = entry.getValue();

                System.out.println(key + " => " + value);

                boolean pathCovered = false;
                boolean cheapestScheduleCalculated = false;

                //Explode the first cheapest schedule in pieces and check if any is in the covered Paths
                String[] pieces = (value).split(",");

                for(int j=0; j< pieces.length ; j++)
                {
                    //If visit is in covered path, dont consider it,move to the next one
                    if(coveredPaths.contains((pieces[j]).trim())){
                        pathCovered = true;
                    }
                }

                if(!pathCovered){
                    System.out.println("Cheapest Schedule Calculated for Nurse "+(index+1)+" is: ["+key + " => " + value+"]");
                    for(int z=0; z< pieces.length ; z++)
                    {
                        coveredPaths.add((pieces[z]).trim());
                        cheapestScheduleCalculated = true;
                    }

                    priceOfCoveredVisits += key;
                    nurseSelected.add("{<Nurse: "+(index+1)+">, <Schedule: "+value+">, <Price: "+key+">, <Permutation: "+order+">}");
                }

                if(cheapestScheduleCalculated){
                    break;
                }
            }
        }

        //Calculate paths not covered

        Iterator it = sortedPriceVisits.keySet().iterator();
        while(it.hasNext()){
            String visit = it.next().toString();
            if(!(coveredPaths.contains(visit))){
                uncoveredPaths.add(visit);

                //Calculate Price of Uncovered Visits
                priceOfUncoveredVisits+= (sortedPriceVisits.get(visit)).floatValue();

            }
        }

        //Price of this Schedule:
        schedulePrice = priceOfUncoveredVisits + priceOfCoveredVisits;
        System.out.println();
        System.out.println("[ Permutation Order: "+order+" ]"+"[ Covered Visits: "+coveredPaths.toString()+" ] [ Total Cost of Nurse Schedule: "+priceOfCoveredVisits+" ]"
                +"[ Uncovered Visits: "+uncoveredPaths.toString()+" ][ Price of Uncovered Visits:" +priceOfUncoveredVisits+"] [* TOTAL PRICE of Schedule: "+schedulePrice+" *]");

        sortedOptimalSchedules.put(schedulePrice, nurseSelected.toString()+" - "+coveredPaths.toString()+" - "+uncoveredPaths.toString());
    }
}
