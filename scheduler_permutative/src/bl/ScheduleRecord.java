package bl;

/**
 * Created by klajdi on 4/9/17.
 */
public class ScheduleRecord {

    private FeasiblePackage feasiblePackage;
    private Nurse nurse;

    public ScheduleRecord(Nurse nurse, FeasiblePackage feasiblePackage){
        this.nurse = nurse;
        this.feasiblePackage = feasiblePackage;
    }
}
