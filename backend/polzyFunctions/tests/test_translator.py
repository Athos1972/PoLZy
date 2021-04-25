import sys
from unittest.mock import mock_open, patch, MagicMock
from polzyFunctions.translator import Translator
from polzyFunctions.translator.ManageTranslations import ManageTranslator, manage_args


def test_translator():
    with patch("codecs.open", mock_open(read_data='{"test": {"de": "success"}}')) as mock_file:
        t = Translator()
        assert t.data == {"test": {"de": "success"}}
    t.add_translation_file("input/translation.json")
    assert "testing" in t.data
    t.update_default_language("de")
    assert t.default_language == "de"
    assert t.translate("test") == "success"
    assert t.translate("test", "en") == "test"
    assert t.translate("test", "wrong language") == "test"


def test_ManageTranslations():
    with patch("codecs.open", mock_open(read_data='{"test": {"de": "success"}, "": {"de": ""}}')) as mock_file:
        m = ManageTranslator()
        m.print_table()
        m.add_item("new item")
        assert "new item" in m.data

        m.remove_item("new item")
        assert "new item" not in m.data
        m.remove_item("new item")  # to execute exception part

        m.add_language("li")
        assert "li" in m.data.get("test")

        m.remove_language("li")
        assert "li" not in m.data.get("test")

        m.add_translation("english", "hi", "")
        assert m.data["english"]["hi"] == ""

        assert len(m.get_empty_by_language_code("hi"))

        assert len(m.get_all_empty())

        with patch("builtins.input", side_effect=["mocked"] * 50) as mock_input:
            m.fill_empty_by_language_code("hi", save=False)
            m.fill_all_empty()
            assert m.data["test"]["hi"] == "mocked"
