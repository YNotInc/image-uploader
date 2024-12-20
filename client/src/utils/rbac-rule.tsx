const rules = {
    visitor: {
      static: [
        "products:hide",
        // "products:view",
        "home-page:visit"
        ]
    },
    user : {
      static: [ 
        "products:view", 
        "products:details",
          "products:hide",
          "home-page:visit"
      ]
    },
    admin: {
      static: [
        "products:view",
        "products:hide",
        "products:update",
        "products:insert",
        "products:delete",
        "products:details",
        "users:get",
        "users:getSelf",
        "home-page:visit",
        "dashboard-page:visit"
      ]
    },
    writer: {
      static: [
        "posts:list",
        "posts:create",
        "users:getSelf",
        "home-page:visit",
        "dashboard-page:visit"
      ],  //static
      // dynamic not currently used
      dynamic: {
        "posts:edit": (userId:string , postOwnerId: string) => {
          if (!userId || !postOwnerId) return false;
          return userId === postOwnerId;
        }
      } // dyanmic
    }
  };

  export default rules;