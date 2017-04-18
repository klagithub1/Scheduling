package main.java.com.inse.controller;

import main.java.com.inse.FileParserService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.text.ParseException;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

@WebServlet("/FileUploadServlet")
@MultipartConfig(fileSizeThreshold=1024*1024*10, 	// 10 MB
        maxFileSize=1024*1024*50,      	// 50 MB
        maxRequestSize=1024*1024*100)   	// 100 MB
public class FileUploadServlet extends HttpServlet {

    private static final long serialVersionUID = 205242440643911308L;
    private final String fileName = "Data.csv";
    private String filePath = "";

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath){
        this.filePath = this.filePath;
    }

    /**
     * Directory where uploaded files will be saved, its relative to
     * the web application directory.
     */
    private static final String UPLOAD_DIR = "uploads";
    private final static Logger LOGGER =
            Logger.getLogger(FileUploadServlet.class.getCanonicalName());

    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response) throws ServletException, IOException {
        if(request.getParameter("saveFile")!=null){
            saveFile(request, response);
        }else if(request.getParameter("scheduleNurse")!=null){
            FileParserService parserService = new FileParserService();
            try {
                parserService.parseFile(this.getFilePath());
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

    }

    private void saveFile(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        // creates the save directory if it does not exists
        File fileSaveDir = Paths.get("../resources").toAbsolutePath().normalize().toFile();
        System.out.println("path >>>> "+Paths.get("../resources").toAbsolutePath().normalize());
        if (!fileSaveDir.exists()) {
            fileSaveDir.mkdirs();
        }

        //Get all the parts from request and write it to the file on server
        for (Part part : request.getParts()) {
            filePath = fileSaveDir + File.separator + fileName;
            this.setFilePath(filePath);
            part.write(filePath);
        }
        FileParserService parserService = new FileParserService();
        try {
            System.out.println(" csv in upload file >>>"+this.getFilePath());
            parserService.parseFile(filePath);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        request.setAttribute("message", "File uploaded successfully!");
        getServletContext().getRequestDispatcher("/response.jsp").forward(
                request, response);
    }


    /**
     * Utility method to get file name from HTTP header content-disposition
     */
    private String getFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        System.out.println("content-disposition header= "+contentDisp);
        String[] tokens = contentDisp.split(";");
        for (String token : tokens) {
            if (token.trim().startsWith("filename")) {
                return token.substring(token.indexOf("=") + 2, token.length()-1);
            }
        }
        return "";
    }
}