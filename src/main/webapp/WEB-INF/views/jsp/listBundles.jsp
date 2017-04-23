<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
    <title>Bundles</title>
</head>
<body>

<div class="mainWrapper">
    <div class="rightSide">
        <table class="listOfNurses">
            <thead>
                <td>Nurse</td><td>Bundle</td><td>Price</td>
            </thead>
            <tr><td>1</td><td>1,2,4</td><td>125.44</td></tr>
        </table>
        <c:if test="${not empty lists}">
            <ul>
                <c:forEach var="listValue" items="${lists}">
                    <li>${listValue}</li>
                </c:forEach>
            </ul>

        </c:if>
    </div>
    <div class="leftClass">

    </div>

</div>

<button>Calculate Schedule</button>

</body>
</html>
