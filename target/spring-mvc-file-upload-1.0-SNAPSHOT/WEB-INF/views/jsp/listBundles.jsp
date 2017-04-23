<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
    <title>Bundles</title>
    <style>
        .dyn-height {
            max-height:50px;
            overflow-y:auto;
        }

        table, th, td {
            border: 1px solid black;
        }

        .container {
            height: auto;
            overflow: hidden;
        }

        .right {
            min-width: 40%;
            float: right;
            background: #aafed6;
        }

        .left {
            float: none; /* not needed, just for clarification */
            background: #e8f6fe;
            width: auto;
            overflow: hidden;
        }

        .scrollable {
            border: 1px solid #999;
            padding: 10px;
            position: absolute;
            top: 10px;
            right: 10px;
            bottom: 10px;
            left: 10px;
            overflow: auto;
        }
    </style>
</head>
<body>

<div class="mainWrapper">
    <h3>Team Hyperion Genetic Optimization Schedule Calculator</h3>
    <div class="container scrollable">
        <div class="right">
            <h3>Best Schedule</h3>
            <table class="bestSchedule dyn-height">
                <h3>Optimal Schedule</h3>
                <thead>
                <td><b>Nurse</b></td><td><b>Bundle</b></td><td><b>Price</b></td>
                </thead>
                <c:forEach var="scheduleValue" items="${schedule}">
                    <tr><td>${scheduleValue.split("--")[0]}</td><td>${scheduleValue.split("--")[1]}</td><td>${scheduleValue.split("--")[2]}</td></tr>
                </c:forEach>
            </table>
        </div>
        <div class="left">
            <table class="listOfNurses dyn-height">
                <h3>List of Nurse Bundles</h3>
                <thead>
                <td><b>Nurse</b></td><td><b>Bundle</b></td><td><b>Price</b></td>
                </thead>
                <c:forEach var="listValue" items="${lists}">
                    <tr><td>${listValue.split("--")[0]}</td><td>${listValue.split("--")[1]}</td><td>${listValue.split("--")[2]}</td></tr>
                </c:forEach>
            </table>
        </div>
    </div>
</div>

</body>
</html>
