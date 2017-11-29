const uuidv1 = require("uuid/v1");
const camelCase = require("lodash/camelCase");
const snakeCase = require("lodash/snakeCase");
const config = require("../knexfile");
const knex = require("knex")(config);

function convertKeys(object, converter) {
    const obj = {};
    Object.keys(object).forEach((key) => {
        obj[converter(key)] = object[key];
    });
    return obj;
}

async function migrate() {
    await knex.migrate.latest();
}

async function getBuilds() {
    const rows = await knex.select(
        "build.*",
        knex.raw("count(case when poster.status = 'PENDING' then 1 end)::integer as pending"),
        knex.raw("count(case when poster.status = 'FAILED' then 1 end)::integer as failed"),
        knex.raw("count(case when poster.status = 'READY' then 1 end)::integer as ready")
    ).from("build")
        .whereNot("build.status", "REMOVED")
        .leftJoin("poster", "build.id", "poster.build_id")
        .orderBy("build.created_at", "desc")
        .groupBy("build.id");

    return rows.map(row => convertKeys(row, camelCase));
}

async function addBuild({ title }) {
    const id = uuidv1();
    await knex("build").insert({ id, title });
    return { id };
}

async function addPoster({ buildId, component, props }) {
    const id = uuidv1();
    await knex("poster").insert(convertKeys({
        id, buildId, component, props,
    }, snakeCase));
    return { id };
}

async function updatePoster({ id, status }) {
    await knex("poster").where({ id }).update({ status });
    return { id };
}

async function addEvent({
    posterId = null, buildId = null, type, message,
}) {
    await knex("event").insert(convertKeys({
        posterId, buildId, type, message,
    }, snakeCase));
}

module.exports = {
    migrate,
    getBuilds,
    addBuild,
    addPoster,
    updatePoster,
    addEvent,
};
