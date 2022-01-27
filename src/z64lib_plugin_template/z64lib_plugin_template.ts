import { IPlugin, IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import { onTick, Preinit, Init, Postinit, onPostTick, onViUpdate } from "modloader64_api/PluginLifecycle";
import { InjectCore } from 'modloader64_api/CoreInjection';
import { IZ64Main } from 'Z64Lib/API/Common/IZ64Main'
import { Z64_GAME } from 'Z64Lib/src/Common/types/GameAliases';
import { Z64LibSupportedGames } from 'Z64Lib/API/Utilities/Z64LibSupportedGames';

class z64lib_plugin_template implements IPlugin {
    ModLoader!: IModLoaderAPI;
    pluginName?: string | undefined;
    @InjectCore()
    core!: IZ64Main; //Object for Z64 game data
    game!: Z64LibSupportedGames; //Loaded Game
    isOoT: boolean = false; //Game Flags
    isOoTDebug: boolean = false;
    isMM: boolean = false;

    private Init_OOT() { //Setup for OoT specific data
        this.isOoT = true;
    }

    private Init_OOTDEBUG() { //Setup for OoT specific data
        this.isOoTDebug = true;
    }

    private Init_MM() { //Setup for MM specific data
        this.isMM = true;
    }

    @Preinit() // Runs once immediately before the emulator is initialized
    preinit(): void {
        switch (Z64_GAME) { //Decide what mod data to initialize based on loaded Z64 Game
            case Z64LibSupportedGames.OCARINA_OF_TIME:
                this.Init_OOT();
                break;
            case Z64LibSupportedGames.DEBUG_OF_TIME:
                this.Init_OOTDEBUG();
                break;
            case Z64LibSupportedGames.MAJORAS_MASK:
                this.Init_MM();
                break;
        }
    }

    @Init() // Runs once immediately when the emulator is initializing
    init(): void {
    }

    @Postinit() // Runs once immediately after emulator is initialized
    postinit(): void {
    }

    @onTick() // Runs every in-game frame after postinit()
    onTick(): void {
        if (this.isOoT) {
            this.OOT(); //Runs OoT's function every frame
        }
        else if (this.isOoTDebug) {
            this.OOTDEBUG() // Runs OoTDebug's function every frame
        }
        else if (this.isMM) {
            this.MM(); //Runs MM's function every frame
        }
    }

    @onPostTick() // Runs after every in-game frame (after onTick)
    onPostTick() { }

    @onViUpdate() // Runs every vertical interupt update
    onViUpdate() {
    }

    private OOT() {
    }

    private OOTDEBUG() {
    }

    private MM() {
    }
}
module.exports = z64lib_plugin_template;