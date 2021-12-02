let playerAudio = document.querySelector("#player");
console.log(playerAudio);


var volumeControl = document.getElementById('vol-control');

var SetVolume = function() {
    playerAudio.volume = this.value / 100;
    console.log(this.value);
};


// volumeControl.addEventListener('change', SetVolume);
volumeControl.addEventListener('input', SetVolume);