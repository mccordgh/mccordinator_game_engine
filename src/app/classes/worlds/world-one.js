
import { GameConstants } from '../../constants/game-constants';
import { SpatialGrid } from '../entities/collision/spatial-grid';
import {Assets} from "../assets/assets";
import { ComputerScreen } from '../entities/static-entities/computer-screen/computer-screen';
import { Dialogue } from '../dialogue/dialogue';
import { EasterEggGame } from '../entities/static-entities/easter-eggs/easter-egg-game';
import { TheCore } from '../entities/static-entities/easter-eggs/the-core';
import { MeMyselfAndI } from '../entities/static-entities/easter-eggs/me-myself-and-i';
import { TheCodersGame } from '../entities/static-entities/easter-eggs/the-coder';
import { Radio } from '../entities/static-entities/radio/radio';

let counter = 0;

export class WorldOne {
    constructor(handler) {
        this.handler = handler;
        this.entityManager = handler.createEntityManager();
        // this.monsterManager = handler.createMonsterManager();
        // this.heroManager = handler.createHeroManager();
        // this.seedManager = handler.createSeedManager();
        // this.uiManager = handler.createUiManager();
        this.assets = {
            background: Assets.getAssets('background').image,
        };

        this.spatialGrid = new SpatialGrid(
            GameConstants.GAME_WIDTH,
            GameConstants.GAME_HEIGHT,
            GameConstants.SPATIAL_GRID_SIZE,
        );

        this.states = {
            INITIALIZE: 'initialize',
            INTRO: 'intro',
            IDLE: 'idle',
            TEST: 'test',
            TEST_INIT: 'test-init',
            GAME_WON: 'game-won',
        };

        // this.state = this.states.IDLE;
        this.state = this.states.INITIALIZE;
        // this.state = this.states.TEST_INIT;
    }

    initDialogue() {
        this.dialogue = this.entityManager.addEntity(
            new Dialogue(
                this.handler,
                [
                    // 'Hey, newbie! Looks like the manager',
                    // 'is out sick today...',
                    // 'I bet you can figure this one out',
                    // 'on your own though...',
                    // 'Check your email!'
                ],
            ),
        );
    }

    gameWon() {
        this.dialogue = this.entityManager.addEntity(
            new Dialogue(
                this.handler,
                [
                    'Yo, newbie! You did it!',
                    'Looks like John Smith is alive!',
                    'Great Job!',
                    'Also we need you in on Saturday...',
                ],
            ),
        );

        this.state = this.states.GAME_WON;
    }

    dialogueFinished() {
        switch (this.state) {
            case this.states.INITIALIZE:
                break;

            case this.states.INTRO:
                this.state = this.states.IDLE;
                break;


            case this.states.IDLE:
                this.spatialGrid.render(graphics);
                this.entityManager.render(graphics);
                break;

            case this.states.GAME_WON:
                console.log('game won dialogue finished');
                break;

            default:
                throw new Error(`World One animation state "${this.state} is not accounted for`)
        }
    }

    loadEntities() {
        const entities = [
            new ComputerScreen(this.handler, 256, 136),
            new Radio(this.handler, 52, 62),
        ];

        entities.forEach(entity => {
            this.entityManager.addEntity(entity);
        });
    }

    tick(deltaTime) {
        switch (this.state) {
            case this.states.TEST_INIT:
                this.entityManager.addEntity(new MeMyselfAndI(this.handler));
                this.state = this.states.IDLE;
                break;

            case this.states.TEST:
                break;


            case this.states.INITIALIZE:
                this.initDialogue();

                this.state = this.states.INTRO;
                break;

            case this.states.GAME_WON:
            case this.states.INTRO:
                if (this.dialogue) {
                    this.dialogue.tick();
                }
                break;


            case this.states.IDLE:
                break;

            default:
                throw new Error(`World One animation state "${this.state} is not accounted for`)
        }

        this.entityManager.tick(deltaTime);
    }

    render(graphics) {
        this.drawBackground(graphics);

        switch (this.state) {
            case this.states.TEST_INIT:
            case this.states.INITIALIZE:
                break;

            case this.states.GAME_WON:
            case this.states.INTRO:
                if (this.dialogue) {
                    this.dialogue.render(graphics);
                }
                break;


            case this.states.TEST:
            case this.states.IDLE:
                break;

            default:
                throw new Error(`World One state "${this.state} is not accounted for`)
        }

        // this.spatialGrid.render(graphics);
        this.entityManager.render(graphics);
    }

    init() {
        this.loadEntities();
    }

    drawBackground(graphics) {
        const bg = this.assets.background;

        graphics.drawSprite(bg)
    }


    getSpatialGrid() {
        return this.spatialGrid;
    }
}