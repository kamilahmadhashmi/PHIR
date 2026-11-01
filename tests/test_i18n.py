"""Automated test suite for PHIR Internationalization (i18n) Engine.
Validates dictionary completeness, parity across languages (EN, HI, OD), and frontend packaging.
"""

from __future__ import annotations

import re
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
I18N_SRC = REPO_ROOT / "frontend" / "phir-i18n.js"
I18N_BUILT = REPO_ROOT / "frontend" / "amplify-site" / "phir-i18n.js"
HTML_SRC = REPO_ROOT / "frontend" / "phirFinal.optimized.html"
HTML_BUILT = REPO_ROOT / "frontend" / "amplify-site" / "index.html"


class I18nEngineTests(unittest.TestCase):
    def setUp(self):
        self.assertTrue(I18N_SRC.exists(), "frontend/phir-i18n.js must exist")
        with open(I18N_SRC, "r", encoding="utf-8") as f:
            self.content = f.read()

    def test_01_dictionary_languages_defined(self):
        """Verify that EN, HI, and OD language dictionaries are properly declared."""
        for lang in ["en", "hi", "od"]:
            self.assertIn(f"{lang}: {{", self.content, f"Language '{lang}' missing in DICTIONARY")

    def test_02_dictionary_keys_parity(self):
        """Verify 100% key parity across English, Hindi, and Odia (no missing keys)."""
        m = re.search(r"const DICTIONARY = (\{.+?\n  \};)", self.content, re.DOTALL)
        self.assertIsNotNone(m, "DICTIONARY definition not found in phir-i18n.js")
        dict_block = m.group(1)

        key_sets = {}
        for lang in ["en", "hi", "od"]:
            lm = re.search(rf"    {lang}:\s*\{{(.+?)\n    \}},?", dict_block, re.DOTALL)
            self.assertIsNotNone(lm, f"Block for {lang} not parsed properly")
            keys = re.findall(r"^\s*([a-zA-Z0-9_]+):", lm.group(1), re.MULTILINE)
            key_sets[lang] = set(keys)
            self.assertGreater(len(keys), 300, f"{lang} dictionary has fewer keys than expected")

        # Zero missing keys between languages
        diff_en_hi = key_sets["en"] - key_sets["hi"]
        diff_en_od = key_sets["en"] - key_sets["od"]
        diff_hi_od = key_sets["hi"] - key_sets["od"]

        self.assertEqual(diff_en_hi, set(), f"Keys in EN but missing in HI: {diff_en_hi}")
        self.assertEqual(diff_en_od, set(), f"Keys in EN but missing in OD: {diff_en_od}")
        self.assertEqual(diff_hi_od, set(), f"Keys in HI but missing in OD: {diff_hi_od}")

    def test_03_critical_tokens_preserved(self):
        """Verify that critical brand and technical tokens are preserved across all languages."""
        # Brand name 'Phir' must be preserved in title tag and text
        self.assertIn("Phir", self.content)
        # UPI, CPCB, EPR, and kg tokens must be preserved
        self.assertIn("UPI", self.content)
        self.assertIn("CPCB", self.content)
        self.assertIn("EPR", self.content)

    def test_04_html_integration(self):
        """Verify that both source and built HTML files link to phir-i18n.js."""
        with open(HTML_SRC, "r", encoding="utf-8") as f:
            src_html = f.read()
        self.assertIn("phir-i18n.js", src_html, "phir-i18n.js not linked in phirFinal.optimized.html")

        with open(HTML_BUILT, "r", encoding="utf-8") as f:
            built_html = f.read()
        self.assertIn("phir-i18n.js", built_html, "phir-i18n.js not linked in amplify-site/index.html")

    def test_05_built_asset_synchronization(self):
        """Verify that built amplify-site/phir-i18n.js is synchronized with source."""
        self.assertTrue(I18N_BUILT.exists(), "amplify-site/phir-i18n.js must exist")
        with open(I18N_BUILT, "r", encoding="utf-8") as f:
            built_content = f.read()
        self.assertEqual(self.content, built_content, "amplify-site/phir-i18n.js must match source")


if __name__ == "__main__":
    unittest.main()
