const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config()

exports.sendPrompt = async (req, res, next) => {
     try { 
        const toPromptFile =  await !req.file ? null : req.file;

        const fileContent = fs.readFileSync(toPromptFile.path, 'utf8');
        if (!toPromptFile) {
            return res.status(400).send("Brak pliku. Proszę przesłać plik.");
        }

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
          });

        const prompt = `Popraw poniższy tekst i przetwórz do formatu HTML. Wyświetl treść wyłącznie z sekcji body (bez uwzględniania samego tagu body, tylko to co w nim będzie), a w miejscach gdzie potencjalnie mogą znajdować się grafiki wstaw <img src="image_placeholder.jpg>. Do tagu img dodaj także atrybut alt, w którym zaproponuj przykładowy prompt, adekwatny do grafiki, którą można zamieścić. Nie dodawaj na początku "&#96;&#96;&#96; html" oraz na końcu "&#96;&#96;&#96." :\n\n${fileContent}`;
        /* const prompt = `Powiedz, jak minął ci dzień?`; */

        const completion = await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
          });
        

        const htmlContent = completion.choices[0].message.content;
        const outputFilePath = path.join(__dirname, '..', 'uploads', 'response', 'article.html');
        
        const effectsDir = path.dirname(outputFilePath);
        if (!fs.existsSync(effectsDir)) {
            fs.mkdirSync(effectsDir, { recursive: true });
        }
        
        await fs.promises.writeFile(outputFilePath, htmlContent, { encoding: 'utf8' });
        await fs.promises.unlink(toPromptFile.path);

        const templateFile = fs.readFileSync('./uploads/szablon.html', 'utf8');
        if (!templateFile) {
            return res.status(400).send("Nie udało się odnaleźć pliku szablonu");
        }

        const client2 = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
          });

        const prompt2 = `Przeanalizuj plik ${templateFile} a następnie w oparciu o ten plik w sekcji body podmień widoczne tam elementy i umieść: ${htmlContent}. Nie dodawaj żadnych dodatkowych komentarzy, a zawartość analizowanego pliku wrzuć do diva z klasą "main-card". Nie dodawaj na początku "&#96;&#96;&#96; html" oraz na końcu "&#96;&#96;&#96;". Pamiętaj o uwzględnieniu sekcji head`;

        const completion2 = await client2.chat.completions.create({
            messages: [{ role: "user", content: prompt2 }],
            model: "gpt-4o",
           // model: "gpt-3.5-turbo",
          });

          const htmlContent2 = completion2.choices[0].message.content;
          const outputFilePath2 = path.join(__dirname, '..', 'uploads', 'response', 'podglad.html');
          
          const effectsDir2 = path.dirname(outputFilePath2);
          if (!fs.existsSync(effectsDir2)) {
              fs.mkdirSync(effectsDir2, { recursive: true });
          }
          
          await fs.promises.writeFile(outputFilePath2, htmlContent2, { encoding: 'utf8' });


        return res.render('index', {
            pageTitle: 'OpenAI API Text-toArticle-Converter',
            path: '/index',
            content: `
            <h2>Twój plik jest gotowy do pobrania!</h2>
            <a href="/uploads/response/article.html"><button value="1" class="uk-button uk-button-success"><span uk-icon="download"></span>&nbsp;Wyświetl plik z artykułem (article.html)</button> </a>
            <br/><br/>
            <a href="/uploads/response/podglad.html"><button value="1" class="uk-button uk-button-primary"><span uk-icon="search"></span>&nbsp;Uruchom podgląd artykułu (podglad.html)</button> </a>
            <br/><br/>
            <a href="/uploads/szablon.html"><button value="1" class="uk-button uk-button-primary"><span uk-icon="search"></span>&nbsp;Zobacz szablon do artykułu (szablon.html)</button> </a>
            `
        });

    } catch (error) {
      const err = new Error(error);
      err.httpStatusCode = 401;
      console.log(error)
      return res.redirect('/401?errApi=1&data='+error);

    } 
};

exports.getIndex = async(req, res, next) => {

    try {

        res.render('index', {
            pageTitle: 'OpenAI API Text-toArticle-Converter',
            path: '/index',
            content: `
            <h2>Dodaj tekst do przetworzenia</h2>
            <div class="uk-placeholder uk-text-center">
                <span uk-icon="icon: cloud-upload"></span>
                <div uk-form-custom>
                    <form action="/" method="post" enctype="multipart/form-data">
                        <input type="file" name="file" id="fileToAI" accept=".txt" required>
                        <span class="uk-link">Kliknij tutaj, aby wybrać plik</span>
                </div>
            </div>
            
            <progress id="js-progressbar" class="uk-progress" value="0" max="100" hidden></progress> 
            <button type="submit" value="1" class="uk-button uk-button-primary"><span uk-icon="check"></span>&nbsp;Wyślij</button> 
           </form> 
            `,
        });

    }
    catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    }

};