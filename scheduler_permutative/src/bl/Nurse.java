package bl;

/**
 * Created by klajdi on 4/9/17.
 */
public class Nurse implements Comparable {
    private int nurseId=0;
    private String nurseName;
    private FeasiblePackage feasibleSchedule;

    public Nurse(int nurseId){
        this.nurseId = nurseId;
        this.nurseName = "Nurse-"+nurseId;
        this.feasibleSchedule = new FeasiblePackage();
    }

    @Override
    public int compareTo(Object o) {
        if((((Nurse) o).getId()) > this.nurseId){
            return -1;
        }
        else if ((((Nurse) o).getId()) < this.nurseId){
            return 1;
        }
        return 0;
    }

    public int getId(){
        return this.nurseId;
    }

    public FeasiblePackage getFeasiblePackage(){
        return this.feasibleSchedule;
    }
}
