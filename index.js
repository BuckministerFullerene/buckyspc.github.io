// @ts-check

const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')
// all the methods associated with canvas for a 2d game
const c = canvas.getContext('2d')

// gets the full width from the window.innerWidth
// canvas now takes full width of the screen
// canvas.width = innerWidth
// canvas.height = innerHeight
canvas.width = 1024
canvas.height = 576

// defining a player
class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0
    }

    this.rotation = 0
    this.opacity = 1

    // Image() object comes from the javascript API
    const image = new Image()
    image.src = './img/spaceship.png'
    // call the image when it is loaded else end up with blank screen
    image.onload = () => {
      const scale = 0.15
      this.image = image
      // to take effect needs to be integrated into drawImage()
      this.width = image.width * scale
      this.height = image.height * scale
      // positioning player on the 2d space
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20
      }
    }
  }

  draw() {
    // method from canvas
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    c.save()
    c.globalAlpha = this.opacity
    // moves canvas to center of player
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    )

    c.rotate(this.rotation)
    // now move the canvas back
    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    )

    // only call c.drawImage if this.image exists
    // if (this.image)
    // snapshot of canvas
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width, this.height
    )
    c.restore()
  }

  update() {
    if (this.image) {
      this.draw()
      this.position.x += this.velocity.x
    }
  }
}

class Projectile {
  // position will be passed dynamically so pass as a contructor argument
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity

    this.radius = 4
  }
  // how a projectile will look like
  draw() {
    c.beginPath()
    c.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    )
    c.fillStyle = 'red'
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Particle {
  // position will be passed dynamically so pass as a contructor argument
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position
    this.velocity = velocity

    this.radius = radius
    this.color = color
    this.opacity = 1
    this.fades = fades
  }
  // how a projectile will look like
  draw() {
    // c.save is global
    c.save()
    // fades out everything that comes after it over time
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    )
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.fades) this.opacity -= 0.01
  }
}

class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity

    // this.radius = 4
    this.width = 3
    this.height = 10
  }
  draw() {
    c.fillStyle = 'white'
    c.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0
    }
    // no rotation
    // this.rotation = 0

    const image = new Image()
    image.src = './img/invader.png'
    image.onload = () => {
      const scale = 1
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  draw() {
    // method from canvas
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width, this.height
    )
    // c.restore()
  }

  update({ velocity }) {
    if (this.image) {
      this.draw()
      this.position.x += velocity.x
      this.position.y += velocity.y
    }
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        // invaders bottom side and right in the middle
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height
        },
        velocity: {
          x: 0,
          y: 5
        }
      })
    )
  }
}

// create a grid class for multiple invaders
class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }

    this.velocity = {
      x: 5,
      y: 0
    }

    this.invaders = []

    const columns = Math.floor(Math.random() * 10 + 5)
    const rows = Math.floor(Math.random() * 5 + 2)
    // defining width of aliens grid
    this.width = columns * 30
    // create rows and columns of invaders
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 30,
              y: y * 30
            }
          })
        )
      }
    }
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    // reset everytime to 0 before executing the y statement
    this.velocity.y = 0

    // to stop it moving past right side of the screen
    if (this.position.x + this.width >= canvas.width || this.
      position.x <= 0) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 30
    }
  }
}

// creating a player
const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
// const invader = new Invader()
// earlier player.draw() is called after the image is supposed to load
// animate solves the problem
// player.draw()
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  space: {
    pressed: false
  }
}

let frame = 0
let randomInterval = Math.floor((Math.random() * 500) + 500)
let game = {
  over: false,
  active: true
}

let score = 0;

// stars
for (let i = 0; i < 100; i++) {
  particles.push(new Particle({
    position: {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    },
    velocity: {
      x: 0,
      y: 0.5
    },
    radius: Math.random() * 2,
    color: 'white',
    fades: false
  })
  )
}

function createParticles({ object, color, fades }) {
  // for multiple particle explosion
  for (let i = 0; i < 15; i++) {
    // single particle explosion
    particles.push(new Particle({
      position: {
        x: object.position.x + object.width / 2,
        y: object.position.y + object.height / 2
      },
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      },
      radius: Math.random() * 3,
      // #BAA0DE to match alien color
      color: color || 'green',
      fades
    })
    )
  }
}

