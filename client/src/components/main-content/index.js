import React from 'react';

let MainContent = () => {
    return (
        <main role="main" className="flex-shrink-0">
            <div className="container">
                <h1 className="mt-5">Main Content</h1>
                <p className="lead">Pin a footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS.</p>
                <p>Use <a href="{{ site.baseurl }}/docs/{{ site.docs_version }}/examples/sticky-footer-navbar/">the sticky footer with a fixed navbar</a> if need be, too.</p>
            </div>
        </main>
    )
};

export default MainContent;