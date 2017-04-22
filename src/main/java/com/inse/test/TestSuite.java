package com.inse.test;


import com.inse.model.Bundle;
import junit.framework.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class TestSuite extends TestCase {

    protected int value1, value2;

    // assigning the values
    protected void setUp(){
        value1 = 3;
        value2 = 3;
    }

    // test method to add two values
    public void testAdd(){
        double result = value1 + value2;
        assertTrue(result == 6);
    }

    // Test costf
    //public void testCostf(){
        //com.inse.scheduler.GeneticAlgorithm geneticAlgorithm = new com.inse.scheduler.GeneticAlgorithm();
        //Map<Integer, ArrayList<Bundle>> nurseBundles = new HashMap<Integer, ArrayList<Bundle>>();
       // Bundle bundle = new Bundle();
     //   nurseBundles.put(Integer.valueOf(1), (new ArrayList<Bundle>()).add(bundle));


   // }
}