import React, { Component } from "react";
import queryString from "query-string";

import StopPoster from "components/stopPoster/stopPoster";

const components = {
    StopPoster,
};

class App extends Component {

    static stateFromQueryString() {
        const { component, options } = queryString.parse(location.hash);
        return (component && options) ? { component, options: JSON.parse(options) } : {};
    }

    constructor() {
        super();
        // In development we'll use url hash to set initial state
        this.state = App.stateFromQueryString();
        // Publish method as a global to make it accessible from phantom
        window.setVisibleComponent = this.setVisibleComponent.bind(this);
        // Let phantom know app is ready
        if (window.callPhantom) window.callPhantom();
    }

    /**
     * Sets component to render
     * @param {String} component - Name of component to display
     * @param {Object} options - Options passed to component
     */
    setVisibleComponent(component, options) {
        this.setState({ component, options });
    }

    render() {
        if (!this.state.component || !this.state.options) return null;

        const ComponentToRender = components[this.state.component];
        if (!ComponentToRender) return null;

        const onReady = (error) => {
            if (error) console.error(error); // eslint-disable-line no-console
            // Let phantom know the component is ready
            if (window.callPhantom) window.callPhantom();
        };

        return <ComponentToRender {...this.state.options} onReady={onReady}/>;
    }
}

export default App;
