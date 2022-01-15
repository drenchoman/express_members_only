let home = document.querySelector('.home')

function returnHome(){
      home.addEventListener("click", function(){
        window.location = '/'
      });
};

returnHome();
