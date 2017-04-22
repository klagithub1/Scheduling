package com.inse.utility;


import com.inse.model.Bundle;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.ParseException;
import java.util.*;

public class ExcelParser {

    //private static final String FILE_NAME = "E://INSE//Data Sample 2-2.xlsx";
    private static final String FILE_NAME = "//Users//klajdi//Desktop//data_sample//Data Sample.xlsx";



    private static Map<Integer,ArrayList<Bundle>> bundlesForNurse = new HashMap<Integer, ArrayList<Bundle>>();
    private static final int BACKUP_NURSE_SHEET = 0;
    private static final int VISITS_COST_SHEET = 1;

    public void parseExcelFile() throws ParseException {
        try {

            FileInputStream excelFile = new FileInputStream(new File(FILE_NAME));
            Workbook workbook = new XSSFWorkbook(excelFile);
            Sheet backupNurseSheet = workbook.getSheetAt(BACKUP_NURSE_SHEET);
            Sheet feasibleVisits = workbook.getSheetAt(VISITS_COST_SHEET);

            parseBackupNurseSheet(backupNurseSheet);
            parseFeasibleVisitSheet(feasibleVisits);

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void parseBackupNurseSheet(Sheet backupNurseSheet) {
        Iterator<Row> iterator = backupNurseSheet.iterator();

        while (iterator.hasNext()) {

            Row currentRow = iterator.next();
            Iterator<Cell> cellIterator = currentRow.iterator();

            while (cellIterator.hasNext()) {

                Cell currentCell = cellIterator.next();
                if (currentCell.getCellTypeEnum() == CellType.STRING) {
                    //System.out.print(currentCell.getStringCellValue() + "--");
                } else if (currentCell.getCellTypeEnum() == CellType.NUMERIC) {
                    //System.out.print(currentCell.getNumericCellValue() + "--");
                }
            }
            System.out.println();
        }
    }


    private void parseFeasibleVisitSheet(Sheet feasibleVisits) throws IOException, ParseException {
        Iterator<Row> iterator = feasibleVisits.iterator();

        //Skip the first two header rows
        iterator.next(); iterator.next();

        // Iterate through each row
        while (iterator.hasNext()) {

            int nurseNo = 0;
            Row currentRow = iterator.next();
            Iterator<Cell> cellIterator = currentRow.iterator();

            // Skip the Column "Num"
            cellIterator.next();

            // Go through every cell in the row
            while (cellIterator.hasNext()) {

                double visitCost = 0;
                String nurseVisit = "";

                Cell currentCell = cellIterator.next();
                Cell costCell = cellIterator.next();

                nurseVisit = currentCell.getStringCellValue();

                if(costCell.getCellTypeEnum() == CellType.NUMERIC){
                    visitCost = costCell.getNumericCellValue();
                }

                // Filter out, empty bundles and 0 costs.
                if(!(nurseVisit.equals("") || nurseVisit.isEmpty() || visitCost == 0)){
                    assignBundlesToNurse( nurseNo, new Bundle(nurseVisit.trim(), visitCost));
                    System.out.println(" INFO: [ nurseNo: "+ nurseNo+" Bundle: \"" + nurseVisit.trim() + "\" - " + "Cost: " + visitCost+" ]");
                }

                // Check next nurse
                nurseNo++;
            }
        }
    }

    private void assignBundlesToNurse(int nurseNo, Bundle b) {
        if(bundlesForNurse.containsKey(nurseNo)){
            bundlesForNurse.get(nurseNo).add(b);
        }else{
            ArrayList<Bundle> bundles = new ArrayList<Bundle>();
            bundles.add(b);
            bundlesForNurse.put(nurseNo, bundles);
        }
    }

    public  void printBundlesPerNurse() {
        for(int nurse : bundlesForNurse.keySet()){
            System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            System.out.println("Nurse :"+nurse);
            for(Bundle b : bundlesForNurse.get(nurse)){
                System.out.println(b.getVisitSequence() + " -- "+ b.getCostOfVisitBundle());
            }
        }
    }

    public List<String> getBundlesPerNurseAsList() {
        List<String> bundlesPerNurse = new ArrayList<>();
        for(int nurse : bundlesForNurse.keySet()){
            System.out.println("Nurse :"+nurse);
            for(Bundle b : bundlesForNurse.get(nurse)){
                String bundleData = "Nurse N"+nurse + ":  " + b.getVisitSequence() + " -- "+ b.getCostOfVisitBundle();
                bundlesPerNurse.add(bundleData);
                System.out.println(b.getVisitSequence() + " -- "+ b.getCostOfVisitBundle());
            }
        }
        return bundlesPerNurse;
    }

    public static Map<Integer, ArrayList<Bundle>> getBundlesForNurse() {
        return bundlesForNurse;
    }
}