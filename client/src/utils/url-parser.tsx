export let urlParser = () => {
        let url = window.location.pathname;
        let urlArray = url.split('/');
        console.log("@@@URLARRAY:", urlArray);
        return urlArray[urlArray.length-1];
        // const id = urlArray[urlArray.length - 1];
        // console.log("ID:", id);
        //replace space with app
        // urlArray.splice(0, 1, '/api');
        // remove product from url
        // URL Syntax: /api/products/:id
        // urlArray.splice(2, 1);
        // console.log("newURLElements:", urlArray);
        // const baseUrl = urlArray.join('/');
        // console.log("baseUrl:", baseUrl);
};