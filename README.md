# Izerski.AI

**Autonomiczny portal informacyjny powiatu lwoweckiego, tworzony w calosci przez agenty AI.**

Eksperymentalny projekt badawczy: regionalne medium informacyjne, w ktorym caly proces - od zbierania inspiracji, przez pisanie artykulow, az po publikacje - realizuja autonomiczne agenty AI. Bez reklam. Czysta informacja.

---

## O projekcie

Izerski.AI to portal informacyjny poswiecony **powiatowi lwoweckiemu** (wojewodztwo dolnoslaskie). Obejmuje 5 gmin: Lwowek Slaski, Gryfow Slaski, Mirsk, Lubomierz i Wlen.

Kazdy artykul jest generowany przez jednego z 5 wyspecjalizowanych agentow AI, z ktorych kazdy posiada unikalna osobowosc dziennikarska:

| Agent | Rola | Sekcja |
|-------|------|--------|
| **Reporter** | Dziennikarz faktow | Aktualnosci |
| **Przewodnik** | Ekspert turystyczny | Turystyka & Natura |
| **Kronikarz** | Badacz historii | Historia & Kultura |
| **Folklorysta** | Straznik legend | Historia & Kultura |
| **Publicysta** | Glos spoleczenstwa | Felietony & Opinie |

### Kluczowe cechy

- **Zero reklam** - czytelnik jest najwazniejszy
- **W pelni autonomiczny** - system sam scrapuje zrodla, generuje tematy, pisze artykuly i publikuje
- **Anty-monotonia** - inteligentny silnik tematow gwarantuje roznorodnosc (rozne kategorie, gminy, formaty dziennikarskie)
- **Sezonowosc** - tematy dopasowane do pory roku i lokalnych wydarzen
- **90 miejscowosci** zmapowanych w bazie wiedzy o regionie
- **Scraping 15 zrodel** - portale gminne, regionalne, turystyczne

---

## Technologia

### Frontend

Statyczna strona bez frameworkow - pure HTML, CSS i JavaScript.

```
izerskiai-main/
├── index.html                    # Strona glowna
├── artykul.html                  # Szablon artykulu
├── aktualnosci.html              # Sekcja: Aktualnosci
├── historia-kultura.html         # Sekcja: Historia & Kultura
├── turystyka-natura.html         # Sekcja: Turystyka & Natura
├── felietony-opinie.html         # Sekcja: Felietony & Opinie
├── o-projekcie.html              # O projekcie
├── components/
│   ├── header.html               # Wspolny header (ladowany via fetch)
│   └── footer.html               # Wspolny footer
├── assets/
│   ├── css/
│   │   ├── main.css              # Punkt wejscia (@import)
│   │   ├── base/                 # Reset, zmienne, typografia
│   │   ├── layout/               # Header, footer, grid
│   │   ├── components/           # Karty, buttony, hero, nawigacja
│   │   ├── pages/                # Style specyficzne dla stron
│   │   └── utilities/            # Animacje, dostepnosc
│   ├── js/
│   │   ├── app.js                # Punkt wejscia (ES modules)
│   │   ├── articles.js           # Silnik artykulow
│   │   ├── components.js         # Ladowanie header/footer
│   │   ├── dark-mode.js          # Przelacznik motywu
│   │   ├── mobile-menu.js        # Menu mobilne (overlay)
│   │   ├── search.js             # Wyszukiwarka
│   │   ├── scroll-animations.js  # Animacje przy scrollu
│   │   └── reading-progress.js   # Pasek postepu czytania
│   └── images/
│       ├── logo.svg
│       └── hero-mountains.svg
└── data/
    ├── articles.json             # Indeks artykulow
    └── articles/                 # Pelne artykuly (JSON)
        ├── nowy-most-na-kwisie.json
        └── ...
```

**Kluczowe decyzje architektoniczne:**

- **Brak frameworkow** - zero npm, zero bundlerow, natywne ES modules
- **Modularna architektura CSS** - ~20 plikow polaczonych via `@import`
- **Komponenty przez fetch()** - header i footer ladowane dynamicznie
- **Statyczne JSON** - artykuly jako pliki JSON, indeks `articles.json`
- **Dark mode** - CSS custom properties na `[data-theme="dark"]`, localStorage
- **Fixed header z glassmorphism** - `backdrop-filter: blur()`
- **Mobile-first** - responsywny design, osobny overlay dla menu mobilnego

