//Ball
class Ball {
    x
    y
    radius
    dx
    dy

    constructor(x, y) {
        this.x = x
        this.y = y
        this.radius =
        this.dx = 3
        this.dy = 3
    }

    draw(ctx) {
        ctx.fillStyle = "rgba(176, 5, 228, 1)"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }

    animate() {
        this.x = this.x + this.dx
        this.y = this.y + this.dy

        if ((this.x > (480 - this.radius)) || (this.x < (0 + this.radius))) {
            this.dx = 0
            this.dy = 0
        }

        if ((this.y > (360 - this.radius)) || (this.y < (0 + this.radius))) {
            this.dy = -this.dy
        }
    }
}

// Paddles
class Paddle {
    x
    y
    dx
    dy
    width
    height

    //initialize the paddle location and 
    constructor(x, y) {
        this.x = x
        this.y = y
        this.dx = 0
        this.dy = 0
        this.width = 5
        this.height = 50
    }

    draw(ctx) {
        ctx.fillStyle = "rgba(255, 255, 255, 1)"
        ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height)
    }

    animate() {
        this.x = this.x + this.dx
        this.y = this.y + this.dy

    }
}

const INTRO = 0
const PLAYING = 1
const SCORE1 = 2
const SCORE2 = 3
const GAMEOVER = 4
const MAXSCORE = 5
const PLAYER1 = 1
const PLAYER2 = 2

class Pong {

    //game function
    constructor() {

        this.P1s = 0
        this.P2s = 0

        //get and clear canvas
        const canvas = document.getElementById("pong")
        this.ctx = canvas.getContext("2d")

        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.font = "48px serif"

        document.addEventListener("keydown", this.pong_keydown.bind(this))
        document.addEventListener("keyup", this.pong_keyup.bind(this))

        //create paddles and ball
        this.leftpaddle = new Paddle(20, 180)
        this.rightpaddle = new Paddle(460, 180)
        this.ball = new Ball(Math.floor(Math.random() * 201))

        this.frame()
        this.end_round()
        this.new_round()

        this.gamestate = INTRO
    }



    frame() {
        //Canvas
        this.ctx.fillStyle = "rgb(0, 0, 0)"
        this.ctx.fillRect(0, 0, 480, 360)

        //Draw the Sprites
        this.leftpaddle.draw(this.ctx)
        this.rightpaddle.draw(this.ctx)
        this.ball.draw(this.ctx)

        this.ctx.fillText(`${this.P1s}`, 150, 40)
        this.ctx.fillText(`${this.P2s}`, 330, 40)

        if (this.gamestate == INTRO) {
            this.ctx.fillText(`Press Space To Begin`, 240, 200)
        } else if (this.gamestate == PLAYING) {
            //Animation
            this.leftpaddle.animate()
            this.rightpaddle.animate()
            this.ball.animate()

            //ball hitting paddle
            if (circle_rect_sdf(this.ball, this.leftpaddle) <= 0) {
                this.ball.dx *= -1.15
            }
            if (circle_rect_sdf(this.ball, this.rightpaddle) <= 0) {
                this.ball.dx *= -1.15
            }

            //check for edge and score
            if (this.ball.x <= (0 + this.ball.radius)) {

                this.end_round(PLAYER2)
            }

            if (this.ball.x >= (480 - this.ball.radius)) {
                this.end_round(PLAYER1)
            }
        } else if (this.gamestate == GAMEOVER) {

        }
        if (this.P1s == MAXSCORE) {
            this.ctx.fillText(`PLAYER 1 WINS`, 240, 200)
        }else if (this.P2s == MAXSCORE) {
            this.ctx.fillText(`PLAYER 2 WINS`, 240, 200)
        }

        //next frame
        window.requestAnimationFrame(this.frame.bind(this))
    }

    end_round(player) {

        if (player == PLAYER1) {
            this.P1s = this.P1s + 1
            this.new_round()
        }

        if (player == PLAYER2) {
            this.P2s = this.P2s + 1
            this.new_round()
        }

        if (this.P1s == MAXSCORE) {
            this.gamestate = GAMEOVER
        }else if (this.P2s == MAXSCORE) {
            this.gamestate = GAMEOVER
        }
    }

    new_round() {
        this.ball.x = 240
        this.ball.y = Math.floor(Math.random() * 330)
        this.ball.dx = (Math.random() < 0.5 ? -2 : 2)
        this.ball.dy = 3

        this.gamestate = PLAYING

    }

    new_game() {
        this.new_round()
        this.P1s = 0
        this.P2s = 0
        this.gamestate = INTRO
    }

    pong_keydown(event) {
        if (this.gamestate == PLAYING) {

            if (event.key == "ArrowDown") {
                this.rightpaddle.dy = 5
            }
            if (event.key == "ArrowUp") {
                this.rightpaddle.dy = -5
            }
            if (event.key == "s") {
                this.leftpaddle.dy = 5
            }
            if (event.key == "w") {
                this.leftpaddle.dy = -5
            }
        } else if (this.gamestate == INTRO) {
            if (event.key == " ") {
                this.new_round()
            }
        } else if (this.gamestate == GAMEOVER) {
            if (event.key == " ") {
                this.new_game()
            }
        }
    }

    pong_keyup(event) {
        if (this.gamestate == PLAYING) {

            if (event.key == "ArrowDown") {
                this.rightpaddle.dy = 0
            }
            if (event.key == "ArrowUp") {
                this.rightpaddle.dy = 0
            }
            if (event.key == "s") {
                this.leftpaddle.dy = 0
            }
            if (event.key == "w") {
                this.leftpaddle.dy = 0
            }
        }
    }
}

function circle_rect_sdf(circle, rect) {
    vec_x = circle.x - rect.x
    vec_y = circle.y - rect.y
    dist_to_rect_x = Math.abs(vec_x) - (rect.width / 2)
    dist_to_rect_y = Math.abs(vec_y) - (rect.height / 2)
    nearest_rect_dist = Math.max(dist_to_rect_x, dist_to_rect_y)
    signed_distance = nearest_rect_dist - circle.radius
    return signed_distance
}

var pongGame

function pong() {
    pongGame = new Pong()
}