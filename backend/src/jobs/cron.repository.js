"use strict";

const { query, withTransaction } = require("../shared/db/query");
const {
    minVotesCommunity,
    minVotesAuthority,
    confirmThreshold,
} = require("../config/verification");

const MIN_VOTES_COMMUNITY = minVotesCommunity;
const MIN_VOTES_AUTHORITY = minVotesAuthority;
const CONFIRM_THRESHOLD = confirmThreshold;

async function findExpiredVerificationWindows() {
    const { rows } = await query(
        `SELECT
             c.id,
             c.public_code,
             c.title,
             c.reporter_id,
             c.department_id,
             c.issue_type,
             c.latitude,
             c.longitude,
             COUNT(cv.id)::INT                                       AS total_votes,
             COUNT(cv.id) FILTER (WHERE cv.vote = 'confirm')::INT    AS confirms,
             COUNT(cv.id) FILTER (WHERE cv.vote = 'reject')::INT     AS rejects
         FROM complaints c
         LEFT JOIN complaint_verifications cv ON cv.complaint_id = c.id
         WHERE c.status = 'pending_verification'
           AND c.verification_deadline < NOW()
         GROUP BY c.id`,
    );
    return rows;
}

async function transitionComplaint(client, complaintId, newStatus, note) {
    const { rows } = await client.query(
        `UPDATE complaints
         SET status                   = $2::text,
             resolved_at              = CASE WHEN $2::text = 'resolved' THEN NOW() ELSE NULL END,
             reopen_count             = CASE
                                           WHEN $2::text = 'reopened'
                                           THEN reopen_count + 1
                                           ELSE reopen_count
                                       END,
             verification_started_at  = NULL,
             verification_deadline    = NULL
         WHERE id = $1
           AND status = 'pending_verification'
         RETURNING id, status, reporter_id, title, public_code, latitude, longitude, issue_type`,
        [complaintId, newStatus],
    );
    if (!rows.length) return null;

    const complaint = rows[0];

    await client.query(
        `INSERT INTO complaint_status_history
             (complaint_id, from_status, to_status, actor_role, note)
         VALUES ($1, 'pending_verification', $2, 'system', $3)`,
        [complaintId, newStatus, note],
    );

    return complaint;
}

async function resetVolunteerAssignment(client, complaintId) {
    const { rows } = await client.query(
        `SELECT vta.volunteer_id, vta.id AS assignment_id, vt.id AS task_id
         FROM volunteer_tasks vt
         JOIN volunteer_task_assignments vta ON vta.task_id = vt.id
         WHERE vt.complaint_id = $1
           AND vta.status IN ('active', 'pending_verification')
         LIMIT 1`,
        [complaintId],
    );
    if (!rows.length) return null;

    const { volunteer_id, assignment_id, task_id } = rows[0];

    await client.query(
        `UPDATE volunteer_task_assignments
         SET status = 'cancelled', completed_at = NOW() WHERE id = $1`,
        [assignment_id],
    );
    await client.query(
        `UPDATE volunteer_tasks SET status = 'open' WHERE id = $1`,
        [task_id],
    );
    await client.query(
        `DELETE FROM complaint_verifications WHERE complaint_id = $1`,
        [complaintId],
    );

    return volunteer_id;
}

async function findSlaBreachSoon() {
    const { rows } = await query(
        `SELECT
             c.id,
             c.public_code,
             c.title,
             c.sla_deadline,
             c.department_id,
             d.user_id AS dept_official_id
         FROM complaints c
         JOIN departments d ON d.id = c.department_id
         WHERE c.status NOT IN ('resolved', 'pending_verification')
           AND c.sla_deadline IS NOT NULL
           AND c.sla_deadline > NOW()
           AND c.sla_deadline <= NOW() + INTERVAL '24 hours'
           AND d.user_id IS NOT NULL
           AND NOT EXISTS (
               SELECT 1 FROM notifications n
               WHERE n.entity_id   = c.id
                 AND n.type        = 'SLA_BREACH_SOON'
                 AND n.entity_type = 'complaint'
           )`,
    );
    return rows;
}

async function findSlaOverdue() {
    const { rows } = await query(
        `SELECT
             c.id,
             c.public_code,
             c.title,
             c.sla_deadline,
             c.department_id,
             d.user_id AS dept_official_id
         FROM complaints c
         JOIN departments d ON d.id = c.department_id
         WHERE c.status NOT IN ('resolved', 'pending_verification')
           AND c.sla_deadline IS NOT NULL
           AND c.sla_deadline < NOW()
           AND d.user_id IS NOT NULL
           AND NOT EXISTS (
               SELECT 1 FROM notifications n
               WHERE n.entity_id   = c.id
                 AND n.type        = 'SLA_OVERDUE'
                 AND n.entity_type = 'complaint'
           )`,
    );
    return rows;
}

module.exports = {
    findExpiredVerificationWindows,
    transitionComplaint,
    resetVolunteerAssignment,
    findSlaBreachSoon,
    findSlaOverdue,
    MIN_VOTES_COMMUNITY,
    MIN_VOTES_AUTHORITY,
    CONFIRM_THRESHOLD,
};
