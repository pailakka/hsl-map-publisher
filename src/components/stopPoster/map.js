import React from "react";
import ItemContainer from "components/itemContainer";
import ItemWrapper from "components/itemWrapper";
import { Row } from "components/util";
import { getSymbol } from "util/stops";

import locationIcon from "icons/location.svg";

import styles from "./map.css";

const MAX_LABEL_ROWS = 6;

const Location = () => (
    <div className={styles.location}>
        <img src={locationIcon} role="presentation"/>
    </div>
);

const Stop = props => (
    <div className={styles.stop}>
        <img src={getSymbol(props.stopId)} role="presentation"/>
    </div>
);

const RouteList = (props) => {
    if (props.routes.length > MAX_LABEL_ROWS) {
        const routeIds = props.routes.map(({ routeId }) => routeId).join(", ");
        return <div>{routeIds}</div>;
    }
    return (
        <div>
            {props.routes.map((route, index) => (
                <Row key={index}>
                    {route.routeId} &rarr; {route.destination_fi}
                </Row>
            ))}
        </div>
    );
};

const Label = props => (
    <div className={styles.label} style={{ left: props.x, top: props.y }}>
        <Row>
            <div className={styles.title}>{props.name_fi}</div>
            <div className={styles.subtitle}>({props.shortId})</div>
        </Row>
        <div className={styles.content}>
            <RouteList routes={props.routes}/>
        </div>
    </div>
);

const Map = (props) => {
    const mapStyle = { width: props.mapOptions.width, height: props.mapOptions.height };
    const miniMapStyle = { width: props.miniMapOptions.width, height: props.miniMapOptions.height };

    // TODO: Add location <Location/>

    return (
        <div className={styles.root} style={mapStyle}>
            <div className={styles.container}>
                <img src={props.map} role="presentation"/>
            </div>

            <div className={styles.overlays}>
                <ItemContainer>
                    {props.stops.map((stop, index) => (
                        <ItemWrapper key={index} x={stop.x} y={stop.y} angle={45} isFixed>
                            <Stop {...stop}/>
                        </ItemWrapper>
                    ))}
                    {props.stops.map((stop, index) => (
                        <ItemWrapper key={index} x={stop.x} y={stop.y} distance={15}>
                            <Label {...stop}/>
                        </ItemWrapper>
                    ))}
                </ItemContainer>
            </div>

            <div className={styles.miniMap} style={miniMapStyle}>
                <div className={styles.container}>
                    <img src={props.miniMap} role="presentation"/>

                </div>
            </div>
        </div>
    );
};

export default Map;
