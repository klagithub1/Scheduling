package com.inse.test;

import com.inse.scheduler.GeneticAlgorithm;
import com.inse.utility.ExcelParser;

import java.text.ParseException;

/**
 * Created by klajdi on 4/22/17.
 */
public class TestDriver {

    public static void main(String[] args){

        ExcelParser parser =  new ExcelParser();

        try {
            parser.parseExcelFile();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        parser.getBundlesForNurse();

        new GeneticAlgorithm(parser.getBundlesForNurse()).geneticOptimize();

    }
}
