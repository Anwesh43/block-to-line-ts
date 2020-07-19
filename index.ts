const w : number = window.innerWidth
const h : number = window.innerHeight
const parts : number = 3
const scGap : number = 0.02 / parts
const strokeFactor : number = 90
const sizeFactor : number = 5.6
const colors : Array<String> = ["#2196F3", "#4CAF50", "#f44336", "#FF5722", "#512DA8"]
const backColor : string = "#BDBDBD"
const delay : number = 20

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }

    static sinify(scale : number) : number  {
        return Math.sin(scale * Math.PI)
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawBlockToLine(context : CanvasRenderingContext2D, i : number, scale : number) {
        const sf : number = ScaleUtil.sinify(scale)
        const sf1 : number = ScaleUtil.divideScale(sf, 0, parts)
        const sf2 : number = ScaleUtil.divideScale(sf, 1, parts)
        const sf3 : number = ScaleUtil.divideScale(sf, 2, parts)
        const size : number = Math.min(w, h) / sizeFactor
        context.save()
        context.scale(1 - 2 * i, 1)
        context.save()
        context.translate(-(w  / 2 - size) * sf2, 0)
        context.fillRect(-size * sf1, -size / 2, size * sf1, size)
        context.restore()
        DrawingUtil.drawLine(context, -w / 2, -h * 0.5 * sf3, -w / 2, h * 0.5 * sf3)
        context.restore()
    }

    static drawBTLNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        for (var k = 0; k < 2; k++) {
            context.save()
            context.translate(w / 2, h / 2)
            DrawingUtil.drawBlockToLine(context, k, scale)
            context.restore()
        }
    }
}

class Stage {

    context : CanvasRenderingContext2D
    canvas : HTMLCanvasElement = document.createElement('canvas')

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }
    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += scGap * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb(this.prevScale)
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {

    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
