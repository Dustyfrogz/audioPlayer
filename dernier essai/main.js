gsap.registerPlugin(Draggable, gsap);
console.clear();
gsap.ticker.lagSmoothing(false);


let dragEnd = 0;
let positionSong = 0;
let arm = document.querySelector("#arm");
let diskCenter = document.querySelector("#centerVinyle");
let isStarted = false;
let timelineTurn = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
let interval;
let player = document.querySelector("#player");
let songTimeEnd = player.duration;
let timeElapsed = player.currentTime;
var volumeControl = document.getElementById('vol-control');
var rate = document.querySelector("#rate");
let timelineTurnCenter = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
//let timelinePlay = gsap.timeline({ repeat: 0, defaults: { ease: "none" } });
let setRated = 1;
/////////////////////////////////
let testinter;
let rotateOnDragEnd;
//let ArmGO = gsap.to("#arm", { rotation: 93, duration: ((songTimeEnd - (songTimeEnd * (gsap.getProperty("#arm", "rotation") - 76) / 17)) / (player.playbackRate)), onComplete: retourzerobras });
let contenus = {};
let ArmGO = TweenMax.to("#arm", { rotation: 70, duration: 2 });

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////      Timeline GSAP du vynile et du centre du disk
timelineTurn
    .to("#disk", {
        duration: 2,
        rotation: 720,
        repeat: -1,
        ease: "none",
        paused: false
    });


timelineTurnCenter.to("#centerVinyle", {
    duration: 2,
    rotation: 720,
    repeat: -1,
    ease: "none",
    paused: false
})

///////////////   Mets en pause les timelines
timelineTurn.pause();
timelineTurnCenter.pause();


/////////////// Controle du volume
volumeControl.addEventListener('input', SetVolume);
var SetVolume = function() {
    player.volume = this.value / 100;
    console.log(this.value);
};

//////////////// controle vitesse de lecture
rate.addEventListener('input', SetRate);


///////////////   Mets en pause les timelines
timelineTurn.pause();
timelineTurnCenter.pause();

////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////Modification du centre de rotation du bras
TweenLite.set('#arm', { transformOrigin: '54px 67px' });

//////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////// Rendre draggable le bras du tourne-disque
const dragable = Draggable.create("#arm", {
    type: "rotation",
    transformOrigin: "50% 50%",
    throwProps: true,
    bounds: { minRotation: 70, maxRotation: 93 },


    ////////////////////////////////à la fin du deplacement
    onDragEnd: function() {
        play();
    },
    ///////////////////////////////au début du déplacement
    onDragStart: function() {
        songTimeEnd = player.duration;
        dragEnd = 0;
        timelineTurn.pause();
        timelineTurnCenter.pause();
        player.pause();
    },

    /////////////////////////////// au click sans déplacement
    onPress: function() {
        dragEnd = 0;
    },

    ////////////////////////////////// au relachement du click sans déplacement
    onRelease: function() {
        play();
    }
})


//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////  faire bouger le bras, faire tourner le disque et lancer le player
function play() {
    if (gsap.getProperty("#arm", "rotation") > 76 && gsap.getProperty("#arm", "rotation") <= 93 && dragEnd == 0) {
        console.log("test");
        songTimeEnd = player.duration;
        timeElapsed = songTimeEnd - (songTimeEnd * (gsap.getProperty("#arm", "rotation") - 76) / 17);
        player.currentTime = songTimeEnd - timeElapsed;
        ////// lancement rotation du disque par timeline
        timelineTurn.play();
        timelineTurnCenter.play();
        //////// lancement du player audio HTML5
        player.play();
        ////////////// Rotation actuelle du bras
        rotateOnDragEnd = gsap.getProperty("#arm", "rotation");
        /////////////  Durée de la musique en minute
        console.log("en minute" + new Date(songTimeEnd * 1000).toISOString().substr(11, 8));

        ///////////////////////////////    Tween qui fait avancer le bras à la fin en fonction de la musique et de la rotation de départ
        ArmGO = TweenMax.to("#arm", { rotation: 93, duration: ((songTimeEnd - (songTimeEnd * ((rotateOnDragEnd - 76) / 17)))), onComplete: retourzerobras });


        ArmGO.resume();
        ArmGO.restart();


        /////////////Place le bouton en mode lecture
        PlayPauseButtonValue.checked = "true";

        testinter = setInterval(testaudio, 2000); ///// donne la rotation du bras

        dragEnd = 1; ////// INTERDIT LE REDRAG ACCIDENTEL
    }
}
// } else if (gsap.getProperty("#arm", "rotation") < 76 && dragEnd == 0) {
//     PlayPauseButtonValue.checked = "true";
// }




/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// Modifier la vitesse de lecture et relancer la lecture à la bonne vitesse
function SetRate() {
    let vitesse = (this.value / 100);
    player.playbackRate = vitesse.toFixed(2);
    timelineTurn.timeScale(player.playbackRate.toFixed(2));
    timelineTurnCenter.timeScale(player.playbackRate.toFixed(2));
    setRated = player.playbackRate.toFixed(2);
    play();

    ArmGO.resume;
    ArmGO.timeScale(player.playbackRate.toFixed(2));
};