// to load image over and over
function animate() {
  if (!game.active) return
  // referenced from window.
  requestAnimationFrame(animate)
  // although black by default, takes care of any bugs for fillStyle
  c.fillStyle = 'black'
  // starting x and y position is at 0
  c.fillRect(0, 0, canvas.width, canvas.height)
  // invader.update()
  // calls draw() too
  player.update()
  particles.forEach((particle, i) => {
    // respawning star particles above the canvas frame
    if (particle.position.y - particle.radius >= canvas. height) {
      particle.position.x = Math.random() * canvas.width
      particle.position.y = -particle.radius
    }
    // particles spliced after opacity reaches 0
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1)
      }, 0)
    } else {
      particle.update()
    }
  })
  invaderProjectiles.forEach((invaderProjectile, index) => {
    // garbage collection for projectiles that go off screen
    if (invaderProjectile.position.y +
      invaderProjectile.height >= canvas.height) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1)
      }, 0)
    } else {
      invaderProjectile.update()
    }
    // collision of projectile with player
    if (
      invaderProjectile.position.y + invaderProjectile.height
      >=
      player.position.y &&
      invaderProjectile.position.x + invaderProjectile.width
      >=
      player.position.x &&
      invaderProjectile.position.x <= player.position.x +
      player.width
    ) {
      // takeout player and projectile, create explosion
      setTimeout(() => {
        invaderProjectiles.splice(index, 1)
        player.opacity = 0
        // so player cannot shoot after fading
        game.over = true
      }, 0)

      setTimeout(() => {
        game.active = false
      }, 2000)

      // console.log('You Lose')
      createParticles({
        object: player,
        color: 'white',
        fades: true
      })
    }
  })

  // console.log(invaderProjectiles)

  projectiles.forEach((projectile, index) => {

    if (projectile.position.y + projectile.radius <= 0) {
      // to prevent flash bugs, delay the splice after one frame
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    } else {
      projectile.update()
    }
  })

  grids.forEach((grid, gridIndex) => {
    grid.update()

    // spawning projectiles from random enemies
    if (frame % 50 === 0 && grid.invaders.length > 0) {
      // call a random invader
      grid.invaders[Math.floor(Math.random() *
        grid.invaders.length)].shoot(invaderProjectiles)
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity })

      // when projectile and invader collide
      projectiles.forEach((projectile, j) => {
        if (projectile.position.y - projectile.radius <=
          invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >=
          invader.position.x && projectile.position.x -
          projectile.radius <= invader.position.x +
          invader.width && projectile.position.y +
          projectile.radius >= invader.position.y
        ) {

          setTimeout(() => {
            // make sure projectile or invader exists in the first place
            const invaderFound = grid.invaders.find(invader2 => {
              return invader2 === invader
            })
            // same as invaderFound code but without return
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            )

            if (invaderFound && projectileFound) {

              score += 100;
              scoreEl.innerHTML = ('' + score);

              createParticles({
                object: invader,
                color: 'green',
                fades: true
              })
              // splice out the projectile and the invader
              grid.invaders.splice(i, 1)
              projectiles.splice(j, 1)

              // change the grid boundaries after invaders destroyed on grid ends
              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0]
                // last element within the array
                const lastInvader = grid.invaders[grid.invaders.length - 1]

                // updated grid width
                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width
                grid.position.x = firstInvader.position.x
              } else {
                // garbage collection
                grids.splice(gridIndex, 1)
              }
            }
          }, 0)
        }
      })
    })
  })

  const speed = 7

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -speed
    player.rotation = -0.15
  } else if (keys.d.pressed && player.position.x +
    player.width <= canvas.width) {
    player.velocity.x = speed
    player.rotation = 0.15
  } else {
    player.velocity.x = 0
    player.rotation = 0
  }

  // spawning enemies
  if (frame % randomInterval === 0) {
    grids.push(new Grid())
    randomInterval = Math.floor((Math.random() * 500) + 500)
    frame = 0
  }

  frame++
}

animate()

// property of window.
// destructuring event.key with curly braces
addEventListener('keydown', ({ key }) => {
  // add a condition so the player cannot be controlled
  if (game.over) return

  switch (key) {
    case 'a':
      // console.log('left')
      // player.velocity.x = -5
      keys.a.pressed = true
      break
    case 'd':
      // console.log('right')
      keys.d.pressed = true
      break
    case ' ':
      // console.log('space')
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y
          },
          velocity: {
            x: 0,
            y: -10
          }
        })
      )
      // console.log(projectiles)
      keys.space.pressed = true
      break
  }
})

addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'a':
      // console.log('leftup')
      // player.velocity.x = -5
      keys.a.pressed = false
      break
    case 'd':
      // console.log('rightup')
      keys.d.pressed = false
      break
    case ' ':
      // console.log('spaceup')
      keys.space.pressed = false
      break
  }
})