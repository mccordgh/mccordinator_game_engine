import { SpriteSheet } from './sprite-sheet';
import { ImageLoader } from "./image-loader";

import gameConstants from '../../constants/game-constants';

const path = `${gameConstants.BASE_PATH}src/resources`;
const assets = {};

export class Assets {
    constructor (name, path) {
        assets[name] = this;
        this.name = name;
        this.path = path;
        // this.height = gameConstants.SPRITE_HEIGHT
        // this.width = gameConstants.SPRITE_WIDTH;
        this.sheet = new SpriteSheet(ImageLoader.loadImage(this.path));
    }

    static getAssets(name) {
        return assets[name];
    }
}

/* CURSOR */
const cursor = new Assets('cursor', `${path}/cursor.png`);
cursor.pointer = cursor.sheet.crop(0, 0, 28, 32);

/* MONSTERS */
const skeleton = new Assets('skeleton', `${path}/single_skeleton.png`);
skeleton.skeleton = skeleton.sheet.crop(0, 0, 32, 64);

/* HEROES */
const walnut = new Assets('walnut', `${path}/walnut_dude.png`);
walnut.walnut = walnut.sheet.crop(0, 0, 32, 64);

/* HOUSE */
const house = new Assets('house', `${path}/single_house.png`);
house.house = house.sheet.crop(0, 0, 100, 368);