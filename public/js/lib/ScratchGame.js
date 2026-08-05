//ScratchGame v0.26.8a
//Credits: Mperv, mMeneske

class ScratchGame {

    preload = null;
    create = null;
    update = null;

    constructor(width, height) {
        const self = this;
        const config = {
            type: Phaser.AUTO,
            width: width,
            height: height,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            scene: {
                preload: function () {
                    self.preloader = this;
                    if (self.preload) {
                        self.preload.call(self);
                    }
                },
                create: function () {
                    self.createdGame = this;
                    if (self.create) {
                        self.create.call(self);
                    }
                },
                update: function () {
                    if (self.update) {
                        self.update.call(self);
                    }
                }
            }
        };
        this.game = new Phaser.Game(config);
    }

    loadImage(key, url) {
        this.preloader.load.image(key, url);
    }

    loadSpritesheet(key, url, frame_width, frame_height) {
        this.preloader.load.spritesheet(key, url, { frameWidth: frame_width, frameHeight: frame_height });
    }

    #backgroundImage = null;
    changeBackground(key) {
        const width = this.createdGame.scale.width;
        const height = this.createdGame.scale.height;

        let image = this.createdGame.add.image(width / 2, height / 2, key).setDepth(-100);
        if (this.#backgroundImage) {
            this.#backgroundImage.destroy();
            this.#backgroundImage = null;
        }
        this.#backgroundImage = image;
    }

    setBackgroundColor(color) {
        if (this.#backgroundImage) {
            this.#backgroundImage.destroy();
            this.#backgroundImage = null;
        }
        const width = this.createdGame.scale.width;
        const height = this.createdGame.scale.height;
        this.#backgroundImage = this.createdGame.add.rectangle(0, 0, width, height, color).setOrigin(0).setDepth(-100);
    }

    createSprite(x, y, key) {
        return new ScratchSprite(this, x, y, key);
    }

    createText(x, y, text) {
        return new ScratchText(this, x, y, text);
    }

    #keys = {};

    #getKey(key) {
        if (!this.#keys[key]) {
            this.#keys[key] = this.createdGame.input.keyboard.addKey(key);
        }
        return this.#keys[key];
    }

    isKeyDown(key) {
        return this.#getKey(key).isDown;
    }

    onKeyDown(key, func) {
        this.#getKey(key).on('down', func);
    }

    onKeyUp(key, func) {
        this.#getKey(key).on('up', func);
    }

    isMouseDown() {
        return this.createdGame.input.activePointer.isDown;
    }

    get mouseX() {
        return this.createdGame.input.activePointer.x;
    }

    get mouseY() {
        return this.createdGame.input.activePointer.y;
    }

    onMouseDown(func) {
        this.createdGame.input.on('pointerdown', func);
    }

    onMouseUp(func) {
        this.createdGame.input.on('pointerup', func);
    }

    getTime() {
        return this.createdGame.time.now;
    }
}

class ScratchSprite {
    #scratchGame;
    #createdGame;
    #sprite;
    #key;

    constructor(game, x, y, key) {
        this.#scratchGame = game;
        this.#createdGame = game.createdGame;
        this.#sprite = game.createdGame.physics.add.sprite(x, y, key);
        this.#key = key;
    }

    get key(){
        return this.#key;
    }

    get x() {
        return this.#sprite.x;
    }

    set x(value) {
        this.#sprite.x = value;
    }

    get y() {
        return this.#sprite.y;
    }

    set y(value) {
        this.#sprite.y = value;
    }

    get direction() {
        return this.#sprite.angle;
    }

    set direction(value) {
        this.#sprite.angle = value;
    }

    get size() {
        return this.#sprite.scale;
    }

    set size(value) {
        this.#sprite.scale = value;
    }

    moveForward(steps) {
        this.#sprite.x += steps * Math.cos(this.#sprite.angle * Math.PI / 180);
        this.#sprite.y += steps * Math.sin(this.#sprite.angle * Math.PI / 180);
    }

    turn(degrees) {
        this.#sprite.angle += degrees;
    }

    turnTo(x, y) {
        this.#sprite.angle = Math.atan2(y - this.#sprite.y, x - this.#sprite.x) * 180 / Math.PI;
    }

    get visible() {
        return this.#sprite.visible;
    }

    set visible(value) {
        this.#sprite.visible = value;
    }

    changeVisibility() {
        this.#sprite.visible = !this.#sprite.visible;
    }

