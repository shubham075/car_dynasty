// SQL migrations, applied in order and tracked with PRAGMA user_version.
// Plain .mjs on purpose: the app (via Next) and scripts/admin.mjs both import it.
// Never edit a shipped migration — append a new one instead.

export const MIGRATIONS = [
  {
    version: 1,
    name: "init",
    sql: /* sql */ `
      CREATE TABLE meta (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE users (
        id            INTEGER PRIMARY KEY,
        email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
        name          TEXT NOT NULL DEFAULT '',
        password_hash TEXT NOT NULL,
        created_at    TEXT NOT NULL,
        last_login_at TEXT
      );

      CREATE TABLE sessions (
        id           TEXT PRIMARY KEY,
        user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at   TEXT NOT NULL,
        expires_at   TEXT NOT NULL,
        last_seen_at TEXT NOT NULL,
        ip_hash      TEXT,
        user_agent   TEXT
      );
      CREATE INDEX idx_sessions_user ON sessions(user_id);

      CREATE TABLE rate_limits (
        key      TEXT PRIMARY KEY,
        count    INTEGER NOT NULL,
        reset_at INTEGER NOT NULL
      );

      CREATE TABLE settings (
        key        TEXT PRIMARY KEY,
        value      TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE categories (
        id             INTEGER PRIMARY KEY,
        name           TEXT NOT NULL,
        slug           TEXT NOT NULL UNIQUE,
        show_in_filter INTEGER NOT NULL DEFAULT 1,
        published      INTEGER NOT NULL DEFAULT 1,
        sort           INTEGER NOT NULL DEFAULT 0,
        created_at     TEXT NOT NULL,
        updated_at     TEXT NOT NULL
      );

      CREATE TABLE projects (
        id                 INTEGER PRIMARY KEY,
        slug               TEXT NOT NULL UNIQUE,
        title              TEXT NOT NULL,
        subtitle           TEXT NOT NULL DEFAULT '',
        category_id        INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        vehicle            TEXT NOT NULL DEFAULT '',
        client             TEXT NOT NULL DEFAULT '',
        year               TEXT NOT NULL DEFAULT '',
        location           TEXT NOT NULL DEFAULT '',
        hero_image         TEXT NOT NULL DEFAULT '',
        video_url          TEXT NOT NULL DEFAULT '',
        brief              TEXT NOT NULL DEFAULT '',
        creative_direction TEXT NOT NULL DEFAULT '',
        description        TEXT NOT NULL DEFAULT '',
        services           TEXT NOT NULL DEFAULT '[]',
        tech_specs         TEXT NOT NULL DEFAULT '{}',
        gallery            TEXT NOT NULL DEFAULT '[]',
        seo_title          TEXT NOT NULL DEFAULT '',
        seo_description    TEXT NOT NULL DEFAULT '',
        featured           INTEGER NOT NULL DEFAULT 0,
        published          INTEGER NOT NULL DEFAULT 1,
        sort               INTEGER NOT NULL DEFAULT 0,
        created_at         TEXT NOT NULL,
        updated_at         TEXT NOT NULL
      );

      CREATE TABLE services (
        id              INTEGER PRIMARY KEY,
        slug            TEXT NOT NULL UNIQUE,
        name            TEXT NOT NULL,
        tagline         TEXT NOT NULL DEFAULT '',
        target_audience TEXT NOT NULL DEFAULT '',
        description     TEXT NOT NULL DEFAULT '',
        deliverables    TEXT NOT NULL DEFAULT '[]',
        specs           TEXT NOT NULL DEFAULT '[]',
        turnaround_time TEXT NOT NULL DEFAULT '',
        recommended_for TEXT NOT NULL DEFAULT '',
        published       INTEGER NOT NULL DEFAULT 1,
        sort            INTEGER NOT NULL DEFAULT 0,
        created_at      TEXT NOT NULL,
        updated_at      TEXT NOT NULL
      );

      CREATE TABLE process_steps (
        id          INTEGER PRIMARY KEY,
        step        TEXT NOT NULL,
        title       TEXT NOT NULL,
        subtitle    TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        tasks       TEXT NOT NULL DEFAULT '[]',
        published   INTEGER NOT NULL DEFAULT 1,
        sort        INTEGER NOT NULL DEFAULT 0,
        created_at  TEXT NOT NULL,
        updated_at  TEXT NOT NULL
      );

      CREATE TABLE youtube_videos (
        id         INTEGER PRIMARY KEY,
        title      TEXT NOT NULL,
        category   TEXT NOT NULL DEFAULT '',
        url        TEXT NOT NULL,
        duration   TEXT NOT NULL DEFAULT '',
        badge      TEXT NOT NULL DEFAULT '',
        published  INTEGER NOT NULL DEFAULT 1,
        sort       INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE stats (
        id         INTEGER PRIMARY KEY,
        label      TEXT NOT NULL,
        value      TEXT NOT NULL,
        detail     TEXT NOT NULL DEFAULT '',
        published  INTEGER NOT NULL DEFAULT 1,
        sort       INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE media (
        id          TEXT PRIMARY KEY,
        url         TEXT NOT NULL UNIQUE,
        filename    TEXT NOT NULL,
        kind        TEXT NOT NULL,
        mime        TEXT NOT NULL,
        size        INTEGER NOT NULL DEFAULT 0,
        width       INTEGER,
        height      INTEGER,
        alt         TEXT NOT NULL DEFAULT '',
        source      TEXT NOT NULL,
        stored_name TEXT,
        created_at  TEXT NOT NULL
      );

      CREATE TABLE enquiries (
        id               INTEGER PRIMARY KEY,
        reference        TEXT NOT NULL UNIQUE,
        status           TEXT NOT NULL DEFAULT 'new',
        starred          INTEGER NOT NULL DEFAULT 0,
        name             TEXT NOT NULL,
        contact          TEXT NOT NULL,
        email            TEXT NOT NULL DEFAULT '',
        shoot_type       TEXT NOT NULL DEFAULT '',
        vehicle_or_brand TEXT NOT NULL DEFAULT '',
        location         TEXT NOT NULL DEFAULT '',
        details          TEXT NOT NULL DEFAULT '',
        shoot_date       TEXT NOT NULL DEFAULT '',
        budget           TEXT NOT NULL DEFAULT '',
        deliverables     TEXT NOT NULL DEFAULT '[]',
        source_cta       TEXT NOT NULL DEFAULT '',
        source_ref       TEXT NOT NULL DEFAULT '',
        source_page      TEXT NOT NULL DEFAULT '',
        referrer         TEXT NOT NULL DEFAULT '',
        utm              TEXT NOT NULL DEFAULT '{}',
        ip_hash          TEXT NOT NULL DEFAULT '',
        user_agent       TEXT NOT NULL DEFAULT '',
        follow_up_at     TEXT,
        quote_amount     INTEGER,
        email_alert      TEXT NOT NULL DEFAULT 'pending',
        auto_reply       TEXT NOT NULL DEFAULT 'pending',
        created_at       TEXT NOT NULL,
        updated_at       TEXT NOT NULL
      );
      CREATE INDEX idx_enquiries_created ON enquiries(created_at DESC);
      CREATE INDEX idx_enquiries_status  ON enquiries(status, created_at DESC);
      CREATE INDEX idx_enquiries_followup ON enquiries(follow_up_at);

      CREATE TABLE enquiry_events (
        id         INTEGER PRIMARY KEY,
        enquiry_id INTEGER NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
        type       TEXT NOT NULL,
        body       TEXT NOT NULL DEFAULT '',
        user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TEXT NOT NULL
      );
      CREATE INDEX idx_events_enquiry ON enquiry_events(enquiry_id, created_at);
    `,
  },
];
