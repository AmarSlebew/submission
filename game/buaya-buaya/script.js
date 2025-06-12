const tanah = document.querySelectorAll('.tanah');
const buaya = document.querySelectorAll('.buaya');
const poin = document.querySelector('.skor');
const audio = document.querySelector('#audio');

let selesai;
let skor;

function randomTanah(tanahList) {
    const tRandom = Math.floor(Math.random() * tanahList.length);
    return tanahList[tRandom];
}

function randomWaktu(min, max) {
    return Math.round(Math.random() * (max - min) + min); 
}

function munculkan() {
    const tRandom = randomTanah(tanah);
    const wRandom = randomWaktu(300, 1000);
    tRandom.classList.add('muncul');
    
    setTimeout(() => {
        tRandom.classList.remove('muncul');
        if (!selesai) {
            munculkan();     
        }
    }, wRandom);
}

function mulaiPermainan() {
    selesai = false;
    skor = 0;
    poin.textContent = 0;

    munculkan();

    setTimeout(() => {
        selesai = true;
        alert('Waktu habis! Permainan selesai.');
    }, 15000);
}

function pukul() {
    skor++;
    poin.textContent = skor;
    audio.play();
    this.parentNode.classList.remove('muncul');
}

buaya.forEach(b => {
    b.addEventListener('click', pukul);
});
