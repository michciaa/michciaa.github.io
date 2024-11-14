# OpenAI API Text-Article Converter
Niniejsza aplikacja została utworzona na potrzeby rekrutacji na stanowisko Junior AI Developer w firmie Oxido. 
## O aplikacji
Polega na wczytaniu w formularzu pliku z rozszerzeniem `txt`, a następnie aplikacja łączy się z API OpenAI i zwraca przetworzony tekst do dwóch plików:
- `article.html` : tekst zawierający tagi html jak `h1, h2, p`
- `podglad.html` : sformatowany tekst z pliku `article.html` w oparciu o przygotowany szablon w pliku `szablon.html`.

## Użycie
Przed rozpoczęciem pracy z aplikacją, należy pobrać gotowy tekst w formacie .txt dostępny [pod niniejszym linkiem](https://cdn.oxido.pl/hr/Zadanie%20dla%20JJunior%20AI%20Developera%20-%20tresc%20artykulu.txt). Po przejściu na stronę, należy kliknąć prawym przyciskiem myszki na ekran i wybrać opcję `Zapisz stronę jako..` (**Uwaga!** Niniejsza opcja może się nieco różnić w zależności od przeglądarki, typu urządzenia oraz systemu operacyjnego. W podanym przykładzie wykorzystana została przeglądarka __Mozilla Firefox__ na komputerze z systemem __Windows 11__).

Następnie, przechodzimy do samej aplikacji, której działanie dostępne jest pod adresem [openai-api-proj.michcia.online](https://openai-api-proj.michcia.online/) - aplikacja jest hostowana na prywatnym serwerze autora. Na ekranie pod nagłówkiem strony ukaże się białe okno z nagłówkiem `DODAJ TEKST DO PRZETWORZENIA`, zaś pod nim - pole przeznaczone do wgrania pliku. Aby wgrać plik, należy kliknąć na wspomniane pole, a następnie wybrać z dysku pobrany wcześniej plik. Aplikacja akceptuje wyłącznie pliki z rozszerzeniem `txt`!

Po poprawnym wgraniu pliku, wystarczy nacisnąć przycisk pod spodem `WYŚLIJ`. W tym momencie aplikacja wyśle 2 prompty przez API należące do OpenAI (Jedno w celu uzyskania przetworzonego tekstu; drugie - na podstawie przygotowanego szablonu umieści uzyskany tekst i sformatuje go odpowiednio do pliku `podglad.html`).

Jeżeli połączenie zostanie poprawnie nawiązane z API OpenAI, aplikacja zwróci trzy przyciski z gotowymi plikami:
- `Wyświetl plik z artykułem` : przekierowanie do pliku `article.html`, wygenerowanego na serwerze autora z tekstem zawierającym tagi html
- `Uruchom podgląd artykułu` : przekierowanie do pliku `podglad.html`, wygenerowanego na serwerze autora ze sformatowanym tekstem z pliku `article.html` na podstawie szablonu
- `Zobacz szablon do artykułu` : przekierowanie do pliku `szablon.html` na serwerze autora z przygotowanym wcześniej szablonem, niezbędnym do wygenerowania podglądu artykułu.

### Błędy
W sytuacji, gdy podczas wysyłania promptów aplikacja nie uzyska połączenia przez API oraz nie zwróci pożądnych informacji, wyświetlony zostanie błąd `401` oznaczający problem w uzyskaniu dostępu do API. Problem ten zazwyczaj wynika z odrzucenia klucza API - w tej sytuacji proszę o kontakt mailowy na adres [michal.suchon[at]icloud.com](mailto:michal.suchon@icloud.com) i zgłoszeniu problemu z kluczem. Domyślnie wykorzystany został klucz firmy Oxido, niemniej wówczas zostanie on zastąpiony przez prywatny klucz autora, który służy wyłącznie do przetestowania funkcjonalności aplikacji.

Błąd `404`: oznacza próbę uzyskania dostępu do zasobów, które nie istnieją lub nie zostały zaimplementowane w aplikacji

Błąd `500`: wewnętrzny błąd serwera

## Sposób działania aplikacji

Działanie aplikacji inicjowane jest w pliku `app.js`: następuje wczytanie odpowiednich dependencji, kontrolera obsługi błędów oraz tras obsługi błędów oraz `main`, za pośrednictwem której działa aplikacja. Domyślnie wykorzystywany port to `3000`, lecz aplikacja może również korzystać z portu `3001`, zadeklarowanego w pliku `.env`. W pliku `app.js` wykorzystywany jest również middleware do zapisu pliku na serwerze przez dependencję `multer`

Aplikacja wykorzystuje wzorzec **`MVC`**

### Folder `controllers`
zawiera zbiór kontrolerów obsługiwanych przez aplikacje
- error.js : obsługa błędów

- main.js : obsługa metod `GET` i `POST` głównych mechanizmów aplikacji:
  - **getIndex** - wyrenderowanie formularza, wczytującego plik .txt
  - **sendPrompt** - wczytanie pliku przesłanego przez formularz, wysłanie promptu do API OpenAI o przetworzenie tekstu z pliku do formatu HTML oraz dodatkowego promptu do przygotowania tekstu z formatu HTML do sformatowanej wersji poglądowej. Jako odpowiedź, zwraca wyrenderowane okno z możliwością wyświetlenia rezultatów lub przekierowanie do strony błędu, jeśli taki wystąpi.

### Folder `public`
Zawiera arkusz stylów strony w formacie `.css` oraz animacje w jQuery do wyświetlenia komunikatów o poprawnym lub niepoprawnym wgraniu pliku tekstowego.

### Folder `routes`
Zbiór wszystkich tras aplikacji. Bazuje ona wyłącznie na stronie głównej (`'/'`) z odpowiednio metodami `GET` do wyświetlenia formularza wgrania pliku oraz wyrenderowania rezultatów, a także `POST` - obsługa prompta do API.

### Folder `uploads`
Zawiera wszystkie pliki możliwe do wyświetlenia przez przeglądarkę.
- `data` : subfolder, w którym zapisuje się plik `txt` wgrany przez formularz
- `response` : subfolder zawierający pliki wynikowe z odpowiedzi prompta do API OpenAI (`article.html` oraz `podglad.html` opisane wyżej)
- plik `szablon.html` opisany powyżej

### Folder `views`
Zbiór plików w formacie `.ejs` (Aplikacja wykorzystuje dependencję EJS) do obsługi widoku aplikacji. 
-  `includes` : zawiera tagi nagłówkowe i stopki plików html oraz ejs. `head.ejs` - sekcja `<head>` ; `footer.ejs` - skrypty JavaScript oraz wyświetlenie stopki strony
- Plik `401.ejs` : widok renderowany w przypadku błędu 401
- Plik `500.ejs` : widok renderowany w przypadku błędu 500
- Plik `404.ejs` : widok renderowany w przypadku błędu 404
- Plik `index.ejs` : strona główna, wyświetlająca formularz oraz wynik promptu do API



