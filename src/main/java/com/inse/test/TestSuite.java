package com.inse.test;


import com.inse.model.Bundle;
import com.inse.utility.ExcelParser;
import junit.framework.*;

import java.text.ParseException;
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


}