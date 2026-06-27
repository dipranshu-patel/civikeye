"use strict";

const EARTH_RADIUS_M = 6_371_000;

function toRad(deg) {
    return (deg * Math.PI) / 180;
}

function haversineMeters(a, b) {
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);

    const h =
        sinDLat * sinDLat +
        Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;

    return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

function boundingBox(lat, lng, meters) {
    const latDelta = meters / EARTH_RADIUS_M;
    const lngDelta = meters / (EARTH_RADIUS_M * Math.cos(toRad(lat)));

    const latDeltaDeg = (latDelta * 180) / Math.PI;
    const lngDeltaDeg = (lngDelta * 180) / Math.PI;

    return {
        minLat: lat - latDeltaDeg,
        maxLat: lat + latDeltaDeg,
        minLng: lng - lngDeltaDeg,
        maxLng: lng + lngDeltaDeg,
    };
}

function isWithinRadius(pointA, pointB, radiusMeters) {
    return haversineMeters(pointA, pointB) <= radiusMeters;
}

module.exports = { haversineMeters, boundingBox, isWithinRadius };
