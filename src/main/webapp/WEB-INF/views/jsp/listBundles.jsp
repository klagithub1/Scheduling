<%--
  Created by IntelliJ IDEA.
  User: ssamudhraa
  Date: 4/18/2017
  Time: 5:16 PM
  To change this template use File | Settings | File Templates.
--%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
    <title>Bundles</title>
</head>
<body>

<c:if test="${not empty lists}">
    <ul>
        <c:forEach var="listValue" items="${lists}">
            <li>${listValue}</li>
        </c:forEach>
    </ul>

</c:if>

</body>
</html>
