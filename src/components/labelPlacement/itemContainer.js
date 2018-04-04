import React, { Component } from "react";
import PropTypes from "prop-types";
import renderQueue from "util/renderQueue";

import ItemOverlay from "./itemOverlay";
import OptimizePositionsWorker from "./optimizePositions.worker";
import { Matrix } from "../../util/MapAlphaChannelMatrix";

import styles from "./itemContainer.css";

/**
 * Container that optimizes the positions of its children
 */
class ItemContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.updateChildren();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.worker.terminate();
            this.updateChildren();
        }
    }

    componentWillUnmount() {
        this.worker.terminate();
    }

    updateChildren() {
        renderQueue.add(this);

        const boundingBox = {
            left: 0,
            top: 0,
            width: this.root.offsetWidth,
            height: this.root.offsetHeight,
        };

        // Get refs to mounted children
        const refs = this.childRefs.filter(ref => !!ref);

        // Get initial positions
        const initialPositions = refs.map(ref => ref.getPosition());

        this.worker = new OptimizePositionsWorker();

        this.worker.addEventListener("message", (event) => {
            const positions = event.data;
            refs.forEach((ref, index) => {
                ref.setPosition(
                    positions[index].top,
                    positions[index].left,
                    positions[index].visible
                );
                positions[index].visible = ref.getVisible();
            });

            this.setState({ items: positions.filter(({ isFixed }) => !isFixed) });
            renderQueue.remove(this);
        });

        this.worker.addEventListener("error", (event) => {
            renderQueue.remove(this, { error: new Error(event.message) });
        });

        const alphaChannelMatrix = new Matrix(this.props.mapOptions, this.props.mapComponents);
        alphaChannelMatrix.initialize((alphaChannelByteArray) => {
            this.worker.postMessage({
                positions: initialPositions,
                boundingBox,
                alphaByteArray: alphaChannelByteArray,
                mapOptions: this.props.mapOptions,
            });
        });
    }

    render() {
        this.childRefs = [];
        const children = React.Children.map(this.props.children, (child, index) => {
            const props = { ref: (ref) => { this.childRefs[index] = ref; } };
            return child ? React.cloneElement(child, props) : null;
        });
        return (
            <div className={styles.root} ref={(ref) => { this.root = ref; }}>
                {this.state.items && <ItemOverlay
                    width={this.root.offsetWidth}
                    height={this.root.offsetHeight}
                    items={this.state.items.filter(({ visible }) => visible)}
                />}
                {children}
            </div>
        );
    }
}

const MapOptions = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
};

ItemContainer.propTypes = {
    children: PropTypes.node.isRequired, // ItemFixed or ItemPositioned components
    mapOptions: PropTypes.shape(MapOptions).isRequired,
    mapComponents: PropTypes.object.isRequired, // eslint-disable-line
};

export default ItemContainer;
