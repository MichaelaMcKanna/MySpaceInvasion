const move_speed = 200
const invaderSpeed = 200
const levelDown = 50
let currentSpeed = invaderSpeed
const timeLeft = 30
const bulletSpeed = 400


layer(['obj', 'ui'], 'obj')

addLevel([
  '!^^^^^^^^^^      &',
  '!^^^^^^^^^^      &',
  '!^^^^^^^^^^      &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
],{
  width: 30,
  height: 22,
  '^' : [sprite('invader'), scale(1.5), 'invader'], 
  '!' : [sprite('wall'), 'left-wall'],
  '&' : [sprite('wall'), 'right-wall'],
})

const player = add([
  sprite('ship'),
  scale(3),
  pos(width() / 2, height() / 2),
  origin('center')
  ])


  keyDown('left', () =>{
    player.move(-move_speed,0)
  })
  keyDown('right', () =>{
    player.move(move_speed, 0)
  })
//a function to spawn a bullet, p is equal to player position. Bullet is the rect size is (6,8) position is player position
  function spawnBullet(p){
    add([rect(6,18), 
    pos(p), 
    origin('center'), 
    color(0.5, 0.5, 1),
    'bullet'
    ])
  }
  keyPress('space', ()=>{
    spawnBullet(player.pos.add(0,-35))
  })

action('bullet', (b)=>{
 b.move(0, -bulletSpeed)
   if(b.pos.y < 0){
    destroy(b)
    }
  })

collides('bullet', 'invader', (b,i) =>{
  camShake(4)
  destroy(b)
  destroy(i)
  score.value++
  score.text = score.value
})

const score = add([
  text('0'),
  pos(50,50),
  layer('ui'),
  scale(3),
  {
    value: 0, 
  }
])


const timer = add([
  text('0'),
  pos(50,25),
  scale(2),
  layer('ui'),
  {
    time: timeLeft,
  },
])
  //action gets called every frame
timer.action(() => {
  //dt is delta time since last frame
  timer.time -= dt()
  timer.text = timer.time.toFixed(2)
  if(timer.time <= 0){
    //go to another scene and take the score value with you
    go('lose', score.value)
  }
})

action('invader', (i)=>{
  i.move(currentSpeed, 0)
})

collides('invader', 'right-wall', () =>{
  currentSpeed = -invaderSpeed
  every('invader', (i) =>{
    i.move(0, levelDown)
  } )
})
collides('invader', 'left-wall', () =>{
  currentSpeed = invaderSpeed
  every('invader', (i) =>{
    i.move(0, levelDown)
  } )
})

//if a player touches an invader then go to the lose screen
player.overlaps('invader', () =>{
  go('lose',{score:score.value})
})

action('invader', (i) => {
  if(i.pos.y >= (12 * 22)){
    go('lose', {score : score.value})
  }
})
//if every 'invader' is destroyed then go to win scene

// action('invader', (i)=>{
//  if(!i.exists()){
//     go('win', {score : score.value})
//  }
// })
every('invader', (i) =>{
  if(!i.exists()){
    go('win', {score : score.value})
 }
})