//sprites
import platform from '../img/platform.png'
import background from '../img/background.png'


import spriteStandRight from '../img/spriteStandRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'


import spriteRunRight from '../img/spriteRunRight.png'
import spriteRunLeft from '../img/spriteRunLeft.png'


import spriteJumpRight from '../img/spriteJumpRight.png'
import spriteJumpLeft from '../img/spriteJumpLeft.png'


//Tela
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')


canvas.width = 1024
canvas.height = 576


const gravity = 1.5

//class de Objetos
class Player {

    constructor() {
        this.speedX = 50
        this.speedY = -24
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 160
        this.height = 160
        this.image = creatImage(spriteStandRight)
        this.frame = 0
        this.sprite = {
            stand: {
                right: creatImage(spriteStandRight),
                left: creatImage(spriteStandLeft),
                cropWidth: 80,
                range: 99
            },
            run: {
                right: creatImage(spriteRunRight),
                left: creatImage(spriteRunLeft),
                cropWidth: 80,
                range: 79
            },
            jump: {
                right: creatImage(spriteJumpRight),
                left: creatImage(spriteJumpLeft),
                cropWidth: 80,
                range: 34
            }
        }

        this.currentSprite = this.sprite.stand.right
        this.currentCropWidth = 80
        this.doubleJump;

    }


    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frame,
            0,
            80,
            80,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        this.frame++
        if (this.frame > this.sprite.stand.range && (this.currentSprite === this.sprite.stand.right || this.currentSprite === this.sprite.stand.left)) {
            this.frame = 0
        }
        else if (this.frame > this.sprite.run.range && (this.currentSprite === this.sprite.run.right || this.currentSprite === this.sprite.run.left)) {
            this.frame = 0
        }
        else if (this.frame > this.sprite.jump.range && (this.currentSprite === this.sprite.jump.right || this.currentSprite === this.sprite.jump.left)) {
            this.frame = 0
        }
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity
        }
    }
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}


//função que cria imagens
function creatImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}
//criando imagens
let platformImage = creatImage(platform)


let backgroundImage = creatImage(background)

//criando player
let player = new Player()


//criando plataformas
const numPlatforms = 21;
let initialX = -1;
let platforms = [];

for (let i = 0; i < numPlatforms; i++) {
    platforms.push(new Platform({
        x: initialX + i * (platformImage.width - 3),
        y: 452,
        image: platformImage
    }));
}


//criando o objeto
let genericObject = [
    new GenericObject({
        x: 0,
        y: 0,
        image: backgroundImage
    })
]


let lastKey
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    jump: {
        pressed: false
    }
}
let scrollOffSet = 0

let lifePoint = 5

//função que recomeça o jogo
function init() {
    lifePoint -= 1
    player = new Player()

    platformImage = creatImage(platform)

    const numPlatforms = 21;
    let initialX = -1;
    let platforms = [];

    for (let i = 0; i < numPlatforms; i++) {
        platforms.push(new Platform({
            x: initialX + i * (platformImage.width - 3),
            y: 452,
            image: platformImage
        }));
    }

    backgroundImage = creatImage(background)

    genericObject = [
        new GenericObject({
            x: 0,
            y: 0,
            image: backgroundImage
        })
    ]

    scrollOffSet = 0
}

//animação
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObject.forEach((genericObject) => {
        genericObject.draw()
    })

    platforms.forEach((platform) => {
        platform.draw()
    })
    player.update()
    if (keys.right.pressed && player.position.x < 600) {
        player.velocity.x = player.speedX;
    }


    else if ((keys.left.pressed && player.position.x > 100) || keys.left.pressed && scrollOffSet == 0 && player.position.x > 0) {
        player.velocity.x = -player.speedX

    }

    else if ((keys.right.pressed && player.position.x < 600) || keys.right.pressed && scrollOffSet == 10200 && player.position.x < 10200) {
        player.velocity.x = 0

    }


    else {
        player.velocity.x = 0


        if (keys.right.pressed) {
            scrollOffSet += player.speedX
            platforms.forEach(platform => {
                platform.position.x -= player.speedX
            })
            genericObject.forEach((genericObject) => {
                genericObject.position.x -= player.speedX * 0.40
            })
        } else if (keys.left.pressed && scrollOffSet > 0) {
            scrollOffSet -= player.speedX
            platforms.forEach(platform => {
                platform.position.x += player.speedX
            })
            genericObject.forEach((genericObject) => {
                genericObject.position.x += player.speedX * 0.40
            })

        }

    }


    //verificar colisão
    platforms.forEach((platform) => {
        const inFloor = player.position.y + player.height <= platform.position.y && player.position.y
            + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width

        if (inFloor) {
            player.velocity.y = 0
        }
    })

    //movimentos das sprites

    if (keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprite.run.right) {
        player.frames = 1
        player.currentSprite = player.sprite.run.right
        player.range = player.sprite.run.range
        player.currentSprite = player.sprite.run.right
    }

    else if (keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprite.run.left) {
        player.currentSprite = player.sprite.run.left
        player.currentCropWidth = player.sprite.run.cropWidth
        player.range = player.sprite.run.range
    }


    else if (!keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprite.stand.right) {
        player.currentSprite = player.sprite.stand.right
        player.currentCropWidth = player.sprite.stand.cropWidth

    }
    else if (!keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprite.stand.left) {
        player.currentSprite = player.sprite.stand.left
        player.currentCropWidth = player.sprite.stand.cropWidth
        player.range = player.sprite.stand.range
    }




    //condição ganhou
    if (scrollOffSet > 10000) {
        console.log("you win!")
    }

    //condição perdeu
    if (player.position.y > canvas.height) {
        init()
        console.log(lifePoint)
        if (lifePoint == 0) {
            player.speedX = 0
        }
    }
}



animate()
var jumpCont = 1
//verificar tecla
addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            lastKey = 'left'
            break
        case 83:
            console.log('down')
            break
        case 68:
            console.log('right')
            keys.right.pressed = true
            lastKey = 'right'
            break
        case 87:
            console.log('up')
            lastKey = 'jump'
            player.velocity.y += player.speedY
            console.log(player.position.y)
            break
    }
})


addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = false
            lastKey = 'left'
            break
        case 83:
            console.log('down')
            break
        case 68:
            console.log('right')
            keys.right.pressed = false
            lastKey = 'right'

            break
        case 87:
            console.log('up')
            player.velocity.y = 0
            lastKey = 'jump'
            break


    }
})



