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
                <td><b>Nurse</b></td><td><b>Bundle</b></td><td><b>Price</b></td>
            </thead>
            <c:forEach var="listValue" items="${lists}">
            <tr><td>${listValue.split("--")[0]}</td><td>${listValue.split("--")[1]}</td><td>${listValue.split("--")[2]}</td></tr>
            </c:forEach>
        </table>
    </div>
    <div class="leftClass">
        <form method="POST" action="${pageContext.request.contextPath}/upload" enctype="multipart/form-data">
            <input type="button" value="Calculate" />
        </form>
    </div>
</div>

</body>
</html>