///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////  pour console.log la position du bras
function testaudio() {
    console.log("duree :" + gsap.getProperty("#arm", "rotation"));
    let rotate = arm.style.transform;
    rotate = rotate.slice(rotate.indexOf("rotate(") + 7, rotate.indexOf("."))
    if (rotate <= 74) {
        clearInterval(testaudio);
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////Fonction qui arrete le disque de tourner

function StopDiskRotate() {
    timelineTurn.pause();
    timelineTurnCenter.pause();
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// Retour à zero du bras puis arret rotation
function retourzerobras() {
    dragEnd = 0;
    let ArmEnd = gsap.to("#arm", { rotation: 70, duration: 2, onComplete: StopDiskRotate })
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// changement de disque
function diskChange(index) {
    console.log("log de disk change" + index);
    dragEnd = 0;
    let ArmEnd = gsap.to("#arm", { rotation: 70, duration: 2, onComplete: playButton(index) });
    timelineTurn.pause();
    timelineTurnCenter.pause();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// Fonction PAuse Audio
function stopAudio() {
    player.pause();
}


///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////        pour rendre cliquable les disque en haut, arret de la lecture et attribuer la source

let y = 0;


function imageOnTop() {
    let zz = 0;
    //document.querySelector(".diskCenter").src = contenus[2].image;
    document.querySelectorAll(".diskCenter").forEach(element => {
        // document.querySelector('#diskvinylecenter' + i).src = contenus[y].image;
        element.src = contenus[zz].image;
        console.log("test avant le clic" + zz);
        element.setAttribute("data-index", zz);
        element.addEventListener("click", () => {
            console.log("test de clic" + zz);
            let index = element.getAttribute("data-index");
            diskChange(index);
            stopAll();
            //console.log(index);
            player.src = contenus[index].music_src;
            console.log("dans clic" + index);
            console.log(player.src);
        })
        console.log("sans clic" + zz);
        zz++;
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////                   Fonction stop qui arrete tout
function stopAll() {

    ArmGO.pause(); /////// pause du bras

    player.pause(); ///// pause de la balise audio
    player.currentTime = 0; /// remise à zero balise audio
    //PlayPauseButtonValue.checked = "true";
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////fonction bouton Play
let PlayPauseButtonValue = document.querySelector("#playPauseButton");
PlayPauseButtonValue.addEventListener("click", function() {

    if (this.checked == false) {
        playButton();
    } else {
        retourzerobras();
        stopAll();
    }
})

function playButton(index) {
    let ArmPlay = TweenMax.to("#arm", { rotation: 76.01, duration: 3, onComplete: play });
    diskCenter.src = contenus[index].image;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////// tranlation disk

function tranlateUpDisk() {
    let disk1TransUp = gsap
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////          Fetch de la liste de musique

var myInit = {
    method: 'GET',
};

var p = fetch('music.json', myInit)
p.then(async function(response) {
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        }
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json()
                .then(function(contenu) {
                    //console.log(contenu);
                    contenus = contenu;
                    //player.src = contenu[1].music_src;
                    imageOnTop();
                })
        } else {

            console.log("le fichier envoyé n'est pas du json !");
        }


    })
    .catch(function(error) {
        console.log("le srv est inaccessible:");
        // Network Error!
        console.log(error);
    });


////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////    pour rendre cliquable les disque en haut, arret de la lecture et attribuer la source


// let z = 0;
// document.querySelectorAll(".Entiredisk").forEach(function element(item, index) {
//     item.addEventListener("click", lecteur(index));
//     // z++;
//     // if (z == 3) {
//     //     z = 0;
//     // }
//     console.log(index);
// });

// function lecteur1() {
//     diskChange(0);
//     stopAll();

//     //console.log(index);
//     player.src = contenus[0].music_src;
// }

// function lecteur2() {
//     diskChange(1);
//     stopAll();

//     //console.log(index);
//     player.src = contenus[1].music_src;
// }

// function lecteur3() {
//     diskChange(2);
//     stopAll();

//     //console.log(index);
//     player.src = contenus[2].music_src;
// }

// function lecteur4() {
//     diskChange(3);
//     stopAll();

//console.log(index);
// player.src = contenus[3].music_src;
// }

// disk1.addEventListener("click", lecteur1);
// disk2.addEventListener("click", lecteur2);
// disk3.addEventListener("click", lecteur3);
// disk4.addEventListener("click", lecteur4);






/*
 ** SCROLL
 */


// var scrollDistance = document.body.clientHeight / 2;
// var winScrollY;
// const timelineScrolled = gsap.timeline({
//     paused: true,
//     defaults: {
//         ease: 'power2.inOut',
//         duration: 1,
//     },
// });

// timelineScrolled
// .from('.main__content', { opacity: 0, y: 300 })
// .to(".sun", { rotation: 27, x: 100 }, "-=1.5")

// function scrolled() {
//     winScrollY = window.scrollY;
//     timelineScrolled.progress(winScrollY / scrollDistance);
// }
// scrolled();

// window.addEventListener("scroll", scrolled);