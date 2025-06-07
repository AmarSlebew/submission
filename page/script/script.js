document.addEventListener('DOMContentLoaded', () => {
    let images = document.querySelectorAll('.card')

    let currentIndex = 0
    function imageView(index) {
        images.forEach((image,id) =>{
            image.style.display = 'none'
            const offsetX = (id-index) * 100
            image.style.transform = 'translateX(${offsetX}%)'
        })
        images[currentIndex].style.display='block'
    }

    function handleMove(params) {
        if(params==='left'){
            currentIndex = (currentIndex - 1 + images.length) % images.length
        }else if(params==='right'){
            currentIndex = (currentIndex + 1) % images.length
        }
        imageView(currentIndex)
    }

    document.getElementById('kiri').addEventListener('click',()=>{handleMove
        ('left')
    })
    document.getElementById('kanan').addEventListener('click',()=>{handleMove
        ('right')
    })
    
    setInterval(() => {
        handleMove('right')
    }, 2500)
})


const side = document.querySelector('.nav-container')
const sideNav = document.querySelectorAll('.side-nav')

side.addEventListener('mouseover', () => {  
    sideNav.forEach(sideNav => sideNav.classList.add('mousein'));
})
side.addEventListener('mouseout', () => {
    sideNav.forEach(sideNav => sideNav.classList.remove('mousein'));
})