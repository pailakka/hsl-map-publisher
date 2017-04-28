
const TRUNK_ROUTES = ["550", "560"];
const RAIL_ROUTE_ID_REGEXP = /^300[12]/;

/**
 * Returns whether a route id is a so called number variant
 * @param {String} id - Route id
 * @returns {String}
 */
function isNumberVariant(id) {
    return /.{5}[0-9]/.test(id);
}

/**
 * Returns whether a route id is belongs to a rail route
 * @param {String} id - Route id
 * @returns {String}
 */
function isRailRoute(id) {
    return RAIL_ROUTE_ID_REGEXP.test(id);
}

/**
 * Returns whether a route id is belongs to a trunk route
 * @param {String} routeId - Route id
 * @returns {String}
 */
function isTrunkRoute(routeId) {
    return TRUNK_ROUTES.includes(routeId);
}

/**
 * Returns route id without area code or leading zeros
 * @param {String} id - Route id
 * @returns {String}
 */
function trimRouteId(id) {
    if (isRailRoute(id) && isNumberVariant(id)) {
        return id.substring(1, 5).replace(RAIL_ROUTE_ID_REGEXP, "");
    } else if (isRailRoute(id)) {
        return id.replace(RAIL_ROUTE_ID_REGEXP, "");
    } else if (isNumberVariant(id)) {
        // Do not show number variants
        return id.substring(1, 5).replace(/^[0]+/g, "");
    }
    return id.substring(1).replace(/^[0]+/g, "");
}

/**
 * Returns true if the route segment is only for dropping off passengers
 */
function isDropOffOnly({ pickupDropoffType }) {
    return pickupDropoffType === null || pickupDropoffType === 2;
}

function getStopType(stopId) {
    return stopId.slice(4, 5);
}

function isTramStop(stopId) {
    return getStopType(stopId) === "4";
}

function isTrainStop(stopId) {
    return getStopType(stopId) === "5";
}

function isMetroStop(stopId) {
    return getStopType(stopId) === "6";
}

export {
    isNumberVariant,
    isRailRoute,
    isTrunkRoute,
    trimRouteId,
    isDropOffOnly,
    isTramStop,
    isTrainStop,
    isMetroStop,
};
