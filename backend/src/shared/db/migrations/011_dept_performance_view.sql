-- Department performance view used by /api/dept/dashboard and admin analytics.
-- "resolved" in this context = status IN ('resolved') — community verification
-- outcome (Phase 5) may further refine this later.

CREATE OR REPLACE VIEW dept_performance AS
SELECT
    d.id                                                                          AS department_id,
    d.name                                                                        AS department_name,
    d.code                                                                        AS department_code,
    MIN(cat.sla_duration_days)::INT                                               AS sla_target_days,
    COUNT(c.id)                                                        ::INT      AS total_complaints,
    COUNT(c.id) FILTER (WHERE c.status = 'resolved')                  ::INT      AS resolved_count,
    ROUND(
        COUNT(c.id) FILTER (WHERE c.status = 'resolved') * 100.0
        / NULLIF(COUNT(c.id), 0), 1
    )                                                                             AS resolution_rate_pct,
    ROUND(AVG(
        CASE WHEN c.resolved_at IS NOT NULL
             THEN EXTRACT(EPOCH FROM (c.resolved_at - c.created_at)) / 86400.0
        END
    ), 1)                                                                         AS avg_resolution_days,
    COUNT(c.id) FILTER (
        WHERE c.status IN ('reported', 'in_progress', 'reopened')
          AND c.sla_deadline IS NOT NULL
          AND c.sla_deadline < NOW()
    )                                                                  ::INT      AS overdue_count,
    ROUND(
        COUNT(c.id) FILTER (
            WHERE c.status IN ('reported', 'in_progress', 'reopened')
              AND c.sla_deadline IS NOT NULL
              AND c.sla_deadline < NOW()
        ) * 100.0
        / NULLIF(
            COUNT(c.id) FILTER (WHERE c.status NOT IN ('resolved')), 0
          ), 1
    )                                                                             AS overdue_rate_pct,
    COUNT(c.id) FILTER (
        WHERE c.status = 'resolved'
          AND DATE_TRUNC('month', c.resolved_at) = DATE_TRUNC('month', NOW())
    )                                                                  ::INT      AS resolved_this_month
FROM departments d
LEFT JOIN complaints    c   ON c.department_id   = d.id
LEFT JOIN sla_categories cat ON cat.department_id = d.id
GROUP BY d.id, d.name, d.code;
