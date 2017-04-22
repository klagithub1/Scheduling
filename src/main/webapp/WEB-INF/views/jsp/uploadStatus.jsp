<html>
<body>
<h1>Upload Status</h1>
<h2>Message : ${message}</h2>
<table class="list silver">
    <tr>
        <th> </th>
        <th>Countries</th>
    </tr>
    <c:forEach items="${countries}" var="country">
        <tr>
            <td>
                <a href="<c:url value='countries/${country.id}?for-update=true'/>">
                    <img src="<c:url value=" /images/edit.gif"/>"/>
                </a>
            </td>
            <td>
                <a href="<c:url value='/countries/${country.id}'/>">
                        ${fn:escapeXml(country.name)}
                </a>
            </td>
        </tr>
    </c:forEach>
</table>
</body>
</html>
