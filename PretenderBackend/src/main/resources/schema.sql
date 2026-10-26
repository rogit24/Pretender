CREATE TABLE IF NOT EXISTS master_tender_type (id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS master_number_of_covers (id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS master_tender_category (id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS master_work_item_product_category (id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS master_number_of_bid_openers (id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS master_form_of_contract (id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS master_tenderer_class (id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL UNIQUE);
INSERT INTO master_tender_type(name) VALUES ('P1'),('P2') ON CONFLICT (name) DO NOTHING;
INSERT INTO master_number_of_covers(name) VALUES ('1 Cover'),('2 Covers'),('3 Covers') ON CONFLICT (name) DO NOTHING;
INSERT INTO master_tender_category(name) VALUES ('Works'),('Goods'),('Services') ON CONFLICT (name) DO NOTHING;
INSERT INTO master_work_item_product_category(name) VALUES ('Civil Works - Roads'),('Buildings'),('Electrical Works') ON CONFLICT (name) DO NOTHING;
INSERT INTO master_number_of_bid_openers(name) VALUES ('1 of 2'),('2 of 2'),('1 of 3'),('2 of 3'),('3 of 3') ON CONFLICT (name) DO NOTHING;
INSERT INTO master_form_of_contract(name) VALUES ('Percentage'),('Lump Sum'),('Item Rate') ON CONFLICT (name) DO NOTHING;
INSERT INTO master_tenderer_class(name) VALUES ('A or equivalent'),('B or equivalent'),('C or equivalent') ON CONFLICT (name) DO NOTHING;
CREATE TABLE IF NOT EXISTS pre_tender (
 id BIGSERIAL PRIMARY KEY,
 procurement_type VARCHAR(80) NOT NULL, tender_reference_number VARCHAR(180) NOT NULL,
 tender_type_id BIGINT NOT NULL REFERENCES master_tender_type(id), number_of_covers_id BIGINT NOT NULL REFERENCES master_number_of_covers(id),
 tender_category_id BIGINT NOT NULL REFERENCES master_tender_category(id), work_item_product_category_id BIGINT NOT NULL REFERENCES master_work_item_product_category(id),
 number_of_bid_openers_id BIGINT NOT NULL REFERENCES master_number_of_bid_openers(id), form_of_contract_id BIGINT NOT NULL REFERENCES master_form_of_contract(id),
 bid_validity_days INTEGER NOT NULL, cover1_description TEXT NOT NULL, cover2_description TEXT, delivery_period_days INTEGER NOT NULL,
 tenderer_class_id BIGINT NOT NULL REFERENCES master_tenderer_class(id), emd_exemption BOOLEAN NOT NULL, paper_cost_exemption BOOLEAN NOT NULL,
 tender_fee NUMERIC(14,2), tender_emd_fee NUMERIC(14,2), pre_bid_meeting BOOLEAN NOT NULL, pre_bid_meeting_address TEXT,
 tender_publishing_date_time TIMESTAMP NOT NULL, document_download_start_date_time TIMESTAMP NOT NULL,
 seek_clarification_start_date_time TIMESTAMP NOT NULL, seek_clarification_end_date_time TIMESTAMP NOT NULL,
 bid_submission_start_date_time TIMESTAMP NOT NULL, bid_submission_end_date_time TIMESTAMP NOT NULL, bid_opening_date_time TIMESTAMP NOT NULL,
 nit_file_name VARCHAR(255), dtcn_file_name VARCHAR(255), other_file_name VARCHAR(255), created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);