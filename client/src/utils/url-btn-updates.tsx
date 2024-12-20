import { urlParser } from "./url-parser";

export let urlBtnUpdates = () => {
        const pageName = urlParser();
        console.log("PageName:", pageName);
        // Add a de-activate or activate class to the button with the corresponding name
        let btnElement;
        let className;
        let element;
        if (pageName === '' || pageName === 'home') {
                btnElement = 'home';
                className = 'activate';

                //set other btn to de-activate
                element = document.querySelector(`[name=products]`);

                element?.setAttribute('class', ' de-activate nav-link Ripple-parent');
        }
        else if (pageName === 'products') {
                btnElement = 'products';
                className = 'activate';

                //set other btn to de-activate
                element = document.querySelector(`[name=home]`);

                element?.setAttribute('class', ' de-activate nav-link Ripple-parent');
        }
        else {
                // reset both buttons

                element = document.querySelector(`[name=home]`);

                element?.setAttribute('class', ' de-activate nav-link Ripple-parent'); 

                element = document.querySelector(`[name=products]`);

                element?.setAttribute('class', ' de-activate nav-link Ripple-parent');
        }

        // set page's current button to activate
        // console.log("CLASSNAME:", className);
        element = document.querySelector(`[name=${btnElement}]`);
        element?.setAttribute('class', className + ' nav-link Ripple-parent');
};