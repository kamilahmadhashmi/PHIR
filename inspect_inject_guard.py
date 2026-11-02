with open(r'C:\Users\KIIT\.gemini\antigravity\scratch\PHIR\frontend\phir-i18n.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function injectLanguageSelector()')
print(text[idx:idx+2500])
