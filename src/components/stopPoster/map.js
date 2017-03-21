import React from "react";
import ItemContainer from "components/itemContainer";
import ItemFixed from "components/itemFixed";
import ItemPositioned from "components/itemPositioned";
import { Row, Column } from "components/util";
import { getSymbol } from "util/stops";

import locationIcon from "icons/location.svg";

import styles from "./map.css";

// Max rows in label
const MAX_LABEL_ROWS = 6;

// Map symbol size
const STOP_RADIUS = 17;
const LOCATION_RADIUS = 27;
const LOCATION_RADIUS_MINI = 18;

// Mini map position
const MINI_MAP_MARGIN_RIGHT = 60;
const MINI_MAP_MARGIN_BOTTOM = -40;

const Location = props => (
    <div style={{ width: props.size, height: props.size }}>
        <img src={locationIcon} role="presentation"/>
    </div>
);

const Stop = props => (
    <div style={{ width: props.size, height: props.size }}>
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

const Label = props => {
    return (
        <div className={styles.label}>
            <div className={styles.title}>{props.name_fi}</div>
            <div className={styles.subtitle}>{props.name_se}</div>
            <div className={styles.content}>
                <RouteList routes={props.routes}/>
            </div>
        </div>
    );
};

const Map = (props) => {
    const mapStyle = {
        width: props.mapOptions.width,
        height: props.mapOptions.height,
    };
    const miniMapStyle = {
        left: mapStyle.width - MINI_MAP_MARGIN_RIGHT - props.miniMapOptions.width,
        top: mapStyle.height - MINI_MAP_MARGIN_BOTTOM - props.miniMapOptions.height,
        width: props.miniMapOptions.width,
        height: props.miniMapOptions.height,
    };

    // Filter out stops that are behind the mini map
    const stops = props.stops.filter(
        stop => stop.x < miniMapStyle.left || stop.y < miniMapStyle.top
    );

    return (
        <div className={styles.root} style={mapStyle}>
            <div className={styles.map}>
                <img src={props.map} role="presentation"/>
            </div>

            <div className={styles.overlays}>
                <ItemContainer>
                    {stops.map((stop, index) => (
                        <ItemFixed key={index} top={stop.y - STOP_RADIUS} left={stop.x - STOP_RADIUS}>
                            <Stop {...stop} size={STOP_RADIUS * 2}/>
                        </ItemFixed>
                    ))}

                    <ItemFixed
                        top={(mapStyle.height / 2) - LOCATION_RADIUS}
                        left={(mapStyle.width / 2) - LOCATION_RADIUS}
                    >
                        <Location size={LOCATION_RADIUS * 2}/>
                    </ItemFixed>

                    {stops.map((stop, index) => (
                        <ItemPositioned key={index} x={stop.x} y={stop.y} distance={25}>
                            <Label {...stop}/>
                        </ItemPositioned>
                    ))}

                    <ItemFixed top={miniMapStyle.top} left={miniMapStyle.left}>
                        <div style={miniMapStyle}/>
                    </ItemFixed>
                </ItemContainer>
            </div>

            <div className={styles.miniMap} style={miniMapStyle}>
                <img src={props.miniMap} role="presentation"/>
                <div className={styles.center} style={{ margin: -LOCATION_RADIUS_MINI }}>
                    <Location size={LOCATION_RADIUS_MINI * 2}/>
                </div>
            </div>
        </div>
    );
};

export default Map;
