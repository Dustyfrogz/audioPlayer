gsap.registerPlugin(Draggable, gsap);
console.clear();

let songTimeEnd = 60;

const draggable = Draggable.create("#knob", {
    type: "rotation",
    bounds: { minRotation: 0, maxRotation: 340 },
    onDrag: function() {
        console.log(this.rotation)
    }
});
// transforme l'origine pour la rotation du bras
TweenLite.set('#arm', { transformOrigin: '54px 67px' });
/////////////////////
// var needle = gsap.timeline({ onStart: console.log, onStartParams: ["start"], onComplete: console.log, onCompleteParams: ["complete"] })

// needle.to("#arm", 3, { x: 200 });
//////////////
//fait bouger le bras
const dragable = Draggable.create("#arm", {
    type: "rotation",
    transformOrigin: "50% 50%",
    throwProps: true,
    bounds: { minRotation: 70, maxRotation: 93 },

    //au deplacement
    onDrag: function() {
        if (this.rotation > 76 && this.rotation < 93) {
            tween.paused(false);
            // } else if (this.rotation == 93) {
            //     tween.paused(true);
            //     let armStop = gsap.to('#arm', {
            //         duration: 2,
            //         // x: 750, 
            //         rotation: 70,
            //     });
        } else {
            tween.paused(true);
        }
    },

    onDragEnd: function() {
        console.log("ondragend" + this.rotation)
        if (this.rotation > 76 && this.rotation < 93) {
            tween.paused(false);
            //needle.play();
            let needle = gsap.to('#arm', {
                //duration: songTimeEnd - (this.rotation / (songTimeEnd / 23)),
                // duration: 10,
                // rotation: 93,
                // onComplete: console.log("merde" + this.rotation),
                keyframes: [{ rotation: 93, duration: songTimeEnd - (this.rotation / (songTimeEnd / 23)) }, { rotation: 70, duration: 2 }],
                // then() {
                //     if (tween.progress == 1) {

                //         armStop.paused(false);
                //     }
                // }
            });

            //tween.paused(true);
            console.log("test" + tween.progress());
            console.log(this.rotation);
        } else if (this.rotation == 93) {
            tween.paused(true);
            let armStop = gsap.to('#arm', {
                duration: 2,
                // x: 750, 
                rotation: 70,
            });
        } else {
            tween.paused(true);
        }
    }
});


let armStop = gsap.to('#arm', {
    duration: 2,
    // x: 750, 
    rotation: 70,
    paused: true
});

// function moveNeedle(rotations) {
//     let i = rotations;
//     console.log(rotations);


//}



//le disque qui tourne
let tween = gsap.to("#disk", {
    duration: 2,
    // x: 750, 
    rotation: 360,
    repeat: -1,
    ease: "none",
    paused: true
});