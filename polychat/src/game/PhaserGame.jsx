import PropTypes from 'prop-types';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import '../../src/component/GameMain/GameMainStyle.css';

export const PhaserGame = forwardRef(function PhaserGame({ currentActiveScene }, ref) {
    const game = useRef();

    useLayoutEffect(() => {
        if (!game.current) {
            game.current = StartGame('game-container');

            if (ref !== null) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        };
    }, [ref]);

    useEffect(() => {
        EventBus.on('current-scene-ready', (currentScene) => {
            if (typeof currentActiveScene === 'function') {
                currentActiveScene(currentScene);
            }
            if (ref.current) {
                ref.current.scene = currentScene;
            }
        });

        return () => {
            EventBus.removeListener('current-scene-ready');
        };
    }, [currentActiveScene, ref]);

    return (
        <div id="game-container" />
    );
});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func
};

