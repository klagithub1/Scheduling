package com.inse.service;

import com.inse.utility.ExcelParser;

import java.text.ParseException;

public class NurseVisitProcessor {
    public void processNurseVisits() throws ParseException {
        ExcelParser parser = new ExcelParser();
        parser.parseExcelFile();
        parser.printBundlesPerNurse();
    }
}
