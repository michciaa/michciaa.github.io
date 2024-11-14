var loader = document.getElementById("preloader");
window.addEventListener("load", function () {
loader.style.display = "none";
}); 

$(document).ready(() => {

    $('#showInfo').hide();
    $('#fileToAI').on('change', function() {
        
        const fileInput = this.files[0];

        if(!fileInput)
        {
            return;
        }

        const fileName = fileInput.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();

        if(fileInput.length != 0 && fileExtension == 'txt')
        {
            $('#showInfo').addClass('uk-animation-fade').show().delay(5000).fadeOut();
            $('#showInfo').html(`
                <div class="uk-alert-success" uk-alert>
                <a href class="uk-alert-close" uk-close></a>
                <p>Plik został prawidłowo wczytany</p>
                </div>
            `);
        }
        else if(fileExtension != 'txt')
        {
            $('#showInfo').addClass('uk-animation-fade').show().delay(5000).fadeOut();
            $('#showInfo').html(`
                <div class="uk-alert-danger" uk-alert>
                <a href class="uk-alert-close" uk-close></a>
                <p>Wystąpił błąd podczas wczytywania pliku. Dodano niewłaściwy rodzaj pliku!</p>
                </div>
            `);
            $(this).val('');
        }
    });
});