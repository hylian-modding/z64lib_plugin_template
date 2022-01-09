import { IPlugin, IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import { onTick, Preinit, Init, Postinit, onPostTick, onViUpdate } from "modloader64_api/PluginLifecycle";
import { InjectCore } from 'modloader64_api/CoreInjection';
import { IZ64Main } from 'Z64Lib/API/Common/IZ64Main'
import { Z64_GAME } from 'Z64Lib/src/Common/types/GameAliases';
import { Z64LibSupportedGames } from 'Z64Lib/API/Utilities/Z64LibSupportedGames';
import { AgeOrForm } from 'Z64Lib/API/Common/Z64API';
import { string_ref } from 'modloader64_api/Sylvain/ImGui';

class z64lib_plugin_template_example implements IPlugin {
    ModLoader!: IModLoaderAPI;
    pluginName?: string | undefined;
    @InjectCore()
    core!: IZ64Main; //Object for Z64 game data
    game!: Z64LibSupportedGames; //Loaded Game
    isOoT: Boolean = false; //Game Flags
    isMM: Boolean = false;
    seconds: number = 10; //For calculating scene timer update
    rupeeInput: string_ref = [""]; //ImGui variable for rupee input
    counter: number = 0; //Counter for timer display
    isTriggered: boolean = false; //Flag to help prevent timed code from misfiring

    private Init_OOT() { //Setup for OoT specific data
        this.isOoT = true;
    }

    private Init_MM() { //Setup for MM specific data
        this.isMM = true;
    }

    @Preinit() // Runs once immediately before the emulator is initialized
    preinit(): void { }

    @Init() // Runs once immediately when the emulator is initializing
    init(): void {
        this.game = Z64_GAME;
    }

    @Postinit() // Runs once immediately after emulator is initialized
    postinit(): void {
        console.log(`Game loaded: ${this.game}.`);
        switch (this.game) { //Decide what mod data to initialize based on loaded Z64 Game
            case Z64LibSupportedGames.OCARINA_OF_TIME:
                this.Init_OOT();
                break;
            case Z64LibSupportedGames.MAJORAS_MASK:
                this.Init_MM();
                break;
        }
    }

    @onTick() // Runs every in-game frame after postinit()
    onTick(): void {
        if (this.isOoT) {
            this.OOT(); //Runs OoT's function every frame
        }
        else if (this.isMM) {
            this.MM(); //Runs MM's function every frame
        }
    }

    private OOT() {
        if (this.core.OOT!.helper.isPaused()) console.log("Game is paused!"); //Example use of helper to decide when to run code under specific conditions
    }

    private MM() {
        if (this.core.MM!.helper.isTitleScreen() || !this.core.MM!.helper.isInterfaceShown()) return; //Example use of helper to decide when to run code under specific conditions
            if (this.core.MM!.global.scene_framecount % (20 * this.seconds) === 0 && !this.isTriggered) { //Example of code running every X amount of seconds you're in a scene (10 seconds) 
                this.counter = (this.core.MM!.global.scene_framecount / 20) // Amount of seconds elapsed so far
                this.isTriggered = true;
                console.log(`Been in scene ${this.core.MM!.global.scene} for ${this.counter} seconds!`);
            }
            else this.isTriggered = false;
    }

    @onPostTick() // Runs after every in-game frame (after onTick)
    onPostTick() { }

    @onViUpdate() // Runs every vertical interupt update
    onViUpdate() {
        if (this.ModLoader.ImGui.beginMainMenuBar()) { //Basic ImGui example of reading data to a menu
            if (this.ModLoader.ImGui.beginMenu("Mods")) { //Make menu tree
                if (this.ModLoader.ImGui.beginMenu("Z64Lib_Plugin_Template")) {
                    if (this.ModLoader.ImGui.beginMenu("Rupee Modifier")) {
                        this.ModLoader.ImGui.inputText("Edit Rupees", this.rupeeInput);
                        if (this.isOoT) this.ModLoader.ImGui.text(`Rupee count: ${this.core.OOT!.save.rupee_count}`); //Display of current rupee count
                        else if (this.isMM) this.ModLoader.ImGui.text(`Rupee count: ${this.core.MM!.save.rupees}`);
                        if (this.ModLoader.ImGui.button("Update")) { //Button to update the rupee count
                            if (this.isOoT) this.core.OOT!.save.rupee_count = parseInt(this.rupeeInput[0], 10); //Contents of the input box being written to the game
                            else if (this.isMM) this.core.MM!.save.rupees = parseInt(this.rupeeInput[0], 10);
                        }
                        this.ModLoader.ImGui.endMenu();
                    }
                    this.ModLoader.ImGui.endMenu();
                }
                this.ModLoader.ImGui.endMenu();
            }
            this.ModLoader.ImGui.endMainMenuBar();
        }
    }
}
module.exports = z64lib_plugin_template_example;