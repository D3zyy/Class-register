function OpenWind()
       {
         <% if( HttpContext.Current.Session["Id"]== null) { %>
                alert('Session Expired! Redirecting to login page!');
                location.href= 'logout.aspx';
         <% } else { %>
         var SessionId = <%= HttpContext.Current.Session["Id"].ToString() %>;       
         window.open('adduser.aspx?Mode=E&&Id='+SessionId+'','AddUser',"resizable,scrollbars,menubar,location,status,toolbar,titlebar,scrollbar"); 
         <%  }  %>

 }