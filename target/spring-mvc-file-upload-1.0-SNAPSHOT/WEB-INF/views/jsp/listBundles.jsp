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
    </style>
</head>
<body>

<div class="mainWrapper">
    <div class="rightSide">
        <table class="listOfNurses dyn-height">
            <thead>
                <td>Nurse</td><td>Bundle</td><td>Price</td>
            </thead>
            <c:forEach var="listValue" items="${lists}">
            <tr><td>${listValue.split("--")[0]}</td><td>${listValue.split("--")[1]}</td><td>${listValue.split("--")[2]}</td></tr>
            </c:forEach>
        </table>
    </div>
    <div class="leftClass">

    </div>
</div>

<button>Calculate Schedule</button>

</body>
</html>