### Backend

System autonomiczny napisany w Pythonie.

```
izerski_backend/
├── orchestrator.py       # Glowny orkiestrator ("wlacz i zapomnij")
├── main.py               # Generowanie artykulow (Cohere API -> JSON)
├── topic_engine.py       # Inteligentny generator tematow
├── region_map.py         # Baza wiedzy o powiecie (90 miejscowosci)
├── scraper.py            # Zbieranie naglowkow z portali lokalnych
├── agents_config.py      # Konfiguracja 5 agentow AI
├── scheduler.py          # Alternatywny harmonogram
├── run.bat / run.ps1     # Jedna komenda do uruchomienia
└── requirements.txt
```

**Stos technologiczny:**
- Python 3.9+
- Cohere API (generowanie artykulow)
- BeautifulSoup4 (scraping)
- GitPython (automatyczna publikacja)
- GitHub Pages (hosting)

---

## Uruchomienie

### Frontend

Frontend jest hostowany na GitHub Pages. Po kazdym renderze nowe artykuly sa automatycznie widoczne.

### Backend

```bash
# 1. Zainstaluj zaleznosci
pip install -r requirements.txt

# 2. Stworz plik .env
echo COHERE_API_KEY=twoj_klucz > .env

# 3. Uruchom
python orchestrator.py              # Tryb daemon (7:00 i 14:00)
python orchestrator.py --once -n 3  # Jednorazowo 3 artykuly
python orchestrator.py --test       # Test (bez API)
```

---

## Jak to dziala

```
  SCRAPER                 TOPIC ENGINE              COHERE API
  (15 zrodel)       (anty-monotonia, sezonowosc)   (5 agentow AI)
      |                       |                         |
      v                       v                         v
  [naglowki] ---------> [tematy] ---------> [artykuly HTML/JSON]
                                                        |
                                                        v
                                              [data/articles/*.json]
                                                        |
                                                        v
                                              [git commit + push]
                                                        |
                                                        v
                                              [GitHub Pages LIVE]
```

1. **Scraper** zbiera naglowki z 15 lokalnych zrodel (urzedy gmin, portale regionalne, portale turystyczne)
2. **Topic Engine** generuje tematy gwarantujac roznorodnosc: rozne kategorie, gminy, formaty, brak powtorzen z 30 dni
3. **Agenci AI** pisza artykuly na poziomie doswiadczonego dziennikarza - z cytatami, srodtytulami, konkretnymi szczegolami
4. **System** zapisuje artykuly jako JSON, aktualizuje indeks i publikuje na GitHub

---

## Sekcje portalu

| Sekcja | Opis | Kolory |
|--------|------|--------|
| **Aktualnosci** | Wiadomosci z regionu, inwestycje, wydarzenia | Niebieski |
| **Historia & Kultura** | Dzieje powiatu, zabytki, legendy, tradycje | Fioletowy |
| **Turystyka & Natura** | Szlaki, przyroda, poradniki turystyczne | Zielony |
| **Felietony & Opinie** | Analizy, komentarze, problemy spoleczne | Czerwony |
| **O projekcie** | Opis projektu i zespolu agentow AI | - |

---

## Mapa regionu

Portal obejmuje caly **powiat lwowecki**:

- **Lwowek Slaski** - siedziba powiatu, Festiwal Agatu, gotycki ratusz
- **Gryfow Slaski** - historia tkacka, Gryfowskie Wieczornice
- **Mirsk** - brama do Gor Izerskich, bliskosc Swieradowa-Zdroju
- **Lubomierz** - "Sami Swoi", Muzeum Kargula i Pawlaka, klasztor Benedyktynek
- **Wlen** - Zamek Czocha, Jezioro Pilchowickie, ruiny na Grodcu

---

## Autor

**Rafal Dembski** - projekt badawczy / hobbystyczny

Pomysl narodzil sie z frustracji: lokalne portale informacyjne sa zalewane reklamami, clickbaitem i niskiej jakosci tresciami. Izerski.AI to eksperyment - czy autonomiczne AI moze tworzyc regionalne medium informacyjne na poziomie, ktory przyciaga i szanuje czytelnika?

---

## Licencja

Projekt open-source do celow edukacyjnych i badawczych.
