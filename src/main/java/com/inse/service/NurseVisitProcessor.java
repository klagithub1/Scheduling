package com.inse.service;

import com.inse.model.Bundle;
import com.inse.utility.ExcelParser;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NurseVisitProcessor {

    private List<String> bundlesPerNurse = new ArrayList<>();

    private Map<Integer,Double> visitsPriceList = new HashMap<Integer,Double>();
    private Map<Integer,ArrayList<Bundle>> bundlesForNurseStructure = new HashMap<Integer, ArrayList<Bundle>>();

    public void processNurseVisits() throws ParseException {
        ExcelParser parser = new ExcelParser();
        parser.parseExcelFile();
        parser.printBundlesPerNurse();
        List<String> bundlesPerNurse = parser.getBundlesPerNurseAsList();
        this.setBundlesPerNurse(bundlesPerNurse);
        bundlesForNurseStructure  = parser.getBundlesForNurse();
        visitsPriceList = parser.getVisitPrice();
    }

    public List<String> getBundlesPerNurseAsList() {
        return bundlesPerNurse;
    }

    public Map<Integer, ArrayList<Bundle>> getBundlesForNurse() {
        return this.bundlesForNurseStructure;
    }

    public void setBundlesPerNurse(List<String> bundlesPerNurse) {
        this.bundlesPerNurse = bundlesPerNurse;
    }

    public Map<Integer, Double> getVisitsPriceList() {
        return visitsPriceList;
    }

    public void setVisitsPriceList(Map<Integer, Double> visitsPriceList) {
        this.visitsPriceList = visitsPriceList;
    }
}
