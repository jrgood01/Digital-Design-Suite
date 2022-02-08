import * as PIXI from 'pixi.js'

export class Util {
    static contains(bounds : PIXI.Bounds, x : number, y : number) {
        let xContains = (x < bounds.maxX && x > bounds.minX)
        let yContains = (y < bounds.maxY && y > bounds.minY)

        return xContains && yContains;
    }
}