    get costume() {
        return Number(this.#sprite.frame.name);
    }

    set costume(value) {
        this.#sprite.setFrame(value);
    }

    get costumesCount() {
        return this.#sprite.texture.frameTotal - 1;
    }

    nextCostume() {
        let nextCostume = Number(this.#sprite.frame.name) + 1;
        if (nextCostume >= this.costumesCount) {
            nextCostume = 0;
        }
        this.#sprite.setFrame(nextCostume);
    }

    changeCostumeBy(value) {
        let nextCostume = Number(this.#sprite.frame.name) + value;
        if (nextCostume >= this.costumesCount) {
            nextCostume = nextCostume % this.costumesCount;
        }
        if (nextCostume < 0) {
            nextCostume = (this.costumesCount - (Math.abs(nextCostume) % this.costumesCount)) % this.costumesCount;
        }
        if (!Number.isInteger(nextCostume)) {
            nextCostume = Number(this.#sprite.frame.name);
        }
        this.#sprite.setFrame(nextCostume);
    }

    destroy() {
        this.#sprite.destroy();
    }

    onRectangularOverlap(sprite2, func) {
        this.#createdGame.physics.add.overlap(this.#sprite, sprite2.#sprite, func, null, this);
    }

    onOverlap(sprite2, func, precision = 2) {
        this.#createdGame.physics.add.overlap(this.#sprite, sprite2.#sprite, func, (obj1, obj2) => this.#checkPixelPerfect(obj1, obj2, precision), this);
    }

    #checkPixelPerfect(obj1, obj2, precision) {
        const bounds1 = obj1.getBounds();
        const bounds2 = obj2.getBounds();

        const intersection = Phaser.Geom.Rectangle.Intersection(bounds1, bounds2);

        if (intersection.isEmpty()) {
            return false;
        }

        let pixelAlpha1, pixelAlpha2;
        let cos1 = Math.cos(-obj1.rotation);
        let sin1 = Math.sin(-obj1.rotation);
        let cos2 = Math.cos(-obj2.rotation);
        let sin2 = Math.sin(-obj2.rotation);

        for (let y = intersection.y; y < intersection.bottom; y += precision) {
            for (let x = intersection.x; x < intersection.right; x += precision) {
                pixelAlpha1 = this.#getPixelAlpha(obj1, x, y, sin1, cos1);
                if (pixelAlpha1 <= 200) {
                    continue;
                }

                pixelAlpha2 = this.#getPixelAlpha(obj2, x, y, sin2, cos2);
                if (pixelAlpha2 > 200) {
                    return true;
                }
            }
        }
        return false;
    }

    #getPixelAlpha(obj, x, y, sin, cos) {
        // Transform world coordinates to local coordinates taking rotation into account
        const dx = x - obj.x;
        const dy = y - obj.y;

        const rx = dx * cos - dy * sin;
        const ry = dx * sin + dy * cos;

        let localX = Math.floor(rx / obj.scaleX + obj.displayOriginX);
        let localY = Math.floor(ry / obj.scaleY + obj.displayOriginY);

        if (obj.flipX) {
            localX = obj.frame.width - 1 - localX;
        }
        if (obj.flipY) {
            localY = obj.frame.height - 1 - localY;
        }

        if (localX < 0 || localX >= obj.frame.width || localY < 0 || localY >= obj.frame.height) {
            return 0;
        }

        const pixel = this.#scratchGame.createdGame.textures.getPixelAlpha(localX, localY, obj.texture.key, obj.frame.name);

        return (pixel === null) ? 0 : pixel;
    }
}

class ScratchText {
    #scratchGame;
    #createdGame;
    #text;
    constructor(game, x, y, text) {
        this.#scratchGame = game;
        this.#createdGame = game.createdGame;
        this.#text = game.createdGame.add.text(x, y, text);
    }

    get x() {
        return this.#text.x;
    }

    set x(value) {
        this.#text.x = value;
    }

    get y() {
        return this.#text.y;
    }

    set y(value) {
        this.#text.y = value;
    }

    get visible() {
        return this.#text.visible;
    }

    set visible(value) {
        this.#text.visible = value;
    }

    changeVisibility() {
        this.#text.visible = !this.#text.visible;
    }

    destroy() {
        this.#text.destroy();
    }

    get size() {
        return this.#text.fontSize;
    }

    set size(value) {
        this.#text.setFontSize(value);
    }

    get color() {
        return this.#text.color;
    }

    set color(value) {
        this.#text.setColor(value);
    }

    get font() {
        return this.#text.font;
    }

    set font(value) {
        this.#text.setFont(value);
    }

    get text() {
        return this.#text.text;
    }

    set text(value) {
        this.#text.text = value;
    }
}
