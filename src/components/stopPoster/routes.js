import React from "react";
import { Row } from "components/util";

import styles from "./routes.css";

const Routes = props => (
    <div className={styles.root}>
        {props.routes.map((route, index) =>
            <Row key={index}>
                <div className={styles.identifier}>{route.routeId}</div>
                <div>
                    <div className={styles.title}>
                        {route.destination_fi}
                    </div>
                    <div className={styles.subtitle}>
                        {route.destination_se}
                    </div>
                </div>
            </Row>
        )}
    </div>
);

export default Routes;