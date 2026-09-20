-- Amanora Ascent Avenue Digital Fire Tracker
-- Core schema: keep it minimal for v1

CREATE TABLE IF NOT EXISTS floors (
    id              SERIAL PRIMARY KEY,
    floor_number    VARCHAR(10) NOT NULL UNIQUE,   -- e.g. 'B1', 'GF', '1', '2' ... '7'
    floor_label     VARCHAR(50),                    -- e.g. 'Basement 1', '7th Floor'
    status          VARCHAR(10) NOT NULL DEFAULT 'RED', -- RED / YELLOW / GREEN
    total_sprinklers        INT DEFAULT 0,
    installed_sprinklers    INT DEFAULT 0,
    tested_sprinklers       INT DEFAULT 0,
    notes           TEXT,
    updated_by      VARCHAR(100),
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hydro_tests (
    id              SERIAL PRIMARY KEY,
    floor_id        INT REFERENCES floors(id) ON DELETE CASCADE,
    pressure_bar    NUMERIC(5,2),
    test_date       DATE DEFAULT CURRENT_DATE,
    status          VARCHAR(10) NOT NULL, -- PASS / FAIL
    photo_url       TEXT,                  -- pressure gauge photo, stored later (S3/local)
    tested_by       VARCHAR(100),
    remarks         TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS material_logs (
    id                  SERIAL PRIMARY KEY,
    floor_id            INT REFERENCES floors(id) ON DELETE CASCADE,
    item_name           VARCHAR(100) NOT NULL,   -- e.g. 'Sprinkler Head', 'MS Pipe 25mm', 'Valve'
    quantity_delivered  INT DEFAULT 0,
    quantity_installed  INT DEFAULT 0,
    unit                VARCHAR(20) DEFAULT 'nos',
    remarks             TEXT,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS floor_photos (
    id              SERIAL PRIMARY KEY,
    floor_id        INT REFERENCES floors(id) ON DELETE CASCADE,
    photo_data      TEXT,                   -- base64 image data (v1 simple storage)
    caption         VARCHAR(200),           -- e.g. 'Damaged pipe', 'Wide shot'
    taken_by        VARCHAR(100),
    taken_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed the 9 floors for Ascent Avenue (B1 to 7th) — edit counts once you confirm on-site tomorrow
INSERT INTO floors (floor_number, floor_label, status) VALUES
('B1', 'Basement 1', 'RED'),
('GF', 'Ground Floor', 'RED'),
('1', '1st Floor', 'RED'),
('2', '2nd Floor', 'RED'),
('3', '3rd Floor', 'RED'),
('4', '4th Floor', 'RED'),
('5', '5th Floor', 'RED'),
('6', '6th Floor', 'RED'),
('7', '7th Floor', 'YELLOW')
ON CONFLICT (floor_number) DO NOTHING;
