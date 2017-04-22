package com.inse.service;

import com.inse.utility.ExcelParser;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

public class NurseVisitProcessor {

    private List<String> bundlesPerNurse = new ArrayList<>();

    public void processNurseVisits() throws ParseException {
        ExcelParser parser = new ExcelParser();
        parser.parseExcelFile();
        parser.printBundlesPerNurse();
        List<String> bundlesPerNurse = parser.getBundlesPerNurseAsList();
        this.setBundlesPerNurse(bundlesPerNurse);
    }

    public List<String> getBundlesPerNurse() {
        return bundlesPerNurse;
    }

    public void setBundlesPerNurse(List<String> bundlesPerNurse) {
        this.bundlesPerNurse = bundlesPerNurse;
    }
}
