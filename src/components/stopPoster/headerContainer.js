import { gql, graphql } from "react-apollo";
import mapProps from "recompose/mapProps";
import apolloWrapper from "util/apolloWrapper";
import flatMap from "lodash/flatMap";

import { trimRouteId, isTrunkRoute } from "util/domain";

import Header from "./header";

const headerQuery = gql`
    query headerQuery($stopId: String!, $date: Date!) {
        stop: stopByStopId(stopId: $stopId) {
            shortId
            nameFi
            nameSe
            siblings {
                nodes {
                    routeSegments: routeSegmentsForDate(date: $date) {
                        nodes {
                            route {
                                nodes {
                                    routeId
                                    mode
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

const propsMapper = mapProps(props => ({
    ...props.data.stop,
    modes: Array.from(
        flatMap(
            props.data.stop.siblings.nodes,
            node => node.routeSegments.nodes.map(segment => segment.route.nodes[0])
        ).reduce(
            (set, route) =>
                set.add(isTrunkRoute(trimRouteId(route.routeId)) ? "TRUNK" : route.mode),
            new Set()
        )
    ),
}));

const HeaderContainer = apolloWrapper(propsMapper)(Header);

export default graphql(headerQuery)(HeaderContainer);
