export function navbarOptions(props: NavbarOptionsPropType): NavbarType {

  let userItems: UserItemsType[] = [
    {
      name: 'home',
      label: 'Home',
      route: '/',
      authorization: 'home-page:visit',
      key: 0
    },
    {
      name: 'products',
      label: 'Products',
      route: '/products',
      // authorization: 'products:view',
      authorization: 'home-page:visit',
      key: 1
    }
  ];

  let adminItem: AdminItemType[] = [
    {
      name: 'insert',
      route: '/product/insert',
      key: 10
    }
  ];

  let loginItem: LoginItemType[] = [
    {
      name: 'registration',
      route: '/user/registration',
      key: 20
    },
    {
      name: 'login',
      route: '/user/login',
      key: 21
    },
    {
      name: 'logout',
      route: '#',
      key: 22
    }
  ];

  let items = { 
    userItems: userItems,
    adminItem: adminItem,
    loginItem: loginItem
  };
  return items as NavbarType;
}
