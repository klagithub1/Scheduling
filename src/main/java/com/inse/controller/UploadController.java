package com.inse.controller;

import com.inse.model.Bundle;
import com.inse.service.NurseVisitProcessor;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;

@Controller
public class UploadController {

    private static String UPLOADED_FOLDER = "E://INSE//";
    private NurseVisitProcessor nurseVisitProcessor = new NurseVisitProcessor();

    @GetMapping("/")
    public String index() {
        return "upload";
    }

    //@RequestMapping(value = "/upload", method = RequestMethod.POST)
    @PostMapping("/upload") //new annotation since 4.3
    public String singleFileUpload(@RequestParam("file") MultipartFile file,
                                   RedirectAttributes redirectAttributes) {

        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("message", "Please select a file to upload");
            return "redirect:uploadStatus";
        }

        try {

            byte[] bytes = file.getBytes();
            Path path = Paths.get(UPLOADED_FOLDER + file.getOriginalFilename());
            Files.write(path, bytes);

            nurseVisitProcessor.processNurseVisits();
            redirectAttributes.addFlashAttribute("message", "You successfully uploaded '" + file.getOriginalFilename() + "'");

        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return "redirect:/list";
    }

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public ModelAndView getList(){
        List<String> list  = getListItems();
        ModelAndView model = new ModelAndView("listBundles");
        model.addObject("lists", list );

        return model;
    }

    private List<String> getListItems(){
        List<String> list  = nurseVisitProcessor.getBundlesPerNurse();
        return list;
    }

    @GetMapping("/uploadStatus")
    public ModelAndView uploadStatus(@ModelAttribute Bundle bundle) {
        List<Bundle> bundles = new ArrayList<Bundle>();
        Bundle b1 = new Bundle("1,2", 100.0);
        bundle.setCostOfVisit(100.00);
        bundle.setVisitSequence("1,2,3");
        //bundle = b1;
        bundles.add(bundle);
        ModelAndView bundleModel = new ModelAndView("listBundles");
        bundleModel.addObject("Bundle",bundles);
        return bundleModel;
       // return new ModelAndView("listBundles", "bundles", bundles);
        //return "uploadStatus";
    }

    @GetMapping("/uploadMultiPage")
    public String uploadMultiPage() {
        return "uploadMulti";
    }

}