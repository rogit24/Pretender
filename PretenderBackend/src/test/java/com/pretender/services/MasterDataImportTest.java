package com.pretender.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class MasterDataImportTest {
    private static String schema;

    @BeforeAll
    static void loadSchema() throws IOException {
        try (InputStream input = MasterDataImportTest.class.getResourceAsStream("/schema.sql")) {
            if (input == null) throw new IllegalStateException("schema.sql is missing from test resources");
            schema = new String(input.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    @Test
    void schemaLoadsEveryNonblankWorkbookRowExactlyOnceBySourceRowKey() {
        Map<String, Integer> rowCounts = Map.of(
            "master_form_of_contract", 18,
            "master_number_of_bid_openers", 4,
            "master_tender_type", 4,
            "master_work_item_product_category", 177,
            "master_tender_category", 3,
            "master_tenderer_class", 18
        );
        rowCounts.forEach((table, count) -> assertEquals((long) count, countImportStatements(table), table));
        assertEquals(224, rowCounts.values().stream().mapToInt(Integer::intValue).sum());
        assertTrue(schema.contains("ON CONFLICT (source_row_key) DO NOTHING"));
        assertTrue(schema.contains("uq_master_work_item_product_category_source_row_key"));
    }

    @Test
    void sourceCodesDescriptionsWhitespaceAndDuplicateProductRowsArePreserved() {
        assertTrue(schema.contains("SELECT 'QCBS','demo_masters_updated:form_of_contract:2'"));
        assertTrue(schema.contains("SELECT '2 Of 4','2 Off 4',4,'2 Of 4','demo_masters_updated:master_bid_openers_type:2'"));
        assertTrue(schema.contains("SELECT 'Single Tender','Single','Single Tender','demo_masters_updated:master_tender_type:2'"));
        assertTrue(schema.contains("SELECT ' Class A',' A',' Class A','demo_masters_updated:tenderer_class:2'"));

        String duplicateSource = "name,source_row_key,tender_category_id) SELECT 'Aids and appliances for the disabled','demo_masters_updated:product_category:";
        assertEquals(2, countMatches(Pattern.quote(duplicateSource) + "(?:87|131)'"));
        assertEquals(52, countProductReferences("tender_category:2"));
        assertEquals(56, countProductReferences("tender_category:3"));
        assertEquals(69, countProductReferences("tender_category:4"));
    }

    @Test
    void initializationDoesNotUseNameUniquenessOrOverwriteSourceRows() {
        assertTrue(schema.contains("DROP CONSTRAINT IF EXISTS master_work_item_product_category_name_key"));
        assertTrue(schema.contains("CREATE UNIQUE INDEX IF NOT EXISTS uq_master_work_item_product_category_source_row_key"));
        assertTrue(schema.contains("ON CONFLICT (source_row_key) DO NOTHING"));
        assertTrue(schema.contains("import_key = 'demo_masters_updated:initial'"));
        assertTrue(schema.contains("INSERT INTO master_data_seed_import(import_key) VALUES ('demo_masters_updated:initial')"));
        assertTrue(!schema.contains("name VARCHAR(255) NOT NULL UNIQUE"));
    }

    private long countImportStatements(String table) {
        return Pattern.compile("(?m)^INSERT INTO " + Pattern.quote(table) + "\\(").matcher(schema).results().count();
    }

    private long countMatches(String regex) {
        return Pattern.compile(regex).matcher(schema).results().count();
    }

    private long countProductReferences(String sourceCategoryKey) {
        return Pattern.compile("(?m)^INSERT INTO master_work_item_product_category.*WHERE source_row_key='demo_masters_updated:"
            + Pattern.quote(sourceCategoryKey) + "'\\) WHERE NOT EXISTS \\(SELECT 1 FROM master_data_seed_import").matcher(schema).results().count();
    }
}
